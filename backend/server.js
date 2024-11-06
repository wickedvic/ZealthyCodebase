const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zealthy-vivek-default-rtdb.firebaseio.com/",
});

const db = admin.firestore();

app.post("/api/users", async (req, res) => {
  try {
    const userData = req.body;
    // console.log("DB", userData)
    await db.collection("users").add(userData);
    res.status(201).send("User added successfully");
  } catch (error) {
    console.error("Error adding user data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.post('/api/saveComponents', async (req, res) => {
  const pageComponents = req.body.pageComponents; 

  try {
      const db = admin.firestore();
      const docRef = db.collection('pageComponents').doc('config'); 
      await docRef.set(pageComponents, { merge: true });

      res.status(200).send({ message: 'Components saved successfully' });
  } catch (error) {
      console.error('Error saving components: ', error);
      res.status(500).send({ message: 'Failed to save components' });
  }
});


app.get('/api/getPageConfig', async (req, res) => {
  try {
    const pageConfigSnapshot = await db.collection('pageComponents').limit(1).get();

    if (pageConfigSnapshot.empty) {
      return res.status(404).json({ message: 'No page configuration found' });
    }

  
    const pageConfigData = pageConfigSnapshot.docs[0].data();
    
    res.status(200).json(pageConfigData);
  } catch (error) {
    console.error('Error fetching page configuration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.post('/api/saveUserProgress', async (req, res) => {
  const { step, userData } = req.body;
  try {
      const userDoc = db.collection('userProgress').doc(userData.email);
      await userDoc.set({ step, userData }, { merge: true });
      res.status(200).send({ message: 'Progress saved successfully' });
  } catch (error) {
      console.error('Error saving progress:', error);
      res.status(500).send({ message: 'Failed to save progress' });
  }
});


app.get('/api/getUserProgress', async (req, res) => {
  const email = req.query.email; 
  console.log("EMAIL", email)
  try {
      const userDoc = await db.collection('userProgress').doc(email).get();
      if (userDoc.exists) {
          res.status(200).json(userDoc.data());
      } else {
          res.status(404).send({ message: 'No progress found for this user' });
      }
  } catch (error) {
      console.error('Error retrieving progress:', error);
      res.status(500).send({ message: 'Failed to retrieve progress' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
