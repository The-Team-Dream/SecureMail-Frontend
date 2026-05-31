"use client";
import {
  CartesianGrid,
  XAxis,
  Area,
  AreaChart,
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

const SPAM_COLOR = "#1F8A70";
const PHISHING_COLOR = "#EF4444";

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

export function AnalyticsChart({
  data,
  spamCount,
  phishingCount,
}: AnalyticsChartProps) {
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
            <AreaChart
              data={data}
              margin={{ top: 16, right: 24, left: 0, bottom: 24 }}
            >
              <defs>
                <linearGradient id="fillSpam" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={SPAM_COLOR}
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor={SPAM_COLOR}
                    stopOpacity={0.01}
                  />
                </linearGradient>
                <linearGradient id="fillPhishing" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={PHISHING_COLOR}
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor={PHISHING_COLOR}
                    stopOpacity={0.01}
                  />
                </linearGradient>
              </defs>

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
                tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 500, dy: 10 }}
              />

              <ChartTooltip
                cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }}
                content={<ChartTooltipContent indicator="dot" />}
              />

              {/* Spam line rendered LAST so it sits on top of phishing */}
              <Area
                connectNulls={true}
                type="monotone"
                dataKey="phishing"
                stroke={PHISHING_COLOR}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="url(#fillPhishing)"
                dot={{
                  r: 3,
                  fill: "white",
                  stroke: PHISHING_COLOR,
                  strokeWidth: 2,
                }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                isAnimationActive={true}
                animationDuration={1500}
              />
              <Area
                connectNulls={true}
                type="monotone"
                dataKey="spam"
                stroke={SPAM_COLOR}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="url(#fillSpam)"
                dot={{
                  r: 4,
                  fill: "white",
                  stroke: SPAM_COLOR,
                  strokeWidth: 2,
                }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                isAnimationActive={true}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-2 pt-4 border-t border-primary-100">
        <div className="flex flex-wrap items-center w-full md:max-w-md justify-between ">
          {/* Spam */}
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: SPAM_COLOR }} />
            <div className="flex flex-col">
              <Text size="sm" font="medium" style={{ color: SPAM_COLOR }}>
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
            <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: PHISHING_COLOR }} />
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
