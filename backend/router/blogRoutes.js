import express from "express";
import {
  deleteBlog,
  getAllBlogs,
  getUserBlogs,
  postBlog,
  updateBlog,
} from "../controller.js/blogController.js";
import verifyTokenMiddleware from "../middleware.js/verifyTokenMid.js";

const BlogRouter = express.Router();

BlogRouter.post("/post", verifyTokenMiddleware, postBlog); // ✅ Add missing middleware
BlogRouter.get("/get", verifyTokenMiddleware, getUserBlogs);
BlogRouter.put("/update/:id", verifyTokenMiddleware, updateBlog); // ✅ Fix method & route
BlogRouter.delete("/delete/:id", verifyTokenMiddleware, deleteBlog); // ✅ Fix route
BlogRouter.get("/getall", getAllBlogs);

export default BlogRouter;
