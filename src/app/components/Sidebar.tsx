"use client";

import React from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: "📊" },
    { id: "mssql", label: "MSSQL OpenShift Secret", icon: "🗄️" },
    { id: "telemetry", label: "Live Telemetry", icon: "⚡" },
    { id: "polar", label: "Polar Model Inspector", icon: "🎯" },
    { id: "selectors", label: "Trained Selectors", icon: "🎛️" },
    { id: "endpoints", label: "API Endpoints & Logs", icon: "🔌" },
    { id: "settings", label: "System Settings", icon: "⚙️" },
  ];

  return (
    <aside
      style={{
        width: "280px",
        minWidth: "280px",
        backgroundColor: "var(--surface)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 20,
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: "24px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            backgroundColor: "var(--accent-blue-bg)",
            border: "1px solid var(--accent-blue)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-blue)",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          PA
        </div>
        <div>
          <h1
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Precision Analytics
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            Next.js Telemetry Hub
          </p>
        </div>
      </div>

      {/* System Status Badge */}
      <div
        style={{
          margin: "16px 20px",
          padding: "12px 14px",
          backgroundColor: "var(--surface-container)",
          borderRadius: "8px",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span className="live-pulse"></span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Next.js Engine Connected
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--accent-emerald)",
              fontWeight: 500,
            }}
          >
            Operational • v2.4.1
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", gap: "4px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            padding: "8px 12px",
          }}
        >
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: isActive ? "var(--primary-container)" : "transparent",
                color: isActive ? "var(--primary-text)" : "var(--text-secondary)",
                fontWeight: isActive ? 600 : 500,
                fontSize: "14px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div
        style={{
          padding: "20px",
          borderTop: "1px solid var(--border-subtle)",
          fontSize: "12px",
          color: "var(--text-muted)",
        }}
      >
        <div style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Stitch Design System</div>
        <div>Precision Analytics v1.0</div>
      </div>
    </aside>
  );
}
