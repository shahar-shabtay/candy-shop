const hamburgerMenu = document.getElementById('sideMenu-sign');
const dropdownContent = document.getElementById('sideMenu-content');

hamburgerMenu.addEventListener('click', () => {
    // Toggle the active class on the hamburger menu
    hamburgerMenu.classList.toggle('active');
    
    // Toggle the visibility of the dropdown content
    dropdownContent.classList.toggle('active');
});


// About Us and Talk to Us
var aboutModal = document.getElementById("aboutModal");
var talkModal = document.getElementById("talkModal");

var openAboutModal = document.getElementById("openAboutModal");
var openTalkModal = document.getElementById("openTalkModal");

var closeButtons = document.querySelectorAll(".close-button");

openAboutModal.onclick = function(event) {
    event.preventDefault();
    aboutModal.style.display = "block";
}

openTalkModal.onclick = function(event) {
    event.preventDefault();
    talkModal.style.display = "block";
}

closeButtons.forEach(function(button) {
    button.onclick = function() {
        button.closest('.modal').style.display = "none";
    };
});

window.onclick = function(event) {
    if (event.target == aboutModal) {
        aboutModal.style.display = "none";
    } else if (event.target == talkModal) {
        talkModal.style.display = "none";
    }
}

function showSuccessAlert() {
    const alertBox = document.getElementById('success-alert');
    alertBox.classList.remove('hidden');
    alertBox.classList.add('visible');

    // Hide after 3 seconds
    setTimeout(() => {
        alertBox.classList.remove('visible');
        alertBox.classList.add('hidden');
    }, 3000);
}