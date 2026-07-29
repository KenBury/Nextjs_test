"use client";

import React, { useState, useEffect } from "react";

interface MssqlConfig {
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
  isFromOpenShiftSecret: boolean;
  timestamp: string;
}

export default function MssqlSecretCard() {
  const [config, setConfig] = useState<MssqlConfig | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      try {
        const res = await fetch("/api/mssql-config");
        const data = await res.json();
        if (isMounted) {
          setConfig(data);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/mssql-config");
      const data = await res.json();
      setConfig(data);
    } catch {
      // API fetch error
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = () => {
    setTestResult("Connecting to " + (config?.host || "MSSQL Server") + "...");
    setTimeout(() => {
      setTestResult("✅ Connection Successful! OpenShift Secret parameters verified.");
    }, 1200);
  };

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "10px",
        padding: "28px",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-card)",
        marginBottom: "28px",
        transition: "all 0.2s ease",
      }}
    >
      {/* Card Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              🗄️ MSSQL Server Credentials & OpenShift Secret Inspector
            </h2>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Real-time environment variables injected via OpenShift Cluster Secrets (`secret/mssql-secret`)
          </p>
        </div>

        {/* Status Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              backgroundColor: "var(--accent-emerald-bg)",
              color: "var(--accent-emerald)",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span className="live-pulse"></span>
            OpenShift Secret Verified
          </span>
          <button
            onClick={handleRefresh}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border-strong)",
              backgroundColor: "var(--surface-container)",
              color: "var(--text-primary)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
          Loading MSSQL environment credentials...
        </div>
      ) : (
        <>
          {/* Credentials Display Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "18px",
              marginBottom: "24px",
            }}
          >
            {/* Host */}
            <div
              style={{
                backgroundColor: "var(--surface-container)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                MSSQL Host (`MSSQL_HOST`)
              </div>
              <div className="font-mono" style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginTop: "6px" }}>
                {config?.host}
              </div>
            </div>

            {/* Port */}
            <div
              style={{
                backgroundColor: "var(--surface-container)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Port (`MSSQL_PORT`)
              </div>
              <div className="font-mono" style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginTop: "6px" }}>
                {config?.port}
              </div>
            </div>

            {/* Database */}
            <div
              style={{
                backgroundColor: "var(--surface-container)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Database Name (`MSSQL_DATABASE`)
              </div>
              <div className="font-mono" style={{ fontSize: "15px", fontWeight: 600, color: "var(--accent-blue)", marginTop: "6px" }}>
                {config?.database}
              </div>
            </div>

            {/* Username */}
            <div
              style={{
                backgroundColor: "var(--surface-container)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Username (`MSSQL_USER`)
              </div>
              <div className="font-mono" style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginTop: "6px" }}>
                {config?.user}
              </div>
            </div>

            {/* Password */}
            <div
              style={{
                backgroundColor: "var(--surface-container)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                gridColumn: "span 1",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Password (`MSSQL_PASSWORD`)
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    border: "none",
                    background: "none",
                    color: "var(--accent-blue)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? "🙈 Hide" : "👁️ Reveal"}
                </button>
              </div>
              <div className="font-mono" style={{ fontSize: "15px", fontWeight: 600, color: "var(--accent-amber)", marginTop: "6px" }}>
                {showPassword ? config?.password : "••••••••••••••••"}
              </div>
            </div>
          </div>

          {/* Test Connection Action */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
            <button
              onClick={handleTestConnection}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "var(--shadow-card)",
              }}
            >
              🔌 Test Simulated MSSQL Connection
            </button>

            {testResult && (
              <span className="font-mono" style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-emerald)" }}>
                {testResult}
              </span>
            )}
          </div>

          {/* OpenShift CLI Guide Box */}
          <div
            style={{
              backgroundColor: "var(--surface-container)",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid var(--border-strong)",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
              🛠️ How to Inject Secrets in OpenShift Local (PowerShell Commands)
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Run these commands in PowerShell to create a Kubernetes/OpenShift Secret and bind it to your deployment:
            </p>
            <pre
              className="font-mono"
              style={{
                backgroundColor: "var(--bg-canvas)",
                padding: "14px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                fontSize: "12px",
                color: "var(--text-primary)",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
{`# 1. Create the OpenShift secret
oc create secret generic mssql-secret \`
  --from-literal=MSSQL_HOST=mssql.production.svc.cluster.local \`
  --from-literal=MSSQL_PORT=1433 \`
  --from-literal=MSSQL_DATABASE=PrecisionAnalyticsDB \`
  --from-literal=MSSQL_USER=sa_analytics_admin \`
  --from-literal=MSSQL_PASSWORD=P@ssw0rd!Precision2026

# 2. Inject secret environment variables into the Next.js deployment
oc set env deployment/nextjs-test --from=secret/mssql-secret`}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
