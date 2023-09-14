const { Song, S_like, User, Comment, Profile } = require('../database/db');
const models = require('../database/db');
const { formatDateTime } = require('../utils/formatToKST');

exports.controller = {

  getSongUploadPage: (req, res)=>{
    res.render("song_upload");
  },

  getSortPage: async (req, res) => {
    try {
      
      const genres = await Song.findAll({ attributes: ['genre'], raw: true });
      
      const uniqueGenres = [...new Set(genres.map(song => song.genre))];
      console.log(uniqueGenres)
      
      res.render('sort', {genre: uniqueGenres});
    } catch (error) {
      console.error(error);
      // 기타 오류
      res.status(500).send({ message: 'Internal Server Error' });
    }

  },

  getPlaylist: async (req, res)=>{
    console.log(req, res);
    let playlists = [];
    try{
      if(req.userid) {
        playlists = await models.Playlist.findAll({
          where: {userid: req.userid},
        });
        // console.log('playlists', playlists);
        
      } 
      res.send({playlists});
    }catch(err){
      console.log(err);
    }
    
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
    let likeResult = false;
    let resultUser = {
      userid: null,
      nickname: null,
      profile_img: null
    };

    const id = req.query.id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const songData = await Song.findOne({ where: { id: id } });
    const resultComments = [];

    const { comments, hasMore } = await getCommentsBySongId(songData.id, page, pageSize);
    
    if (req.userid) {
      const likeData = await S_like.findOne({ where: { song_id: songData.id, userid: req.userid } })
      const userData = await Profile.findOne({ where: { userid: req.userid } });
      
      if (likeData) {
        likeResult = true;
      }
      resultUser = {
        userid: userData.userid,
        nickname: userData.nickname,
        profile_img: userData.profile_img
      }
    }
    
    return res.render('song', { data: songData.dataValues, user: resultUser, likeResult: likeResult, comments, hasMore });
    
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

  getPlaySongData: async (req, res) => {
    try {
      const id = req.query.id;

      const song = await Song.findOne({ where: { id: id } });
      const songResult = {
        title: song.title, 
        artist: song.artist, 
        album: song.album, 
        lyrics: song.lyrics, 
        genre: song.genre, 
        song_url: song.song_url,
        cover_url:song.cover_url,
        id: song.id,
      }

      res.send({result:true, songResult});

    } catch (error) {
      console.log(error)
      // 기타 오류
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  getSongBySort: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const sort = req.query.sort;
      const pageSize = 20;
      const limit = pageSize;
      const offset = (page - 1) * pageSize;
      const whereClause = {};
      let order = [];
  
      if (sort === 'date') {
        order = [['release_date', 'DESC']];
      } else {
        order = [['like', 'DESC']]
      }
      const songs = await Song.findAndCountAll({
        attributes: ['id', 'title', 'artist', 'cover_url', 'song_url', 'playtime'],
        where: whereClause,
        limit,
        offset,
        order: order
      })
  
      const totalRows = songs.count;
      const totalPages = Math.ceil(totalRows / pageSize); 
      const rowLength = songs.rows.length;
      const hasMore = page < totalPages; 
  
      console.log(rowLength, hasMore)
  
      res.status(200).send({ hasMore: hasMore, songs: songs.rows,});
    } catch (error) {
      console.log(error)
      // 기타 오류
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  getSongByGenre: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const sort = req.query.genre;
      const whereClause = { genre: sort };
      const pageSize = 20;
      const limit = pageSize;
      const offset = (page - 1) * pageSize;

      console.log(sort)

      const songs = await Song.findAndCountAll({
        attributes: ['id', 'title', 'artist', 'cover_url', 'song_url', 'playtime'],
        where: whereClause,
        limit,
        offset,
        order: [['release_date', 'DESC']]
      })
        
      // const resultSong = songs.rows.map((song) => ({
      //   id: song.id,
      //   title: song.title,
      //   artist: song.artist,
      //   cover_url: song.cover_url,
      //   song_url: song.song_url,
      //   playtime: song.playtime
      // }));
  
      const totalRows = songs.count;
      const totalPages = Math.ceil(totalRows / pageSize); 
      const rowLength = songs.rows.length;
      const hasMore = page < totalPages; 
  
      console.log(rowLength, hasMore)
  
      res.status(200).send({ hasMore: hasMore, songs: songs.rows,});
  
    } catch (error) {
      console.log(error)
      // 기타 오류
      res.status(500).send({ message: 'Internal Server Error' });
    }
  
  },
  
  likeToggle: async (req, res) => {
    try {

      const user = await User.findOne({
          where: { userid: req.userid },})  
      
      const { id } = req.body;
      console.log(id, req.userid);
  
      const existLike = await S_like.findOne({ where: { song_id: id, userid: req.userid } });
      console.log('existLike', existLike);
      const song = await Song.findOne({ where: { id }});
      console.log('song', song)
  
      if(existLike) {
        await S_like.destroy({ where: { song_id: id, userid: req.userid } });
        song.like -= 1;
        await song.save();
        res.send({ count: song.like, liked: false, message: "like cancel success" });
      } else {
        await S_like.create({ song_id: id, userid: req.userid });
        song.like += 1;
        await song.save();
        res.send({ count: song.like, liked: true, message: "like success" });
      }
  
    } catch (error) {
      console.log(error)
      // 기타 오류
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  createComment: async (req, res) => {
    try {
      const song_id = req.query.song_id;
      const { content } = req.body;
      console.log(req.userid)

      if(req.userid) {
        const comment = await Comment.create({ song_id, content, userid: req.userid });
        const user = await Profile.findOne({ where: { userid: req.userid } })
        const formattedDateTime = formatDateTime(comment.create_date);

        const resultCommet = {
          id:comment.id,
          profile_img: user.profile_img,
          userid: user.userid,
          nickname: user.nickname,
          content: comment.content,
          create_date: formattedDateTime
        }
        res.send({ comment: resultCommet });
      } else {
        res.status(401).send({ message: "잘못된 접근입니다." });
      }

  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
  }
  },

  updateComment: async (req, res) => {

    try {
          const {id, song_id, content} = req.body;

          if (req.userid) {

            const comment = await Comment.findOne({ where: { id }});
            if(comment) {
              await Comment.update({ content: content, update_date: new Date()},{ where: { id } })
              const updateComment = await Comment.findOne(
                { where: { id }}
              )
              const resultComment = {
                id: updateComment.id,
                userid: updateComment.userid,
                song_id: updateComment.song_id,
                content: updateComment.content,
                update_date: updateComment.update_date
              }
              res.send({result: true, comment: resultComment});
            } else { 
              res.status(404).send({ message: 'Comment not found' });
            }
          } 
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  
  },
  deleteComment: async (req, res) => {
    try {
      const id = req.body.id; 
      // const song_id = req.query.song_id;

      if (req.userid) {

        const comment = await Comment.findOne({ where: { id }});
        
        if(comment) {
          await Comment.destroy({ where: { id } })
          res.send({result: true, message: 'comment delete success'});
        } else {
          res.status(404).send({ message: 'Comment not found' });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  getCommentsByPage: async (req, res) => {
    try {
      const pageSize = 10;
      const page = req.query.page;
      const song_id = req.query.song_id;

      const data = await getCommentsBySongId(song_id, page, pageSize);

      if(data){
        res.send({result:true, data})
      }
      else{
        res.send({result:false})
      }

    } catch (error) {
      console.log(error);
      res.status(500).send({ result:false ,message: 'Internal Server Error' });
    }
  },

  getLike: async (req, res)=>{
    try {
      const likeData = await S_like.findOne({ where: { song_id: req.query.id, userid: req.userid } })
      if(likeData){
        res.send({result:true});
      }else{
        res.send({result:false});
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }
}

async function getCommentsBySongId(songId, page, pageSize) {
  try {
    const commentQuery = {
      where: { song_id: songId },
      order: [['create_date', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize
    };

    const commentData = await Comment.findAndCountAll(commentQuery);
    const resultComments = [];

    for (const comment of commentData.rows) {
      const userProfile = await Profile.findOne({ where: { userid: comment.userid } });
      comment.dataValues.nickname = userProfile.nickname;
      comment.dataValues.profile_img = userProfile.profile_img;

      const formattedDateTime = formatDateTime(comment.create_date);
      resultComments.push({
        id: comment.id,
        profile_img: comment.dataValues.profile_img,
        userid: comment.userid,
        nickname: comment.dataValues.nickname,
        content: comment.content,
        create_date: formattedDateTime
      });
    }

    const totalRows = commentData.count;
    const totalPages = Math.ceil(totalRows / pageSize);
    const hasMore = page < totalPages;

    return { comments: resultComments, hasMore, currentPage: page, totalPages };
  } catch (error) {
    console.error(error);
    throw error;
  }
}