import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

type CountRow = RowDataPacket & {
  total: number;
};

type SafetySettingRow = RowDataPacket & {
  screen_time_limit: number;
  screen_time_used: number;
  filter_level: string;
  safe_search: boolean;
};

export async function GET() {
  const parentId = 1;

  const [parents] = await db.query<RowDataPacket[]>(
    `SELECT first_name
     FROM parent
     WHERE parent_id = ?
     LIMIT 1`,
    [parentId],
  );

  const [childCountRows] = await db.query<CountRow[]>(
    `SELECT COUNT(*) AS total
     FROM child
     WHERE parent_id = ?`,
    [parentId],
  );

  const [searchCountRows] = await db.query<CountRow[]>(
    `SELECT COUNT(*) AS total
     FROM search_history
     INNER JOIN child
       ON search_history.child_id = child.child_id
     WHERE child.parent_id = ?`,
    [parentId],
  );

  const [blockedCountRows] = await db.query<CountRow[]>(
    `SELECT COUNT(*) AS total
     FROM blocked_content
     INNER JOIN child
       ON blocked_content.child_id = child.child_id
     WHERE child.parent_id = ?`,
    [parentId],
  );

  const [children] = await db.query<RowDataPacket[]>(
    `SELECT
        child_id,
        first_name,
        birth_date,
        avatar_url
     FROM child
     WHERE parent_id = ?`,
    [parentId],
  );

  const [alerts] = await db.query<RowDataPacket[]>(
    `SELECT
        alert_id,
        message,
        severity,
        created_at
     FROM alert
     INNER JOIN child
       ON alert.child_id = child.child_id
     WHERE child.parent_id = ?
     ORDER BY alert.created_at DESC
     LIMIT 3`,
    [parentId],
  );

  const [history] = await db.query<RowDataPacket[]>(
    `SELECT
        search_history_id,
        search_query,
        created_at
     FROM search_history
     INNER JOIN child
       ON search_history.child_id = child.child_id
     WHERE child.parent_id = ?
     ORDER BY search_history.created_at DESC
     LIMIT 3`,
    [parentId],
  );

  const [settingsRows] = await db.query<SafetySettingRow[]>(
    `SELECT
        screen_time_limit,
        screen_time_used,
        filter_level,
        safe_search
     FROM safety_setting
     INNER JOIN child
       ON safety_setting.child_id = child.child_id
     WHERE child.parent_id = ?
     LIMIT 1`,
    [parentId],
  );

  return Response.json({
    parent: parents[0] ?? null,

    stats: {
      children: childCountRows[0]?.total ?? 0,
      searches: searchCountRows[0]?.total ?? 0,
      blockedSites: blockedCountRows[0]?.total ?? 0,
      screenTime: settingsRows[0]?.screen_time_used ?? 0,
    },

    children,
    alerts,
    history,
    settings: settingsRows[0] ?? null,
  });
}