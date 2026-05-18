(function() {
  var LOADOUT_SUPPORT_OVERRIDES = [
    { title: "Night Shift", support: 100 },
    { title: "Back Alley", support: 95 },
    { title: "Midnight Run", support: 88 },
    { title: "Safehouse", support: 92 },
    { title: "Courier", support: 84 }
  ];
  var CRIMINALITY_LOADOUTS = [
    {
      title: "Night Shift",
      platform: "Stealth",
      version: "Glass Purple",
      updatedDate: "Live now",
      online: true,
      updateStatus: true,
      free: true,
      cost: "Free",
      arsSupport: 100,
      uncPercentage: 98,
      suncPercentage: 89,
      decompiler: false,
      multiInject: true,
      keysystem: false,
      extype: "local",
      detected: false,
      websitelink: "#",
      discordlink: "#",
      purchaselink: "#"
    },
    {
      title: "Back Alley",
      platform: "Assault",
      version: "Violet Rush",
      updatedDate: "Live now",
      online: true,
      updateStatus: true,
      free: false,
      cost: "Premium",
      arsSupport: 95,
      uncPercentage: 92,
      suncPercentage: 85,
      decompiler: true,
      multiInject: true,
      keysystem: true,
      extype: "local",
      detected: false,
      websitelink: "#",
      discordlink: "#",
      purchaselink: "#"
    },
    {
      title: "Midnight Run",
      platform: "Support",
      version: "One Game Only",
      updatedDate: "Live now",
      online: true,
      updateStatus: true,
      free: true,
      cost: "Free",
      arsSupport: 88,
      uncPercentage: 90,
      suncPercentage: 82,
      decompiler: false,
      multiInject: false,
      keysystem: false,
      extype: "local",
      detected: false,
      websitelink: "#",
      discordlink: "#",
      purchaselink: "#"
    },
    {
      title: "Safehouse",
      platform: "Utility",
      version: "Scene Builder",
      updatedDate: "Live now",
      online: true,
      updateStatus: true,
      free: false,
      cost: "Premium",
      arsSupport: 92,
      uncPercentage: 94,
      suncPercentage: 87,
      decompiler: true,
      multiInject: false,
      keysystem: true,
      extype: "local",
      detected: false,
      websitelink: "#",
      discordlink: "#",
      purchaselink: "#"
    },
    {
      title: "Courier",
      platform: "Stealth",
      version: "Fast Lane",
      updatedDate: "Live now",
      online: true,
      updateStatus: true,
      free: true,
      cost: "Free",
      arsSupport: 84,
      uncPercentage: 86,
      suncPercentage: 78,
      decompiler: false,
      multiInject: true,
      keysystem: false,
      extype: "local",
      detected: false,
      websitelink: "#",
      discordlink: "#",
      purchaselink: "#"
    }
  ];
  var arsSupportByTitle = LOADOUT_SUPPORT_OVERRIDES.reduce(function(map, entry) {
    var key = normalizeTitle(entry && entry.title);
    if (key) map[key] = clampPercent(entry && entry.support);
    return map;
  }, {});
  var state = {
    platform: "All",
    price: "All",
    search: ""
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

  function badge(label, type) {
    return '<span class="exec-badge exec-badge-' + type + '">' + escapeHtml(label) + '</span>';
  }

  function clampPercent(value) {
    var number = Number(value);
    if (isNaN(number)) return 0;
    return Math.max(0, Math.min(100, Math.round(number)));
  }

  function statusTone(executor) {
    if (isOnline(executor)) return "success";
    return "danger";
  }

  function isOnline(executor) {
    if (typeof executor.online === "boolean") return executor.online;
    return !!executor.updateStatus;
  }

  function normalizeTitle(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getArsSupport(executor) {
    var title = normalizeTitle(executor && executor.title);
    if (Object.prototype.hasOwnProperty.call(arsSupportByTitle, title)) {
      return arsSupportByTitle[title];
    }
    return clampPercent(executor.arsSupport);
  }

  function percentageTone(percent) {
    if (percent >= 80) return "success";
    if (percent >= 50) return "warn";
    return "danger";
  }

  function isPaid(executor) {
    return !executor.free;
  }

  function normalizePlatform(platform) {
    return platform || "Unknown";
  }

  function shouldShowExecutor(executor) {
    var platform = normalizePlatform(executor.platform);
    var type = String(executor.extype || "").toLowerCase();

    if (platform === "Windows" && type === "wexternal") {
      return false;
    }

    return true;
  }

  function fetchJson(path) {
    return fetch(API_BASE + path, {
      headers: {
        Accept: "application/json"
      }
    }).then(function(response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status + " while fetching " + path);
      }
      return response.json();
    });
  }

  function renderVersions(cards) {
    var list = Array.isArray(cards) ? cards : [];

    byId("versionCards").innerHTML = list.map(function(item) {
      return '' +
        '<article class="version-item">' +
          '<div>' +
            '<p class="version-label">' + escapeHtml(item.label) + '</p>' +
            '<p class="version-date">' + escapeHtml(item.note || "Live Criminality setup") + '</p>' +
          '</div>' +
          '<div class="version-tag">' + escapeHtml(item.version || "Ready") + '</div>' +
        '</article>';
    }).join("");
  }

  function renderStats(executors) {
    var total = executors.length;
    var working = executors.filter(function(item) { return !!item.updateStatus; }).length;
    var free = executors.filter(function(item) { return !!item.free; }).length;
    var paid = executors.filter(function(item) { return !item.free; }).length;

    byId("statTotal").textContent = total;
    byId("statWorking").textContent = working;
    byId("statFree").textContent = free;
    byId("statPaid").textContent = paid;
  }

  function getAdvisoryText(executor) {
    if (executor.recommendedReason && Array.isArray(executor.recommendedReason.features) && executor.recommendedReason.features.length) {
      return executor.recommendedReason.features.join(" ");
    }
    if (executor.detected) {
      return "This loadout was flagged during internal testing and should be treated as experimental.";
    }
    return "This Criminality loadout is tuned for the new purple theme and works without any external feed.";
  }

  function createExpandedFacts(executor) {
    var fields = [
      ["UNC Percentage", executor.uncPercentage != null ? executor.uncPercentage + "%" : "N/A", false],
      ["sUNC Percentage", executor.suncPercentage != null ? executor.suncPercentage + "%" : "N/A", false],
      ["Decompiler", executor.decompiler ? "Yes" : "No", executor.decompiler],
      ["Multi-Inject", executor.multiInject ? "Yes" : "No", executor.multiInject]
    ];

    return fields.map(function(entry) {
      return '' +
        '<div class="exec-fact">' +
          '<span class="exec-fact-label">' + escapeHtml(entry[0]) + ':</span>' +
          '<strong class="exec-fact-value' + (entry[2] ? ' is-yes' : '') + '">' + escapeHtml(entry[1]) + '</strong>' +
        '</div>';
    }).join("");
  }

  function createActionButtons(executor) {
    var buttons = [];
    if (executor.websitelink) {
      buttons.push('<a class="policy-btn policy-btn-primary" href="' + escapeHtml(executor.websitelink) + '" target="_blank">Website</a>');
    }
    if (executor.discordlink) {
      buttons.push('<a class="policy-btn policy-btn-ghost" href="' + escapeHtml(executor.discordlink) + '" target="_blank">Discord</a>');
    }
    if (executor.purchaselink) {
      buttons.push('<a class="policy-btn policy-btn-ghost" href="' + escapeHtml(executor.purchaselink) + '" target="_blank">Purchase</a>');
    }
    return buttons.join("");
  }

  function renderExecutors(executors) {
    var filtered = executors.filter(function(item) {
      if (!shouldShowExecutor(item)) return false;

      var platformMatch = state.platform === "All" || normalizePlatform(item.platform) === state.platform;
      var priceMatch = state.price === "All" || (state.price === "Free" ? !isPaid(item) : isPaid(item));
      var searchText = (item.title + " " + (item.version || "") + " " + (item.extype || "")).toLowerCase();
      var searchMatch = !state.search || searchText.indexOf(state.search) !== -1;
      return platformMatch && priceMatch && searchMatch;
    });

    var resultsCount = byId("resultsCount");
    if (resultsCount) {
      resultsCount.textContent = filtered.length;
    }

    var groups = {};
    filtered.forEach(function(item) {
      var platform = normalizePlatform(item.platform);
      if (!groups[platform]) groups[platform] = [];
      groups[platform].push(item);
    });

    var order = ["Stealth", "Assault", "Support", "Utility", "Unknown"];
    var html = order.filter(function(platform) {
      return groups[platform] && groups[platform].length;
    }).map(function(platform) {
      var cards = groups[platform].sort(function(a, b) {
        return String(a.title).localeCompare(String(b.title));
      }).map(function(executor) {
        var arsSupport = getArsSupport(executor);
        var badges = [];
        badges.push(badge(executor.version || "Unknown", "muted"));
        if (executor.suncStatus || executor.suncPercentage != null) badges.push(badge("sUNC", "muted"));
        badges.push(badge(executor.cost || (executor.free ? "Free" : "Paid"), "muted"));
        if (executor.keysystem) badges.push(badge("Key System", "muted"));

        return '' +
          '<details class="exec-item exec-item-' + statusTone(executor) + '">' +
            '<summary class="exec-summary">' +
              '<div class="exec-left">' +
                '<div class="exec-title-row">' +
                  '<h3>' + escapeHtml(executor.title || "Unknown") + '</h3>' +
                  '<div class="exec-badges">' + badges.join("") + '</div>' +
                '</div>' +
                '<p class="exec-sub">Last updated: ' + escapeHtml(executor.updatedDate || "Unknown") + '</p>' +
              '</div>' +
              '<div class="exec-right">' +
                '<span class="exec-status exec-status-' + statusTone(executor) + '">' + escapeHtml(isOnline(executor) ? "Updated" : "Not Updated") + '</span>' +
                '<div class="exec-progress-wrap">' +
                  '<span class="exec-progress-label">Criminality</span>' +
                  '<div class="exec-progress-track"><span class="exec-progress-bar exec-progress-bar-' + percentageTone(arsSupport) + '" style="width:' + arsSupport + '%"></span></div>' +
                  '<span class="exec-progress-value exec-progress-value-' + percentageTone(arsSupport) + '">' + arsSupport + '%</span>' +
                '</div>' +
              '</div>' +
            '</summary>' +
            '<div class="exec-panel">' +
              '<div class="exec-advisory">' + escapeHtml(getAdvisoryText(executor)) + '</div>' +
              '<div class="exec-facts-grid">' + createExpandedFacts(executor) + '</div>' +
              '<div class="policy-actions exec-actions">' + createActionButtons(executor) + '</div>' +
            '</div>' +
          '</details>';
      }).join("");

      return '' +
        '<section class="exec-group">' +
          '<div class="exec-group-head">' +
            '<h2>' + escapeHtml(platform) + ' Loadouts</h2>' +
            '<span>' + groups[platform].length + '</span>' +
          '</div>' +
          '<div class="exec-grid">' + cards + '</div>' +
        '</section>';
    }).join("");

    byId("executorSections").innerHTML = html || '<div class="policy-card"><h2>No loadouts found</h2><p>Try changing the filter, or clear your search.</p></div>';
  }

  function setActiveChip(containerId, value) {
    var root = byId(containerId);
    Array.prototype.forEach.call(root.querySelectorAll(".policy-chip"), function(chip) {
      chip.classList.toggle("is-active", chip.getAttribute("data-value") === value);
    });
  }

  function bindFilters(executors) {
    var toggleFiltersButton = byId("toggleFilters");
    var filtersDrawer = byId("execFilters");

    toggleFiltersButton.addEventListener("click", function() {
      var isHidden = filtersDrawer.hasAttribute("hidden");
      if (isHidden) {
        filtersDrawer.removeAttribute("hidden");
      } else {
        filtersDrawer.setAttribute("hidden", "hidden");
      }
      toggleFiltersButton.setAttribute("aria-expanded", isHidden ? "true" : "false");
    });

    byId("searchExecutors").addEventListener("input", function(event) {
      state.search = event.target.value.trim().toLowerCase();
      renderExecutors(executors);
    });

    Array.prototype.forEach.call(document.querySelectorAll("#platformFilters .policy-chip"), function(chip) {
      chip.addEventListener("click", function() {
        state.platform = chip.getAttribute("data-value");
        setActiveChip("platformFilters", state.platform);
        renderExecutors(executors);
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("#priceFilters .policy-chip"), function(chip) {
      chip.addEventListener("click", function() {
        state.price = chip.getAttribute("data-value");
        setActiveChip("priceFilters", state.price);
        renderExecutors(executors);
      });
    });
  }

  function showError(message) {
    byId("executorSections").innerHTML = '' +
      '<div class="policy-card">' +
        '<h2>Could not load loadouts</h2>' +
        '<p>' + escapeHtml(message) + '</p>' +
      '</div>';
  }

  renderVersions([
    { label: "Purple Glass", note: "Profile loader and hero styling", version: "Active" },
    { label: "Criminality Only", note: "One game, no external feed", version: "Locked In" }
  ]);
  renderStats(CRIMINALITY_LOADOUTS);
  renderExecutors(CRIMINALITY_LOADOUTS);
  bindFilters(CRIMINALITY_LOADOUTS);
})();
