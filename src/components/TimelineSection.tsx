import { Skeleton } from "@/components/ui/skeleton";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
import TimeChart from "./TimeChart";

export const TIMELINE_SECTIONS = [
    {
      id: 'product-interaction',
      title: 'Product Interaction Timeline',
      dataKey: 'pickUpTimeline',
      tooltip: 'This graph shows when customers interact with products by picking them up. Higher peaks indicate more customer engagement.'
    },
    {
      id: 'product-impressions',
      title: 'Product Impressions Timeline',
      dataKey: 'impressionsTimeline',
      tooltip: 'Tracks the number of times products were viewed by customers. Helps understand product visibility and customer interest.'
    },
    {
      id: 'product-visualization',
      title: 'Product Visualization Timeline',
      dataKey: 'visualizationsTimeline',
      tooltip: 'Displays when customers viewed detailed product information. Shows engagement with product details.'
    },
    {
      id: 'product-takeaway',
      title: 'Product Take Away Timeline',
      dataKey: 'takeAwayTimeline',
      tooltip: 'Records when products are taken by customers. Indicates potential purchase intent or strong interest.'
    },
    {
      id: 'product-putback',
      title: 'Product Put Back Timeline',
      dataKey: 'putBackTimeline',
      tooltip: 'Shows when products are returned to their display location. Helps understand product rejection patterns.'
    }
  ] as const;
  
  export default function TimelineSection({ 
    title, 
    data, 
    timeRange, 
    isLoading,
    value,
    tooltip 
  }: { 
    title: string;
    data: any[];
    timeRange: { start: string; end: string };
    isLoading: boolean;
    value: string;
    tooltip: string;
  }) {
    if (isLoading) {
      return <Skeleton className="h-[64px]" />;
    }
  
    return (
      <AccordionItem value={value}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AccordionTrigger className="text-lg font-medium font-nikkei hover:bg-white/50 px-4 py-2 rounded-lg">
                {title}
              </AccordionTrigger>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <AccordionContent>
          <div className="pt-2">
            <TimeChart 
              data={data} 
              timeRange={timeRange} 
              intervalMinutes={5}
              title={title}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };