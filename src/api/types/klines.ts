export type KLinesParams = {
  symbol: string;
  limit?: number;
  interval?: "1m" | "1s";
};

export type KLinesResponse = string[][];
