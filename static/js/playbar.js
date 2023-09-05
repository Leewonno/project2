const audio = document.getElementById("player");
const play = document.getElementById("play");
const play_icon = document.getElementById("play_icon");
const volume_status = document.getElementById("volume_status");

audio.volume = 0.5;

play.addEventListener('click', (e)=>{
    if(play.checked == true){
        console.log(audio.duration);
        console.log(audio.currentTime);
        audio.play();
        play_icon.className = "fa-solid fa-pause";
    }
    else{
        audio.pause();
        play_icon.className = "fa-regular fa-circle-play fa-lg";
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