import {
  axisLeft,
  axisTop,
  scaleLinear,
  scaleTime,
  select,
  timeFormat,
  timeSecond,
  type ScaleLinear,
  type ScaleTime,
} from "d3";
import { useMemo, type RefObject } from "react";

type UseScalesProps = {
  svgWidth: number;
  svgHeight: number;
  yDomain: [number, number] | null;
  xDomain: [number, number] | null;
};

export const useScales = ({ svgWidth, svgHeight, yDomain, xDomain }: UseScalesProps) => {
  const xScale = useMemo(() => {
    const [min, max] = xDomain || [0, 0];
    return scaleTime()
      .domain([new Date(min), new Date(max)])
      .range([0, svgWidth]);
  }, [xDomain, svgWidth]);

  const yScale = useMemo(() => {
    const [min, max] = yDomain || [0, 0];
    return scaleLinear().domain([min, max]).range([svgHeight, 0]);
  }, [yDomain, svgHeight]);

  return { xScale, yScale };
};

type UseYAxisProps = {
  yScale: ScaleLinear<number, number>;
  svgWidth: number;
  yAxisRef: RefObject<SVGGElement | null>;
};

export const useYAxis = ({ yScale, svgWidth, yAxisRef }: UseYAxisProps) => {
  if (yAxisRef.current) {
    const axisGroup = select(yAxisRef.current);
    const yAxis = axisLeft(yScale)
      .tickSize(-svgWidth)
      .tickPadding(-svgWidth + 12);
    axisGroup.call(yAxis);
  }
};

type UseXAxisProps = {
  xScale: ScaleTime<number, number>;
  svgHeight: number;
  xAxisRef: RefObject<SVGGElement | null>;
};

export const useXAxis = ({ xScale, svgHeight, xAxisRef }: UseXAxisProps) => {
  if (xAxisRef.current) {
    const axisGroup = select(xAxisRef.current);
    const formatTime = timeFormat("%H:%M:%S");
    const xAxis = axisTop(xScale)
      .tickSize(-svgHeight)
      .tickPadding(-svgHeight + 8)
      .ticks(timeSecond.every(30))
      .tickFormat((d) => formatTime(new Date(+d)));

    axisGroup.call(xAxis);
  }
};
