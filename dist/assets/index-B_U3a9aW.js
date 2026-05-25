(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.getElementById(`app`),t=`189abb73fc6d8543f3dd52299f5e1480`;async function n(e){let n=e.includes(`?`)?`&`:`?`;return await(await fetch(`https://api.themoviedb.org/3${e}${n}api_key=${t}`)).json()}async function r(){o((await n(`/trending/movie/week`)).results)}function i(){return`

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

  `}function a(e,t){e.forEach(e=>{if(!e.poster_path)return;let n=e.release_date?e.release_date.slice(0,4):`N/A`,r=document.createElement(`div`);r.className=`movie-card`,r.innerHTML=`

      <img
        src="https://image.tmdb.org/t/p/w500${e.poster_path}"
        alt="${e.title}"
      />

      <div class="movie-info">

        <h3>${e.title}</h3>

        <div class="movie-meta">

          <span>
            ⭐ ${e.vote_average.toFixed(1)}
          </span>

          <span>
            📅 ${n}
          </span>

        </div>

      </div>

    `,r.addEventListener(`click`,()=>{s(e.id)}),t.appendChild(r)})}function o(t){let n=t[0];e.innerHTML=`

    ${i()}

    <section
      class="hero"
      style="
        background-image:
        linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,.4)),
        url(https://image.tmdb.org/t/p/original${n.backdrop_path})
      "
    >

      <div class="hero-content">

        <h1 class="hero-title">
          ${n.title}
        </h1>

        <p class="hero-overview">
          ${n.overview}
        </p>

        <div class="hero-buttons">

          <button
            class="play-btn"
            onclick="openDetail(${n.id})"
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

  `,a(t,document.getElementById(`movies`)),d()}async function s(t){let r=await n(`/movie/${t}`),o=await n(`/movie/${t}/similar`),s=await n(`/movie/${t}/credits`),c=s.cast.slice(0,5).map(e=>e.name).join(`, `),l=s.crew.find(e=>e.job===`Director`);e.innerHTML=`

    ${i()}

    <section
      class="detail-hero"
      style="
        background-image:
        linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,.4)),
        url(https://image.tmdb.org/t/p/original${r.backdrop_path})
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
            src="https://image.tmdb.org/t/p/w500${r.poster_path}"
          />

          <div>

            <h1 class="detail-title">
              ${r.title}
            </h1>

            <div class="detail-meta">

              <span>
                ⭐ ${r.vote_average.toFixed(1)}
              </span>

              <span>
                📅 ${r.release_date}
              </span>

              <span>
                ⏱ ${r.runtime} min
              </span>

            </div>

            <div class="genres">

              ${r.genres.map(e=>`
                <span>${e.name}</span>
              `).join(``)}

            </div>

            <div class="credits">

              <p>
                <strong>Director:</strong>
                ${l?.name||`Unknown`}
              </p>

              <p>
                <strong>Cast:</strong>
                ${c}
              </p>

            </div>

            <p class="detail-overview">
              ${r.overview}
            </p>

            <button
              class="play-btn"
              onclick="openPlayer(${r.id})"
            >
              ▶ Watch Movie
            </button>

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

  `;let u=document.getElementById(`similarGrid`);a(o.results.slice(0,12),u),d()}async function c(t){let r=await n(`/movie/${t}`);history.pushState({},``,`#watch-${t}`),e.innerHTML=`

    ${i()}

    <div class="player-page">

      <button
        class="back-btn"
        onclick="goBackHome()"
      >
        ← Home
      </button>

      <h1 class="player-title">
        ${r.title}
      </h1>

      <div class="stream-buttons">

        <button
          class="stream-btn stream-red"
          onclick="changeStream(
            'https://vidsrc.to/embed/movie/' + ${t},
            this
          )"
        >
          Stream 1
        </button>

        <button
          class="stream-btn stream-blue"
          onclick="changeStream(
            'https://vidsrc.me/embed/movie/' + ${t},
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

  `,d()}function l(e,t){let n=document.getElementById(`moviePlayer`),r=document.querySelector(`.player-placeholder`);document.querySelectorAll(`.stream-btn`).forEach(e=>{e.classList.remove(`active-stream`)}),t.classList.add(`active-stream`),r&&(r.style.display=`none`),n.style.display=`block`,n.removeAttribute(`src`),setTimeout(()=>{n.src=e},100)}function u(){history.pushState({},``,`/`),r()}window.goBackHome=u;function d(){let e=document.getElementById(`searchInput`);if(!e)return;let t;e.addEventListener(`input`,()=>{clearTimeout(t),t=setTimeout(async()=>{let t=e.value.trim();if(!t){o((await n(`/trending/movie/week`)).results);return}f((await n(`/search/movie?query=${encodeURIComponent(t)}`)).results)},400)})}function f(t){e.innerHTML=`

    ${i()}

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

  `,a(t,document.getElementById(`movies`)),d()}window.openDetail=s,window.openPlayer=c,window.changeStream=l,window.goBackHome=u,r();