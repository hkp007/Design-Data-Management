document.addEventListener('DOMContentLoaded', () => {
  const searchByDesignForm = document.getElementById('searchByDesignForm');
  const designNoInput = document.getElementById('designNo');
  const resultContainer = document.getElementById('result-container');
  const totalAmountElement = document.getElementById('total-amount');

  searchByDesignForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const designNo = designNoInput.value.trim();
    
    if (!designNo) {
      return;
    }

    try {
      const rows = await window.api.searchDataByDesign(designNo);
      displaySearchResult(rows);
    } catch (error) {
      console.error('Error searching by design number:', error);
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

    const formattedRows = rows.map(row => ({
      ...row,
      date: formatDate(row.date)
    }));

    let tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Bill No</th>
            <th>Lot No</th>
            <th>Design No</th>
            <th>Design Type</th>
            <th>Quantity</th>
            <th>Qty Type</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${formattedRows.map(row => `
            <tr>
              <td>${row.date}</td>
              <td>${row.bill_no}</td>
              <td>${row.lot_no}</td>
              <td>${row.design_no}</td>
              <td>${row.design_type || ''}</td>
              <td>${row.quantity}</td>
              <td>${row.qty_type}</td>
              <td>${row.rate}</td>
              <td>${row.amount}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    resultContainer.innerHTML = tableHTML;
    totalAmountElement.innerHTML = `<strong>Total Amount: ${calculateTotalAmount(formattedRows)}</strong>`;
  }

  function calculateTotalAmount(rows) {
    return rows.reduce((total, row) => total + row.amount, 0);
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
