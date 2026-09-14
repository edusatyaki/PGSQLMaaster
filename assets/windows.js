/* Module 04 — window-function visualiser. Logic carried over unchanged. */
"use strict";

/* ------------------------------------------------------------------ data */
/* Snitch — a 12-row extract of the 20-row lecture table (men's fashion brand).
   Kept small so the type stays readable from the back of the hall.
   Three properties are deliberate:
     - order_amount 3499 appears TWICE (S1008, S1016) and they sit in
       DIFFERENT cities, so the RANK/DENSE_RANK tie only shows when
       PARTITION BY is switched off.
     - Bengaluru holds TWO customers (C03 and C07 — the same person
       registered twice), so 'city' and 'customer_id' give different windows.
     - C07 has exactly ONE order, giving a partition of size 1: LAG is NULL
       and every frame collapses to that single row. */
const DATA = [
  {order_id:"S1001", order_date:"2025-01-02", customer_id:"C01", city:"Mumbai",    category:"Shirts",     order_amount:2598},
  {order_id:"S1002", order_date:"2025-01-02", customer_id:"C02", city:"Delhi",     category:"T-Shirts",   order_amount:2397},
  {order_id:"S1003", order_date:"2025-01-03", customer_id:"C03", city:"Bengaluru", category:"Jeans",      order_amount:1999},
  {order_id:"S1004", order_date:"2025-01-04", customer_id:"C01", city:"Mumbai",    category:"Perfume",    order_amount:1499},
  {order_id:"S1005", order_date:"2025-01-05", customer_id:"C04", city:"Pune",      category:"Cargos",     order_amount:3598},
  {order_id:"S1006", order_date:"2025-01-06", customer_id:"C02", city:"Delhi",     category:"Shoes",      order_amount:2999},
  {order_id:"S1008", order_date:"2025-01-08", customer_id:"C03", city:"Bengaluru", category:"Winterwear", order_amount:3499},
  {order_id:"S1011", order_date:"2025-01-11", customer_id:"C04", city:"Pune",      category:"Shirts",     order_amount:1599},
  {order_id:"S1013", order_date:"2025-01-13", customer_id:"C02", city:"Delhi",     category:"Jeans",      order_amount:2199},
  {order_id:"S1015", order_date:"2025-01-15", customer_id:"C03", city:"Bengaluru", category:"Perfume",    order_amount:2998},
  {order_id:"S1016", order_date:"2025-01-16", customer_id:"C01", city:"Mumbai",    category:"Shoes",      order_amount:3499},
  {order_id:"S1017", order_date:"2025-01-17", customer_id:"C07", city:"Bengaluru", category:"Winterwear", order_amount:4499}
];

/* usesFrame: does the frame clause change this function's answer?
   Ranking and offset functions ignore it entirely — that is a lesson in itself. */
const FNS = {
  SUM:         {label:"SUM(order_amount)",         usesFrame:true,  agg:rs => rs.reduce((a,r)=>a+r.order_amount,0)},
  AVG:         {label:"AVG(order_amount)",         usesFrame:true,  agg:rs => Math.round(rs.reduce((a,r)=>a+r.order_amount,0)/rs.length)},
  COUNT:       {label:"COUNT(*)",                  usesFrame:true,  agg:rs => rs.length},
  MAX:         {label:"MAX(order_amount)",         usesFrame:true,  agg:rs => Math.max(...rs.map(r=>r.order_amount))},
  MIN:         {label:"MIN(order_amount)",         usesFrame:true,  agg:rs => Math.min(...rs.map(r=>r.order_amount))},
  ROW_NUMBER:  {label:"ROW_NUMBER()",              usesFrame:false},
  RANK:        {label:"RANK()",                    usesFrame:false},
  DENSE_RANK:  {label:"DENSE_RANK()",              usesFrame:false},
  LAG:         {label:"LAG(order_amount)",         usesFrame:false},
  LEAD:        {label:"LEAD(order_amount)",        usesFrame:false},
  FIRST_VALUE: {label:"FIRST_VALUE(order_amount)", usesFrame:true},
  LAST_VALUE:  {label:"LAST_VALUE(order_amount)",  usesFrame:true}
};

