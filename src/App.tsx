import { getBinanceKLines } from "@/api/binance";
import { Chart } from "@/components";
import { useBinanceSocket } from "@/hooks";
import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState<number[]>([]);
  const { onMessage } = useBinanceSocket("btcusdt", "ticker");

  const loadInitialData = async () => {
    const initialData = await getBinanceKLines({ symbol: "BTCUSDT", limit: 100, interval: "1s" });
    setData(initialData.map((values) => +values[4]));
  };

  useEffect(() => {
    loadInitialData();
    onMessage((data) => {
      setData((prev) => {
        return [...prev, +data.c];
      });
    });
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <Chart data={data} isLoading={!data.length} />
    </div>
  );
}
