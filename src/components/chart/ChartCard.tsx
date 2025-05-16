import type { SVGProps } from "react";

interface ChartCardProps extends SVGProps<SVGGElement> {}

export const ChartCard = ({ children, ...props }: ChartCardProps) => {
  return (
    <g {...props}>
      <rect x={0} y={0} width={56} height={24} rx={8} className="fill-blue-800" />
      <text x={28} y={12} className="font-bold text-[8px] fill-white" textAnchor="middle" dominantBaseline="middle">
        {children}
      </text>
    </g>
  );
};
