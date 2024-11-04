// Side menu
const hamburgerMenu = document.getElementById('sideMenu-sign');
const dropdownContent = document.getElementById('sideMenu-content');
const sideMenuVideos = document.getElementById('sideMenu-videos');
const videos = document.querySelectorAll('.sideMenu-video');
const closeButton = document.getElementById('close-button');
const pageContent = document.getElementById('page-content');
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
    if (pageContent) {
        pageContent.classList.add('full-width');
    }
});
if (hamburgerMenu) {
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
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeVideos();
});


// Footer -About Us and Talk to Us
// Footer - About Us, Talk to Us, and Statistics Modals
document.addEventListener('DOMContentLoaded', () => {
    const aboutModal = document.getElementById("aboutModal");
    const talkModal = document.getElementById("talkModal");
    const statisticsModel = document.getElementById("statisticsModel");

    const openAboutModal = document.getElementById("openAboutModal");
    const openTalkModal = document.getElementById("openTalkModal");
    const openStatisticsModel = document.getElementById("openstatisticsModel");

    const closeButtons = document.querySelectorAll(".close-button");

    // Open About Us modal
    if (openAboutModal) {
        openAboutModal.addEventListener('click', (event) => {
            event.preventDefault();
            aboutModal.style.display = "block";
        });
    }

    // Open Talk to Us modal
    if (openTalkModal) {
        openTalkModal.addEventListener('click', (event) => {
            event.preventDefault();
            talkModal.style.display = "block";
        });
    }

    // Open Statistics modal
    if (openStatisticsModel) {
        openStatisticsModel.addEventListener('click', (event) => {
            event.preventDefault();
            statisticsModel.style.display = "block";
        });
    }

    // Close modals when clicking on close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal'); // Find the closest modal container
            if (modal) {
                modal.style.display = "none"; // Hide the modal
            }
        });
    });

    // Close modals when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === aboutModal) {
            aboutModal.style.display = "none";
        } else if (event.target === talkModal) {
            talkModal.style.display = "none";
        } else if (event.target === statisticsModel) {
            statisticsModel.style.display = "none";
        }
    });
});