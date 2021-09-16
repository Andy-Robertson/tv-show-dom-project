// Global variables to store episode and show data.
let allSeries = getAllShows();
let allEpisodes = [];
let seriesID = 82; // Game of Thrones

// Gets all episode data from the TVMaze API, stores the result in `allEpisodes` global variable and starts the page
// load when complete by calling `setup()`.
let getEpisodeLibrary = () => {
  fetch(`https://api.tvmaze.com/shows/${seriesID}/episodes`)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        throw new Error(
          `Unexpected Error: ${response.status} ${response.statusText}`
        );
      }
    })
    .then((episodes) => {
      allEpisodes = episodes;
      setup(allEpisodes);
    })
    .catch((error) => console.log(error));
};

// Loads page using content pulled from the TVMaze API.
let setup = (allEpisodes) => {
  header.replaceChildren();

  renderHeader(allEpisodes);
  renderEpisodeListContainer();
  renderEpisodeCards(allEpisodes);
  renderFooter();
};

// Render header elements and adds search box event listener.
let renderHeader = (allEpisodes) => {
  let header = document.getElementById("header");
  let infoContainer = document.createElement("div");
  header.appendChild(infoContainer);
  infoContainer.id = "info-container";
  infoContainer.className = "info-container";
  infoContainer.innerText = "TV Show Project 400";

  let navigationContainer = document.createElement("div");
  header.appendChild(navigationContainer);
  navigationContainer.id = "navigation-container";
  navigationContainer.className = "navigation-container";

  let seriesSelector = document.createElement("select");
  navigationContainer.appendChild(seriesSelector);
  seriesSelector.id = "series-select-menu";
  seriesSelector.className = "select-menu";
  seriesSelector.name = "series-select-menu";
  seriesSelector.ariaLabel = "Select episode";
  renderSeriesSelectorList(allSeries);

  let episodeSelector = document.createElement("select");
  navigationContainer.appendChild(episodeSelector);
  episodeSelector.id = "episode-select-menu";
  episodeSelector.className = "select-menu";
  episodeSelector.name = "episode-select-menu";
  episodeSelector.ariaLabel = "Select episode";
  renderEpisodeSelectorList(allEpisodes);

  let searchBox = document.createElement("input");
  navigationContainer.appendChild(searchBox);
  searchBox.id = "search-box";
  searchBox.className = "search-box";
  searchBox.type = "text";
  searchBox.ariaLabel = "search";
  searchBox.placeholder = " Episode search...";

  let searchEpisodes = document.querySelector("#search-box");
  searchEpisodes.addEventListener("keyup", () =>
    searchAllEpisodes(searchEpisodes.value, allEpisodes)
  );

  let displayNumberOfEpisodes = document.createElement("span");
  navigationContainer.appendChild(displayNumberOfEpisodes);
  displayNumberOfEpisodes.id = "display-status";
  displayNumberOfEpisodes.className = "display-status";
  renderNumberOfEpisodes(allEpisodes.length, allEpisodes.length);
};

// Dynamically renders episodes in selector list and adds an event listener to the `select` element.
let renderEpisodeSelectorList = (allEpisodes) => {
  let episodeSelector = document.getElementById("episode-select-menu");
  let infoContainer = document.getElementById("info-container");

  let defaultEpisodeOption = document.createElement("option");
  episodeSelector.appendChild(defaultEpisodeOption);
  defaultEpisodeOption.innerText = "Select an episode...";
  defaultEpisodeOption.selected;

  allEpisodes.forEach((episode) => {
    let option = document.createElement("option");
    episodeSelector.appendChild(option);
    let episodeCode = getEpisodeCode(episode);
    option.value = episode.name;
    option.innerText = `${episodeCode} - ${episode.name}`;
  });

  episodeSelector.addEventListener("change", () => {
    searchAllEpisodes(episodeSelector.value, allEpisodes);
    renderBackButton();
  });
};

// Dynamically renders `seriesSelector` list
let renderSeriesSelectorList = () => {
  let seriesSelector = document.getElementById("series-select-menu");

  let defaultSeriesOption = document.createElement("option");
  seriesSelector.appendChild(defaultSeriesOption);
  defaultSeriesOption.innerText = "Select a series...";
  defaultSeriesOption.selected;

  getSortedSeries(allSeries).forEach((series) => {
    let option = document.createElement("option");
    seriesSelector.appendChild(option);
    option.value = series.id;
    option.innerText = `${series.name}`;
  });

  seriesSelector.addEventListener("change", () => {
    seriesID = seriesSelector.value;
    getEpisodeLibrary();
  });
};

