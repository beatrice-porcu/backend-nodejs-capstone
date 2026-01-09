const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Define the upload directory path
const directoryPath = 'public/images';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });

// Get all secondChanceItems
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        //Step 2: task 1 - insert code here
        const db = await connectToDatabase();
        //Step 2: task 2 - insert code here
        const collection = db.collection("secondChanceItems");
        //Step 2: task 3 - insert code here
        const secondChanceItems = await collection.find({}).toArray();
        //Step 2: task 4 - insert code here
        res.json(secondChanceItems);
    } catch (e) {
        logger.console.error('oops something went wrong', e)
        next(e);
    }
});

// Add a new item
router.post('/', 
    //Step 3: Task 7 insert code here
    upload.single('file'),
    async(req, res,next) => {
    try {
        //Step 3: task 1 - insert code here
        const db = await connectToDatabase();
        //Step 3: task 2 - insert code here
        const collection = db.collection("secondChanceItems");
        //Step 3: task 3 - insert code here
        const newSecondChanceItem = req.body;
        //Step 3: task 4 - insert code here
        const lastItemQuery = await collection.find().sort({'id': -1}).limit(1);
        newSecondChanceItem.id = (parseInt(lastItemQuery[0].id) + 1).toString()
        //Step 3: task 5 - insert code here
        newSecondChanceItem.date_added = Math.floor(new Date().getTime() / 1000);
        //Step 3: Task 6 insert code here
        itemAdded = await collection.insertOne(newSecondChanceItem);
        res.status(201).json(secondChanceItem.ops[0]);
    } catch (e) {
        next(e);
    }
});

// Get a single secondChanceItem by ID
router.get('/:id', async (req, res, next) => {
    try {
        //Step 4: task 1 - insert code here
        const db = await connectToDatabase();
        //Step 4: task 2 - insert code here
        const collection = db.collection('secondChanceItems');
        //Step 4: task 3 - insert code here
        const item = await collection.findOne({id: req.params.id})
        //Step 4: task 4 - insert code here
        if(!item) return res.status(404).json('Item not found');
        res.status(200).json(item);
    } catch (e) {
        next(e);
    }
});

// Update and existing item
router.put('/:id', async(req, res,next) => {
    try {
        //Step 5: task 1 - insert code here
        const db = await connectToDatabase();
        //Step 5: task 2 - insert code here
        const collection = db.collection('secondChanceItems');
        //Step 5: task 3 - insert code here
        let item = await collection.find({'id': req.params.id})
        if(!item) return res.status(404).json('Item not found');
        //Step 5: task 4 - insert code here
        item.category = req.body.category;
        item.condition = req.body.condition;
        item.age_days = req.body.age_days;
        item.description = req.body.description;
        item.age_years = Number((item.age_days/365).toFixed(1));
        item.updatedAt = new Date();
        const updatedItem = await collection.findOneAndUpdate(
            { id },
            { $set: item },
            { returnDocument: 'after' }
        );
        //Step 5: task 5 - insert code here
        updatedItem ? res.json('Item updated') : res.json('An error occurred updating the item')
    } catch (e) {
        next(e);
    }
});

// Delete an existing item
router.delete('/:id', async(req, res,next) => {
    try {
        //Step 6: task 1 - insert code here
        const db = await connectToDatabase();
        //Step 6: task 2 - insert code here
        const collection = db.collection('secondChanceItems');
        //Step 6: task 3 - insert code here
        const item = await collection.findOne({'id': req.params.id})
        if(!item) return res.status(404).json('Item not found');
        //Step 6: task 4 - insert code here
        await collection.deleteOne({'id': req.params.id})
        res.json({"deleted":"success"})
    } catch (e) {
        next(e);
    }
});

module.exports = router;
