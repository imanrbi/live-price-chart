import anime from "animejs";
import { curveBasis, interpolate, line, type ScaleLinear, type ScaleTime } from "d3";
import type { RefObject } from "react";
import type { DataPoint } from "./types";

type AnimateDotProps = {
  pathRef: RefObject<SVGPathElement | null>;
  dotRef: RefObject<SVGGElement | null>;
};

export const animateDot = ({ pathRef, dotRef }: AnimateDotProps) => {
  if (pathRef.current && dotRef.current) {
    const path = pathRef.current;
    const length = path.getTotalLength();
    anime({
      targets: { t: 0 },
      t: length,
      duration: 3000,
      easing: "linear",
      update: () => {
        const point = path.getPointAtLength(path.getTotalLength());
        dotRef.current!.setAttribute("transform", `translate(${point.x.toString()},${point.y.toString()})`);
      },
    });
  }
};

type AnimateLineProps = {
  fullPath: string;
  newFullPath: string;
  setFullPath: (newPath: string) => void;
};

export const animateLine = ({ fullPath, newFullPath, setFullPath }: AnimateLineProps) => {
  const interpolator = interpolate(fullPath, newFullPath);
  const target = { t: 0 };
  anime({
    targets: target,
    t: 1,
    duration: 3000,
    easing: "linear",
    update: () => {
      setFullPath(interpolator(target.t));
    },
  });
};

export const lineBuilder = (
  data: DataPoint[],
  xScale: ScaleTime<number, number>,
  yScale: ScaleLinear<number, number>,
) => {
  const path = line<DataPoint>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(curveBasis)(data);
  return path ?? "M0,0";
};

type AnimateDomainProps = {
  from: [number, number];
  to: [number, number];
  onUpdate: (newValue: [number, number]) => void;
};

export const animateDomain = ({ from, to, onUpdate }: AnimateDomainProps) => {
  const animated = { min: from[0], max: from[1] };
  anime({
    targets: animated,
    min: to[0],
    max: to[1],
    duration: 1000,
    easing: "linear",
    update: () => onUpdate([animated.min, animated.max]),
  });
};
