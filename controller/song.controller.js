const db = require('../database/db')

exports.getSongInfoPage = (req, res)=>{
    res.render("song");
}

exports.getSongUploadPage = (req, res)=>{
    res.render("song_upload");
}

exports.insertSongByAdmin = async (req, res) => {
  try {

    // 곡 제목, 아티스트명, 앨범명, 가사, 작사가, 작곡가, 장르, 재생시간, 발매일, 커버 사진(url), 음원 파일(url)
    const { title, 
      artist, album, lyrics, 
      writer, composer, genre, 
      playtime, release_date,
      song, cover } = req.body;
    // const resData = {
    //     title: title, 
    //     artist: artist, 
    //     album: album, 
    //     lyrics: lyrics, 
    //     writer: writer,
    //     composer: composer, 
    //     genre: genre, 
    //     playtime: playtime, 
    //     release_date: release_date, 
    // }

    const songData = await db.Song.create({title, artist, album, lyrics, writer, 
      composer, genre, playtime, release_date, 
      song_url: song, cover_url: cover});
    res.send(songData)
  } catch (error) {
    console.log(error)
    res.status(500).send({message: error});
  }
}
