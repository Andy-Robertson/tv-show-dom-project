// Loads page.
let setup = () => {
  const allEpisodes = getAllEpisodes();
  renderHeader();
  renderEpisodeCards(allEpisodes);
  renderFooter();
};

// Render header elements and adds search box event listener.
let renderHeader = () => {
  const allEpisodes = getAllEpisodes();

  let header = document.getElementById("header");
  let episodeTitleContainer = document.createElement("div");
  header.appendChild(episodeTitleContainer);
  episodeTitleContainer.id = "episode-title-container";
  episodeTitleContainer.className = "episode-title-container";
  episodeTitleContainer.innerText = "TV Show Project 300";

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
  renderEpisodeSelectorList();

  let searchBox = document.createElement("input");
  navigationContainer.appendChild(searchBox);
  searchBox.id = "search-box";
  searchBox.className = "search-box";
  searchBox.type = "text";
  selector.ariaLabel = "search";
  searchBox.placeholder = " Episode search...";

  let searchEpisodes = document.querySelector("#search-box");
  searchEpisodes.addEventListener("keyup", () => {
    searchAllEpisodes();
  });

  let displayNumberOfEpisodes = document.createElement("span");
  navigationContainer.appendChild(displayNumberOfEpisodes);
  displayNumberOfEpisodes.id = "display-status";
  displayNumberOfEpisodes.className = "display-status";
  renderNumberOfEpisodes(allEpisodes.length, allEpisodes.length);
};

// Dynamically renders episodes in selector list and adds an event listener to the `select` element.
// Originally I attached a "click" listener to each `option` using the loop which worked in Firefox but it didn't work in chrome
// so the workaround I found was to use "change" on the `select` element and pass the `selector.value` instead of the `episode.name`
// As the `selector.value` is equal to `episode.name` I think(hope) this is ok to pull the data from the DOM and not directly from the object???
let renderEpisodeSelectorList = () => {
  let select = document.getElementById("select-menu");
  let episodeTitle = document.getElementById("episode-title-container");

  let defaultOption = document.createElement("option");
  select.appendChild(defaultOption);
  defaultOption.innerText = "Select an episode...";
  defaultOption.selected; // technically not needed but added to be concise.

  const allEpisodes = getAllEpisodes();
  allEpisodes.forEach((episode) => {
    let option = document.createElement("option");
    select.appendChild(option);
    let episodeCode = getEpisodeCode(episode);
    option.value = episode.name;
    option.innerText = `${episodeCode} - ${episode.name}`;
  });

  let selector = document.getElementById("select-menu");
  selector.addEventListener("change", () => {
    searchForSelectedEpisode(selector.value);
    renderBackButton();
    episodeTitle.innerText = `Game of Thrones`;
  });
};

// Renders back navigation button and adds event listener
let renderBackButton = () => {
  let navigationContainer = document.getElementById("navigation-container");
  navigationContainer.replaceChildren([]);

  let button = document.createElement("button");
  navigationContainer.appendChild(button);
  button.id = "back-button";
  button.className = "back-button";
  button.innerText = "Back to Library";

  button.addEventListener("click", () => {
    header.replaceChildren([]);
    setup();
  });
};

// Renders all episode elements stored in `allEpisodes`.
let renderEpisodeCards = (episodeList) => {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren([]);

  let episodeListContainer = document.createElement("div");
  rootElem.appendChild(episodeListContainer);
  episodeListContainer.className = "episode-list-container";

  // Iterate through `episodeList` and render episode cards and add event listeners for TVMaze episode info.
  episodeList.forEach((episode) => {
    let card = document.createElement("article");
    episodeListContainer.appendChild(card);
    card.className = "episode-card";

    card.addEventListener("click", () => {
      parent.open(episode.url);
    });

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
  let code = "";
  if (episode.season <= 10) {
    code += `S${episode.season.toString().padStart(2, "0")}`;
  }
  if (episode.number <= 10) {
    code += `E${episode.number.toString().padStart(2, "0")}`;
  }
  return code;
};

// Search `allEpisodes` using the input vale at `#searchBox`, case insensitive,
// calls render function and updates number of filtered episodes.
let searchAllEpisodes = () => {
  let searchEpisodes = document.querySelector("#search-box");
  const allEpisodes = getAllEpisodes();
  let filteredEpisodes = allEpisodes.filter((episode) => {
    return episode.name
      .toUpperCase()
      .includes(searchEpisodes.value.toUpperCase());
  });
  renderEpisodeCards(filteredEpisodes);
  renderNumberOfEpisodes(filteredEpisodes.length, allEpisodes.length);
};

// Search `allEpisodes` for selected episode
// calls render function and updates number of filtered episodes.
let searchForSelectedEpisode = (value) => {
  const allEpisodes = getAllEpisodes();
  let filteredEpisodes = allEpisodes.filter((episode) => {
    return episode.name === value;
  });

  renderEpisodeCards(filteredEpisodes);
  renderNumberOfEpisodes(filteredEpisodes.length, allEpisodes.length);
};

// Dynamically update the number of episodes being viewed.
let renderNumberOfEpisodes = (numberOfFilteredEpisodes, numberOfEpisodes) => {
  let displayNumberOfEpisodes = document.getElementById("display-status");
  displayNumberOfEpisodes.innerText = `Displaying: ${numberOfFilteredEpisodes} / ${numberOfEpisodes} episodes.`;
};

window.onload = setup;
