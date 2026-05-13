(function () {
  var GAMES = [
    { acronym: "APOC2",  full: "Apocalypse Rising 2"       },
    { acronym: "BRM5",   full: "Blackhawk Rescue Mission 5" },
    { acronym: "FS",     full: "Fallen Survival"            },
    { acronym: "PF",     full: "Phantom Forces"             },
    { acronym: "DL",     full: "Deadline"                   }
  ];

  var acronymEl  = document.getElementById("heroTypeAcronym");
  var fullnameEl = document.getElementById("heroTypeFullname");
  var trackEl    = document.getElementById("heroGameTrack");

  if (!acronymEl || !fullnameEl) return;

  // --- duplicate pills so the infinite scroll loop is seamless ---
  if (trackEl) {
    var pills = Array.prototype.slice.call(trackEl.querySelectorAll(".hero-game-pill"));
    pills.forEach(function (pill) {
      var clone = pill.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      trackEl.appendChild(clone);
    });
  }

  var currentIndex = 0;
  var typeTimer = null;

  function getPills() {
    // only original (non-cloned) pills
    return trackEl
      ? Array.prototype.slice.call(trackEl.querySelectorAll(".hero-game-pill:not([aria-hidden])"))
      : [];
  }

  function setActivePill(index) {
    getPills().forEach(function (pill, i) {
      pill.classList.toggle("is-active", i === index);
    });
  }

  // --- typewriter ---
  function typeOut(text, callback) {
    var i = 0;
    acronymEl.textContent = "";
    clearInterval(typeTimer);
    typeTimer = setInterval(function () {
      acronymEl.textContent = text.slice(0, ++i);
      if (i >= text.length) {
        clearInterval(typeTimer);
        if (callback) setTimeout(callback, 3200);
      }
    }, 130);
  }

  function eraseOut(callback) {
    clearInterval(typeTimer);
    typeTimer = setInterval(function () {
      var current = acronymEl.textContent;
      if (current.length === 0) {
        clearInterval(typeTimer);
        if (callback) callback();
        return;
      }
      acronymEl.textContent = current.slice(0, -1);
    }, 90);
  }

  function showGame(index) {
    var game = GAMES[index];
    setActivePill(index);

    // fade out full name, swap, fade in
    fullnameEl.style.opacity = "0";
    setTimeout(function () {
      fullnameEl.textContent = game.full;
      fullnameEl.style.opacity = "1";
    }, 250);

    typeOut(game.acronym, function () {
      eraseOut(function () {
        currentIndex = (index + 1) % GAMES.length;
        showGame(currentIndex);
      });
    });
  }

  // pill click: jump to that game
  getPills().forEach(function (pill, i) {
    pill.addEventListener("click", function (e) {
      e.preventDefault();
      clearInterval(typeTimer);
      currentIndex = i;
      showGame(i);
    });
  });

  // kick off
  showGame(0);
})();
