// Stores all episode data from `fetch()`.
// This is necessary to ensure that the API data is only pulled once from TVMaze ensuring efficiency.
let allEpisodes = {};

// Gets all episode data from the TVMaze API, stores the result in `allEpisodes` variable and starts the page
// load when complete by calling `setup()`.
let getEpisodeLibrary = () => {
  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => response.json())
    .then((episodes) => {
      (allEpisodes = episodes), setup(allEpisodes);
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
  infoContainer.innerText = "TV Show Project 350";

  let navigationContainer = document.createElement("div");
  header.appendChild(navigationContainer);
  navigationContainer.id = "navigation-container";
  navigationContainer.className = "navigation-container";

  let selector = document.createElement("select");
  navigationContainer.appendChild(selector);
  selector.id = "select-menu";
  selector.className = "select-menu";
  selector.name = "select-menu";
  selector.ariaLabel = "Select episode";
  renderEpisodeSelectorList(allEpisodes);

  let searchBox = document.createElement("input");
  navigationContainer.appendChild(searchBox);
  searchBox.id = "search-box";
  searchBox.className = "search-box";
  searchBox.type = "text";
  selector.ariaLabel = "search";
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
  let select = document.getElementById("select-menu");
  let infoContainer = document.getElementById("info-container");

  let defaultOption = document.createElement("option");
  select.appendChild(defaultOption);
  defaultOption.innerText = "Select an episode...";
  defaultOption.selected; // Technically not needed but added to be concise.

  allEpisodes.forEach((episode) => {
    let option = document.createElement("option");
    select.appendChild(option);
    let episodeCode = getEpisodeCode(episode);
    option.value = episode.name;
    option.innerText = `${episodeCode} - ${episode.name}`;
  });

  let selector = document.getElementById("select-menu");
  selector.addEventListener("change", () => {
    searchAllEpisodes(selector.value, allEpisodes);
    renderBackButton();
    infoContainer.innerText = `Game of Thrones`;
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
