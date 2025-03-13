import React, { useState, useEffect } from 'react';
import { Play, Pause, Maximize } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface Video {
  id: number;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string;
  category: string | null;
}

interface VideoData {
  session_id: string;
  recording_start_at: number;
  recording_finish_at: number;
  sku_id: string;
  sku_name: string;
  sku_category: string;
  sku_brand: string;
  meta_user_id: string;
  visualization_flag: boolean;
  visualization_period: number;
  pickup_timestamp: string | null;
  pickup_period: number | null;
  take_away_flag: boolean;
  putback_flag: boolean;
  impression_flag: boolean;
  video_id: number;
}

const VideoWithThumbnail = ({ 
    video, 
    isSelected, 
    onClick 
  }: { 
    video: Video, 
    isSelected: boolean,
    onClick: () => void 
  }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const videoContainerRef = React.useRef<HTMLDivElement>(null);
    
    // Generate thumbnail from first frame
    const generateThumbnail = () => {
      if (!videoRef.current) return;
      
      const video = videoRef.current;
      
      // Create canvas and capture first frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg');
        setThumbnailUrl(thumbnailDataUrl);
      }
    };

    // Custom play/pause functionality
    const [isPlaying, setIsPlaying] = useState(false);
    
    const togglePlayPause = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering the onClick of the parent div
      
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };
    
    // Custom fullscreen functionality
    const toggleFullScreen = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering the onClick of the parent div
      
      if (!videoContainerRef.current) return;
      
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          videoContainerRef.current.requestFullscreen();
        }
      } catch (error) {
        console.error('Fullscreen error:', error);
      }
    };
    
    return (
      <div
        className={`
          aspect-video w-80 flex-shrink-0 rounded-lg flex flex-col overflow-hidden cursor-pointer
          transition-all duration-200 hover:opacity-90 hover:shadow-lg
          ${isSelected ? 'ring-4 ring-blue-500' : ''}
        `}
        onClick={onClick}
      >
        {isSelected ? (
          <div ref={videoContainerRef} className="relative w-full h-full">
            <video 
              ref={videoRef}
              src={video.video_url} 
              muted
              playsInline
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
              className="w-full h-full object-contain"
              onLoadedData={generateThumbnail}
              onEnded={() => setIsPlaying(false)}
            />
            {/* Custom controls overlay */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 flex justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="text-white p-2 rounded hover:bg-gray-700 focus:outline-none"
                onClick={togglePlayPause}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button 
                className="text-white p-2 rounded hover:bg-gray-700 focus:outline-none"
                onClick={toggleFullScreen}
                aria-label="Fullscreen"
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="w-full h-full relative"
            style={{ 
              backgroundColor: '#5f6fff'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center flex-col text-center">
              <div className="flex flex-col items-center text-center text-white">
                <span className="font-medium">{video.title}</span>
                <span className="font-medium">{video.category}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

const VideoAnalysis = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoData, setVideoData] = useState<VideoData[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  
  // Fetch videos from Supabase
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          setVideos(data);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  // Fetch video data when a video is selected
  useEffect(() => {
    if (!selectedVideo) return;
    
    const fetchVideoData = async () => {
      setDataLoading(true);
      try {
        // Replace 'video_analysis' with your actual table name
        const { data, error } = await supabase
          .from('video_analysis')
          .select('*')
          .eq('video_id', selectedVideo);
        
        if (error) throw error;
        
        if (data) {
          setVideoData(data);
        }
      } catch (error) {
        console.error('Error fetching video data:', error);
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchVideoData();
  }, [selectedVideo]);

  return (
    <div className="p-8 overflow-hidden">
        <h1 className="text-2xl font-bold mb-6">Video Analysis</h1>
        
        {/* Video selection section - now with proper containment */}
        <div className="mb-8">
        <h2 className="text-xl mb-4">Video Datasets</h2>
        
        {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-4 pr-4 relative" 
                style={{ clipPath: 'inset(0)' }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="aspect-video w-80 flex-shrink-0 rounded-lg" />
            ))}
            </div>
        ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 pr-4 relative" 
                style={{ clipPath: 'inset(0)' }}>
            {videos.map(video => (
                <VideoWithThumbnail
                key={video.id}
                video={video}
                isSelected={selectedVideo === video.id}
                onClick={() => setSelectedVideo(video.id)}
                />
            ))}
            </div>
        )}
      </div>
      
      {/* Data table section */}
      {selectedVideo && (
        <div>
          <h2 className="text-xl mb-4">
            {videos.find(v => v.id === selectedVideo)?.title} - Structured Data
          </h2>
          
          <div className="overflow-x-auto">
            {dataLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <Table>
                <TableCaption>
                  Analysis data for the selected video
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session ID</TableHead>
                    <TableHead>SKU Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Recording Started</TableHead>
                    <TableHead>Recording Ended</TableHead>
                    <TableHead>Visualization</TableHead>
                    <TableHead>Pickup</TableHead>
                    <TableHead>Take Away</TableHead>
                    <TableHead>Put Back</TableHead>
                    <TableHead>Impression</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videoData.length > 0 ? (
                    videoData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.session_id}</TableCell>
                        <TableCell>{row.sku_name}</TableCell>
                        <TableCell>{row.sku_category}</TableCell>
                        <TableCell>{row.sku_brand}</TableCell>
                        <TableCell>{new Date(row.recording_start_at * 1000).toLocaleString()}</TableCell>
                        <TableCell>{new Date(row.recording_finish_at * 1000).toLocaleString()}</TableCell>
                        <TableCell>{row.visualization_flag ? `Yes (${row.visualization_period}s)` : 'No'}</TableCell>
                        <TableCell>
                          {row.pickup_timestamp ? `Yes (${row.pickup_period}s)` : 'No'}
                        </TableCell>
                        <TableCell>{row.take_away_flag ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{row.putback_flag ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{row.impression_flag ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-4">
                        No data available for this video
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAnalysis;