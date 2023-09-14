getPlaylist()


async function playlistAdd(id, song_ids){
    console.log("id",id);
    const res = await axios({
        method:"post",
        url:"/playlist/song",
        data:{
            id,
            song_ids
        }
    })

    if(res.data.result){
        alert("추가완료");
    }
    else{
        alert("추가실패")
    }
}



var addSong;

function modelOpenBtn(id) {
    addSong = id;
    console.log(id);
    console.log(addSong)
    const modalOpen = document.querySelector("#myPlaylist");
    modalOpen.classList.remove("hidden")
}

async function getPlaylist(){
    const parent = document.querySelector('.wrapperMyPlaylist');

    const res = await axios({
        method:"GET",
        url:"/song/playlist",
    })

    if(res.data){
        for(let i = 0; i<res.data.playlists.length; i++){
            parent.innerHTML += `<div class="mainMyPlaylist" onclick="playlistAdd('${res.data.playlists[i].id}', addSong)">${res.data.playlists[i].name}</div>`
        }
        
    }
    console.log(res);
}




// const listModal = document.querySelector("#myPlaylist");
// const modalOpen = document.querySelector(".song_list_button");
// const modalClose = document.querySelector(".playlistButton");


// modalOpen.addEventListener("click", (e) => {
//     listModal.classList.remove('hidden');
// });

// modalClose.addEventListener("click", (e) => {
//     listModal.classList.add('hidden');
// });
// listModal.addEventListener("click", (e) => {
//     listModal.classList.add('hidden');
// })