import jwt from "jsonwebtoken";
//
import firebaseAdmin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url); // construct the require method
const serviceAccount = require("./../serviceAccountKey.json");

const fireAdmin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: "gs://contact-app-bucket.appspot.com",
});

const storageRef = fireAdmin
  .storage()
  .bucket("gs://contact-app-bucket.appspot.com");

async function uploadFile(path, filenameWithDestination) {
  return storageRef.upload(path, {
    public: true,
    destination: filenameWithDestination,
  });
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export {generateToken, uploadFile};
