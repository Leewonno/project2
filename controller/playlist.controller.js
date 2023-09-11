const models = require('../database/db');
const jwt = require("jsonwebtoken");

exports.getPlayListPage = async (req, res) => {
  try {
    const userId = req.userid;
    console.log(userId);

    const playlists = await models.Playlist.findAll({
      where: {userid: userId},
    });

    console.log(playlists);

    const playlistLikes = [];

    for (const playlist of playlists) {
      const playlistId = playlist.id;

      const likePlaylists = await models.P_like.findAll({
        where: {userid: userId, p_id: playlistId },
      });

      let result = false;

      if(likePlaylists){
        result = true
      }

      const likedPlaylists = await models.P_like.findAll({
        where: {userid: userId},
        where: {
          userid: userId,
        },
        attributes: ['p_id'],
      });
      
      const playlistLike = likedPlaylists.map(item => ({
        playlist: null,
        result: true,
      }));

      const playlistInfo = {
        playlist,
        result,
        playlistLike,
      }

      playlistLikes.push(playlistInfo);

      console.log(playlistLikes);

      

      console.log('선택된 p_id 값:', likedPlaylists.map(item => item.p_id));
      
      res.render('playlist', {playlistLikes});
    }
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

exports.deletePlayList = async (req, res) => {
  try {
    const playlistId = req.body.id;

    const playlist = await models.Playlist.findOne({ where: { id: playlistId } });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    await playlist.destroy();

    res.json({ result: true, message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.postPlayListPage = async (req, res) => {
  try {
    const playlist = await models.Playlist.create({
      name: req.body.pl_name,
      userid: req.userid,
    });
    res.json({ message: 'Playlist created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating playlist' });
  }
}
