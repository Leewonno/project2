async function s_like(num) {
    const like_element = document.querySelector('.playbar_like');
    // like_element.id = num;
    const id = num;

    try {
        const response = await axios.post('/song/like', {
            id
        });
        if (response.data.liked) {
            like_element.innerHTML = '<i class="fa-solid fa-heart" style="color: #ff6666;" ></i>';
        } else {
            like_element.innerHTML = '<i class="fa-regular fa-heart" style="color: #ff6666;"></i>';
        }
    } catch (error) {
        console.error('좋아요 토글에 실패했습니다.', error);
    }
}

async function s_like_check(num){
    const like_element = document.querySelector('.playbar_like');
    const id = num;
    console.log(id);

    const response = await axios({
        method:"get",
        url:"/song/like/check",
        params:{
            id,
        }
    });

    if (response.data.result) {
        like_element.innerHTML = '<i class="fa-solid fa-heart" style="color: #ff6666;" ></i>';
    } else {
        like_element.innerHTML = '<i class="fa-regular fa-heart" style="color: #ff6666;"></i>';
    }
}