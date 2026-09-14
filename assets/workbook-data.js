/* SQL Practice Workbook — PostgreSQL
   Presenter deck data. Each entry is one problem/slide. */

const DECK = [
  {
    unit: "Unit 0 — Creating a Database",
    num: "0.1",
    title: "Create and connect",
    question: "Create a new database named <b>university</b> and connect to it.",
    given:
`\\l
    Name    | Owner
------------+----------
 postgres   | postgres
 template0  | postgres
 template1  | postgres`,
    code:
`CREATE DATABASE university;
\\c university`,
    output:
`\\l
    Name    | Owner
------------+----------
 postgres   | postgres
 template0  | postgres
 template1  | postgres
 university | postgres    ← new

SELECT current_database();
 current_database
------------------
 university`,
    hints: [
      "The first statement starts with CREATE.",
      "The second is a psql shortcut beginning with a backslash. In pgAdmin, you instead open a Query Tool on the university database."
    ]
  },
  {
    unit: "Unit 1 — Creating a Table (CREATE)",
    num: "1.1",
    title: "Create the students table",
    question: "Create table <b>students</b> with <b>roll_no</b> as PRIMARY KEY, <b>name</b> (max 50, cannot be empty), <b>branch</b> (max 20), and <b>marks</b> restricted to values between 0 and 100.",
    given: "no tables exist.",
    code:
`CREATE TABLE students (
  roll_no INT PRIMARY KEY,
  name    VARCHAR(50) NOT NULL,
  branch  VARCHAR(20),
  marks   INT,
  CONSTRAINT chk_marks CHECK (marks BETWEEN 0 AND 100)
);`,
    output:
`\\d students
  Column  |         Type          | Nullable
----------+-----------------------+----------
 roll_no  | integer               | not null
 name     | character varying(50) | not null
 branch   | character varying(20) |
 marks    | integer               |
Indexes:
    "students_pkey" PRIMARY KEY (roll_no)
Check constraints:
    "chk_marks" CHECK (marks BETWEEN 0 AND 100)

-- this insert is correctly rejected:
INSERT INTO students VALUES (1, 'Amit', 'CSE', 105);
ERROR: new row violates check constraint "chk_marks"`,
    hints: [
      "CREATE TABLE students ( ... ); — the columns go inside the brackets, separated by commas.",
      "Each column line reads column_name TYPE constraint.",
      "Name the check so the error message is readable: CONSTRAINT chk_marks CHECK ( ... ).",
      "No comma after the last item inside the brackets."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.1",
    title: "Add a unique column",
    question: "Add an <b>email VARCHAR(100)</b> column that must be unique, keeping existing rows.",
    given: "students(roll_no, name, branch, marks)",
    code:
`ALTER TABLE students
ADD COLUMN email VARCHAR(100) UNIQUE;`,
    output:
`students(roll_no, name, branch, marks, email)

email is UNIQUE; NULL for all existing rows`,
    hints: [
      "Starts with ALTER TABLE students.",
      "The action is ADD COLUMN, then name and type.",
      "The uniqueness rule is one extra word at the end of the same line."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.2",
    title: "Add a plain column",
    question: "Add a <b>phone VARCHAR(15)</b> column.",
    given: "students(roll_no, name, branch, marks)",
    code:
`ALTER TABLE students
ADD COLUMN phone VARCHAR(15);`,
    output:
`students(roll_no, name, branch, marks, phone)

phone is nullable`,
    hints: [
      "Same shape as 2.1, minus the constraint.",
      "A column with no rules attached is nullable by default."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.3",
    title: "Change a column's type",
    question: "Longer branch names are now needed. Widen <b>branch</b> from VARCHAR(20) to VARCHAR(100).",
    given: "branch | character varying(20)",
    code:
`ALTER TABLE students
ALTER COLUMN branch TYPE VARCHAR(100);`,
    output: "branch | character varying(100)",
    hints: [
      "Two words after the table name: ALTER COLUMN.",
      "Then the column name, then the keyword TYPE, then the new type.",
      "Widening is always safe. Narrowing would fail if longer values already exist."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.4",
    title: "Rename a column",
    question: "Rename <b>branch</b> to <b>department</b>.",
    given: "students(roll_no, name, branch, marks)",
    code:
`ALTER TABLE students
RENAME COLUMN branch TO department;`,
    output: "students(roll_no, name, department, marks)",
    hints: [
      "The keyword is RENAME COLUMN.",
      "Join the old and new names with TO."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.5",
    title: "Make a column compulsory",
    question: "<b>branch</b> must never be empty from now on.",
    given: "branch | character varying(20) |    ← nullable",
    code:
`ALTER TABLE students
ALTER COLUMN branch SET NOT NULL;`,
    output: "branch | character varying(20) | not null",
    hints: [
      "Use ALTER COLUMN branch, then SET.",
      "This fails if any existing row already has branch as NULL — fill those rows first."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.6",
    title: "Make a column optional again",
    question: "Allow <b>name</b> to be empty again.",
    given: "name | character varying(50) | not null",
    code:
`ALTER TABLE students
ALTER COLUMN name DROP NOT NULL;`,
    output: "name | character varying(50) |    ← nullable",
    hints: [
      "The opposite of 2.5.",
      "Where 2.5 used SET, this one uses DROP."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.7",
    title: "Set a default value",
    question: "Most students are in CSE. Set the default value of <b>branch</b> to <b>'CSE'</b>.",
    given: "branch | character varying(20) |    ← no default",
    code:
`ALTER TABLE students
ALTER COLUMN branch SET DEFAULT 'CSE';`,
    output: "branch | character varying(20) | default 'CSE'",
    hints: [
      "ALTER COLUMN branch SET ...",
      "The default applies only to rows inserted afterwards. Existing NULLs are not filled in."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.8",
    title: "Delete a column",
    question: "Remove the <b>phone</b> column.",
    given: "students(roll_no, name, branch, marks, phone)",
    code:
`ALTER TABLE students
DROP COLUMN phone;`,
    output: "students(roll_no, name, branch, marks)",
    hints: [
      "The action is DROP COLUMN.",
      "This deletes the column and all data inside it. There is no undo once committed."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.9",
    title: "Several actions in one statement",
    question: "In a single statement, add <b>email VARCHAR(100)</b> and set <b>branch</b>'s default to <b>'CSE'</b>.",
    given:
`no email column;
branch has no default`,
    code:
`ALTER TABLE students
ADD COLUMN email VARCHAR(100),
ALTER COLUMN branch SET DEFAULT 'CSE';`,
    output:
`email column added;
branch default is 'CSE'`,
    hints: [
      "Write ALTER TABLE students once, on its own line.",
      "Then list the two actions, separated by a comma.",
      "Only the last action gets the semicolon."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.10",
    title: "Add a primary key",
    question: "Table <b>courses(course_id, title)</b> has no key. Make <b>course_id</b> the primary key.",
    given:
`\\d courses
  Column   |         Type
-----------+-----------------------
 course_id | integer
 title     | character varying(50)
(no primary key)`,
    code:
`ALTER TABLE courses
ADD PRIMARY KEY (course_id);`,
    output:
`Indexes:
    "courses_pkey" PRIMARY KEY (course_id)`,
    hints: [
      "ALTER TABLE courses ADD ...",
      "The column name goes in brackets at the end.",
      "This fails if course_id contains duplicates or NULLs."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.11",
    title: "Add a unique constraint",
    question: "No two students may share an email address.",
    given:
`email | character varying(100)
        ← no unique rule`,
    code:
`ALTER TABLE students
ADD CONSTRAINT uq_email UNIQUE (email);`,
    output: "constraint uq_email UNIQUE (email)",
    hints: [
      "Use ADD CONSTRAINT, then the name you are giving it.",
      "Then the rule type, then the column in brackets."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.12",
    title: "Add a check constraint",
    question: "<b>marks</b> must never exceed 100.",
    given: "no ceiling constraint on marks",
    code:
`ALTER TABLE students
ADD CONSTRAINT chk_m CHECK (marks <= 100);`,
    output: "constraint chk_m CHECK (marks <= 100)",
    hints: [
      "Same shape as 2.11 — ADD CONSTRAINT, a name, then the rule.",
      "The condition goes inside brackets after the keyword CHECK.",
      "This fails if any existing row already breaks the rule."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.13",
    title: "Add a foreign key",
    question: "Link <b>students.branch_id</b> to <b>branches.id</b>.",
    given:
`students.branch_id — unconstrained
branches(id PRIMARY KEY, bname)`,
    code:
`ALTER TABLE students
ADD CONSTRAINT fk_branch
FOREIGN KEY (branch_id) REFERENCES branches(id);`,
    output:
`constraint fk_branch — branch_id
must exist in branches(id)`,
    hints: [
      "ADD CONSTRAINT fk_branch, then the rule on the next line.",
      "The rule reads FOREIGN KEY (column) REFERENCES other_table(column).",
      "This fails if any existing branch_id has no matching row in branches."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.14",
    title: "Drop a constraint",
    question: "Remove the <b>chk_m</b> check constraint.",
    given: "constraint chk_m exists",
    code:
`ALTER TABLE students
DROP CONSTRAINT chk_m;`,
    output: "chk_m no longer exists",
    hints: [
      "In PostgreSQL, one command drops every kind of constraint: DROP CONSTRAINT.",
      "You only need the constraint's name, not its type. (MySQL is different — there you must write DROP CHECK or DROP FOREIGN KEY.)"
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.15",
    title: "Rename a constraint",
    question: "Rename the constraint <b>chk_m</b> to <b>chk_marks</b>.",
    given: "constraint chk_m",
    code:
`ALTER TABLE students
RENAME CONSTRAINT chk_m TO chk_marks;`,
    output: "constraint chk_marks",
    hints: [
      "Same pattern as renaming a column, but with the word CONSTRAINT.",
      "Old name, then TO, then new name."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.16",
    title: "Rename the table",
    question: "Rename <b>students</b> to <b>learners</b>.",
    given: "table students",
    code:
`ALTER TABLE students
RENAME TO learners;`,
    output: "table learners",
    hints: [
      "RENAME TO — no word COLUMN this time, because you are renaming the table itself."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.17",
    title: "Convert text to number",
    question: "<b>marks</b> was created as TEXT but holds numbers. Convert the column to INT.",
    given:
`marks | text
values: '88', '91', '79'`,
    code:
`ALTER TABLE students
ALTER COLUMN marks TYPE INT
USING marks::integer;`,
    output:
`marks | integer
values: 88, 91, 79`,
    hints: [
      "Start as in 2.3: ALTER COLUMN marks TYPE INT.",
      "PostgreSQL will not convert text to a number on its own — you must tell it how, using USING.",
      "The cast is written marks::integer."
    ]
  },
  {
    unit: "Unit 2 — Changing a Table (ALTER)",
    num: "2.18",
    title: "Safely add a NOT NULL column to a table with data",
    question: "Add a <b>NOT NULL email</b> column to <b>students</b>, which already has rows. Adding NOT NULL directly would fail, because existing rows would have no value.",
    given:
`students — 2 rows (Amit, Riya),
no email column`,
    code:
`-- 1. add it as nullable
ALTER TABLE students ADD COLUMN email VARCHAR(100);

-- 2. fill every row
UPDATE students SET email = LOWER(name) || '@univ.edu';

-- 3. tighten to NOT NULL
ALTER TABLE students ALTER COLUMN email SET NOT NULL;`,
    output:
`email | character varying(100) | not null
every row filled — e.g.
amit@univ.edu, riya@univ.edu`,
    hints: [
      "Step 1 is exactly problem 2.2.",
      "Step 2 is an UPDATE with no WHERE, because every row needs a value. This is the rare case where omitting WHERE is correct.",
      "In PostgreSQL, || joins two pieces of text together. LOWER() converts to lowercase.",
      "Step 3 is exactly problem 2.5."
    ]
  },
  {
    unit: "Unit 3 — Emptying and Removing (TRUNCATE / DROP)",
    num: "3.1",
    title: "Empty the table, keep it",
    question: "Remove all rows but keep the table ready for new data.",
    given:
` roll_no | name  | branch | marks
---------+-------+--------+------
    1    | Amit  | CSE    |  88
    2    | Riya  | ECE    |  91
    3    | Arjun | CSE    |  79`,
    code: "TRUNCATE TABLE students;",
    output:
`SELECT COUNT(*) FROM students;
 count
-------
     0

The table still exists.`,
    hints: [
      "This empties the bucket without throwing it away.",
      "It takes no WHERE clause — it is all rows, every time."
    ]
  },
  {
    unit: "Unit 3 — Emptying and Removing (TRUNCATE / DROP)",
    num: "3.2",
    title: "Remove the table completely",
    question: "Delete the <b>students</b> table entirely.",
    given: "table students exists with 3 rows",
    code: "DROP TABLE students;",
    output:
`SELECT * FROM students;
ERROR: relation "students"
       does not exist`,
    hints: [
      "This throws the bucket away.",
      "Two words plus the table name."
    ]
  },
  {
    unit: "Unit 4 — Adding Rows (INSERT)",
    num: "4.1",
    title: "Named columns",
    question: "Insert one student — roll 1, Amit, CSE, 88 — listing the column names.",
    given: "0 rows",
    code:
`INSERT INTO students (roll_no, name, branch, marks)
VALUES (1, 'Amit', 'CSE', 88);`,
    output:
` roll_no | name | branch | marks
---------+------+--------+------
    1    | Amit | CSE    |  88`,
    hints: [
      "INSERT INTO students (columns) VALUES (values);",
      "Text needs single quotes. Numbers do not.",
      "This is the safest form — it still works if someone adds a column later."
    ]
  },
  {
    unit: "Unit 4 — Adding Rows (INSERT)",
    num: "4.2",
    title: "Without column names",
    question: "Insert the same student without listing the columns.",
    given: "0 rows",
    code:
`INSERT INTO students
VALUES (1, 'Amit', 'CSE', 88);`,
    output:
` roll_no | name | branch | marks
---------+------+--------+------
    1    | Amit | CSE    |  88`,
    hints: [
      "Drop the bracketed column list from 4.1.",
      "The values must then be in exactly the table's column order.",
      "Shorter, but it breaks the day a column is added."
    ]
  },
  {
    unit: "Unit 4 — Adding Rows (INSERT)",
    num: "4.3",
    title: "Many rows in one statement",
    question: "Insert three students at once, using a single statement.",
    given: "0 rows",
    code:
`INSERT INTO students (roll_no, name, branch, marks) VALUES
  (1, 'Amit',  'CSE', 88),
  (2, 'Riya',  'ECE', 91),
  (3, 'Arjun', 'CSE', 79);`,
    output:
` roll_no | name  | branch | marks
---------+-------+--------+------
    1    | Amit  | CSE    |  88
    2    | Riya  | ECE    |  91
    3    | Arjun | CSE    |  79`,
    hints: [
      "Same start as 4.1, with VALUES at the end of the first line.",
      "Each row is its own bracketed group.",
      "Commas between the groups. Only the last one gets the semicolon."
    ]
  },
  {
    unit: "Unit 4 — Adding Rows (INSERT)",
    num: "4.4",
    title: "Copy from another table",
    question: "Copy every student scoring 90 or above into a <b>toppers(roll_no, name, marks)</b> table.",
    given:
`students:
  1 | Amit  | CSE | 88
  2 | Riya  | ECE | 91
  3 | Arjun | CSE | 79

toppers: 0 rows`,
    code:
`INSERT INTO toppers (roll_no, name, marks)
SELECT roll_no, name, marks FROM students WHERE marks >= 90;`,
    output:
`toppers:
 roll_no | name | marks
---------+------+------
    2    | Riya |  91`,
    hints: [
      "Start as usual: INSERT INTO toppers (columns).",
      "There is no VALUES keyword here.",
      "A SELECT on the second line supplies the rows instead."
    ]
  },
  {
    unit: "Unit 4 — Adding Rows (INSERT)",
    num: "4.5",
    title: "See the inserted id",
    question: "Insert Sneha and get back the automatically generated <b>roll_no</b> in the same statement.",
    given:
`students(roll_no SERIAL PRIMARY KEY,
         name, branch, marks)
last generated roll_no was 0`,
    code:
`INSERT INTO students (name, branch, marks)
VALUES ('Sneha', 'CSE', 84)
RETURNING roll_no;`,
    output:
` roll_no
---------
       1
(1 row)

row inserted`,
    hints: [
      "A normal INSERT, but skip roll_no — the database generates it.",
      "Add one more clause on the second line to ask for the value back.",
      "That keyword is RETURNING, followed by the column you want."
    ]
  },
  {
    unit: "Unit 4 — Adding Rows (INSERT)",
    num: "4.6",
    title: "Skip a duplicate",
    question: "Insert (1, 'Amit'), but do nothing silently if <b>roll_no</b> 1 already exists — no error.",
    given:
` roll_no | name
---------+------
    1    | Amit`,
    code:
`INSERT INTO students (roll_no, name) VALUES (1, 'Amit')
ON CONFLICT (roll_no) DO NOTHING;`,
    output:
` roll_no | name
---------+------
    1    | Amit

INSERT 0 0    ← no error, no change`,
    hints: [
      "Write the normal INSERT on line one.",
      "Line two starts with ON CONFLICT, then the clashing column in brackets.",
      "End with DO NOTHING."
    ]
  },
  {
    unit: "Unit 4 — Adding Rows (INSERT)",
    num: "4.7",
    title: "Update on duplicate",
    question: "Insert (1, 'Amit Kumar'). If <b>roll_no</b> 1 already exists, update its name instead of failing.",
    given:
` roll_no | name
---------+------
    1    | Amit`,
    code:
`INSERT INTO students (roll_no, name) VALUES (1, 'Amit Kumar')
ON CONFLICT (roll_no) DO UPDATE SET name = EXCLUDED.name;`,
    output:
` roll_no | name
---------+------------
    1    | Amit Kumar`,
    hints: [
      "Same shape as 4.6, but end with DO UPDATE SET instead of DO NOTHING.",
      "To refer to the value you tried to insert, use the special table name EXCLUDED — so name = EXCLUDED.name.",
      "This pattern is called an \"upsert\" — update if present, insert if not."
    ]
  },
  {
    unit: "Unit 4 — Adding Rows (INSERT)",
    num: "4.8",
    title: "Skip columns",
    question: "Insert only <b>roll_no</b> and <b>name</b>. Leave <b>branch</b> and <b>marks</b> unset.",
    given: "table with 4 columns",
    code:
`INSERT INTO students (roll_no, name)
VALUES (4, 'Sneha');`,
    output:
` roll_no | name  | branch | marks
---------+-------+--------+------
    4    | Sneha | NULL   | NULL`,
    hints: [
      "Name only the two columns you are supplying.",
      "Omitted columns get NULL, or their DEFAULT if one is set.",
      "This fails if an omitted column is NOT NULL with no default.",
      "Quoting: number 88 (no quotes) · text 'Amit' (single quotes) · date '2026-08-14' · nothing NULL · apostrophe inside text 'O''Brien'"
    ]
  },
  {
    unit: "Unit 5 — Reading Rows (SELECT)",
    num: "5.1",
    title: "Show all rows",
    question: "Return every row in <b>students</b> without changing anything.",
    given:
` roll_no | name  | branch | marks
---------+-------+--------+------
    1    | Amit  | CSE    |  88
    2    | Riya  | ECE    |  91
    3    | Arjun | CSE    |  79`,
    code: "SELECT * FROM students;",
    output:
` roll_no | name  | branch | marks
---------+-------+--------+------
    1    | Amit  | CSE    |  88
    2    | Riya  | ECE    |  91
    3    | Arjun | CSE    |  79
(3 rows)

The table itself is unchanged.`,
    hints: [
      "Only two keywords.",
      "* means all columns.",
      "This is the only command in the workbook that changes nothing."
    ]
  },
  {
    unit: "Unit 6 — Changing Rows (UPDATE)",
    num: "6.1",
    title: "Fix one row",
    question: "Riya (roll_no 2) is in CSE, not ECE. Correct only her row.",
    given:
` roll_no | name  | branch | marks
---------+-------+--------+------
    1    | Amit  | CSE    |  88
    2    | Riya  | ECE    |  91   ← wrong
    3    | Arjun | CSE    |  79`,
    code:
`UPDATE students
SET branch = 'CSE'
WHERE roll_no = 2;`,
    output:
` roll_no | name  | branch | marks
---------+-------+--------+------
    1    | Amit  | CSE    |  88
    2    | Riya  | CSE    |  91
    3    | Arjun | CSE    |  79

UPDATE 1    ← must be 1, not 3`,
    hints: [
      "Three keywords in order: UPDATE, SET, WHERE.",
      "SET names the column and its new value.",
      "Without WHERE, this changes every student in the table. Write the WHERE part first, then go back and add the SET."
    ]
  },
  {
    unit: "Unit 7 — Removing Rows (DELETE)",
    num: "7.1",
    title: "Delete one row",
    question: "Arjun (roll_no 3) has left the university. Remove only his record.",
    given:
` roll_no | name  | branch | marks
---------+-------+--------+------
    1    | Amit  | CSE    |  88
    2    | Riya  | CSE    |  91
    3    | Arjun | CSE    |  79`,
    code:
`DELETE FROM students
WHERE roll_no = 3;`,
    output:
` roll_no | name | branch | marks
---------+------+--------+------
    1    | Amit | CSE    |  88
    2    | Riya | CSE    |  91

DELETE 1`,
    hints: [
      "DELETE FROM students — there is no column list, because you delete whole rows.",
      "A condition is required to target just one row.",
      "Use the primary key. Without WHERE, the whole table is emptied."
    ]
  },
  {
    unit: "Unit 8 — Protecting Multi-Step Work (TCL)",
    num: "8.1",
    title: "Transfer money atomically",
    question: "Transfer 5,000 from account A to account B. It must fully succeed or not happen at all — a crash halfway through must not lose the money.",
    given:
` acc_id | holder | balance
--------+--------+--------
   A    | Amit   | 10000
   B    | Riya   |  8000`,
    code:
`BEGIN;

UPDATE accounts SET balance = balance - 5000 WHERE acc_id = 'A';

UPDATE accounts SET balance = balance + 5000 WHERE acc_id = 'B';

COMMIT;`,
    output:
` acc_id | holder | balance
--------+--------+--------
   A    | Amit   |  5000
   B    | Riya   | 13000

SAVED PERMANENTLY`,
    hints: [
      "A transaction opens with BEGIN;.",
      "Two UPDATE statements go in the middle — one subtracts, one adds. Each needs its own WHERE.",
      "Write the new balance as arithmetic on the old one: balance - 5000.",
      "The closing command makes the change permanent and visible to everyone else."
    ]
  },
  {
    unit: "Unit 9 — Controlling Access (DCL)",
    num: "9.1",
    title: "Create a read-only user",
    question: "Create a user <b>faculty_user</b> who can only read the <b>students</b> table.",
    given: "faculty_user does not exist",
    code:
`CREATE USER faculty_user WITH PASSWORD 'StrongPass123!';

GRANT USAGE ON SCHEMA public TO faculty_user;

GRANT SELECT ON students TO faculty_user;`,
    output:
`   grantee    | privilege_type
--------------+---------------
 faculty_user | SELECT

(SELECT only — no INSERT, UPDATE or DELETE)`,
    hints: [
      "CREATE USER name WITH PASSWORD ' ... ';",
      "In PostgreSQL a user also needs USAGE on the schema before they can see anything inside it. Without this step the grant appears to work but the user still cannot read the table.",
      "The last line grants one privilege on one table: GRANT SELECT ON students TO ..."
    ]
  },
  {
    unit: "Unit 9 — Controlling Access (DCL)",
    num: "9.2",
    title: "Revoke delete access",
    question: "Take away <b>intern_user</b>'s permission to delete from <b>students</b>.",
    given:
`intern_user → DELETE on students
              = allowed`,
    code: "REVOKE DELETE ON students FROM intern_user;",
    output:
`intern_user → DELETE on students
              = blocked`,
    hints: [
      "The mirror image of a GRANT.",
      "The last keyword changes: you grant TO a user, but revoke FROM one."
    ]
  }
];

/* ---- PSQL Tool sessions ----
   Problems using psql backslash meta-commands (\c, \l, \d …) must run in
   pgAdmin's PSQL Tool, not the Query Tool. These render as a terminal. */
const PSQL={
  "0.1":{
    banner:'psql (18.0)\nType "help" for help.\n',
    steps:[
      {prompt:"postgres=#",cmd:"CREATE DATABASE university;",out:"CREATE DATABASE"},
      {prompt:"postgres=#",cmd:"\\c university",out:'You are now connected to database "university" as user "postgres".'},
      {prompt:"university=#",cmd:"SELECT current_database();",out:" current_database\n------------------\n university\n(1 row)"}
    ],
    endPrompt:"university=#"
  }
};

/* ---- live schema/design state per problem ----
   before  = table structure before the query
   after   = table structure after the query (diffed automatically:
             new column -> green, changed -> amber, removed -> red)
   note    = short caption about data / privilege changes            */
function col(n,t,b){return{n:n,t:t,b:b||[]};}
function tbl(name,cols){return{name:name,cols:cols};}
const _RN=function(){return col("roll_no","integer",["PK"]);};
const _NM=function(nn){return col("name","varchar(50)",nn?["NN"]:[]);};
const _BR=function(t,b){return col("branch",t||"varchar(20)",b||[]);};
const _MK=function(b){return col("marks","integer",b||[]);};
const stuBase=function(){return [tbl("students",[_RN(),_NM(true),_BR(),_MK()])];};

const SCHEMA={
  "0.1":null,
  "1.1":{before:[],after:[tbl("students",[_RN(),_NM(true),_BR(),_MK(["CHK"])])],note:"New table created — every column is new."},
  "2.1":{before:stuBase(),after:[tbl("students",[_RN(),_NM(true),_BR(),_MK(),col("email","varchar(100)",["UQ"])])]},
  "2.2":{before:stuBase(),after:[tbl("students",[_RN(),_NM(true),_BR(),_MK(),col("phone","varchar(15)")])]},
  "2.3":{before:stuBase(),after:[tbl("students",[_RN(),_NM(true),_BR("varchar(100)"),_MK()])]},
  "2.4":{before:stuBase(),after:[tbl("students",[_RN(),_NM(true),col("department","varchar(20)"),_MK()])],note:"<b>branch</b> renamed to <b>department</b>."},
  "2.5":{before:stuBase(),after:[tbl("students",[_RN(),_NM(true),_BR("varchar(20)",["NN"]),_MK()])]},
  "2.6":{before:stuBase(),after:[tbl("students",[_RN(),_NM(false),_BR(),_MK()])]},
  "2.7":{before:stuBase(),after:[tbl("students",[_RN(),_NM(true),_BR("varchar(20)",["DEF"]),_MK()])],note:"branch default set to 'CSE'."},
  "2.8":{before:[tbl("students",[_RN(),_NM(true),_BR(),_MK(),col("phone","varchar(15)")])],after:stuBase()},
  "2.9":{before:stuBase(),after:[tbl("students",[_RN(),_NM(true),_BR("varchar(20)",["DEF"]),_MK(),col("email","varchar(100)")])],note:"Two actions in one statement: email added, branch default set."},
  "2.10":{before:[tbl("courses",[col("course_id","integer"),col("title","varchar(50)")])],after:[tbl("courses",[col("course_id","integer",["PK"]),col("title","varchar(50)")])]},
  "2.11":{before:[tbl("students",[_RN(),_NM(true),_BR(),_MK(),col("email","varchar(100)")])],after:[tbl("students",[_RN(),_NM(true),_BR(),_MK(),col("email","varchar(100)",["UQ"])])]},
  "2.12":{before:stuBase(),after:[tbl("students",[_RN(),_NM(true),_BR(),_MK(["CHK"])])]},
  "2.13":{before:[tbl("students",[_RN(),_NM(true),_BR(),_MK(),col("branch_id","integer")]),tbl("branches",[col("id","integer",["PK"]),col("bname","varchar(50)")])],after:[tbl("students",[_RN(),_NM(true),_BR(),_MK(),col("branch_id","integer",["FK"])]),tbl("branches",[col("id","integer",["PK"]),col("bname","varchar(50)")])],note:"<b>branch_id</b> now references branches(id)."},
  "2.14":{before:[tbl("students",[_RN(),_NM(true),_BR(),_MK(["CHK"])])],after:stuBase(),note:"Check constraint chk_m removed from marks."},
  "2.15":{before:[tbl("students",[_RN(),_NM(true),_BR(),_MK(["CHK"])])],after:[tbl("students",[_RN(),_NM(true),_BR(),_MK(["CHK"])])],note:"Constraint renamed <b>chk_m → chk_marks</b> (structure unchanged)."},
  "2.16":{before:[tbl("students",[_RN(),_NM(true),_BR(),_MK()])],after:[tbl("learners",[_RN(),_NM(true),_BR(),_MK()])],note:"Table renamed <b>students → learners</b>."},
  "2.17":{before:[tbl("students",[_RN(),_NM(true),_BR(),col("marks","text")])],after:stuBase(),note:"marks converted text → integer."},
  "2.18":{before:stuBase(),after:[tbl("students",[_RN(),_NM(true),_BR(),_MK(),col("email","varchar(100)",["NN"])])],note:"Added nullable, filled every row, then set NOT NULL."},
  "3.1":{before:stuBase(),after:stuBase(),note:"Rows removed (3 → 0); table structure kept."},
  "3.2":{before:stuBase(),after:[],note:"Entire table dropped."},
  "4.1":{before:stuBase(),after:stuBase(),note:"1 row inserted (schema unchanged)."},
  "4.2":{before:stuBase(),after:stuBase(),note:"1 row inserted (schema unchanged)."},
  "4.3":{before:stuBase(),after:stuBase(),note:"3 rows inserted (schema unchanged)."},
  "4.4":{before:[tbl("students",[_RN(),_NM(true),_BR(),_MK()]),tbl("toppers",[col("roll_no","integer"),col("name","varchar(50)"),col("marks","integer")])],after:[tbl("students",[_RN(),_NM(true),_BR(),_MK()]),tbl("toppers",[col("roll_no","integer"),col("name","varchar(50)"),col("marks","integer")])],note:"Rows copied into toppers where marks ≥ 90."},
  "4.5":{before:[tbl("students",[col("roll_no","integer",["PK","SER"]),_NM(true),_BR(),_MK()])],after:[tbl("students",[col("roll_no","integer",["PK","SER"]),_NM(true),_BR(),_MK()])],note:"roll_no is SERIAL — generated automatically."},
  "4.6":{before:[tbl("students",[_RN(),_NM(true)])],after:[tbl("students",[_RN(),_NM(true)])],note:"Duplicate roll_no ignored (ON CONFLICT DO NOTHING)."},
  "4.7":{before:[tbl("students",[_RN(),_NM(true)])],after:[tbl("students",[_RN(),_NM(true)])],note:"Upsert — existing row updated in place."},
  "4.8":{before:stuBase(),after:stuBase(),note:"Row inserted; branch & marks left NULL."},
  "5.1":{before:stuBase(),after:stuBase(),note:"Read-only — nothing changes."},
  "6.1":{before:stuBase(),after:stuBase(),note:"1 row updated (schema unchanged)."},
  "7.1":{before:stuBase(),after:stuBase(),note:"1 row deleted (schema unchanged)."},
  "8.1":{before:[tbl("accounts",[col("acc_id","varchar(4)",["PK"]),col("holder","varchar(50)"),col("balance","integer")])],after:[tbl("accounts",[col("acc_id","varchar(4)",["PK"]),col("holder","varchar(50)"),col("balance","integer")])],note:"Two balances updated atomically inside a transaction."},
  "9.1":{before:stuBase(),after:stuBase(),note:"Privilege change — <b>faculty_user</b> granted SELECT on students."},
  "9.2":{before:stuBase(),after:stuBase(),note:"Privilege change — DELETE revoked from intern_user."}
};

/* =====================================================================
   CHAPTER 2 — SQL Functions in PostgreSQL
   Merged from the "SQL Functions in PostgreSQL" reference handbook.
   Appends new units (10–16) to the deck defined in data.js.
   Each code line carries its expected result inline (side by side).
   ===================================================================== */

/* employees demo table (used by every problem in this chapter) */
const _empCols=()=>[
  col("emp_id","integer",["PK","SER"]),
  col("name","varchar(100)"),
  col("email","varchar(100)"),
  col("salary","numeric(14,4)"),
  col("join_date","timestamp"),
  col("phone","varchar(15)"),
  col("city","varchar(50)")
];
const _empTbl=()=>[tbl("employees",_empCols())];

/* the raw sample data as a psql result grid (reused in a few outputs) */
const EMP_GRID=
` emp_id |     name      |       email        |   salary   |      join_date      |   phone    |   city
--------+---------------+--------------------+------------+---------------------+------------+-----------
      1 | john DOE      | john@gmail.com     | 45678.6789 | 2026-05-29 14:43:22 | NULL       | Bengaluru
      2 | asha rao      | asha.rao@yahoo.com | 38210.5000 | 2025-11-02 09:12:00 | 9912345670 | Hyderabad
      3 |   Ravi Kumar  | ravi@outlook.com   | 52300.1250 | 2024-07-15 18:05:44 | 9876543210 | Chennai
      4 | JANE smith    | jane@gmail.com     | 61999.9999 | 2026-01-09 11:30:10 | NULL       | Mumbai
      5 | JAKE Miller   | jake@company.co.in | 29500.0000 | 2025-03-21 08:00:00 | 9001122334 | Pune
(5 rows)`;

const FUNCTIONS_DECK=[
/* ---------------- Unit 10 — Setup ---------------- */
{
  unit:"Unit 10 — Setup (SQL Functions)",num:"10.1",title:"Create the demo table",
  question:"Create the messy <b>employees</b> export and load 5 sample rows — the data every function in this chapter cleans.",
  given:"no employees table yet.",
  code:
`CREATE TABLE employees (
    emp_id     SERIAL PRIMARY KEY,   -- auto-incrementing id
    name       VARCHAR(100),         -- messy casing + stray spaces
    email      VARCHAR(100),         -- needs domain extraction
    salary     NUMERIC(14, 4),       -- too many decimal places
    join_date  TIMESTAMP,            -- machine-readable timestamp
    phone      VARCHAR(15),          -- sometimes NULL (missing data)
    city       VARCHAR(50)
);

INSERT INTO employees (name, email, salary, join_date, phone, city) VALUES
    ('john DOE',      'john@gmail.com',     45678.6789, '2026-05-29 14:43:22', NULL,         'Bengaluru'),
    ('asha rao',      'asha.rao@yahoo.com', 38210.5000, '2025-11-02 09:12:00', '9912345670', 'Hyderabad'),
    ('  Ravi Kumar ', 'ravi@outlook.com',   52300.1250, '2024-07-15 18:05:44', '9876543210', 'Chennai'),
    ('JANE smith',    'jane@gmail.com',     61999.9999, '2026-01-09 11:30:10', NULL,         'Mumbai'),
    ('JAKE Miller',   'jake@company.co.in', 29500.0000, '2025-03-21 08:00:00', '9001122334', 'Pune');

SELECT * FROM employees;   -- 5 deliberately messy rows (see Data Output)`,
  output:EMP_GRID,
  hints:[
    "Deliberately messy: mixed casing, stray spaces, 4-decimal salaries, machine timestamps and NULL phones.",
    "Run this once, then every query in this chapter works standalone.",
    "salary is NUMERIC(14,4); join_date is a TIMESTAMP; phone can be NULL."
  ]
},

/* ---------------- Unit 11 — Numeric ---------------- */
{
  unit:"Unit 11 — Numeric Functions",num:"11.1",title:"ROUND(value, precision)",
  question:"Round a number mathematically to N decimal places. Use for money display, percentages, report-ready numbers.",
  given:"salary has 4 decimals: 45678.6789",
  code:
`SELECT ROUND(45678.6789, 2);        -- 45678.68
SELECT ROUND(45678.6789);           -- 45679
SELECT ROUND(45.5), ROUND(45.4);    -- 46 | 45

SELECT name,
       salary            AS raw_salary,   -- 45678.6789
       ROUND(salary, 2)  AS clean_salary  -- 45678.68
FROM employees;`,
  output:
`ROUND(45678.6789, 2)      → 45678.68
ROUND(45678.6789)         → 45679
ROUND(45.5) | ROUND(45.4) → 46 | 45

    name     | raw_salary | clean_salary
-------------+------------+--------------
 john DOE    | 45678.6789 |     45678.68
 asha rao    | 38210.5000 |     38210.50
 Ravi Kumar  | 52300.1250 |     52300.13
 JANE smith  | 61999.9999 |     62000.00
 JAKE Miller | 29500.0000 |     29500.00`,
  hints:[
    "The 2nd argument controls how many decimals survive.",
    "Negative precision rounds to the LEFT of the point: ROUND(45678.6789, -3) → 46000.",
    "ROUND is the fair, nearest-value default for maths and reporting."
  ]
},
{
  unit:"Unit 11 — Numeric Functions",num:"11.2",title:"TRUNC(value, precision)",
  question:"Cut the extra digits — never round up. Use in banking/finance, where showing more than the true value is wrong.",
  given:"value: 45.678",
  code:
`SELECT TRUNC(45.678, 2);    -- 45.67   (the 8 is dropped, not rounded)
SELECT TRUNC(45.678);       -- 45      (all decimals removed)
SELECT TRUNC(-45.678, 2);   -- -45.67  (truncates toward zero)`,
  output:
`TRUNC(45.678, 2)   → 45.67
TRUNC(45.678)      → 45
TRUNC(-45.678, 2)  → -45.67   ← toward zero, so UP for negatives`,
  hints:[
    "TRUNC cuts; ROUND rounds. On 45.678: TRUNC → 45.67, ROUND → 45.68.",
    "Banks prefer TRUNC so a balance is never shown as more than it truly is.",
    "FLOOR also drops decimals, but only down to a whole number."
  ]
},
{
  unit:"Unit 11 — Numeric Functions",num:"11.3",title:"ROUND vs TRUNC",
  question:"The classic comparison — nearest value vs cutting down.",
  given:"value: 45.678",
  code:
`SELECT 45.678           AS actual_value,   -- 45.678
       ROUND(45.678, 2) AS rounded,        -- 45.68
       TRUNC(45.678, 2) AS truncated;      -- 45.67`,
  output:
` actual_value | rounded | truncated
--------------+---------+-----------
       45.678 |   45.68 |     45.67`,
  hints:[
    "ROUND goes up to the nearest; TRUNC cuts down.",
    "TRUNC avoids over-crediting the customer — the finance default.",
    "For a fixed scale in the schema, cast instead: value::NUMERIC(10,2)."
  ]
},
{
  unit:"Unit 11 — Numeric Functions",num:"11.4",title:"FLOOR / CEIL / CEILING",
  question:"Fixed-direction rounding to whole numbers. FLOOR always down, CEIL always up.",
  given:"value: 45.678",
  code:
`SELECT FLOOR(45.678);                   -- 45   (always down)
SELECT CEIL(45.678);                    -- 46   (always up)
SELECT CEILING(45.678);                 -- 46   (identical to CEIL)
SELECT FLOOR(-45.678), CEIL(-45.678);   -- -46 | -45   (direction, not size)`,
  output:
`FLOOR(45.678)              → 45
CEIL(45.678)               → 46
CEILING(45.678)            → 46
FLOOR(-45.678) | CEIL(...) → -46 | -45`,
  hints:[
    "CEILING is just a longer spelling of CEIL.",
    "For negatives, FLOOR goes more negative, CEIL goes toward zero.",
    "Whole numbers only — no precision argument."
  ]
},
{
  unit:"Unit 11 — Numeric Functions",num:"11.5",title:"Integer division, DIV & MOD",
  question:"Dividing two INTEGERS truncates — a silent source of wrong maths.",
  given:"7 divided by 2",
  code:
`SELECT 7 / 2;        -- 3     (integer division truncates!)
SELECT 7 / 2.0;      -- 3.5   (one decimal operand fixes it)
SELECT DIV(7, 2);    -- 3     (explicit integer quotient)
SELECT MOD(7, 2);    -- 1     (remainder)`,
  output:
`7 / 2      → 3     ← integer division truncates!
7 / 2.0    → 3.5   ← one decimal operand fixes it
DIV(7, 2)  → 3
MOD(7, 2)  → 1`,
  hints:[
    "If both operands are integers, PostgreSQL throws away the fraction.",
    "Make one operand NUMERIC (e.g. 2.0) to get a real quotient.",
    "MOD gives the remainder; DIV gives the explicit integer quotient."
  ]
},
{
  unit:"Unit 11 — Numeric Functions",num:"11.6",title:"POWER(x, y)",
  question:"Raise x to the power of y — exponents inside SQL. Use for compound growth, scientific maths, areas.",
  given:"—",
  code:
`SELECT POWER(5, 2);     -- 25     (5 squared)
SELECT POWER(2, 10);    -- 1024
SELECT POWER(9, 0.5);   -- 3      (square root via a 0.5 power)`,
  output:
`POWER(5, 2)   → 25
POWER(2, 10)  → 1024
POWER(9, 0.5) → 3     ← square root`,
  hints:[
    "A 0.5 power is a square root; 1/3 power is a cube root.",
    "SQRT(x) is the dedicated square-root function.",
    "Useful for compound-interest and dimension calculations."
  ]
},
{
  unit:"Unit 11 — Numeric Functions",num:"11.7",title:"ABS(x)",
  question:"Absolute value — the distance from zero, sign removed. Use for profit/loss magnitude, variance, distance.",
  given:"—",
  code:
`SELECT ABS(-250);     -- 250
SELECT ABS(250);      -- 250
SELECT ABS(-45.75);   -- 45.75`,
  output:
`ABS(-250)   → 250
ABS(250)    → 250
ABS(-45.75) → 45.75`,
  hints:[
    "Returns the size of a value regardless of sign.",
    "Ideal for distances, variances, and how big a profit or loss is."
  ]
},

/* ---------------- Unit 12 — Date & Time ---------------- */
{
  unit:"Unit 12 — Date & Time Functions",num:"12.1",title:"NOW / CURRENT_DATE / CURRENT_TIME",
  question:"The current date and time. Use for logging, auditing, stamping transactions as they happen.",
  given:"—",
  code:
`SELECT NOW();            -- 2026-05-29 14:45:10+05:30
SELECT CURRENT_DATE;     -- 2026-05-29
SELECT CURRENT_TIME;     -- 14:45:10+05:30`,
  output:
`NOW()          → 2026-05-29 14:45:10+05:30
CURRENT_DATE   → 2026-05-29
CURRENT_TIME   → 14:45:10+05:30`,
  hints:[
    "NOW() returns a full timestamp WITH time zone.",
    "CURRENT_DATE / CURRENT_TIME give just the date or just the time."
  ]
},
{
  unit:"Unit 12 — Date & Time Functions",num:"12.2",title:"EXTRACT(field FROM source)",
  question:"Pull one component out of a date/timestamp — returns a number.",
  given:"join_date timestamps",
  code:
`SELECT EXTRACT(YEAR    FROM NOW());   -- 2026
SELECT EXTRACT(MONTH   FROM NOW());   -- 5
SELECT EXTRACT(QUARTER FROM NOW());   -- 2
SELECT EXTRACT(DOW     FROM NOW());   -- 5  (0 = Sunday)

SELECT name,
       EXTRACT(YEAR  FROM join_date) AS join_year,   -- 2026, 2025, 2024 ...
       EXTRACT(MONTH FROM join_date) AS join_month   -- 5, 11, 7 ...
FROM employees;`,
  output:
`EXTRACT(YEAR  FROM NOW()) → 2026
EXTRACT(MONTH FROM NOW()) → 5

    name     | join_year | join_month
-------------+-----------+------------
 john DOE    |      2026 |          5
 asha rao    |      2025 |         11
 Ravi Kumar  |      2024 |          7
 JANE smith  |      2026 |          1
 JAKE Miller |      2025 |          3`,
  hints:[
    "Fields: YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, DOW, QUARTER, and more.",
    "EXTRACT returns a single number, not a date."
  ]
},
{
  unit:"Unit 12 — Date & Time Functions",num:"12.3",title:"INTERVAL — date arithmetic",
  question:"Add or subtract chunks of time. Use for trial/subscription expiry, delivery estimates, reminders.",
  given:"join_date timestamps",
  code:
`SELECT NOW() + INTERVAL '7 days';    -- one week from now
SELECT NOW() - INTERVAL '1 month';   -- one month ago
SELECT NOW() + INTERVAL '2 years 3 months';

-- A 30-day trial from the join date:
SELECT name, join_date,
       join_date + INTERVAL '30 days' AS trial_expiry   -- +30 days
FROM employees;

-- Joined in the last 12 months:
SELECT name, join_date
FROM employees
WHERE join_date >= NOW() - INTERVAL '12 months';        -- recent joiners`,
  output:
`NOW() + INTERVAL '7 days'   → one week from now
NOW() - INTERVAL '1 month'  → one month ago

    name     |      join_date      |    trial_expiry
-------------+---------------------+---------------------
 john DOE    | 2026-05-29 14:43:22 | 2026-06-28 14:43:22
 asha rao    | 2025-11-02 09:12:00 | 2025-12-02 09:12:00`,
  hints:[
    "Combine units freely: INTERVAL '2 years 3 months'.",
    "Add/subtract an INTERVAL to any date or timestamp.",
    "Great for WHERE filters like 'the last 12 months'."
  ]
},
{
  unit:"Unit 12 — Date & Time Functions",num:"12.4",title:"DATE_TRUNC(unit, source)",
  question:"Snap a timestamp down to the start of a unit, but keep a full timestamp. This powers monthly reporting.",
  given:"join_date timestamps",
  code:
`SELECT DATE_TRUNC('month', NOW());   -- 2026-05-01 00:00:00
SELECT DATE_TRUNC('year',  NOW());   -- 2026-01-01 00:00:00

-- Group every row into its month bucket:
SELECT DATE_TRUNC('month', join_date) AS join_month,   -- first of the month
       COUNT(*)                       AS joiners        -- 1 each
FROM employees
GROUP BY DATE_TRUNC('month', join_date)
ORDER BY join_month;`,
  output:
`DATE_TRUNC('month', NOW()) → 2026-05-01 00:00:00

     join_month      | joiners
---------------------+---------
 2024-07-01 00:00:00 |       1
 2025-03-01 00:00:00 |       1
 2025-11-01 00:00:00 |       1
 2026-01-01 00:00:00 |       1
 2026-05-01 00:00:00 |       1`,
  hints:[
    "Units: 'year', 'quarter', 'month', 'day', 'hour', and more.",
    "It snaps down but returns a full timestamp — perfect for GROUP BY month."
  ]
},
{
  unit:"Unit 12 — Date & Time Functions",num:"12.5",title:"EXTRACT vs DATE_TRUNC",
  question:"EXTRACT returns one number; DATE_TRUNC returns a full timestamp rounded down.",
  given:"—",
  code:
`SELECT EXTRACT(MONTH FROM NOW())  AS extracted,   -- 5
       DATE_TRUNC('month', NOW())  AS truncated;   -- 2026-05-01 00:00:00`,
  output:
` extracted |      truncated
-----------+---------------------
         5 | 2026-05-01 00:00:00`,
  hints:[
    "EXTRACT → a number (5). DATE_TRUNC → a timestamp (2026-05-01 00:00:00).",
    "Use EXTRACT to compare/label a part; DATE_TRUNC to bucket rows."
  ]
},
{
  unit:"Unit 12 — Date & Time Functions",num:"12.6",title:"TO_CHAR(value, format)",
  question:"Format a date (or number) as readable text — machine to human.",
  given:"join_date timestamps",
  code:
`SELECT TO_CHAR(NOW(), 'DD Mon YYYY');       -- 29 May 2026
SELECT TO_CHAR(NOW(), 'DD/MM/YYYY');        -- 29/05/2026
SELECT TO_CHAR(45678.6789, '999G999D99');   -- 45,678.68  (numbers too)

SELECT name,
       TO_CHAR(join_date, 'Mon YYYY')    AS joined_month,  -- May 2026
       TO_CHAR(join_date, 'DD Mon YYYY') AS joined_on      -- 29 May 2026
FROM employees;`,
  output:
`TO_CHAR(NOW(), 'DD Mon YYYY')     → 29 May 2026
TO_CHAR(45678.6789,'999G999D99')  → 45,678.68

    name     | joined_month |  joined_on
-------------+--------------+-------------
 john DOE    | May 2026     | 29 May 2026
 asha rao    | Nov 2025     | 02 Nov 2025
 Ravi Kumar  | Jul 2024     | 15 Jul 2024`,
  hints:[
    "Patterns: DD day, Mon short month, Month full month, YYYY year, HH24:MI time.",
    "TO_CHAR also formats numbers (G = group sep, D = decimal point).",
    "The result is TEXT — use it as the last step before display only."
  ]
},

/* ---------------- Unit 13 — String ---------------- */
{
  unit:"Unit 13 — String Functions",num:"13.1",title:"UPPER / LOWER / INITCAP",
  question:"Case normalisation — one consistent case everywhere. Use for login/search standardisation and reliable grouping.",
  given:"name: 'john DOE'",
  code:
`SELECT UPPER('john doe');    -- JOHN DOE
SELECT LOWER('ADMIN');       -- admin
SELECT INITCAP('john doe');  -- John Doe  (title case)

SELECT name,
       UPPER(name)   AS upper_name,   -- JOHN DOE
       INITCAP(name) AS title_name    -- John Doe
FROM employees;

-- Case-insensitive search done properly:
SELECT * FROM employees WHERE LOWER(name) = LOWER('JOHN doe');  -- 1 row`,
  output:
`UPPER('john doe')   → JOHN DOE
LOWER('ADMIN')      → admin
INITCAP('john doe') → John Doe

    name     | upper_name  | title_name
-------------+-------------+------------
 john DOE    | JOHN DOE    | John Doe
 asha rao    | ASHA RAO    | Asha Rao
 JAKE Miller | JAKE MILLER | Jake Miller`,
  hints:[
    "Normalise both sides for case-insensitive matching: LOWER(a) = LOWER(b).",
    "INITCAP gives Title Case; it also handles O'Brien correctly."
  ]
},
{
  unit:"Unit 13 — String Functions",num:"13.2",title:"LENGTH(text)",
  question:"Count characters in a string. Use for password/input validation, mobile-number checks, field limits.",
  given:"phone values, some NULL",
  code:
`SELECT LENGTH('PostgreSQL');        -- 10
SELECT LENGTH('   PostgreSQL   ');  -- 16  (spaces count!)

-- Find phone numbers that are not exactly 10 digits (bad data):
SELECT name, phone, LENGTH(phone) AS digits
FROM employees
WHERE LENGTH(phone) <> 10;   -- 0 rows (NULL phones are skipped)`,
  output:
`LENGTH('PostgreSQL')       → 10
LENGTH('   PostgreSQL   ') → 16   ← spaces count!

(no rows — every present phone is exactly 10 digits;
 NULL phones are skipped because LENGTH(NULL) is NULL)`,
  hints:[
    "Spaces and punctuation count as characters.",
    "LENGTH(NULL) is NULL, so NULL rows drop out of the WHERE test.",
    "CHAR_LENGTH is a SQL-standard alias; OCTET_LENGTH counts bytes."
  ]
},
{
  unit:"Unit 13 — String Functions",num:"13.3",title:"CONCAT and the || operator",
  question:"Join pieces of text. The catch: CONCAT ignores NULLs; || returns NULL if any part is NULL.",
  given:"—",
  code:
`SELECT CONCAT('John', ' ', 'Doe');   -- John Doe
SELECT 'John' || ' ' || 'Doe';       -- John Doe
SELECT CONCAT('John', NULL, 'Doe');  -- JohnDoe  (NULL skipped)
SELECT 'John' || NULL || 'Doe';      -- NULL     (|| poisons it)

SELECT CONCAT(INITCAP(name), ' — ', city) AS display_label   -- John Doe — Bengaluru
FROM employees;`,
  output:
`CONCAT('John',' ','Doe')  → John Doe
'John' || ' ' || 'Doe'    → John Doe
CONCAT('John',NULL,'Doe') → JohnDoe   ← NULL skipped
'John' || NULL || 'Doe'   → NULL      ← || poisons the whole result

     display_label
-----------------------
 John Doe — Bengaluru
 Asha Rao — Hyderabad`,
  hints:[
    "CONCAT is NULL-safe; || is not.",
    "Use CONCAT_WS(sep, ...) to join with a separator and skip NULLs cleanly."
  ]
},
{
  unit:"Unit 13 — String Functions",num:"13.4",title:"SUBSTRING(string FROM start FOR length)",
  question:"Slice out a portion of text. Positions start at 1, not 0. Use for IDs, product codes, parsing.",
  given:"code: 'EMP2026'",
  code:
`SELECT SUBSTRING('EMP2026' FROM 1 FOR 3);   -- EMP
SELECT SUBSTRING('EMP2026' FROM 4 FOR 4);   -- 2026
SELECT SUBSTRING('EMP2026' FROM 4);         -- 2026  (to the end)
SELECT SUBSTR('PostgreSQL', 1, 4);          -- Post  (short form)`,
  output:
`SUBSTRING('EMP2026' FROM 1 FOR 3) → EMP
SUBSTRING('EMP2026' FROM 4 FOR 4) → 2026
SUBSTRING('EMP2026' FROM 4)       → 2026
SUBSTR('PostgreSQL', 1, 4)        → Post`,
  hints:[
    "Positions are 1-based.",
    "Omit FOR length to slice to the end.",
    "LEFT(s,n) and RIGHT(s,n) are handy shortcuts."
  ]
},
{
  unit:"Unit 13 — String Functions",num:"13.5",title:"TRIM / LTRIM / RTRIM / BTRIM",
  question:"Remove leading and trailing spaces — messy form input, cleaned.",
  given:"name: '  Ravi Kumar '",
  code:
`SELECT TRIM('   PostgreSQL   ');          -- 'PostgreSQL'
SELECT LTRIM('   PostgreSQL');            -- 'PostgreSQL'  (left only)
SELECT RTRIM('PostgreSQL   ');            -- 'PostgreSQL'  (right only)
SELECT TRIM(BOTH 'x' FROM 'xxxDATAxxx');  -- 'DATA'  (any character)

SELECT name,
       LENGTH(name)       AS raw_len,       -- 13 for '  Ravi Kumar '
       LENGTH(TRIM(name)) AS trimmed_len    -- 10
FROM employees;`,
  output:
`TRIM('   PostgreSQL   ')         → 'PostgreSQL'
TRIM(BOTH 'x' FROM 'xxxDATAxxx') → 'DATA'

    name     | raw_len | trimmed_len
-------------+---------+-------------
   Ravi Kumar|      13 |          10
 john DOE    |       8 |           8`,
  hints:[
    "TRIM strips both sides; LTRIM/RTRIM one side.",
    "TRIM(BOTH 'x' FROM ...) removes any character, not just spaces.",
    "LPAD/RPAD do the opposite — pad a string to a fixed width."
  ]
},
{
  unit:"Unit 13 — String Functions",num:"13.6",title:"REPLACE(source, old, new)",
  question:"Find and replace a substring everywhere it occurs. Use for rebranding, bulk cleanup, stripping characters.",
  given:"phone numbers",
  code:
`SELECT REPLACE('PostgreSQL', 'SQL', 'Database'); -- PostgreDatabase
SELECT REPLACE('99-88-77', '-', '');             -- 998877  (remove chars)

-- Mask the middle of each phone number:
SELECT name,
       REPLACE(phone, SUBSTRING(phone FROM 4 FOR 3), 'XXX') AS masked_phone  -- 991XXX5670
FROM employees
WHERE phone IS NOT NULL;`,
  output:
`REPLACE('PostgreSQL','SQL','Database') → PostgreDatabase
REPLACE('99-88-77','-','')             → 998877

    name     | masked_phone
-------------+--------------
 asha rao    | 991XXX5670
 Ravi Kumar  | 987XXX3210
 JAKE Miller | 900XXX2334`,
  hints:[
    "REPLACE changes EVERY occurrence.",
    "TRANSLATE maps character-by-character; REPLACE works on whole substrings."
  ]
},
{
  unit:"Unit 13 — String Functions",num:"13.7",title:"LIKE vs ILIKE — pattern matching",
  question:"LIKE is case-sensitive; ILIKE is case-insensitive. % = any characters, _ = exactly one character.",
  given:"names: John, asha, Ravi, JANE, JAKE",
  code:
`SELECT * FROM employees WHERE name LIKE  'J%';   -- JANE, JAKE  (not 'john')
SELECT * FROM employees WHERE name ILIKE 'j%';   -- john, JANE, JAKE

SELECT 'Jan'  LIKE 'J_n' AS jan_matches,    -- true
       'Joan' LIKE 'J_n' AS joan_matches;   -- false  (two chars in between)`,
  output:
`name LIKE  'J%'  → JANE smith, JAKE Miller
name ILIKE 'j%'  → john DOE, JANE smith, JAKE Miller

 jan_matches | joan_matches
-------------+--------------
 t           | f            ← _ matches exactly ONE character`,
  hints:[
    "% matches any number of characters; _ matches exactly one.",
    "ILIKE is PostgreSQL-specific and case-insensitive.",
    "Use NOT LIKE / NOT ILIKE to negate."
  ]
},
{
  unit:"Unit 13 — String Functions",num:"13.8",title:"SPLIT_PART(string, delimiter, position)",
  question:"Break a string on a delimiter and pick one piece (1-based). Use for email parsing, CSV, composite codes.",
  given:"email: 'john@gmail.com'",
  code:
`SELECT SPLIT_PART('john@gmail.com', '@', 1);  -- john       (username)
SELECT SPLIT_PART('john@gmail.com', '@', 2);  -- gmail.com  (domain)

-- Domain of every email, counted:
SELECT SPLIT_PART(email, '@', 2) AS domain,   -- gmail.com, yahoo.com ...
       COUNT(*)                  AS users     -- 2, 1, 1, 1
FROM employees
GROUP BY SPLIT_PART(email, '@', 2)
ORDER BY users DESC;`,
  output:
`SPLIT_PART('john@gmail.com','@',1) → john
SPLIT_PART('john@gmail.com','@',2) → gmail.com

    domain     | users
---------------+-------
 gmail.com     |     2
 yahoo.com     |     1
 outlook.com   |     1
 company.co.in |     1`,
  hints:[
    "Position is 1-based; a negative position counts from the end.",
    "Perfect for pulling the username or domain out of an email."
  ]
},
{
  unit:"Unit 13 — String Functions",num:"13.9",title:"LEFT / RIGHT / LPAD / RPAD",
  question:"Take a slice from either end, or pad a string to a fixed width (invoice numbers, aligned codes).",
  given:"—",
  code:
`SELECT LEFT('PostgreSQL', 4);    -- Post
SELECT RIGHT('PostgreSQL', 3);   -- SQL
SELECT LEFT('PostgreSQL', -3);   -- Postgre  (negative = drop last 3)
SELECT LPAD('7', 3, '0');        -- 007  (pad left)
SELECT RPAD('7', 3, '0');        -- 700  (pad right)
SELECT LPAD('42', 8, '.');       -- ......42`,
  output:
`LEFT('PostgreSQL', 4)   → Post
RIGHT('PostgreSQL', 3)  → SQL
LEFT('PostgreSQL', -3)  → Postgre   ← negative drops from the end
LPAD('7', 3, '0')       → 007
RPAD('7', 3, '0')       → 700
LPAD('42', 8, '.')      → ......42`,
  hints:[
    "Negative length on LEFT/RIGHT drops characters from the far end.",
    "LPAD also TRUNCATES if the target width is smaller than the string.",
    "LPAD(id::TEXT, 5, '0') is the classic zero-padded id."
  ]
},
{
  unit:"Unit 13 — String Functions",num:"13.10",title:"TRANSLATE / REVERSE / REPEAT",
  question:"Character-by-character mapping, reversing, and repeating — the rest of the everyday text toolbox.",
  given:"—",
  code:
`SELECT TRANSLATE('12-34-56', '-', '/');    -- 12/34/56  (char map)
SELECT TRANSLATE('(999) 123', '() ', '');  -- 999123    (delete chars)
SELECT REVERSE('PostgreSQL');              -- LQSergtsoP
SELECT REPEAT('-', 20);                    -- --------------------`,
  output:
`TRANSLATE('12-34-56','-','/')   → 12/34/56
TRANSLATE('(999) 123','() ','') → 999123
REVERSE('PostgreSQL')           → LQSergtsoP
REPEAT('-', 20)                 → --------------------`,
  hints:[
    "TRANSLATE maps each source char to the matching target char.",
    "A shorter 'to' set than 'from' deletes the extra characters.",
    "REPEAT is handy for separators and test data."
  ]
},

/* ---------------- Unit 14 — NULL ---------------- */
{
  unit:"Unit 14 — NULL Handling",num:"14.1",title:"Understanding NULL",
  question:"NULL is not 0, not '' — it means missing/unknown. Because it is unknown, normal operators fail on it.",
  given:"—",
  code:
`SELECT NULL = NULL   AS equals_test;  -- NULL  (not true! unknown = unknown)
SELECT NULL = 0      AS zero_test;    -- NULL
SELECT NULL = ''     AS empty_test;   -- NULL
SELECT 100 + NULL    AS maths_test;   -- NULL  (poisons arithmetic)
SELECT 'Hi' || NULL  AS concat_test;  -- NULL`,
  output:
`NULL = NULL   → NULL   ← unknown = unknown is still unknown
NULL = 0      → NULL
NULL = ''     → NULL
100 + NULL    → NULL   ← NULL poisons arithmetic
'Hi' || NULL  → NULL`,
  hints:[
    "Comparing anything to NULL with = gives NULL, never true/false.",
    "Any arithmetic or || touching NULL becomes NULL.",
    "Test for NULL only with IS NULL / IS NOT NULL."
  ]
},
{
  unit:"Unit 14 — NULL Handling",num:"14.2",title:"COALESCE(a, b, c, ...)",
  question:"Return the first non-NULL argument. Gracefully fills gaps.",
  given:"phone is NULL for John and Jane",
  code:
`SELECT COALESCE(NULL, 'Not Available');          -- Not Available
SELECT COALESCE(NULL, NULL, 'third', 'fourth');  -- third  (first non-NULL wins)
SELECT COALESCE(NULL, 0) + 100;                  -- 100    (protects maths)

SELECT name, COALESCE(phone, 'Not Available') AS contact  -- Not Available / 9912345670
FROM employees;`,
  output:
`COALESCE(NULL,'Not Available')       → Not Available
COALESCE(NULL,NULL,'third','fourth') → third
COALESCE(NULL, 0) + 100              → 100

    name     |    contact
-------------+---------------
 john DOE    | Not Available
 asha rao    | 9912345670
 JANE smith  | Not Available`,
  hints:[
    "The first non-NULL argument wins; it short-circuits there.",
    "All arguments must be of compatible types.",
    "Wrap risky expressions to keep NULL out of arithmetic."
  ]
},
{
  unit:"Unit 14 — NULL Handling",num:"14.3",title:"IS NULL / IS NOT NULL",
  question:"The only correct way to test for NULL. Never use = or <>.",
  given:"phone NULL for 2 of 5 rows",
  code:
`-- WRONG (0 rows, silently): SELECT * FROM employees WHERE phone = NULL;
SELECT * FROM employees WHERE phone IS NULL;      -- John, Jane

SELECT COUNT(*)              AS total_rows,       -- 5
       COUNT(phone)          AS phones_present,    -- 3  (COUNT skips NULL)
       COUNT(*)-COUNT(phone) AS phones_missing     -- 2
FROM employees;`,
  output:
` total_rows | phones_present | phones_missing
------------+----------------+----------------
          5 |              3 |              2`,
  hints:[
    "phone = NULL never matches anything — use IS NULL.",
    "COUNT(column) skips NULLs; COUNT(*) counts every row.",
    "COUNT(*) - COUNT(col) is a quick completeness check."
  ]
},
{
  unit:"Unit 14 — NULL Handling",num:"14.4",title:"NULLIF(a, b)",
  question:"Return NULL if a = b, otherwise a. Classic use: guard against divide-by-zero.",
  given:"—",
  code:
`SELECT NULLIF(10, 10);         -- NULL  (the two values are equal)
SELECT NULLIF(10, 5);          -- 10    (not equal → a)
SELECT 100 / NULLIF(0, 0);     -- NULL  (safe: no divide-by-zero error)
SELECT NULLIF('N/A', 'N/A');   -- NULL  (clean junk placeholders)`,
  output:
`NULLIF(10, 10)      → NULL
NULLIF(10, 5)       → 10
100 / NULLIF(0, 0)  → NULL   ← no division-by-zero error
NULLIF('N/A','N/A') → NULL`,
  hints:[
    "NULLIF turns an equal pair into NULL.",
    "NULLIF(divisor, 0) converts a zero divisor into a safe NULL.",
    "NULLIF compares with '=', so it is CASE-SENSITIVE on text."
  ]
},
{
  unit:"Unit 14 — NULL Handling",num:"14.5",title:"COALESCE + NULLIF — safe division",
  question:"Mirror images: NULLIF makes the NULL, COALESCE catches it. The most-used NULL idiom in production.",
  given:"order_count could be 0",
  code:
`-- Inside-out: NULLIF turns 0 into NULL so the division returns NULL
-- instead of crashing; COALESCE then turns that NULL into 0.
SELECT COALESCE(total_sales / NULLIF(order_count, 0), 0) AS avg_order_value  -- 0
FROM (SELECT 5000 AS total_sales, 0 AS order_count) AS demo;`,
  output:
` avg_order_value
-----------------
               0   ← no error: NULLIF → NULL, COALESCE → 0`,
  hints:[
    "COALESCE removes a NULL; NULLIF creates one — opposite directions.",
    "Pattern: COALESCE(a / NULLIF(b, 0), 0).",
    "This avoids the hard 'division by zero' error entirely."
  ]
},
{
  unit:"Unit 14 — NULL Handling",num:"14.6",title:"IS DISTINCT FROM",
  question:"NULL-safe comparison: treats two NULLs as equal instead of unknown.",
  given:"phone NULL for some rows",
  code:
`SELECT NULL IS DISTINCT FROM NULL;  -- false  (two NULLs are NOT different)
SELECT NULL IS DISTINCT FROM 5;     -- true
SELECT 5    IS DISTINCT FROM 5;     -- false
SELECT NULL <> NULL AS plain;       -- NULL   (plain operator unusable)

-- Everyone whose phone is not 9912345670 — INCLUDING the NULL rows:
SELECT name, phone
FROM employees
WHERE phone IS DISTINCT FROM '9912345670';`,
  output:
`NULL IS DISTINCT FROM NULL → false
NULL IS DISTINCT FROM 5    → true
NULL <> NULL               → NULL   ← the plain operator is unusable

    name     |   phone
-------------+------------
 john DOE    | NULL
 Ravi Kumar  | 9876543210
 JANE smith  | NULL
 JAKE Miller | 9001122334`,
  hints:[
    "IS DISTINCT FROM treats NULL as a normal, comparable value.",
    "Plain <> drops NULL rows; IS DISTINCT FROM keeps them.",
    "Use it when NULL should count as 'different from a value'."
  ]
},

/* ---------------- Unit 15 — Nesting & Report ---------------- */
{
  unit:"Unit 15 — Nesting & the Final Report",num:"15.1",title:"Function nesting",
  question:"Functions wrap inside each other; the innermost runs first.",
  given:"employees table",
  code:
`SELECT UPPER(TRIM(name)) FROM employees;   -- '  Ravi Kumar ' → RAVI KUMAR

-- Three layers: trim → take the domain → upper-case it
SELECT UPPER(SPLIT_PART(TRIM(email), '@', 2)) AS domain FROM employees;  -- GMAIL.COM

SELECT ROUND(COALESCE(salary, 0), 2) FROM employees;   -- 45678.68

SELECT TO_CHAR(DATE_TRUNC('month', join_date), 'Mon YYYY') AS month_label  -- May 2026
FROM employees;`,
  output:
`UPPER(TRIM('  Ravi Kumar ')) → RAVI KUMAR

     domain
-------------
 GMAIL.COM
 YAHOO.COM
 OUTLOOK.COM

 month_label
-------------
 May 2026
 Nov 2025`,
  hints:[
    "Evaluation is inside-out: the innermost call runs first.",
    "Nest across families — numeric inside NULL inside string, etc.",
    "Keep nesting readable; break very deep chains into steps."
  ]
},
{
  unit:"Unit 15 — Nesting & the Final Report",num:"15.2",title:"The final report",
  question:"Four families in one query: UPPER cleans the name, ROUND tidies salary, TO_CHAR makes a readable month, COALESCE fills the phone.",
  given:"raw employees export",
  code:
`SELECT
    UPPER(TRIM(name))              AS customer_name,  -- JOHN DOE
    ROUND(salary, 2)              AS salary,          -- 45678.68
    TO_CHAR(join_date, 'Mon YYYY') AS joined,         -- May 2026
    COALESCE(phone, 'N/A')        AS phone            -- N/A
FROM employees
ORDER BY join_date DESC;`,
  output:
` customer_name |  salary  | joined   |   phone
---------------+----------+----------+------------
 JOHN DOE      | 45678.68 | May 2026 | N/A
 JANE SMITH    | 62000.00 | Jan 2026 | N/A
 ASHA RAO      | 38210.50 | Nov 2025 | 9912345670
 JAKE MILLER   | 29500.00 | Mar 2025 | 9001122334
 RAVI KUMAR    | 52300.13 | Jul 2024 | 9876543210`,
  hints:[
    "Each column uses a different function family on the same row.",
    "COALESCE keeps missing phones from showing as blank cells.",
    "ORDER BY the raw join_date, not the formatted text."
  ]
},

/* ---------------- Unit 16 — Common Mistakes ---------------- */
{
  unit:"Unit 16 — Common Mistakes",num:"16.1",title:"Comparing with = NULL",
  question:"Using = NULL always returns nothing, silently.",
  given:"phone NULL for some rows",
  code:
`SELECT * FROM employees WHERE phone = NULL;    -- WRONG → 0 rows, silently
SELECT * FROM employees WHERE phone IS NULL;   -- RIGHT → the missing-phone rows`,
  output:
`WHERE phone = NULL     → 0 rows (always, silently)
WHERE phone IS NULL    → the rows with a missing phone`,
  hints:[
    "= NULL is never true — even for NULL values.",
    "Always test NULL with IS NULL / IS NOT NULL."
  ]
},
{
  unit:"Unit 16 — Common Mistakes",num:"16.2",title:"LIKE for a case-insensitive search",
  question:"LIKE is case-sensitive, so it misses differently-cased rows.",
  given:"names include 'john' and 'JAKE'",
  code:
`SELECT * FROM employees WHERE name LIKE 'j%';   -- WRONG → misses 'john'
SELECT * FROM employees WHERE name ILIKE 'j%';  -- RIGHT → john, JANE, JAKE`,
  output:
`name LIKE  'j%' → (no rows — none start with a lowercase 'j' after casing)
name ILIKE 'j%' → john DOE, JANE smith, JAKE Miller`,
  hints:[
    "LIKE respects case; ILIKE ignores it.",
    "Or normalise both sides: LOWER(name) LIKE 'j%'."
  ]
},
{
  unit:"Unit 16 — Common Mistakes",num:"16.3",title:"Confusing ROUND and TRUNC",
  question:"ROUND goes to the nearest; TRUNC just cuts. They differ on the last digit.",
  given:"value: 45.678",
  code:
`SELECT ROUND(45.678, 2) AS round_result,   -- 45.68  (nearest)
       TRUNC(45.678, 2) AS trunc_result;   -- 45.67  (cut)`,
  output:
` round_result | trunc_result
--------------+--------------
        45.68 |        45.67`,
  hints:[
    "ROUND(45.678,2)=45.68; TRUNC(45.678,2)=45.67.",
    "Pick TRUNC in finance so a value is never overstated."
  ]
},
{
  unit:"Unit 16 — Common Mistakes",num:"16.4",title:"Ignoring NULL inside calculations",
  question:"Any NULL makes the whole expression NULL. Wrap it in COALESCE.",
  given:"—",
  code:
`SELECT salary + NULL AS broken_total FROM employees LIMIT 1;   -- WRONG → NULL

SELECT ROUND(COALESCE(salary, 0) + COALESCE(NULL, 0), 2) AS safe_total  -- 45678.68
FROM employees LIMIT 1;`,
  output:
`salary + NULL                                → NULL
ROUND(COALESCE(salary,0)+COALESCE(NULL,0),2) → 45678.68`,
  hints:[
    "NULL poisons +, -, *, / and ||.",
    "COALESCE each nullable operand to a safe default first."
  ]
},
{
  unit:"Unit 16 — Common Mistakes",num:"16.5",title:"Dividing without a guard",
  question:"A zero divisor throws a hard error — guard it with NULLIF.",
  given:"—",
  code:
`SELECT 100 / 0;                             -- ERROR: division by zero
SELECT 100 / NULLIF(0, 0) AS safe_division; -- NULL, no error`,
  output:
`100 / 0             → ERROR: division by zero
100 / NULLIF(0, 0)  → NULL   ← safe, no error`,
  hints:[
    "NULLIF(divisor, 0) turns 0 into NULL, so division returns NULL.",
    "Wrap with COALESCE(..., 0) to show a friendly 0 instead of NULL."
  ]
}
];

/* append the chapter to the deck */
DECK.push.apply(DECK,FUNCTIONS_DECK);

/* schema panel: every function problem runs against the employees table
   (structure never changes), except 10.1 which creates it */
FUNCTIONS_DECK.forEach(function(p){
  if(p.num==="10.1"){
    SCHEMA["10.1"]={before:[],after:_empTbl(),note:"Demo table created with 5 deliberately messy rows."};
  }else{
    SCHEMA[p.num]={before:_empTbl(),after:_empTbl(),note:"Function query — reads the employees table, structure unchanged."};
  }
});
