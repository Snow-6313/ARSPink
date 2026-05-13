(function () {
  var KB = [
    {
      tags: ["price", "cost", "how much", "pricing", "plans", "plan", "pay", "payment"],
      answer: "ARS.PINK is <strong>$10 lifetime</strong>. One payment, no subscription. You can pay via <strong>Stripe</strong> (Visa / Mastercard) or <strong>Crypto</strong>. <a href='pricing.html'>See pricing</a>."
    },
    {
      tags: ["subscription", "monthly", "renew", "recurring"],
      answer: "No monthly plan. ARS.PINK is a <strong>one-time lifetime purchase</strong>."
    },
    {
      tags: ["buy", "purchase", "get", "where to buy", "get access"],
      answer: "Buy at <a href='https://ars.pink/ars/buy' target='_blank' rel='noopener'>ars.pink/ars/buy</a>. After checkout, your key is delivered instantly."
    },
    {
      tags: ["key", "receive key", "where is my key", "not received", "missing key"],
      answer: "Keys are delivered instantly after confirmed payment. If you did not receive yours, open a ticket on <a href='https://discord.gg/ANGyh3ftc8' target='_blank' rel='noopener'>Discord support</a>."
    },
    {
      tags: ["executor", "executors", "supported executor", "what executor", "which executor", "compatible", "works with"],
      answer: "ARS.PINK is tested with major executors including <strong>Potassium, Synapse Z, and ChocoSploit</strong>. Full support list is on the <a href='executors.html'>Executors page</a>."
    },
    {
      tags: ["potassium", "synapse", "chocosploit", "madium", "volt"],
      answer: "Current tested support:<br>- <strong>Potassium</strong>: 100%<br>- <strong>Synapse Z</strong>: 100%<br>- <strong>ChocoSploit</strong>: 100%<br>- <strong>Volt</strong>: 95%<br>- <strong>Madium</strong>: 80%"
    },
    {
      tags: ["mobile", "android", "ios", "phone", "iphone"],
      answer: "Mobile reliability depends on your executor and environment. Desktop is generally more stable. See the <a href='executors.html'>Executors page</a> for platform details."
    },
    {
      tags: ["games", "game", "supported games", "what games", "which games", "game list"],
      answer: "Supported games: <strong>Apocalypse Rising 2</strong>, <strong>Blackhawk Rescue Mission 5</strong>, <strong>Fallen Survival</strong>, <strong>Phantom Forces</strong>, and <strong>Deadline</strong>. <a href='games.html'>View full list</a>."
    },
    {
      tags: ["phantom forces", "pf", "brm5", "blackhawk", "fallen survival", "apocalypse rising", "apoc", "deadline"],
      answer: "Yes, that title is fully supported. Check <a href='games.html'>Games</a> for the current lineup."
    },
    {
      tags: ["how does it work", "how to use", "how to start", "setup", "inject", "execute", "loader"],
      answer: "Quick setup:<br>1. Purchase access<br>2. Open your dashboard and copy your loader<br>3. Inject with your executor and execute in-game<br><a href='faq.html'>Read detailed FAQ</a>."
    },
    {
      tags: ["not working", "broken", "stopped working", "after update", "game update", "patch", "error"],
      answer: "If a script stopped working after an update: update your executor, restart Roblox, and copy a fresh loader from your dashboard. If still broken, open Discord support."
    },
    {
      tags: ["resell", "reseller", "sell", "selling", "resale", "distribute", "share key", "give key", "sell key", "trade", "reseller program"],
      answer: "<strong>Reselling or sharing keys is prohibited.</strong> It is a ToS violation and can result in permanent access revocation. There is no reseller program. <a href='tos.html#service-rules'>See rules</a>."
    },
    {
      tags: ["refund", "refunds", "money back", "chargeback", "cancel"],
      answer: "<strong>All sales are final.</strong> ARS.PINK does not offer refunds after delivery. See <a href='tos.html#refunds'>refund terms</a>."
    },
    {
      tags: ["share account", "multiple users", "can i share"],
      answer: "No. Each license is single-user only. Sharing can trigger restrictions or revocation."
    },
    {
      tags: ["changed pc", "new pc", "reinstall", "hardware", "hwid", "new computer", "reset"],
      answer: "If your environment changed and validation fails, open a support ticket with your order details on Discord."
    },
    {
      tags: ["discord", "support", "contact", "help", "ticket", "staff"],
      answer: "Direct support is on <a href='https://discord.gg/ANGyh3ftc8' target='_blank' rel='noopener'>Discord</a>. Include your purchase email or receipt."
    },
    {
      tags: ["free", "trial", "discount", "coupon", "promo"],
      answer: "No free tier or trial is available. ARS.PINK is a one-time $10 lifetime purchase."
    },
    {
      tags: ["terms", "tos", "rules", "policy", "terms of service"],
      answer: "Read the full Terms of Service here: <a href='tos.html'>Terms page</a>."
    },
    {
      tags: ["updates", "future updates", "included", "lifetime updates"],
      answer: "Yes. Future updates are included with your lifetime purchase."
    }
  ];

  var QUICK = [
    { label: "Pricing", icon: "$", q: "how much does it cost" },
    { label: "Games", icon: "G", q: "what games are supported" },
    { label: "Executors", icon: "E", q: "what executors are supported" },
    { label: "Reselling Rules", icon: "!", q: "can i resell my key" },
    { label: "Setup", icon: ">", q: "how does it work" },
    { label: "Refunds", icon: "R", q: "do you offer refunds" }
  ];

  var STORAGE_KEY = "arsChatHistoryV1";
  var MAX_HISTORY = 18;

  var CONVO = [
    {
      tags: ["hi", "hello", "hey", "yo", "sup", "good morning", "good evening"],
      answer: "Hey. I can help with pricing, setup, executors, game support, refunds, and account rules.",
      score: 2
    },
    {
      tags: ["thanks", "thank you", "ty", "thx", "appreciate"],
      answer: "Anytime. If you want, I can also show pricing, setup, or support links.",
      score: 2
    },
    {
      tags: ["human", "real person", "agent", "staff", "mod", "admin"],
      answer: "For a real person, open a ticket on <a href='https://discord.gg/ANGyh3ftc8' target='_blank' rel='noopener'>Discord support</a> and include your order email.",
      score: 3
    }
  ];

  var STOP_WORDS = {
    a: 1,
    an: 1,
    and: 1,
    are: 1,
    do: 1,
    for: 1,
    i: 1,
    is: 1,
    it: 1,
    me: 1,
    my: 1,
    of: 1,
    on: 1,
    or: 1,
    the: 1,
    to: 1,
    what: 1,
    where: 1,
    with: 1,
    you: 1,
    your: 1
  };

  function normalize(str) {
    return str.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  }

  function getTerms(str) {
    var tokens = normalize(str).split(" ");
    var result = [];
    tokens.forEach(function (token) {
      if (!token || STOP_WORDS[token]) return;
      result.push(token);
    });
    return result;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function scoreTags(q, terms, entry, baseWeight) {
    var score = 0;
    entry.tags.forEach(function (tag) {
      var t = normalize(tag);
      if (!t) return;

      if (q === t) {
        score += 8 * baseWeight;
        return;
      }

      if (q.indexOf(t) !== -1) {
        score += (t.split(" ").length + 2) * baseWeight;
      }

      if (t.length > 3 && q.indexOf(t.slice(0, -1)) !== -1) {
        score += 1 * baseWeight;
      }

      var tagTerms = t.split(" ");
      tagTerms.forEach(function (tt) {
        if (tt.length < 3) return;
        if (terms.indexOf(tt) !== -1) score += 1 * baseWeight;
      });
    });
    return score;
  }

  function getFallbackAnswer() {
    return (
      "I could not match that perfectly. Try one of these:<br>" +
      "- pricing and payment<br>" +
      "- supported games or executors<br>" +
      "- setup and loader steps<br>" +
      "- refunds and ToS rules<br><br>" +
      "Need staff help? <a href='https://discord.gg/ANGyh3ftc8' target='_blank' rel='noopener'>Open Discord support</a>."
    );
  }

  function findAnswer(input) {
    var q = normalize(input);
    var terms = getTerms(input);
    var bestEntry = null;
    var bestScore = 0;

    CONVO.forEach(function (entry) {
      var score = scoreTags(q, terms, entry, entry.score || 1);
      if (score > bestScore) {
        bestScore = score;
        bestEntry = entry;
      }
    });

    KB.forEach(function (entry) {
      var score = scoreTags(q, terms, entry, 1);
      if (score > bestScore) {
        bestScore = score;
        bestEntry = entry;
      }
    });

    if (bestScore > 1 && bestEntry) return bestEntry.answer;
    return getFallbackAnswer();
  }

  var widget = document.createElement("div");
  widget.id = "ars-chat-widget";
  widget.setAttribute("aria-label", "ARS.PINK Support Chat");
  widget.innerHTML =
    '<button class="ars-chat-fab" id="arsChatFab" aria-label="Open support chat" aria-expanded="false">' +
      '<span class="ars-chat-fab-ring"></span>' +
      '<svg class="ars-chat-fab-icon ars-chat-fab-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
      '<svg class="ars-chat-fab-icon ars-chat-fab-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button>' +
    '<section class="ars-chat-panel" id="arsChatPanel" hidden>' +
      '<header class="ars-chat-header">' +
        '<div class="ars-chat-header-info">' +
          '<span class="ars-chat-header-dot"></span>' +
          '<div>' +
            '<strong>ARS.PINK Assistant</strong>' +
            '<span class="ars-chat-header-sub">Live help for pricing, setup, rules, and support</span>' +
          '</div>' +
        '</div>' +
        '<div class="ars-chat-header-actions">' +
          '<button class="ars-chat-clean-btn" id="arsChatClear" type="button">Clear</button>' +
          '<button class="ars-chat-close-btn" id="arsChatClose" type="button" aria-label="Close chat">X</button>' +
        '</div>' +
      '</header>' +
      '<div class="ars-chat-banner">Fast answers from FAQ + Terms + product data</div>' +
      '<div class="ars-chat-messages" id="arsChatMessages"></div>' +
      '<div class="ars-chat-quick" id="arsChatQuick"></div>' +
      '<form class="ars-chat-form" id="arsChatForm" autocomplete="off">' +
        '<input class="ars-chat-input" id="arsChatInput" type="text" placeholder="Ask a question about ARS.PINK..." maxlength="300" />' +
        '<button class="ars-chat-send" type="submit" aria-label="Send">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</form>' +
    '</section>';

  document.body.appendChild(widget);

  var fab = document.getElementById("arsChatFab");
  var panel = document.getElementById("arsChatPanel");
  var closeBtn = document.getElementById("arsChatClose");
  var clearBtn = document.getElementById("arsChatClear");
  var messages = document.getElementById("arsChatMessages");
  var quickWrap = document.getElementById("arsChatQuick");
  var form = document.getElementById("arsChatForm");
  var input = document.getElementById("arsChatInput");
  var greeted = false;

  function saveHistory() {
    var payload = [];
    var nodes = messages.querySelectorAll(".ars-chat-msg");
    nodes.forEach(function (node) {
      var who = node.classList.contains("ars-chat-msg-user") ? "user" : "bot";
      var bubble = node.querySelector(".ars-chat-bubble");
      if (!bubble) return;
      payload.push({ who: who, text: bubble.innerHTML });
    });
    if (payload.length > MAX_HISTORY) {
      payload = payload.slice(payload.length - MAX_HISTORY);
    }
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_e) {}
  }

  function restoreHistory() {
    var raw;
    try {
      raw = sessionStorage.getItem(STORAGE_KEY);
    } catch (_e) {
      return false;
    }
    if (!raw) return false;

    try {
      var history = JSON.parse(raw);
      if (!Array.isArray(history) || !history.length) return false;
      history.forEach(function (entry) {
        if (!entry || !entry.who || !entry.text) return;
        var msg = document.createElement("div");
        msg.className = "ars-chat-msg ars-chat-msg-" + entry.who;
        msg.innerHTML = '<div class="ars-chat-bubble">' + entry.text + '</div>';
        messages.appendChild(msg);
      });
      messages.scrollTop = messages.scrollHeight;
      return true;
    } catch (_e) {
      return false;
    }
  }

  function addMessage(text, who) {
    var msg = document.createElement("div");
    msg.className = "ars-chat-msg ars-chat-msg-" + who + " is-enter";
    msg.innerHTML = '<div class="ars-chat-bubble">' + text + '</div>';
    messages.appendChild(msg);
    requestAnimationFrame(function () {
      msg.classList.remove("is-enter");
    });
    messages.scrollTop = messages.scrollHeight;
    saveHistory();
  }

  function showTyping() {
    var el = document.createElement("div");
    el.className = "ars-chat-msg ars-chat-msg-bot ars-chat-typing-wrap";
    el.id = "arsChatTyping";
    el.innerHTML = '<div class="ars-chat-bubble ars-chat-typing"><span></span><span></span><span></span></div>';
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    var el = document.getElementById("arsChatTyping");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function buildQuickReplies() {
    quickWrap.innerHTML = "";
    QUICK.forEach(function (item, index) {
      var btn = document.createElement("button");
      btn.className = "ars-chat-qbtn";
      btn.type = "button";
      btn.innerHTML =
        '<span class="ars-chat-qicon">' + item.icon + '</span>' +
        '<span class="ars-chat-qlabel">' + item.label + '</span>';
      btn.style.animationDelay = String(index * 40) + "ms";
      btn.addEventListener("click", function () {
        handleSend(item.q);
      });
      quickWrap.appendChild(btn);
    });
  }

  function greetIfNeeded() {
    if (greeted) return;

    if (restoreHistory()) {
      greeted = true;
      buildQuickReplies();
      return;
    }

    greeted = true;
    addMessage("Welcome to ARS.PINK support. Ask about pricing, supported executors, game support, setup, refunds, or key-sharing rules.", "bot");
    buildQuickReplies();
  }

  function handleSend(text) {
    var q = text.trim();
    if (!q) return;

    input.value = "";
    addMessage(escapeHtml(q), "user");
    showTyping();

    var delay = Math.min(1300, 380 + q.length * 14);
    setTimeout(function () {
      removeTyping();
      addMessage(findAnswer(q), "bot");
    }, delay);
  }

  function openChat() {
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    greetIfNeeded();
    input.focus();
  }

  function closeChat() {
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
  }

  fab.addEventListener("click", function () {
    if (panel.hidden) {
      openChat();
      return;
    }
    closeChat();
  });

  closeBtn.addEventListener("click", closeChat);

  clearBtn.addEventListener("click", function () {
    messages.innerHTML = "";
    quickWrap.innerHTML = "";
    greeted = false;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (_e) {}
    greetIfNeeded();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    handleSend(input.value);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) closeChat();
  });
})();
