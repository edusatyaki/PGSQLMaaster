/* ===========================================================================
   Lecture notes — the slide decks that accompany the course.
   One list, rendered in two places: notes.html shows all of them, and any deck
   tagged with a `step` also appears in that step's "About this step" panel, so
   a student reading about subqueries finds the subquery decks without leaving
   the page. Keep this the only place the URLs live.
   =========================================================================== */
(function (root) {
  "use strict";

  /* The host and the deck ids are assembled at runtime rather than sitting in
     the source as plain strings, and the "open in Canva" control is gone, so
     the provider is not advertised on the page.
     This is obfuscation, not protection: the browser has to fetch the embed, so
     anyone opening devtools can still read the iframe's src. Treat these decks
     as published, and rely on Canva's own link sharing for real access control. */
  var H = ["aHR0cHM6Ly93d3cu", "Y2FudmEuY29t", "L2Rlc2lnbi8="].join("");
  var CANVA = atob(H);

  root.NOTES = [
    { topic: "Data modelling",
      blurb: "Entities, attributes and relationships — turning a problem description into tables.",
      k: "REFHekl2b1M2OGsva2FneEZJMXZzQUVWTXNpa25VVi1lQQ==" },

    { topic: "Joins",
      blurb: "How rows from two tables are matched, and what each join type keeps.",
      k: "REFHeklvVU9EREUvTDdZQmViV2l0T1V4WmN4UTZNN1AxQQ==" },

    { topic: "Set operations",
      blurb: "UNION, INTERSECT and EXCEPT — combining result sets rather than rows.",
      k: "REFHenJaMUhocVEvT0lHT3VFUWlPRjQwLTFZREYtMnFwdw==" },

    { topic: "Non-correlated subqueries",
      blurb: "The inner query runs once, on its own, and hands its answer to the outer query.",
      k: "REFHenJiX2FHOWMvQ3RhUFNHakx6YkQ4SHo1dkNlMWxuQQ==",
      step: "subqueries" },

    { topic: "Correlated subqueries",
      blurb: "The inner query re-runs for every outer row, because it depends on that row.",
      k: "REFHejlmR2ZmcVEvVGptOVozQWpjWTZyTWdUakhkQVcyZw==",
      step: "subqueries" },

    { topic: "Window functions",
      blurb: "Ranking, running totals and frames — one row per row in, unlike GROUP BY.",
      k: "REFHOFVzVUI3N1UvXzQ0V2I5QWNud3ZOTy1nNzlZVVBkdw==" }
  ];

  /* Only the embed form is built — there is no outbound link any more. */
  root.NOTES.forEach(function (n) {
    var d = atob(n.k);
    n.embed = CANVA + d + "/view?embed&hide_controls=1";
    delete n.k;
  });

  /** A stable in-site anchor for a deck, e.g. notes.html#joins */
  root.noteHref = function (n) {
    return "notes.html#" + n.topic.toLowerCase().replace(/[^a-z]+/g, "-");
  };

  /** The decks attached to one step, in list order. */
  root.notesFor = function (step) {
    return root.NOTES.filter(function (n) { return n.step === step; });
  };
})(window);
