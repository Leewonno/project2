const audio = document.getElementById("player");
const play = document.getElementById("play");
const play_icon = document.getElementById("play_icon");
const volume_status = document.getElementById("volume_status");
const mute = document.getElementById("mute_button");
const volume_icon = document.getElementById("volume_button");
const volume_bar = document.getElementById("volume_status");
const currentTime = document.querySelector(".player_time_current");
const totalTime = document.querySelector(".player_time_total");
const timelineBar = document.querySelector(".music_bar");
const musicbarBackground = document.querySelector(".musicbar_background");


let volume = audio.volume;
let volume_stick = volume_bar.value

audio.volume = 0.5;

play.addEventListener('click', (e)=>{
    if(play.checked == true){
        console.log(audio.duration);
        console.log(audio.currentTime);
        console.log("aa", volume_bar.value)
        audio.play();
        play_icon.className = "fa-solid fa-pause";
    }
    else{
        audio.pause();
        play_icon.className = "fa-regular fa-circle-play fa-lg";
    }
})

mute.addEventListener("click", (e) => {
    if(mute.checked == true) {
        volume = audio.volume;
        volume_stick = volume_bar.value;
        audio.volume = 0;
        volume_bar.value = 0;
        volume_icon.className = "fa-solid fa-volume-xmark";
    }
    else {
        audio.volume = volume;
        volume_bar.value = volume_stick;
        volume_icon.className = "fa-solid fa-volume-low";
    }
})

audio.addEventListener('ended', (e)=>{
    play_icon.className = "fa-regular fa-circle-play fa-lg";
})

volume_status.addEventListener("mousemove", function(e) {
    audio.volume = this.value/100;
})

volume_status.addEventListener("click", function(e) {
    audio.volume = this.value/100;
})

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substr(14, 5);

audio.addEventListener("loadeddata", function(e) {
    totalTime.innerText = formatTime(Math.floor(audio.duration));
    timelineBar.max = Math.floor(audio.duration);
})

audio.addEventListener("timeupdate", function(e) {
    currentTime.innerText = formatTime(Math.floor(audio.currentTime));
    timelineBar.value = Math.floor(audio.currentTime);
    const remainRatio = ((audio.duration - audio.currentTime) / audio.duration) * 100;
    musicbarBackground.style.width = `${remainRatio}%`
})

timelineBar.addEventListener("click", function(e) {
    const {target: {value}} = e;
    audio.currentTime = value;
})


// playlist창 띄우기
function openModal() {
    const modal = document.querySelector('.modal_open');
    modal.style.bottom = '0';
    modal.removeAttribute('hidden');
  };
  
function closeModal() {
    const modal = document.querySelector('.modal_open');
    modal.style.bottom = '-100%';
    modal.setAttribute('hidden', 'true');
  };

function music(route){
    const now = document.getElementById("player");
    now.src = "/stream?name=" + route;
    now.play();
    play.checked = true;
    play_icon.className = "fa-solid fa-pause";
}
