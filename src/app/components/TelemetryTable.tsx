"use client";

import React, { useState, useEffect } from "react";

interface LogEntry {
  id: string;
  timestamp: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  status: number;
  latency: number;
  size: string;
  worker: string;
}

const INITIAL_LOGS: LogEntry[] = [
  {
    id: "log-101",
    timestamp: "16:54:10 PM",
    method: "POST",
    endpoint: "/api/v1/predict",
    status: 200,
    latency: 14.2,
    size: "1.2 KB",
    worker: "uvicorn-worker-01",
  },
  {
    id: "log-102",
    timestamp: "16:54:08 PM",
    method: "GET",
    endpoint: "/api/v1/telemetry/stream",
    status: 200,
    latency: 8.5,
    size: "4.8 KB",
    worker: "uvicorn-worker-03",
  },
  {
    id: "log-103",
    timestamp: "16:54:05 PM",
    method: "GET",
    endpoint: "/api/v1/polar/scale",
    status: 200,
    latency: 11.1,
    size: "820 B",
    worker: "uvicorn-worker-02",
  },
  {
    id: "log-104",
    timestamp: "16:54:01 PM",
    method: "POST",
    endpoint: "/api/v1/selectors/update",
    status: 201,
    latency: 19.4,
    size: "2.1 KB",
    worker: "uvicorn-worker-04",
  },
  {
    id: "log-105",
    timestamp: "16:53:58 PM",
    method: "GET",
    endpoint: "/api/v1/health",
    status: 200,
    latency: 3.2,
    size: "140 B",
    worker: "uvicorn-worker-01",
  },
  {
    id: "log-106",
    timestamp: "16:53:50 PM",
    method: "POST",
    endpoint: "/api/v1/models/train",
    status: 422,
    latency: 34.0,
    size: "512 B",
    worker: "uvicorn-worker-02",
  },
];

export default function TelemetryTable() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);

  // Simulate real-time streaming endpoint logs
  useEffect(() => {
    if (!isStreaming) return;

    const endpoints = [
      { method: "POST", path: "/api/v1/predict", status: 200, size: "1.4 KB" },
      { method: "GET", path: "/api/v1/telemetry", status: 200, size: "3.2 KB" },
      { method: "GET", path: "/api/v1/health", status: 200, size: "140 B" },
      { method: "POST", path: "/api/v1/polar/scale", status: 200, size: "910 B" },
      { method: "POST", path: "/api/v1/selectors/update", status: 201, size: "2.4 KB" },
      { method: "POST", path: "/api/v1/infer", status: 422, size: "480 B" },
    ] as const;

    const interval = setInterval(() => {
      const randomEp = endpoints[Math.floor(Math.random() * endpoints.length)];
      const workerNum = String(Math.floor(1 + Math.random() * 4)).padStart(2, "0");
      const newEntry: LogEntry = {
        id: "log-" + Math.random().toString(36).substring(2, 8),
        timestamp: new Date().toLocaleTimeString(),
        method: randomEp.method,
        endpoint: randomEp.path,
        status: randomEp.status,
        latency: Number((8 + Math.random() * 22).toFixed(1)),
        size: randomEp.size,
        worker: `uvicorn-worker-${workerNum}`,
      };

      setLogs((prev) => [newEntry, ...prev.slice(0, 19)]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Filter logs by status and search query
  const filteredLogs = logs.filter((log) => {
    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "200" && log.status === 200) ||
      (filterStatus === "201" && log.status === 201) ||
      (filterStatus === "422" && log.status === 422);

    const matchesSearch =
      searchQuery === "" ||
      log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.worker.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        borderRadius: "10px",
        padding: "24px",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-card)",
        transition: "all 0.2s ease",
      }}
    >
      {/* Header & Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              FastAPI Live Endpoint Stream
            </h2>
            {isStreaming && <span className="live-pulse"></span>}
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
            Real-time request stream & Uvicorn worker log inspector
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            style={{
              padding: "7px 14px",
              borderRadius: "6px",
              border: "1px solid var(--border-strong)",
              backgroundColor: isStreaming ? "var(--accent-emerald-bg)" : "var(--surface-container)",
              color: isStreaming ? "var(--accent-emerald)" : "var(--text-secondary)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {isStreaming ? "⏸️ Pause Stream" : "▶️ Resume Stream"}
          </button>

          {/* Status Filter */}
          <div
            style={{
              display: "flex",
              backgroundColor: "var(--surface-container)",
              borderRadius: "6px",
              padding: "2px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {["ALL", "200", "201", "422"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: filterStatus === st ? "var(--surface)" : "transparent",
                  color: filterStatus === st ? "var(--text-primary)" : "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {st === "ALL" ? "All Status" : st}
              </button>
            ))}
          </div>

          {/* Filter Search */}
          <input
            type="text"
            placeholder="Filter endpoint logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "var(--surface-container)",
              color: "var(--text-primary)",
              fontSize: "13px",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Logs Data Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border-strong)",
                color: "var(--text-muted)",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <th style={{ padding: "12px 14px" }}>Timestamp</th>
              <th style={{ padding: "12px 14px" }}>Method</th>
              <th style={{ padding: "12px 14px" }}>Endpoint</th>
              <th style={{ padding: "12px 14px" }}>Status</th>
              <th style={{ padding: "12px 14px" }}>Latency</th>
              <th style={{ padding: "12px 14px" }}>Payload Size</th>
              <th style={{ padding: "12px 14px" }}>Worker Node</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => {
              const is200 = log.status === 200;
              const is201 = log.status === 201;

              const statusColor = is200
                ? "var(--accent-emerald)"
                : is201
                ? "var(--accent-blue)"
                : "var(--accent-amber)";

              const statusBg = is200
                ? "var(--accent-emerald-bg)"
                : is201
                ? "var(--accent-blue-bg)"
                : "var(--accent-amber-bg)";

              return (
                <tr
                  key={log.id}
                  style={{
                    borderBottom: "1px solid var(--border-subtle)",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-container)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="font-mono" style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>
                    {log.timestamp}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontWeight: 700,
                        fontSize: "11px",
                        backgroundColor:
                          log.method === "POST" ? "var(--accent-blue-bg)" : "var(--surface-high)",
                        color: log.method === "POST" ? "var(--accent-blue)" : "var(--text-primary)",
                      }}
                    >
                      {log.method}
                    </span>
                  </td>

                  <td className="font-mono" style={{ padding: "12px 14px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {log.endpoint}
                  </td>

                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "11px",
                        backgroundColor: statusBg,
                        color: statusColor,
                      }}
                    >
                      {log.status} {is200 ? "OK" : is201 ? "Created" : "Unprocessable"}
                    </span>
                  </td>

                  <td className="font-mono" style={{ padding: "12px 14px", fontWeight: 600, color: log.latency < 20 ? "var(--accent-emerald)" : "var(--accent-amber)" }}>
                    {log.latency} ms
                  </td>

                  <td className="font-mono" style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>
                    {log.size}
                  </td>

                  <td style={{ padding: "12px 14px", color: "var(--text-muted)", fontSize: "12px" }}>
                    {log.worker}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
