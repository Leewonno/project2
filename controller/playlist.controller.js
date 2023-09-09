const models = require('../database/db');
const jwt = require("jsonwebtoken");

exports.getPlayListPage = async (req, res) => {
  try {
    const userId = req.userid;
    console.log(userId);
    const playlists = await models.Playlist.findAll({
      where: {userid: userId},
    });
    playlists.push({
      name: req.body.pl_name,
    });
    console.log(playlists);
    res.render('playlist',{playlists});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving playlists');
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
};
