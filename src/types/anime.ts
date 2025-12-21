// Jikan API Anime Types
export interface JikanImage {
  image_url: string
  small_image_url: string
  large_image_url: string
}

export interface JikanAnime {
  mal_id: number
  title: string
  title_english: string | null
  title_japanese: string | null
  images: {
    jpg: JikanImage
    webp: JikanImage
  }
  synopsis: string | null
  episodes: number | null
  score: number | null
  scored_by: number | null
  rank: number | null
  popularity: number | null
  members: number | null
  favorites: number | null
  year: number | null
  status: string | null
  rating: string | null
  duration: string | null
  genres: Array<{ mal_id: number; name: string }>
  studios: Array<{ mal_id: number; name: string }>
}

export interface JikanResponse {
  data: JikanAnime[]
  pagination: {
    last_visible_page: number
    has_next_page: boolean
  }
}

// App Anime Type (normalized)
export interface Anime {
  id: number
  title: string
  poster: string
  description?: string
  hours?: number
  episodes?: number
  genre?: string[]
  summary?: string
  rating?: number
  year?: number
  status?: string
  // Keep raw images for flexibility
  images?: {
    jpg: JikanImage
    webp: JikanImage
  }
}
