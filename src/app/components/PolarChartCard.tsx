"use client";

import React, { useState } from "react";

export default function PolarChartCard() {
  const [selectedScale, setSelectedScale] = useState<"log" | "linear" | "normalized">("normalized");
  const [selectedModel, setSelectedModel] = useState<string>("Model-v4-Polar");

  // Polar chart dataset dimensions
  const metrics = [
    { label: "Accuracy", value: 94.2, color: "#3B82F6" },
    { label: "Precision", value: 89.8, color: "#10B981" },
    { label: "Recall", value: 92.4, color: "#F59E0B" },
    { label: "F1 Score", value: 91.1, color: "#8B5CF6" },
    { label: "Throughput", value: 88.5, color: "#EC4899" },
    { label: "Stability", value: 96.0, color: "#06B6D4" },
  ];

  // Polar coordinates calculation helper
  const size = 320;
  const center = size / 2;
  const radius = 120;
  const angleStep = (2 * Math.PI) / metrics.length;

  const points = metrics.map((m, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (m.value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle, r, label: m.label, value: m.value, color: m.color };
  });

  const polygonPath = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "10px",
        padding: "24px",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-card)",
        marginBottom: "28px",
        transition: "all 0.2s ease",
      }}
    >
      {/* Header Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Polar Model Metrics & Radar Analysis
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Trained Status Selectors & Multi-dimensional Evaluation
          </p>
        </div>

        {/* Control Selectors */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "var(--surface-container)",
              color: "var(--text-primary)",
              fontSize: "13px",
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="Model-v4-Polar">Model-v4-Polar (Active)</option>
            <option value="Model-v3-Stitch">Model-v3-Stitch</option>
            <option value="Model-v2-NextJS">Model-v2-NextJS</option>
          </select>

          {/* Scale Buttons */}
          <div
            style={{
              display: "flex",
              backgroundColor: "var(--surface-container)",
              borderRadius: "6px",
              padding: "2px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {(["normalized", "linear", "log"] as const).map((scale) => (
              <button
                key={scale}
                onClick={() => setSelectedScale(scale)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: selectedScale === scale ? "var(--surface)" : "transparent",
                  color: selectedScale === scale ? "var(--text-primary)" : "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {scale}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout: SVG Radar + Metrics Breakdown */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          alignItems: "center",
        }}
      >
        {/* SVG Polar Radar Graphic */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "12px" }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Concentric Circles */}
            {[0.25, 0.5, 0.75, 1.0].map((step) => (
              <circle
                key={step}
                cx={center}
                cy={center}
                r={radius * step}
                fill="none"
                stroke="var(--chart-grid)"
                strokeWidth="1"
                strokeDasharray={step === 1 ? "none" : "3 3"}
              />
            ))}

            {/* Radial Spokes */}
            {points.map((p, i) => {
              const outerX = center + radius * Math.cos(p.angle);
              const outerY = center + radius * Math.sin(p.angle);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={outerX}
                  y2={outerY}
                  stroke="var(--chart-grid)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Polygon Shape */}
            <polygon
              points={polygonPath}
              fill="var(--chart-fill)"
              stroke="var(--accent-blue)"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Data Points and Labels */}
            {points.map((p, i) => {
              const labelX = center + (radius + 24) * Math.cos(p.angle);
              const labelY = center + (radius + 24) * Math.sin(p.angle);
              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill={p.color} stroke="var(--surface)" strokeWidth="2" />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="var(--text-secondary)"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Metric Cards Breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {metrics.map((m, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "var(--surface-container)",
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: m.color,
                  }}
                ></span>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>
                  {m.label}
                </span>
              </div>
              <div className="font-mono" style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
                {m.value}%
              </div>
              <div style={{ height: "4px", backgroundColor: "var(--surface-high)", borderRadius: "2px", marginTop: "8px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${m.value}%`,
                    backgroundColor: m.color,
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
