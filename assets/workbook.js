/* ===========================================================================
   Module 01 - practice workbook (73 problems).
   Presenter logic carried over unchanged. Removed: the pgAdmin window chrome
   (title bar, icon rail, object-explorer tree) and the light/dark toggle, all
   of which belonged to the skin rather than the teaching. Its SQL token class
   names (.tok-kw, .tok-str ...) are now coloured by assets/theme.css and match
   every other module on the site.
   =========================================================================== */
(function(){
/* ---------- editor syntax highlighter ---------- */
const KW=new Set("CREATE DATABASE TABLE ALTER DROP ADD COLUMN CONSTRAINT PRIMARY KEY FOREIGN REFERENCES UNIQUE CHECK NOT NULL DEFAULT SET USING RENAME TO INSERT INTO VALUES SELECT FROM WHERE UPDATE DELETE TRUNCATE BEGIN COMMIT ROLLBACK GRANT REVOKE ON USER PASSWORD USAGE SCHEMA AND OR BETWEEN IN AS DO NOTHING CONFLICT EXCLUDED RETURNING WITH PUBLIC TYPE".split(/\s+/));
const TYPES=new Set("VARCHAR INT INTEGER TEXT SERIAL CHAR BOOLEAN DATE".split(/\s+/));
const FUNCS=new Set(["LOWER","UPPER","COUNT","current_database"]);
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function hlSQL(code){
  let o="",i=0,n=code.length;
  while(i<n){const c=code[i];
    if(c==="-"&&code[i+1]==="-"){let j=code.indexOf("\n",i);if(j<0)j=n;o+='<span class="tok-com">'+esc(code.slice(i,j))+'</span>';i=j;continue;}
    if(c==="\\"){let j=i+1;while(j<n&&/[a-zA-Z]/.test(code[j]))j++;o+='<span class="tok-meta">'+esc(code.slice(i,j))+'</span>';i=j;continue;}
    if(c==="'"){let j=i+1;while(j<n){if(code[j]==="'"&&code[j+1]==="'"){j+=2;continue;}if(code[j]==="'"){j++;break;}j++;}o+='<span class="tok-str">'+esc(code.slice(i,j))+'</span>';i=j;continue;}
    if(/[0-9]/.test(c)&&!/[a-zA-Z_]/.test(code[i-1]||"")){let j=i;while(j<n&&/[0-9.]/.test(code[j]))j++;o+='<span class="tok-num">'+code.slice(i,j)+'</span>';i=j;continue;}
    if(/[a-zA-Z_]/.test(c)){let j=i;while(j<n&&/[a-zA-Z0-9_]/.test(code[j]))j++;const w=code.slice(i,j);const U=w.toUpperCase();const paren=code.slice(j).match(/^\s*\(/);
      if(KW.has(U))o+='<span class="tok-kw">'+w+'</span>';
      else if(TYPES.has(U))o+='<span class="tok-type">'+w+'</span>';
      else if(paren||FUNCS.has(w))o+='<span class="tok-fn">'+esc(w)+'</span>';
      else o+=esc(w);i=j;continue;}
    if("(),;=<>!+-*/|:".includes(c)){o+='<span class="tok-punct">'+esc(c)+'</span>';i++;continue;}
    o+=esc(c);i++;}
  return o;
}
function arrowize(s){return esc(s).replace(/(←[^\n]*)/g,'<span class="arrow">$1</span>').replace(/(ERROR:[^\n]*)/g,'<span class="errline">$1</span>');}
function firstKw(code){const m=code.match(/^\s*([A-Za-z\\]+)/);return m?m[1].toUpperCase():"";}
function msecFor(num){let h=7;for(const c of num)h=(h*31+c.charCodeAt(0))>>>0;return 41+(h%150);}
/* parse psql-style output into grid + text segments */
function isSep(l){return /-/.test(l)&&/^[\s|+\-]+$/.test(l)&&(l.match(/-/g)||[]).length>=3;}
function splitCols(l){return l.split("|").map(c=>c.trim());}
function parseOutput(text){
  const lines=text.split("\n");const segs=[];let i=0;
  while(i<lines.length){
    const cur=lines[i],nxt=lines[i+1]||"";
    if(nxt&&isSep(nxt)&&cur.trim()!==""&&!isSep(cur)){
      const multi=cur.includes("|");
      const header=multi?splitCols(cur):[cur.trim()];
      i+=2;const rows=[];
      while(i<lines.length){
        const l=lines[i];
        if(l.trim()===""||isSep(l)||l.trim().startsWith("("))break;
        if(multi){if(!l.includes("|"))break;rows.push(splitCols(l));}
        else{if(l.includes("|"))break;rows.push([l.trim()]);}
        i++;
      }
      segs.push({type:"grid",header,rows});continue;
    }
    const buf=[];
    while(i<lines.length){
      const l=lines[i],n=lines[i+1]||"";
      if(n&&isSep(n)&&l.trim()!==""&&!isSep(l))break;
      buf.push(l);i++;
    }
    if(buf.join("").trim()!=="")segs.push({type:"text",lines:buf});
  }
  return segs;
}
function renderGrid(seg){
  const cols=seg.header;
  let h='<table class="grid"><thead><tr><th class="rownum"></th>';
  cols.forEach(c=>h+="<th>"+esc(c)+"</th>");
  h+="</tr></thead><tbody>";
  seg.rows.forEach((r,ri)=>{
    h+='<tr><td class="rownum">'+(ri+1)+"</td>";
    for(let k=0;k<cols.length;k++){
      let v=r[k]!==undefined?r[k]:"";let cls="",disp;
      if(v===""){disp="";}
      else if(/^NULL$/i.test(v)){cls="nullcell";disp="[null]";}
      else if(/^-?\d+$/.test(v)){cls="num";disp=esc(v);}
      else{disp=esc(v).replace(/(←.*)$/,'<span class="newtag">$1</span>');}
      h+='<td class="'+cls+'">'+(disp||"")+"</td>";
    }
    h+="</tr>";
  });
  return h+"</tbody></table>";
}
function renderSegs(segs){
  let html="";
  segs.forEach(s=>{
    if(s.type==="grid")html+='<div class="grid-wrap">'+renderGrid(s)+"</div>";
    else{const t=s.lines.join("\n").replace(/\s+$/,"");if(t.trim()!=="")html+='<div class="out-note">'+arrowize(t)+"</div>";}
  });
  return html;
}

/* ---------- elements ---------- */
const els={
  gutter:document.getElementById("gutter"),typed:document.getElementById("typed"),cursor:document.getElementById("cursor"),
  editHint:document.getElementById("editHint"),exec:document.getElementById("btnExecute"),codewrap:document.getElementById("codewrap"),
  scratch:document.getElementById("scratchBody"),counter:document.getElementById("counter"),
  paneData:document.getElementById("paneData"),paneMsg:document.getElementById("paneMessages"),paneNotify:document.getElementById("paneNotify"),
  stTotal:document.getElementById("stTotal"),stLnCol:document.getElementById("stLnCol"),stRuntime:document.getElementById("stRuntime"),stStep:document.getElementById("stStep"),
  welcome:document.getElementById("welcomeView"),query:document.getElementById("queryView"),
  tabWelcome:document.getElementById("tabWelcome"),tabQuery:document.getElementById("tabQuery"),
  psqlTerm:document.getElementById("psqlTerm"),editorCol:document.getElementById("editorCol"),
};

/* ---------- state ---------- */
let idx=0;      // 0 = welcome, 1..36 = problems
let step=0;     // 0 read, 1 typed, 2 executed
let typing=false, typeTimer=null, skipFn=null, hintsOpen=false;

/* ---------- contents overlay ---------- */
(function(){const grid=document.getElementById("ovGrid");const units={};
  DECK.forEach((p,i)=>{(units[p.unit]=units[p.unit]||[]).push({p,slide:i+1});});
  Object.entries(units).forEach(([u,items])=>{const box=document.createElement("div");box.className="ov-unit";
    box.innerHTML=`<h3>${u}</h3>`+items.map(it=>`<div class="ov-item" data-slide="${it.slide}"><span class="n">${it.p.num}</span><span class="t">${it.p.title}</span></div>`).join("");grid.appendChild(box);});
  grid.addEventListener("click",e=>{const it=e.target.closest(".ov-item");if(!it)return;gotoSlide(+it.dataset.slide);closeOverlay();});
})();
function updateOvCurrent(){document.querySelectorAll(".ov-item").forEach(it=>it.classList.toggle("current",+it.dataset.slide===idx));}

/* ---------- rendering ---------- */
function setGutter(text){
  const lines=Math.max(1,text.split("\n").length);
  let g="";for(let i=1;i<=lines;i++)g+=(i>1?"\n":"")+i;
  els.gutter.textContent=g;
}
function setLnCol(text){
  const lines=text.split("\n");const ln=lines.length;const col=lines[lines.length-1].length+1;
  els.stLnCol.textContent=`Ln ${ln}, Col ${col}`;
}
function renderScratch(){
  const p=DECK[idx-1];
  els.scratch.innerHTML=`
    <span class="sc-num">${p.num}</span>
    <div class="sc-unit">${p.unit}</div>
    <div class="sc-title">${p.title}</div>
    <div class="sc-sec"><span class="d"></span>Table schema <span class="sch-phase" id="schPhase">· before</span></div>
    <div id="schemaBox"></div>
    <div class="sc-sec"><span class="d"></span>Question</div>
    <div class="sc-quest">${p.question}</div>
    <div class="sc-sec"><span class="d"></span>Given — state before</div>
    <div class="sc-given">${arrowize(p.given)}</div>
    <div class="sc-sec"><span class="d"></span>Hints</div>
    <div class="sc-hints ${hintsOpen?"":"locked"}">
      <ol>${p.hints.map(h=>`<li>${esc(h)}</li>`).join("")}</ol>
      <div class="lock">Press <kbd>H</kbd> to reveal hints</div>
    </div>`;
  updateSchema(step>=2?"after":"before");
}

/* ---------- live schema rendering ---------- */
function colChanged(a,b){return a.t!==b.t||(a.b||[]).join(",")!==(b.b||[]).join(",");}
function colRow(c,cls){
  const isPK=(c.b||[]).includes("PK");
  const badges=(c.b||[]).map(b=>'<span class="b-'+b+'">'+b+"</span>").join("");
  return '<div class="sch-col '+(cls||"")+'"><span class="cn">'+(isPK?'<span class="key">🔑</span>':"")+esc(c.n)+'</span><span class="ct">'+esc(c.t)+'</span><span class="bd">'+badges+"</span></div>";
}
function tableCard(t,mode,before){
  const bCols={};if(before)before.cols.forEach(c=>bCols[c.n]=c);
  const aNames=new Set(t.cols.map(c=>c.n));
  let rows="";
  t.cols.forEach(c=>{
    let cls="";
    if(mode==="after"){ if(!before||!bCols[c.n])cls="add"; else if(colChanged(bCols[c.n],c))cls="mod"; }
    else if(mode==="droptable")cls="drop";
    rows+=colRow(c,cls);
  });
  if(mode==="after"&&before){before.cols.forEach(c=>{if(!aNames.has(c.n))rows+=colRow(c,"drop");});}
  const drop=mode==="droptable";
  return '<div class="sch-table '+(drop?"tdrop":"")+'"><div class="sch-th"><span class="ti2">▦</span>'+esc(t.name)+(drop?" — dropped":"")+"</div>"+rows+"</div>";
}
function renderSchema(sch,phase){
  if(!sch)return '<div class="sch-none">Server / database-level operation — no table schema to show.</div>';
  let html="";
  if(phase==="after"){
    const bByName={};(sch.before||[]).forEach(t=>bByName[t.name]=t);
    const aNames=new Set((sch.after||[]).map(t=>t.name));
    (sch.before||[]).forEach(t=>{if(!aNames.has(t.name))html+=tableCard(t,"droptable",null);});
    (sch.after||[]).forEach(t=>html+=tableCard(t,"after",bByName[t.name]));
    if(!html)html='<div class="sch-none">No tables — all dropped.</div>';
  }else{
    (sch.before||[]).forEach(t=>html+=tableCard(t,"before",null));
    if(!html)html='<div class="sch-none">No tables yet.</div>';
  }
  if(sch.note)html+='<div class="sch-note">'+sch.note+"</div>";
  return html;
}
function updateSchema(phase){
  if(idx===0)return;
  const sch=SCHEMA[DECK[idx-1].num];
  const box=document.getElementById("schemaBox"),ph=document.getElementById("schPhase");
  if(box)box.innerHTML=renderSchema(sch,phase);
  if(ph){ph.textContent=phase==="after"?"· after · changes highlighted":"· before";ph.classList.toggle("after",phase==="after");}
}
function renderChrome(){
  const isW=idx===0;
  els.welcome.style.display=isW?"flex":"none";
  els.query.style.display=isW?"none":"flex";
  els.tabWelcome.classList.toggle("active",isW);
  els.tabQuery.classList.toggle("active",!isW);
  els.counter.innerHTML=isW?"":`Problem <b>${DECK[idx-1].num}</b> · <b>${idx}</b> / ${DECK.length}`;
  els.stStep.textContent=isW?"":(["Read the problem","Query written","Executed ✓","Schema-check written","Schema verified ✓"][step]||"");
  document.getElementById("hintBtn").style.visibility=isW?"hidden":"visible";
  document.getElementById("resetBtn").style.visibility=isW?"hidden":"visible";
  updateOvCurrent();
}

/* clear editor + output for a fresh problem/step0 */
function clearEditor(){
  clearTimeout(typeTimer);typing=false;skipFn=null;
  els.typed.textContent="";els.cursor.classList.add("hidden");
  els.editHint.style.display="";
  setGutter("");setLnCol("");
  els.exec.classList.remove("ready");
  els.paneData.innerHTML='<div class="out-empty">No data output. Run the query (▶) to see results.</div>';
  els.paneMsg.innerHTML='<div class="out-empty">—</div>';
  els.stTotal.textContent="Total rows: ";els.stRuntime.textContent="";
  switchPane("data");
}

function gotoSlide(i){
  idx=Math.max(0,Math.min(DECK.length,i));step=0;hintsOpen=false;
  clearEditor();
  if(idx>0)renderScratch();
  applyWorkspace();
  if(idx>0&&isPsql(DECK[idx-1]))renderPsqlInitial();
  renderChrome();
}

/* ---------- steps ----------
   DDL problems get a 4th action: a \d schema-check.
   states: 0 read · 1 answer typed · 2 executed · 3 verify typed · 4 verified */
function hasVerify(p){return false;} /* schema-check step disabled */
function maxStep(p){return hasVerify(p)?4:2;}
function focusTable(p){
  const s=SCHEMA[p.num];
  if(s&&s.after&&s.after.length)return s.after[0].name;
  if(s&&s.before&&s.before.length)return s.before[0].name;
  return "students";
}
function verifySQL(p){
  const t=focusTable(p);
  return "SELECT column_name, data_type, character_maximum_length,\n       is_nullable, column_default\nFROM   information_schema.columns\nWHERE  table_name = '"+t+"'\nORDER  BY ordinal_position;";
}

function isPsql(p){return !!(typeof PSQL!=="undefined"&&PSQL[p.num]);}

/* switch the workspace between Query Tool and PSQL Tool */
function applyWorkspace(){
  const p=idx>0?DECK[idx-1]:null;
  const psql=!!(p&&isPsql(p));
  els.editorCol.classList.toggle("psql",psql);
  const sq=document.getElementById("subQuery");if(sq)sq.textContent=psql?"PSQL Tool":"Query";
  const rq=document.getElementById("railQuery"),rp=document.getElementById("railPsql");
  if(rq)rq.classList.toggle("active",!psql);if(rp)rp.classList.toggle("active",psql);
  const b=document.getElementById("bottom"),v=document.getElementById("vsplit"),tb=document.querySelector(".toolbar");
  if(b)b.style.display=psql?"none":"";if(v)v.style.display=psql?"none":"";
  if(tb)tb.style.display=psql?"none":"";
}

function goStep(n){
  if(idx===0)return;
  step=n;
  const p=DECK[idx-1];
  if(isPsql(p)){
    if(n===0){clearEditor();renderScratch();renderPsqlInitial();}
    else if(n===1)typePsql();
    else if(n===2)runPsql();
    renderChrome();return;
  }
  if(n===0){clearEditor();renderScratch();}
  else if(n===1)startTyping(DECK[idx-1].code);
  else if(n===2)execute();
  else if(n===3)startTyping(verifySQL(DECK[idx-1]));
  else if(n===4)runVerify();
  renderChrome();
}

/* ---------- PSQL Tool terminal flow ---------- */
function renderPsqlInitial(){
  const S=PSQL[DECK[idx-1].num];
  els.psqlTerm.innerHTML='<span class="pq-dim">'+esc(S.banner)+'</span>\n<span class="pq-prompt">'+esc(S.steps[0].prompt)+' </span><span class="pq-cursor"></span>';
}
function typePsql(){
  const S=PSQL[DECK[idx-1].num],term=els.psqlTerm;
  els.exec.classList.remove("ready");typing=true;
  let committed='<span class="pq-dim">'+esc(S.banner)+'</span>\n';
  let si=0;
  function full(){
    let h='<span class="pq-dim">'+esc(S.banner)+'</span>\n';
    S.steps.forEach(st=>h+='<span class="pq-prompt">'+esc(st.prompt)+' </span>'+hlSQL(st.cmd)+"\n");
    return h;
  }
  function finish(){typing=false;term.innerHTML=full().replace(/\n$/,"")+'<span class="pq-cursor"></span>';els.exec.classList.add("ready");renderChrome();}
  function typeCmd(){
    if(si>=S.steps.length){finish();return;}
    const st=S.steps[si],pr='<span class="pq-prompt">'+esc(st.prompt)+' </span>';let pos=0;
    function tick(){
      if(pos>=st.cmd.length){committed+=pr+hlSQL(st.cmd)+"\n";si++;typeCmd();return;}
      term.innerHTML=committed+pr+esc(st.cmd.slice(0,pos+1))+'<span class="pq-cursor"></span>';
      term.scrollTop=term.scrollHeight;pos++;
      let d=20+Math.random()*30;if(st.cmd[pos-1]===" ")d=8;
      typeTimer=setTimeout(tick,d);
    }
    tick();
  }
  typeCmd();
  skipFn=()=>{if(typing){clearTimeout(typeTimer);finish();}};
}
function runPsql(){
  const S=PSQL[DECK[idx-1].num],term=els.psqlTerm;
  els.exec.classList.remove("ready");els.stRuntime.textContent="running…";
  setTimeout(()=>{
    let h='<span class="pq-dim">'+esc(S.banner)+'</span>\n';
    S.steps.forEach(st=>{
      h+='<span class="pq-prompt">'+esc(st.prompt)+' </span>'+hlSQL(st.cmd)+"\n";
      if(st.out)h+='<span class="pq-out">'+esc(st.out)+'</span>\n';
    });
    h+='<span class="pq-prompt">'+esc(S.endPrompt||S.steps[0].prompt)+' </span><span class="pq-cursor"></span>';
    term.innerHTML=h;term.scrollTop=term.scrollHeight;
    els.stRuntime.textContent="✓ done";els.stTotal.textContent="Total rows: ";
    updateSchema("after");renderChrome();
  },650);
}
function startTyping(full){
  full=full||DECK[idx-1].code;
  els.editHint.style.display="none";
  els.cursor.classList.remove("hidden");
  els.exec.classList.remove("ready");
  typing=true;let pos=0;els.typed.textContent="";
  function finish(){typing=false;els.typed.innerHTML=hlSQL(full);setGutter(full);setLnCol(full);els.exec.classList.add("ready");renderChrome();}
  function tick(){
    if(pos>=full.length){finish();return;}
    const ch=full[pos];const cur=full.slice(0,pos+1);els.typed.textContent=cur;setGutter(cur);setLnCol(cur);
    els.codewrap.parentElement.scrollTop=els.codewrap.parentElement.scrollHeight;pos++;
    let d=15+Math.random()*32;if(ch==="\n")d=90;else if(ch===" ")d=7;else if(",;()".includes(ch))d=50;
    typeTimer=setTimeout(tick,d);
  }
  tick();
  skipFn=()=>{if(typing){clearTimeout(typeTimer);pos=full.length;finish();}};
}

/* ---------- schema-check (information_schema query) result ---------- */
function _cell(v,isNum){
  if(v===null||v===undefined||v==="")return '<td class="nullcell">[null]</td>';
  return "<td"+(isNum?' class="num"':"")+">"+esc(String(v))+"</td>";
}
function infoSchemaGrid(name,tbl){
  let h='<div class="grid-wrap"><table class="grid"><thead><tr><th class="rownum"></th><th>column_name</th><th>data_type</th><th>character_maximum_length</th><th>is_nullable</th><th>column_default</th></tr></thead><tbody>';
  tbl.cols.forEach((c,i)=>{
    const b=c.b||[];
    const m=c.t.match(/^varchar\((\d+)\)$/i);
    const dtype=m||/^varchar$/i.test(c.t)?"character varying":c.t;
    const len=m?m[1]:null;
    const nn=(b.includes("NN")||b.includes("PK"))?"NO":"YES";
    let def=null;
    if(b.includes("SER"))def="nextval('"+name+"_"+c.n+"_seq'::regclass)";
    else if(b.includes("DEF")&&c.n==="branch")def="'CSE'::character varying";
    h+='<tr><td class="rownum">'+(i+1)+"</td><td>"+esc(c.n)+"</td><td>"+esc(dtype)+"</td>"+_cell(len,true)+"<td>"+nn+"</td>"+_cell(def,false)+"</tr>";
  });
  return h+"</tbody></table></div>";
}
function runVerify(){
  const p=DECK[idx-1],t=focusTable(p),s=SCHEMA[p.num];
  const dropped=!s||!s.after||!s.after.length;
  els.cursor.classList.add("hidden");els.exec.classList.remove("ready");
  els.paneData.innerHTML='<div class="out-empty"><span class="spinner"></span> Executing query on <b style="color:var(--accent)">&nbsp;postgres</b> …</div>';
  els.stRuntime.textContent="running…";switchPane("data");
  const ms=msecFor(p.num);
  setTimeout(()=>{
    if(dropped){
      // information_schema returns 0 rows for a table that no longer exists
      els.paneData.innerHTML='<div class="fade">'+infoSchemaGrid(t,{cols:[]})+'<div class="out-note">(0 rows) — no columns found; table "'+esc(t)+'" no longer exists.</div></div>';
      els.paneMsg.innerHTML='<div class="msg-ok fade"><span class="cmd">SELECT 0</span>\n\nQuery returned successfully: 0 rows in '+ms+' msec.\n<span style="color:var(--muted)">Empty result confirms the table was dropped.</span></div>';
      switchPane("data");els.stTotal.textContent="Total rows: 0";
    }else{
      const tbl=s.after.find(x=>x.name===t)||s.after[0];
      els.paneData.innerHTML='<div class="fade">'+infoSchemaGrid(t,tbl)+'</div>';
      els.paneMsg.innerHTML='<div class="msg-ok fade"><span class="cmd">SELECT '+tbl.cols.length+'</span>\n\nQuery returned successfully: '+tbl.cols.length+' rows in '+ms+' msec.</div>';
      switchPane("data");els.stTotal.textContent="Total rows: "+tbl.cols.length;
    }
    els.stRuntime.textContent="✓ schema verified";
    renderChrome();
  },700);
}
function execute(){
  const p=DECK[idx-1];
  els.cursor.classList.add("hidden");els.exec.classList.remove("ready");
  const kw=firstKw(p.code);
  // The answer query itself always succeeds. Any "ERROR:" in the output is a
  // deliberate teaching demonstration of a SEPARATE statement being rejected
  // (1.1 proves the CHECK works; 3.2 proves the table is now gone).
  const demoErr=/ERROR:/.test(p.output);
  const ms=msecFor(p.num);
  let cmdTag={CREATE:"CREATE TABLE",ALTER:"ALTER TABLE",DROP:"DROP TABLE",TRUNCATE:"TRUNCATE TABLE",INSERT:"INSERT 0 1",UPDATE:"UPDATE 1",DELETE:"DELETE 1",BEGIN:"BEGIN",COMMIT:"COMMIT",GRANT:"GRANT",REVOKE:"REVOKE",SELECT:"SELECT"}[kw]||"OK";
  if(kw==="CREATE"&&/CREATE\s+DATABASE/i.test(p.code))cmdTag="CREATE DATABASE";
  if(kw==="CREATE"&&/CREATE\s+USER/i.test(p.code))cmdTag="CREATE ROLE";
  const segs=parseOutput(p.output);
  const hasGrid=segs.some(s=>s.type==="grid");
  const gridRows=segs.filter(s=>s.type==="grid").reduce((a,s)=>a+s.rows.length,0);
  // spinner
  els.paneData.innerHTML='<div class="out-empty"><span class="spinner"></span> Executing query on <b style="color:var(--accent)">&nbsp;postgres</b> …</div>';
  els.stRuntime.textContent="running…";
  switchPane("data");
  setTimeout(()=>{
    // Data Output — grid(s) + notes (a demo rejection shows here, in context)
    els.paneData.innerHTML='<div class="fade">'+(renderSegs(segs)||'<div class="out-empty">Query returned successfully. No rows returned.</div>')+'</div>';
    // Messages — the answer query succeeded
    let msg='<div class="msg-ok fade"><span class="cmd">'+cmdTag+'</span>\n\nQuery returned successfully in '+ms+' msec.';
    if(demoErr){
      const errLine=(p.output.match(/ERROR:[^\n]*/)||["ERROR"])[0];
      const sqlstate=/check constraint/i.test(errLine)?"23514":/does not exist/i.test(errLine)?"42P01":"—";
      msg+='\n\n<span style="color:var(--muted)">— follow-up demonstration —</span>\n<span style="color:var(--err)">'+esc(errLine)+'</span>\n<span style="color:var(--muted)">SQL state: '+sqlstate+' · this rejection is the expected, correct behaviour.</span>';
    }
    els.paneMsg.innerHTML=msg+'</div>';
    // default tab: results -> Data Output, otherwise Messages
    switchPane(hasGrid?"data":"messages");
    updateSchema("after");
    // status bar
    els.stTotal.textContent="Total rows: "+(hasGrid?gridRows:(kw==="INSERT"||kw==="UPDATE"||kw==="DELETE"?"1":""));
    els.stRuntime.textContent="✓ "+ms+" msec";
    renderChrome();
  },700);
}

/* ---------- output tab switching ---------- */
function switchPane(name){
  document.querySelectorAll(".outtab").forEach(t=>t.classList.toggle("active",t.dataset.pane===name));
  els.paneData.classList.toggle("active",name==="data");
  els.paneMsg.classList.toggle("active",name==="messages");
  els.paneNotify.classList.toggle("active",name==="notify");
}
document.querySelectorAll(".outtab").forEach(t=>t.addEventListener("click",()=>switchPane(t.dataset.pane)));

/* ---------- navigation ---------- */
function advance(){
  if(idx===0){gotoSlide(1);return;}
  if(typing&&skipFn){skipFn();return;}
  if(step<maxStep(DECK[idx-1])){goStep(step+1);return;}
  if(idx<DECK.length)gotoSlide(idx+1);
}
function back(){
  if(idx>0&&step>0){goStep(step-1);return;}
  if(idx>0)gotoSlide(idx-1);
}
function toggleHints(){if(idx===0)return;hintsOpen=!hintsOpen;const h=els.scratch.querySelector(".sc-hints");if(h)h.classList.toggle("locked",!hintsOpen);}
function openOverlay(){document.getElementById("overlay").classList.add("open");}
function closeOverlay(){document.getElementById("overlay").classList.remove("open");}

/* ---------- events ---------- */
els.codewrap.addEventListener("click",()=>{if(idx>0&&step===0)goStep(1);});
els.psqlTerm.addEventListener("click",()=>{if(idx>0&&isPsql(DECK[idx-1])&&step===0)goStep(1);});
els.exec.addEventListener("click",()=>{if(idx>0){if(typing&&skipFn){skipFn();return;}if(step===1)goStep(2);else if(step===0)goStep(1);else if(step===3)goStep(4);}});
/* cross-browser fullscreen (Chrome/Edge/Firefox/Safari desktop, Android).
   iOS Safari on iPhone has no Fullscreen API — it degrades gracefully. */
function enterFullscreen(){
  const el=document.documentElement;
  const fn=el.requestFullscreen||el.webkitRequestFullscreen||el.mozRequestFullScreen||el.msRequestFullscreen;
  if(fn){try{const p=fn.call(el);if(p&&p.catch)p.catch(()=>{});}catch(e){}}
}
document.getElementById("startBtn").addEventListener("click",()=>{enterFullscreen();gotoSlide(1);});
els.tabWelcome.addEventListener("click",e=>{if(!e.target.classList.contains("x"))gotoSlide(0);});
els.tabQuery.addEventListener("click",e=>{if(!e.target.classList.contains("x"))gotoSlide(idx===0?1:idx);});
document.getElementById("contentsBtn").addEventListener("click",openOverlay);
document.getElementById("hintBtn").addEventListener("click",toggleHints);
document.getElementById("resetBtn").addEventListener("click",()=>goStep(0));
document.getElementById("ovClose").addEventListener("click",closeOverlay);
document.getElementById("overlay").addEventListener("click",e=>{if(e.target.id==="overlay")closeOverlay();});
document.addEventListener("keydown",e=>{
  if(document.getElementById("overlay").classList.contains("open")){if(e.key==="Escape")closeOverlay();return;}
  switch(e.key){
    case" ":case"ArrowRight":case"Enter":case"PageDown":e.preventDefault();advance();break;
    case"F5":e.preventDefault();if(idx>0&&!typing){if(step===1)goStep(2);else if(step===3)goStep(4);}break;
    case"ArrowLeft":case"PageUp":e.preventDefault();back();break;
    case"h":case"H":toggleHints();break;
    case"r":case"R":goStep(0);break;
    case"o":case"O":openOverlay();break;
    case"Home":gotoSlide(0);break;
    case"End":gotoSlide(DECK.length);break;
    case"Escape":closeOverlay();break;
  }
});

/* ---------- draggable output divider (up/down resize) ---------- */
(function(){
  const split=document.getElementById("vsplit"),bottom=document.getElementById("bottom"),work=document.querySelector(".work");
  let dragging=false;
  split.addEventListener("mousedown",e=>{dragging=true;split.classList.add("drag");document.body.style.userSelect="none";e.preventDefault();});
  window.addEventListener("mousemove",e=>{
    if(!dragging)return;
    const wr=work.getBoundingClientRect();
    let h=wr.bottom-e.clientY;
    h=Math.max(80,Math.min(wr.height-170,h));
    bottom.style.height=h+"px";
  });
  window.addEventListener("mouseup",()=>{if(dragging){dragging=false;split.classList.remove("drag");document.body.style.userSelect="";}});
  window.addEventListener("resize",()=>{
    if(!bottom.style.height)return;
    const wr=work.getBoundingClientRect();
    bottom.style.height=Math.max(80,Math.min(wr.height-170,parseInt(bottom.style.height)))+"px";
  });
})();

/* theme toggle removed: the merged site is single-theme by design */

/* object explorer tree removed: pgAdmin furniture, not part of the lesson */

/* reflect the real problem count everywhere */
["wcCount1","wcCount2","ovCount"].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=DECK.length;});
renderChrome();
})();