const FRAMES = {
  running: {lo_sql:"UNBOUNDED PRECEDING", hi_sql:"CURRENT ROW",
            hint:"the window GROWS one row at a time — a running total",
            lo:(i,n,N) => 0,               hi:(i,n,N) => i},
  whole:   {lo_sql:"UNBOUNDED PRECEDING", hi_sql:"UNBOUNDED FOLLOWING",
            hint:"the whole partition is visible from every row",
            lo:(i,n,N) => 0,               hi:(i,n,N) => n-1},
  moving:  {lo_sql:"<N> PRECEDING",       hi_sql:"CURRENT ROW",
            hint:"a fixed-size window that SLIDES — a moving average",
            lo:(i,n,N) => Math.max(0,i-N), hi:(i,n,N) => i},
  current: {lo_sql:"CURRENT ROW",         hi_sql:"CURRENT ROW",
            hint:"only itself — no window at all, really",
            lo:(i,n,N) => i,               hi:(i,n,N) => i}
};

const STAGES = [
  {key:"ROWS",         label:"Rows"},
  {key:"PARTITION BY", label:"PARTITION BY"},
  {key:"ORDER BY",     label:"ORDER BY"},
  {key:"FRAME",        label:"Frame"},
  {key:"COMPUTE",      label:"Compute"},
  {key:"RESULT",       label:"Result"}
];

const NARRATION = {
  0:"Twelve orders. No window yet — this is what <b>GROUP BY</b> would be about to destroy.",
  1:"<b>PARTITION BY splits the rows into windows.</b> Unlike GROUP BY, nothing is merged.",
  2:"<b>ORDER BY sequences the rows inside each window.</b> Ranking and running totals need this.",
  3:"<b>The frame is what the current row can actually see</b> — highlighted in blue.",
  4:"The function runs on <b>the frame only</b>, producing one value for the current row.",
  5:"<b>12 rows in, 12 rows out.</b> Every row survived and gained a column."
};

const PALETTE = ["#0673F9","#009965","#B54708","#8B3DCF","#BE185D","#0E7490"];

/* ------------------------------------------------------------------ state */
const state = {stage:0, fn:"SUM", part:"city", order:"order_date", dir:"ASC",
               frame:"running", n:2, cur:"S1001"};
let playTimer = null;

const $  = s => document.querySelector(s);
const nf = new Intl.NumberFormat("en-IN");
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const isCount = () => state.fn === "COUNT" || state.fn === "ROW_NUMBER" ||
                      state.fn === "RANK"  || state.fn === "DENSE_RANK";
const fmt = v => v === null || v === undefined ? null : (isCount() ? String(v) : nf.format(v));

/* ------------------------------------------------------------------ fit */
function fit(){
  /* merged: scale against the slide's own container so it can sit inside the
     site shell. In fullscreen the container IS the screen, so this still
     fills it exactly as the standalone version did. */
  const host = $("#stage").getBoundingClientRect();
  const s = Math.min(host.width / 1600, host.height / 900);
  $("#slide").style.transform = "translate(-50%, -50%) scale(" + s + ")";
}
window.addEventListener("resize", fit);
if (window.ResizeObserver) new ResizeObserver(fit).observe($("#stage"));
document.addEventListener("fullscreenchange", fit);
document.addEventListener("webkitfullscreenchange", fit);

/* ------------------------------------------------------------------ model */
function orderVal(r){
  return state.order === "order_amount" ? r.order_amount : r[state.order];
}
function cmp(a,b){
  const x = orderVal(a), y = orderVal(b);
  let d = (typeof x === "number") ? x - y : String(x).localeCompare(String(y));
  if(state.dir === "DESC") d = -d;
  /* The tie-break stays ASCENDING even under DESC — this mirrors
     `ORDER BY col DESC, order_id` in PostgreSQL, where the direction
     applies only to the column it is attached to. Negating the tie-break
     as well would silently reorder tied rows and change every running
     total, ROW_NUMBER, LAG and LEAD around the tie. */
  if(d === 0) d = a.order_id.localeCompare(b.order_id);
  return d;
}

