// Side menu
const hamburgerMenu = document.getElementById('sideMenu-sign');
const dropdownContent = document.getElementById('sideMenu-content');

hamburgerMenu.addEventListener('click', () => {
    // Toggle the active class on the hamburger menu
    hamburgerMenu.classList.toggle('active');
    
    // Toggle the visibility of the dropdown content
    dropdownContent.classList.toggle('active');
});


// Footer -About Us and Talk to Us
var aboutModal = document.getElementById("aboutModal");
var talkModal = document.getElementById("talkModal");
var statisticsModel = document.getElementById("statisticsModel");

var openAboutModal = document.getElementById("openAboutModal");
var openTalkModal = document.getElementById("openTalkModal");
var openstatisticsModel = document.getElementById("openstatisticsModel");

var closeButtons = document.querySelectorAll(".close-button");

if(openAboutModal){
    openAboutModal.onclick = function(event) {
        event.preventDefault();
        aboutModal.style.display = "block";
    }
}

if(openTalkModal){
    openTalkModal.onclick = function(event) {
        event.preventDefault();
        talkModal.style.display = "block";
    }
}

if(openstatisticsModel){
    openstatisticsModel.onclick = function(event) {
        event.preventDefault();
        statisticsModel.style.display = "block";
    }
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
    } else if (event.target == statisticsModel) {
        statisticsModel.style.display = "none";
    }
}


