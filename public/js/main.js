// Side menu
const hamburgerMenu = document.getElementById('sideMenu-sign');
const dropdownContent = document.getElementById('sideMenu-content');
const sideMenuVideos = document.getElementById('sideMenu-videos');
const videos = document.querySelectorAll('.sideMenu-video');
const closeButton = document.getElementById('close-button');
let currentVideoIndex = 0;

// Function to play videos
function playNextVideo() {
    // Hide all videos first
    videos.forEach(video => {
        video.style.display = 'none';
        video.pause();
    });

    // Show and play current video
    if (currentVideoIndex < videos.length) {
        const currentVideo = videos[currentVideoIndex];
        currentVideo.style.display = 'block';
        
        // Try to play the video
        const playPromise = currentVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Video play error:", error);
            });
        }

        // Set up the ended event for the current video
        currentVideo.onended = () => {
            currentVideo.style.display = 'none';
            currentVideoIndex = (currentVideoIndex + 1) % videos.length;
            playNextVideo();
        };
    }
}

// Initialize the video display
function initializeVideos() {
    sideMenuVideos.style.display = 'flex'; // Show the video section
    playNextVideo(); // Start playing the videos
}

// Close button event
closeButton.addEventListener('click', () => {
    sideMenuVideos.style.display = 'none';
    videos.forEach(video => {
        video.pause();
        video.style.display = 'none';
    });
});

hamburgerMenu.addEventListener('click', () => {
    // Toggle the active class on the hamburger menu
    hamburgerMenu.classList.toggle('active');
    
    // Toggle the visibility of the dropdown content
    dropdownContent.classList.toggle('active');

    if (dropdownContent.classList.contains('active')) {
        sideMenuVideos.style.display = 'none'; // Hide videos when menu is active
    } else {
        sideMenuVideos.style.display = 'flex'; // Show videos when menu is inactive
        playNextVideo();
    }
});

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeVideos();
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


