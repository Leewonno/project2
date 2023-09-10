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

    console.log("pl", playlist);

    if (!created) {
      await pLike.destroy();
      playlist.like -= 1;
      await playlist.save();
      res.json({ count: playlist.like, liked: false, message: "like cancel success" });
    } else {
      playlist.like += 1;
      await playlist.save();
      res.json({ count: playlist.like, liked: true, message: "like success" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// exports.postPlayListLike = async (req, res) => {
//   try {
//     // const userId = req.userid; 
//     const userid = "gahyeon2"

//     const id = req.body.id ;
//     // console.log(id, userId);

//     if (typeof id === 'undefined' || id === null) {
//       return res.status(400).send({ message: 'Invalid p_id' });
//     }

//     console.log(id, userid);

//     // const [pLike, created] = await models.P_like.create({
//     //   where: { p_id: id, userid },
//     // });
//     const [pLike, created] = await models.P_like.findOrCreate({
//       where: { p_id: id, userid },
//     });
    

//     console.log('pLike', pLike);

//     const playlist = await models.Playlist.findOne({ where: { id } });
//     console.log('playlist', playlist);

//     if (!created) {
//       await pLike.destroy();
//       playlist.like -= 1;
//       await playlist.save();
//       res.send({ count: playlist.like, liked: false, message: "like cancel success" });
//     } else {
//       playlist.like += 1;
//       await playlist.save();
//       // res.send({ count: playlist.like, liked: true, message: "like success" });
//       res.json({ count: playlist.like, liked: true, message: "like success" });

//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Internal Server Error' });
//   }
// };

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
