import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to get the correct path for public assets
// Works with both development (/) and production (/MajesticArt/)
// Leaves external URLs (http/https) unchanged
export function getAssetPath(path: string): string {
  // If it's already an external URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Use Vite's BASE_URL which is set in vite.config.ts
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}
