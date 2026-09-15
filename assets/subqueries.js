/* Module 03 - subquery walkthrough. Deck and logic carried over unchanged. */
(function(){
/* ===================== DATA ===================== */
const STUDENTS=[[1,'Aarav','Mumbai','B1'],[2,'Diya','Delhi','B1'],[3,'Kabir','Mumbai','B2'],[4,'Meera','Pune','B2'],[5,'Rohan','Delhi','B1'],[6,'Sara','Pune','B2']];
const MARKS=[[101,1,'Math',92],[102,1,'Science',58],[103,2,'Math',74],[104,2,'Science',66],[105,3,'Math',88],[106,3,'Science',84],[107,4,'Math',55],[108,4,'Science',61],[109,5,'Math',95],[110,5,'Science',71],[111,6,'Math',45],[112,6,'Science',49]];
const FEES=[[501,1,25000,'UPI'],[502,2,25000,'CARD'],[503,3,25000,'NETBANK'],[504,5,25000,'UPI']];
const NAME=Object.fromEntries(STUDENTS.map(s=>[s[0],s[1]]));
const MOF={1:[101,102],2:[103,104],3:[105,106],4:[107,108],5:[109,110],6:[111,112]};
const PAYOF={1:501,2:502,3:503,5:504};
const SCI=MARKS.filter(m=>m[2]==='Science').map(m=>m[0]);
const rowOf=id=>MARKS.find(m=>m[0]===id);

/* ===================== HELPERS ===================== */
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const KW=/\b(SELECT|FROM|WHERE|AND|OR|NOT|IN|EXISTS|ALL|ANY|AS|ON|JOIN|GROUP|ORDER|BY|DISTINCT|AVG|MAX|MIN|LIMIT|IS|NULL|INSERT|INTO|VALUES|CREATE|TABLE|DROP|IF|CASCADE|PRIMARY|KEY|REFERENCES|INT|TEXT|TRUE|FALSE)\b/i;
function sqlHL(src){
  const re=/(--[^\n]*)|('(?:[^']|'')*')|(\b\d+\.?\d*\b)|([A-Za-z_]+)/g;
  let out='',last=0,m;
  while((m=re.exec(src))!==null){
    out+=esc(src.slice(last,m.index)); const t=m[0];
    if(m[1])out+='<span class="c">'+esc(t)+'</span>';
    else if(m[2])out+='<span class="s">'+esc(t)+'</span>';
    else if(m[3])out+='<span class="nu">'+esc(t)+'</span>';
    else out+=KW.test(t)?'<span class="k">'+esc(t)+'</span>':esc(t);
    last=re.lastIndex;
  }
  out+=esc(src.slice(last));
  return out.replace(/\[\[/g,'<span class="corr">').replace(/\]\]/g,'</span>');
}
const el=(t,c,h)=>{const n=document.createElement(t); if(c)n.className=c; if(h!=null)n.innerHTML=h; return n;};
const KEEP='<span class="badge b-keep">kept</span>', DROP='<span class="badge b-drop">dropped</span>';
const T='<span class="badge b-true">true</span>', F='<span class="badge b-false">false</span>';

/* ===================== LEFT PANEL ===================== */
function buildTable(key,name,note,cols,rows,ki,nums,widths){
  const w=el('div','tbl-wrap'); w.dataset.t=key;
  w.appendChild(el('div','tbl-name','<span>'+name+'</span><em>'+note+'</em>'));
  const t=el('table','tbl');
  t.innerHTML='<colgroup>'+widths.map(x=>'<col style="width:'+x+'">').join('')+'</colgroup><thead><tr>'
    +cols.map((c,i)=>'<th'+(nums.includes(i)?' class="n"':'')+'>'+c+'</th>').join('')+'</tr></thead>';
  const tb=el('tbody');
  rows.forEach(r=>{const tr=el('tr'); tr.dataset.k=r[ki];
    tr.innerHTML=r.map((v,i)=>'<td'+(nums.includes(i)?' class="n"':'')+'>'+esc(v)+'</td>').join(''); tb.appendChild(tr);});
  t.appendChild(tb); w.appendChild(t); return w;
}
const dataEl=document.getElementById('data');
dataEl.appendChild(buildTable('students','students','6 rows',['student_id','name','city','batch'],STUDENTS,0,[0],['34%','20%','23%','23%']));
dataEl.appendChild(buildTable('marks','marks','12 rows',['mark','student_id','subject','score'],MARKS,0,[0,1,3],['19%','34%','26%','21%']));
dataEl.appendChild(buildTable('fees','fee_payments','4 rows',['pay','student_id','amount','method'],FEES,0,[0,1,2],['16%','34%','25%','25%']));

function applyHL(h){
  document.querySelectorAll('.tbl-wrap').forEach(w=>{w.classList.remove('dim'); w.querySelectorAll('tbody tr').forEach(r=>r.className='');});
  document.getElementById('hlnote').textContent=h&&h.note?h.note:'';
  if(!h)return;
  const keys=['students','marks','fees'];
  const any=keys.some(k=>(h[k]&&h[k].length)||(h.scope&&h.scope[k]&&h.scope[k].length)||(h.act&&h.act[k]!=null));
  if(!any)return;
  document.querySelectorAll('.tbl-wrap').forEach(w=>w.classList.add('dim'));
  const cls=h.co?'hlc':'hl';
  keys.forEach(k=>{
    const w=document.querySelector('.tbl-wrap[data-t="'+k+'"]');
    if(h.scope&&h.scope[k])h.scope[k].forEach(id=>{const r=w.querySelector('tr[data-k="'+id+'"]'); if(r)r.className='scope';});
    if(h[k])h[k].forEach(id=>{const r=w.querySelector('tr[data-k="'+id+'"]'); if(r)r.className=cls;});
    if(h.act&&h.act[k]!=null){const r=w.querySelector('tr[data-k="'+h.act[k]+'"]'); if(r)r.className='act';}
  });
}

/* ===================== OUTPUT TABLE ===================== */
function outTable(spec){
  const b=el('div','out');
  b.appendChild(el('div','out-h','<span>'+(spec.caption||'Output')+'</span><span>'+spec.rows.length+' row'+(spec.rows.length===1?'':'s')+'</span>'));
  const t=el('table'); const n=spec.num||[];
  t.innerHTML='<thead><tr>'+spec.cols.map((c,i)=>'<th'+(n.includes(i)?' class="n"':'')+'>'+c+'</th>').join('')+'</tr></thead><tbody>'
    +spec.rows.map(r=>'<tr>'+r.map((v,i)=>'<td'+(n.includes(i)?' class="n"':'')+'>'+v+'</td>').join('')+'</tr>').join('')+'</tbody>';
  b.appendChild(t); return b;
}

/* ===================== STEP PLAYER ===================== */
var curPlayer=null;
let timer=null;
const stopTimer=()=>{if(timer){clearInterval(timer); timer=null;}};
function makePlayer(cfg, page, onStep){
  const box=el('div','player');
  const bar=el('div','pl-bar');
  bar.appendChild(el('span','pl-ttl','Trace · '+cfg.unit));
  const cnt=el('span','pl-cnt',''), bPrev=el('button','pl-btn','◀'), bNext=el('button','pl-btn','▶'),
        bRun=el('button','pl-btn','Run'), bReset=el('button','pl-btn','Reset');
  [bPrev,bNext,bRun,bReset].forEach(b=>b.type='button');
  bar.append(cnt,bPrev,bNext,bRun,bReset);
  const body=el('div','pl-body'); box.append(bar,body);
  let i=-1;
  const halt=()=>{stopTimer(); bRun.textContent='Run';};

  function strip(){
    const s=el('div','strip');
    cfg.rows.forEach((r,n)=>{
      const cls = n>i ? '' : (r.keep?'keep':'drop');
      s.appendChild(el('div','tile '+cls+(n===i?' now':''), r.tile));
    });
    return s;
  }
  function draw(){
    body.textContent='';
    cnt.textContent=(i<0?0:(i+1)*cfg.per)+' exec';
    if(i<0){
      body.appendChild(el('p','pl-idle',cfg.idle));
      applyHL(page.hl);
    }else{
      const r=cfg.rows[i];
      body.appendChild(el('div','pl-now',(i+1)+' / '+cfg.rows.length+' · '+r.now));
      r.execs.forEach(e=>body.appendChild(el('div','pl-exec',sqlHL(e))));
      const dl=el('dl','pl-grid');
      r.pairs.forEach(([k,v])=>{dl.appendChild(el('dt',null,k)); dl.appendChild(el('dd',null,v));});
      body.appendChild(dl);
      applyHL(r.hl);
    }
    body.appendChild(strip());
    bPrev.disabled=i<0; bNext.disabled=i>=cfg.rows.length-1;
  }
  const step=n=>{halt(); i=Math.max(-1,Math.min(cfg.rows.length-1,n)); draw(); if(onStep)onStep(i);};
  bPrev.addEventListener('click',()=>step(i-1));
  bNext.addEventListener('click',()=>step(i+1));
  bReset.addEventListener('click',()=>step(-1));
  bRun.addEventListener('click',()=>{
    if(timer){halt(); return;}
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){step(cfg.rows.length-1); return;}
    if(i>=cfg.rows.length-1){i=-1; draw(); if(onStep)onStep(i);}
    bRun.textContent='Pause';
    timer=setInterval(()=>{i++; draw(); if(onStep)onStep(i); if(i>=cfg.rows.length-1)halt();},900);
  });
  box.setIndex=n=>{halt(); i=Math.max(-1,Math.min(cfg.rows.length-1,n)); draw();};
  draw();
  return box;
}

