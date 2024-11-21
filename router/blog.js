import { Router } from "express";
const router = Router();

//  import all controllers
import * as blogController from "../controllers/blog.js";

//POST
router.route("/blogs").post(blogController.createBlog); // Post All blogs

//GET
router.route("/blogs").get(blogController.getBlogs); // Get All blogs
router.route("/blog/:title").get(blogController.getBlog); // Get One blog
router.route("/blogById/:_id").get(blogController.getBlogById); // Get One blog By Id

// PUT
router.route("/blogs/:title").put(blogController.updateOneBlog); // Update blogs
router.route("/updateOneBlogById/:_id").put(blogController.updateOneBlogById); // Update blog By Id

// DELETE
router.route("/blogs/:title").delete(blogController.deleteBlog); // Delete One blogs

export default router;
