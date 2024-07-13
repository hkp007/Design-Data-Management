document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('updateRow').addEventListener('click', async () => {
    const bill_no = document.getElementById('bill_no').value;
    const date = document.getElementById('date').value;
    const lot_no = document.getElementById('lot_no').value;
    const design_no = document.getElementById('design_no').value;
    const design_type = document.getElementById('design_type').value; // Added design_type
    const quantity = parseInt(document.getElementById('quantity').value);
    const qty_type = document.querySelector('input[name="qty_type"]:checked').value;
    const rate = parseInt(document.getElementById('rate').value);

    // Ensure all required fields are filled and quantity and rate are valid numbers
    if (bill_no && date && lot_no && design_no && !isNaN(quantity) && qty_type && !isNaN(rate)) {
      // Prepare the update object including design_type if available
      const updateData = {
        bill_no, design_no, design_type, date, lot_no, quantity, qty_type, rate
      };
      
      // Add design_type to the updateData if it's provided
      if (design_type.trim() !== '') {
        updateData.design_type = design_type.trim();
      }

      // Invoke IPC call to update data in the main process
      await ipcRenderer.invoke('update-data', updateData);

      // Clear input fields after updating row
      document.getElementById('date').value = '';
      document.getElementById('bill_no').value = '';
      document.getElementById('lot_no').value = '';
      document.getElementById('design_no').value = '';
      document.getElementById('design_type').value = ''; // Clear design_type field
      document.getElementById('quantity').value = '';
      document.querySelector('input[name="qty_type"]:checked').checked = false;
      document.getElementById('rate').value = '';
    }
  });
});
