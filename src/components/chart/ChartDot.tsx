import { forwardRef } from "react";

export const ChartDot = forwardRef<SVGGElement>(({}, ref) => {
  return (
    <g ref={ref} transform={"translate(-10,-10)"}>
      <circle r={3} className="fill-gray-200 animate-ping" />
      <circle r={2} className="fill-gray-200" />
    </g>
  );
});
