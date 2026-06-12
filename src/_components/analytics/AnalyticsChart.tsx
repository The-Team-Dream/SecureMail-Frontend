"use client";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Text } from "@/_components/shared/Text";

interface AnalyticsChartProps {
  data: {
    day: string;
    spam: number;
    phishing: number;
  }[];
  spamCount: string;
  phishingCount: string;
}

const SPAM_COLOR = "var(--color-warning-500)";
const PHISHING_COLOR = "var(--color-error-500)";

const chartConfig = {
  spam: {
    label: "Spam Detection",
    color: SPAM_COLOR,
  },
  phishing: {
    label: "Phishing Attempts",
    color: PHISHING_COLOR,
  },
} satisfies ChartConfig;

// Custom cell renderer to draw rounded top corners only on the top-most bar segment
const RoundedBarShape = (props: any) => {
  const { x, y, width, height, fill, payload, dataKey } = props;
  if (!height || height <= 0) return null;

  // Determine if this segment is the top-most segment of the stack for this day
  const isTop =
    dataKey === "phishing" ||
    (dataKey === "spam" && (!payload.phishing || payload.phishing === 0));

  const radius = 6; // subtle roundness matching the design in image_0.png

  if (isTop && height > radius) {
    return (
      <path
        d={`M${x},${y + radius} 
            a${radius},${radius} 0 0 1 ${radius},-${radius} 
            h${width - 2 * radius} 
            a${radius},${radius} 0 0 1 ${radius},${radius} 
            v${height - radius} 
            h-${width} 
            Z`}
        fill={fill}
      />
    );
  }

  return <rect x={x} y={y} width={width} height={height} fill={fill} />;
};

export function AnalyticsChart({
  data,
  spamCount,
  phishingCount,
}: AnalyticsChartProps) {
  // Determine today's day abbreviation (e.g., "Fri")
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "short",
  });

  // Aggregate only today's events, mapping all other days to 0
  const aggregatedData = data.map((item) => {
    if (item.day === todayLabel) {
      const totalSpam = data.reduce((sum, d) => sum + d.spam, 0);
      const totalPhishing = data.reduce((sum, d) => sum + d.phishing, 0);
      return {
        ...item,
        spam: totalSpam,
        phishing: totalPhishing,
      };
    }
    return {
      ...item,
      spam: 0,
      phishing: 0,
    };
  });

  return (
    <div className="min-w-0 rounded-lg p-6 bg-background border border-primary-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <Text size={"lg"} font={"bold"}>
            Weekly Threat Distribution
          </Text>
        </div>
      </div>

      <div className="h-40 md:h-80 w-full min-w-0 overflow-hidden">
        <ChartContainer
          config={chartConfig}
          className="h-full w-full min-h-0 min-w-0"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={aggregatedData}
              margin={{ top: 16, right: 24, left: 0, bottom: 24 }}
              barSize={24}
            >
              <CartesianGrid
                vertical={false}
                horizontal={true}
                strokeDasharray="4 4"
                stroke="#C8CFE8"
                opacity={0.4}
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                interval={0}
                padding={{ left: 10, right: 10 }}
                tick={{
                  fill: "#94A3B8",
                  fontSize: 10,
                  fontWeight: 500,
                  dy: 10,
                }}
              />

              <ChartTooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
                content={<ChartTooltipContent indicator="dot" />}
              />

              {/* Spam Detection is the base (bottom) segment of the stack */}
              <Bar
                dataKey="spam"
                stackId="a"
                fill={SPAM_COLOR}
                shape={<RoundedBarShape />}
              />

              {/* Phishing Attempts sits directly on top of Spam Detection */}
              <Bar
                dataKey="phishing"
                stackId="a"
                fill={PHISHING_COLOR}
                shape={<RoundedBarShape />}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-2 pt-4 border-t border-primary-100">
        <div className="flex flex-wrap items-center w-full md:max-w-md justify-between gap-y-4">
          {/* Spam */}
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: SPAM_COLOR }}
            />
            <div className="flex flex-col">
              <Text size="sm" font="medium" color={"warning-600"}>
                Spam Detection
              </Text>
              <Text size="sm" font="bold">
                {spamCount}{" "}
                <span className="font-semibold text-primary ml-1">blocked</span>
              </Text>
            </div>
          </div>

          {/* Phishing */}
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: PHISHING_COLOR }}
            />
            <div className="flex flex-col">
              <Text size="sm" font="medium" style={{ color: PHISHING_COLOR }}>
                Phishing Attempts
              </Text>
              <Text size="sm" font="bold">
                {phishingCount}{" "}
                <span className="font-semibold text-primary ml-1">blocked</span>
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
