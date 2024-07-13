const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('deleteRow').addEventListener('click', async () => {
    const bill_no = parseInt(document.getElementById('bill_no').value); // Convert to integer if necessary
    const design_no = document.getElementById('design_no').value;
    const design_type = document.getElementById('design_type').value.trim(); // Trim whitespace for validation

    if (!isNaN(bill_no) && design_no) { // Validate bill_no as integer and design_no as non-empty
      const response = await ipcRenderer.invoke('delete-data', { bill_no, design_no, design_type });
      showMessage(response.message);
    } else {
      showMessage('Please enter valid inputs for Bill No and Design No.');
    }
  });
});

function showMessage(message) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = message;
}
