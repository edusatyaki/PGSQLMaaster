/* ===========================================================================
   Lecture notes — the slide decks that accompany the course.
   One list, rendered in two places: notes.html shows all of them, and any deck
   tagged with a `step` also appears in that step's "About this step" panel, so
   a student reading about subqueries finds the subquery decks without leaving
   the page. Keep this the only place the URLs live.
   =========================================================================== */
(function (root) {
  "use strict";

  var CANVA = "https://www.canva.com/design/";

  root.NOTES = [
    { topic: "Data modelling",
      blurb: "Entities, attributes and relationships — turning a problem description into tables.",
      id: "DAGzIvoS68k/kagxFI1vsAEVMsiknUV-eA" },

    { topic: "Joins",
      blurb: "How rows from two tables are matched, and what each join type keeps.",
      id: "DAGzIoUODDE/L7YBebWitOUxZcxQ6M7P1A" },

    { topic: "Set operations",
      blurb: "UNION, INTERSECT and EXCEPT — combining result sets rather than rows.",
      id: "DAGzrZ1HhqQ/OIGOuEQiOF40-1YDF-2qpw" },

    { topic: "Non-correlated subqueries",
      blurb: "The inner query runs once, on its own, and hands its answer to the outer query.",
      id: "DAGzrb_aG9c/CtaPSGjLzbD8Hz5vCe1lnA",
      step: "subqueries" },

    { topic: "Correlated subqueries",
      blurb: "The inner query re-runs for every outer row, because it depends on that row.",
      id: "DAGz9fGffqQ/Tjm9Z3AjcY6rMgTjHdAW2g",
      step: "subqueries" },

    { topic: "Normalisation",
      blurb: "1NF through 3NF — removing the redundancy that lets a table contradict itself.",
      id: "DAG3VLLbcDc/eETtcBwGDKcpxxgLDK7IkA" }
  ];

  /* `view` opens the deck in Canva; `embed` is the form the decks render in
     inside the notes screen — ?embed drops Canva's own chrome. */
  root.NOTES.forEach(function (n) {
    n.url   = CANVA + n.id + "/view";
    n.embed = CANVA + n.id + "/view?embed&hide_controls=1";
  });

  /** The decks attached to one step, in list order. */
  root.notesFor = function (step) {
    return root.NOTES.filter(function (n) { return n.step === step; });
  };
})(window);
