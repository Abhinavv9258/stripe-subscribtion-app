require("dotenv").config()
const admin = require("firebase-admin")
const express = require("express")
const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");
const port = 5000;
const serviceAccount = require("./serviceAccountKey.json")

app.use(express.json())
app.use(bodyParser.json())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://stripe-subscribtion-app-default-rtdb.firebaseio.com"
});

app.use(
  cors({
    origin: 'https://localhost:3000'
  })
)

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
})
