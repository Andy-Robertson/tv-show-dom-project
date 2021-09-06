function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.className = "root";

  let header = document.createElement("header");
  rootElem.appendChild(header);
  header.className = "header";
  header.innerText = "HEADER";

  let episodeListContainer = document.createElement("div");
  rootElem.appendChild(episodeListContainer);
  episodeListContainer.className = "episodeListContainer";

  // function to iterate through `episodeList` and render episode cards
  episodeList.forEach((episode) => {
    let card = document.createElement("article");
    episodeListContainer.appendChild(card);
    card.className = "episodeCard";

    let cardTitle = document.createElement("h2");
    card.appendChild(cardTitle);
    cardTitle.innerText = episode.name;

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

    let summary = document.createElement("div");
    card.appendChild(summary);
    summary.innerHTML = episode.summary;
  });

  let footer = document.createElement("footer");
  rootElem.appendChild(footer);
  footer.className = "footer";
  footer.innerHTML =
    "<ul><li>All episode data from: <a href='https://www.tvmaze.com/api#licensing'>TVMaze.com</a></li></ul>";
}

window.onload = setup;
