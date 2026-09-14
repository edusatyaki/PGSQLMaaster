/* ===========================================================================
   Module 02 — Function reference (merged from PG Master)
   The catalog in assets/reference-data.js is unchanged: 459 functions whose
   printed output was captured by executing each query against PostgreSQL
   16.14. Only the presentation changed — the VS Code skin is gone and the
   page now uses the site's shared theme.
   =========================================================================== */
(function () {
  "use strict";

  var DATA = window.PGM;
  var FN = DATA.funcs, CATS = DATA.cats;
  var NIL = "⟪NULL⟫";
  var esc = Shell.esc, hl = window.sqlHL;

  var NAME = {}, NO = {};
  CATS.forEach(function (c, i) {
    NO[c.id] = String(i + 1).padStart(2, "0");
    NAME[c.id] = c.label.replace(/^\d+\.\s*/, "");
  });

  var $ = function (s) { return document.querySelector(s); };
  var keyOf = function (f) { return "pg-v1-" + f.c + "-" + f.n; };

  /* ---------------------------------------------------------------- output */
  function grid(head, rows) {
    var h = head.map(function (x) { return "<th>" + esc(x) + "</th>"; }).join("");
    var r = rows.map(function (row) {
      return "<tr>" + row.map(function (d) {
        if (d === NIL) return '<td><i class="nil">null</i></td>';
        if (d === "") return "<td></td>";
        var w = (d.length > 52 || d.indexOf("\n") >= 0) ? ' class="wrap"' : "";
        return "<td" + w + ">" + esc(d) + "</td>";
      }).join("") + "</tr>";
    }).join("");
    return '<div class="grid-wrap"><table class="grid"><thead><tr>' + h +
           "</tr></thead><tbody>" + r + "</tbody></table></div>";
  }

  function result(o) {
    if (o.x) return '<div class="note warn"><b>Not executed.</b> ' + esc(o.m) + "</div>";
    if (o.m !== undefined) return '<div class="note good">' + esc(o.m) + "</div>";
    var h = "";
    if (o.p) h += o.p.map(function (l) { return '<div class="note">' + esc(l) + "</div>"; }).join("");
    h += grid(o.h, o.r);
    h += '<div class="rowcount">(' + o.r.length + " row" + (o.r.length === 1 ? "" : "s") + ")</div>";
    return h;
  }

  /* the two demo tables the examples query, shown when an example touches them */
  var T_EMP = '<div class="given-t"><div class="given-h">employees</div>' + grid(
    ["id", "name", "dept_id", "salary", "hire_date", "email"],
    [["1", "Alice", "101", "70000", "2019-03-15", "alice@corp.io"],
     ["2", "Bob", "102", "85000", "2020-07-01", "bob@corp.io"],
     ["3", "Charlie", "101", "60000", "2021-11-23", "charlie@corp.io"],
     ["4", "Diana", "102", "92000", "2018-01-09", "diana@corp.io"],
     ["5", "Evan", NIL, "55000", "2022-05-30", NIL]]) + "</div>";
  var T_DEPT = '<div class="given-t"><div class="given-h">departments</div>' + grid(
    ["dept_id", "dept_name"], [["101", "IT"], ["102", "Sales"], ["103", "HR"]]) + "</div>";

  /* ----------------------------------------------------------------- build */
  var read = new Set();
  FN.forEach(function (f) { try { if (localStorage.getItem(keyOf(f)) === "true") read.add(keyOf(f)); } catch (e) {} });

  function build() {
    var count = {};
    FN.forEach(function (f) { count[f.c] = (count[f.c] || 0) + 1; });

    $("#cats").innerHTML = CATS.map(function (c) {
      return '<a href="#part-' + c.id + '" data-cat="' + c.id + '">' +
        '<span class="nm">' + esc(NAME[c.id]) + "</span>" +
        '<span class="ct">' + (count[c.id] || 0) + "</span></a>";
    }).join("");

    $("#parts").innerHTML = CATS.map(function (c) {
      var rows = [];
      FN.forEach(function (f, i) {
        if (f.c !== c.id) return;
        rows.push(
          '<div class="entry' + (read.has(keyOf(f)) ? " done" : "") + '" data-i="' + i + '" ' +
          'data-s="' + esc((f.n + " " + f.g + " " + f.d).toLowerCase()) + '" ' +
          'role="button" tabindex="0">' +
          '<div class="e-main"><div class="e-nm">' + esc(f.n) + "</div>" +
          '<div class="e-sg">' + esc(f.g) + "</div></div>" +
          '<div class="e-ds">' + esc(f.d) + "</div>" +
          '<button class="mk" data-mk="' + i + '" aria-label="Mark ' + esc(f.n) + ' as read">&#10003;</button>' +
          "</div>");
      });
      return '<section class="part" id="part-' + c.id + '" data-cat="' + c.id + '">' +
        '<div class="part-h"><span class="pn">' + NO[c.id] + "</span>" +
        '<h2>' + esc(NAME[c.id]) + "</h2>" +
        '<span class="ct">' + rows.length + "</span></div>" + rows.join("") + "</section>";
    }).join("");
  }

  /* -------------------------------------------------------------- progress */
  function meter() {
    $("#meter-n").textContent = read.size + " / " + FN.length;
    $("#meter-bar").style.width = (100 * read.size / FN.length) + "%";
  }
  function mark(i) {
    var f = FN[i], k = keyOf(f), on = !read.has(k);
    try {
      if (on) { read.add(k); localStorage.setItem(k, "true"); }
      else { read.delete(k); localStorage.removeItem(k); }
    } catch (e) { on ? read.add(k) : read.delete(k); }
    document.querySelectorAll('.entry[data-i="' + i + '"]').forEach(function (el) {
      el.classList.toggle("done", on);
    });
    var b = $("#done-btn");
    if (b && +b.dataset.i === i) {
      b.classList.toggle("on", on);
      b.textContent = on ? "Read" : "Mark as read";
    }
    meter();
  }

  /* ---------------------------------------------------------------- filter */
  var shown = [];
  function filter() {
    var q = $("#q").value.trim().toLowerCase();
    shown = [];
    document.querySelectorAll(".part").forEach(function (part) {
      var n = 0;
      part.querySelectorAll(".entry").forEach(function (e) {
        var ok = !q || e.dataset.s.indexOf(q) >= 0;
        e.hidden = !ok;
        if (ok) { n++; shown.push(+e.dataset.i); }
      });
      part.hidden = n === 0;
      if (n) part.querySelector(".part-h .ct").textContent = n;
    });
    document.querySelectorAll("#cats a").forEach(function (a) {
      a.hidden = document.getElementById("part-" + a.dataset.cat).hidden;
    });
    $("#hits").textContent = q ? shown.length + " of " + FN.length + ' for "' + q + '"' : "";
    $("#nothing").hidden = shown.length > 0;
    pick(-1);
  }

  /* ------------------------------------------------------------- peek pane */
  var at = -1, turn = 0;
  function openEntry(i) {
    at = i;
    var f = FN[i];
    $("#peek-crumb").innerHTML = esc(NAME[f.c]) + " &rsaquo; <b>" + esc(f.n) + "</b>";

    var all = f.q + " " + (f.s || "");
    var emp = /\bemployees\b/.test(all), dept = /\bdepartments\b/.test(all);

    var h = '<div class="fn-name">' + esc(f.n) + "</div>" +
            '<div class="fn-sig">' + esc(f.g) + "</div>" +
            '<p class="fn-note">' + esc(f.d) + "</p>";

    if (emp || dept) {
      h += '<div class="lbl">Given</div><div class="given">' +
           (emp ? T_EMP : "") + (dept ? T_DEPT : "") + "</div>";
    }
    if (f.s) h += '<div class="lbl">Setup</div><pre class="sql">' + hl(f.s) + "</pre>";

    h += '<div class="lbl">Query <button class="btn btn-quiet btn-sm" id="copy-btn">Copy</button></div>' +
         '<pre class="sql">' + hl(f.q) + "</pre>" +
         '<div class="lbl">Result</div><div id="slot"><div class="rowcount">running&hellip;</div></div>' +
         (f.v ? '<div class="note warn">Volatile — this value differs on every call.</div>' : "");

    var done = read.has(keyOf(f));
    h += '<div class="done-row"><button class="btn btn-quiet' + (done ? " on" : "") +
         '" id="done-btn" data-i="' + i + '">' + (done ? "Read" : "Mark as read") + "</button>" +
         '<span class="hint">← → browse · esc close</span></div>';

    var b = $("#peek-body");
    b.innerHTML = h;
    b.scrollTop = 0;
    $("#veil").classList.add("on");
    $("#peek").classList.add("on");

    var p = shown.indexOf(i);
    $("#prev-btn").disabled = p <= 0;
    $("#next-btn").disabled = p < 0 || p >= shown.length - 1;

    var t = ++turn;
    setTimeout(function () {
      if (t !== turn) return;
      var slot = document.getElementById("slot");
      if (slot) slot.innerHTML = result(f.o);
    }, 140);
  }
  function shut() {
    turn++; at = -1;
    $("#veil").classList.remove("on");
    $("#peek").classList.remove("on");
  }
  function hop(d) {
    var p = shown.indexOf(at);
    if (p < 0) return;
    var n = p + d;
    if (n < 0 || n >= shown.length) return;
    openEntry(shown[n]);
  }

  /* -------------------------------------------------------------- keyboard */
  var cur = -1;
  function pick(n) {
    document.querySelectorAll(".entry.kb").forEach(function (e) { e.classList.remove("kb"); });
    cur = n;
    if (n < 0 || n >= shown.length) return;
    var e = document.querySelector('.entry[data-i="' + shown[n] + '"]');
    if (e) { e.classList.add("kb"); e.scrollIntoView({ block: "center", behavior: "smooth" }); }
  }

  document.addEventListener("keydown", function (e) {
    var typing = e.target.tagName === "INPUT";
    if (e.key === "Escape") {
      if ($("#peek").classList.contains("on")) shut();
      else if (typing) { e.target.value = ""; filter(); e.target.blur(); }
      return;
    }
    if (!typing && (e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey)))) {
      e.preventDefault(); $("#q").focus(); $("#q").select(); return;
    }
    if ($("#peek").classList.contains("on")) {
      if (e.key === "ArrowLeft") { e.preventDefault(); hop(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); hop(1); }
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "ArrowDown") { e.preventDefault(); pick(Math.min(cur + 1, shown.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); pick(Math.max(cur - 1, 0)); }
    if (e.key === "Enter" && cur >= 0) { e.preventDefault(); openEntry(shown[cur]); }
  });

  /* ---------------------------------------------------------------- wiring */
  $("#parts").addEventListener("click", function (e) {
    var m = e.target.closest(".mk");
    if (m) { e.stopPropagation(); mark(+m.dataset.mk); return; }
    var row = e.target.closest(".entry");
    if (row) openEntry(+row.dataset.i);
  });
  $("#parts").addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var row = e.target.closest(".entry");
    if (row && e.target === row) { e.preventDefault(); openEntry(+row.dataset.i); }
  });
  $("#peek-body").addEventListener("click", function (e) {
    var db = e.target.closest("#done-btn");
    if (db) { mark(+db.dataset.i); return; }
    var cp = e.target.closest("#copy-btn");
    if (cp && at >= 0 && navigator.clipboard) {
      navigator.clipboard.writeText(FN[at].q).then(function () {
        cp.textContent = "Copied";
        setTimeout(function () { cp.textContent = "Copy"; }, 1300);
      }).catch(function () { cp.textContent = "Ctrl+C"; });
    }
  });
  $("#q").addEventListener("input", filter);
  $("#veil").addEventListener("click", shut);
  $("#shut-btn").addEventListener("click", shut);
  $("#prev-btn").addEventListener("click", function () { hop(-1); });
  $("#next-btn").addEventListener("click", function () { hop(1); });
  $("#clear-btn").addEventListener("click", function () {
    if (!read.size || !confirm("Clear the " + read.size + " entries marked as read?")) return;
    read.forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
    read.clear();
    document.querySelectorAll(".entry.done").forEach(function (e) { e.classList.remove("done"); });
    meter();
  });

  /* ------------------------------------------------- category scroll-spy */
  function spy() {
    var links = [].slice.call(document.querySelectorAll("#cats a"));
    var queued = false, was = null;
    function look() {
      queued = false;
      var line = 120, id = null;
      document.querySelectorAll(".part:not([hidden])").forEach(function (p) {
        if (p.getBoundingClientRect().top <= line) id = p.dataset.cat;
      });
      if (!id) { var f = document.querySelector(".part:not([hidden])"); id = f ? f.dataset.cat : null; }
      if (!id || id === was) return;
      was = id;
      links.forEach(function (a) { a.classList.toggle("on", a.dataset.cat === id); });
    }
    addEventListener("scroll", function () {
      if (!queued) { queued = true; requestAnimationFrame(look); }
    }, { passive: true });
    look();
  }

  build();
  meter();
  filter();
  spy();
})();
