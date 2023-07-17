const router = require('express').Router();
const { Post, Comment } = require('../../models');

router.post('/newpost', async (req, res) => {
    try {
        const postData = await Post.create(req.body); 
        res.status(200).json(postData);
    }
    catch (err) {
        res.status(400).json(err);
    }
});

router.put('/editpost', async (req, res) => {
    const post = await Post.findByPk(req.body.id);
    const comment = await Post.update({
        title: req.body.title,
        comment_text: req.body.comment_text,
    })

    res.json(comment);
});

router.delete('/deletepost', async (req, res) => {
    try {
        const post = Post.findByPk(req.body.id);
        const comment = await Post.destroy({
            where: {
                id: req.body.id,
            },
        });
    }
    catch (err) {
        res.status(400).json(err);
    }
});

router.post('/newcomment', async (req, res) => {
    try {
        Comment.create({
            comment_text: req.body.comment_text,
        }).then(comment => {
            comment.setUser(req.session.user_id);
            comment.setPost(req.body.post_id);
            res.json(comment);
        });
    }

    catch (err) {
        res.status(400).json(err);
    }
    
});


module.exports = router;