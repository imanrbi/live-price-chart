import { forwardRef } from "react";

type ChartLineProps = {
  fullPath: string;
};

export const ChartLine = forwardRef<SVGPathElement, ChartLineProps>(({ fullPath }, ref) => {
  return <path d={fullPath} ref={ref} className="stroke-blue-600 stroke-0.5 fill-none" />;
});
