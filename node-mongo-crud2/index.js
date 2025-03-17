const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB (Updated)
mongoose.connect('mongodb://127.0.0.1:27017/crudDB') // Removed deprecated options
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Define Schema and Model
const ItemSchema = new mongoose.Schema({
    name: String,
    price: Number
});
const Item = mongoose.model('Item', ItemSchema);

// CRUD Routes
app.post('/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        
        await newItem.save();
        res.status(201).send(newItem);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/items', async (req, res) => {
    const items = await Item.find();
    res.send(items);
});

app.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).send('Item not found');
        res.send(item);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.put('/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).send('Item not found');
        res.send(item);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).send('Item not found');
        res.send('Item deleted');
    } catch (err) {
        res.status(400).send(err);
    }
});

// Start Server on Available Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
