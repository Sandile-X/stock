document.getElementById("searchBtn").addEventListener("click", searchPartNumber);
document.getElementById("updateBtn").addEventListener("click", updateStock);
document.getElementById("exportBtn").addEventListener("click", exportUpdatedFile);

let workbook, worksheet, updatedData;

// Read the Excel file
document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            workbook = XLSX.read(data, { type: "array" });
            worksheet = workbook.Sheets[workbook.SheetNames[0]];
            updatedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            alert("File loaded successfully!");
        };
        reader.readAsArrayBuffer(file);
    }
});

// Search for a part number
function searchPartNumber() {
    const partNumber = document.getElementById("partNumberInput").value.trim();
    const resultSection = document.getElementById("resultSection");

    if (!partNumber || !updatedData) {
        alert("Please enter a part number and load a file.");
        return;
    }

    const match = updatedData.find((row) => row[0] === partNumber);

    if (match) {
        resultSection.style.display = "block";
        document.getElementById("resultPartNumber").textContent = match[0];
        document.getElementById("resultDescription").textContent = match[1];
        document.getElementById("resultBrand").textContent = match[2];
        document.getElementById("resultQuantity").textContent = match[3];
    } else {
        alert("Part number not found.");
        resultSection.style.display = "none";
    }
}

// Update the stock quantity
function updateStock() {
    const partNumber = document.getElementById("partNumberInput").value.trim();
    const amountToAdd = parseInt(document.getElementById("adjustQuantityInput").value, 10);

    if (!amountToAdd || amountToAdd <= 0) {
        alert("Please enter a valid amount to add.");
        return;
    }

    const rowIndex = updatedData.findIndex((row) => row[0] === partNumber);

    if (rowIndex >= 0) {
        updatedData[rowIndex][3] = parseInt(updatedData[rowIndex][3], 10) + amountToAdd;
        alert("Stock updated successfully!");
        document.getElementById("resultQuantity").textContent = updatedData[rowIndex][3];
    } else {
        alert("Part number not found.");
    }
}

// Export updated file
function exportUpdatedFile() {
    const newWorksheet = XLSX.utils.aoa_to_sheet(updatedData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet1");

    const fileName = "updated_stockin.xlsx";
    XLSX.writeFile(newWorkbook, fileName);
    alert("File exported successfully!");
}

// Toggle Hamburger Menu
function toggleMenu() {
    const menuLinks = document.getElementById("menuLinks");
    menuLinks.style.display = menuLinks.style.display === "block" ? "none" : "block";
}

// Navigate Back to Home
function navigateHome() {
    window.location.href = "index.html";
}


// Store spreadsheet data globally
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
