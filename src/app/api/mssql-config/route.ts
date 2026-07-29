import { NextResponse } from "next/server";

export async function GET() {
  const host = process.env.MSSQL_HOST || "mssql.production.svc.cluster.local (Default)";
  const port = process.env.MSSQL_PORT || "1433";
  const database = process.env.MSSQL_DATABASE || "PrecisionAnalyticsDB";
  const user = process.env.MSSQL_USER || "sa_analytics_admin";
  const rawPassword = process.env.MSSQL_PASSWORD || "P@ssw0rd!Precision2026";

  // Determine if credentials came from OpenShift Secret vs fallback
  const isFromOpenShiftSecret = Boolean(process.env.MSSQL_HOST && process.env.MSSQL_PASSWORD);

  return NextResponse.json({
    host,
    port,
    database,
    user,
    password: rawPassword,
    isFromOpenShiftSecret,
    timestamp: new Date().toISOString(),
  });
}
