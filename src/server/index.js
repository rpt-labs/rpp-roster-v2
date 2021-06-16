const express = require('express');

const db = require('../db/database.js');

const port = process.env.PORT || 9001;

const app = express();

const getData = require('./utils');

app.get('/api/cohorts', (req, res) => {
  const sql = 'select * from cohorts';
  getData(db, sql, res);
});

app.get('/api/cohort/:id', (req, res) => {
  const { id } = req.params;
  const sql = `select * from cohorts where cohort_id = "${id}" COLLATE NOCASE`;
  getData(db, sql, res);
});

app.get('/api/students', (req, res) => {
  const sql = 'select * from students';
  getData(db, sql, res);
});

app.get('/api/students/status/:status', (req, res) => {
  const { status } = req.params;
  const sql = `select * from students where status = "${status}" COLLATE NOCASE`;
  getData(db, sql, res);
});

app.get('/api/students/cohort/:cohortId', async (req, res) => {
  const { cohortId } = req.params;
  const sql = `select students.first_name, students.last_name, students.status, cohorts_students.cohort_id
    FROM students
    INNER JOIN cohorts_students ON students.id = cohorts_students.student_id
    AND cohorts_students.cohort_id = ${cohortId}`;
  getData(db, sql, res);
});

app.get('/api/student/:cohortId/:name', async (req, res) => {
  const { cohortId, name } = req.params;
  console.log({cohortId, name })
  const sql = `select students.first_name, students.last_name, students.status, cohorts_students.cohort_id
    FROM students
    INNER JOIN cohorts_students
    ON students.id = cohorts_students.student_id
    WHERE cohorts_students.cohort_id = ${cohortId}
    AND (students.first_name = "${String(name)}" COLLATE NOCASE OR students.last_name = "${String(name)}" COLLATE NOCASE)`;

  getData(db, sql, res);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
