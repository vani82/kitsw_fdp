fetch('/api/students')
  .then(res => res.json())
  .then(students => {
    const tbody = document.querySelector('#student-table tbody');
    students.forEach(student => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${student.roll}</td>
        <td>${student.name}</td>
        <td>
          <input type="radio" name="attendance-${student.roll}" value="1" checked> Present
          <input type="radio" name="attendance-${student.roll}" value="0"> Absent
        </td>
      `;
      tbody.appendChild(tr);
    });
  });

document.getElementById('attendance-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const rows = document.querySelectorAll('#student-table tbody tr');
  const attendance = [];

  rows.forEach(row => {
    const roll = row.children[0].textContent;
    const name = row.children[1].textContent;
    const radio = row.querySelector('input[type=radio]:checked');
    attendance.push({
      roll,
      name,
      present: parseInt(radio.value)
    });
  });

  const res = await fetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attendance)
  });

  const data = await res.json();

  // Download CSV
  const blob = new Blob([data.csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'attendance.csv';
  link.click();
});
