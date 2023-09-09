const models = require('../database/db');
const jwt = require("jsonwebtoken");

exports.getPlayListPage = async (req, res) => {
  try {
    const playlists = await models.Playlist.findAll();
    playlists.push({
      name: req.body.pl_name,
    })
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
