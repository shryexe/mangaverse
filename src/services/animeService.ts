import { JikanAnime, JikanResponse, Anime } from '../types/anime'

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4'

/**
 * Convert Jikan API anime to our normalized Anime format
 */
const mapJikanToAnime = (jikanAnime: JikanAnime): Anime => {
  // Parse duration string like "24 min per ep" to estimate total hours
  let hours: number | undefined
  if (jikanAnime.duration && jikanAnime.episodes) {
    const minMatch = jikanAnime.duration.match(/(\d+)\s*min/)
    if (minMatch) {
      const minPerEp = parseInt(minMatch[1], 10)
      hours = Math.round((minPerEp * jikanAnime.episodes) / 60)
    }
  }

  return {
    id: jikanAnime.mal_id,
    title: jikanAnime.title_english || jikanAnime.title,
    poster:
      jikanAnime.images?.jpg?.large_image_url ||
      jikanAnime.images?.webp?.large_image_url ||
      jikanAnime.images?.jpg?.image_url ||
      '/placeholder.svg',
    description: jikanAnime.synopsis
      ? jikanAnime.synopsis.slice(0, 150) + (jikanAnime.synopsis.length > 150 ? '...' : '')
      : undefined,
    summary: jikanAnime.synopsis || undefined,
    episodes: jikanAnime.episodes || undefined,
    hours,
    rating: jikanAnime.score || undefined,
    year: jikanAnime.year || undefined,
    status: jikanAnime.status || undefined,
    genre: jikanAnime.genres?.map((g) => g.name) || [],
    images: jikanAnime.images
  }
}

/**
 * Fetch top anime (highest rated)
 */
export const fetchTopAnime = async (limit = 10): Promise<Anime[]> => {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/top/anime?limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: JikanResponse = await response.json()
    return data.data.map(mapJikanToAnime)
  } catch (error) {
    console.error('Error fetching top anime:', error)
    return []
  }
}

/**
 * Fetch trending/airing anime
 */
export const fetchTrendingAnime = async (limit = 10): Promise<Anime[]> => {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/top/anime?filter=airing&limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: JikanResponse = await response.json()
    return data.data.map(mapJikanToAnime)
  } catch (error) {
    console.error('Error fetching trending anime:', error)
    return []
  }
}

/**
 * Fetch popular anime (by popularity)
 */
export const fetchPopularAnime = async (limit = 10): Promise<Anime[]> => {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/top/anime?filter=bypopularity&limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: JikanResponse = await response.json()
    return data.data.map(mapJikanToAnime)
  } catch (error) {
    console.error('Error fetching popular anime:', error)
    return []
  }
}

/**
 * Fetch upcoming anime
 */
export const fetchUpcomingAnime = async (limit = 10): Promise<Anime[]> => {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/top/anime?filter=upcoming&limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: JikanResponse = await response.json()
    return data.data.map(mapJikanToAnime)
  } catch (error) {
    console.error('Error fetching upcoming anime:', error)
    return []
  }
}

/**
 * Fetch anime by genre (Action = 1, Adventure = 2)
 */
export const fetchAnimeByGenre = async (genreId: number, limit = 10): Promise<Anime[]> => {
  try {
    const response = await fetch(
      `${JIKAN_BASE_URL}/anime?genres=${genreId}&order_by=score&sort=desc&limit=${limit}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: JikanResponse = await response.json()
    return data.data.map(mapJikanToAnime)
  } catch (error) {
    console.error('Error fetching anime by genre:', error)
    return []
  }
}

/**
 * Fetch current season anime
 */
export const fetchCurrentSeasonAnime = async (limit = 10): Promise<Anime[]> => {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}/seasons/now?limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: JikanResponse = await response.json()
    return data.data.map(mapJikanToAnime)
  } catch (error) {
    console.error('Error fetching current season anime:', error)
    return []
  }
}

/**
 * Search anime by query
 */
export const searchAnime = async (query: string, limit = 20): Promise<Anime[]> => {
  if (!query || query.trim().length === 0) {
    return []
  }
  try {
    const response = await fetch(
      `${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query.trim())}&limit=${limit}&sfw=true`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: JikanResponse = await response.json()
    return data.data.map(mapJikanToAnime)
  } catch (error) {
    console.error('Error searching anime:', error)
    return []
  }
}
