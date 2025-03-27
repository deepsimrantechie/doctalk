import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiSend, FiX, FiPlus } from "react-icons/fi";

const token = localStorage.getItem("token");
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:6002";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingBlog, setEditingBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedBlog, setExpandedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blog/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const postBlog = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/blog/post`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlogs([response.data.blog, ...blogs]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error posting blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBlog = async () => {
    if (!editingBlog?._id || !title.trim() || !content.trim()) {
      alert("Invalid update request.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/blog/update/${editingBlog._id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlogs(
        blogs.map((blog) =>
          blog._id === editingBlog._id ? response.data.blog : blog
        )
      );
      setEditingBlog(null);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error updating blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    if (!blogId) {
      alert("Invalid blog ID for deletion.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/blog/delete/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error("Error deleting blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (blogId) => {
    setExpandedBlog(expandedBlog === blogId ? null : blogId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8"
        >
          <div>
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Doctor's Blog
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Share your medical insights, experiences, and knowledge with the
              community.
            </motion.p>
          </div>

          <motion.div
            className="w-full md:w-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>

              <input
                type="text"
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Blog Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                placeholder="Write your content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-4">
                {editingBlog && (
                  <button
                    onClick={() => {
                      setEditingBlog(null);
                      setTitle("");
                      setContent("");
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                  >
                    <FiX /> Cancel
                  </button>
                )}

                <button
                  onClick={editingBlog ? updateBlog : postBlog}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      {editingBlog ? <FiEdit2 /> : <FiPlus />}
                      {editingBlog ? "Update" : "Create"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Blog Posts Section */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {blogs.length > 0 ? "Your Blog Posts" : "No Blog Posts Yet"}
          </h2>

          {isLoading && blogs.length === 0 ? (
            <div className="flex justify-center">
              <div className="animate-pulse text-gray-500">
                Loading blogs...
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {blogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {blog.title}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingBlog(blog);
                            setTitle(blog.title);
                            setContent(blog.content);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => deleteBlog(blog._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      {expandedBlog === blog._id ||
                      blog.content.length < 150 ? (
                        <p className="text-gray-700 whitespace-pre-line">
                          {blog.content}
                        </p>
                      ) : (
                        <>
                          <p className="text-gray-700 whitespace-pre-line">
                            {blog.content.substring(0, 150)}...
                          </p>
                          <button
                            onClick={() => toggleExpand(blog._id)}
                            className="text-blue-600 hover:text-blue-800 mt-2 text-sm font-medium"
                          >
                            Read more
                          </button>
                        </>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Posted on:{" "}
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                      {expandedBlog === blog._id && (
                        <button
                          onClick={() => toggleExpand(blog._id)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
