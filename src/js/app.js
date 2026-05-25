const app = document.getElementById('app')

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

async function fetchTMDB(endpoint) {

  const separator = endpoint.includes('?')
    ? '&'
    : '?'

  const res = await fetch(
    `https://api.themoviedb.org/3${endpoint}${separator}api_key=${API_KEY}`
  )

  return await res.json()
}

async function init() {

  const data = await fetchTMDB('/trending/movie/week')

  renderHome(data.results)

}

function renderNavbar() {

  return `

    <nav class="navbar">

      <div
        class="nav-logo"
        onclick="location.reload()"
      >
        FLIXNOVA
      </div>

      <input
        id="searchInput"
        class="search-input"
        type="text"
        placeholder="Search Movies / TV Show"
      />

    </nav>

  `
}

function renderMovieCards(movies,grid) {

  movies.forEach(movie => {

    if (!movie.poster_path) return

    const year = movie.release_date
      ? movie.release_date.slice(0,4)
      : 'N/A'

    const card = document.createElement('div')

    card.className = 'movie-card'

    card.innerHTML = `

      <img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        alt="${movie.title}"
      />

      <div class="movie-info">

        <h3>${movie.title}</h3>

        <div class="movie-meta">

          <span>
            ⭐ ${movie.vote_average.toFixed(1)}
          </span>

          <span>
            📅 ${year}
          </span>

        </div>

      </div>

    `

    card.addEventListener('click',() => {
      openDetail(movie.id)
    })

    grid.appendChild(card)

  })

}

function renderHome(movies) {

  const featured = movies[0]

  app.innerHTML = `

    ${renderNavbar()}

    <section
      class="hero"
      style="
        background-image:
        linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,.4)),
        url(https://image.tmdb.org/t/p/original${featured.backdrop_path})
      "
    >

      <div class="hero-content">

        <h1 class="hero-title">
          ${featured.title}
        </h1>

        <p class="hero-overview">
          ${featured.overview}
        </p>

        <div class="hero-buttons">

          <button
            class="play-btn"
            onclick="openDetail(${featured.id})"
          >
            ▶ View Details
          </button>

        </div>

      </div>

    </section>

    <main class="container">

      <h2 class="section-title">
        Trending Movies
      </h2>

      <div id="movies" class="movie-grid"></div>

    </main>

  `

  const grid = document.getElementById('movies')

  renderMovieCards(movies,grid)

  setupSearch()

}

async function openDetail(id) {

  const movie = await fetchTMDB(`/movie/${id}`)

  const similar = await fetchTMDB(
    `/movie/${id}/similar`
  )

  const credits = await fetchTMDB(
    `/movie/${id}/credits`
  )

  const cast = credits.cast
    .slice(0,5)
    .map(actor => actor.name)
    .join(', ')

  const director = credits.crew.find(
    p => p.job === 'Director'
  )

  app.innerHTML = `

    ${renderNavbar()}

    <section
      class="detail-hero"
      style="
        background-image:
        linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,.4)),
        url(https://image.tmdb.org/t/p/original${movie.backdrop_path})
      "
    >

      <div class="detail-overlay">

        <button
          class="back-btn"
          onclick="location.reload()"
        >
          ← Back
        </button>

        <div class="detail-grid">

          <img
            class="detail-poster"
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          />

          <div>

            <h1 class="detail-title">
              ${movie.title}
            </h1>

            <div class="detail-meta">

              <span>
                ⭐ ${movie.vote_average.toFixed(1)}
              </span>

              <span>
                📅 ${movie.release_date}
              </span>

              <span>
                ⏱ ${movie.runtime} min
              </span>

            </div>

            <div class="genres">

              ${movie.genres.map(g => `
                <span>${g.name}</span>
              `).join('')}

            </div>

            <div class="credits">

              <p>
                <strong>Director:</strong>
                ${director?.name || 'Unknown'}
              </p>

              <p>
                <strong>Cast:</strong>
                ${cast}
              </p>

            </div>

            <p class="detail-overview">
              ${movie.overview}
            </p>

            <div class="detail-actions">

  <button
    class="play-btn"
    onclick="openPlayer(${movie.id})"
  >
    ▶ Watch Movie
  </button>

  <button
    class="trailer-btn"
    onclick="openTrailer(${movie.id})"
  >
    <span>🎬</span>
    Watch Trailer
  </button>

</div>

          </div>

        </div>

      </div>

    </section>

    <section class="container">

      <h2 class="section-title">
        Similar Movies
      </h2>

      <div id="similarGrid" class="movie-grid"></div>

    </section>

  `

  const grid = document.getElementById('similarGrid')

  renderMovieCards(similar.results.slice(0,12),grid)

  setupSearch()

}

