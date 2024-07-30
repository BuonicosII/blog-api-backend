var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/users/sign-up', userController.sign_up_post)

router.post('/users/login', userController.login_post)

router.get('/users/user', userController.get_user)

router.get('/posts', postController.get_all_posts)

router.get('/posts/:postid', postController.get_post)

router.put('/posts/', postController.update_post_put)

router.get('/posts/:postid/comments', commentController.get_post_comments)

router.post('/posts', postController.create_post_post)

router.post('/comments', commentController.create_comment_post)

router.get('/comments', commentController.get_all_comments)

module.exports = router;
