"use client";

import React, { useState } from "react";
import Container from "@/_components/shared/Container";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  Calendar,
  Shield,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const MOCK_SECURITY_STATS = {
  totalEmailsScanned: 15420,
  malwareDetected: 142,
  phishingAttempts: 384,
  secureEmails: 14894,
  threatHistory: [
    { date: "May 01", threats: 12 },
    { date: "May 02", threats: 15 },
    { date: "May 03", threats: 8 },
    { date: "May 04", threats: 24 },
    { date: "May 05", threats: 18 },
    { date: "May 06", threats: 32 },
    { date: "May 07", threats: 14 },
  ],
  topThreatSources: [
    { name: "Malware", value: 142 },
    { name: "Phishing", value: 384 },
  ],
  recentThreats: [
    {
      id: 1,
      date: "2026-05-04",
      sender: "admin@paypa1.com",
      type: "Phishing",
      status: "Blocked",
    },
    {
      id: 2,
      date: "2026-05-03",
      sender: "invoice@amazon-support.co",
      type: "Malware",
      status: "Blocked",
    },
    {
      id: 3,
      date: "2026-05-02",
      sender: "security@apple-id-verify.com",
      type: "Phishing",
      status: "Blocked",
    },
    {
      id: 4,
      date: "2026-05-01",
      sender: "hr@company-update.net",
      type: "Malware",
      status: "Blocked",
    },
    {
      id: 5,
      date: "2026-04-30",
      sender: "support@netflix-billing.com",
      type: "Phishing",
      status: "Blocked",
    },
  ],
};

const COLORS = ["#ef4444", "#f59e0b"]; // error and warning colors
export interface SecurityReportsClientProps {
  mailboxId: string;
}
export default function SecurityReportsClient({
  mailboxId,
}: SecurityReportsClientProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 1500);
  };

  const successRate = (
    (MOCK_SECURITY_STATS.secureEmails /
      MOCK_SECURITY_STATS.totalEmailsScanned) *
    100
  ).toFixed(1);

  return (
    <Container>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="">
          <Text as="h1" size="2xl" font="semiBold">
            Security Report
          </Text>
          <Text color="primary-500" className="mt-1">
            Overview of threat detection and email security for the last 30
            days.
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Generating..." : "Download PDF Report"}
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-primary-50/50 border-primary-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary-600">
              Emails Scanned
            </CardTitle>
            <Shield className="w-4 h-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <Text size="3xl" font="bold" color="primary-950">
              {MOCK_SECURITY_STATS.totalEmailsScanned.toLocaleString()}
            </Text>
          </CardContent>
        </Card>

        <Card className="bg-error-50/50 border-error-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-error-600">
              Malware Detected
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-error-600" />
          </CardHeader>
          <CardContent>
            <Text size="3xl" font="bold" className="text-error-600">
              {MOCK_SECURITY_STATS.malwareDetected.toLocaleString()}
            </Text>
          </CardContent>
        </Card>

        <Card className="bg-warning-50/50 border-warning-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-warning-600">
              Phishing Attempts
            </CardTitle>
            <ShieldAlert className="w-4 h-4 text-warning-600" />
          </CardHeader>
          <CardContent>
            <Text size="3xl" font="bold" className="text-warning-600">
              {MOCK_SECURITY_STATS.phishingAttempts.toLocaleString()}
            </Text>
          </CardContent>
        </Card>

        <Card className="bg-success-50/50 border-success-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-success-600">
              Success Rate
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-success-600" />
          </CardHeader>
          <CardContent>
            <Text size="3xl" font="bold" className="text-success-600">
              {successRate}%
            </Text>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Threat Trend Chart */}
        <Card className="lg:col-span-2 border-primary-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary-950">Threat Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={MOCK_SECURITY_STATS.threatHistory}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow:
                        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="threats"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Chart */}
        <Card className="border-primary-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary-950">
              Threat Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_SECURITY_STATS.topThreatSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_SECURITY_STATS.topThreatSources.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow:
                      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Threats Table */}
      <Card className="border-primary-100 shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-primary-950">Recent Threats</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-primary-50 text-primary-600 font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Threat Type</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {MOCK_SECURITY_STATS.recentThreats.map((threat) => (
                <tr
                  key={threat.id}
                  className="hover:bg-primary-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Text size="sm">{threat.date}</Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text size="sm" font="medium">
                      {threat.sender}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        threat.type === "Phishing"
                          ? "bg-warning-100 text-warning-700"
                          : "bg-error-100 text-error-700"
                      }`}
                    >
                      {threat.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-success-600 font-medium text-sm">
                      <CheckCircle className="w-4 h-4" />
                      {threat.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Container>
  );
}