// Sorts series list
let getSortedSeries = (allSeries) => {
  return allSeries.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  });
};

// Renders back navigation button and adds event listener.
let renderBackButton = () => {
  let navigationContainer = document.getElementById("navigation-container");
  navigationContainer.replaceChildren();

  let button = document.createElement("button");
  navigationContainer.appendChild(button);
  button.id = "back-button";
  button.className = "back-button";
  button.innerText = "Back to Library";

  button.addEventListener("click", () => setup(allEpisodes));
};

// Render remove all child elements of `root` and renders the `episodeListContainer`.
let renderEpisodeListContainer = () => {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  let episodeListContainer = document.createElement("div");
  rootElem.appendChild(episodeListContainer);
  episodeListContainer.id = "episode-list-container";
  episodeListContainer.className = "episode-list-container";
};

// Renders all episode elements stored in `allEpisodes`.
let renderEpisodeCards = (episodeList) => {
  let episodeListContainer = document.getElementById("episode-list-container");

  // Iterate through `episodeList` and render episode cards and add event listeners for TVMaze episode info.
  episodeList.forEach((episode) => {
    let card = document.createElement("article");
    episodeListContainer.appendChild(card);
    card.className = "episode-card";

    card.addEventListener("click", () => parent.open(episode.url));

    let cardTitle = document.createElement("h2");
    card.appendChild(cardTitle);
    cardTitle.innerText = episode.name;

    let combinedEpisodeSeason = document.createElement("div");
    card.appendChild(combinedEpisodeSeason);
    let episodeCode = getEpisodeCode(episode);
    combinedEpisodeSeason.innerText = episodeCode;

    let img = document.createElement("img");
    card.appendChild(img);
    img.src = episode.image.medium;
    img.alt = `${episode.name} front cover`;
    img.title = episode.name;

    let summary = document.createElement("div");
    card.appendChild(summary);
    summary.innerHTML = episode.summary;
  });
};

// Render footer with TVMaze licensing agreement.
let renderFooter = () => {
  const rootElem = document.getElementById("root");
  let footer = document.createElement("footer");
  rootElem.appendChild(footer);
  footer.className = "footer";
  footer.innerHTML =
    "<ul><li>All episode data from: <a href='https://www.tvmaze.com/api#licensing' target='Blank'>TVMaze.com</a></li></ul>";
};

// Format and return an episode code, format `S01E01`.
let getEpisodeCode = (episode) => {
  let formattedEpisodeCode = "";

  if (episode.season < 10) {
    formattedEpisodeCode += `S${episode.season.toString().padStart(2, "0")}`;
  } else {
    formattedEpisodeCode += `S${episode.season.toString()}`;
  }

  if (episode.number < 10) {
    formattedEpisodeCode += `E${episode.number.toString().padStart(2, "0")}`;
  } else {
    formattedEpisodeCode += `E${episode.number.toString()}`;
  }
  return formattedEpisodeCode;
};

// Search `allEpisodes` using the input value at `#searchBox` or episode selector, case insensitive.
let searchAllEpisodes = (value, allEpisodes) => {
  let filteredEpisodes = allEpisodes.filter((episode) => {
    return episode.name.toUpperCase().includes(value.toUpperCase());
  });
  updateDisplayedEpisodes(filteredEpisodes, allEpisodes);
};

// Updates the displayed episodes depending on search or selected episode.
let updateDisplayedEpisodes = (filteredEpisodes, allEpisodes) => {
  renderEpisodeListContainer();
  renderEpisodeCards(filteredEpisodes);
  renderNumberOfEpisodes(filteredEpisodes.length, allEpisodes.length);
};

// Dynamically update the number of episodes being viewed.
let renderNumberOfEpisodes = (numberOfFilteredEpisodes, numberOfEpisodes) => {
  let displayNumberOfEpisodes = document.getElementById("display-status");
  displayNumberOfEpisodes.innerText = `Displaying: ${numberOfFilteredEpisodes} / ${numberOfEpisodes} episodes.`;
};

// Pulls data from TVWiz API then loads the page.
window.onload = getEpisodeLibrary();
