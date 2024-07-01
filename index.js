require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const student = require('./models/student');
const cors = require('cors');

mongoose.connect(process.env.MONGODB_URL)

const app = express();


app.use(cors());
app.use(express.json());


app.get("/", function (req, res) {
  res.send("<h1> Pinterest clone project.....</h1>");
});

app.post('/add', async function (req, res) {
  const name = req.body.name;
  const regNo = Number(req.body.regNo);
  const gender = req.body.gender;

  const newStudent = new student({
    name,
    regNo,
    gender,  
  });

  newStudent
    .save()
    .then(() => {
      res.json('Student Added Successfully');
    })
    .catch((err) => console.log(err.message));
});

app.get('/get', async function (req, res) {
  student
    .find()
    .then((students) => {
      res.json(students);
    })
    .catch((err) => console.log(err.message));
});

app.put('/update/:sid', async function (req, res) {
  let userID = req.params.sid;
  const { name, regNo, gender } = req.body;

  const updateStudent = {
    name,
    regNo, 
    gender,
  };

  const update = await student.findByIdAndUpdate(userID, updateStudent)
    .then(() => {
      res.status(200).send({
        status: 'User Updated',
      });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        status: 'Server Error with updating data',
        error: err.message,
      });
    });
});

app.delete('/delete/:sid', async function (req, res) {
  let uId = req.params.sid;
  await student.findByIdAndDelete(uId)
    .then(() => {
      res.status(200).send({
        status: 'user Deleted',
      });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        status: 'Error with deleting user',
        error: err.message,
      });
    });
});

app.get('/get/:sid', async function (req, res) {
  const uID = req.params.sid;
  const user = await student.findById(uID)
    .then((user) => {
      res.status(200).send({
        status: 'User Fetched',
        user,
      });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        status: 'Error with fetch user',
        error: err.message,
      });
    });
})


app.listen(process.env.PORT, () => console.log(`servar started in localhost:${process.env.PORT}`));