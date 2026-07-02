import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DEFAULT_SESSION = "default";

// Derive a safe filesystem filename from a session ID
function stateFilePath(sessionId: string): string {
  const safe = sessionId.replace(/[^a-zA-Z0-9\-_]/g, "").substring(0, 64) || DEFAULT_SESSION;
  return path.join(process.cwd(), `devo_state_db_${safe}.json`);
}

// Helper to read state
async function getStoredState(sessionId: string) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const kvKey = `devo_state_${sessionId}`;

  if (url && token) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(["GET", kvKey])
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          return JSON.parse(data.result);
        }
      }
    } catch (err) {
      console.error("Failed to read from Vercel KV:", err);
    }
  }

  // Local fallback
  const filePath = stateFilePath(sessionId);
  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(fileContent);
    } catch (err) {
      console.error("Failed to read local state file:", err);
    }
  }

  // Also try legacy file for backward compatibility
  const legacyPath = path.join(process.cwd(), "devo_state_db.json");
  if (sessionId === DEFAULT_SESSION && fs.existsSync(legacyPath)) {
    try {
      return JSON.parse(fs.readFileSync(legacyPath, "utf-8"));
    } catch {}
  }

  return null;
}

// Helper to write state
async function saveStoredState(sessionId: string, state: any) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const kvKey = `devo_state_${sessionId}`;

  if (url && token) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(["SET", kvKey, JSON.stringify(state)])
      });
      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.error("Failed to write to Vercel KV:", err);
    }
  }

  // Local fallback
  try {
    fs.writeFileSync(stateFilePath(sessionId), JSON.stringify(state, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to write local state file:", err);
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session") || DEFAULT_SESSION;
  const state = await getStoredState(sessionId);
  return NextResponse.json({ state });
}

export async function POST(request: Request) {
  try {
    const { sessionId, state } = await request.json();
    if (!state) {
      return NextResponse.json({ error: "Missing state in request body" }, { status: 400 });
    }
    const sid = sessionId || DEFAULT_SESSION;
    const success = await saveStoredState(sid, state);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
