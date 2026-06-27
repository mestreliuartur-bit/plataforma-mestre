import { db } from "@/lib/db";

type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGIN_FAILED" | "LOGOUT";

interface LogAuditParams {
  userId?: string;
  userName: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  label: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit({ userId, userName, action, entity, entityId, label, ipAddress, userAgent }: LogAuditParams) {
  await db.auditLog.create({
    data: { userId, userName, action, entity, entityId, label, ipAddress, userAgent },
  });
}
