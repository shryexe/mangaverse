import { Anime } from '../types/anime'

// Placeholder image path
export const PLACEHOLDER_IMAGE = '/placeholder.svg'

/**
 * Safely get the poster URL from an anime object
 * Handles both normalized Anime format and raw Jikan API format
 */
export const getAnimePosterUrl = (anime: Anime | null | undefined): string => {
  if (!anime) {
    return PLACEHOLDER_IMAGE
  }

  // Try direct poster field first (normalized format)
  if (anime.poster && typeof anime.poster === 'string' && anime.poster.trim() !== '') {
    return anime.poster
  }

  // Try Jikan API format with optional chaining
  const jpgLarge = anime.images?.jpg?.large_image_url
  if (jpgLarge && jpgLarge.trim() !== '') {
    return jpgLarge
  }

  const webpLarge = anime.images?.webp?.large_image_url
  if (webpLarge && webpLarge.trim() !== '') {
    return webpLarge
  }

  const jpgRegular = anime.images?.jpg?.image_url
  if (jpgRegular && jpgRegular.trim() !== '') {
    return jpgRegular
  }

  // Return placeholder if no valid image found
  return PLACEHOLDER_IMAGE
}

/**
 * Handle image load error by replacing with placeholder
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>
): void => {
  const target = event.currentTarget
  // Prevent infinite loop if placeholder also fails
  if (!target.src.includes('placeholder')) {
    target.src = PLACEHOLDER_IMAGE
  }
}

/**
 * Check if a URL is valid
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string') return false
  return url.trim() !== '' && (url.startsWith('http') || url.startsWith('/'))
}
