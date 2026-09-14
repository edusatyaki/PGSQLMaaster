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
    { id: "windows",    step: "04", label: "Windows",    href: "windows.html" },
    { id: "roadmap",    step: "05", label: "Roadmap",    href: "roadmap.html" },
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
      "</nav></div>";
  }

  function footer() {
    return '<div class="wrap sitefoot-in">' +
      "<div>Ideation &amp; development <b>Satyaki Das</b> · XShare</div>" +
      '<div><a href="https://github.com/edusatyaki">github.com/edusatyaki</a></div>' +
      "</div>";
  }

  /** Replaces <header data-shell> and <footer data-shell> with the real chrome. */
  function mount(current) {
    var h = document.querySelector("header[data-shell]");
    if (h) { h.className = "topbar"; h.innerHTML = topbar(current); }
    var f = document.querySelector("footer[data-shell]");
    if (f) { f.className = "sitefoot"; f.innerHTML = footer(); }
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

  root.Shell = { mount: mount, pager: pager, esc: esc, NAV: NAV };
})(window);
