const hamburgerMenu = document.getElementById('hamburger-menu');
const dropdownContent = document.getElementById('dropdown-content');

hamburgerMenu.addEventListener('click', () => {
    // Toggle the active class on the hamburger menu
    hamburgerMenu.classList.toggle('active');
    
    // Toggle the visibility of the dropdown content
    dropdownContent.classList.toggle('active');
});
