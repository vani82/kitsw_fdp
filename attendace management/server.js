const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const studentsFile = path.join(__dirname, 'data', 'students.json');
const attendanceFile = path.join(__dirname, 'data', 'attendance.json');

// Get all students
app.get('/api/students', (req, res) => {
  fs.readFile(studentsFile, 'utf-8', (err, data) => {
    if (err) return res.status(500).send('Error reading students file');
    res.json(JSON.parse(data));
  });
});

// Save attendance
app.post('/api/attendance', (req, res) => {
  const attendanceData = req.body;

  // Count absentees
  const absentCount = attendanceData.filter(a => a.present === 0).length;
  attendanceData.push({ roll: 'Total Absentees', name: '', present: absentCount });

  // Convert to CSV
  const csvRows = ['Roll Number,Name,Present(1)/Absent(0)'];
  attendanceData.forEach(row => {
    csvRows.push(`${row.roll},${row.name},${row.present}`);
  });
  const csvContent = csvRows.join('\n');
  fs.writeFile(attendanceFile, csvContent, err => {
    if (err) return res.status(500).send('Failed to save attendance');
    res.send({ message: 'Attendance saved', csv: csvContent });
  });
});

// Manage students (add new student)
app.post('/api/students', (req, res) => {
  const newStudent = req.body;
  fs.readFile(studentsFile, 'utf-8', (err, data) => {
    const students = JSON.parse(data);
    students.push(newStudent);
    fs.writeFile(studentsFile, JSON.stringify(students, null, 2), err => {
      if (err) return res.status(500).send('Failed to add student');
      res.send({ message: 'Student added', student: newStudent });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