function compute(){
  /* 1. PARTITION — split rows into windows */
  const map = new Map();
  DATA.forEach(r => {
    const k = state.part === "none" ? "ALL ROWS" : r[state.part];
    if(!map.has(k)) map.set(k, []);
    map.get(k).push(r);
  });

  const partKeys = [...map.keys()].sort((a,b) => String(a).localeCompare(String(b)));
  const colorOf = {};
  partKeys.forEach((k,i) => colorOf[k] = state.part === "none" ? "var(--faint)" : PALETTE[i % PALETTE.length]);

  /* 2. ORDER — sequence rows inside each window */
  const F = FRAMES[state.frame];
  const fn = FNS[state.fn];
  const out = new Map();          // order_id -> computed row info

  partKeys.forEach(k => {
    const rows = map.get(k).slice().sort(cmp);
    const n = rows.length;

    rows.forEach((r,i) => {
      /* 3. FRAME — which of this window's rows feed the calculation */
      let lo = F.lo(i,n,state.n), hi = F.hi(i,n,state.n);
      if(!fn.usesFrame){ lo = 0; hi = n-1; }          // ranking/offset ignore the frame
      const frameRows = rows.slice(lo, hi+1);

      /* 4. COMPUTE */
      let value = null, calc = "";
      if(fn.agg){
        value = fn.agg(frameRows);
        const vals = frameRows.map(x => nf.format(x.order_amount));
        calc = state.fn === "COUNT"
             ? "COUNT of " + frameRows.length + " row" + (frameRows.length===1?"":"s")
             : state.fn + "(" + vals.join(", ") + ")";
      } else if(state.fn === "ROW_NUMBER"){
        value = i + 1;
        calc = "position " + (i+1) + " in this window";
      } else if(state.fn === "RANK" || state.fn === "DENSE_RANK"){
        // rank = 1 + the number of rows strictly ahead of me on the ORDER BY value
        const rank = 1 + rows.filter(x => x !== r && aheadOf(x, r)).length;
        // dense_rank = how many DISTINCT order values are at or ahead of mine
        const seen = new Set();
        rows.forEach(x => { if(x === r || aheadOf(x, r)) seen.add(String(orderVal(x))); });
        const dense = seen.size;
        value = state.fn === "RANK" ? rank : dense;
        const peers = rows.filter(x => String(orderVal(x)) === String(orderVal(r))).length;
        calc = peers > 1
             ? peers + " rows tie on " + esc(String(orderVal(r)))
             : "no tie on " + esc(String(orderVal(r)));
      } else if(state.fn === "LAG" || state.fn === "LEAD"){
        const j = state.fn === "LAG" ? i - 1 : i + 1;
        const nb = rows[j];
        value = nb ? nb.order_amount : null;
        calc = nb ? (state.fn === "LAG" ? "the row before" : "the row after") + " is " + esc(nb.order_id)
                  : "no " + (state.fn === "LAG" ? "previous" : "next") + " row in this window";
      } else if(state.fn === "FIRST_VALUE" || state.fn === "LAST_VALUE"){
        const pick = state.fn === "FIRST_VALUE" ? frameRows[0] : frameRows[frameRows.length-1];
        value = pick ? pick.order_amount : null;
        calc = (state.fn === "FIRST_VALUE" ? "first" : "last") + " row of the frame is " + esc(pick.order_id);
      }

      out.set(r.order_id, {row:r, part:k, color:colorOf[k], seq:i+1, idx:i,
                           lo, hi, n, frameRows, value, calc});
    });
  });

  /* keep a stable display order for the rows table */
  const display = DATA.slice().sort((a,b) => {
    const A = out.get(a.order_id), B = out.get(b.order_id);
    if(state.stage >= 1){
      const d = String(A.part).localeCompare(String(B.part));
      if(d !== 0) return d;
    }
    return state.stage >= 2 ? A.idx - B.idx : a.order_id.localeCompare(b.order_id);
  });

  return {out, partKeys, display, colorOf, cur: out.get(state.cur)};
}

/* is x ahead of r in the current ORDER BY sequence, ignoring the id tie-break? */
function aheadOf(x, r){
  const a = orderVal(x), b = orderVal(r);
  if(String(a) === String(b)) return false;
  const d = (typeof a === "number") ? a - b : String(a).localeCompare(String(b));
  return state.dir === "DESC" ? d > 0 : d < 0;
}