/* ===================== RENDER ===================== */
function block(b,page){
  if(b.t==='p')return el('p',null,b.h);
  if(b.t==='lbl')return el('div','lbl',b.h);
  if(b.t==='note')return el('div','note '+(b.k||''),b.h);
  if(b.t==='sql')return el('pre','sql'+(b.plain?' plain':''),sqlHL(b.h));
  if(b.t==='out')return outTable(b);
  if(b.t==='player'){curPlayer=makePlayer(b.cfg,page,onPlayerStep); return curPlayer;}
  if(b.t==='split'){const g=el('div','split');
    b.cells.forEach(c=>{const x=el('div','cell'); x.appendChild(el('h4',null,c.h)); x.appendChild(el('p',null,c.b)); g.appendChild(x);}); return g;}
}
function render(p){
  curPlayer=null;
  const host=document.getElementById('paneIn'); host.textContent='';
  document.getElementById('pane').dataset.k=p.kind;
  const head=el('div','head');
  head.appendChild(el('div','kicker',p.kicker));
  head.appendChild(el('h2','qt',p.title));
  host.appendChild(head);
  const cols=el('div','cols');
  [p.a||[],p.b||[]].forEach(list=>{
    const c=el('div','col');
    list.forEach(x=>c.appendChild(block(x,p)));
    cols.appendChild(c);
  });
  host.appendChild(cols);
}

