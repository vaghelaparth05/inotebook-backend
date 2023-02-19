const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    obj = {
        name: 'parth vaghela',
        age: 23,
        date: '18th Feb 2023',
    }
    res.json(obj);
});

module.exports = router;