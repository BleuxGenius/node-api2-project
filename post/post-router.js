const express = require('express');

const router = express.Router();

const DataBase = require('../data/db.js');

router.use(express.json());

// Creating a post using the information sent through req.body
router.post('/', (req, res) => {
    const data = req.body;
    if (!data.title || !data.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post"})
    } else {
        DataBase.insert(data)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
            console.log('error on POST /api/posts', error);
            res.status(500).json({
                errorMessage: 'There was an error while saving the post to the database'
            })
        })
    }
})

// Creates a comment for the post with specified id using information sent through req.body
router.post('/:id/comments', (req, res) => {
    const data = req.body;
    if (!data.text) {
        res.status(400).json({ errorMessage: 'Please provide text for the comment.' })
    } else {
        DataBase.insertComment(data)
        .then(comment => {
            if (comment) {
                res.status(201).json(comment)
            } else {
                res.status(404).json({ errorMessage: 'the post with the specified ID does not exist.'})
            }
        })
        .catch(error => {
            console.timeLog('error on POST /api/post/:id/comments', error);
            res.status(500).json({
                errorMessage: 'There was an error while saving the comment to the database'
            })
        })
    }
})

// Returns an array of all the post objects contained in the database.
router.get('/', (req, res) => {
    DataBase.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        console.log('error on GET /api/post/', error);
        res.status(500).json({
            errorMessage: 'The post information could not be retrieved.'
        })
    })
})

// Returns the post object with the specified id 
router.get('/:id', (req, res) => {
    const id = req.params.id;

    DataBase.findById(id)
    .then(post => {
        if (post.length !== 0) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.'})
        }
    })
    .catch(error => {
        console.log('error on GET /api/posts/:id', error);
        res.status(500).json({
            errorMessage: 'The post information could not be retrieved.'
        })
    })
})

// Returns an array of all the comment objects assiciated with the post with the specified id.
router.get('/:id/comments', (req, res) => {
    const id = req.params.id;

    DataBase.findPostComments(id)
    .then(comment => {
        if (comment.length !== 0) {
            res.status(200).json(comment)
        } else {
            res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.' })
        }
    })
    .catch(error => {
        console.log('error on GET /api/post/:id/comments', error)
        res.status(500).json({
            errorMessage: 'The comments information could not be retrieved'
        })
    })
})

// Removes the post with the specified id and returns the deleted post
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    DataBase.remove(id)
    .then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.'})
        }
    })
    .catch(error => {
        console.log('error on DELETE /api/posts/:id', error)
        res.status(500).json({
            errorMessage: 'The post could not be removed'
        })
    })
})

// Updates the post with the specified ID using information sent through req.body.
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;

    if (!data.title || !data.contents) {
        res.status(400).json({
            errorMessage: 'Please provide title and contents for the post.'
        })
    } else {
        DataBase.update(id, data)
        .then(post => {
            if (post) {
                res.status(200).json(data)
            } else {
                res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.'})
            }
        })
        .catch(error => {
            console.log('error on PUT /api/posts/:id', error)
            res.status(500).json({
                errorMessage: 'The post information could not be modified'
            })
        })
    }
})

module.exports = router;