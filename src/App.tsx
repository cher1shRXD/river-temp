import { useAppState } from "@b1nd/aid-kit/app-state";
import { useBridgeProvider } from "@b1nd/aid-kit/bridge-kit/web";
import { useSafeArea } from "@b1nd/aid-kit/safe-area-provider";
import { colors } from "@b1nd/dodam-design-system/colors";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Data {
  hourDate: string;
  loc_name: string;
  item01v: string;
}

function formatSubtitle(hourDate: string, locName: string): string {
  if (!hourDate || hourDate.length < 10) return "";
  const m = parseInt(hourDate.slice(4, 6));
  const d = parseInt(hourDate.slice(6, 8));
  const h = parseInt(hourDate.slice(8, 10));
  return `${m}월 ${d}일 ${h}시에 ${locName}에서 가져온 정보예요`;
}

const App = () => {
  const [data, setData] = useAppState<Data>(
    { hourDate: "", loc_name: "", item01v: "" },
    "data",
  );
  const prevData = useRef<Data>({ hourDate: "", loc_name: "", item01v: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { send } = useBridgeProvider();
  const { top, bottom } = useSafeArea();

  const getData = async () => {
    try {
      setIsLoading(true);
      prevData.current = data;
      const response = await fetch(import.meta.env.VITE_API_URL);
      const result = await response.json();
      const newTemp = result.response.body.items.item[0] as Data;
      setData(newTemp);
    } catch {
      // pass
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    const id = setInterval(getData, 1000 * 30);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (data.item01v !== prevData.current.item01v && prevData.current.item01v !== "") {
      send("HAPTIC");
    }
  }, [data.item01v]);

  const subtitle = formatSubtitle(data.hourDate, data.loc_name);

  return (
    <div style={{
      background: colors.background.default,
      height: "100svh",
      display: "flex",
      flexDirection: "column",
      padding: `${top}px 16px ${bottom}px 16px`,
      boxSizing: "border-box"
    }}>
      {/* Droplet + Temperature */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}>
        {/* Water droplet icon */}
        <motion.svg
          width="96" height="96" viewBox="0 0 96 96"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <path
            d="M48 8 C48 8 16 44 16 62 C16 80 30.4 92 48 92 C65.6 92 80 80 80 62 C80 44 48 8 48 8 Z"
            fill="#A8D4F5"
          />
        </motion.svg>

        {/* Temperature */}
        <motion.div
          key={data.item01v}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: colors.text.primary,
            letterSpacing: "-0.5px",
          }}
        >
          {isLoading && data.item01v === "" ? "—" : `${data.item01v}°C`}
        </motion.div>

        {/* Subtitle */}
        <div style={{
          fontSize: "14px",
          color: colors.text.tertiary,
          textAlign: "center",
          lineHeight: 1.5,
        }}>
          {subtitle || "데이터를 불러오는 중..."}
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
      }}>
        {[
          { label: "측정 지점", value: data.loc_name || "—" },
          { label: "측정 시각", value: data.hourDate ? `${data.hourDate.slice(8, 10)}:00` : "—" },
        ].map((card) => (
          <div key={card.label} style={{
            background: colors.background.surface,
            borderRadius: "16px",
            padding: "16px",
          }}>
            <div style={{
              fontSize: "13px",
              color: colors.text.tertiary,
              marginBottom: "6px",
            }}>
              {card.label}
            </div>
            <div style={{
              fontSize: "20px",
              fontWeight: 600,
              color: colors.text.primary,
            }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
