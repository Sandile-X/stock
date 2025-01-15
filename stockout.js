document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('searchBtn').addEventListener('click', searchPartNumber);
document.getElementById('updateBtn').addEventListener('click', updateStock);
document.getElementById('exportBtn').addEventListener('click', exportUpdatedFile);

 // Function to navigate back to the home page
 function navigateHome() {
    window.location.href = 'index.html';
}

// Toggle the hamburger menu visibility
function toggleMenu() {
    const menu = document.getElementById('menuLinks');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}


let stockData = [];
let selectedRow = null;

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        stockData = XLSX.utils.sheet_to_json(worksheet);
        alert('File loaded successfully!');
    };

    reader.readAsArrayBuffer(file);
}

function searchPartNumber() {
    const partNumber = document.getElementById('partNumberInput').value.trim();
    selectedRow = stockData.find(row => row['Part Number'] === partNumber);

    if (selectedRow) {
        document.getElementById('resultPartNumber').textContent = selectedRow['Part Number'];
        document.getElementById('resultDescription').textContent = selectedRow['Description'];
        document.getElementById('resultBrand').textContent = selectedRow['Brand'];
        document.getElementById('resultQuantity').textContent = selectedRow['Quantity'];
        document.getElementById('resultSection').style.display = 'block';
        document.getElementById('exportBtn').style.display = 'block';
    } else {
        alert('Part Number not found!');
        document.getElementById('resultSection').style.display = 'none';
    }
}

function updateStock() {
    const amountToRemove = parseInt(document.getElementById('adjustQuantityInput').value, 10);

    if (selectedRow && amountToRemove > 0) {
        if (amountToRemove <= selectedRow['Quantity']) {
            selectedRow['Quantity'] -= amountToRemove;
            document.getElementById('resultQuantity').textContent = selectedRow['Quantity'];
            alert('Stock updated successfully!');
        } else {
            alert('Insufficient stock!');
        }
    } else {
        alert('Please enter a valid amount to remove.');
    }
}

function exportUpdatedFile() {
    const csvContent = 'Part Number,Description,Brand,Quantity\n' + stockData.map(row => {
        return `${row['Part Number']},${row['Description']},${row['Brand']},${row['Quantity']}`;
    }).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'updated_stock.csv');
    a.click();
}


// Toggle Hamburger Menu
function toggleMenu() {
    const menuLinks = document.getElementById("menuLinks");
    menuLinks.style.display = menuLinks.style.display === "block" ? "none" : "block";
}


// Store spreadsheet data globally
let workbook;
let sheetData = [];

// Load stored spreadsheet data on page load
window.onload = function () {
    const storedData = localStorage.getItem("spreadsheet");
    if (storedData) {
        workbook = XLSX.read(storedData, { type: "base64" });
        sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        console.log("Spreadsheet loaded from localStorage:", sheetData);
    }
};

// Save spreadsheet to localStorage
function saveToLocalStorage() {
    const workbookBase64 = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });
    localStorage.setItem("spreadsheet", workbookBase64);
}

// Handle file input
document.getElementById("fileInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            workbook = XLSX.read(data, { type: "array" });
            sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            console.log("Spreadsheet loaded:", sheetData);
            saveToLocalStorage();
        };
        reader.readAsArrayBuffer(file);
    }
});

// Search functionality
document.getElementById("searchBtn").addEventListener("click", searchPartNumber);

document.getElementById("partNumberInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchPartNumber();
    }
});

function searchPartNumber() {
    const partNumber = document.getElementById("partNumberInput").value.trim();
    if (!partNumber) return alert("Please enter a Part Number.");

    const result = sheetData.find(item => item["Part number"] === partNumber);

    if (result) {
        document.getElementById("resultSection").style.display = "block";
        document.getElementById("resultPartNumber").innerText = result["Part number"];
        document.getElementById("resultDescription").innerText = result.Description || "N/A";
        document.getElementById("resultBrand").innerText = result.Brand || "N/A";
        document.getElementById("resultQuantity").innerText = result.Quantity || 0;
    } else {
        document.getElementById("resultSection").style.display = "none";
        alert("Part Number not found!");
    }

    // Clear input field after search
    document.getElementById("partNumberInput").value = "";
}

// Save updated spreadsheet back to localStorage after an update
document.getElementById("updateBtn").addEventListener("click", function () {
    const partNumber = document.getElementById("resultPartNumber").innerText;
    const quantityToAdjust = parseInt(document.getElementById("adjustQuantityInput").value);

    if (!quantityToAdjust || quantityToAdjust < 0) {
        return alert("Please enter a valid quantity.");
    }

    const rowIndex = sheetData.findIndex(item => item["Part number"] === partNumber);

    if (rowIndex !== -1) {
        sheetData[rowIndex].Quantity = Math.max(sheetData[rowIndex].Quantity - quantityToAdjust, 0);
        alert("Stock updated successfully!");
        saveToLocalStorage();
    } else {
        alert("Error updating stock.");
    }

    document.getElementById("adjustQuantityInput").value = ""; // Clear adjust quantity input
});

// Export updated file
document.getElementById("exportBtn").addEventListener("click", function () {
    if (sheetData.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, worksheet, "Sheet1");
        XLSX.writeFile(newWorkbook, "updated_stock.xlsx");
    } else {
        alert("No data to export.");
    }
});
