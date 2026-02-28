const NOT_FOUND_FILM = "Movies not found";

const inputSearchMovieNode = document.querySelector(".js-search-input");
const btnSearchMovieNode = document.querySelector(".js-search-btn");
const noMoviesNode = document.querySelector(".js-no-movies");
const allMoviesNode = document.querySelector(".js-movies");

//-------------------------------------------
// Нужна ли данная проверка??
//
// if (
//   !inputSearchMovieNode ||
//   !btnSearchMovieNode ||
//   !noMoviesNode ||
//   !allMoviesNode
// ) {
//   console.error("Не все элементы найдены в DOM");
//   throw new Error(
//     "Критическая ошибка: один или несколько DOM элементов не найдены",
//   );
// }
//----------------------------------------------

btnSearchMovieNode.addEventListener("click", function () {
  const inputValue = inputSearchMovieNode.value.trim();
  if (inputValue === "") {
    showNoSearchResult("Please enter the movie title!");
    return;
  }

  fetch(
    `https://www.omdbapi.com/?s=${encodeURIComponent(inputValue)}&apikey=d69b78ae`,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      console.log(json);

      // Нужна ли здесь реализация LocalStorage?
      // Если да, тогда в каком случае требуется его очистка? (по количеству запросов?)
      if (json.Response === "True") {
        const fullFilmsArray = json.Search;
        console.log(fullFilmsArray);
        renderFilms(fullFilmsArray);
      } else {
        showNoSearchResult(json.Error || NOT_FOUND_FILM);
      }

      clearInput(inputSearchMovieNode);
    })
    .catch((error) => {
      console.error("Ошибка при получении данных:", error);
      showNoSearchResult("Ошибка при поиске фильмов");

      clearInput(inputSearchMovieNode);
    });
});

function renderFilms(filmsArray) {
  noMoviesNode.textContent = "";

  if (!filmsArray || filmsArray.length === 0) {
    showNoSearchResult(NOT_FOUND_FILM);
    return;
  }

  clearPastList(allMoviesNode);

  filmsArray.forEach((element) => {
    const filmCard = document.createElement("a");
    filmCard.href = "#";
    filmCard.className = "film js-film";

    const posterUrl =
      element.Poster && element.Poster !== "N/A"
        ? element.Poster
        : "https://via.placeholder.com/300x450?text=No+Image";

    filmCard.innerHTML = `
        <div class="film-image">
            <img src='${posterUrl}' alt='${element.Title || "film-image"}' 
                onerror='this.onerror=null;this.src="https://via.placeholder.com/300x450?text=No+Image";'>
        </div>
        <div class="film-info">
            <h2 class="film-name">${element.Title || ""}</h2>
            <h3 class="film-year">${element.Year || ""}</h3>
            <h4 class="film-type">${element.Type || ""}</h4>
        </div>
    `;

    allMoviesNode.appendChild(filmCard);
  });
}

function showNoSearchResult(message = NOT_FOUND_FILM) {
  noMoviesNode.textContent = message;
  allMoviesNode.innerHTML = "";
}

function clearInput(inputElement) {
  inputElement.value = "";
}

function clearPastList(filmsContainer) {
  filmsContainer.innerHTML = "";
}

inputSearchMovieNode.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    btnSearchMovieNode.click();
  }
});
