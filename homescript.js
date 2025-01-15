// Function to navigate between pages
function navigateTo(pageId) {
    alert(`Navigating to ${pageId}`); // Placeholder for navigation logic
}

  // Function to navigate back to the home page
  function navigateHome() {
    window.location.href = 'stockout.html';
}

// Toggle the hamburger menu visibility
function toggleMenu() {
    const menu = document.getElementById('menuLinks');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}