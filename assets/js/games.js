(function() {
  // Majority of this page behavior is driven by this editable array.
  var GAMES = [
    { name: "Fallen Survival", maybe: false, placeId: 10228136016, imageUrl: "" },
    { name: "RiotFall", maybe: false, placeId: 7796842481, imageUrl: "" },
    { name: "Frontlines", maybe: false, placeId: 5938036553, imageUrl: "" },
    { name: "BRM5", maybe: false, placeId: 2916899287, imageUrl: "" },
    { name: "State of Anarchy", maybe: true, placeId: 2000062521, imageUrl: "" },
    { name: "Project Delta", maybe: true, placeId: 7336302630, imageUrl: "" },
    { name: "Phantom Forces", maybe: false, placeId: 292439477, imageUrl: "" },
    { name: "Scorched Earth", maybe: false, placeId: 13794093709, imageUrl: "" },
    { name: "The Armory", maybe: true, placeId: 115209351507608, imageUrl: "" }
  ];

  var state = {
    query: "",
    iconByPlaceId: {},
    imageFailed: {}
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getImageSrc(game) {
    if (game.placeId && state.iconByPlaceId[game.placeId]) {
      return state.iconByPlaceId[game.placeId];
    }
    if (game.imageUrl) {
      return game.imageUrl;
    }
    return "";
  }

  function getVisibleGames() {
    var query = state.query.trim().toLowerCase();
    var games = GAMES.filter(function(game) {
      if (!query) return true;
      return game.name.toLowerCase().indexOf(query) >= 0;
    });

    return games;
  }

  function renderGrid() {
    var games = getVisibleGames();
    var html = games.map(function(game, index) {
      var imageSrc = getImageSrc(game);
      var failed = !!state.imageFailed[game.name];
      var playHref = game.placeId
        ? ("https://www.roblox.com/games/" + encodeURIComponent(game.placeId))
        : ("https://www.roblox.com/discover/?Keyword=" + encodeURIComponent(game.name));
      var errorClass = failed ? " has-error" : "";

      return '' +
        '<article class="game-card' + errorClass + '">' +
          '<div class="game-card-media">' +
            '<img class="game-card-image" data-game-name="' + escapeHtml(game.name) + '" src="' + escapeHtml(imageSrc) + '" alt="' + escapeHtml(game.name) + ' cover" loading="lazy" />' +
            '<span class="game-card-fallback" aria-hidden="true">' + escapeHtml((game.name || "?").charAt(0).toUpperCase()) + '</span>' +
          '</div>' +
          '<div class="game-card-body">' +
            '<h3>' + escapeHtml(game.name) + '</h3>' +
            '<div class="game-card-actions">' +
              '<a class="game-card-btn" href="' + playHref + '" target="_blank" rel="noopener">Play on Roblox</a>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join("");

    byId("gamesGrid").innerHTML = html;
    byId("gamesResultsLabel").textContent = "Showing " + games.length + " of " + GAMES.length + " games";

    Array.prototype.forEach.call(document.querySelectorAll(".game-card-image"), function(img) {
      img.addEventListener("error", function() {
        var gameName = img.getAttribute("data-game-name") || "";
        state.imageFailed[gameName] = true;
        var card = img.closest(".game-card");
        if (card) card.classList.add("has-error");
      });
    });
  }

  function updateCounts() {
    byId("gamesSupportedChip").textContent = GAMES.length + " Games Listed";
  }

  function wireControls() {
    var search = byId("gamesSearch");

    search.addEventListener("input", function() {
      state.query = search.value || "";
      renderGrid();
    });
  }

  function loadIcons() {
    var placeIds = GAMES.filter(function(game) { return !!game.placeId; })
      .map(function(game) { return game.placeId; })
      .join(",");

    if (!placeIds) {
      return Promise.resolve();
    }

    var url = "https://thumbnails.roproxy.com/v1/places/gameicons?placeIds=" + placeIds + "&size=512x512&format=Png&isCircular=false";

    return fetch(url, {
      headers: { Accept: "application/json" }
    }).then(function(res) {
      if (!res.ok) throw new Error("Could not load game icons");
      return res.json();
    }).then(function(json) {
      var rows = json && Array.isArray(json.data) ? json.data : [];
      rows.forEach(function(row) {
        if (row && row.targetId && row.imageUrl) {
          state.iconByPlaceId[row.targetId] = row.imageUrl;
        }
      });
    }).catch(function() {
      // Keep custom image URLs if Roblox icon API is unavailable.
    });
  }

  loadIcons().then(function() {
    updateCounts();
    wireControls();
    renderGrid();
  });
})();
