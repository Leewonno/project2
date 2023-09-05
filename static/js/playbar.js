const audio = document.getElementById("player");
const play = document.getElementById("play");
const play_icon = document.getElementById("play_icon");
const volume_status = document.getElementById("volume_status");
const mute = document.getElementById("mute_button");
const volume_icon = document.getElementById("volume_button");
const volume_bar = document.getElementById("volume_status");
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
        volume_stick = volume_bar.value
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