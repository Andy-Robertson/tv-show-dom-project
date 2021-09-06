// Loads page and sets event listeners.
let setup = () => {
  const allEpisodes = getAllEpisodes();

  renderNumberOfEpisodes(allEpisodes.length, allEpisodes.length);
  renderEpisodeCards(allEpisodes);
  renderFooter();

  let searchEpisodes = document.querySelector("#searchBox");
  searchEpisodes.addEventListener("keyup", () => {
    searchAllEpisodes();
  });
};

// Search `allEpisodes` using the value input at `#searchBox`, case insensitive.
let searchAllEpisodes = () => {
  let searchEpisodes = document.querySelector("#searchBox");
  const allEpisodes = getAllEpisodes();
  let filteredEpisodes = allEpisodes.filter((episode) => {
    return episode.name
      .toUpperCase()
      .includes(searchEpisodes.value.toUpperCase());
  });
  renderEpisodeCards(filteredEpisodes);
  renderNumberOfEpisodes(filteredEpisodes.length, allEpisodes.length);
};

// Dynamically renders and updates the number of episodes being viewed.
let renderNumberOfEpisodes = (numberOfFilteredEpisodes, numberOfEpisodes) => {
  let header = document.getElementById("header");
  let displayNumberOfEpisodes = document.createElement("span");

  header.removeChild(header.childNodes[2]);
  header.appendChild(displayNumberOfEpisodes);

  displayNumberOfEpisodes.id = "displayStatus";
  displayNumberOfEpisodes.className = "displayStatus";
  displayNumberOfEpisodes.innerText = `Displaying: ${numberOfFilteredEpisodes} / ${numberOfEpisodes} episodes`;
};

// Renders all episodes stored in `allEpisodes` and formats an episode code.
let renderEpisodeCards = (episodeList) => {
  const rootElem = document.getElementById("root");
  rootElem.replaceChildren([]);

  let episodeListContainer = document.createElement("div");
  rootElem.appendChild(episodeListContainer);
  episodeListContainer.className = "episodeListContainer";

  // Iterate through `episodeList` and render episode cards.
  episodeList.forEach((episode) => {
    let card = document.createElement("article");
    episodeListContainer.appendChild(card);
    card.className = "episodeCard";

    let cardTitle = document.createElement("h2");
    card.appendChild(cardTitle);
    cardTitle.innerText = episode.name;

    // Checks and formats episodes and series into an episode code.
    let episodeCode = "";

    if (episode.season < 10) {
      episodeCode += `S${episode.season.toString().padStart(2, "0")}`;
    }

    if (episode.number < 10) {
      episodeCode += `E${episode.number.toString().padStart(2, "0")}`;
    }

    let combinedEpisodeSeason = document.createElement("div");
    card.appendChild(combinedEpisodeSeason);
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

// Renders a footer displaying TVMaze licensing agreement.
let renderFooter = () => {
  const rootElem = document.getElementById("root");
  let footer = document.createElement("footer");
  rootElem.appendChild(footer);
  footer.className = "footer";
  footer.innerHTML =
    "<ul><li>All episode data from: <a href='https://www.tvmaze.com/api#licensing'>TVMaze.com</a></li></ul>";
};

window.onload = setup;
