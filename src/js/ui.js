import { IMG } from './api.js'

export function createCard(movie) {

  const div = document.createElement('div')

  div.className = 'movie-card'

  div.innerHTML = `

    <img
      src="${IMG}${movie.poster_path}"
      loading="lazy"
      alt="${movie.title || movie.name}"
    />

    <div class="movie-card-content">
      <h3 class="movie-title">
        ${movie.title || movie.name}
      </h3>

      <p class="movie-year">
        ${(movie.release_date || movie.first_air_date || '').slice(0,4)}
      </p>
    </div>

  `

  return div
}