async function openPlayer(id) {

  const movie = await fetchTMDB(`/movie/${id}`)

  history.pushState({}, '', `#watch-${id}`)

  app.innerHTML = `

    ${renderNavbar()}

    <div class="player-page">

      <button
        class="back-btn"
        onclick="goBackHome()"
      >
        ← Home
      </button>

      <h1 class="player-title">
        ${movie.title}
      </h1>

      <div class="stream-buttons">

        <button
          class="stream-btn stream-red"
          onclick="changeStream(
            'https://vidsrc.to/embed/movie/' + ${id},
            this
          )"
        >
          Stream 1
        </button>

        <button
          class="stream-btn stream-blue"
          onclick="changeStream(
            'https://vidsrc.me/embed/movie/' + ${id},
            this
          )"
        >
          Stream 2
        </button>

      </div>

      <div class="cinema-wrapper">

        <div class="player-placeholder">

          <h2>
            Ready To Watch
          </h2>

          <p>
            Select Stream 1 or Stream 2
          </p>

        </div>

        <iframe
          id="moviePlayer"
          class="movie-frame"
          frameborder="0"
          scrolling="no"
          allowfullscreen
          webkitallowfullscreen
          mozallowfullscreen
          referrerpolicy="origin"
       ></iframe>

      </div>

    </div>

  `

  setupSearch()

}

async function openTrailer(id) {

  const videos = await fetchTMDB(
    `/movie/${id}/videos`
  )

  const trailer = videos.results.find(v =>
    v.site === 'YouTube' &&
    v.type === 'Trailer'
  )

  if (!trailer) {
    alert('Trailer not available')
    return
  }

  const modal = document.createElement('div')

  modal.className = 'trailer-modal'

  modal.innerHTML = `

    <div class="trailer-backdrop">

      <div class="trailer-content">

        <button
          class="close-trailer"
        >
          ✕
        </button>

        <iframe
          src="https://www.youtube.com/embed/${trailer.key}?autoplay=1"
          allowfullscreen
        ></iframe>

      </div>

    </div>

  `

  document.body.appendChild(modal)

  modal
    .querySelector('.close-trailer')
    .onclick = () => {
      modal.remove()
    }

  modal.onclick = e => {
    if (
      e.target.classList.contains(
        'trailer-backdrop'
      )
    ) {
      modal.remove()
    }
  }

}

window.openTrailer = openTrailer

function changeStream(url,button) {

  const iframe = document.getElementById('moviePlayer')

  const placeholder = document.querySelector(
    '.player-placeholder'
  )

  document
    .querySelectorAll('.stream-btn')
    .forEach(btn => {
      btn.classList.remove('active-stream')
    })

  button.classList.add('active-stream')

  if (placeholder) {
    placeholder.style.display = 'none'
  }

  iframe.style.display = 'block'

  // reset ringan TANPA destroy iframe
  iframe.removeAttribute('src')

  setTimeout(() => {
    iframe.src = url
  },100)

}

function goBackHome() {

  history.pushState({},'', '/')

  init()

}

window.goBackHome = goBackHome

function setupSearch() {

  const input = document.getElementById('searchInput')

  if (!input) return

  let timeout

  input.addEventListener('input',() => {

    clearTimeout(timeout)

    timeout = setTimeout(async () => {

      const query = input.value.trim()

      if (!query) {

        const data = await fetchTMDB('/trending/movie/week')

        renderHome(data.results)

        return
      }

      const data = await fetchTMDB(
        `/search/movie?query=${encodeURIComponent(query)}`
      )

      renderSearchResults(data.results)

    },400)

  })

}

function renderSearchResults(results) {

  app.innerHTML = `

    ${renderNavbar()}

    <div class="container">

      <button
        class="back-btn"
        onclick="location.reload()"
      >
        ← Back
      </button>

      <h1 class="section-title">
        Search Results
      </h1>

      <div id="movies" class="movie-grid"></div>

    </div>

  `

  const grid = document.getElementById('movies')

  renderMovieCards(results,grid)

  setupSearch()

}

window.openDetail = openDetail
window.openPlayer = openPlayer
window.changeStream = changeStream
window.goBackHome = goBackHome

init()