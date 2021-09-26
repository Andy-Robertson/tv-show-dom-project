// ------------------] FETCH & SORT DATA [------------------ //

// Fetch all episode data from the TVMaze API, stores the result in `allEpisodes` function scoped variable.
let getEpisodeLibrary = (showID, allShows) => {
  fetch(`https://api.tvmaze.com/shows/${showID}/episodes`)
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
      const allEpisodes = episodes;
      renderEpisodesPage(allEpisodes, allShows);
    })
    .catch((error) => console.log(`Error received: ${error}`));
};

// Gets all shows using `getAllShows()` function, sorts shows alphabetically and stores them in function scoped variable `allShows`.
let getSortedShows = () => {
  const shows = getAllShows();

  return shows.sort((a, b) => {
    const showA = a.name.toUpperCase();
    const showB = b.name.toUpperCase();

    let comparison = 0;
    if (showA > showB) {
      comparison = 1;
    } else if (showA < showB) {
      comparison = -1;
    }
    return comparison;
  });
};

// ------------------] INITIALIZE PAGE [------------------ //

// Loads page with shows displayed.
let setup = () => {
  renderHeader();
  renderMainContentContainer();
  renderShowsPage();
  renderFooter();
};

// ------------------] RENDER ELEMENTS [------------------ //

// Renders all shows pulled using the `getAllShows` function and sets the page title.
let renderShowsPage = () => {
  const allShows = getSortedShows();
  let infoContainer = document.getElementById("info-container");
  infoContainer.innerText = "TV Show Project";

  renderShowPageHeaderInteractables(allShows);
  renderShowListContainer(allShows);
  renderAllShows(allShows);
};

// Renders all shows interactable header elements.
let renderShowPageHeaderInteractables = (allShows) => {
  removeNavContainerChildren();
  renderShowSearchBox(allShows);
  renderNumberOfShowsFound(allShows);
  renderShowSelector(allShows);
};

// Renders all episodes pulled from the TVMaze API.
let renderEpisodesPage = (allEpisodes, allShows) => {
  renderEpisodesPageHeaderInteractables(allEpisodes, allShows);
  renderEpisodeListContainer();
  renderEpisodeCards(allEpisodes);
};

// Renders all episode interactable header elements.
let renderEpisodesPageHeaderInteractables = (allEpisodes, allShows) => {
  removeNavContainerChildren();
  renderBackButtonShows(allShows);
  renderEpisodeSelector(allEpisodes);
  renderEpisodeSearchBox(allEpisodes);
  renderNumberOfEpisodes(allEpisodes);
};

// Renders header structure.
let renderHeader = () => {
  let header = document.getElementById("header");
  let infoContainer = document.createElement("h1");
  header.appendChild(infoContainer);
  infoContainer.id = "info-container";
  infoContainer.className = "info-container";

  let navigationContainer = document.createElement("nav");
  header.appendChild(navigationContainer);
  navigationContainer.id = "navigation-container";
  navigationContainer.className = "navigation-container";
};

// Renders the episode selector in the header.
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
let renderEpisodeSearchBox = (allEpisodes) => {
  let navigationContainer = document.getElementById("navigation-container");
  let searchBox = document.createElement("input");
  navigationContainer.appendChild(searchBox);
  searchBox.id = "episode-search-box";
  searchBox.className = "search-box";
  searchBox.type = "text";
  searchBox.ariaLabel = "search";
  searchBox.placeholder = " Episode search...";

  let searchEpisodes = document.querySelector("#episode-search-box");
  searchEpisodes.addEventListener("keyup", () =>
    searchAllEpisodes(searchEpisodes.value, allEpisodes, searchBox.id)
  );
};

// Renders show search box in the header & attaches event listener.
let renderShowSearchBox = (allShows) => {
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
  renderShowSelectorList(allShows, allShows);
};

// Renders number of episodes displayed.
let renderNumberOfEpisodes = (allEpisodes) => {
  let navigationContainer = document.getElementById("navigation-container");
  let displayNumberOfEpisodes = document.createElement("span");
  navigationContainer.appendChild(displayNumberOfEpisodes);
  displayNumberOfEpisodes.id = "episodes-displayed";
  displayNumberOfEpisodes.className = "cards-displayed";
  updateNumberOfEpisodes(allEpisodes.length, allEpisodes.length);
};

// Renders number of shows displayed.
let renderNumberOfShowsFound = (allShows) => {
  let navigationContainer = document.getElementById("navigation-container");
  let displayNumberOfShowsFound = document.createElement("span");
  navigationContainer.appendChild(displayNumberOfShowsFound);
  displayNumberOfShowsFound.id = "shows-displayed";
  displayNumberOfShowsFound.className = "cards-displayed";
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
    searchAllEpisodes(episodeSelector.value, allEpisodes, episodeSelector.iD);
    renderBackButtonEpisodes(allEpisodes);
  });
};

