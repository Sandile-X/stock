document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('searchBtn').addEventListener('click', searchPartNumber);
document.getElementById('updateBtn').addEventListener('click', updateStock);
document.getElementById('exportBtn').addEventListener('click', exportUpdatedFile);

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
