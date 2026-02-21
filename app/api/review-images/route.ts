import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  const reviewsDir = path.join(process.cwd(), "public", "data", "reviews");
  let images: string[] = [];
  try {
    images = fs.readdirSync(reviewsDir)
      .filter((file) => /\.(jpe?g|png|webp|gif)$/i.test(file))
      .map((file) => `/data/reviews/${file}`);
  } catch (e) {
    images = [];
  }
  return NextResponse.json({ images });
}
