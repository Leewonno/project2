const { S_like } = require('../database/db');
const db = require('../database/db')

exports.getSongInfoPage = (req, res)=>{
    res.render("song");
}

exports.getSongUploadPage = (req, res)=>{
    res.render("song_upload");
}

exports.uploadImg = (req, res) => {
  console.log(req.file);
  res.send(req.file);
}

exports.uploadSong = (req, res) => {
  console.log(req.file);
  res.send(req.file);
}

exports.insertSongByAdmin = async (req, res) => {
  try {

    // 곡 제목, 아티스트명, 앨범명, 가사, 작사가, 작곡가, 장르, 재생시간, 발매일, 커버 사진(url), 음원 파일(url)
    const { title, artist, album, lyrics, 
      writer, composer, genre, playtime, 
      release_date, song_url, cover_url } = req.body;
    const songData = await db.Song.create({title, artist, album, 
      lyrics, writer, composer, genre, playtime, release_date, 
      song_url, cover_url, like: 0});
    res.send(songData)
  } catch (error) {
    console.log(error)
    res.send({message: error});
  }
}

exports.getSongInfo = async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    const songData = await db.Song.findOne({where: {id: id}});
    res.send(songData)
  } catch (error) {
    console.log(error)
    res.send({message: error});
  }
}

exports.getSongBySortInMain = async (req, res) => {
  try {
    const sort = req.query;
    console.log('req.query', sort);
    const limit = 5;
    const whereClause = {};
    let order = [];
    const resultSong = [];

    if (sort === 'date') {
      order = [['release_date', 'DESC']];
    } 
    const songs = await db.Song.findAndCountAll({
      where: whereClause,
      limit,
      order: order
    })
      
    for (const song of songs.rows) {

    resultSong.push( {
      id: song.id,
      title: song.title,
      artist: song.artist,
      cover_url: song.cover_url
    })
  }

    res.send(resultSong);

  } catch (error) {
     console.log(error)
    res.send({message: error});
  }
}

exports.likeToggle = async (req, res) => {
  try {
    const {id, userid} = req.body;
    console.log(id, userid);

    const existLike = await db.S_like.findOne({ where: { song_id: id, userid: userid } });
    console.log('existLike', existLike);
    const song = await db.Song.findOne({ where: { id }});
    console.log('song', song)

    if(existLike) {
      await db.S_like.destroy({ where: { song_id: id, userid: userid } });
      song.like -= 1;
      await song.save();
      res.send({ liked: false, message: "like cancel success" });
    } else {
      await db.S_like.create({ song_id: id, userid: userid });
      song.like += 1;
      await song.save();
      res.send({ liekd: true, message: "like success" });
    }

  } catch (error) {
    console.log(error)
    res.send({message: error});
  }
}