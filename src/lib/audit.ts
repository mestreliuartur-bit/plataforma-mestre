import { db } from "@/lib/db";

type AuditAction = "CREATE" | "UPDATE" | "DELETE";

interface LogAuditParams {
  userId: string;
  userName: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  label: string;
}

export async function logAudit({ userId, userName, action, entity, entityId, label }: LogAuditParams) {
  await db.auditLog.create({
    data: { userId, userName, action, entity, entityId, label },
  });
}
