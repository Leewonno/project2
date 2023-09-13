const { Song, ChatRoom, Playlist, Chat_member, P_like, User } = require('../database/db');
const { Sequelize, Op } = require('sequelize');

exports.controller = {
  mainPage: async (req, res) => {
    try {
      let likeResult = false;
      const limit = 6;
      const playlistData = [];
      const whereClause = {};
      const attributes = [ 'id', 'title', 'artist', 'cover_url', 'song_url', 'like']

      const genres = await Song.findAll({ attributes: ['genre'], raw: true });
      const uniqueGenres = [...new Set(genres.map(song => song.genre))];
      console.log(uniqueGenres)

      const recentSongs = await getSongData(whereClause, attributes, limit, [['release_date', 'DESC']]);
      const likedSongs = await getSongData(whereClause, attributes, limit, [['like', 'DESC']]);
      const genreSongs = await getSongData({ genre: '댄스' }, attributes, limit, [['release_date', 'DESC']]);

      const chatMembers = await ChatRoom.findAndCountAll({
        attributes: ['name', 'tag', 'id', 'cover_img'],
        limit: limit,
        order: [['member', 'DESC']],
      })
      
      const playlists = await Playlist.findAndCountAll({
        attributes: ['name', 'song_ids', 'id', 'like'],
        limit: limit,
        order: [['like', 'DESC']],
      })
    
      for(const playlist of playlists.rows) {
        const coverArr = [];
        let coverResult = false;

        if(playlist.song_ids) {
          // 1. 먼저 song_ids 문자열을 새로운 배열로 만들기
          let numbers = playlist.dataValues.song_ids.match(/\d+/g);

          // 2. 배열의 길이 체크해서 0~3이면 numbers[0] 인덱스 주소만 가져오게, 4이상이면 3번째 인덱스까지만 나올 수 있게 
          if (numbers.length >= 4) {
            // numbers 배열의 길이가 4 이상인 경우, 3번째 인덱스까지 가져오기
            coverResult = true
            for (let i = 0; i < Math.min(4, numbers.length); i++) {
              const song = await Song.findOne({ where: { id: numbers[i] } });
              coverArr.push(song.cover_url);
            }
          } else if (numbers.length > 0) {
            // numbers 배열의 길이가 0에서 3 사이인 경우, 0번째 인덱스만 가져오기
            const song = await Song.findOne({ where: { id: numbers[0] } })
            coverArr.push(song.cover_url)
          } 
        } else if (playlist.song_ids = null) {
          coverArr = ['https://kdt-wonno2.s3.ap-northeast-2.amazonaws.com/img/n_img.png'];
        }

              // 유저 플리 좋아요 체크 
        if (req.userid) {
          const likeData = await P_like.findOne({ where: { p_id: playlist.id, userid: req.userid } })
          console.log(':::::::::::::::::::::',likeData); 
            if(likeData) {
              likeResult = true
            } else {
              likeResult =false
            }
        }
        console.log(likeResult);

        const playItem = {
          id: playlist.id,
          name: playlist.name,
          cover: coverArr,
          like: playlist.like,
          result: coverResult,
          likeResult: likeResult
        }
        playlistData.push(playItem);
      }
      console.log(playlistData);

      // 데이터를  객체에 추가
      const data = {
        recent: recentSongs.rows.map(result => result.dataValues),
        like: likedSongs.rows.map(result => result.dataValues),
        genre: genreSongs.rows.map(result => result.dataValues),
        chatRoom: chatMembers.rows.map(result => result.dataValues),
        playlist: playlistData,
        genreMenu: uniqueGenres
        
      };

      console.log(data.chatRoom)
      res.render('index', { data });
    } catch (error) {
      // 오류 처리
      console.log(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  getChatListPage: async (req, res) => {
    try {
      let id = req.userid;
      let joinChatarray = [];
      let room_bestArray = [];
      console.log(id);
      const bestRoom = await ChatRoom.findAll({ order: [['member', 'DESC']], limit: 5 });
      for (let i = 0; i < bestRoom.length; i++) {
        room_bestArray.push({ name: bestRoom[i].name, cover_img: bestRoom[i].cover_img, member: bestRoom[i].member });
      }

      let chat_tagArray = [];

      const chat_tag = await ChatRoom.findAll({
        where: { tag: 'girlgroup' },
        order: [['member', 'DESC']],
        limit: 5,
      });
      for (let i = 0; i < chat_tag.length; i++) {
        chat_tagArray.push({ name: chat_tag[i].name, cover_img: chat_tag[i].cover_img, member: chat_tag[i].member });
      }
      console.log(chat_tagArray);
      if (!id) {
        res.render('chatlist', { joinChat: null, best: room_bestArray, tag: chat_tagArray });
      } else {
        const joinchat = await Chat_member.findAll({ where: { userid: id } });
        if (joinchat) {
          for (let i = 0; i < joinchat.length; i++) {
            let rName = await ChatRoom.findOne({ where: { id: joinchat[i].chatroom_id } });
            joinChatarray.push({ name: rName.name, cover_img: rName.cover_img });
          }
        }
        res.render('chatlist', { joinChat: joinChatarray, best: room_bestArray, tag: chat_tagArray });
      }
    } catch (error) {
      console.log(error);
    }

    //   console.log(allChatRoom.dataValues.name);
  },
  getSearchPage: async (req, res) => {
    try {
      const q = req.query.q;
      console.log(q);

      // Chatroom 톡방, 태그
      const chatroomResults = await ChatRoom.findAll({
        attributes: ['name', 'cover_img'],
        where: {
          [Op.or]: [{ name: { [Op.like]: `%${q}%` } }, { tag: { [Op.like]: `%${q}%` } }],
        },
      });

      // Playlist 이름
      const playlistResults = await Playlist.findAll({
        attributes: ['name', 'userid', 'like'],
        where: {
          name: { [Op.like]: `%${q}%` },
        },
      });

      const  artistResults = await Song.findAll({
        attributes: ['title', 'id', 'artist', 'cover_url', 'song_url'],
        where: {
          artist: { [Op.like]: `%${q}%` }
        },
      });
  
      const titleResults = await Song.findAll({
        attributes: ['title', 'id', 'artist', 'cover_url', 'song_url'],
        where: {
            title: { [Op.like]: `%${q}%` } ,
        },
      });

      // 가사 검색
      const lyricsResults = await Song.findAll({
        attributes: ['title', 'id', 'artist', 'cover_url', 'song_url', 'lyrics'],
        where: {
          lyrics: { [Op.like]: `%${q}%` },
        },
      });

      // 데이터를 객체에 추가
      const data = {
        chatroom: chatroomResults.map(result => result.dataValues),
        playlist: playlistResults.map(result => result.dataValues),
        artist: artistResults.map(result => result.dataValues),
        title: titleResults.map(result => result.dataValues),
        lyrics: lyricsResults.map(result => result.dataValues),
      };
      console.log(data);

      res.render('search', { data });

    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  // 플레이리스트 좋아요
  likeToggle: async (req, res) => {
    try {

      const user = await User.findOne({
          where: { userid: req.userid },})  
      
      const { id } = req.body;
      console.log(id, req.userid);
  
      const existLike = await P_like.findOne({ where: { p_id: id, userid: req.userid } });
      console.log('existLike', existLike);
      const playlist = await Playlist.findOne({ where: { id }});
      console.log('playlist', playlist)
  
      if(existLike) {
        await P_like.destroy({ where: { p_id: id, userid: req.userid } });
        playlist.like -= 1;
        await playlist.save();
        console.log(playlist.like)
        res.send({ count: playlist.like, liked: false, message: "like cancel success" });
      } else {
        await P_like.create({ p_id: id, userid: req.userid });
        playlist.like += 1;
        await playlist.save();
        console.log(playlist.like)
        res.send({ count: playlist.like, liked: true, message: "like success" });
      }
  
    } catch (error) {
      console.log(error)
      // 기타 오류
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  getByMenuGenre: async (req, res) => {
    try {
      const limit = 6;
      const sort = req.query.genre;
      const whereClause = { genre: sort };
      const attributes = [ 'id', 'title', 'artist', 'cover_url', 'song_url', 'like']

      const genreSongs = await getSongData(whereClause, attributes, limit, [['release_date', 'DESC']]);

      const genreData = {
        genre: genreSongs.rows.map(result => result.dataValues)
      }
      res.status(200).send({ genreData });
    } catch (error) {
         console.log(error)
      // 기타 오류
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }
};

async function getSongData(whereClause, attributes, limit, order) {
  return await Song.findAndCountAll({ where: whereClause, attributes, limit, order });
}