// Renders `showSelector` list, indirectly adds feedback when a search term is not found (thought this was cool!).
let renderShowSelectorList = (shows, allShows) => {
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
    defaultShowOption.innerText = "Not in database!";
    defaultShowOption.selected;
  }

  showSelector.addEventListener("change", () => {
    getEpisodeLibrary(showSelector.value, allShows);

    let infoContainer = document.getElementById("info-container");
    infoContainer.innerText = "TV Show Project";
  });
};

// Renders back navigation button to event and adds event listener.
let renderBackButtonEpisodes = (allEpisodes) => {
  let navigationContainer = document.getElementById("navigation-container");
  removeNavContainerChildren();

  let button = document.createElement("button");
  navigationContainer.appendChild(button);
  button.id = "back-button";
  button.className = "back-button";
  button.innerText = "Back to Episodes";

  button.addEventListener("click", () => renderEpisodesPage(allEpisodes));
};

// Renders back navigation button to shows page and adds event listener.
let renderBackButtonShows = (allShows) => {
  let navigationContainer = document.getElementById("navigation-container");
  removeNavContainerChildren();

  let button = document.createElement("button");
  navigationContainer.appendChild(button);
  button.id = "back-button";
  button.className = "back-button";
  button.innerText = "Back to Shows";

  button.addEventListener("click", () => {
    renderShowsPage(allShows);
    window.scrollTo(0, 0);
  });
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
    card.tabIndex = 0;
    card.ariaLabel = `${show.name} TV Show`;

    if (localStorage.getItem(show.name)) {
      card.classList.add("add-fav-show");
    }

    let cardTitle = document.createElement("h2");
    card.appendChild(cardTitle);
    cardTitle.innerText = show.name;

    let showContentContainer = document.createElement("div");
    card.appendChild(showContentContainer);
    showContentContainer.id = "show-content-container";
    showContentContainer.className = "show-content-container";

    let img = document.createElement("img");
    showContentContainer.appendChild(img);

    show.image === null
      ? (img.src = "img/image-not-found.jpg")
      : (img.src = show.image.medium);

    img.alt = `${show.name} front cover`;
    img.title = show.name;

    let summaryContainer = document.createElement("div");
    showContentContainer.appendChild(summaryContainer);

    let summary = document.createElement("p");
    summaryContainer.appendChild(summary);
    let formattedSummary = getFormattedSummaryText(show.summary);
    summary.innerHTML = truncateCardText(formattedSummary, 680);

    card.addEventListener("click", () => {
      getEpisodeLibrary(card.value, allShows);
      let infoContainer = document.getElementById("info-container");
      infoContainer.innerText = show.name;
    });

    let readMoreButton = document.createElement("button");
    summaryContainer.appendChild(readMoreButton);
    readMoreButton.id = "show-read-more-button";
    readMoreButton.className = "read-more-button";
    readMoreButton.innerText = "Read More";

    readMoreButton.addEventListener("click", (event) => {
      event.stopPropagation();
      parent.open(show.url);
    });

    let favButton = document.createElement("button");
    summaryContainer.appendChild(favButton);
    favButton.id = "show-fav-button";
    favButton.className = "show-fav-button";
    favButton.innerText = "Favorite";

    favButton.addEventListener("click", (event) => {
      event.stopPropagation();
      setShowFavoriteStatus(show.name, allShows);
    });

    let showInfoContainer = document.createElement("div");
    showContentContainer.appendChild(showInfoContainer);
    showInfoContainer.id = "show-info-container";
    showInfoContainer.className = "show-info-container";

    let ul = document.createElement("ul");
    showInfoContainer.appendChild(ul);

    let showRating = document.createElement("li");
    ul.appendChild(showRating);
    showRating.innerHTML = `<b>Rating:</b> ${show.rating.average}`;

    let showGenres = document.createElement("li");
    ul.appendChild(showGenres);
    showGenres.innerHTML = `<b>Genres:</b> ${show.genres}`;

    let showStatus = document.createElement("li");
    ul.appendChild(showStatus);
    showStatus.innerHTML = `<b>Status:</b> ${show.status}`;

    let showRuntime = document.createElement("li");
    ul.appendChild(showRuntime);
    showRuntime.innerHTML = `<b>Runtime:</b> ${show.runtime}`;

    let showPremiered = document.createElement("li");
    ul.appendChild(showPremiered);
    showPremiered.innerHTML = `<b>Premiered:</b> ${show.premiered}`;
  });
};