/* ===================== TRACES ===================== */
const TRACE_C1={unit:'one run per student', per:1,
  idle:'Six students in the outer query. ▶ runs EXISTS against one student at a time.',
  rows:STUDENTS.map(([sid,nm])=>{
    const ms=MOF[sid].map(rowOf); const hit=ms.find(m=>m[3]>85);
    return {tile:nm, keep:!!hit, now:'student '+sid+' · '+nm,
      execs:['SELECT 1 FROM marks WHERE student_id = '+sid+' AND score > 85 LIMIT 1;'],
      pairs:[['scans', ms.map(m=>m[0]+' ('+m[3]+')').join(', ')],
             ['exists?', hit?T+' stopped at mark '+hit[0]:F+' both scanned, no match'],
             ['verdict', hit?KEEP:DROP]],
      hl:{act:{students:sid}, scope:{marks:MOF[sid]}, ...(hit?{marks:[hit[0]],co:true}:{}), note:'EXISTS · student '+sid}};
  })};

const TRACE_C2={unit:'one run per mark row', per:1,
  idle:'Twelve mark rows in the outer query. Each one re-runs MIN(score) for its own student.',
  rows:MARKS.map(([id,sid,sub,sc])=>{
    const mn=Math.min(...MOF[sid].map(x=>rowOf(x)[3])); const keep=sc===mn;
    return {tile:String(id), keep, now:'mark '+id+' · '+NAME[sid]+' · '+sub+' '+sc,
      execs:['SELECT MIN(score) FROM marks WHERE student_id = '+sid+';'],
      pairs:[['returns','<strong>'+mn+'</strong> — lowest of '+MOF[sid].map(x=>rowOf(x)[3]).join(' and ')],
             ['test', sc+' = '+mn],
             ['verdict', keep?KEEP:DROP]],
      hl:{act:{marks:id}, scope:{marks:MOF[sid], students:[sid]}, note:'MIN WHERE student_id = '+sid}};
  })};

