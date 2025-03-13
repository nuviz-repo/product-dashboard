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
      id: 'product-impressions',
      title: 'Product Impressions Timeline (# of times)',
      dataKey: 'impressionsTimeline',
      tooltip: 'Tracks the number of times products were viewed by customers. Helps understand product visibility on the shop floor.'
    },
    {
      id: 'product-visualization',
      title: 'Average Visualization Duration (in seconds)',
      dataKey: 'visualizationsTimeline',
      tooltip: 'The average time a customer visualizes a product before picking it up, calculated by dividing the total visualization duration by the number of people viewed the product.'
    },
    {
      id: 'product-interaction',
      title: 'Average Pick-Up Duration (in seconds)',
      dataKey: 'pickUpTimeline',
      tooltip: 'The average time a customer holds a product after picking it up, calculated by dividing the total holding duration by the number of pick-ups.'
    },
    {
      id: 'product-takeaway',
      title: 'Product Take-Away Timeline (# of times)',
      dataKey: 'takeAwayTimeline',
      tooltip: 'Records # of times products are taken by customers. Indicates potential purchase intent attached to the place where data was collected.'
    },
    {
      id: 'product-putback',
      title: 'Product Put-Back (# of times)',
      dataKey: 'putBackTimeline',
      tooltip: 'Records # of times products are returned to their display location. Helps understand product rejection patterns.'
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
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };