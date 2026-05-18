(function() {
  var GAMES = [
    {
      name: "Criminality",
      genre: "One Game",
      summary: "A single-game showcase built around a purple Criminality landing page.",
      status: "Featured",
      support: 100,
      card: "C"
    }
  ];

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

  function renderGrid(query) {
    var filtered = GAMES.filter(function(game) {
      if (!query) return true;
      return (game.name + " " + game.genre + " " + game.summary).toLowerCase().indexOf(query) !== -1;
    });

    var html = filtered.map(function(game) {
      return '' +
        '<article class="game-card">' +
          '<div class="game-card-media">' +
            '<div class="game-card-fallback" style="display:flex;">' + escapeHtml(game.card) + '</div>' +
            '<div class="game-card-img-overlay"></div>' +
          '</div>' +
          '<div class="game-card-body">' +
            '<h3>' + escapeHtml(game.name) + '</h3>' +
            '<p class="game-card-copy">' + escapeHtml(game.summary) + '</p>' +
            '<div class="game-card-support-wrap">' +
              '<span class="game-card-support-label">' + escapeHtml(game.genre) + '</span>' +
              '<div class="game-card-bar-track"><div class="game-card-bar-fill" style="width:' + escapeHtml(String(game.support)) + '%"></div></div>' +
            '</div>' +
            '<span class="game-card-avail">' + escapeHtml(game.status) + '</span>' +
          '</div>' +
        '</article>';
    }).join("");

    byId("gamesGrid").innerHTML = html;
    byId("gamesResultsLabel").textContent = "Showing " + filtered.length + " of " + GAMES.length + " games";
    byId("gamesSupportedChip").textContent = GAMES.length + " Game Listed";
  }

  var search = byId("gamesSearch");
  renderGrid("");

  search.addEventListener("input", function() {
    renderGrid(String(search.value || "").trim().toLowerCase());
  });
})();
