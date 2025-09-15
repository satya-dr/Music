// Initialize the variables
let songIndex = 0;
let audioElement = new Audio();
let masterPlay = document.getElementById('play');
let progress = document.querySelector('.progress');
let currentTimeEl = document.querySelector('.current-time');
let totalTimeEl = document.querySelector('.total-time');
let songItems = document.querySelectorAll('.song-item');
let songImg = document.querySelector('.current-song-img');
let songName = document.querySelector('.song-name');
let artistName = document.querySelector('.artist-name');
let songList = document.querySelector('.song-list');
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// Define songs array with metadata
let songs = [
    {
        id: 1,
        title: "Let Me Love You",
        artist: "Unknown Artist",
        album: "NCS Releases",
        duration: "3:45",
        filePath: "1.mp3",
        coverPath: "1.jpg"
    },
    {
        id: 2,
        title: "On & On",
        artist: "Cartoon",
        album: "NCS Releases",
        duration: "3:28",
        filePath: "2.mp3",
        coverPath: "2.jpg"
    },
    {
        id: 3,
        title: "Invincible",
        artist: "DEAF KEV",
        album: "NCS Releases",
        duration: "4:16",
        filePath: "3.mp3",
        coverPath: "3.jpg"
    },
    {
        id: 4,
        title: "Heroes Tonight",
        artist: "Janji",
        album: "NCS Releases",
        duration: "3:27",
        filePath: "4.mp3",
        coverPath: "4.jpg"
    },
    {
        id: 5,
        title: "Sky High",
        artist: "Elektronomia",
        album: "NCS Releases",
        duration: "3:20",
        filePath: "5.mp3",
        coverPath: "5.jpg"
    },
    {
        id: 6,
        title: "Symbolism",
        artist: "Electro-Light",
        album: "NCS Releases",
        duration: "4:30",
        filePath: "6.mp3",
        coverPath: "6.jpg"
    },
    {
        id: 7,
        title: "Why We Lose",
        artist: "Cartoon",
        album: "NCS Releases",
        duration: "3:42",
        filePath: "7.mp3",
        coverPath: "7.jpg"
    },
    {
        id: 8,
        title: "Mortals",
        artist: "Warriyo",
        album: "NCS Releases",
        duration: "3:50",
        filePath: "8.mp3",
        coverPath: "8.jpg"
    },
    {
        id: 9,
        title: "Firefly",
        artist: "Jim Yosef",
        album: "NCS Releases",
        duration: "3:15",
        filePath: "9.mp3",
        coverPath: "9.jpg"
    },
    {
        id: 10,
        title: "Life",
        artist: "Tobu",
        album: "NCS Releases",
        duration: "3:35",
        filePath: "10.mp3",
        coverPath: "10.jpg"
    }
];

// Function to populate the song list
function populateSongList() {
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.setAttribute('data-index', index);
        
        songItem.innerHTML = `
            <div class="song-number">${index + 1}</div>
            <div class="song-details">
                <img src="${song.coverPath}" alt="${song.title}" class="song-img">
                <div>
                    <div class="song-name">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
            </div>
            <div class="song-album">${song.album}</div>
            <div class="song-duration">${song.duration}</div>
        `;
        
        songList.appendChild(songItem);
        
        // Add click event to each song item
        songItem.addEventListener('click', () => {
            songIndex = index;
            playSong();
        });
    });
    
    // Update song items reference after populating
    songItems = document.querySelectorAll('.song-item');
}

// Function to play the selected song
function playSong() {
    // Reset all active states
    songItems.forEach(item => item.classList.remove('active'));
    
    // Set active state to current song
    songItems[songIndex].classList.add('active');
    
    // Update player with song info
    const currentSong = songs[songIndex];
    audioElement.src = currentSong.filePath;
    songImg.src = currentSong.coverPath;
    songName.textContent = currentSong.title;
    artistName.textContent = currentSong.artist;
    totalTimeEl.textContent = currentSong.duration;
    
    // Play the song
    audioElement.play();
    isPlaying = true;
    masterPlay.classList.add('playing');
    
    // Scroll to the active song in the list
    songItems[songIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Function to pause the song
function pauseSong() {
    audioElement.pause();
    isPlaying = false;
    masterPlay.classList.remove('playing');
}

// Function to toggle play/pause
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Function to play next song
function nextSong() {
    if (isShuffle) {
        // Play a random song
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === songIndex && songs.length > 1);
        
        songIndex = newIndex;
    } else {
        // Play next song in order
        songIndex = (songIndex + 1) % songs.length;
    }
    
    playSong();
}

// Function to play previous song
function previousSong() {
    if (audioElement.currentTime > 3) {
        // If more than 3 seconds have passed, restart current song
        audioElement.currentTime = 0;
    } else {
        // Otherwise, go to previous song
        songIndex = (songIndex - 1 + songs.length) % songs.length;
        playSong();
    }
}

// Function to update progress bar
function updateProgress() {
    const { currentTime, duration } = audioElement;
    
    // Update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Update time displays
    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
}

// Function to set progress when clicking on progress bar
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioElement.duration;
    
    audioElement.currentTime = (clickX / width) * duration;
}

// Function to toggle shuffle
function toggleShuffle() {
    isShuffle = !isShuffle;
    document.getElementById('shuffle').style.color = isShuffle ? '#1db954' : '#b3b3b3';
}

// Function to toggle repeat
function toggleRepeat() {
    isRepeat = !isRepeat;
    document.getElementById('repeat').style.color = isRepeat ? '#1db954' : '#b3b3b3';
    audioElement.loop = isRepeat;
}

// Initialize the player
function initializePlayer() {
    // Populate the song list
    populateSongList();
    
    // Set up event listeners
    masterPlay.addEventListener('click', togglePlay);
    document.getElementById('previous').addEventListener('click', previousSong);
    document.getElementById('next').addEventListener('click', nextSong);
    document.getElementById('shuffle').addEventListener('click', toggleShuffle);
    document.getElementById('repeat').addEventListener('click', toggleRepeat);
    
    // Progress bar events
    const progressBar = document.querySelector('.progress-bar');
    progressBar.addEventListener('click', setProgress);
    
    // Time update event
    audioElement.addEventListener('timeupdate', updateProgress);
    
    // Song ended event
    audioElement.addEventListener('ended', () => {
        if (!isRepeat) {
            nextSong();
        } else {
            playSong();
        }
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            nextSong();
        } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            previousSong();
        }
    });
    
    // Play all button
    document.querySelector('.play-all-btn').addEventListener('click', () => {
        songIndex = 0;
        playSong();
    });
    
    // Shuffle button in header
    document.querySelector('.shuffle-btn').addEventListener('click', () => {
        isShuffle = !isShuffle;
        document.querySelector('.shuffle-btn').style.color = isShuffle ? '#1db954' : '#b3b3b3';
        document.getElementById('shuffle').style.color = isShuffle ? '#1db954' : '#b3b3b3';
    });
}

// Initialize the player when the window loads
window.addEventListener('load', initializePlayer);



// Mobile menu functionality
const mobileMenuBtn = document.createElement('button');
mobileMenuBtn.className = 'mobile-menu-btn';
mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('.topbar').prepend(mobileMenuBtn);

const sidebar = document.querySelector('.sidebar');
const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Close menu when clicking on a menu item
document.querySelectorAll('.menu-item, .playlist-item').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
});
