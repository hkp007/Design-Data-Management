const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { initializeDB, getData, insertData, updateData, deleteData, searchByDate, searchByDesign } = require('./db');

let mainWindow;
let viewWindow;
let addWindow;
let updateWindow;
let deleteWindow;
let searchWindow1;
let searchWindow2;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function createViewWindow() {
  if(!viewWindow){
    viewWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: false,
        nodeIntegration: true,
      },
    });
  
    viewWindow.loadFile('view.html');
  
    viewWindow.on('closed', function () {
      viewWindow = null;
    });
  } else{
    viewWindow.focus();
  }
  
}

function createAddWindow() {
  if(!viewWindow){
    addWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: true,
      },
    });
  
    addWindow.loadFile('add.html');
  
    // addWindow.webContents.openDevTools();

    addWindow.on('closed', function () {
      addWindow = null;
    });
  } else{
    viewWindow.focus();
  }
  
}

function createUpdateWindow() {
  if(!viewWindow){
    updateWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: true,
      },
    });
  
    updateWindow.loadFile('update.html');

    // updateWindow.webContents.openDevTools();
  
    updateWindow.on('closed', function () {
      updateWindow = null;
    });
  } else{
    viewWindow.focus();
  }
    
  }
  
  ipcMain.handle('update-data', async (event, row) => {
    return await updateData(row);
  });

  function createSearchWindow1() {
    if (!searchWindow1) {
      searchWindow1 = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          contextIsolation: true,
          nodeIntegration: true,
        },
      });
  
      searchWindow1.loadFile('searchByDesign.html');
  
      // searchWindow1.webContents.openDevTools();

      searchWindow1.on('closed', function () {
        searchWindow1 = null;
      });
    } else {
      searchWindow1.focus();
    }
  }

  ipcMain.handle('searchDataByDesign', async (event, design_no) => {
    return await searchByDesign(design_no);
  });

  function createSearchWindow2() {
    if (!searchWindow2) {
      searchWindow2 = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          contextIsolation: true,
          nodeIntegration: true,
        },
      });
  
      searchWindow2.loadFile('searchByDate.html');
  
      // searchWindow.webContents.openDevTools();

      searchWindow2.on('closed', function () {
        searchWindow2 = null;
      });
    } else {
      searchWindow2.focus();
    }
  }

  ipcMain.handle('search-by-date', async (event, { startDate, endDate }) => {
    return await searchByDate(startDate, endDate);
  });

  ipcMain.handle('export-to-pdf', async (event) => {
    const downloadsDir = app.getPath('downloads');
    let pdfName = 'search-results.pdf';
    let counter = 1;
    const getUniquePDFName = () => {
      while (fs.existsSync(path.join(downloadsDir, pdfName))) {
        pdfName = `search-results${counter}.pdf`;
        counter++;
      }
    };
    getUniquePDFName();
    const pdfPath = path.join(downloadsDir, pdfName);

    const currentWindow = BrowserWindow.getFocusedWindow();
    const options = {
      marginsType: 0,
      pageSize: 'A4',
      printBackground: true,
      printSelectionOnly: false,
      landscape: false,
    };
  
    // Inject JavaScript code to hide unwanted elements before printing
        const hideUnwantedElementsScript = `
        const resultContainer = document.getElementById('result-container');
        const totalAmountElement = document.getElementById('total-amount');
        const otherElements = Array.from(document.body.children).filter(element => element !== resultContainer && element !== totalAmountElement);
        otherElements.forEach(element => element.style.display = 'none');
      `;

      await currentWindow.webContents.executeJavaScript(hideUnwantedElementsScript);

      // Print only the visible part of the page
      const pdfData = await currentWindow.webContents.printToPDF(options);

      // Reset the DOM to its original state
      const resetDomScript = `
        const allElements = Array.from(document.body.children);
        allElements.forEach(element => element.style.display = 'block');
      `;

      await currentWindow.webContents.executeJavaScript(resetDomScript);

      fs.writeFileSync(pdfPath, pdfData);

      return pdfPath;

    // return currentWindow.webContents.printToPDF(options)
    //   .then(data => {
    //     fs.writeFileSync(pdfPath, data);
    //     return pdfPath;
    //   })
    //   .catch(error => {
    //     throw new Error(`Failed to export PDF: ${error.message}`);
    //   });
  });

  function createDeleteWindow() {
    if(!viewWindow){
      deleteWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          contextIsolation: false,
          nodeIntegration: true,
        },
      });
    
      deleteWindow.loadFile('delete.html');
    
      deleteWindow.on('closed', function () {
        deleteWindow = null;
      });
    } else{
      viewWindow.focus();
    }
    
  }
  
  ipcMain.handle('delete-data', async (event, {bill_no, design_no, design_type}) => {
    return await deleteData(bill_no, design_no, design_type);
  });

const menuTemplate = [
  {
    label: 'Menu',
    submenu: [
      {
        label: 'View Data',
        click() {
          createViewWindow();
        }
      },
      {
        label: 'Add Data',
        click() {
          createAddWindow();
        }
      },
      {
        label: 'Update Data',
        click() {
          createUpdateWindow();
        }
      },
      {
        label: 'Search by Design',
        click() {
          createSearchWindow1();
        }
      },
      {
        label: 'Search by Date',
        click() {
          createSearchWindow2();
        }
      },
      {
        label: 'Delete Data',
        click() {
          createDeleteWindow();
        }
      },
      {
        label: 'Quit',
        click() {
          app.quit();
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

app.on('ready', () => {
  initializeDB();
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('get-data', async () => {
  return await getData();
});

ipcMain.handle('insert-data', async (event, row) => {
  return await insertData(row);
});
