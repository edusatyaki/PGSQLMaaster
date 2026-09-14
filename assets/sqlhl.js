/* SQL highlighter (number token renamed .n -> .nu: .n is numeric-cell
   alignment in the shared grid styles)
   Original: — lifted verbatim from PGMaster/build/template.html so the
   reference keeps the exact tokenising it was built with. Token CLASS names
   (.k .t .cf .s .nu .c .f) are now coloured by assets/theme.css, shared with
   every other module on the site. */
(function(root){
"use strict";
var esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const TYPES = ['INT','INT2','INT4','INT8','INTEGER','BIGINT','SMALLINT','NUMERIC','DECIMAL','REAL','FLOAT','DOUBLE','PRECISION','TEXT','VARCHAR','CHAR','CHARACTER','BOOLEAN','BOOL','DATE','TIME','TIMESTAMP','TIMESTAMPTZ','TIMETZ','INTERVAL','JSON','JSONB','JSONPATH','UUID','BYTEA','INET','CIDR','MACADDR','MACADDR8','TSVECTOR','TSQUERY','REGCONFIG','XML','RECORD','TRIGGER','VOID','SERIAL','BIGSERIAL','MONEY','BIT','POINT','BOX','CIRCLE','LINE','LSEG','PATH','POLYGON','OID','REGCLASS','REGTYPE','REGPROC','REGPROCEDURE','REGNAMESPACE','ANYARRAY','ANYELEMENT','ANYRANGE','ANYENUM','ANYMULTIRANGE','NUMRANGE','INT4RANGE','INT8RANGE','DATERANGE','TSRANGE','TSTZRANGE','INT4MULTIRANGE','XID8','PG_LSN','TID','NAME','PLPGSQL','SQL','SETOF'];
const CTRL = ['CASE','WHEN','THEN','ELSE','ELSIF','END','IF','BEGIN','DECLARE','RETURN','RETURNS','LOOP','WHILE','EXIT','CONTINUE','RAISE','EXCEPTION','CALL','DO'];
const KEYS = ['SELECT','FROM','WHERE','GROUP BY','HAVING','ORDER BY','LIMIT','OFFSET','INSERT INTO','VALUES','UPDATE','SET','DELETE','CREATE TABLE','CREATE FUNCTION','CREATE PROCEDURE','CREATE TRIGGER','CREATE INDEX','CREATE VIEW','CREATE TYPE','CREATE SEQUENCE','ALTER TABLE','DROP TABLE','TRUNCATE','JOIN','INNER JOIN','LEFT JOIN','RIGHT JOIN','FULL OUTER JOIN','LATERAL','ON','AS','DISTINCT','BETWEEN','AND','OR','NOT','IN','LIKE','ILIKE','SIMILAR TO','IS NULL','IS NOT NULL','IS DISTINCT FROM','IS NOT DISTINCT FROM','UNION','EXCEPT','INTERSECT','EXISTS','PRIMARY KEY','FOREIGN KEY','REFERENCES','DEFAULT','WITH','WITHIN GROUP','FILTER','OVER','PARTITION BY','ROWS BETWEEN','RANGE','GROUPS','UNBOUNDED PRECEDING','CURRENT ROW','UNBOUNDED FOLLOWING','WINDOW','ORDINALITY','ROWS FROM','RETURNING','ON CONFLICT','DO UPDATE','EXCLUDED','GENERATED ALWAYS AS IDENTITY','LANGUAGE','EXECUTE FUNCTION','FOR EACH ROW','FOR EACH STATEMENT','AFTER','BEFORE','EXPLAIN','ANALYZE','VACUUM','GRANT','REVOKE','COMMIT','ROLLBACK','CAST','ASC','DESC','NULLS LAST','NULLS FIRST','VARIADIC','ROLLUP','CUBE','GROUPING SETS','PASSING','COLUMNS','PLACING','FOR','ARRAY','ROW','TRUE','FALSE','NULL','AT TIME ZONE','OVERLAPS','ANY','ALL','SOME','IMMUTABLE','STABLE','VOLATILE','KEY','TABLE','INDEX','VIEW','SEQUENCE','FUNCTION','PROCEDURE','TO'];

const reOf = list => new RegExp('\\b(' + list.slice().sort((a, b) => b.length - a.length)
    .map(k => k.replace(/ /g, '\\s+')).join('|') + ')\\b', 'gi');
const RE_TYPE = reOf(TYPES), RE_CTRL = reOf(CTRL), RE_KEY = reOf(KEYS);
const RESERVED = new Set([...TYPES, ...CTRL, ...KEYS.flatMap(k => k.split(/\s+/))]);

function hl(str) {
    let out = esc(str);
    const held = [];
    const hold = h => { held.push(h); return 'QQ' + (held.length - 1) + 'QQ'; };
    out = out.replace(/--[^\n]*/g, m => hold('<span class="c">' + m + '</span>'));
    out = out.replace(/\$\$/g, m => hold('<span class="s">' + m + '</span>'));
    out = out.replace(/'(?:[^']|'')*'/g, m => hold('<span class="s">' + m + '</span>'));
    out = out.replace(/\b([A-Za-z_][A-Za-z0-9_]*)(?=\s*\()/g,
        (m) => RESERVED.has(m.toUpperCase()) ? m : hold('<span class="f">' + m + '</span>'));
    out = out.replace(RE_TYPE, m => hold('<span class="t">' + m + '</span>'));
    out = out.replace(RE_CTRL, m => hold('<span class="cf">' + m + '</span>'));
    out = out.replace(RE_KEY, m => '<span class="k">' + m + '</span>');
    out = out.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="nu">$1</span>');
    return out.replace(/QQ(\d+)QQ/g, (_, i) => held[+i]);
}
root.sqlHL = hl; root.sqlEsc = esc;
})(window);
