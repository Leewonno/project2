const { where } = require('sequelize');
const models = require('../database/db');
const jwt = require("jsonwebtoken");

exports.getPlaylist = async (req, res)=>{
  try{
    const id = req.query.id;
    const playlists = await models.Playlist.findOne({
      where: {id },
    }); // -> 배열로 플레이리스트 id 값 

    res.send(playlists);
  }
  catch(err){
    res.send(false);
    console.log(err);
  }
}

exports.getPlayListPage = async (req, res) => {
  try {
    const userId = req.userid;
  //  console.log(userId);

    const myPlaylistInfo = [];
    const likeListInfo = [];
    let result = false;

    // 내가 만든 플레이리스트 목록 
    const playlists = await models.Playlist.findAll({
      where: {userid: userId},
    }); // -> 배열로 플레이리스트 id 값 
    // 
    for (const playlist of playlists) {
      const like = await models.P_like.findOne({ where: { p_id: playlist.id }});
      if(like) {
        result = true
      } else {
        result = false
      }
      const item = {
        id: playlist.id,
        name: playlist.name,
        result: result
      }
      myPlaylistInfo.push(item);
    }
    const likedPlaylists = await models.P_like.findAll({
      where: { userid: userId },
      attributes: ['p_id'],
    });

    for( const likeList of likedPlaylists) {
      const playlist = await models.Playlist.findOne({ where: { id: likeList.p_id} })
      const item = {
        id:playlist.id,
        name: playlist.name,
        result: true
      }
      likeListInfo.push(item);
    }
    data = {
      myPlaylist: myPlaylistInfo,
      likedPlaylist: likeListInfo,
    }
    console.log(data.myPlaylist)
    console.log(data.likedPlaylist)
    res.render('playlist', {data});
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving playlists');
  }
};

exports.postPlayListLike = async (req, res) => {
  try {
    const userId = req.userid;
    const id = req.body.id;

    if (typeof id === 'undefined' || id === null) {
      return res.status(400).send({ message: 'Invalid p_id' });
    }

    const [pLike, created] = await models.P_like.findOrCreate({
      where: { p_id: id, userid: userId },
    });

    console.log(pLike, created);

    const playlist = await models.Playlist.findOne({ where: { id } });
    console.log("playlist",playlist);

    console.log("pl", playlist);

    if (!created) {
      await pLike.destroy();
      playlist.like -= 1;
      await playlist.save();
      res.json({ liked: false, message: "like cancel success" });
    } else {
      playlist.like += 1;
      await playlist.save();
      res.json({ liked: true, message: "like success" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.postPlayListPage = async (req, res) => {
  try {
    const playlist = await models.Playlist.create({
      tags:req.body.pl_tag,
      name: req.body.pl_name,
      userid: req.userid,
    });
    res.json({ result:true, message: 'Playlist created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result:false, message: 'Error creating playlist' });
  }

};

exports.postPlayListSong = async (req,res) => {
  try {
    const playlistId = req.body.id;
    const songIds = req.body.song_ids;

    const row = await models.Playlist.findOne({
      where: { id: playlistId },
      attributes: ['song_ids'],
    });

    console.log(row.song_ids);

    let addSongId
    if (row.song_ids === null) {
      addSongId = songIds;
    } else {
      addSongId = row.song_ids + "," + songIds ;
    };

    console.log(addSongId);

    const [songs, added] = await models.Playlist.update(
      { song_ids: addSongId },
      { where: { id: playlistId } }
    );

    console.log(songs, added);

    res.json({result:true, message: 'Add songs at Playlist successfully'});

  } catch (error) {
    console.error(error);
    res.status(500).json({result:false, message: 'Error Add songs at Playlist' });
  }
};

exports.postPlayListEdit = async (req,res) => {
  try {
    const playlistId = req.body.id;
    const songIds = req.body.song_ids;

    const row = await models.Playlist.update(
      { song_ids: songIds },
      { where: { id: playlistId } }
    );

      if (row) {
        res.json({res:true , message: 'Song Delete successfully'})
      } else {
        res.json({ res:false, message: 'Playlist Edit Error' })
      }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Playlist Edit Error' });
  }
}

exports.postPlaylistSongDelete = async (req,res) => {
  try{

  } catch (error) {

  }
}

exports.deletePlayList = async (req, res) => {
  try {
    const playlistId = req.body.id;

    const playlist = await models.Playlist.findOne({ where: { id: playlistId } });
    const p_like = await models.P_like.findOne({where: { p_id: playlistId }})

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    await playlist.destroy();
    await p_like.destroy();

    res.json({ result: true, message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