const TRACE_C3={unit:'two runs per student', per:2,
  idle:'Six students, two correlated subqueries each. The second test only matters when the first passes.',
  rows:STUDENTS.map(([sid,nm])=>{
    const paid=PAYOF[sid]!=null; const hi=MOF[sid].map(rowOf).find(m=>m[3]>80); const keep=paid&&!hi;
    return {tile:nm, keep, now:'student '+sid+' · '+nm,
      execs:['SELECT 1 FROM fee_payments WHERE student_id = '+sid+';',
             'SELECT 1 FROM marks WHERE student_id = '+sid+' AND score > 80;'],
      pairs:[['paid?', paid?T+' pay_id '+PAYOF[sid]:F+' no payment row'],
             ['none &gt; 80?', hi?F+' mark '+hi[0]+' is '+hi[3]:T+' best is '+Math.max(...MOF[sid].map(x=>rowOf(x)[3]))],
             ['verdict', keep?KEEP:DROP]],
      hl:{act:{students:sid}, scope:{marks:MOF[sid], fees:paid?[PAYOF[sid]]:[]}, note:'student '+sid+' · two tests'}};
  })};

/* ===================== PAGES ===================== */
const mk=ids=>ids.map(id=>{const m=rowOf(id); return [m[0],m[1],m[2],m[3]];});

