// ------------------] INITIALIZE PAGE [------------------ //

// Global variables to store episode and show data.
let allShows = getAllShows();
let allEpisodes = [];

// Gets all episode data from the TVMaze API, stores the result in `allEpisodes` global variable.
let getEpisodeLibrary = (showID) => {
  fetch(`https://api.tvmaze.com/shows/${showID}/episodes`)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        console.log("API Call");
        return response.json();
      } else {
        throw new Error(
          `Unexpected Error: ${response.status} ${response.statusText}`
        );
      }
    })
    .then((episodes) => {
      allEpisodes = episodes;
      renderEpisodesPage(allEpisodes);
    })
    .catch((error) => console.log(error));
};

// Loads page with shows displayed.
let setup = () => {
  allShows = getSortedShow(allShows);
  renderHeader();
  renderMainContentContainer();
  renderShowsPage();
  renderFooter();
};

// ------------------] RENDER ELEMENTS [------------------ //

// Renders all shows pulled using the `getAllShows` function and sets the page title.
let renderShowsPage = () => {
  let infoContainer = document.getElementById("info-container");
  infoContainer.innerText = "TV Show Project 500+";

  renderShowPageHeaderInteractables();
  renderShowListContainer();
  renderAllShows(allShows);
};

// Renders all shows interactable header elements.
let renderShowPageHeaderInteractables = () => {
  removeNavContainerChildren();
  renderShowSearchBox();
  renderNumberOfShowsFound();
  renderShowSelector(allShows);
};

// Renders all episodes pulled from the TVMaze API.
let renderEpisodesPage = () => {
  renderEpisodesPageHeaderInteractables();
  renderEpisodeListContainer();
  renderEpisodeCards(allEpisodes);
};

// Renders all shows interactable header elements.
let renderEpisodesPageHeaderInteractables = () => {
  removeNavContainerChildren();
  renderBackButtonShows();
  renderEpisodeSelector(allEpisodes);
  renderEpisodeSearchBox();
  renderNumberOfEpisodes();
};

// Renders header structure.
let renderHeader = () => {
  let header = document.getElementById("header");
  let infoContainer = document.createElement("div");
  header.appendChild(infoContainer);
  infoContainer.id = "info-container";
  infoContainer.className = "info-container";

  let navigationContainer = document.createElement("div");
  header.appendChild(navigationContainer);
  navigationContainer.id = "navigation-container";
  navigationContainer.className = "navigation-container";
};

// Renders the episode selector in the header
let renderEpisodeSelector = (allEpisodes) => {
  let navigationContainer = document.getElementById("navigation-container");
  let episodeSelector = document.createElement("select");
  navigationContainer.appendChild(episodeSelector);
  episodeSelector.id = "episode-select-menu";
  episodeSelector.className = "select-menu";
  episodeSelector.name = "episode-select-menu";
  episodeSelector.ariaLabel = "Select episode";
  renderEpisodeSelectorList(allEpisodes);
};

// Renders episode search box in the header & attaches event listener.
let renderEpisodeSearchBox = () => {
  let navigationContainer = document.getElementById("navigation-container");
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
};

// Renders show search box in the header & attaches event listener.
let renderShowSearchBox = () => {
  let navigationContainer = document.getElementById("navigation-container");
  let searchBox = document.createElement("input");
  navigationContainer.appendChild(searchBox);
  searchBox.id = "show-search-box";
  searchBox.className = "search-box";
  searchBox.type = "text";
  searchBox.ariaLabel = "search";
  searchBox.placeholder = " Filter show...";

  let searchShows = document.querySelector("#show-search-box");
  searchShows.addEventListener("keyup", () =>
    searchAllShows(searchShows.value, allShows)
  );
};

// Renders the show selector in the header.
let renderShowSelector = (allShows) => {
  let navigationContainer = document.getElementById("navigation-container");
  let showSelector = document.createElement("select");
  navigationContainer.appendChild(showSelector);
  showSelector.id = "show-select-menu";
  showSelector.className = "select-menu";
  showSelector.name = "show-select-menu";
  showSelector.ariaLabel = "Select show";
  renderShowSelectorList(allShows);
};

// Renders number of episodes displayed.
let renderNumberOfEpisodes = () => {
  let navigationContainer = document.getElementById("navigation-container");
  let displayNumberOfEpisodes = document.createElement("span");
  navigationContainer.appendChild(displayNumberOfEpisodes);
  displayNumberOfEpisodes.id = "display-status";
  displayNumberOfEpisodes.className = "display-status";
  updateNumberOfEpisodes(allEpisodes.length, allEpisodes.length);
};

