"use client";

import React from "react";

export default function KpiGrid() {
  const kpis = [
    {
      title: "TOTAL THROUGHPUT",
      value: "1,428,920",
      unit: "req/s",
      change: "+4.2%",
      isPositive: true,
      subtext: "vs prior 1h window",
      color: "var(--accent-blue)",
      bgColor: "var(--accent-blue-bg)",
    },
    {
      title: "AVG LATENCY",
      value: "14.8",
      unit: "ms",
      change: "-2.1ms",
      isPositive: true,
      subtext: "99th percentile: 28ms",
      color: "var(--accent-emerald)",
      bgColor: "var(--accent-emerald-bg)",
    },
    {
      title: "ERROR RATE",
      value: "0.04",
      unit: "%",
      change: "Optimal",
      isPositive: true,
      subtext: "SLO target < 0.1%",
      color: "var(--accent-amber)",
      bgColor: "var(--accent-amber-bg)",
    },
    {
      title: "ACTIVE WORKERS",
      value: "32 / 32",
      unit: "nodes",
      change: "100%",
      isPositive: true,
      subtext: "Next.js worker threads",
      color: "var(--primary-text)",
      bgColor: "var(--primary-container)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "28px",
      }}
    >
      {kpis.map((kpi, index) => (
        <div
          key={index}
          style={{
            backgroundColor: "var(--surface)",
            borderRadius: "10px",
            padding: "20px 22px",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--text-muted)",
                letterSpacing: "0.05em",
              }}
            >
              {kpi.title}
            </span>
            <span
              style={{
                padding: "2px 8px",
                borderRadius: "12px",
                backgroundColor: kpi.bgColor,
                color: kpi.color,
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {kpi.change}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
              marginBottom: "6px",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              {kpi.value}
            </span>
            <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>
              {kpi.unit}
            </span>
          </div>

          <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 400 }}>
            {kpi.subtext}
          </div>
        </div>
      ))}
    </div>
  );
}
