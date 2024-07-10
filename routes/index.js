var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/users', userController.sign_up_post)

router.post('/users/login', userController.login_post)

router.get('/protected-route', postController.test)

module.exports = router;
