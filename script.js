const APIKEY = "04c35731a5ee918f014970082a0088b1";
const APIURL =
  "https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate";
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const main = document.querySelector("main");
const form = document.querySelector("form");
const search = document.querySelector("#search");
const logo = document.querySelector(".logo");
const left = document.querySelector(".left");
const right = document.querySelector(".right");
const pageNum = document.querySelector(".page-text");
const resDes = document.querySelector(".results");
const overlay = document.querySelector(".overlay");
const overviewVideo = document.querySelector(".overview-video");

let currentPage = 1;
let PageCount = 1;
logo.addEventListener("click", function () {
  getMovies(APIURL);
  resDes.innerText = `Popular Movies :`;
});

//For getting movies
getMovies(APIURL);

async function getMovies(url) {
  const resp = await fetch(url);
  const respData = await resp.json();
  console.log(respData);

  if (respData.total_pages === 0) {
    resDes.innerText = `No results found`;
  }
  right.addEventListener("click", function () {
    if (respData.total_pages > 1) {
      currentPage++;
      getMovies(
        `https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&with_watch_monetization_types=flatrate`
      );
    }
  });
  left.addEventListener("click", function () {
    PageCount--;
    if (respData.total_pages > 1 && respData.page > 1) {
      getMovies(
        `https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&with_watch_monetization_types=flatrate`
      );
    }
  });

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
      //  <div class="close">X</div>;
      const overviewEl = `    <div class="overview overview-${index} hide">
     <div class="overview-video"><div class="loading">Loading&#8230;</div></div>
    <h4>Overview:</h4>
    ${overview}
          <div class="release">Released: ${release_date}</div>
<div class="cast">Cast: ${cast[0].name}, ${cast[1].name}, ${cast[2].name}, ${cast[3].name}, ${cast[4].name}, ${cast[5].name}, ${cast[6].name}...</div>
      </div>`;
      ///Placing the overview in the document

      document.body.insertAdjacentHTML("afterbegin", overviewEl);
      main.appendChild(movieEl);

      //To open overview
      document.querySelectorAll(".movie").forEach((movie, i) => {

        movie.addEventListener("click", () => {
          document.querySelector(`.overview-${i}`).classList.remove("hide");
          overlay.classList.remove("hide");
        });
        ///To close the overview
        overlay.addEventListener("click", () => {
          document.querySelector(`.overview-${i}`).classList.add("hide");

          overlay.classList.add("hide");
        });
      });
    }
    //videos
    async function video() {
      const resp = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=04c35731a5ee918f014970082a0088b1&language=en-US`
      );
      const respData = await resp.json();
      respData.results.forEach((element) => {
        if (element.name === "Official Trailer") {
          // overviewVideo.src = ``;
          // src =
          //   "https://www.youtube.com/embed/il_t1WVLNxk" >
          document.querySelectorAll(".movie").forEach((movie) => {
            document.querySelector(
              `.overview-video`
            ).innerHTML = ` <iframe width="100%" height="330" src="https://www.youtube.com/embed/${element.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
          });
        } else if (
          element.name === "Official Teaser" ||
          element.name === "Main Trailer" ||
          element.name.includes("Trailer")
        ) {
          document.querySelectorAll(".movie").forEach((movie) => {
            document.querySelector(
              `.overview-video`
            ).innerHTML = ` <iframe width="100%" height="330" src="https://www.youtube.com/embed/${element.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
          });
        }
      });
    }
   
    cast();
    video();

   
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
    main.innerHTML = `<div class="spinning-loader"></div>`;
    resDes.innerText = `Results for : "${search.value}" `;
    getMovies(SEARCHAPI + searchTerm);
    search.value = "";
  }
});
