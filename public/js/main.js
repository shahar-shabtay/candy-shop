// Side menu
const hamburgerMenu = document.getElementById('sideMenu-sign');
const dropdownContent = document.getElementById('sideMenu-content');
const sideMenuVideos = document.getElementById('sideMenu-videos');
const videos = document.querySelectorAll('.sideMenu-video');
const closeButton = document.getElementById('close-button');
const pageContent = document.getElementById('page-content');
let currentVideoIndex = 0;

if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        dropdownContent.classList.toggle('active');
        if (dropdownContent.classList.contains('active')) {
            sideMenuVideos.style.display = 'none';
        } else {
            sideMenuVideos.style.display = 'flex';
            playNextVideo();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const sideMenuVideos = document.getElementById('sideMenu-videos');
    const closeButton = document.getElementById('close-button');
    const videos = Array.from(document.querySelectorAll('.sideMenu-video'));
    let currentVideoIndex = 0;

    function shouldShowPanelAgain() {
        const lastClosedTime = localStorage.getItem('videoPanelLastClosed');
        if (!lastClosedTime) return true;
        const tenMinutesInMs = 3 * 60 * 1000;
        const timeSinceLastClose = Date.now() - parseInt(lastClosedTime, 10);
        
        return timeSinceLastClose >= tenMinutesInMs;
    }

    function playNextVideo() {
        videos.forEach(video => {
            video.style.display = 'none';
            video.pause();
        });

        if (currentVideoIndex < videos.length) {
            const currentVideo = videos[currentVideoIndex];
            currentVideo.style.display = 'block';
            const playPromise = currentVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Video play error:", error);
                });
            }
            currentVideo.onended = () => {
                currentVideo.style.display = 'none';
                currentVideoIndex = (currentVideoIndex + 1) % videos.length;
                playNextVideo(); 
            };
        }
    }

    function initializeVideos() {
        sideMenuVideos.style.display = 'flex';
        currentVideoIndex = 0;
        playNextVideo();
    }

    if (shouldShowPanelAgain()) {
        initializeVideos();
    }

    closeButton.addEventListener('click', () => {
        sideMenuVideos.style.display = 'none';
        videos.forEach(video => {
            video.pause();
            video.style.display = 'none';
        });
        localStorage.setItem('videoPanelLastClosed', Date.now());
    });
});

// Footer -About Us and Talk to Us
document.addEventListener('DOMContentLoaded', () => {
    const aboutModal = document.getElementById("aboutModal");
    const talkModal = document.getElementById("talkModal");
    const statisticsModel = document.getElementById("statisticsModel");

    const openAboutModal = document.getElementById("openAboutModal");
    const openTalkModal = document.getElementById("openTalkModal");
    const openStatisticsModel = document.getElementById("openstatisticsModel");

    const closeButtons = document.querySelectorAll(".close-button");

    if (openAboutModal) {
        openAboutModal.addEventListener('click', (event) => {
            event.preventDefault();
            aboutModal.style.display = "block";
        });
    }

    if (openTalkModal) {
        openTalkModal.addEventListener('click', (event) => {
            event.preventDefault();
            talkModal.style.display = "block";
        });
    }

    if (openStatisticsModel) {
        openStatisticsModel.addEventListener('click', (event) => {
            event.preventDefault();
            statisticsModel.style.display = "block";
        });
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = "none";
            }
        });
    });

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


// Hostages Counter
(function () {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://bringthemhomenow.net/1.1.0/hostages-ticker.js";
    script.setAttribute(
      "integrity",
      "sha384-DHuakkmS4DXvIW79Ttuqjvl95NepBRwfVGx6bmqBJVVwqsosq8hROrydHItKdsne"
    );
    script.setAttribute("crossorigin", "anonymous");
    document.getElementsByTagName("head")[0].appendChild(script);
  })();

// Logout function
function handleLogout() {
    fetch('/logout', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Logout successful') {
                sessionStorage.clear();
                window.location.href = '/';
            }
        })
        .catch(error => console.error('Logout failed:', error));
}