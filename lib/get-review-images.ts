import fs from "fs";
import path from "path";

// This file is SERVER-ONLY. Do NOT import in client components.
// Next.js cannot use 'fs' in the browser.

export function getReviewImages() {
  if (typeof window !== "undefined") {
    throw new Error("getReviewImages() cannot be used in the browser. Use an API route instead.");
  }
  const reviewsDir = path.join(process.cwd(), "public", "data", "reviews");
  try {
    return fs.readdirSync(reviewsDir)
      .filter((file) => /\.(jpe?g|png|webp|gif)$/i.test(file))
      .map((file) => `/data/reviews/${file}`);
  } catch (e) {
    return [];
  }
}