// Renders number of shows displayed.
let renderNumberOfShowsFound = () => {
  let navigationContainer = document.getElementById("navigation-container");
  let displayNumberOfShowsFound = document.createElement("span");
  navigationContainer.appendChild(displayNumberOfShowsFound);
  displayNumberOfShowsFound.id = "display-status";
  displayNumberOfShowsFound.className = "display-status";
  updateNumberOfShowsFound(allShows.length);
};

// Renders episodes in selector list and adds an event listener to the `select` element.
let renderEpisodeSelectorList = (allEpisodes) => {
  let episodeSelector = document.getElementById("episode-select-menu");

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

// Renders `showSelector` list, indirectly adds feedback when a search term is not found (thought this was cool!).
let renderShowSelectorList = (shows) => {
  let showSelector = document.getElementById("show-select-menu");
  showSelector.replaceChildren();

  shows.forEach((show) => {
    let option = document.createElement("option");
    showSelector.appendChild(option);
    option.value = show.id;
    option.innerText = `${show.name}`;
  });

  if (shows < allShows.length) {
    let defaultShowOption = document.createElement("option");
    showSelector.appendChild(defaultShowOption);
    defaultShowOption.innerText = "Not in database";
    defaultShowOption.selected;
  }

  showSelector.addEventListener("change", () => {
    getEpisodeLibrary(showSelector.value);
    let infoContainer = document.getElementById("info-container");
    infoContainer.innerText = "TV Show Project 500+";
  });
};

// Renders back navigation button to event and adds event listener.
let renderBackButton = () => {
  let navigationContainer = document.getElementById("navigation-container");
  removeNavContainerChildren();

  let button = document.createElement("button");
  navigationContainer.appendChild(button);
  button.id = "back-button";
  button.className = "back-button";
  button.innerText = "Back to Episodes";

  button.addEventListener("click", () => renderEpisodesPage());
};

// Renders back navigation button to shows page and adds event listener.
let renderBackButtonShows = () => {
  let navigationContainer = document.getElementById("navigation-container");
  removeNavContainerChildren();

  let button = document.createElement("button");
  navigationContainer.appendChild(button);
  button.id = "back-button";
  button.className = "back-button";
  button.innerText = "Back to Shows";

  button.addEventListener("click", () => renderShowsPage());
};

// Renders main content container.
let renderMainContentContainer = () => {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren();

  let mainContentContainer = document.createElement("div");
  rootElem.appendChild(mainContentContainer);
  mainContentContainer.id = "main-content-container";
  mainContentContainer.className = "main-content-container";
};

// Renders `episodeListContainer` after removing all child elements of `contentContainer`.
let renderEpisodeListContainer = () => {
  const contentContainer = document.getElementById("main-content-container");
  contentContainer.replaceChildren();

  let episodeListContainer = document.createElement("div");
  contentContainer.appendChild(episodeListContainer);
  episodeListContainer.id = "episode-list-container";
  episodeListContainer.className = "episode-list-container";
};

// Renders `showListContainer` after removing all child elements of `contentContainer`.
let renderShowListContainer = () => {
  const contentContainer = document.getElementById("main-content-container");
  contentContainer.replaceChildren();

  let showListContainer = document.createElement("div");
  contentContainer.appendChild(showListContainer);
  showListContainer.id = "show-list-container";
  showListContainer.className = "show-list-container";
};

// Renders shows and error corrects null images.
let renderAllShows = (allShows) => {
  let showListContainer = document.getElementById("show-list-container");

  allShows.forEach((show) => {
    let card = document.createElement("article");
    showListContainer.appendChild(card);
    card.id = "show-card";
    card.className = "show-card";
    card.value = show.id;

    card.addEventListener("click", () => {
      getEpisodeLibrary(card.value);
      let infoContainer = document.getElementById("info-container");
      infoContainer.innerText = show.name;
    });

    let overviewContainer = document.createElement("div");
    card.appendChild(overviewContainer);
    overviewContainer.id = "overview-container";
    overviewContainer.className = "overview-container";

    let cardTitle = document.createElement("h2");
    overviewContainer.appendChild(cardTitle);
    cardTitle.innerText = show.name;

    let imgAndParagraphContainer = document.createElement("div");
    overviewContainer.appendChild(imgAndParagraphContainer);

    let img = document.createElement("img");
    imgAndParagraphContainer.appendChild(img);

    show.image === null
      ? (img.src = "img/image-not-found.jpg")
      : (img.src = show.image.medium);

    img.alt = `${show.name} front cover`;
    img.title = show.name;

    let summary = document.createElement("div");
    imgAndParagraphContainer.appendChild(summary);
    summary.innerHTML = show.summary;

    let showInfoContainer = document.createElement("div");
    card.appendChild(showInfoContainer);
    showInfoContainer.id = "show-info-container";
    showInfoContainer.className = "show-info-container";

    let ul = document.createElement("ul");
    showInfoContainer.appendChild(ul);

    let showRating = document.createElement("li");
    ul.appendChild(showRating);
    showRating.innerText = `Rating: ${show.rating.average}`;

    let showGenres = document.createElement("li");
    ul.appendChild(showGenres);
    showGenres.innerText = `Genres: ${show.genres}`;

    let showStatus = document.createElement("li");
    ul.appendChild(showStatus);
    showStatus.innerText = `Status: ${show.status}`;

    let showRuntime = document.createElement("li");
    ul.appendChild(showRuntime);
    showRuntime.innerText = `Runtime: ${show.runtime}`;
  });
};

// Render episode cards, adds event listeners for TVMaze episode info and error corrects null images.
let renderEpisodeCards = (episodeList) => {
  let episodeListContainer = document.getElementById("episode-list-container");

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

    episode.image === null
      ? (img.src = "img/image-not-found.jpg")
      : (img.src = episode.image.medium);

    img.alt = `${episode.name} front cover`;
    img.title = episode.name;

    let summary = document.createElement("div");
    card.appendChild(summary);
    summary.innerHTML = episode.summary;
  });
};

