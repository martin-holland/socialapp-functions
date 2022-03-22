const { db } = require("../util/admin.js");

exports.getAllChirps = (req, res) => {
  db.collection("chirps")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let chirps = [];
      data.forEach((doc) => {
        chirps.push({
          chirpId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage,
        });
      });
      return res.json(chirps);
    })
    .catch((err) => console.error(err));
};

exports.postOneChirp = (req, res) => {
  const newChirp = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };
  db.collection("chirps")
    .add(newChirp)
    .then((doc) => {
      const resChirp = newChirp;
      resChirp.chirpId = doc.id;
      res.json(resChirp);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

// Fetch one scream
exports.getChirp = (req, res) => {
  let chirpData = {};
  db.doc(`/chirps/${req.params.chirpId}`)
    .get()
    .then((doc) => {
      console.log(req.params.chirpId);
      if (!doc.exists) {
        return res.status(404).json({ error: "Chirp not found" });
      }
      chirpData = doc.data();
      chirpData.chirpId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("chirpId", "==", req.params.chirpId)
        .get();
    })
    .then((data) => {
      chirpData.comments = [];
      data.forEach((doc) => {
        chirpData.comments.push(doc.data());
      });
      return res.json(chirpData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Comment a chirp
exports.commentOnChirp = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    chirpId: req.params.chirpId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  };

  db.doc(`/chirps/${req.params.chirpId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Chirp not found" });
      }
      return doc.ref
        .update({ commentCount: doc.data().commentCount + 1 })
        .then(() => {
          return db.collection("comments").add(newComment);
        });
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

// Like a chirp
exports.likeChirp = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("chirpId", "==", req.params.chirpId)
    .limit(1);
  const chirpDocument = db.doc(`/chirps/${req.params.chirpId}`);

  let chirpData;

  chirpDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        chirpData = doc.data();
        chirpData.chirpId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Chirp not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            chirpId: req.params.chirpId,
            userHandle: req.user.handle,
          })
          .then(() => {
            chirpData.likeCount++;
            return chirpDocument.update({ likeCount: chirpData.likeCount });
          })
          .then(() => {
            return res.json(chirpData);
          });
      } else {
        return res.status(400).json({ error: "Chirp already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeChirp = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("chirpId", "==", req.params.chirpId)
    .limit(1);
  const chirpDocument = db.doc(`/chirps/${req.params.chirpId}`);

  let chirpData;

  chirpDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        chirpData = doc.data();
        chirpData.chirpId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Chirp not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Chirp not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            chirpData.likeCount--;
            return chirpDocument.update({ likeCount: chirpData.likeCount });
          })
          .then(() => {
            res.json(chirpData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Delete a chirp
exports.deleteChirp = (req, res) => {
  const document = db.doc(`/chirps/${req.params.chirpId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Chirp not found" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Chirp deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
