# PostgreSQL Master

The front door for the XShare SQL batch. Five teaching resources, sequenced as a single path
rather than listed as a menu, so a student knows what to open first and what to open next.

**Live:** https://edusatyaki.github.io/PGSQLMaaster/

## The path

| # | Resource | Role | Link |
| --- | --- | --- | --- |
| 1 | **SQL Practice Workbook** | Foundations — 73 worked problems across DDL, DML, TCL and DCL, plus a chapter on functions. The query types itself out, then runs. | [site](https://edusatyaki.github.io/SQL-Practice-Workbook-1/) · [repo](https://github.com/edusatyaki/SQL-Practice-Workbook-1) |
| 2 | **PG Master** | Reference — 459 built-in functions, every result captured by running the query against PostgreSQL 16.14. Opened alongside every other step, not read front to back. | [site](https://edusatyaki.github.io/PGMaster/) · [repo](https://github.com/edusatyaki/PGMaster) |
| 3 | **Inner Query, Outer Query** | Subqueries — 35 steps, with the rows the inner query touches lighting up in the dataset panel as the trace advances. | [site](https://edusatyaki.github.io/Subquerry/) |
| 4 | **Window Functions** | An interactive visualiser for the only question that matters: which rows can the current row see? Change the function, partition, ordering or frame and the answer recomputes. | [site](https://edusatyaki.github.io/Windows-functions-/) · [repo](https://github.com/edusatyaki/Windows-functions-) |
| 5 | **SQL Roadmap** | Practice — 379 problems in teaching order, with progress tracking and a leaderboard ranked on solves verified against real LeetCode and HackerRank profiles. | [site](https://edusatyaki.github.io/SQLRoadmap/) · [repo](https://github.com/edusatyaki/SQLRoadmap) |

Step 2 is deliberately placed second and labelled as a reference: it is the dictionary, and
steps 1, 3, 4 and 5 are the grammar.

## Publishing

**Settings ▸ Pages ▸ Build and deployment ▸ Source ▸ GitHub Actions.** Pushing to `main` then
publishes the site via `.github/workflows/static.yml`. It appears at the URL above a minute
later.

Alternatively set the source to *Deploy from a branch* (`main`, `/ (root)`) and delete the
workflow — the site is plain static files either way. `.nojekyll` is present so GitHub serves
the directory as-is.

## Editing

One self-contained `index.html`: styles and markup, no JavaScript, no build step, no external
requests — no fonts, no CDN, nothing to go offline. Open it in a browser to preview.

The palette matches SQL Roadmap and the window-function visualiser, so the family reads as one
system:

| Token | Value | Used for |
| --- | --- | --- |
| `--accent` | `#0673f9` | buttons, active step markers |
| `--accent-deep` | `#0052cc` | links |
| `--ink` | `#16191d` | body text, hero and footer ground |
| `--ink-2` | `#5b6271` | secondary text |
| `--ground` | `#f6f7f9` | alternating band background |
| `--line` | `#e1e5ea` | borders |

Type is Arial and the site is light-only, matching the rest of the batch's sites. Every stat on
the page is a real figure from the resource it describes — if a resource grows, update the
number in both `index.html` and the table above.

---

Ideation & development [Satyaki Das](https://github.com/edusatyaki) · XShare
