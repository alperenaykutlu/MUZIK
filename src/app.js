const addBtn = document.getElementById('add-btn');
const forwardBtn = document.getElementById('forward');
const backBtn = document.getElementById('back');
const playBtn = document.getElementById('play');
const timeDisplay = document.getElementById('time');
const songNameDisplay = document.getElementById('songName');
const audioList = document.getElementById('target-ul');
const repeatBtn = document.getElementById('repeat');
const icon = playBtn.querySelector("i");
const shuffleBtn = document.getElementById('shuffle');
const volumeValue = document.getElementById('volumeControl');
const timeControl = document.getElementById('sureGosterim');

let isFinished = false;
let isPlaying = false;
let audio = new Audio();


addBtn.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile();
    if (filePath) {

        const fileName = filePath[0].split('\\').pop().split('-').pop().split('.')[0];
        const listItem = document.createElement('li');
        listItem.textContent = fileName;
        audio.load();
        listItem.classList.add('audio-item');
        listItem.addEventListener('click', () => {
            audio.src = `file://${filePath}`;
            listItem.setAttribute("data-src", `file://${filePath}`);

            audio.play();
            icon.classList.remove("fa-play");
            icon.classList.add("fa-pause");
            songNameDisplay.textContent = fileName;
            playBtn.disabled = false;
            timeDisplay.textContent = '00:00/00:00';
        });
        audioList.appendChild(listItem);
    }
});

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
    } else {
        audio.pause();
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
    }
});

volumeValue.addEventListener("input", () => {

    audio.volume = volumeValue.value;
});

audio.addEventListener("loadedmetadata", () => {
    timeControl.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    timeControl.value = Math.floor(audio.currentTime);
});

timeControl.addEventListener("input", () => {
    audio.currentTime = timeControl.value;
})

audio.addEventListener('play', () => {
    isPlaying = true;
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");

}
);

let repeatMode = "none";

audio.addEventListener('ended', () => {


    const items = [...audioList.querySelectorAll('.audio-item')];
    const currentIndex = items.findIndex(item => item.textContent === songNameDisplay.textContent);
    if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
        return;
    }

    if(isShuffle === "one") {
        randomItem();
        return;
    }
    else if (isShuffle === "none" && repeatMode === "none") {
        if (currentIndex !== -1) {
            const nextIndex = (currentIndex + 1) % items.length;
            const nextItem = items[nextIndex];

            const src = nextItem.getAttribute("data-src");

            songNameDisplay.textContent = nextItem.textContent;
            audio.src = src;
            audio.play();


            nextItem.click();
        }
        }




});

function randomItem() {
    const items = [...audioList.querySelectorAll('.audio-item')];
    if (items.length === 0) return;

    const currentIndex = items.findIndex(item => item.textContent === songNameDisplay.textContent);

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * items.length);
    }
    while (randomIndex === currentIndex && items.length > 1);

    const nextItem = items[randomIndex];
    const src = nextItem.getAttribute("data-src");

    songNameDisplay.textContent = nextItem.textContent;
    audio.src = src;
    audio.play();
    nextItem.click();
}


audio.addEventListener('pause', () => {
    isPlaying = false;
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
});

audio.addEventListener('timeupdate', () => {
    const current = updateTimeDisplay(audio.currentTime);
    const duration = updateTimeDisplay(audio.duration);
    timeDisplay.textContent = `${current} / ${duration} `;
});

function NextSong() {
    const items = [...audioList.querySelectorAll('.audio-item')];
    const currentIndex = items.findIndex(item => item.textContent === songNameDisplay.textContent);
    if (currentIndex !== -1) {
        const nextIndex = (currentIndex + 1) % items.length;
        const nextItem = items[nextIndex];


        const src = nextItem.getAttribute("data-src");

        songNameDisplay.textContent = nextItem.textContent;
        audio.src = src;
        audio.play();

        // Event tetiklemek istersen:
        nextItem.click();
    }
}

forwardBtn.addEventListener('click', () => {

    if (isShuffle === "none" && repeatMode === "none") {
        NextSong();
    }

     if (isShuffle === "one") {

        randomItem();
    }

});

backBtn.addEventListener('click', () => {
    const items = [...audioList.querySelectorAll('.audio-item')];
    const currentIndex = items.findIndex(item => item.textContent === songNameDisplay.textContent);

    if (currentIndex !== -1) {
        const preIndex = (currentIndex - 1 + items.length) % items.length;

        const preItem = items[preIndex];

        const src = preItem.getAttribute("data-src") || preItem.textContent;
        songNameDisplay.textContent = preItem.textContent;
        audio.src = src;
        audio.play();


        preItem.click();
    }
});


repeatBtn.addEventListener('click', () => {


    if (repeatMode === "none") {
        repeatMode = "one"
        repeatBtn.classList.toggle("active");

    }

    else {
        repeatMode = "none";
        repeatBtn.classList.remove("active")

    }
});

let isShuffle = "none";
shuffleBtn.addEventListener('click', () => {
    if (isShuffle === "none") {
        isShuffle = "one"
        shuffleBtn.classList.toggle("active");

    }

    else {
        isShuffle = "none";
        shuffleBtn.classList.remove("active")

    }
})

function updateTimeDisplay(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} `;
}