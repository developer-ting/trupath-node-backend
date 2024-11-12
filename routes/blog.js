import { Router } from "express";
const router = Router();

//  import all controllers
import * as blogController from "../controllers/blog.js";

//POST
router.route("/blog").post(blogController.createBlog); // All blogs
//GET
router.route("/blog").get(blogController.getBlog); // All blogs
// PUT
router.route("/blog/:title").put(blogController.updateBlog); // Update blogs
// DELETE
router.route("/blog/:title").delete(blogController.deleteBlog); // Delete One blogs

export default router;
