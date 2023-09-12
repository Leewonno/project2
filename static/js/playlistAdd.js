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