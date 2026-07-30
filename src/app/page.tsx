"use client";

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import KpiGrid from "./components/KpiGrid";
import PolarChartCard from "./components/PolarChartCard";
import TelemetryTable from "./components/TelemetryTable";
import MssqlSecretCard from "./components/MssqlSecretCard";

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-canvas)" }}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header Bar */}
        <Header />

        {/* Page Main Content Area */}
        <main style={{ padding: "28px", flex: 1 }}>
          {/* Top Banner / Welcome */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                Precision Analytics Control Center
              </h1>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
                Real-time performance telemetry, Next.js worker metrics, and OpenShift Secret Inspector.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => alert("Report generated successfully!")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-strong)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                📄 Export Report
              </button>
              <button
                onClick={() => alert("Simulating telemetry burst...")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                🚀 Trigger Load Test
              </button>
            </div>
          </div>

          {/* KPI Metrics Summary Grid */}
          <KpiGrid />

          {/* Tab Views */}
          {activeTab === "overview" && (
            <>
              <MssqlSecretCard />
              <PolarChartCard />
              <TelemetryTable />
            </>
          )}

          {activeTab === "mssql" && <MssqlSecretCard />}

          {activeTab === "telemetry" && <TelemetryTable />}

          {activeTab === "polar" && <PolarChartCard />}

          {activeTab === "selectors" && (
            <div
              style={{
                backgroundColor: "var(--surface)",
                padding: "32px",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>Trained Status Selectors</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
                Configure parameters for trained model selectors and inference thresholds.
              </p>
              <PolarChartCard />
            </div>
          )}

          {activeTab === "endpoints" && <TelemetryTable />}

          {activeTab === "settings" && (
            <div
              style={{
                backgroundColor: "var(--surface)",
                padding: "32px",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>Next.js Cluster & Server Settings</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                Manage CORS policy, Next.js route concurrency thresholds, and telemetry log retention.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
