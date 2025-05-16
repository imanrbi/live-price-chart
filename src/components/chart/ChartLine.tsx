import { forwardRef } from "react";

type ChartLineProps = {
  fullPath: string;
  animatedSegment: string | null;
  pathLength: number;
};

export const ChartLine = forwardRef<SVGPathElement, ChartLineProps>(
  ({ fullPath, animatedSegment, pathLength }, ref) => {
    return (
      <>
        <path d={fullPath} className="stroke-blue-600 stroke-1 fill-none" />
        {animatedSegment && (
          <path
            d={animatedSegment}
            className="stroke-blue-600 stroke-1 fill-none"
            ref={ref}
            style={{
              strokeDasharray: pathLength || 1,
              strokeDashoffset: pathLength || 1,
            }}
          />
        )}
      </>
    );
  },
);
