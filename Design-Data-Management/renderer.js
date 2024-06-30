const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('addRow').addEventListener('click', async () => {
    const date = document.getElementById('date').value;
    const bill_no = document.getElementById('bill_no').value;
    const lot_no = document.getElementById('lot_no').value;
    const design_no = document.getElementById('design_no').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const qty_type = document.querySelector('input[name="qty_type"]:checked').value;
    const rate = parseInt(document.getElementById('rate').value);

    if (date && bill_no && lot_no && design_no && !isNaN(quantity) && qty_type && !isNaN(rate)) {
      await ipcRenderer.invoke('insert-data', { date, bill_no, lot_no, design_no, quantity, qty_type, rate });
    }
  });
});

function renderTable(data) {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.date}</td>
      <td>${row.bill_no}</td>
      <td>${row.lot_no}</td>
      <td>${row.design_no}</td>
      <td>${row.quantity}</td>
      <td>${row.qty_type}</td>
      <td>${row.rate}</td>
      <td>${row.amount}</td>
    `;
    tableBody.appendChild(tr);
  });
}