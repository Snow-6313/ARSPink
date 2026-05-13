// Shared visual effects: mouse glow + particle network background.
(function() {
  document.addEventListener("mousemove", function(e) {
    document.documentElement.style.setProperty("--mx", e.clientX + "px");
    document.documentElement.style.setProperty("--my", e.clientY + "px");
  });

  var canvas = document.getElementById("pc");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var W, H, pts = [];
  var COUNT = 108;
  var MAX_D = 145;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Pt() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 1.55;
    this.vy = (Math.random() - 0.5) * 1.55;
    this.r = Math.random() * 2.2 + 1.2;
  }

  function init() {
    pts = [];
    for (var i = 0; i < COUNT; i++) pts.push(new Pt());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    var i, j, p, dx, dy, d, a;

    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;
    }

    for (i = 0; i < pts.length; i++) {
      for (j = i + 1; j < pts.length; j++) {
        dx = pts[i].x - pts[j].x;
        dy = pts[i].y - pts[j].y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_D) {
          a = (1 - d / MAX_D) * 0.22;
          ctx.beginPath();
          ctx.strokeStyle = "rgba(200,200,220," + a + ")";
          ctx.lineWidth = 0.7;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(232,23,122,0.9)";
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", function() {
    resize();
    init();
  });

  resize();
  init();
  loop();
})();

// Shared mobile nav: inject burger + slideout menu from existing desktop nav links.
(function() {
  var nav = document.querySelector("body > nav");
  if (!nav) return;

  var links = nav.querySelector(".n-links");
  var right = nav.querySelector(".n-right");
  if (!links || nav.querySelector(".n-burger")) return;

  var burger = document.createElement("button");
  burger.className = "n-burger";
  burger.type = "button";
  burger.setAttribute("aria-label", "Toggle menu");
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-controls", "siteMobileMenu");
  burger.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(burger);

  var overlay = document.createElement("div");
  overlay.className = "mobile-nav-overlay";

  var panel = document.createElement("aside");
  panel.id = "siteMobileMenu";
  panel.className = "mobile-nav-panel";
  panel.setAttribute("aria-hidden", "true");

  var panelInner = document.createElement("div");
  panelInner.className = "mobile-nav-inner";

  var linksWrap = document.createElement("div");
  linksWrap.className = "mobile-nav-links";
  Array.prototype.forEach.call(links.querySelectorAll("a"), function(link) {
    linksWrap.appendChild(link.cloneNode(true));
  });

  var actionsWrap = document.createElement("div");
  actionsWrap.className = "mobile-nav-actions";
  if (right) {
    Array.prototype.forEach.call(right.querySelectorAll("a"), function(link) {
      actionsWrap.appendChild(link.cloneNode(true));
    });
  }

  panelInner.appendChild(linksWrap);
  panelInner.appendChild(actionsWrap);
  panel.appendChild(panelInner);
  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  function closeMenu() {
    document.body.classList.remove("mobile-nav-open");
    burger.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
  }

  function openMenu() {
    document.body.classList.add("mobile-nav-open");
    burger.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
  }

  burger.addEventListener("click", function() {
    if (document.body.classList.contains("mobile-nav-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener("click", closeMenu);

  panel.addEventListener("click", function(e) {
    var t = e.target;
    if (t && t.tagName === "A") closeMenu();
  });

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", function() {
    if (window.innerWidth > 960) closeMenu();
  });
})();