/* ------------------------------------------------------------------ sql */
function renderSQL(){
  const fn = FNS[state.fn];
  const cls = i => "clause" + (state.stage === i ? " live" : (state.stage > i ? " done" : ""));
  const K = t => '<span class="kw">' + t + '</span>';
  const F = t => '<span class="fn">' + t + '</span>';
  const usesFrame = fn.usesFrame;

  const FR = FRAMES[state.frame];
  const loSql = FR.lo_sql.replace("<N>", '<span class="num">' + state.n + "</span>");

  let out = "";
  out += '<span class="' + cls(5) + '">' + K("SELECT") + " order_id, order_amount,</span>";
  out += '<span class="' + cls(4) + '">    ' + F(fn.label) + "</span>";
  out += '<span class="' + cls(4) + '">    ' + K("OVER") + " (</span>";
  out += '<span class="' + (state.part === "none" ? "clause off" : cls(1)) + '">      ' +
         K("PARTITION BY") + " " + (state.part === "none" ? "…" : state.part) + "</span>";
  out += '<span class="' + cls(2) + '">      ' + K("ORDER BY") + " " + state.order + " " + K(state.dir) + "</span>";
  const fcls = usesFrame ? cls(3) : "clause off";
  out += '<span class="' + fcls + '">      ' + K("ROWS BETWEEN") + "</span>";
  out += '<span class="' + fcls + '">        ' + loSql + "</span>";
  out += '<span class="' + fcls + '">        ' + K("AND") + " " + FR.hi_sql + "</span>";
  out += '<span class="' + cls(4) + '">    )</span>';
  out += '<span class="' + cls(0) + '">' + K("FROM") + " snitch_sales;</span>";

  $("#sql").innerHTML = out;
  $("#sql-hint").textContent = STAGES[state.stage].key;
}

function renderNote(m){
  const fn = FNS[state.fn];
  const el = $("#sqlnote");
  let cls = "sqlnote", html;

  if(!fn.usesFrame){
    html = "<b>" + esc(state.fn) + "</b> ignores the frame clause — it only needs " +
           "PARTITION BY and ORDER BY. The frame line is struck out above.";
  } else if(state.fn === "LAST_VALUE" && state.frame === "running"){
    cls = "sqlnote trap";
    html = "<b>The classic trap.</b> With this frame the last visible row IS the current row, " +
           "so LAST_VALUE just echoes order_amount. Switch the frame to UNBOUNDED FOLLOWING to fix it.";
  } else if(state.frame === "current"){
    html = "<b>A frame of one.</b> Every aggregate returns the row's own value — " +
           "proof that the frame, not the function, decides the answer.";
  } else if(state.frame === "whole"){
    html = "<b>No ORDER BY effect on the answer.</b> Every row sees the entire partition, " +
           "so all rows in a window share one value.";
  } else if(state.frame === "moving"){
    html = "<b>Sliding window.</b> Always " + (state.n+1) + " rows (fewer at the start of a window): " +
           "the current row plus " + state.n + " before it.";
  } else {
    html = "<b>Running total.</b> The window grows by one row each step, so no two rows " +
           "in a window share the same answer.";
  }
  el.className = cls;
  el.innerHTML = html;
}

/* ------------------------------------------------------------------ views */
function renderStepper(){
  $("#stepper").innerHTML = STAGES.map((s,i) => {
    const c = i === state.stage ? "step live" : (i < state.stage ? "step done" : "step");
    return '<button class="' + c + '" data-go="' + i + '"><span class="n">' + (i+1) + "</span>" + s.label + "</button>";
  }).join("");
  $("#btn-prev").disabled = state.stage === 0;
  $("#btn-next").disabled = state.stage === STAGES.length - 1;
}

function renderRows(m){
  const showPart  = state.stage >= 1;
  const showSeq   = state.stage >= 2;
  const showFrame = state.stage >= 3;
  const cur = m.cur;

  let h = "<thead><tr>";
  if(showFrame) h += "<th></th>";
  if(showSeq)   h += "<th>#</th>";
  h += "<th>order</th><th>date</th><th>city</th><th>cust</th><th>amount</th>";
  if(showPart && state.part !== "none") h += "<th>window</th>";
  h += "</tr></thead><tbody>";

  m.display.forEach(r => {
    const o = m.out.get(r.order_id);
    const sameWin = o.part === cur.part;
    const inFrame = sameWin && o.idx >= cur.lo && o.idx <= cur.hi;
    const isCur   = r.order_id === state.cur;

    let cls = "";
    if(showFrame){
      if(isCur)            cls = "current";
      else if(!sameWin)    cls = "otherpart";
      else if(inFrame)     cls = "inframe";
      else                 cls = "outframe";
    } else if(isCur && state.stage >= 1){
      cls = "current";
    }

    h += '<tr class="' + cls + '" data-row="' + r.order_id + '">';
    if(showFrame) h += '<td class="mark">' + (isCur ? "▶" : (inFrame ? "•" : "")) + "</td>";
    if(showSeq)   h += '<td class="seq">' + o.seq + "</td>";
    h += "<td>" + r.order_id + "</td><td>" + r.order_date.slice(5) + "</td>" +
         "<td>" + esc(r.city) + "</td><td>" + r.customer_id + "</td>" +
         '<td class="val">' + nf.format(r.order_amount) + "</td>";
    if(showPart && state.part !== "none"){
      h += '<td><span class="grpdot" style="background:' + o.color + '"></span>' + esc(o.part) + "</td>";
    }
    h += "</tr>";
  });

  $("#rows-tbl").innerHTML = h + "</tbody>";
  $("#rows-pill").textContent = showPart
      ? m.partKeys.length + (state.part === "none" ? " window" : " windows")
      : DATA.length + " rows";
}

