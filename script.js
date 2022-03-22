function silentErrorHandler() {
  return true;
}
window.onerror = silentErrorHandler;
let currentPage = 1;
const APIKEY = "04c35731a5ee918f014970082a0088b1";
const APIURL = `https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const main = document.querySelector("main");
const form = document.querySelector("form");
const search = document.querySelector("#search");
const logo = document.querySelector(".logo");

const pageNum = document.querySelector(".page-text");
const resDes = document.querySelector(".results");
const overlay = document.querySelector(".overlay");
const overviewVideo = document.querySelector(".overview-video");
const newTrailers = document.querySelector(".new-trailers");
const NowPlayingURL = `
https://api.themoviedb.org/3/movie/now_playing?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&page=1`;
logo.addEventListener("click", function () {
  getMovies(APIURL);
  resDes.innerText = `Popular Movies :`;
});

//For getting movies
getMovies(APIURL);
////Now playing Movies
nowPlaying(NowPlayingURL);
async function nowPlaying(url) {
  newTrailers.innerHTML = "";
  const resp = await fetch(url);
  const respData = await resp.json();
  const useData = respData.results;
  useData.forEach((res, index) => {
    const { id } = res;
    const playingEl = document.createElement("div");
    playingEl.classList.add("playing");
    playingEl.classList.add(`playing-${index}`);
    //Getting the video
    async function playVid() {
      const respVid = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=04c35731a5ee918f014970082a0088b1&language=en-US`
      );
      const respVidData = await respVid.json();
      const VidData = respVidData.results;
      VidData.forEach((element) => {
        if (
          element.name === "Official Trailer" ||
          element.name === "Main Trailer" ||
          element.name.includes("Trailer")
        ) {
          playingEl.innerHTML = ` <iframe width="100%" height="330" src="https://www.youtube.com/embed/${element.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
      });

      newTrailers.appendChild(playingEl);

      ///Carousel
      let curSlide = 0;
      const maxSlide = 19;
      //Next Slide
      const nextSlide = function (e) {
        if (curSlide === maxSlide) {
          curSlide = 0;
        } else {
          curSlide++;
        }
        document.querySelectorAll(".playing").forEach((s, i) => {
          s.style.transform = `translateX(${103 * -curSlide}%)`;
        });
      };
      const prevSlide = function (e) {
        if (curSlide === 0) {
          curSlide = 0;
        } else {
          curSlide--;
        }
        document.querySelectorAll(".playing").forEach((s, i) => {
          s.style.transform = `translateX(${103 * -curSlide}%)`;
        });
      };
      document.querySelector(".right").addEventListener("click", nextSlide);
      document.querySelector(".left").addEventListener("click", prevSlide);
      /////////////
    }

    playVid();
  });
}
pageNum.addEventListener("click", function () {
  resDes.innerHTML = `Popular Movies :`;

  if (pageNum.innerHTML === "Next Page") {
    getMovies(
      `https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=2&with_watch_monetization_types=flatrate`
    );
    pageNum.innerHTML = "Previous Page";
  } else {
    getMovies(
      `https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
    );
    pageNum.innerHTML = "Next Page";
  }
  if (pageNum.innerHTML === "Back To Homepage") {
    getMovies(APIURL);
    resDes.innerHTML = `Popular Movies :`;

    pageNum.innerHTML = "Next Page";
  }
});
async function getMovies(url) {
  document.querySelector(".new-release").style.display = "initial";
  document.querySelector(".right").style.display = "initial";
  document.querySelector(".left").style.display = "initial";
  newTrailers.style.display = "flex";
  const resp = await fetch(url);
  const respData = await resp.json();
  console.log(respData);

  if (respData.total_pages === 0) {
    resDes.innerText = `No results found`;
  }

  showMovies(respData.results);
}

/////////////https://youtu.be/JfVOs4VSpmA
function showMovies(movies) {
  ///////////////////////For cast
  ///////////////////////
  main.innerHTML = "";

  movies.forEach((movie, index) => {
    const {
      poster_path,
      title,
      vote_average,
      overview,
      release_date,
      id,
      total_pages,
    } = movie;

    async function cast() {
      const resp = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=04c35731a5ee918f014970082a0088b1&language=en-US`
      );
      const respData = await resp.json();
      const cast = respData.cast;
      // return `<div>${cast[0]},${cast[1]},${cast[2]},${cast[3]},${cast[4]},${cast[5]},${cast[6]}</div>  `;
      ``;
      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");
      movieEl.classList.add(`movie-${index}`);

      movieEl.innerHTML = `
      <img
        src="${IMGPATH + poster_path}"
        alt="${title}"
      />
      <div class="movie-info">${title}<span class="${getClassByAverage(
        vote_average
      )}">${vote_average}</span></div>

    `;

      const overviewEl = `   <div class="overview overview-${index}">
      
      <div class="trailer-top"><div class="trailer">Trailer :</div>  <div class="close">X</div> </div> 
     <div class="overview-video overview-video-${index}"><div class="loading">Loading&#8230;</div></div>
    <h4>Overview:</h4>
    ${overview}
          `;
      ///Placing the overview in the document
      const castText = `<div class="release">Released: ${release_date}</div>
<div class="cast">Cast: ${cast[0].name}, ${cast[1].name}, ${cast[2].name}, ${cast[3].name}, ${cast[4].name}, ${cast[5].name}, ${cast[6].name}, ${cast[7].name}, ${cast[8].name}, ...</div>
      </div>`;
      main.appendChild(movieEl);

      main.insertAdjacentHTML("afterbegin", overviewEl);

      if (cast) {
        document
          .querySelector(`.overview-${index}`)
          .insertAdjacentHTML("beforeend", castText);
      }
      //To open overview
      movieEl.addEventListener("click", () => {
        document.querySelector(`.overview-${index}`).style.top = "-2%";
        overlay.classList.remove("hide");
      });
      ///To close the overview
      overlay.addEventListener("click", () => {
        document.querySelector(`.overview-${index}`).style.top = "-110%";

        overlay.classList.add("hide");
      });
      document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(`.overview-${index}`).style.top = "-110%";
        overlay.classList.add("hide");
      });
      async function video() {
        const resp = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=04c35731a5ee918f014970082a0088b1&language=en-US`
        );
        const respData = await resp.json();
        respData.results.forEach((element) => {
          if (
            element.name === "Official Trailer" ||
            element.name === "Official Teaser" ||
            element.name === "Main Trailer" ||
            element.name.includes("Trailer")
          ) {
            // overviewVideo.src = ``;
            // src =
            //   "https://www.youtube.com/embed/il_t1WVLNxk" >
            document.querySelector(
              `.overview-video-${index}`
            ).innerHTML = ` <div><iframe width="100%" height="330" src="https://www.youtube.com/embed/${element.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
          }
        });
      }
      video();
    }
    //videos

    cast();
  });
}

////////////////////
function getClassByAverage(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm) {
    pageNum.innerHTML = "Back To Homepage";

    main.innerHTML = `<div class="spinning-loader"></div>`;
    resDes.innerText = `Results for : "${search.value}" `;
    getMovies(SEARCHAPI + searchTerm);
    search.value = "";
    document.querySelector(".right").style.display = "none";
    document.querySelector(".left").style.display = "none";
    newTrailers.style.display = "none";
    document.querySelector(".new-release").style.display = "none";
  }
});
