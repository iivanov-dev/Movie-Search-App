const inputFilmNameNode = document.querySelector(".js-main__input");
const searchFilmBtnNode = document.querySelector(".js-main__search-film-btn");
const noFilmNode = document.querySelector(".js-no-film");
const allFilmsNode = document.querySelector(".js-films");

if (!inputFilmNameNode || !searchFilmBtnNode || !noFilmNode || !allFilmsNode) {
  console.error("Не все элементы найдены в DOM");
  throw new Error(
    "Критическая ошибка: один или несколько DOM элементов не найдены",
  );
}

function showNoSearchResult(message = "Фильмы не найдены") {
  noFilmNode.textContent = message;
  allFilmsNode.innerHTML = "";
}

function clearInput(inputElement) {
  inputElement.value = "";
}

function clearPastList(filmsContainer) {
  filmsContainer.innerHTML = "";
}

function renderFilms(filmsArray) {
  noFilmNode.textContent = "";

  if (!filmsArray || filmsArray.length === 0) {
    showNoSearchResult("Фильмы не найдены");
    return;
  }

  clearPastList(allFilmsNode);

  filmsArray.forEach((element) => {
    const filmCard = document.createElement("a");
    filmCard.href = "#";
    filmCard.className = "film js-film";

    const posterUrl =
      element.Poster && element.Poster !== "N/A"
        ? element.Poster
        : "https://via.placeholder.com/300x450?text=No+Image";

    filmCard.innerHTML = `
            <div class="film__image">
                <img src="${posterUrl}" alt="${element.Title || "film-image"}" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x450?text=No+Image';">
            </div>
            <div class="film__info">
                <h2 class="film-name">${element.Title || ""}</h2>
                <h3 class="film-year">${element.Year || ""}</h3>
                <h4 class="film-or-serial">${element.Type || ""}</h4>
            </div>
        `;

    allFilmsNode.appendChild(filmCard);
  });
}

searchFilmBtnNode.addEventListener("click", function () {
  const inputValue = inputFilmNameNode.value.trim();
  if (inputValue === "") {
    showNoSearchResult("Пожалуйста, введите название фильма");
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

      if (json.Response === "True") {
        const fullFilmsArray = json.Search;
        console.log(fullFilmsArray);
        renderFilms(fullFilmsArray);
      } else {
        showNoSearchResult(json.Error || "Фильмы не найдены");
      }
    })
    .catch((error) => {
      console.error("Ошибка при получении данных:", error);
      showNoSearchResult("Ошибка при поиске фильмов");
    });
  clearInput(inputFilmNameNode);
});

inputFilmNameNode.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchFilmBtnNode.click();
  }
});
