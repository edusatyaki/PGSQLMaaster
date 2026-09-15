/* Module 06 - DBMS & SQL rapid fire: 100-question bank, carried over unchanged. */
/* =====================================================================
   DBMS & SQL — Rapid Fire question bank (100 questions) · Set B
   Same syllabus as before, entirely different questions.

   Sourced from:
     Lecture 1 — Data, Classification of Data, DBMS advantages, Schema
     Lecture 2 — Introduction to SQL and SQL Commands (DDL/DML/TCL/DCL)
     Lecture 3 — Talking to Your Data (SELECT ... LIMIT/OFFSET)
     Chapter 4 — SQL Functions in PostgreSQL

   Format:  q = question, o = 4 options, a = index of correct option, t = topic
   Text between `backticks` is rendered as inline code.
   ===================================================================== */

const QUESTIONS = [

  /* ---------- TOPIC 1 : Foundations of Data & DBMS (17) ---------- */
  { t: "Foundations", a: 2,
    q: "Zomato's \"Top Picks\" is built by ranking restaurants using:",
    o: ["The restaurant's distance from the warehouse",
        "A random shuffle refreshed every hour",
        "Your past preferences and the ratings others left",
        "Only the restaurant's opening hours"] },

  { t: "Foundations", a: 0,
    q: "Which statement matches how organisations actually work with data?",
    o: ["They collect and store data first — analysis comes later",
        "They analyse first and store only the conclusions",
        "They store only data that has already been interpreted",
        "They discard raw observations once a report is made"] },

  { t: "Foundations", a: 3,
    q: "How does information differ from data?",
    o: ["Information is always numeric, data is always text",
        "Information is stored, data is discarded",
        "There is no difference — the words are interchangeable",
        "Information is data placed in a context that gives it meaning"] },

  { t: "Foundations", a: 1,
    q: "A scanned invoice saved as a .pdf is which category of data?",
    o: ["Structured", "Unstructured", "Semi-structured", "Relational"] },

  { t: "Foundations", a: 2,
    q: "Semi-structured data is typically stored in:",
    o: ["Relational databases and data warehouses",
        "Object storage such as S3 only",
        "Document stores like MongoDB, or XML / JSON files",
        "Spreadsheets exported as CSV"] },

  { t: "Foundations", a: 0,
    q: "Why is an Excel sheet easier to search than a folder of images?",
    o: ["It is structured — fixed rows and columns allow filtering and sorting",
        "Images are compressed and cannot be opened quickly",
        "Excel files are smaller than image files",
        "Excel automatically indexes every pixel"] },

  { t: "Foundations", a: 3,
    q: "Can every type of data be stored efficiently in tables?",
    o: ["Yes — any file can be split across columns",
        "Yes, as long as the table has enough columns",
        "Only if the table uses a composite primary key",
        "No — nested, variable or media data does not fit a rigid schema"] },

  { t: "Foundations", a: 1,
    q: "In the school records room, what plays the role a relational schema plays?",
    o: ["The number of students in each class",
        "The predefined aisle → cupboard → drawer → file arrangement",
        "The clerk who fetches the paper",
        "The label stuck on each answer sheet"] },

  { t: "Foundations", a: 2,
    q: "What does the university locker (semi-structured) trade away in exchange for flexibility?",
    o: ["Storage capacity", "The ability to add new records", "Search efficiency", "Data ownership"] },

  { t: "Foundations", a: 0,
    q: "For talent-hunt submissions with no common format, retrieval depends on:",
    o: ["Metadata labels such as student name, category and date",
        "The primary key of each submission",
        "A foreign key to the students table",
        "The order in which files were uploaded"] },

  { t: "Foundations", a: 3,
    q: "How does a relational database connect two tables?",
    o: ["By storing both tables in the same file",
        "By sorting both tables identically",
        "By copying every column of one table into the other",
        "By repeating a shared value in both tables"] },

  { t: "Foundations", a: 1,
    q: "Which record type does NOT fit a relational table?",
    o: ["A customer with id, name, email and city",
        "A video file with no rows or columns at all",
        "An order with an id, a date and an amount",
        "A student with a roll number and marks"] },

  { t: "Foundations", a: 2,
    q: "Which non-relational database allows each record to carry its own set of columns?",
    o: ["Redis", "Neo4j", "Cassandra", "SQLite"] },

  { t: "Foundations", a: 0,
    q: "A power cut hits while a large CSV is being saved. How does a DBMS avoid the same fate?",
    o: ["It writes changes to a transaction log before applying them",
        "It saves the file twice in different folders",
        "It refuses writes while the battery is low",
        "It compresses the file so writes finish faster"] },

  { t: "Foundations", a: 3,
    q: "\"Update once → reflected everywhere\" describes which DBMS advantage?",
    o: ["Backup and recovery", "Concurrent access control",
        "Efficient querying", "Elimination of data redundancy"] },

  { t: "Foundations", a: 1,
    q: "Permissions that can be set at table, column and even row level describe which advantage?",
    o: ["Data integrity", "Security and access control", "Data consistency", "Indexed retrieval"] },

  { t: "Foundations", a: 2,
    q: "A student's name is 'Rahul' in one file and 'Rahul S.' in another. Which problem is this, and what fixes it?",
    o: ["Redundancy — fixed by adding an index",
        "Concurrency — fixed by locking the file",
        "Inconsistency — fixed by constraints enforcing a single source of truth",
        "An orphan record — fixed by a foreign key"] },

  /* ---------- TOPIC 2 : Schema, Constraints, Keys & Datatypes (17) ---------- */
  { t: "Schema & Keys", a: 1,
    q: "In a schema, real-world objects such as Customer, Product and Order are represented as:",
    o: ["Columns", "Tables", "Constraints", "Indexes"] },

  { t: "Schema & Keys", a: 3,
    q: "Attributes such as name, email, price and quantity are stored as:",
    o: ["Rows", "Tables", "Keys", "Columns"] },

  { t: "Schema & Keys", a: 0,
    q: "\"Orders belong to Customers via cust_id\" is an example of which part of a schema?",
    o: ["A relationship", "An entity", "An attribute", "A datatype"] },

  { t: "Schema & Keys", a: 2,
    q: "Which constraint stops a second customer from registering an email that is already in use?",
    o: ["NOT NULL", "CHECK", "UNIQUE", "DEFAULT"] },

  { t: "Schema & Keys", a: 1,
    q: "Can a single column be both NOT NULL and UNIQUE?",
    o: ["No — the two constraints conflict",
        "Yes — they are independent; a column can be one, both or neither",
        "Only if it is also the primary key",
        "Only on integer columns"] },

  { t: "Schema & Keys", a: 3,
    q: "What does a CHECK constraint do?",
    o: ["Verifies the column type after the row is stored",
        "Warns the user but stores the row anyway",
        "Replaces an invalid value with the column default",
        "Rejects, at write time, any row that violates its condition"] },

  { t: "Schema & Keys", a: 0,
    q: "Which constraint supplies a value when the INSERT statement does not provide one?",
    o: ["DEFAULT", "NOT NULL", "CHECK", "UNIQUE"] },

  { t: "Schema & Keys", a: 2,
    q: "NOT NULL, UNIQUE, CHECK and DEFAULT constrain individual columns. Which two govern whole rows and relationships between tables?",
    o: ["INDEX and VIEW", "SELECT and GRANT",
        "PRIMARY KEY and FOREIGN KEY", "COMMIT and ROLLBACK"] },

  { t: "Schema & Keys", a: 1,
    q: "Why must a primary key be NOT NULL?",
    o: ["Because NULL takes up too much storage",
        "Because a row's identity cannot be unknown",
        "Because NULL cannot be indexed in any database",
        "Because NULL would break the DEFAULT clause"] },

  { t: "Schema & Keys", a: 3,
    q: "A primary key should be \"immutable in spirit\". What does that mean in practice?",
    o: ["It can never be altered by any SQL statement",
        "It must be generated by the database, never by the application",
        "It has to be a single integer column",
        "It should be chosen so that its value rarely, if ever, needs to change"] },

  { t: "Schema & Keys", a: 0,
    q: "In Customers(cust_id, email, phone, name, city), which set lists the candidate keys?",
    o: ["{cust_id}, {email}, {phone}",
        "{cust_id} only",
        "{cust_id, name}, {email, city}",
        "{name}, {city}"] },

  { t: "Schema & Keys", a: 2,
    q: "`email` is a candidate key but `cust_id` was chosen as the primary key. How do you still enforce email's uniqueness?",
    o: ["Add a second PRIMARY KEY on email",
        "Add a FOREIGN KEY on email",
        "Add a UNIQUE constraint on email",
        "Nothing is needed — candidate keys are enforced automatically"] },

  { t: "Schema & Keys", a: 1,
    q: "{cust_id, email, city} uniquely identifies a row but carries extra columns. It is:",
    o: ["A candidate key", "A superkey", "A primary key", "A foreign key"] },

  { t: "Schema & Keys", a: 3,
    q: "Which datatype suits a `country_code` that is always exactly two characters, such as 'IN'?",
    o: ["VARCHAR(50)", "INT", "BOOLEAN", "CHAR(2)"] },

  { t: "Schema & Keys", a: 0,
    q: "Which datatype suits `placed_at` holding `2026-08-06 14:32`?",
    o: ["TIMESTAMP", "DATE", "TIME", "VARCHAR(20)"] },

  { t: "Schema & Keys", a: 2,
    q: "What goes wrong if age is stored as text instead of INT?",
    o: ["Nothing — text sorts numbers correctly",
        "The column silently converts to INT on the first query",
        "'9' sorts after '27', averages become impossible, and 'twenty' is accepted without complaint",
        "The column can no longer be NOT NULL"] },

  { t: "Schema & Keys", a: 1,
    q: "Which datatype fits an `is_prime` column that holds one of two states?",
    o: ["CHAR(5)", "BOOLEAN", "INT", "DECIMAL(1,0)"] },

  /* ---------- TOPIC 3 : SQL Commands — DDL / DML / TCL / DCL (23) ---------- */
  { t: "SQL Commands", a: 2,
    q: "In the university analogy, which category is described as \"constructing classrooms\"?",
    o: ["DML", "TCL", "DDL", "DCL"] },

  { t: "SQL Commands", a: 0,
    q: "Which category is described as \"deciding who gets access\"?",
    o: ["DCL", "DDL", "DML", "TCL"] },

  { t: "SQL Commands", a: 3,
    q: "Which category is described as \"undoing mistakes safely\"?",
    o: ["DDL", "DML", "DCL", "TCL"] },

  { t: "SQL Commands", a: 1,
    q: "\"We need somewhere to store every student's ID and name before classes begin.\" Which command?",
    o: ["ALTER TABLE students ADD COLUMN id INT;",
        "CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(50));",
        "INSERT INTO students (id, name) VALUES (1, 'Amit');",
        "TRUNCATE TABLE students;"] },

  { t: "SQL Commands", a: 2,
    q: "ALTER can do all of the following EXCEPT:",
    o: ["Add or drop a column", "Change a column's data type",
        "Delete all the rows in the table", "Adjust a constraint such as PRIMARY KEY"] },

  { t: "SQL Commands", a: 0,
    q: "Which command matches the analogy \"emptying a bucket without losing the bucket\"?",
    o: ["TRUNCATE", "DROP", "DELETE", "ALTER"] },

  { t: "SQL Commands", a: 3,
    q: "Which command matches the analogy \"throwing away the bucket\"?",
    o: ["TRUNCATE", "DELETE", "ALTER", "DROP"] },

  { t: "SQL Commands", a: 1,
    q: "Why does ALTER become important as an application evolves?",
    o: ["It speeds up SELECT queries as tables grow",
        "Requirements change, and it adds or modifies columns without losing existing data",
        "It is the only way to remove duplicate rows",
        "It automatically backs the table up before each change"] },

  { t: "SQL Commands", a: 2,
    q: "How do you add several student records in a single statement?",
    o: ["Run CREATE once per student",
        "Use UPDATE with multiple SET clauses",
        "Use INSERT with several VALUES groups",
        "Use SELECT INTO with a WHERE clause"] },

  { t: "SQL Commands", a: 0,
    q: "After `TRUNCATE TABLE students;` runs, what is left?",
    o: ["The table structure, holding 0 rows",
        "Nothing at all",
        "The rows, but without their column names",
        "Only the rows that failed a constraint"] },

  { t: "SQL Commands", a: 3,
    q: "After `DROP TABLE students;` runs, what is left to reuse?",
    o: ["The rows, in a recycle bin",
        "The structure, ready for a new batch",
        "The primary key definition",
        "Nothing — the object is gone entirely"] },

  { t: "SQL Commands", a: 1,
    q: "`UPDATE students SET branch = 'CSE' WHERE name = 'Riya';` changes:",
    o: ["Every row in the table",
        "Only Riya's row",
        "Every row whose branch is currently NULL",
        "Nothing — UPDATE cannot be used with WHERE"] },

  { t: "SQL Commands", a: 2,
    q: "What is the classic, costly mistake when writing an UPDATE?",
    o: ["Using single quotes around text values",
        "Listing the columns in a different order",
        "Forgetting the WHERE clause, so every row is updated",
        "Running it inside a transaction"] },

  { t: "SQL Commands", a: 0,
    q: "In the failed transfer, money leaves Account A and never reaches Account B. What must the database guarantee to prevent this?",
    o: ["That all steps of the transaction happen, or none do",
        "That the debit is always applied before the credit",
        "That both accounts are locked for an hour",
        "That the amount is logged to a separate file"] },

  { t: "SQL Commands", a: 3,
    q: "Which command makes pending changes visible to every other session?",
    o: ["SAVEPOINT", "BEGIN", "ROLLBACK", "COMMIT"] },

  { t: "SQL Commands", a: 1,
    q: "Can ROLLBACK undo a transaction that has already been committed?",
    o: ["Yes, if run in the same session",
        "No — once COMMIT runs, the change cannot be undone with ROLLBACK",
        "Yes, but only within 60 seconds",
        "Yes, if a SAVEPOINT was created first"] },

  { t: "SQL Commands", a: 2,
    q: "Account A holds ₹1,000. A ₹2,000 debit is applied, the SELECT check returns −1,000, and ROLLBACK runs. What is A's balance?",
    o: ["₹−1,000", "₹0", "₹1,000", "₹2,000"] },

  { t: "SQL Commands", a: 0,
    q: "What does SAVEPOINT give you that COMMIT does not?",
    o: ["A checkpoint inside a transaction that you can partially undo to",
        "Permanent storage of the changes so far",
        "Visibility of the changes to other sessions",
        "Protection against a power failure"] },

  { t: "SQL Commands", a: 3,
    q: "What happens to your changes if COMMIT is never executed?",
    o: ["They are saved automatically after a timeout",
        "They are written but marked as unverified",
        "They are visible to everyone but read-only",
        "They stay pending, and can still be rolled back or lost when the session ends"] },

  { t: "SQL Commands", a: 1,
    q: "\"Give the faculty team read access to the students table — nothing more.\" Which statement?",
    o: ["GRANT ALL ON students TO faculty_team;",
        "GRANT SELECT ON students TO faculty_team;",
        "REVOKE SELECT ON students FROM faculty_team;",
        "GRANT SELECT ON faculty_team TO students;"] },

  { t: "SQL Commands", a: 2,
    q: "Which pair of commands lets administrators keep access tightly matched to what each role actually needs?",
    o: ["COMMIT and ROLLBACK", "CREATE and DROP", "GRANT and REVOKE", "INSERT and DELETE"] },

  { t: "SQL Commands", a: 0,
    q: "Which risk is NOT prevented by proper permission control?",
    o: ["A power outage corrupting a half-written file",
        "Unauthorised access to sensitive data",
        "Malicious deletion of records",
        "Loss of accountability for who changed what"] },

  { t: "SQL Commands", a: 3,
    q: "Without SQL, relational databases would be:",
    o: ["Faster, but harder to back up",
        "Limited to structured data only",
        "Unable to enforce constraints",
        "Storage systems with no meaningful way to interact with them"] },

  /* ---------- TOPIC 4 : Querying Data (20) ---------- */
  { t: "Querying", a: 1,
    q: "If projection is a vertical slice of a table, WHERE is:",
    o: ["Another vertical slice", "A horizontal slice",
        "A sort of the result", "A count of the rows"] },

  { t: "Querying", a: 2,
    q: "`SELECT name, branch FROM students;` is an example of:",
    o: ["Filtering", "Aggregation", "Projection", "Pagination"] },

  { t: "Querying", a: 0,
    q: "Why is `SELECT *` fine on 6 rows but a problem on 6 million?",
    o: ["It pulls every column of every row, which is slow and wasteful at scale",
        "It stops working beyond one million rows",
        "It locks the table while it runs",
        "It silently drops columns it cannot fit"] },

  { t: "Querying", a: 3,
    q: "Should duplicate rows always be removed with DISTINCT?",
    o: ["Yes — duplicates are always a data-entry error",
        "Yes — DISTINCT is free, so it costs nothing to add",
        "Only when the column is a primary key",
        "No — sometimes repeats carry real information, such as multiple orders"] },

  { t: "Querying", a: 1,
    q: "Which query lists the branches the college runs, with no repeats?",
    o: ["SELECT branch FROM students;",
        "SELECT DISTINCT branch FROM students;",
        "SELECT * FROM students WHERE branch IS NOT NULL;",
        "SELECT branch FROM students LIMIT 1;"] },

  { t: "Querying", a: 2,
    q: "Which condition means \"attendance of 90 or more\"?",
    o: ["attendance > 90", "attendance = 90", "attendance >= 90", "attendance <= 90"] },

  { t: "Querying", a: 0,
    q: "`WHERE city <> 'Pune'` returns:",
    o: ["Every student not recorded as being in Pune",
        "Only the students from Pune",
        "Students whose city column is empty",
        "An error — <> is not valid in PostgreSQL"] },

  { t: "Querying", a: 3,
    q: "Why does IN win over stacked OR conditions as the value list grows?",
    o: ["IN is the only form that uses an index",
        "OR cannot be used with text columns",
        "IN allows more than three values, OR does not",
        "IN stays short, is easier to edit, and reads far better"] },

  { t: "Querying", a: 1,
    q: "What do `'Jan' LIKE 'J_n'` and `'Joan' LIKE 'J_n'` return?",
    o: ["Both true", "true and false", "false and true", "Both false"] },

  { t: "Querying", a: 2,
    q: "Which pattern finds names that contain \"it\" anywhere inside them?",
    o: ["'it%'", "'%it'", "'%it%'", "'_it_'"] },

  { t: "Querying", a: 0,
    q: "Which pattern finds names that end with the letter a?",
    o: ["'%a'", "'a%'", "'_a'", "'%a%'"] },

  { t: "Querying", a: 3,
    q: "Which wildcard also matches when there are zero characters in that position?",
    o: ["_", "?", "*", "%"] },

  { t: "Querying", a: 1,
    q: "Swapping AND for OR between two conditions usually:",
    o: ["Returns exactly the same rows",
        "Returns more rows, because either condition is now enough",
        "Returns fewer rows, because both must now be true",
        "Returns the rows in reverse order"] },

  { t: "Querying", a: 2,
    q: "`WHERE NOT (city = 'Mumbai')` keeps:",
    o: ["Only the Mumbai students",
        "Nothing, unless a second condition is added",
        "Everything outside Mumbai — the selection is flipped",
        "Students whose city is NULL only"] },

  { t: "Querying", a: 0,
    q: "When mixing AND and OR in the same WHERE clause, what should you use to be safe?",
    o: ["Parentheses around the grouped conditions",
        "A separate query for each operator",
        "The NOT operator in front of the clause",
        "A semicolon between the conditions"] },

  { t: "Querying", a: 3,
    q: "A dashboard froze trying to load all 40,000 records. Which keyword fixes it?",
    o: ["DISTINCT", "WHERE", "IN", "LIMIT"] },

  { t: "Querying", a: 1,
    q: "Which query returns page 2 of a listing that shows 10 students per page?",
    o: ["LIMIT 2 OFFSET 10", "LIMIT 10 OFFSET 10", "LIMIT 10 OFFSET 20", "LIMIT 20 OFFSET 2"] },

  { t: "Querying", a: 2,
    q: "Which runs first when the database executes a query?",
    o: ["SELECT", "DISTINCT", "WHERE", "LIMIT"] },

  { t: "Querying", a: 0,
    q: "Of FROM, WHERE, SELECT and LIMIT, which runs last?",
    o: ["LIMIT", "SELECT", "WHERE", "FROM"] },

  { t: "Querying", a: 3,
    q: "Why does the database run SELECT almost last, even though you write it first?",
    o: ["Because SELECT is the slowest clause",
        "Because the parser reads the query backwards",
        "Because columns cannot be read until the table is sorted",
        "Because SQL is declarative — you describe what you want, and the engine decides how to get it"] },

  /* ---------- TOPIC 5 : SQL Functions in PostgreSQL (18) ---------- */
  { t: "SQL Functions", a: 1,
    q: "What do `ROUND(45.5)` and `ROUND(45.4)` return?",
    o: ["45 and 45", "46 and 45", "45 and 46", "46 and 46"] },

  { t: "SQL Functions", a: 2,
    q: "`SELECT TRUNC(-45.678, 2);` returns:",
    o: ["-45.68", "-46.00", "-45.67", "-45"] },

  { t: "SQL Functions", a: 0,
    q: "How does CEILING() relate to CEIL()?",
    o: ["They are identical", "CEILING rounds to the nearest even number",
        "CEILING works only on negatives", "CEILING returns a decimal, CEIL an integer"] },

  { t: "SQL Functions", a: 3,
    q: "`SELECT 7 / 2.0;` returns 3.5, but `SELECT 7 / 2;` returns 3. Why?",
    o: ["The second query has a syntax error",
        "PostgreSQL always rounds down to the nearest even number",
        "The 2.0 is treated as text",
        "With two integer operands the division truncates; one decimal operand fixes it"] },

  { t: "SQL Functions", a: 1,
    q: "`SELECT POWER(2, 10);` returns:",
    o: ["20", "1024", "100", "12"] },

  { t: "SQL Functions", a: 2,
    q: "`SELECT ABS(-45.75);` returns:",
    o: ["-45.75", "45", "45.75", "46"] },

  { t: "SQL Functions", a: 0,
    q: "`EXTRACT(DOW FROM NOW())` returns 0. Which day is that?",
    o: ["Sunday", "Monday", "Saturday", "The first day of the month"] },

  { t: "SQL Functions", a: 3,
    q: "Which query finds everyone who joined in the last twelve months?",
    o: ["WHERE join_date <= NOW() - INTERVAL '12 months'",
        "WHERE join_date = NOW() - INTERVAL '1 year'",
        "WHERE EXTRACT(YEAR FROM join_date) = 12",
        "WHERE join_date >= NOW() - INTERVAL '12 months'"] },

  { t: "SQL Functions", a: 1,
    q: "On 29 May 2026, `DATE_TRUNC('year', NOW())` returns:",
    o: ["2026", "2026-01-01 00:00:00", "2026-05-01 00:00:00", "2026-12-31 23:59:59"] },

  { t: "SQL Functions", a: 2,
    q: "`SELECT TO_CHAR(45678.6789, '999G999D99');` returns:",
    o: ["45678.6789", "45678.68", "45,678.68", "999,999.99"] },

  { t: "SQL Functions", a: 0,
    q: "Which function converts 'john doe' to title case?",
    o: ["INITCAP", "UPPER", "LOWER", "TRIM"] },

  { t: "SQL Functions", a: 3,
    q: "What is the correct way to do a case-insensitive equality match on a name?",
    o: ["WHERE name = 'JOHN doe'",
        "WHERE name LIKE 'JOHN doe'",
        "WHERE UPPER(name) = 'john doe'",
        "WHERE LOWER(name) = LOWER('JOHN doe')"] },

  { t: "SQL Functions", a: 1,
    q: "`SELECT LENGTH('PostgreSQL');` returns:",
    o: ["9", "10", "11", "16"] },

  { t: "SQL Functions", a: 2,
    q: "`SELECT SPLIT_PART('john@gmail.com', '@', 1);` returns:",
    o: ["gmail.com", "@gmail", "john", "com"] },

  { t: "SQL Functions", a: 0,
    q: "`SELECT LEFT('PostgreSQL', -3);` returns:",
    o: ["Postgre", "SQL", "Pos", "LQS"] },

  { t: "SQL Functions", a: 3,
    q: "`SELECT RPAD('7', 3, '0');` returns:",
    o: ["007", "0700", "77", "700"] },

  { t: "SQL Functions", a: 1,
    q: "`SELECT TRANSLATE('(999) 123', '() ', '');` returns:",
    o: ["(999)123", "999123", "999 123", "123"] },

  { t: "SQL Functions", a: 2,
    q: "`SELECT TRIM(BOTH 'x' FROM 'xxxDATAxxx');` returns:",
    o: ["'xxxDATAxxx'", "'DATAxxx'", "'DATA'", "'xxxDATA'"] },

  /* ---------- TOPIC 6 : NULL Handling (5) ---------- */
  { t: "NULL Handling", a: 0,
    q: "`SELECT 100 + NULL;` returns:",
    o: ["NULL — NULL poisons arithmetic", "100", "0", "An error"] },

  { t: "NULL Handling", a: 3,
    q: "`SELECT NULLIF(10, 5);` returns:",
    o: ["NULL", "5", "0", "10"] },

  { t: "NULL Handling", a: 1,
    q: "`SELECT NULL IS DISTINCT FROM NULL;` returns:",
    o: ["NULL", "false — two NULLs are not considered different", "true", "An error"] },

  { t: "NULL Handling", a: 2,
    q: "`SELECT COALESCE(NULL, 0) + 100;` returns:",
    o: ["NULL", "0", "100", "An error"] },

  { t: "NULL Handling", a: 1,
    q: "`WHERE phone IS DISTINCT FROM '9912345670'` differs from `WHERE phone <> '9912345670'` because it:",
    o: ["Runs faster on indexed columns",
        "Also includes the rows where phone is NULL",
        "Excludes the rows where phone is NULL",
        "Matches partial phone numbers as well"] }
];

if (typeof module !== "undefined") { module.exports = QUESTIONS; }
