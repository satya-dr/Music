// Initialize the variables
let songIndex = 0;
let audioElement = new Audio();
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let mastersongName = document.getElementById('mastersongName');
let currentTimeEl = document.querySelector('.currentTime');
let songDurationEl = document.querySelector('.songDuration');
let songItems = document.querySelectorAll('.songitem');
let albumArt = document.querySelector('.albumArt');
let songTitle = document.querySelector('.songTitle');
let artist = document.querySelector('.artist');
let volumeSlider = document.querySelector('.volumeSlider');
let volumePopupSlider = document.getElementById('volumePopupSlider');
let volumeButton = document.getElementById('volumeButton');
let volumePopup = document.querySelector('.volumePopup');
let repeatButton = document.querySelector('.fa-redo');
let isRepeating = false;

let songs = [     
    { songName: "Let me Love You", filePath: "1.mp3", coverPath: "1.jpg", artist: "Unknown Artist" },
    { songName: "ওরা মনের গোপন চেনে না", filePath: "18.mp3", coverPath: "4.jpg", artist: "Bengali Artist" }, 
    { songName: "Batto ko teri by arijit", filePath: "3.mp3", coverPath: "3.jpg", artist: "Arijit Singh" },
    { songName: "Mohabat barsa dena tu", filePath: "4.mp3", coverPath: "4.jpg", artist: "Unknown Artist" },
    { songName: "bengali romantic song", filePath: "5.mp3", coverPath: "5.jpg", artist: "Bengali Artist" },
    { songName: "Tu bhi royega Mahi", filePath: "6.mp3", coverPath: "6.jpg", artist: "Unknown Artist" },
    { songName: "O Sajna x Pagol Ami Already", filePath: "7.mp3", coverPath: "7.jpg", artist: "Mashup Artist" },
    { songName: "Ami keno Bar Bar Preme Pore jai", filePath: "8.mp3", coverPath: "8.jpg", artist: "Bengali Artist" },
    { songName: "Tera Hoke Rahoon", filePath: "9.mp3", coverPath: "9.jpg", artist: "Unknown Artist" },
    { songName: "Chand Chupa Badal Main", filePath: "10.mp3", coverPath: "2.jpg", artist: "Unknown Artist" }
];

// Initialize the player
function initializePlayer() {
    // Set initial song
    audioElement.src = songs[songIndex].filePath;
    mastersongName.innerText = songs[songIndex].songName;
    albumArt.src = songs[songIndex].coverPath;
    songTitle.innerText = songs[songIndex].songName;
    artist.innerText = songs[songIndex].artist;
    
    // Set volume
    audioElement.volume = volumeSlider.value / 100;
    volumePopupSlider.value = volumeSlider.value;
    
    // Add active class to first song
    songItems[0].classList.add('active');
}

// Format time in minutes:seconds
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    sec = sec < 10 ? `0${sec}` : sec;
    return `${min}:${sec}`;
}

// Update song info in the banner
function updateSongInfo() {
    mastersongName.innerText = songs[songIndex].songName;
    albumArt.src = songs[songIndex].coverPath;
    songTitle.innerText = songs[songIndex].songName;
    artist.innerText = songs[songIndex].artist;
    
    // Update active song in playlist
    songItems.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Handle Play/Pause click
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        gif.classList.add('playing');
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-circle-pause');
        masterPlay.classList.add('fa-circle-play');
        gif.classList.remove('playing');
    }
    updatePlayIcons();
});

// Listen to timeupdate event
audioElement.addEventListener('timeupdate', () => {
    // Update seekbar
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;
    
    // Update time display
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
    
    // Update song duration if not set
    if (!isNaN(audioElement.duration)) {
        songDurationEl.textContent = formatTime(audioElement.duration);
    }
});

// Listen to loadedmetadata event
audioElement.addEventListener('loadedmetadata', () => {
    songDurationEl.textContent = formatTime(audioElement.duration);
});

// Listen to seek event
myProgressBar.addEventListener('input', () => {
    audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
});

// Listen to volume change
volumeSlider.addEventListener('input', () => {
    audioElement.volume = volumeSlider.value / 100;
    volumePopupSlider.value = volumeSlider.value;
});

volumePopupSlider.addEventListener('input', () => {
    audioElement.volume = volumePopupSlider.value / 100;
    volumeSlider.value = volumePopupSlider.value;
});

// Toggle volume popup
volumeButton.addEventListener('click', () => {
    volumePopup.classList.toggle('show');
});

// Close volume popup when clicking elsewhere
document.addEventListener('click', (e) => {
    if (!volumeButton.contains(e.target) && !volumePopup.contains(e.target)) {
        volumePopup.classList.remove('show');
    }
});

