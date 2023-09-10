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

async function music(song_id){
    const now = document.getElementById("player");
    const p_song_cover = document.querySelector(".song_cover");
    const p_artist_name = document.querySelector(".song_singer");
    const p_song_name = document.querySelector(".song_name");
    const song_cover = document.querySelector(".m_song_cover");
    const artist_name = document.querySelector(".song_info .artist_name");
    const song_name = document.querySelector(".song_info .song_title");

    const res = await axios({
        method:"GET",
        url:"/song/play",
        params:{
            id:song_id
        }
    })

    if(res.data.result){
        const {song_url, title, artist, album, lyrics, genre, cover_url} = res.data.songResult;

        p_song_cover.src = cover_url;
        p_artist_name.textContent = artist;
        p_song_name.textContent = title;

        song_cover.src = cover_url;
        artist_name.textContent = artist;
        song_name.textContent = title;

        song_url_temp = song_url.split('/');
        song_url_temp = song_url_temp[3] + "/" + song_url_temp[4];

        now.src = "/stream?name=" + song_url_temp;
        now.play();
        play.checked = true;
        play_icon.className = "fa-solid fa-pause";
    }
    else{
        alert("재생 중 오류가 발생했습니다.")
    }   
}


let now_play = 0;
let pl =[];

async function playlist(num){
    // axios({
    //     method:"get",
    //     url:"/playlist"
    // })
    // 플리 받아왔다는 가정하에
    pl = ["9", "14", "16"];
    
    
}

$('.modal_open').click(function(e) {
    if(!$(e.target).hasClass("toggle") && !$(e.target).hasClass("label")) {
        console.log(e.target);
        $("input[type=checkbox]").prop("checked", false);
    }
});


/* -------------------------------------- 드래그 앤 드롭 움직이기 -------------------------------------- */ 
let dragElement = null;

// 드래그가 시작될 때 호출되는 함수
function dragStart(e) {
  dragElement = this;
  this.style.opacity = '0.5';

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

// 드래그 중 마우스 포인터 위치를 확인하여 순서 변경
function handleDragOver(e) {
  e.preventDefault();
}

// 드롭이 완료될 때 호출되는 함수
function handleDrop(e) {
  if (dragElement != this) {
    console.log(this)
    // 드래그한 요소와 드롭 대상 요소의 내용을 교체합니다.
    const temp = this.innerHTML;
    this.innerHTML = dragElement.innerHTML;
    dragElement.innerHTML = temp;
  }

  // 드롭 완료 후 요소를 다시 표시하기 위해 opacity를 원래대로 설정
  dragElement.style.opacity = '1';

  return false;
}

const draggableElements = document.querySelectorAll('.modal_playlist_detail');

draggableElements.forEach((elem) => {
  elem.addEventListener('dragstart', dragStart);
  elem.addEventListener('dragover', handleDragOver);
  elem.addEventListener('dragenter', (e) => e.preventDefault());
  elem.addEventListener('drop', handleDrop);
});
