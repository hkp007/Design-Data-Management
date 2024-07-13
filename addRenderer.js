document.getElementById('addRow').addEventListener('click', async () => {
  const date = document.getElementById('date').value;
  const bill_no = document.getElementById('bill_no').value;
  const lot_no = document.getElementById('lot_no').value;
  const design_no = document.getElementById('design_no').value;
  const design_type = document.getElementById('design_type').value; // Added design_type
  const quantity = document.getElementById('quantity').value;
  const qty_type = document.querySelector('input[name="qty_type"]:checked').value;
  const rate = document.getElementById('rate').value;

  // Insert data using ipcRenderer exposed via contextBridge
  await window.api.invoke('insert-data', {
    date, bill_no, lot_no, design_no, design_type, quantity, qty_type, rate // Included design_type
  });

  // Clear the input fields after adding the row
  document.getElementById('date').value = '';
  document.getElementById('bill_no').value = '';
  document.getElementById('lot_no').value = '';
  document.getElementById('design_no').value = '';
  document.getElementById('design_type').value = ''; // Clear design_type input
  document.getElementById('quantity').value = '';
  document.querySelector('input[name="qty_type"]:checked').checked = false;
  document.getElementById('rate').value = '';
});
