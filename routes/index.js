import { Router } from "express";
var router = Router();
import {
  sign_up_post,
  login_post,
  get_user,
} from "../controllers/userController.js";
import {
  get_all_posts,
  get_post,
  update_post_put,
  delete_post,
  create_post_post,
} from "../controllers/postController.js";
import {
  get_post_comments,
  create_comment_post,
  get_all_comments,
  update_comment_put,
} from "../controllers/commentController.js";

router.post("/users/sign-up", sign_up_post);

router.post("/users/login", login_post);

router.get("/users/user", get_user);

router.get("/posts", get_all_posts);

router.get("/posts/:postid", get_post);

router.put("/posts/", update_post_put);

router.delete("/posts/:postid", delete_post);

router.get("/posts/:postid/comments", get_post_comments);

router.post("/posts", create_post_post);

router.post("/comments", create_comment_post);

router.get("/comments", get_all_comments);

router.put("/comments", update_comment_put);

export default router;
