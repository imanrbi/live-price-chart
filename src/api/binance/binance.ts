import { binanceApi } from "@/api";
import { ENDPOINTS } from "@/api/endpoints";
import type { KLinesParams, KLinesResponse } from "@/api/types";

export const getBinanceKLines = async (params: KLinesParams): Promise<KLinesResponse> => {
  const response = await binanceApi.get<KLinesResponse>(ENDPOINTS.BINANCE.K_LINES, { params });
  return response.data;
};
