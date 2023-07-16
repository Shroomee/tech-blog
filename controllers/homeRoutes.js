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

router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['name'],
                    },
                },
            ],
        });
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }
        const post = postData.get({ plain: true });
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn,
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// GET all posts by user

router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post }],
        });
        const user = userData.get({ plain: true });
        res.render('dashboard', {
            ...user,
            loggedIn: true,
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// GET one post by user

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id);
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }
        const post = postData.get({ plain: true });
        res.render('edit-post', {
            post,
            loggedIn: true,
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// GET all comments by user

router.get('/comments', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            where: { user_id: req.session.user_id },
            include: [{ model: Post }],
        });
        const comments = commentData.map((comment) => comment.get({ plain: true }));
        res.render('comments', {
            comments,
            loggedIn: true,
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// GET one comment by user

router.get('/edit-comment/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id);
        if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }
        const comment = commentData.get({ plain: true });
        res.render('edit-comment', {
            comment,
            loggedIn: true,
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// GET login page

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

// GET signup page

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

module.exports = router;