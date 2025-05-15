import axios from "axios";

export const binanceApi = axios.create({
  baseURL: import.meta.env.VITE_BINANCE_API_URL || "https://api.binance.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});
