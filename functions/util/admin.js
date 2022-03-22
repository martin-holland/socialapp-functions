const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
// import { doc } from "firebase/firestore";

module.exports = { admin, db };
