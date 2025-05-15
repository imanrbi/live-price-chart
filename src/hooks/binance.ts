import { useEffect, useRef, useState } from "react";

type Ticker = {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // First trade(F)-1 price (first trade before the 24hr rolling window)
  c: string; // Last price
  Q: string; // Last quantity
  b: string; // Best bid price
  B: string; // Best bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade Id
  n: number; // Total number of trades
};

type ResponseMap = {
  ticker: Ticker;
};

type ReturnedType = {
  socket?: WebSocket;
  onMessage: <T extends keyof ResponseMap>(cb: (data: ResponseMap[T]) => void) => void;
};

export const useBinanceSocket = <T extends keyof ResponseMap>(symbol: string, endpoint: T): ReturnedType => {
  const [socket, setSocket] = useState<WebSocket>();
  const messageCallbackRef = useRef<((data: ResponseMap[T]) => void) | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_BINANCE_SOCKET_URL}${symbol}@${endpoint}`);

    ws.onmessage = function (event) {
      messageCallbackRef.current?.(JSON.parse(event.data) as ResponseMap[T]);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return {
    socket,
    onMessage: (cb) => {
      messageCallbackRef.current = cb;
    },
  };
};
