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

    // playlists.push({
    //   name: req.body.pl_name,
    // });
    // console.log(playlists);
    // res.render('playlist',{playlists});

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
      const playlistInfo = {
        playlist,
        result,
      }

      playlistLikes.push(playlistInfo);

      console.log(playlistLikes);
      res.render('playlist', {playlistLikes});
    }
    // const p_id = res.id.values;
    // console.log(p_id);
    // const userid = req.userid;

    // const likePlaylists = await models.P_like.findAll({
    //   where: {userid: userid, p_id: p_id},
    // });
    // console.log(likePlaylists)
    // res.json({ result: true, message: 'likePlaylists successfully' });

    // if(!likePlaylists === 'null') {
    //   return res.status(400).send({ message: 'likePlaylists undefined' });
    // } else {
    //   likePlaylists.push({
    //     userid: req.body.userid,
    //     p_id: req.body.id
    //   });
    //   console.log(likePlaylists);
    //   res.render('likePlaylists',{likePlaylists});
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving playlists');
  }
};

// exports.getPlayListLikepage = async (req,res) => {
//   try{
//     const p_id = req.id;
//     const userid = req.userid;

//     const likePlaylists = await models.P_like.findAll({
//       where: {userid: userid, p_id: p_id},
//     });
//     res.json({ result: true, message: 'likePlaylists successfully' });

//     if(!likePlaylists === 'null') {
//       return res.status(400).send({ message: 'likePlaylists undefined' });
//     } else {
//       likePlaylists.push({
//         userid: req.body.userid,
//         p_id: req.body.id
//       });
//       console.log(likePlaylists);
//       res.render('likePlaylists',{likePlaylists});
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }

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