// Render episode cards, adds event listeners for TVMaze episode info and error corrects null images.
let renderEpisodeCards = (episodeList) => {
  let episodeListContainer = document.getElementById("episode-list-container");
  window.scrollTo(0, 0);

  episodeList.forEach((episode) => {
    let card = document.createElement("article");
    episodeListContainer.appendChild(card);
    card.className = "episode-card";
    card.tabIndex = 0;
    card.ariaLabel = `${episode.name} TV episode`;

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

    let summaryContainer = document.createElement("div");
    card.appendChild(summaryContainer);

    let summary = document.createElement("p");
    summaryContainer.appendChild(summary);
    summary.className = "summary-text";
    let formattedSummary = getFormattedSummaryText(episode.summary);
    summary.innerHTML = truncateCardText(formattedSummary, 270);

    let episodeMoreContainer = document.createElement("div");
    card.appendChild(episodeMoreContainer);

    let readMoreButton = document.createElement("button");
    episodeMoreContainer.appendChild(readMoreButton);
    readMoreButton.id = "episode-read-more-button";
    readMoreButton.className = "read-more-button";
    readMoreButton.innerText = "Read More";

    readMoreButton.addEventListener("click", () => parent.open(episode.url));
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

// Searches `allEpisodes` using the input value at `#search-box` and the selector `#episode-select-menu`, case insensitive.
let searchAllEpisodes = (value, allEpisodes, iD) => {
  let filteredEpisodes = allEpisodes.filter((episode) => {
    if (iD === "episode-search-box") {
      return episode.name.toUpperCase().includes(value.toUpperCase());
    } else {
      return episode.name.toUpperCase() === value.toUpperCase();
    }
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
  updateDisplayedShows(filteredShows, allShows);
};

// Updates the displayed episodes depending on search or selected episode.
let updateDisplayedEpisodes = (filteredEpisodes, allEpisodes) => {
  renderEpisodeListContainer();
  renderEpisodeCards(filteredEpisodes);
  updateNumberOfEpisodes(filteredEpisodes.length, allEpisodes.length);
};

// Updates the number of filtered `shows` depending on search or selected episode.
let updateDisplayedShows = (filteredShows, allShows) => {
  renderShowListContainer();
  renderAllShows(filteredShows);
  updateNumberOfShowsFound(filteredShows.length);
  renderShowSelectorList(filteredShows, allShows);
};

// Updates the number of episodes being viewed.
let updateNumberOfEpisodes = (numberOfFilteredEpisodes, numberOfEpisodes) => {
  let displayNumberOfEpisodes = document.getElementById("episodes-displayed");
  displayNumberOfEpisodes.innerText = `${numberOfFilteredEpisodes} / ${numberOfEpisodes} episodes.`;
};

// Updates the number of shows found.
let updateNumberOfShowsFound = (numberOfShows) => {
  let displayNumberOfShows = document.getElementById("shows-displayed");
  displayNumberOfShows.innerText = `Found ${numberOfShows} shows.`;
};

// Removes all child elements of the `#navigation-container`.
let removeNavContainerChildren = () => {
  let navigationContainer = document.getElementById("navigation-container");
  navigationContainer.replaceChildren();
};

// Truncate text on cards when required and add an ellipses to the end of the string.
let truncateCardText = (summary, requiredLength) => {
  return summary.length > requiredLength
    ? summary.substr(0, requiredLength) + "<b>&hellip;</b>"
    : summary;
};

// Format summary text - strip out all <p> tags.
let getFormattedSummaryText = (summary) => {
  return summary.replace(/<\/?p[^>]*>/g, "");
};

// Stickies the nav container to the top of the page when scrolling.
let navBehaviourOnScroll = () => {
  let navigationContainer = document.getElementById("navigation-container");
  let sticky = navigationContainer.offsetTop;

  if (window.pageYOffset > sticky) {
    navigationContainer.classList.add("nav-sticky");
  } else {
    navigationContainer.classList.remove("nav-sticky");
  }
};

// Set show favorite status and stores as a boolean in local storage.
let setShowFavoriteStatus = (showName, allShows) => {
  if (localStorage.getItem(showName)) {
    localStorage.removeItem(showName);
    renderShowsPage(allShows);
  } else {
    localStorage.setItem(showName, true);
    renderShowsPage(allShows);
  }
};

// Loads the page.
window.onload = setup();

// Sets floating nav menu behaviour
window.onscroll = function () {
  navBehaviourOnScroll();
};