// Renders footer with TVMaze licensing agreement.
let renderFooter = () => {
  const rootElem = document.getElementById("root");
  let footer = document.createElement("footer");
  rootElem.appendChild(footer);
  footer.className = "footer";
  footer.innerHTML =
    "<ul><li>All episode data from: <a href='https://www.tvmaze.com/api#licensing' target='Blank'>TVMaze.com</a></li></ul>";
};

// ------------------] HELPER FUNCTIONS [------------------ //

// Sorts show list alphabetically.
let getSortedShow = (shows) => {
  return shows.sort((a, b) => {
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

// Formats and returns an episode code, format `S01E01`.
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

// Searches `allEpisodes` using the input value at `#search-box`, case insensitive.
let searchAllEpisodes = (value, allEpisodes) => {
  let filteredEpisodes = allEpisodes.filter((episode) => {
    return episode.name.toUpperCase().includes(value.toUpperCase());
  });
  updateDisplayedEpisodes(filteredEpisodes, allEpisodes);
};

// Searches `allShows` (name / genres / summary) using the input value at `#search-box`, case insensitive.
let searchAllShows = (value, allShows) => {
  let filteredShows = allShows.filter((show) => {
    let genres = show.genres.map((genre) => genre.toUpperCase());

    return (
      show.name.toUpperCase().includes(value.toUpperCase()) ||
      genres.includes(value.toUpperCase()) ||
      show.summary.toUpperCase().includes(value.toUpperCase())
    );
  });
  updateDisplayedShows(filteredShows);
};

// Updates the displayed episodes depending on search or selected episode.
let updateDisplayedEpisodes = (filteredEpisodes, allEpisodes) => {
  renderEpisodeListContainer();
  renderEpisodeCards(filteredEpisodes);
  updateNumberOfEpisodes(filteredEpisodes.length, allEpisodes.length);
};

// Updates the number of filtered `shows` depending on search or selected episode.
let updateDisplayedShows = (filteredShows) => {
  renderShowListContainer();
  renderAllShows(filteredShows);
  updateNumberOfShowsFound(filteredShows.length);
  renderShowSelectorList(filteredShows);
};

// Updates the number of episodes being viewed.
let updateNumberOfEpisodes = (numberOfFilteredEpisodes, numberOfEpisodes) => {
  let displayNumberOfEpisodes = document.getElementById("display-status");
  displayNumberOfEpisodes.innerText = `Displaying: ${numberOfFilteredEpisodes} / ${numberOfEpisodes} episodes.`;
};

// Updates the number of shows found.
let updateNumberOfShowsFound = (numberOfShows) => {
  let displayNumberOfShows = document.getElementById("display-status");
  displayNumberOfShows.innerText = `Found ${numberOfShows} shows.`;
};

// Removes all child elements of the `#navigation-container`.
let removeNavContainerChildren = () => {
  let navigationContainer = document.getElementById("navigation-container");
  navigationContainer.replaceChildren();
};

// Loads the page.
window.onload = setup();
