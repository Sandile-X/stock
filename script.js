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
    // Convert stock data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(stockData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock');

    // Write workbook to binary string
    const binary = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    // Convert binary string to array buffer
    const arrayBuffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binary.length; i++) {
        view[i] = binary.charCodeAt(i) & 0xff;
    }

    // Create a Blob with the correct MIME type
    const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'updated_stock.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('File exported successfully!');
}

function exportUpdatedFile() {
    // Convert stock data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(stockData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock');

    // Write workbook to binary string
    const binary = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    // Convert binary string to array buffer
    const arrayBuffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binary.length; i++) {
        view[i] = binary.charCodeAt(i) & 0xff;
    }

    // Create a Blob with the correct MIME type
    const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Use FileSaver.js to save the file
    saveAs(blob, 'updated_stock.xlsx');

    alert('File exported successfully!');
}