function renderResult(m){
  if(state.stage < 5){
    $("#result").innerHTML = '<div class="idle">result appears at step 6</div>';
    $("#result-pill").textContent = "—";
    $("#result-pill").className = "pill";
    return;
  }
  const fn = FNS[state.fn];
  let h = "<thead><tr><th>order</th><th>amount</th><th>" + esc(shortLabel()) + "</th></tr></thead><tbody>";
  m.display.forEach(r => {
    const o = m.out.get(r.order_id);
    const v = fmt(o.value);
    h += '<tr class="' + (r.order_id === state.cur ? "current" : "") + '">' +
         "<td>" + r.order_id + "</td>" +
         "<td>" + nf.format(r.order_amount) + "</td>" +
         '<td class="val">' + (v === null ? '<span class="nullv">NULL</span>' : v) + "</td></tr>";
  });
  $("#result").innerHTML = "<table>" + h + "</tbody></table>";
  $("#result-pill").textContent = DATA.length + " in → " + DATA.length + " out";
  $("#result-pill").className = "pill good";
}

function shortLabel(){
  return {SUM:"sum",AVG:"avg",COUNT:"count",MAX:"max",MIN:"min",ROW_NUMBER:"row_num",
          RANK:"rank",DENSE_RANK:"dense",LAG:"lag",LEAD:"lead",
          FIRST_VALUE:"first",LAST_VALUE:"last"}[state.fn];
}

function renderWindow(m){
  const cur = m.cur, fn = FNS[state.fn];
  const el = $("#winstrip");

  if(state.stage < 3){
    el.innerHTML = '<div class="idle">the frame appears at step 4 — pick a current row on the left</div>';
    $("#win-pill").textContent = "—";
    return;
  }

  /* the whole partition as chips, with the frame highlighted */
  const partRows = DATA.filter(r => m.out.get(r.order_id).part === cur.part)
                       .sort((a,b) => m.out.get(a.order_id).idx - m.out.get(b.order_id).idx);

  const chips = partRows.map(r => {
    const o = m.out.get(r.order_id);
    const inFrame = fn.usesFrame ? (o.idx >= cur.lo && o.idx <= cur.hi) : true;
    const c = r.order_id === state.cur ? "chip cur" : (inFrame ? "chip" : "chip out");
    return '<span class="' + c + '">' + nf.format(r.order_amount) + "</span>";
  }).join("");

  const showAnswer = state.stage >= 4;
  const v = fmt(cur.value);
  const answer = showAnswer
    ? '<div class="answer' + (v === null ? " nullish" : "") + '"><span class="l">' + esc(fn.label) +
      '</span><span class="v">' + (v === null ? "NULL" : v) + "</span></div>"
    : '<div class="answer nullish"><span class="l">next step</span><span class="v">?</span></div>';

  el.innerHTML =
    '<div class="wrapstrip">' +
      '<div class="wpanel">' +
        '<div class="wlabel">window: ' + esc(String(cur.part)) + " · " + cur.n +
          " row" + (cur.n===1?"":"s") + " · current row " + esc(state.cur) +
          " (position " + cur.seq + ")</div>" +
        '<div class="chips">' + chips + "</div>" +
        '<div class="calcline">' + (showAnswer ? "<b>" + esc(cur.calc) + "</b>" :
            "the blue chips are inside the frame — press Next to compute") + "</div>" +
      "</div>" + answer +
    "</div>";

  const size = fn.usesFrame ? (cur.hi - cur.lo + 1) : cur.n;
  $("#win-pill").textContent = size + " of " + cur.n + " row" + (cur.n===1?"":"s") + " in frame";
}