const PAGES=[
{sec:'Setup', tag:'Schema', kind:'set', kicker:'Step 1 · schema', hl:null,
 title:'Create the three tables',
 a:[{t:'lbl',h:'Drop, then create'},
    {t:'sql',plain:true,h:"DROP TABLE IF EXISTS fee_payments, marks, students CASCADE;\n\nCREATE TABLE students (\n    student_id  INT PRIMARY KEY,\n    name        TEXT NOT NULL,\n    city        TEXT,\n    batch       TEXT\n);\n\nCREATE TABLE marks (\n    mark_id     INT PRIMARY KEY,\n    student_id  INT REFERENCES students(student_id),\n    subject     TEXT,\n    score       INT\n);"}],
 b:[{t:'lbl',h:'…continued'},
    {t:'sql',plain:true,h:"CREATE TABLE fee_payments (\n    pay_id      INT PRIMARY KEY,\n    student_id  INT REFERENCES students(student_id),\n    amount      INT,\n    method      TEXT\n);"},
    {t:'note',h:'<b>PostgreSQL takes a comma-separated list in one DROP</b>, and <code>CASCADE</code> clears the foreign keys pointing in — so the script re-runs cleanly.'},
    {t:'note',k:'warn',h:'<b>Written separately, drop order matters:</b> children first, parents last — <code>fee_payments</code>, then <code>marks</code>, then <code>students</code> — or the foreign keys refuse.'}]},

{sec:'Setup', tag:'Data', kind:'set', kicker:'Step 2 · data', hl:null,
 title:'Load six students, twelve marks, four payments',
 a:[{t:'lbl',h:'Insert'},
    {t:'sql',plain:true,h:"INSERT INTO students VALUES\n(1,'Aarav','Mumbai','B1'),(2,'Diya','Delhi','B1'),\n(3,'Kabir','Mumbai','B2'),(4,'Meera','Pune','B2'),\n(5,'Rohan','Delhi','B1'),(6,'Sara','Pune','B2');\n\nINSERT INTO fee_payments VALUES\n(501,1,25000,'UPI'),(502,2,25000,'CARD'),\n(503,3,25000,'NETBANK'),(504,5,25000,'UPI');"}],
 b:[{t:'lbl',h:'…and the marks'},
    {t:'sql',plain:true,h:"INSERT INTO marks VALUES\n(101,1,'Math',92),(102,1,'Science',58),\n(103,2,'Math',74),(104,2,'Science',66),\n(105,3,'Math',88),(106,3,'Science',84),\n(107,4,'Math',55),(108,4,'Science',61),\n(109,5,'Math',95),(110,5,'Science',71),\n(111,6,'Math',45),(112,6,'Science',49);"},
    {t:'split',cells:[
      {h:'Deliberate gap',b:'Meera and Sara have no payment row. That absence drives NC3, NC5 and C3.'},
      {h:'Own averages',b:'Aarav 75 · Diya 70 · Kabir 86 · Meera 58 · Rohan 83 · Sara 47. Class average 69.83.'}]}]},

/* ---------- NON-CORRELATED ---------- */
{sec:'Non-correlated', tag:'NC1', kind:'nc', kicker:'NC1 · scalar subquery',
 title:'Which mark row holds the highest score in the table?',
 hl:{marks:[109], note:'score = MAX'},
 a:[{t:'lbl',h:'Answer'},
    {t:'sql',h:"SELECT mark_id, student_id, subject, score\nFROM marks\nWHERE score = (SELECT MAX(score) FROM marks);"},
    {t:'p',h:'The inner query returns <strong>one row, one column</strong> — a scalar. Anywhere SQL expects a value, a scalar subquery may stand.'}],
 b:[{t:'lbl',h:'Output'},
    {t:'out',cols:['mark_id','student_id','subject','score'],num:[0,1,3],rows:mk([109])},
    {t:'note',k:'warn',h:'<b><code>=</code> is legal only because MAX() guarantees one row.</b> Swap it for <code>score FROM marks WHERE score &gt; 80</code> and PostgreSQL stops you: <em>more than one row returned by a subquery used as an expression</em>.'}]},

{sec:'Non-correlated', tag:'NC2', kind:'nc', kicker:'NC2 · list subquery, IN',
 title:'Name the students who scored below 60 in at least one subject.',
 hl:{students:[1,4,6], scope:{marks:[102,107,111,112]}, note:'score < 60 → names'},
 a:[{t:'lbl',h:'Answer'},
    {t:'sql',h:"SELECT name\nFROM students\nWHERE student_id IN (\n        SELECT student_id FROM marks WHERE score < 60\n      )\nORDER BY student_id;"},
    {t:'p',h:'Run the inner query alone and it returns <code>1, 4, 6, 6</code> — four rows for four low scores.'}],
 b:[{t:'lbl',h:'Output'},
    {t:'out',cols:['name'],rows:[['Aarav'],['Meera'],['Sara']]},
    {t:'note',k:'nc',h:'<b>Four mark rows qualify, three students come back.</b> Sara contributes twice (45 and 49) and <code>IN</code> de-duplicates. A JOIN would have printed her name twice — the concrete reason to use a subquery here.'}]},

{sec:'Non-correlated', tag:'NC3', kind:'nc', kicker:'NC3 · NOT IN',
 title:'Name the students who never scored above 70.',
 hl:{students:[4,6], scope:{marks:[101,103,105,106,109,110]}, note:'NOT IN (scored > 70)'},
 a:[{t:'lbl',h:'Answer'},
    {t:'sql',h:"SELECT name\nFROM students\nWHERE student_id NOT IN (\n        SELECT student_id FROM marks WHERE score > 70\n      )\nORDER BY student_id;"},
    {t:'out',cols:['name'],rows:[['Meera'],['Sara']]}],
 b:[{t:'lbl',h:'The wrong version'},
    {t:'sql',h:"SELECT name FROM students\nWHERE student_id NOT IN (\n        SELECT student_id FROM marks\n        WHERE score <= 70      -- <= instead of >\n      );"},
    {t:'out',caption:'Wrong output',cols:['name'],rows:[['Kabir'],['Rohan']]},
    {t:'note',k:'warn',h:'<b>It runs, returns rows, and answers the opposite question</b> — “who never scored 70 or below”. Build the inner query as <em>who did break 70</em>, then negate the membership.'}]},

{sec:'Non-correlated', tag:'NC4', kind:'nc', kicker:'NC4 · scalar with its own filter',
 title:'Which marks beat the average Science score?',
 hl:{marks:[101,103,104,105,106,109,110], scope:{marks:SCI}, note:'> 64.83'},
 a:[{t:'lbl',h:'Answer'},
    {t:'sql',h:"SELECT mark_id, student_id, subject, score\nFROM marks\nWHERE score > (\n        SELECT AVG(score) FROM marks\n        WHERE subject = 'Science'\n      )\nORDER BY mark_id;"},
    {t:'p',h:'Inner query returns <strong>64.83</strong> (389 ÷ 6). It filters to Science; <strong>the outer query does not</strong> — so Math rows are measured against the Science bar.'}],
 b:[{t:'lbl',h:'Output'},
    {t:'out',cols:['mark_id','student_id','subject','score'],num:[0,1,3],rows:mk([101,103,104,105,106,109,110])},
    {t:'note',k:'nc',h:'<b>Seven rows, three of them Science.</b> Marks 104, 106 and 110 clear their own subject’s average.'}]},

{sec:'Non-correlated', tag:'NC5', kind:'nc', kicker:'NC5 · two independent subqueries',
 title:'Name the students who have paid and also scored above 80.',
 hl:{students:[1,3,5], scope:{fees:[501,502,503,504], marks:[101,105,106,109]}, note:'paid ∩ scored > 80'},
 a:[{t:'lbl',h:'Answer'},
    {t:'sql',h:"SELECT name\nFROM students\nWHERE student_id IN (\n        SELECT student_id FROM fee_payments)\n  AND student_id IN (\n        SELECT student_id FROM marks WHERE score > 80)\nORDER BY student_id;"},
    {t:'p',h:'Two subqueries, two different tables, <strong>neither aware of the other</strong>. Both run once, before the outer scan begins.'}],
 b:[{t:'lbl',h:'Output'},
    {t:'out',cols:['name'],rows:[['Aarav'],['Kabir'],['Rohan']]},
    {t:'note',k:'nc',h:'<b>Paid = {1,2,3,5}. Above 80 = {1,3,5}.</b> Meera and Sara fail the first test; Diya fails the second. Only the intersection survives.'}]},

{sec:'Non-correlated', tag:'NC6', kind:'nc', kicker:'NC6 · quantified comparison, > ALL',
 title:'Which marks are higher than every Science score?',
 hl:{marks:[101,105,109], scope:{marks:SCI}, note:'> ALL Science'},
 a:[{t:'lbl',h:'Answer'},
    {t:'sql',h:"SELECT mark_id, student_id, subject, score\nFROM marks\nWHERE score > ALL (\n        SELECT score FROM marks\n        WHERE subject = 'Science'\n      )\nORDER BY mark_id;"},
    {t:'p',h:'<code>&gt; ALL</code> means “greater than the maximum”. Its mirror, <code>&gt; ANY</code>, means “greater than the minimum”.'}],
 b:[{t:'lbl',h:'Output'},
    {t:'out',cols:['mark_id','student_id','subject','score'],num:[0,1,3],rows:mk([101,105,109])},
    {t:'note',k:'co',h:'<b>Kabir’s 84 is the Science ceiling and fails its own test</b> — <code>84 &gt; 84</code> is false, so mark 106 is absent.'},
    {t:'note',k:'warn',h:'<b>Same NULL trap as NOT IN.</b> One NULL Science score and <code>&gt; ALL</code> returns nothing — the comparison is UNKNOWN, never TRUE.'}]},

/* ---------- CORRELATED ---------- */
{sec:'Correlated', tag:'C1', kind:'co', kicker:'C1 · EXISTS',
 title:'Name the students who scored above 85 in at least one subject.',
 hl:{students:[1,3,5], co:true, note:'EXISTS score > 85'},
 a:[{t:'lbl',h:'Answer'},
    {t:'sql',h:"SELECT s.name\nFROM students s\nWHERE EXISTS (\n        SELECT 1\n        FROM marks m\n        [[WHERE m.student_id = s.student_id]]\n          AND m.score > 85\n      )\nORDER BY s.student_id;"},
    {t:'p',h:'<code>s.student_id</code> belongs to the outer query, so the inner query <strong>cannot run on its own</strong> — that is the test for correlation.'},
    {t:'note',k:'co',h:'<b>EXISTS never reads the selected value</b>, which is why <code>SELECT 1</code> is the idiom. It short-circuits on the first match.'}],
 b:[{t:'lbl',h:'Output'},
    {t:'out',cols:['name'],rows:[['Aarav'],['Kabir'],['Rohan']]},
    {t:'lbl',h:'Step visualisation'},
    {t:'player',cfg:TRACE_C1}]},

{sec:'Correlated', tag:'C2', kind:'co', kicker:'C2 · correlated aggregate',
 title:'Show each student’s weaker paper.',
 hl:{marks:[102,104,106,107,110,111], co:true, note:'score = own MIN'},
 a:[{t:'lbl',h:'Answer'},
    {t:'sql',h:"SELECT m.student_id, m.subject, m.score\nFROM marks m\nWHERE m.score = (\n        SELECT MIN(score)\n        FROM marks\n        [[WHERE student_id = m.student_id]]\n      )\nORDER BY m.student_id;"},
    {t:'p',h:'The threshold is <strong>different for every row</strong> — 58 for Aarav, 66 for Diya, 84 for Kabir. No global number can produce this.'},
    {t:'note',k:'warn',h:'<b>Drop the alias and it breaks silently.</b> Bare <code>student_id = student_id</code> resolves inside the inner table, is always true, and returns the global minimum 45 for every row.'}],
 b:[{t:'lbl',h:'Output'},
    {t:'out',cols:['student_id','subject','score'],num:[0,2],rows:[[1,'Science',58],[2,'Science',66],[3,'Science',84],[4,'Math',55],[5,'Science',71],[6,'Math',45]]},
    {t:'lbl',h:'Step visualisation'},
    {t:'player',cfg:TRACE_C2}]},

{sec:'Correlated', tag:'C3', kind:'co', kicker:'C3 · EXISTS + NOT EXISTS',
 title:'Name the students who have paid but have no score above 80.',
 hl:{students:[2], co:true, note:'paid, nothing above 80'},
 a:[{t:'lbl',h:'Answer'},
    {t:'sql',h:"SELECT s.name\nFROM students s\nWHERE EXISTS (\n        SELECT 1 FROM fee_payments f\n        [[WHERE f.student_id = s.student_id]]\n      )\n  AND NOT EXISTS (\n        SELECT 1 FROM marks m\n        [[WHERE m.student_id = s.student_id]]\n          AND m.score > 80\n      )\nORDER BY s.student_id;"},
    {t:'note',k:'co',h:'<b>Twelve inner executions</b> — six students times two tests. Aarav, Kabir and Rohan paid but each broke 80; Meera and Sara never paid.'}],
 b:[{t:'lbl',h:'Output'},
    {t:'out',cols:['name'],rows:[['Diya']]},
    {t:'lbl',h:'Step visualisation'},
    {t:'player',cfg:TRACE_C3},
    {t:'note',k:'warn',h:'<b>Why NOT EXISTS, not NOT IN:</b> one NULL <code>student_id</code> in <code>fee_payments</code> makes <code>NOT IN</code> return zero rows with no error.'}]}
];

