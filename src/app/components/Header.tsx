"use client";

import React, { useState, useEffect } from "react";

export default function Header() {
  const [themeMode, setThemeMode] = useState<"system" | "dark" | "light">(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("theme");
        if (saved === "dark" || saved === "light") {
          return saved;
        }
      } catch {
        // localStorage unreadable
      }
    }
    return "system";
  });

  const [activeLatency, setActiveLatency] = useState(14);

  // Update theme on html element and localStorage
  const handleThemeChange = (mode: "system" | "dark" | "light") => {
    setThemeMode(mode);
    try {
      if (mode === "system") {
        localStorage.removeItem("theme");
        document.documentElement.removeAttribute("data-theme");
      } else {
        localStorage.setItem("theme", mode);
        document.documentElement.setAttribute("data-theme", mode);
      }
    } catch {
      // localStorage write error
    }
  };

  // Simulate real-time latency fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLatency(Math.floor(11 + Math.random() * 6));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{
        height: "64px",
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* Search Input */}
      <div style={{ position: "relative", width: "320px" }}>
        <input
          type="text"
          placeholder="Search endpoints, models, parameters..."
          style={{
            width: "100%",
            padding: "8px 12px 8px 36px",
            borderRadius: "6px",
            border: "1px solid var(--border-subtle)",
            backgroundColor: "var(--surface-container)",
            color: "var(--text-primary)",
            fontSize: "13px",
            outline: "none",
            transition: "border-color 0.15s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--border-focus)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
        />
        <span
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            fontSize: "14px",
          }}
        >
          🔍
        </span>
      </div>

      {/* Header Right Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Latency Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            borderRadius: "20px",
            backgroundColor: "var(--surface-container)",
            border: "1px solid var(--border-subtle)",
            fontSize: "12px",
          }}
        >
          <span className="live-pulse"></span>
          <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Latency:</span>
          <span className="font-mono" style={{ color: "var(--accent-emerald)", fontWeight: 600 }}>
            {activeLatency}ms
          </span>
        </div>

        {/* Environment Tag */}
        <div
          style={{
            padding: "4px 10px",
            borderRadius: "4px",
            backgroundColor: "var(--accent-blue-bg)",
            color: "var(--accent-blue)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}
        >
          PROD-CLUSTER-01
        </div>

        {/* Theme Preference Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "var(--surface-container)",
            borderRadius: "8px",
            padding: "3px",
            border: "1px solid var(--border-subtle)",
          }}
          title="Theme Preference (System Auto / Dark / Light)"
        >
          <button
            onClick={() => handleThemeChange("system")}
            style={{
              padding: "5px 10px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: themeMode === "system" ? "var(--surface)" : "transparent",
              color: themeMode === "system" ? "var(--text-primary)" : "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: themeMode === "system" ? "var(--shadow-card)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            💻 Auto
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            style={{
              padding: "5px 10px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: themeMode === "dark" ? "var(--surface)" : "transparent",
              color: themeMode === "dark" ? "var(--text-primary)" : "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: themeMode === "dark" ? "var(--shadow-card)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            🌙 Dark
          </button>
          <button
            onClick={() => handleThemeChange("light")}
            style={{
              padding: "5px 10px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: themeMode === "light" ? "var(--surface)" : "transparent",
              color: themeMode === "light" ? "var(--text-primary)" : "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: themeMode === "light" ? "var(--shadow-card)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            ☀️ Light
          </button>
        </div>

        {/* User Profile Avatar */}
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            backgroundColor: "var(--surface-high)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: "13px",
            color: "var(--text-primary)",
            cursor: "pointer",
          }}
        >
          PA
        </div>
      </div>
    </header>
  );
}