function render(){
  const m = compute();
  if(!m.cur){ state.cur = DATA[0].order_id; return render(); }
  renderStepper();
  renderSQL();
  renderNote(m);
  $("#nar-badge").textContent = STAGES[state.stage].key;
  $("#nar-text").innerHTML = NARRATION[state.stage];
  renderRows(m);
  renderResult(m);
  renderWindow(m);
  $("#cur-label").textContent = state.cur;
  $("#c-n").style.display = state.frame === "moving" ? "" : "none";
  $("#c-frame").disabled = !FNS[state.fn].usesFrame;
  const fh = $("#frame-hint");
  if(!FNS[state.fn].usesFrame){
    fh.className = "hint warn";
    fh.textContent = state.fn + " ignores the frame";
  } else {
    fh.className = "hint";
    fh.textContent = FRAMES[state.frame].hint;
  }
}

/* ------------------------------------------------------------------ wiring */
function go(i){
  state.stage = Math.max(0, Math.min(STAGES.length - 1, i));
  render();
}
function stopPlay(){
  clearInterval(playTimer); playTimer = null;
  $("#btn-play").innerHTML = "&#9654; Play";
}
function startPlay(){
  if(playTimer){ stopPlay(); return; }
  if(state.stage === STAGES.length - 1) go(0);
  $("#btn-play").innerHTML = "&#10073;&#10073; Pause";
  playTimer = setInterval(() => {
    if(state.stage >= STAGES.length - 1) stopPlay();
    else go(state.stage + 1);
  }, 1900);
}
function stepRow(delta){
  const m = compute();
  const ids = m.display.map(r => r.order_id);
  const i = ids.indexOf(state.cur);
  state.cur = ids[(i + delta + ids.length) % ids.length];
  if(state.stage < 3) go(3); else render();
}

$("#stepper").addEventListener("click", e => {
  const b = e.target.closest("[data-go]");
  if(b){ stopPlay(); go(+b.dataset.go); }
});
$("#btn-next").addEventListener("click",  () => { stopPlay(); go(state.stage + 1); });
$("#btn-prev").addEventListener("click",  () => { stopPlay(); go(state.stage - 1); });
$("#btn-reset").addEventListener("click", () => { stopPlay(); go(0); });
$("#btn-play").addEventListener("click", startPlay);
$("#btn-rowup").addEventListener("click", () => { stopPlay(); stepRow(-1); });
$("#btn-rowdn").addEventListener("click", () => { stopPlay(); stepRow(1); });

$("#rows-tbl").addEventListener("click", e => {
  const tr = e.target.closest("[data-row]");
  if(!tr) return;
  stopPlay();
  state.cur = tr.dataset.row;
  if(state.stage < 3) go(3); else render();
});

function toggleFullscreen(){
  /* merged: fullscreen the slide itself, not the whole document — the page now
     has site chrome around it that should not come along. */
  if(document.fullscreenElement) document.exitFullscreen();
  else (document.getElementById("stage") || document.documentElement)
        .requestFullscreen().catch(()=>{});
}
$("#btn-full").addEventListener("click", toggleFullscreen);

$("#c-fn").addEventListener("change",    e => { state.fn = e.target.value; render(); });
$("#c-part").addEventListener("change",  e => { state.part = e.target.value; render(); });
$("#c-order").addEventListener("change", e => { state.order = e.target.value; render(); });
$("#c-dir").addEventListener("change",   e => { state.dir = e.target.value; render(); });
$("#c-frame").addEventListener("change", e => { state.frame = e.target.value; render(); });
$("#c-n").addEventListener("input",      e => { state.n = Number(e.target.value); render(); });

document.addEventListener("keydown", e => {
  if(e.target.matches("input,select,button")) return;
  if(e.key === "ArrowRight" || e.key === " "){ e.preventDefault(); stopPlay(); go(state.stage + 1); }
  if(e.key === "ArrowLeft"){ stopPlay(); go(state.stage - 1); }
  if(e.key === "ArrowDown"){ e.preventDefault(); stopPlay(); stepRow(1); }
  if(e.key === "ArrowUp"){   e.preventDefault(); stopPlay(); stepRow(-1); }
  if(e.key === "f" || e.key === "F"){ toggleFullscreen(); }
});

/* the controls must show what `state` actually holds, not whatever
   option happens to be first in the markup */
function syncControls(){
  $("#c-fn").value    = state.fn;
  $("#c-part").value  = state.part;
  $("#c-order").value = state.order;
  $("#c-dir").value   = state.dir;
  $("#c-frame").value = state.frame;
  $("#c-n").value     = state.n;
}

syncControls();
fit();
render();
