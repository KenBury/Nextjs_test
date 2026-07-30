import { NextResponse } from "next/server";

export async function GET() {
  const primary = {
    id: "primary",
    name: "Primary Analytics Database (Server 1)",
    secretName: "mssql-primary-secret",
    host: process.env.MSSQL_HOST || "mssql-primary.production.svc.cluster.local",
    port: process.env.MSSQL_PORT || "1433",
    database: process.env.MSSQL_DATABASE || "PrecisionAnalyticsDB",
    user: process.env.MSSQL_USER || "sa_analytics_admin",
    password: process.env.MSSQL_PASSWORD || "P@ssw0rd!Precision2026",
    isConfigured: Boolean(process.env.MSSQL_HOST),
  };

  const secondary = {
    id: "secondary",
    name: "Secondary Audit Database (Server 2)",
    secretName: "mssql-secondary-secret",
    host: process.env.MSSQL_DB2_HOST || "mssql-audit.production.svc.cluster.local",
    port: process.env.MSSQL_DB2_PORT || "1433",
    database: process.env.MSSQL_DB2_DATABASE || "AuditLogsDB",
    user: process.env.MSSQL_DB2_USER || "sa_audit_admin",
    password: process.env.MSSQL_DB2_PASSWORD || "P@ssw0rd!AuditLogs2026",
    isConfigured: Boolean(process.env.MSSQL_DB2_HOST),
  };

  return NextResponse.json({
    primary,
    secondary,
    timestamp: new Date().toISOString(),
  });
}
