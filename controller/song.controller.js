const { Song, S_like, User } = require('../database/db');
const jwt = require('jsonwebtoken');
const secret = 'asdfasdfa';

exports.controller = {

  getSongUploadPage: (req, res)=>{
    res.render("song_upload");
  },

  uploadImg: (req, res) => {
    console.log(req.file);
    res.send(req.file);
  },

  uploadSong: (req, res) => {
    console.log(req.file);
    res.send(req.file);
  }, 

  getSongInfoPage: async (req, res) => { try {
   
    const id = req.query.id;
    console.log(id);
    const songData = await Song.findOne({ where: { id: id } });
  
     console.log(songData.dataValues)

     res.render('song', { data: songData.dataValues });
  } catch (error) {
    console.error(error);
    // 기타 오류
    res.status(500).send({ message: 'Internal Server Error' });
  }

  },

  insertSongByAdmin: async (req, res) => {
    try {
  
      // 곡 제목, 아티스트명, 앨범명, 가사, 작사가, 작곡가, 장르, 재생시간, 발매일, 커버 사진(url), 음원 파일(url)
      const { title, artist, album, lyrics, 
        writer, composer, genre, playtime, 
        release_date, song_url, cover_url } = req.body;
      const songData = await Song.create({title, artist, album, 
        lyrics, writer, composer, genre, playtime, release_date, 
        song_url, cover_url, like: 0});
      res.send(songData)
    } catch (error) {
      console.log(error)
      // 기타 오류
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  getSongBySortInMain: async (req, res) => {
    try {
      const sort = req.query.sort;
      console.log('req.query', sort);
      const limit = 5;
      const whereClause = {};
      let order = [];
      const resultSong = [];
  
      if (sort === 'date') {
        order = [['release_date', 'DESC']];
      } 
      const songs = await Song.findAndCountAll({
        where: whereClause,
        limit,
        order: order
      })
        
      for (const song of songs.rows) {
  
      resultSong.push( {
        id: song.id,
        title: song.title,
        artist: song.artist,
        cover_url: song.cover_url,
        song_url: song.song_url
      })
    }
  
      res.send(resultSong);
  
    } catch (error) {
      console.log(error)
      // 기타 오류
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },
  
  likeToggle: async (req, res) => {
    try {
     
       const token = jwt.verify(req.query.token, secret);
       const user = await User.findOne({
          where: { userid: token.userid },})  
      
      const { id } = req.body;
      console.log(id, user.userid);
  
      const existLike = await S_like.findOne({ where: { song_id: id, userid: user.userid } });
      console.log('existLike', existLike);
      const song = await Song.findOne({ where: { id }});
      console.log('song', song)
  
      if(existLike) {
        await S_like.destroy({ where: { song_id: id, userid: user.userid } });
        song.like -= 1;
        await song.save();
        res.send({ count: song.like, liked: false, message: "like cancel success" });
      } else {
        await S_like.create({ song_id: id, userid: user.userid });
        song.like += 1;
        await song.save();
        res.send({ count: song.like, liked: true, message: "like success" });
      }
  
    } catch (error) {
      console.log(error)
      // 기타 오류
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }
}