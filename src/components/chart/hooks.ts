import { axisLeft, scaleLinear, select, type ScaleLinear } from "d3";
import { useMemo, type RefObject } from "react";

type UseScalesProps = {
  svgWidth: number;
  svgHeight: number;
  yDomain: [number, number] | null;
};

export const useScales = ({ svgWidth, svgHeight, yDomain }: UseScalesProps) => {
  const xScale = useMemo(() => scaleLinear().domain([0, 200]).range([0, svgWidth]), [svgWidth]);
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
