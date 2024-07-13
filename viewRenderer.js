const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', async () => {
  const data = await ipcRenderer.invoke('get-data');
  renderTable(data);
});

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
}

function renderTable(data) {
  const tableBody = document.getElementById('tableBody');
  if (!tableBody) {
    console.error('Table body element not found');
    return;
  }

  tableBody.innerHTML = '';

  const formattedRows = data.map(row => ({
    ...row,
    date: formatDate(row.date)
  }));

  formattedRows.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.date}</td>
      <td>${row.bill_no}</td>
      <td>${row.lot_no}</td>
      <td>${row.design_no}</td>
      <td>${row.design_type || ''}</td> <!-- Handle null values for design_type -->
      <td>${row.quantity}</td>
      <td>${row.qty_type}</td>
      <td>${row.rate}</td>
      <td>${row.amount}</td>
    `;
    tableBody.appendChild(tr);
  });
}
