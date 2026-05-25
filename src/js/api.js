const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  if (!res.ok) {
    const text = await res.text()
    console.error('TMDB ERROR:', text)
    throw new Error(`TMDB request failed: ${res.status}`)
  }

  return await res.json()
}

export async function trendingMovies() {
  return await fetcher('/trending/movie/week')
}

export async function topMovies() {
  return await fetcher('/movie/top_rated')
}

export async function popularTV() {
  return await fetcher('/tv/popular')
}

export async function detail(type,id) {
  return await fetcher(`/${type}/${id}`)
}

export async function similar(type,id) {
  return await fetcher(`/${type}/${id}/similar`)
}

export async function search(query) {
  return await fetcher(`/search/multi?query=${encodeURIComponent(query)}`)
}
```js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const BASE = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p/w500'

export { IMG }

async function fetcher(endpoint) {
  const res = await fetch(`${BASE}${endpoint}?api_key=${API_KEY}&language=en-US`)

  if (!res.ok) {
    throw new Error('TMDB request failed')
  }

  return await res.json()
}

export async function trendingMovies() {
  return await fetcher('/trending/movie/week')
}

export async function topMovies() {
  return await fetcher('/movie/top_rated')
}

export async function popularTV() {
  return await fetcher('/tv/popular')
}

export async function detail(type,id) {
  return await fetcher(`/${type}/${id}`)
}

export async function similar(type,id) {
  return await fetcher(`/${type}/${id}/similar`)
}

export async function search(query) {

  const res = await fetch(
    `${BASE}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}`
  )

  if (!res.ok) {
    throw new Error('Search request failed')
  }

  return await res.json()
}