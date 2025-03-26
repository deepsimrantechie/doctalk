import Blog from "../models/blog.js";

// ✅ Post a Blog (Requires Authentication)
export const postBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id; // Ensure req.user exists

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required." });
    }

    const newBlog = await Blog.create({ userId, title, content });

    return res
      .status(201)
      .json({ message: "Blog posted successfully", blog: newBlog });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while posting the blog." });
  }
};

// ✅ Get Blogs for a User
export const getUserBlogs = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User ID missing" });
    }

    const userId = req.user.id;
    const blogs = await Blog.find({ userId });

    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Update Blog (Only the Owner)
export const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params; // Blog ID from URL
    const userId = req.user.id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    if (blog.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this blog." });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.updatedAt = Date.now();
    await blog.save();

    return res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while updating the blog." });
  }
};

// ✅ Delete Blog (Only the Owner)
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    if (blog.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this blog." });
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while deleting the blog." });
  }
};

//get all post
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("userId", "name email profilePic role") // Include role to filter doctors
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("title content createdAt updatedAt userId"); // Ensure userId is included

    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }

    // ✅ Filter blogs where user role is "doctor"
    const doctorBlogs = blogs.filter((blog) => blog.userId?.role === "doctor");

    if (!doctorBlogs.length) {
      return res.status(404).json({ message: "No blogs from doctors found" });
    }

    res.status(200).json(doctorBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching blogs", error: error.message });
  }
};
