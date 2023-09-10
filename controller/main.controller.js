const { Song, ChatRoom, Playlist } = require('../database/db');
const { Sequelize, Op } = require('sequelize');

exports.controller = {
  mainPage: async (req, res) => {
    try {
      const limit = 6;
      const whereClause = {};

      // 최신순으로 정렬된 데이터 가져오기
      const recentSongs = await Song.findAndCountAll({
        where: whereClause,
        limit: limit,
        order: [['release_date', 'DESC']],
      });

      // 좋아요순으로 정렬된 데이터 가져오기
      const likedSongs = await Song.findAndCountAll({
        where: whereClause,
        limit: limit,
        order: [['like', 'DESC']],
      });

      // 장르는 임의로 지정해줘야 함
      const genreSongs = await Song.findAndCountAll({
        where: { genre: '록/메탈' },
        limit: limit,
        order: [['release_date', 'DESC']],
      });

      // 데이터를 객체에 추가
      const data = {
        recent: [],
        like: [],
        genre: [],
      };

      for (const date of recentSongs.rows) {
        data.recent.push({
          id: date.id,
          title: date.title,
          artist: date.artist,
          cover_url: date.cover_url,
          song_url: date.song_url,
        });
      }

      for (const song of likedSongs.rows) {
        data.like.push({
          id: song.id,
          title: song.title,
          artist: song.artist,
          cover_url: song.cover_url,
          song_url: song.song_url,
        });
      }

      for (const song of genreSongs.rows) {
        data.genre.push({
          id: song.id,
          title: song.title,
          artist: song.artist,
          cover_url: song.cover_url,
          song_url: song.song_url,
        });
      }

      console.log(data);
      // console.log(jwt.decode(token))

      res.render('index', { data });
    } catch (error) {
      // 오류 처리
      console.log(error)
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },
  getChatListPage: async (req, res) => {
    const acr = [];
    try {
      const allChatRoom = await ChatRoom.findAll();

      for (let i = 0; i < allChatRoom.length; i++) {
        acr.push(allChatRoom[i].dataValues.name);
      }
      console.log('sdfa', acr);

      res.render('chatlist', { data: acr });
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
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { tag: { [Op.like]: `%${q}%` } },
          ],
        },
      });
  
      // Playlist 이름
      const playlistResults = await Playlist.findAll({
        attributes: ['name', 'userid', 'like'],
        where: {
          name: { [Op.like]: `%${q}%` },
        },
      });
  
      // 아티스트, 곡 제목 검색
      const artistAndTitleResults = await Song.findAll({
        attributes: ['title', 'id', 'artist', 'cover_url', 'song_url'],
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${q}%` } },
            { artist: { [Op.like]: `%${q}%` } },
          ],
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
        artist: artistAndTitleResults.map(result => result.dataValues),
        title: artistAndTitleResults.map(result => result.dataValues),
        lyrics: lyricsResults.map(result => result.dataValues),
      };
      console.log(data);
  
      res.render('search', { data });
  
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },
};
