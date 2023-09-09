const { Song, ChatRoom } = require('../database/db');
const jwt = require("jsonwebtoken");

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
  getSearchPage: (req, res) => {
    res.render('search');
  },
};
