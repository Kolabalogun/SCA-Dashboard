const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const auth = admin.auth();
const db = admin.firestore();

exports.createUser = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ message: "Only POST requests are allowed" });
    }

    const { email, password, name, phone } = req.body;

    try {
      let userRecord;

      await db.runTransaction(async (transaction) => {
        // Create user in Firebase Authentication
        userRecord = await auth.createUser({
          email,
          password,
        });

        // Store user data in Firestore
        await transaction.set(db.collection("users").doc(userRecord.uid), {
          name,
          phone,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      res
        .status(200)
        .json({ message: "User created successfully", data: userRecord });
    } catch (error) {
      console.error("Error creating user:", error);

      if (error.code === "auth/email-already-exists") {
        res.status(400).json({
          error: "The email address is already in use by another account.",
        });
      } else if (error.code === "auth/invalid-password") {
        res.status(400).json({
          error:
            "The password is invalid. It must be at least 8 characters long.",
        });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });
});
