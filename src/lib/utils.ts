import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to get the correct path for public assets
// Works with both development (/) and production (/MajesticArt/)
export function getAssetPath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Use Vite's BASE_URL which is set in vite.config.ts
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}
