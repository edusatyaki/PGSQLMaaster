/* Module 05 - join page logic (merged from SQL Roadmap).
   Carried over unchanged; it binds to the same element ids. */
(function(){
(function () {
  SQLR.mountNav("roadmap");
  var $ = function (id) { return document.getElementById(id); };
  var form = $("join"), joined = $("joined");

  /* ---------- handle validation ---------- */
  var RULES = {
    name:       { re: /^.{2,60}$/, msg: "Enter your full name." },
    github:     { re: /^[A-Za-z\d](?:[A-Za-z\d]|-(?=[A-Za-z\d])){0,38}$/,
                  empty: "Enter your GitHub username.",
                  msg: "That is not a valid GitHub username (letters, digits and dashes)." },
    leetcode:   { re: /^[A-Za-z\d_-]{1,40}$/,
                  empty: "Enter your LeetCode username \u2014 your solves are read from it.",
                  msg: "Letters, digits, underscores and dashes only." },
    enrollment: { re: /^[A-Za-z\d][A-Za-z\d\/-]{2,29}$/,
                  msg: "Enter your enrollment number as it appears on your ID card." },
    hackerrank: { re: /^[A-Za-z\d_]{1,50}$/,
                  empty: "Enter your HackerRank username \u2014 your solves are read from it.",
                  msg: "Letters, digits and underscores only." },
    codeforces: { re: /^[A-Za-z\d_.-]{1,50}$/, msg: "Letters, digits, dots, dashes and underscores only.", optional: true }
  };

  var section = "";
  document.getElementById("section").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    section = b.dataset.v;
    [].forEach.call(this.children, function (c) { c.setAttribute("aria-pressed", String(c === b)); });
    showError("section", "");
  });

  function showError(field, msg) {
    var el = $("e-" + field);
    el.textContent = msg || "";
    el.hidden = !msg;
  }

  function validate(values) {
    var ok = true;
    Object.keys(RULES).forEach(function (f) {
      var r = RULES[f], v = values[f];
      if (!v) {
        if (r.optional) { showError(f, ""); return; }
        // an empty field needs "we need this", not a lecture on allowed characters
        showError(f, r.empty || r.msg); ok = false; return;
      }
      if (!r.re.test(v)) { showError(f, r.msg); ok = false; return; }
      showError(f, "");
    });
    if (!values.section) { showError("section", "Pick the lab you attend."); ok = false; }
    else showError("section", "");
    return ok;
  }

  /* ---------- live handle checks (best effort, never blocking) ---------- */
  function checkGithub(u) {
    return fetch("https://api.github.com/users/" + encodeURIComponent(u))
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return undefined; });   // undefined = could not check
  }
  function checkCodeforces(h) {
    return fetch("https://codeforces.com/api/user.info?handles=" + encodeURIComponent(h))
      .then(function (r) { return r.json(); })
      .then(function (j) { return j.status === "OK" ? j.result[0] : null; })
      .catch(function () { return undefined; });
  }

  var ghTimer;
  $("github").addEventListener("input", function () {
    var u = this.value.trim();
    clearTimeout(ghTimer);
    if (!RULES.github.re.test(u)) return;
    ghTimer = setTimeout(function () {
      checkGithub(u).then(function (user) {
        if (user) $("h-github").textContent = "✓ github.com/" + user.login +
          (user.name ? " — " + user.name : "");
        else if (user === null) $("h-github").textContent = "No GitHub account with that username.";
      });
    }, 500);
  });

  var cfTimer;
  $("codeforces").addEventListener("input", function () {
    var h = this.value.trim();
    clearTimeout(cfTimer);
    $("h-codeforces").textContent = "";
    if (!h || !RULES.codeforces.re.test(h)) return;
    cfTimer = setTimeout(function () {
      checkCodeforces(h).then(function (u) {
        if (u) $("h-codeforces").textContent = "✓ " + u.handle +
          (u.rank ? " — " + u.rank + " (" + (u.rating || "unrated") + ")" : "");
        else if (u === null) $("h-codeforces").textContent = "No Codeforces handle by that name.";
      });
    }, 500);
  });

  /* ---------- submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var values = {
      name: $("name").value.trim(),
      leetcode: $("leetcode").value.trim(),
      enrollment: $("enrollment").value.trim().toUpperCase(),
      section: section,
      github: $("github").value.trim(),
      hackerrank: $("hackerrank").value.trim(),
      codeforces: $("codeforces").value.trim()
    };
    if (!validate(values)) return;

    var btn = $("submit");
    btn.disabled = true;
    btn.textContent = "Connecting…";

    var student = Object.assign({}, values, { joined: new Date().toISOString() });
    SQLR.store.setStudent(student);

    // The LeetCode profile check runs on the backend — leetcode.com sends no CORS
    // headers, so the browser cannot ask it directly.
    SQLR.post("register", { student: student })
      .then(function (res) {
        var unknown = res && (res.leetcodeUnknown ? "leetcode" : (res.hackerrankUnknown ? "hackerrank" : null));
        if (unknown) {
          SQLR.store.signOut();
          showError(unknown, (unknown === "leetcode" ? "LeetCode" : "HackerRank") +
            " has no profile called \u201c" + student[unknown] +
            "\u201d. Check the spelling on your profile page.");
          btn.disabled = false;
          btn.innerHTML = 'Start the roadmap <span class="arrow" aria-hidden="true">&rarr;</span>';
          $(unknown).focus();
          return;
        }
        if (res && res.ok && res.student && res.student.solved) {
          SQLR.store.setSolved(res.student.solved);   // returning student, restore progress
        }
        if (!res || !res.ok) SQLR.enqueue("register", { student: student });
        location.href = "roadmap.html";
      })
      .catch(function () {
        // Backend unreachable: let them start anyway rather than blocking on our outage.
        SQLR.enqueue("register", { student: student });
        location.href = "roadmap.html";
      });
  });

  /* ---------- already signed in ---------- */
  function renderJoined(s) {
    form.hidden = true;
    joined.hidden = false;
    joined.innerHTML =
      '<p class="eyebrow">Signed in on this device</p>' +
      '<h2 style="font-size:22px;margin:6px 0 4px">' + SQLR.esc(s.name) + "</h2>" +
      '<p class="small muted mono">' + SQLR.esc(s.section || "") +
        (s.enrollment ? " · " + SQLR.esc(s.enrollment) : "") + "</p>" +
      '<p class="small muted mono">lc/' + SQLR.esc(s.leetcode || "—") + " · @" + SQLR.esc(s.github) +
        (s.hackerrank ? " · hr/" + SQLR.esc(s.hackerrank) : "") +
        (s.codeforces ? " · cf/" + SQLR.esc(s.codeforces) : "") + "</p>" +
      '<div class="row" style="margin-top:16px">' +
        '<a class="btn btn-primary" href="roadmap.html">Continue the roadmap</a>' +
        '<a class="btn" href="leaderboard.html">Leaderboard</a>' +
        '<button class="btn" id="signout" type="button">Sign out</button>' +
      "</div>";
    $("signout").addEventListener("click", function () {
      if (confirm("Sign out on this device? Your progress stays in the class sheet and comes back when you sign in with the same GitHub username.")) {
        SQLR.store.signOut();
        location.reload();
      }
    });
  }

  var me = SQLR.store.student();
  if (me) { renderJoined(me); SQLR.flushQueue(); }

  /* ---------- connection status ---------- */
  if (!SQLR.online) {
    $("status").innerHTML = '<div class="banner warn"><span>⚑</span><div><b>Class sheet not connected yet.</b> ' +
      'Progress is saved in this browser only, and the leaderboard will show just you. ' +
      'The instructor needs to add the Apps Script URL in <span class="mono">assets/config.js</span>.</div></div>';
  }

  /* ---------- chapter preview ---------- */
  SQLR.roadmap().then(function (data) {
    var counts = {};
    data.problems.forEach(function (p) {
      var c = counts[p.ch] || (counts[p.ch] = { n: 0, free: 0, pts: 0 });
      c.n++; c.pts += SQLR.points(p); if (!p.prem) c.free++;
    });
    $("chapters-preview").innerHTML = data.chapters.map(function (ch, i) {
      var c = counts[ch];
      return '<div class="prob"><span class="ch-idx">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<div class="p-main"><span class="p-name">' + SQLR.esc(ch) + "</span></div>" +
        '<span class="ch-meta">' + c.free + " free / " + c.n + " total</span></div>";
    }).join("");
  }).catch(function (err) {
    $("chapters-preview").innerHTML = '<div class="empty">' + SQLR.esc(err.message) + "</div>";
  });
})();
})();
