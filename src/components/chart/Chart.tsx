import { useEffect, useMemo, useRef, useState, type SVGProps } from "react";
import { ChartCard } from "./ChartCard";
import { ChartDot } from "./ChartDot";
import { ChartLine } from "./ChartLine";
import { ChartLoading } from "./ChartLoading";
import { ChartYAxis } from "./ChartYAxis";
import { useScales, useYAxis } from "./hooks";
import type { Margin } from "./types";
import { animateChartSegment, animateYDomain, lineBuilder } from "./utils";

interface LineChartProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  margin?: Margin;
  isLoading?: boolean;
  data: number[];
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
  const isAnimatingRef = useRef(false);
  const firstDataLengthRef = useRef<number | null>(null);

  const svgWidth = width - margin.left - margin.right;
  const svgHeight = height - margin.top - margin.bottom;

  const [pathLength, setPathLength] = useState(0);
  const [fullPath, setFullPath] = useState("");
  const [animatedSegment, setAnimatedSegment] = useState<string | null>(null);
  const [yDomain, setYDomain] = useState<[number, number] | null>(null);
  const { yScale, xScale } = useScales({ svgWidth, svgHeight, yDomain });
  useYAxis({ yScale, svgWidth, yAxisRef });

  useEffect(() => {
    if (animatedSegment && animatedSegment !== "" && pathRef.current) {
      animateChartSegment({
        animatedSegment,
        dotRef,
        isAnimatingRef,
        pathLength,
        pathRef,
        setAnimatedSegment,
        setFullPath,
      });
    }
  }, [animatedSegment, pathLength]);

  useEffect(() => {
    if (data.length < 2) return;

    if (firstDataLengthRef.current === null) {
      firstDataLengthRef.current = data.length;
    }

    const newMax = Math.max(...data) * 1.0005;
    const newMin = Math.min(...data) * 0.9995;

    if (yDomain === null) {
      setYDomain([newMin, newMax]);
    } else if (newMin !== yDomain[0] || newMax !== yDomain[1]) {
      animateYDomain({ from: yDomain, to: [newMin, newMax], onUpdate: setYDomain });
    }

    if (isAnimatingRef.current || !yDomain) return;

    const newFullPath = lineBuilder(data.slice(0, -1), xScale, yScale, "initialized", data.length);

    const lastTwo = data.slice(-2);
    const segment = lastTwo.length === 2 ? lineBuilder(lastTwo, xScale, yScale, "animated", data.length) : null;

    setFullPath(newFullPath);
    setAnimatedSegment(segment);
  }, [data]);

  useEffect(() => {
    if (animatedSegment && pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [animatedSegment]);

  const pathTransform = useMemo(() => {
    const offset = xScale(data.length - (firstDataLengthRef.current ?? 0));
    return `translate(${Math.floor(margin.left - offset)},${margin.top})`;
  }, [data, margin, xScale]);

  const lastPoint = useMemo(() => {
    if (!data.length) return { value: 0, transform: `translate(${svgWidth},0)` };
    return {
      value: data[data.length - 1],
      transform: `translate(${svgWidth - 64}, ${yScale(data[data.length - 1]) - 12})`,
    };
  }, [data, svgWidth, yScale]);

  return (
    <>
      <ChartLoading isLoading={!fullPath || isLoading} />
      <svg {...props} viewBox={`0 0 ${width} ${height}`}>
        <ChartYAxis ref={yAxisRef} margin={margin} />
        <g transform={pathTransform} className="transition-transform ease-linear duration-1000">
          <ChartLine ref={pathRef} animatedSegment={animatedSegment} fullPath={fullPath} pathLength={pathLength} />
          <ChartDot ref={dotRef} />
        </g>
        <ChartCard transform={lastPoint.transform} className="transition-transform duration-1000">
          {lastPoint.value}
        </ChartCard>
      </svg>
    </>
  );
}
