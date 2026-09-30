/**
 * Compresses an image file in the browser before upload.
 * Resizes to fit `maxEdge` on the long side and re-encodes as JPEG.
 * Returns the original file untouched for PDFs / small images.
 */
export async function compressImage(file, maxEdge = 1600, quality = 0.85) {
  const isImage = file.type && file.type.startsWith("image/");
  const isJpegLike = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  if (!isImage || !isJpegLike) return file; // PDFs, GIFs, etc. go as-is
  if (file.size <= 250 * 1024) return file; // already small — skip work

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.type === "image/jpeg") {
      // Same size and already JPEG — still re-encode for quality 0.85 gain
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    const blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Compression failed"))),
        "image/jpeg",
        quality
      )
    );

    // Only use the compressed version if it's actually smaller
    if (blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file; // on any failure, upload the original
  }
}
