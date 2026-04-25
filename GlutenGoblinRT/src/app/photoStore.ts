let frontPhoto: File | null = null;

export function setFrontPhoto(file: File): void {
  frontPhoto = file;
}

export function getFrontPhoto(): File | null {
  return frontPhoto;
}

export function clearFrontPhoto(): void {
  frontPhoto = null;
}