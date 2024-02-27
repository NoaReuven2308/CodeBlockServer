const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {CodeBlock, validate} = require('../models/codeBlock');



// GET all code blocks
router.get('/', async (req, res) => {
  const codeBlocks = await CodeBlock.find();
  res.send(codeBlocks);
});

// GET a single code block by ID
router.get('/:id', validateObjectId, async (req, res) => {
  const codeBlock = await CodeBlock.findById(req.params.id);

  if (!codeBlock) return res.status(404).send('The code block with the given ID was not found.');
  res.send(codeBlock);
});

// POST a new code block
router.post('/', async (req, res) => {

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  let codeBlock = new CodeBlock({
    title: req.body.title,
    code: req.body.code
  });
  codeBlock = await codeBlock.save();
  res.send(codeBlock);
});

// PUT update a code block
router.put('/:id', validateObjectId, async (req, res) => {
  const codeBlock = await CodeBlock.findByIdAndUpdate(req.params.id, { 
    title: req.body.title,
    code: req.body.code,
    comments: req.body.comments
  }, { new: true });

  if (!codeBlock) return res.status(404).send('The code block with the given ID was not found.');
  
  res.send(codeBlock);
});

// DELETE a code block
router.delete('/:id', validateObjectId, async (req, res) => {
  const codeBlock = await CodeBlock.findByIdAndDelete(req.params.id);

  if (!codeBlock) return res.status(404).send('The code block with the given ID was not found.');

  res.send(codeBlock);
});



module.exports = router;