/* ===================== NAV =====================
   One flat sequence across the WHOLE site: every page, plus every trace step
   inside the correlated pages. Left/right arrows walk all of it end to end. */
let curPage=-1, cur=0;   /* curPlayer is declared above, next to the player */

const PLAYER_CFG = PAGES.map(p=>{
  const b=(p.a||[]).concat(p.b||[]).find(x=>x.t==='player');
  return b?b.cfg:null;
});
const FLAT=[];
PAGES.forEach((p,pi)=>{
  FLAT.push({pi,ti:-1});
  const cfg=PLAYER_CFG[pi];
  if(cfg)cfg.rows.forEach((_,n)=>FLAT.push({pi,ti:n}));
});
const flatIndex=(pi,ti)=>FLAT.findIndex(f=>f.pi===pi&&f.ti===ti);

const chipsEl=document.getElementById('chips');
let lastSec=null;
PAGES.forEach((p,i)=>{
  if(p.sec!==lastSec){chipsEl.appendChild(el('span','sec',p.sec)); lastSec=p.sec;}
  const b=el('button','chip',p.tag); b.type='button'; b.dataset.k=p.kind;
  b.addEventListener('click',()=>go(flatIndex(i,-1))); chipsEl.appendChild(b);
});
const chipBtns=()=>[...chipsEl.querySelectorAll('.chip')];

