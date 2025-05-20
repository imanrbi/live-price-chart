import { useEffect, useMemo, useRef, useState, type SVGProps } from "react";
import { ChartCard } from "./ChartCard";
import { ChartDot } from "./ChartDot";
import { ChartLine } from "./ChartLine";
import { ChartLoading } from "./ChartLoading";
import { ChartXAxis } from "./ChartXAxis";
import { ChartYAxis } from "./ChartYAxis";
import { useScales, useXAxis, useYAxis } from "./hooks";
import type { DataPoint, Margin } from "./types";
import { animateDomain, animateDot, animateLine, lineBuilder } from "./utils";

interface LineChartProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  margin?: Margin;
  isLoading?: boolean;
  data: DataPoint[];
}

export default function Chart({
  width = 600,
  height = 300,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  data,
  isLoading = false,
  ...props
}: LineChartProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);
  const xAxisRef = useRef<SVGGElement>(null);

  const svgWidth = width - margin.left - margin.right;
  const svgHeight = height - margin.top - margin.bottom;

  const [fullPath, setFullPath] = useState<string>("");
  const [yDomain, setYDomain] = useState<[number, number] | null>(null);
  const [xDomain, setXDomain] = useState<[number, number] | null>(null);

  const { yScale, xScale } = useScales({ svgWidth, svgHeight, yDomain, xDomain });
  useYAxis({ yScale, svgWidth, yAxisRef });
  useXAxis({ xScale, svgHeight, xAxisRef });

  useEffect(() => {
    if (data.length < 2) return;

    const newYMin = Math.min(...data.map((d) => d.y)) * 0.9995;
    const newYMax = Math.max(...data.map((d) => d.y)) * 1.0005;

    if (yDomain === null) {
      setYDomain([newYMin, newYMax]);
    } else if (newYMin !== yDomain[0] || newYMax !== yDomain[1]) {
      animateDomain({ from: yDomain, to: [newYMin, newYMax], onUpdate: setYDomain });
    }

    const now = Date.now();
    const newXMin = now - 50_000;
    const newXMax = now + 30_000;

    if (xDomain === null) {
      setXDomain([newXMin, newXMax]);
    } else {
      animateDomain({ from: xDomain, to: [newXMin, newXMax], onUpdate: setXDomain });
    }

    if (!yDomain || !xDomain) return;

    const newFullPath = lineBuilder(data, xScale, yScale);

    if (fullPath === "") {
      setFullPath(newFullPath);
    } else {
      animateLine({ fullPath, newFullPath, setFullPath });
    }

    animateDot({
      pathRef,
      dotRef,
    });
  }, [data]);

  const lastPoint = useMemo(() => {
    if (!data.length) return { value: 0, transform: `translate(${svgWidth - 64},${Math.floor(svgHeight / 2)})` };
    return {
      value: data[data.length - 1].y,
      transform: `translate(${svgWidth - 64}, ${yScale(data[data.length - 1].y) - 12})`,
    };
  }, [data, svgWidth, yScale]);

  return (
    <>
      <ChartLoading isLoading={!fullPath || isLoading} />
      <svg {...props} viewBox={`0 0 ${width} ${height}`}>
        <ChartYAxis ref={yAxisRef} margin={margin} />
        <ChartXAxis ref={xAxisRef} margin={margin} />
        <ChartLine ref={pathRef} fullPath={fullPath} />
        <ChartDot ref={dotRef} />
        <ChartCard transform={lastPoint.transform} className="transition-transform ease-linear duration-[3s]">
          {lastPoint.value}
        </ChartCard>
      </svg>
    </>
  );
}
