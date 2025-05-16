import anime from "animejs";
import { curveBasis, line, type ScaleLinear } from "d3";
import type { Dispatch, RefObject, SetStateAction } from "react";

type AnimateChartSegmentProps = {
  isAnimatingRef: RefObject<boolean>;
  pathRef: RefObject<SVGPathElement | null>;
  dotRef: RefObject<SVGGElement | null>;
  pathLength: number;
  animatedSegment: string;
  setFullPath: Dispatch<SetStateAction<string>>;
  setAnimatedSegment: Dispatch<SetStateAction<string | null>>;
};

export const animateChartSegment = ({
  isAnimatingRef,
  pathRef,
  pathLength,
  animatedSegment,
  setFullPath,
  setAnimatedSegment,
  dotRef,
}: AnimateChartSegmentProps) => {
  isAnimatingRef.current = true;
  anime({
    targets: pathRef.current,
    strokeDashoffset: [pathLength, 0],
    duration: 500,
    easing: "linear",
    complete: () => {
      if (animatedSegment) {
        setFullPath((prev) => {
          const joined = `${prev}${animatedSegment.replace(/^M/, "L")}`;
          return joined;
        });
        setAnimatedSegment(null);
      }
      isAnimatingRef.current = false;
    },
  });
  if (pathRef.current && dotRef.current) {
    const path = pathRef.current;
    const length = path.getTotalLength();
    anime({
      targets: { t: 0 },
      t: length,
      duration: 500,
      easing: "linear",
      update: (anim) => {
        const point = path.getPointAtLength(Number(anim.animations[0].currentValue));
        dotRef.current!.setAttribute("transform", `translate(${point.x.toString()},${point.y.toString()})`);
      },
    });
  }
};

export const lineBuilder = (
  data: number[],
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
  section: "initialized" | "animated",
  length: number,
) => {
  const path = line<number>()
    .x((_, i) => xScale(section == "initialized" ? i : length + i - 2))
    .y((d) => yScale(d))
    .curve(curveBasis)(data);
  return path ?? "M0,0";
};

type AnimateYDomainProps = {
  from: [number, number];
  to: [number, number];
  onUpdate: (newValue: [number, number]) => void;
};

export const animateYDomain = ({ from, to, onUpdate }: AnimateYDomainProps) => {
  const animated = { min: from[0], max: from[1] };
  anime({
    targets: animated,
    min: to[0],
    max: to[1],
    duration: 500,
    easing: "linear",
    update: () => onUpdate([animated.min, animated.max]),
  });
};
