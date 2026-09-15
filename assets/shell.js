/* ===========================================================================
   Shared chrome — the top bar and footer every page mounts.
   Kept in one place so the five merged modules cannot drift apart again.
   Usage:  <script src="assets/shell.js"></script>  then  Shell.mount("workbook")
   =========================================================================== */
(function (root) {
  "use strict";

  var NAV = [
    { id: "workbook",   step: "01", label: "Workbook",   href: "workbook.html" },
    { id: "reference",  step: "02", label: "Reference",  href: "reference.html" },
    { id: "subqueries", step: "03", label: "Subqueries", href: "subqueries.html" },
    { id: "roadmap",    step: "04", label: "Roadmap",    href: "roadmap.html" },
    { id: "rapidfire", step: "05", label: "Rapid fire", href: "rapidfire.html" },
    { id: "notes",     step: "",   label: "Notes",       href: "notes.html" },
    { id: "board",      step: "",   label: "Leaderboard", href: "leaderboard.html" }
  ];

  var DB_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<ellipse cx="12" cy="5.5" rx="8" ry="3"/>' +
    '<path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>';

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function topbar(current) {
    return '<div class="topbar-in">' +
      '<a class="brand" href="index.html">' + DB_ICON + "<span>PostgreSQL Master</span></a>" +
      '<nav class="navscroll" aria-label="Modules">' +
      NAV.map(function (n) {
        return '<a href="' + n.href + '"' + (n.id === current ? ' class="on" aria-current="page"' : "") + ">" +
          (n.step ? '<span class="st">' + n.step + "</span>" : "") +
          "<span>" + esc(n.label) + "</span></a>";
      }).join("") +
      '</nav>' +
      '<button class="fsbtn" id="fsBtn" type="button" title="Full screen (F)"></button>' +
      "</div>";
  }

  function footer() {
    return '<div class="wrap sitefoot-in">' +
      "<div>Ideation &amp; development <b>Satyaki Das</b></div>" +
      '<div><a href="https://github.com/edusatyaki">github.com/edusatyaki</a></div>' +
      "</div>";
  }

  /** Replaces <header data-shell> and <footer data-shell> with the real chrome. */
  function mount(current) {
    var h = document.querySelector("header[data-shell]");
    if (h) { h.className = "topbar"; h.innerHTML = topbar(current); }
    var f = document.querySelector("footer[data-shell]");
    if (f) { f.className = "sitefoot"; f.innerHTML = footer(); }
    wireFullscreen();
  }



  /* ------------------------------------------------------------- fullscreen
     One control for the whole site, in the top bar of every page. Where a page
     is built around a single module it carries data-fs-target, and that panel
     goes fullscreen rather than the document — a projected slide should not
     bring the site chrome with it. Everywhere else the document goes.
     The modules that shipped their own button and F key have had them removed,
     so F toggles exactly one thing on every page. */
  var FS_IN  = '<svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7.5V3h4.5M16.5 7.5V3H12M3 12.5V17h4.5M16.5 12.5V17H12"/></svg>';
  var FS_OUT = '<svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 3v4.5H3M12 3v4.5h4.5M7.5 17v-4.5H3M12 17v-4.5h4.5"/></svg>';

  function fsSupported() {
    var e = document.documentElement;
    return !!(e.requestFullscreen || e.webkitRequestFullscreen) &&
           document.fullscreenEnabled !== false;
  }
  function fsOn() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function fsTarget() {
    return document.querySelector("[data-fs-target]") || document.documentElement;
  }
  function fullscreen() {
    try {
      if (fsOn()) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        var el = fsTarget();
        var req = el.requestFullscreen || el.webkitRequestFullscreen;
        var p = req.call(el);
        if (p && p.catch) p.catch(function () {});
      }
    } catch (e) {}
  }
  function fsSync() {
    var b = document.getElementById("fsBtn");
    if (!b) return;
    var on = fsOn();
    b.innerHTML = (on ? FS_OUT : FS_IN) + "<span>" + (on ? "Exit" : "Full screen") + "</span>";
    b.setAttribute("aria-label", on ? "Exit full screen" : "Enter full screen");
    b.setAttribute("aria-pressed", String(on));
  }
  function wireFullscreen() {
    var b = document.getElementById("fsBtn");
    if (!b) return;
    /* a dead control is worse than none */
    if (!fsSupported()) { b.remove(); return; }
    b.addEventListener("click", fullscreen);
    document.addEventListener("fullscreenchange", fsSync);
    document.addEventListener("webkitfullscreenchange", fsSync);
    document.addEventListener("keydown", function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== "f" && e.key !== "F") return;
      var t = e.target;
      if (t && t.closest && t.closest("input,textarea,select,[contenteditable='true']")) return;
      e.preventDefault();
      fullscreen();
    });
    fsSync();
  }

  /* ---------------------------------------------------------------- context
     One compact row per module page: step, title, a one-line summary, the full
     blurb behind a disclosure, and prev/next. Replaces the tall page header
     that used to push every module below the fold. */
  var COPY = {
    workbook: { title: "Practice workbook", meta: "73 worked problems · 17 units · DDL, DML, TCL, DCL",
      about: "Read the question, then the answer <b>types itself out</b> in the editor and runs, " +
             "so you see the exact result it returns. The panel on the left carries the question, " +
             "the hints (press <b>H</b>), and the table's structure diffed before and after the " +
             "statement — new columns in green, changed in amber, dropped in red." },
    reference: { title: "Function reference", meta: "459 functions · 21 categories · output executed on PostgreSQL 16.14",
      about: "Every printed result here was produced by <b>running the query</b> against " +
             "PostgreSQL 16.14 — nothing is written from memory. Search by name, signature or " +
             "description, press <b>/</b> to jump to the search box, and click any entry for the " +
             "query, the sample data it runs against and the real result." },
    subqueries: { title: "Inner query, outer query", meta: "35 steps · EXISTS, IN, scalar and correlated",
      about: "The dataset stays on the left the whole way through. As the trace steps forward, " +
             "<b>exactly the rows the inner query touches light up</b> — so you can watch a " +
             "correlated subquery re-run once per outer row instead of being told that it does." },
    roadmap: { title: "The roadmap", meta: "379 problems · 14 chapters · 323 LeetCode + 56 HackerRank",
      about: "Tick problems off as you solve them and your progress is saved for the batch. The " +
             "leaderboard <b>ranks on solves confirmed against your real LeetCode and HackerRank " +
             "profiles</b>, so a ticked box earns points on the page but no position on the board." },
    rapidfire: { title: "Rapid fire", meta: "100 questions · 20 seconds each · no going back",
      about: "A timed round over the whole syllabus — data and DBMS, schema and keys, " +
             "DDL/DML/TCL/DCL, querying, PostgreSQL functions and NULL handling. Four options " +
             "a question, answered with a click or the <b>1</b>–<b>4</b> / <b>A</b>–<b>D</b> keys. " +
             "A correct answer scores 10 plus up to 5 for speed; running out of time scores 0. " +
             "Your result is written to the class sheet when the round ends." },
    notes: { title: "Lecture notes", meta: "Slide decks for the topics behind the course",
      about: "The decks handed out alongside the lectures. Two of them — correlated and " +
             "non-correlated subqueries — also appear under <b>About this step</b> on step 03, " +
             "where they are most use. They open in Canva in a new tab." },
    board: { title: "Leaderboard", meta: "Weekly and all-time · ranked on verified solves",
      about: "Ranked on solves confirmed against real profiles, not on ticked boxes. Rank movement " +
             "compares like with like — this week against last week, or the standing now against " +
             "the standing at the end of last week." }
  };

  function ctx(current) {
    var el = document.querySelector("[data-ctx]");
    if (!el) return;
    var c = COPY[current];
    if (!c) { el.remove(); return; }
    var i = NAV.findIndex(function (n) { return n.id === current; });
    var step = i > -1 && NAV[i].step ? NAV[i].step : "";
    var n = neighbours(current);

    var bar = document.createElement("div");
    bar.className = "ctxbar";
    bar.innerHTML = '<div class="ctxbar-in">' +
      (step ? '<span class="step-no">STEP ' + step + "</span>" : "") +
      "<h1>" + esc(c.title) + "</h1>" +
      '<span class="meta">' + esc(c.meta) + "</span>" +
      '<span class="acts">' +
        '<button class="btn btn-quiet btn-sm" id="aboutBtn" aria-expanded="false" ' +
        'aria-controls="aboutBox">About this step</button>' +
        (n.prev ? '<a class="btn btn-quiet btn-sm" href="' + n.prev.href + '" title="' +
                  esc(n.prev.label) + '" aria-label="Previous: ' + esc(n.prev.label) + '">←</a>' : "") +
        (n.next ? '<a class="btn btn-sm" href="' + n.next.href + '">' + esc(n.next.label) + " →</a>" : "") +
      "</span></div>";

    var about = document.createElement("div");
    about.className = "ctx-about";
    about.id = "aboutBox";
    about.hidden = true;
    var decks = (root.notesFor ? root.notesFor(current) : []);
    about.innerHTML = '<div class="wrap">' + c.about +
      (decks.length ? '<div class="ctx-notes"><span class="lbl">Lecture notes</span>' +
        decks.map(function (n) {
          /* in-site: opens the deck in the notes console, so the provider's URL
             is never put in front of the reader */
          return '<a href="' + root.noteHref(n) + '">' + esc(n.topic) + "</a>";
        }).join("") + "</div>" : "") +
      "</div>";

    el.replaceWith(bar);
    bar.after(about);
    bar.querySelector("#aboutBtn").addEventListener("click", function () {
      about.hidden = !about.hidden;
      this.setAttribute("aria-expanded", String(!about.hidden));
    });
  }

  /** Previous / next module, for the pager at the foot of each module page. */
  function neighbours(current) {
    var i = NAV.findIndex(function (n) { return n.id === current; });
    return { prev: i > 0 ? NAV[i - 1] : null, next: i > -1 && i < NAV.length - 1 ? NAV[i + 1] : null };
  }

  function pager(current) {
    var n = neighbours(current);
    if (!n.prev && !n.next) return "";
    return '<div class="modpager">' +
      (n.prev ? '<a class="btn btn-quiet" href="' + n.prev.href + '">← ' + esc(n.prev.label) + "</a>"
              : "<span></span>") +
      (n.next ? '<a class="btn" href="' + n.next.href + '">Next · ' + esc(n.next.label) + " →</a>"
              : "<span></span>") +
      "</div>";
  }

  root.Shell = { mount: mount, ctx: ctx, pager: pager, esc: esc, NAV: NAV,
                 fullscreen: fullscreen };
})(window);
