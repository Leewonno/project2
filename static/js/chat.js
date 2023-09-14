function talk(roomname) {
    window.open(`/chat?room=${roomname}`, 'Child', 'width=400, height=500, top=50, left=50');
}