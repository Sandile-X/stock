// Load spreadsheet data from localStorage
document.addEventListener("DOMContentLoaded", function () {
    const storedData = localStorage.getItem("spreadsheet");
    if (storedData) {
        const workbook = XLSX.read(storedData, { type: "base64" });
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        populateTable(sheetData);
    } else {
        alert("No spreadsheet data found! Please upload a spreadsheet in the app.");
    }
});

// Populate table with spreadsheet data
function populateTable(data) {
    const tableBody = document.getElementById("stockTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear any existing rows

    data.forEach((row) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${row["Part number"] || ""}</td>
            <td>${row.Description || ""}</td>
            <td>${row.Brand || ""}</td>
            <td>${row.Quantity || 0}</td>
        `;

        tableBody.appendChild(tr);
    });
}

// Back navigation function
function navigateBack() {
    window.location.href = "index.html"; // Adjust to your homepage file
}

// Hamburger menu toggle
function toggleMenu() {
    const menuLinks = document.getElementById("menuLinks");
    menuLinks.style.display = menuLinks.style.display === "block" ? "none" : "block";
}
