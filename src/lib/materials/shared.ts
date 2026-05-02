const MAX_MATERIAL_SIZE = 1024 * 1024 * 100;
const MATERIAL_BUCKET = "lecture-materials";

function sanitizeFileName(fileName: string) {
  return fileName
    // Remove accents and decompose Unicode characters to ASCII equivalents
    .normalize("NFD")
    .replace(/[\u0300-\u036F]/g, "")
    // Replace forbidden characters with hyphen
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    // Remove any remaining non-ASCII characters
    .replace(/[^\x20-\x7E]/g, "-")
    .trim()
    // Clean up multiple consecutive hyphens
    .replace(/-+/g, "-");
}

function splitFileName(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");

  if (dotIndex <= 0) {
    return { baseName: fileName, extension: "" };
  }

  return {
    baseName: fileName.slice(0, dotIndex),
    extension: fileName.slice(dotIndex),
  };
}

export function isAllowedMaterial(file: File) {
  return !file.type.startsWith("video/");
}

export function validateMaterialFile(file: File) {
  if (!isAllowedMaterial(file)) {
    return `"${file.name}" looks like a video file. Only lecture materials are supported here.`;
  }

  if (file.size > MAX_MATERIAL_SIZE) {
    return `"${file.name}" exceeds the 100 MB limit.`;
  }

  return null;
}

export async function resolveUniqueMaterialNameWithClient({
  findExistingStoragePath,
  userId,
  courseId,
  lectureId,
  originalName,
}: {
  findExistingStoragePath: (storagePath: string) => Promise<boolean>;
  userId: string;
  courseId: string;
  lectureId: string;
  originalName: string;
}) {
  const cleanName = sanitizeFileName(originalName) || "file";
  const { baseName, extension } = splitFileName(cleanName);

  let candidate = cleanName;
  let counter = 2;

  while (true) {
    const storagePath = `${userId}/${courseId}/${lectureId}/${candidate}`;
    const exists = await findExistingStoragePath(storagePath);

    if (!exists) {
      return {
        fileName: candidate,
        storagePath,
        wasRenamed: candidate !== cleanName,
      };
    }

    candidate = `${baseName} (${counter})${extension}`;
    counter += 1;
  }
}

export { MATERIAL_BUCKET, MAX_MATERIAL_SIZE };
