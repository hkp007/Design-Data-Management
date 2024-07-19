# Tabular Data Management App

This application is built using Electron and SQLite3 for managing tabular data.

## Features

- Add, update, delete, and search tabular data entries.
- Export data to PDF.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/hkp007/Design-Data-Management.git
   cd tabular-data-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the application:**

   ```bash
   npm start
   ```

## Usage

- **Adding Data:** Fill out the form fields and click 'Add Row' to add new entries.
- **Updating Data:** Click on a row to edit it, then click 'Update Row' after making changes.
- **Deleting Data:** Enter the Bill No, Design No, and Design Type to delete a row.
- **Searching Data:** Search by Date range or Design No to find specific entries.
- **Exporting Data:** Click 'Export as PDF' to export the displayed data to a PDF file.

## Project Structure

- **`main.js`:** Electron main process entry point.
- **`renderer.js`:** Renderer process logic for UI interactions.
- **`db.js`:** SQLite database handling functions.