function chrome(){
  const {pi,ti}=FLAT[cur];
  const p=PAGES[pi], cfg=PLAYER_CFG[pi];
  chipBtns().forEach((c,n)=>c.classList.toggle('on',n===pi));
  const inner = (cfg&&ti>=0) ? ' &nbsp;·&nbsp; trace '+(ti+1)+'/'+cfg.rows.length : '';
  document.getElementById('crumb').innerHTML =
    p.sec+' &nbsp;·&nbsp; <b>'+p.tag+'</b>'+inner+' &nbsp;·&nbsp; '+(cur+1)+' of '+FLAT.length;
  document.getElementById('prev').disabled=cur===0;
  document.getElementById('next').disabled=cur===FLAT.length-1;
  const on=chipBtns()[pi]; if(on)on.scrollIntoView({block:'nearest',inline:'nearest'});
}
/* the player's own buttons keep the global position in sync */
function onPlayerStep(n){
  const idx=flatIndex(curPage,n);
  if(idx>-1){cur=idx; chrome();}
}
function go(i){
  cur=Math.max(0,Math.min(FLAT.length-1,i));
  const {pi,ti}=FLAT[cur];
  if(pi!==curPage){stopTimer(); curPage=pi; render(PAGES[pi]);}
  if(curPlayer)curPlayer.setIndex(ti);
  else applyHL(PAGES[pi].hl);
  chrome();
}
/* ---------- full screen ---------- */
const fsBtn=document.getElementById('fs');
/* merged: fullscreen the module panel, not the document. */
const root=document.getElementById("sqmod")||document.documentElement;
const fsOn=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
function fsSync(){
  const on=fsOn();
  document.getElementById('fsIn').hidden=on;
  document.getElementById('fsOut').hidden=!on;
  document.getElementById('fsLabel').textContent=on?'Exit':'Full screen';
  fsBtn.setAttribute('aria-label',on?'Exit full screen':'Enter full screen');
}
function fsToggle(){
  try{
    if(fsOn()){ (document.exitFullscreen||document.webkitExitFullscreen).call(document); }
    else{ const r=(root.requestFullscreen||root.webkitRequestFullscreen).call(root);
          if(r&&r.catch)r.catch(()=>{}); }
  }catch(e){}
}
/* merged: the site-wide control in the top bar owns fullscreen now, so this
   module's own button was removed from the markup. The block below is kept but
   inert when the button is absent — two handlers would toggle twice. */
if(!fsBtn||!(root.requestFullscreen||root.webkitRequestFullscreen)||document.fullscreenEnabled===false){
  if(fsBtn)fsBtn.hidden=true;
}else{
  fsBtn.addEventListener('click',fsToggle);
  document.addEventListener('fullscreenchange',fsSync);
  document.addEventListener('webkitfullscreenchange',fsSync);
  fsSync();
}

document.getElementById('prev').addEventListener('click',()=>go(cur-1));
document.getElementById('next').addEventListener('click',()=>go(cur+1));
document.addEventListener('keydown',e=>{
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  if(e.target.closest&&e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault(); go(cur+1);}
  else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault(); go(cur-1);}
  else if(e.key==='Home'){e.preventDefault(); go(0);}
  else if(e.key==='End'){e.preventDefault(); go(FLAT.length-1);}
  /* F is handled site-wide by assets/shell.js */
});
go(0);
})();
