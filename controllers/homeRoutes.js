const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Post, Comment } = require('../models');

// GET all posts for homepage

router.get('/', async (req, res) => {
    const postData = await Post.findAll({
        include: [
            {
                model: User,
                attributes: ['name'],
            },
        ],
})
    const posts = postData.map((post) => post.get({ plain: true }));
    res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn,
    });
});

// GET one post

