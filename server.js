const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Password Schema
const passwordSchema = new mongoose.Schema({
  id: String,
  site: String,
  username: String,
  password: String
});

const Password = mongoose.model('Password', passwordSchema);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.get('/', async (req, res) => {
  try {
    const passwords = await Password.find({});
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/', async (req, res) => {
  try {
    const password = new Password(req.body);
    await password.save();
    res.status(201).json(password);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/', async (req, res) => {
  try {
    await Password.findOneAndDelete({ id: req.body.id });
    res.status(200).json({ message: 'Password deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));