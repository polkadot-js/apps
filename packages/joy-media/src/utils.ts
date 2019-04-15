export function fileNameWoExt (fileName: string): string {
  const lastDotIdx = fileName.lastIndexOf('.');
  return fileName.substring(0, lastDotIdx);
}
