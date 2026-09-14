/* Module 05 - leaderboard page logic (merged from SQL Roadmap).
   Carried over unchanged; it binds to the same element ids. */
(function(){
(function () {
  SQLR.mountNav("board");
  var $ = function (id) { return document.getElementById(id); };
  var me = SQLR.store.student();
  var view = "week";
  var cache = null;

  function weekRange(d) {
    var day = (d.getDay() + 6) % 7;              // Monday = 0
    var mon = new Date(d); mon.setDate(d.getDate() - day);
    var sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    var f = function (x) { return x.toLocaleDateString(undefined, { day: "numeric", month: "short" }); };
    return f(mon) + " – " + f(sun);
  }
  $("weeklabel").textContent = SQLR.isoWeek(new Date()) + " · " + weekRange(new Date());

  // Movement compares like with like: in the weekly view this week's rank against
  // last week's rank, in the all-time view the standing now against the standing
  // at the end of last week.
  // What the board is ordered on. Points stay on show, but only a solve a
  // platform confirmed counts towards a rank.
  function rankKey() { return view === "week" ? "weekVerified" : "verifiedSolved"; }

  function deltaCell(r) {
    var scored = r[rankKey()];
    var prev = view === "week" ? r.prevRankWeek : r.prevRankAll;
    // Nobody who has not scored in this view has a standing to have moved from;
    // ranking them by default order and calling it "new" every week is noise.
    if (!scored) return '<span class="delta flat">—</span>';
    if (prev == null) return '<span class="delta new">new</span>';
    var d = prev - r.rank;
    if (d > 0) return '<span class="delta up">▲ ' + d + "</span>";
    if (d < 0) return '<span class="delta down">▼ ' + (-d) + "</span>";
    return '<span class="delta flat">—</span>';
  }

  function ago(iso) {
    if (!iso) return "—";
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + "m ago";
    if (s < 86400) return Math.round(s / 3600) + "h ago";
    if (s < 604800) return Math.round(s / 86400) + "d ago";
    return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  function render(rows) {
    var key = rankKey();
    $("verhead").textContent = "Verified";

    var list = rows.slice().sort(function (a, b) {
      return ((b[key] || 0) - (a[key] || 0)) || ((b.points || 0) - (a.points || 0)) ||
             (a.lastSolve || "").localeCompare(b.lastSolve || "");
    });
    // Equal scores share a rank, the same way the server ranks them — otherwise
    // two students level on points show a ▲ and a ▼ against each other.
    var rank = 0, prev = null;
    list.forEach(function (r, i) {
      var v = r[key] || 0;
      if (prev === null || v !== prev) { rank = i + 1; prev = v; }
      r.rank = rank;
    });

    // Only people who actually scored in this view can be on the podium. In a
    // fresh week that is nobody, and crowning whoever sorts first — which came
    // down to who had gone longest without solving — is how a student with
    // 0 pts ended up labelled FIRST.
    var scored = list.filter(function (r) { return (r[key] || 0) > 0; });
    $("podium").innerHTML = scored.slice(0, 3).map(function (r, i) {
      return '<div class="pod p' + (i + 1) + '">' +
        '<span class="place">' + ["First", "Second", "Third"][i] + "</span>" +
        '<span class="nm">' + SQLR.esc(r.name) + "</span>" +
        '<span class="pts">' + (r[key] || 0) + (view === "week" ? " verified this week" : " verified") +
          " · " + (r.points || 0).toLocaleString() + " pts</span>" +
        "</div>";
    }).join("");

    $("rows").innerHTML = list.length ? list.map(function (r) {
      var mine = me && r.github && r.github.toLowerCase() === me.github.toLowerCase();
      return "<tr" + (mine ? ' class="me"' : "") + ">" +
        '<td class="rank' + (r[key] && r.rank <= 3 ? " top" : "") + '">' +
          (r[key] ? r.rank : "—") + "</td>" +
        "<td>" + deltaCell(r) + "</td>" +
        '<td><span class="who"><b>' + SQLR.esc(r.name) + (mine ? " (you)" : "") + "</b>" +
          "<span>@" + SQLR.esc(r.github) +
          (r.hackerrank ? " · hr/" + SQLR.esc(r.hackerrank) : "") +
          (r.codeforces ? " · cf/" + SQLR.esc(r.codeforces) : "") + "</span></span></td>" +
        '<td class="num rankkey" title="Total problems confirmed against the student\u2019s LeetCode and HackerRank profiles">' +
          (r.verifiedSolved || 0) + "</td>" +
        '<td class="num">' + (r.points || 0).toLocaleString() + "</td>" +
        '<td class="num" style="color:var(--ink-3)">' + ago(r.lastSolve) + "</td>" +
        "</tr>";
    }).join("") : '<tr><td colspan="6"><div class="empty">Nobody has solved anything yet. Be first.</div></td></tr>';

    if (list.length && !scored.length) {
      $("rows").insertAdjacentHTML("afterbegin", '<tr><td colspan="6"><div class="empty">' +
        (view === "week" ? "Nothing verified yet this week — the board opens with the first confirmed solve."
                         : "Nothing confirmed yet.") + "</div></td></tr>");
    }
  }

  function localRows() {
    // offline fallback: only this browser's student
    if (!me) return [];
    var solved = SQLR.store.solved();
    var verified = SQLR.store.verified();
    return SQLR.roadmap().then(function (data) {
      var pts = 0, week = 0, last = null, n = 0, wn = 0, v = 0, wv = 0;
      var thisWeek = SQLR.isoWeek(new Date());
      data.problems.forEach(function (p) {
        var at = solved[p.id];
        if (!at) return;
        var ok = !!verified[p.id];
        n++; pts += SQLR.points(p);
        if (ok) v++;
        if (SQLR.isoWeek(new Date(at)) === thisWeek) {
          week += SQLR.points(p); wn++;
          if (ok) wv++;
        }
        if (!last || at > last) last = at;
      });
      return [{ name: me.name, github: me.github, hackerrank: me.hackerrank,
                codeforces: me.codeforces, points: pts, weekPoints: week,
                solved: n, weekSolved: wn, verifiedSolved: v, weekVerified: wv,
                lastSolve: last, prevRankWeek: null, prevRankAll: null }];
    });
  }

  function load() {
    if (!SQLR.online) {
      $("status").innerHTML = '<div class="banner warn"><span>⚑</span><div><b>Class sheet not connected.</b> ' +
        "Showing your own progress from this browser. Once the instructor adds the Apps Script URL to " +
        '<span class="mono">assets/config.js</span>, everyone in the batch appears here.</div></div>';
      return Promise.resolve(localRows()).then(function (p) {
        return p.then ? p : Promise.resolve(p);
      }).then(function (rows) { cache = rows; render(rows); });
    }
    $("updated").textContent = "loading…";
    return SQLR.get("leaderboard", {}).then(function (res) {
      if (!res || !res.ok) throw new Error(res && res.error || "The class sheet did not answer.");
      cache = res.rows || [];
      $("status").innerHTML = "";
      $("updated").textContent = "updated " + new Date().toLocaleTimeString();
      render(cache);
    }).catch(function (err) {
      $("status").innerHTML = '<div class="banner bad"><span>⚠</span><div><b>Could not load the leaderboard.</b> ' +
        SQLR.esc(err.message) + " Showing your local progress instead.</div></div>";
      $("updated").textContent = "";
      return localRows().then(function (rows) { cache = rows; render(rows); });
    });
  }

  $("f-view").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    view = b.dataset.v;
    [].forEach.call(this.children, function (c) { c.setAttribute("aria-pressed", String(c === b)); });
    if (cache) render(cache);
  });
  $("refresh").addEventListener("click", load);

  load();
})();
})();
