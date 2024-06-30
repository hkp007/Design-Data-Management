document.addEventListener('DOMContentLoaded', () => {
  const searchByDateForm = document.getElementById('searchByDateForm');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const resultContainer = document.getElementById('result-container');
  const totalAmountElement = document.getElementById('total-amount');

  searchByDateForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const startDate = startDateInput.value.trim();
    const endDate = endDateInput.value.trim();
    if (!startDate || !endDate) {
      return;
    }
    try {
      const rows = await window.api.searchByDate({ startDate, endDate });
      displaySearchResult(rows);
    } catch (error) {
      console.error('Error searching by date:', error);
    }
  });

  function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }

  function displaySearchResult(rows) {
    if (!Array.isArray(rows) || rows.length === 0) {
      resultContainer.innerHTML = '<p>No records found.</p>';
      totalAmountElement.innerHTML = '';
      return;
    }

    let total = 0;
    const tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Bill No</th>
            <th>Lot No</th>
            <th>Design No</th>
            <th>Quantity</th>
            <th>Qty Type</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => {
            total += row.amount;
            return `
              <tr>
                <td>${formatDate(row.date)}</td>
                <td>${row.bill_no}</td>
                <td>${row.lot_no}</td>
                <td>${row.design_no}</td>
                <td>${row.quantity}</td>
                <td>${row.qty_type}</td>
                <td>${row.rate}</td>
                <td>${row.amount}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
    resultContainer.innerHTML = tableHTML;
    totalAmountElement.innerHTML = `<strong>Total Amount: ${total}</strong>`;
  }

  const exportPdfButton = document.getElementById('exportPdfButton');

  exportPdfButton.addEventListener('click', async () => {
    try {
      await window.api.exportToPDF();
      alert('PDF has been exported successfully!');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    }
  });

});
