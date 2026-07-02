import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper to translate scripture reference to USFM passage ID
export function getUsfmPassageId(scripture: string): string {
  const bookMap: Record<string, string> = {
    "Hebrews": "HEB",
    "Romans": "ROM",
    "Proverbs": "PRO",
    "Ephesians": "EPH",
    "Mark": "MRK",
    "2 Corinthians": "2CO",
    "Psalm": "PSA",
    "Psalms": "PSA",
    "James": "JAS",
    "1 Samuel": "1SA",
    "Daniel": "DAN",
    "Luke": "LUK",
    "Galatians": "GAL",
    "Matthew": "MAT",
    "Philippians": "PHP",
    "Isaiah": "ISA",
    "2 Timothy": "2TI",
    "1 Peter": "1PE",
    "1 John": "1JN",
    "1 Timothy": "1TI"
  };

  const regex = /^(\d?\s*[a-zA-Z\s]+)\s+(\d+[:\d\-\s,]*)$/;
  const match = scripture.match(regex);
  if (!match) {
    return scripture; // Fallback
  }

  const fullBookName = match[1].trim();
  const reference = match[2].trim();
  const abbrev = bookMap[fullBookName] || fullBookName.substring(0, 3).toUpperCase();
  const formattedRef = reference.replace(":", ".");

  return `${abbrev}.${formattedRef}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scripture = searchParams.get("scripture");
  const version = searchParams.get("version") || "ESV";

  if (!scripture) {
    return NextResponse.json({ error: "Scripture reference parameter is required" }, { status: 400 });
  }

  try {
    const passageId = getUsfmPassageId(scripture);
    
    // Read App Key from workspace root file youversion_credentials.txt
    const credsPath = path.join(process.cwd(), "youversion_credentials.txt");
    let apiKey = "bAEHkCnBJNzCCzSd2rF9lYKR2sFDZM090RGRi3Ic0Mod9b8O"; // fallback
    
    if (fs.existsSync(credsPath)) {
      apiKey = fs.readFileSync(credsPath, "utf-8").trim();
    }

    // Map translations: ESV -> BSB (3034), NIV -> FBV (1932), KJV -> ASV (12)
    let bibleId = 3034;
    if (version === "NIV") {
      bibleId = 1932;
    } else if (version === "KJV") {
      bibleId = 12;
    }

    // Call YouVersion API (using Berean Standard Bible translation ID 3034)
    const url = `https://api.youversion.com/v1/bibles/${bibleId}/passages/${passageId}?format=html`;
    const response = await fetch(url, {
      headers: {
        "X-YVP-App-Key": apiKey,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`YouVersion REST API returned status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("YouVersion API route proxy error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch scripture passage text" }, { status: 500 });
  }
}