// Toggle repeat
repeatButton.addEventListener('click', () => {
    isRepeating = !isRepeating;
    repeatButton.classList.toggle('active', isRepeating);
    audioElement.loop = isRepeating;
});

// Reset all play icons
const makeAllPlays = () => {
    document.querySelectorAll('.songItemPlay').forEach((element) => {
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');
    });
}

// Update play icons based on current state
const updatePlayIcons = () => {
    makeAllPlays();
    if (!audioElement.paused) {
        document.querySelector(`.songitem[data-index="${songIndex}"] .songItemPlay`).classList.remove('fa-circle-play');
        document.querySelector(`.songitem[data-index="${songIndex}"] .songItemPlay`).classList.add('fa-circle-pause');
    }
}

// Add click event to all song items
songItems.forEach((element) => {
    element.addEventListener('click', (e) => {
        // Make sure we're not clicking on the play button specifically
        if (!e.target.classList.contains('songItemPlay')) {
            makeAllPlays();
            songIndex = parseInt(element.getAttribute('data-index'));
            e.target.closest('.songitem').querySelector('.songItemPlay').classList.remove('fa-circle-play');
            e.target.closest('.songitem').querySelector('.songItemPlay').classList.add('fa-circle-pause');
            updateSongInfo();
            audioElement.src = songs[songIndex].filePath;
            audioElement.currentTime = 0;
            audioElement.play();
            masterPlay.classList.remove('fa-circle-play');
            masterPlay.classList.add('fa-circle-pause');
            gif.classList.add('playing');
        }
    });
    
    // Add click event to play buttons
    const playButton = element.querySelector('.songItemPlay');
    playButton.addEventListener('click', (e) => {
        e.stopPropagation();
        makeAllPlays();
        songIndex = parseInt(element.getAttribute('data-index'));
        
        if (audioElement.paused || songIndex !== parseInt(element.getAttribute('data-index'))) {
            e.target.classList.remove('fa-circle-play');
            e.target.classList.add('fa-circle-pause');
            updateSongInfo();
            audioElement.src = songs[songIndex].filePath;
            audioElement.currentTime = 0;
            audioElement.play();
            masterPlay.classList.remove('fa-circle-play');
            masterPlay.classList.add('fa-circle-pause');
            gif.classList.add('playing');
        } else {
            audioElement.pause();
            e.target.classList.remove('fa-circle-pause');
            e.target.classList.add('fa-circle-play');
            masterPlay.classList.remove('fa-circle-pause');
            masterPlay.classList.add('fa-circle-play');
            gif.classList.remove('playing');
        }
    });
});

// Next song
document.getElementById('next').addEventListener('click', () => {
    if (songIndex >= songs.length - 1) {
        songIndex = 0;
    } else {
        songIndex += 1;
    }
    updateSongInfo();
    audioElement.src = songs[songIndex].filePath;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-circle-play');
    masterPlay.classList.add('fa-circle-pause');
    gif.classList.add('playing');
    updatePlayIcons();
});

// Previous song
document.getElementById('previous').addEventListener('click', () => {
    if (songIndex <= 0) {
        songIndex = songs.length - 1;
    } else {
        songIndex -= 1;
    }
    updateSongInfo();
    audioElement.src = songs[songIndex].filePath;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-circle-play');
    masterPlay.classList.add('fa-circle-pause');
    gif.classList.add('playing');
    updatePlayIcons();
});

// Automatically play the next song when the current song ends
audioElement.addEventListener('ended', () => {
    if (!isRepeating) {
        if (songIndex >= songs.length - 1) {
            songIndex = 0;
        } else {
            songIndex += 1;
        }
        updateSongInfo();
        audioElement.src = songs[songIndex].filePath;
        audioElement.currentTime = 0;
        audioElement.play();
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        updatePlayIcons();
    } else {
        audioElement.currentTime = 0;
        audioElement.play();
    }
});

// Add event listener for the Space, ArrowRight, and ArrowLeft keys
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        masterPlay.click();
    } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        document.getElementById('next').click();
    } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        document.getElementById('previous').click();
    } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        if (audioElement.volume < 0.95) {
            audioElement.volume += 0.05;
        } else {
            audioElement.volume = 1;
        }
        volumeSlider.value = audioElement.volume * 100;
        volumePopupSlider.value = audioElement.volume * 100;
    } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        if (audioElement.volume > 0.05) {
            audioElement.volume -= 0.05;
        } else {
            audioElement.volume = 0;
        }
        volumeSlider.value = audioElement.volume * 100;
        volumePopupSlider.value = audioElement.volume * 100;
    }
});

// Initialize the player when page loads
window.addEventListener('load', initializePlayer);