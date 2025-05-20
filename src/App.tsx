import { getBinanceKLines } from "@/api/binance";
import { Chart } from "@/components";
import { useBinanceSocket } from "@/hooks";
import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState<{ x: number; y: number }[]>([]);
  const { onMessage } = useBinanceSocket("btcusdt", "kline", "1s");

  const loadInitialData = async () => {
    const initialData = await getBinanceKLines({ symbol: "BTCUSDT", limit: 60, interval: "1s" });
    setData(
      initialData.map((values) => ({
        x: +values[6],
        y: +values[4],
      })),
    );
  };

  useEffect(() => {
    loadInitialData();
    onMessage((data) => {
      setData((prev) => {
        prev.shift();
        return [
          ...prev,
          {
            x: data.k.T,
            y: +data.k.c,
          },
        ];
      });
    });
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <Chart data={data} isLoading={!data.length} />
    </div>
  );
}
