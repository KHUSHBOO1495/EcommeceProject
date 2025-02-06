const express = require('express');
const Feedback = require('../model/Feedback');
const router = express.Router();

//GET all feedback
router.get('/', async (req, res) => {
    const data = await Feedback.find();
    res.send(data);
})

//GET cart by id
router.get('/:id', async (req, res) => {
    const data = await Feedback.findById(req.params.id);
    res.send(data);
})

//GET all feedback for specific product

//POST(create) new feedback
router.post('/', async(req,res)=>{
    const data = await Feedback.create(req.body);
    res.send(data);
})

//PATCH(update) feedback
router.patch('/:id', async (req, res) => {
    const data = await Feedback.findByIdAndUpdate(req.params.id, req.body);
    res.send(data);
})

//DELETE feedback
router.delete('/:id', async (req, res) => {
    const data = await Feedback.findByIdAndDelete(req.params.id);
    res.send(data);
})

module.exports = router;