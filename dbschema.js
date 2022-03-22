let db = {
  chrips: [
    {
      userHandle: "user",
      body: "this is the chirp body",
      createdAt: "2011-10-05T14:48:00.000Z",
      likeCount: 5,
      commentCount: 2,
    },
  ],
  comments: [
    {
      userHandle: "user",
      chirpId: "y63Dgk9UbdCuAGNUl8Lq",
      body: "nice one mate!",
      createdAt: "2022-02-27T11:25:44.439Z",
    },
  ],
  notifications: [
    {
      recipient: "user",
      sender: "john",
      read: "true" | "false",
      chirpId: "DKvithrfwXIlrCabosKm",
      type: "like | comment",
      createdAt: "2019-03-15T10:59:52.798Z",
    },
  ],
};

const userDetails = {
  // Redux data
  credientials: {
    userId: "",
    email: "user@email.com",
    handle: "user",
    createdAt: "2019-03-15T10:59:52.798Z",
    imageUrl: "image/rgergieorgonrgnt",
    bio: "Hello, my name is user, nice to meet you",
    website: "https://user.com",
    location: "London, UK",
  },
  likes: [
    {
      userHandle: "user",
      chirpId: "DKvithrfwXIlrCabosKm",
    },
    {
      userHandle: "user",
      chirpId: "3Uryxl4N2tiE4D5kWJbr",
    },
  ],
};
