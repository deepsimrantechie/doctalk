import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiRefreshCw,
  FiAlertCircle,
  FiClock,
  FiEdit2,
} from "react-icons/fi";
import { FaRegNewspaper } from "react-icons/fa";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "http://localhost:6002/api/blog/getall"
        );
        setBlogs(response.data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(
            response.data.map((blog) => blog.category || "uncategorized")
          ),
        ];
        setCategories(["all", ...uniqueCategories]);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      axios
        .get("http://localhost:6002/api/blog/getall")
        .then((response) => {
          setBlogs(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching blogs:", err);
          setError("Failed to load blogs. Please try again.");
          setLoading(false);
        });
    }, 1000);
  };

  const BlogSkeleton = () => (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 0.8 }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
      className="bg-white shadow rounded-3xl p-6 mb-6"
    >
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="flex justify-between mt-6">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-500 to-indigo-600">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0 flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <FaRegNewspaper className="mr-3" /> Latest Blog Posts
          </motion.h1>

          {/* Search and Filter */}
          <div className="w-full md:w-auto space-y-3 md:space-y-0 md:space-x-3 flex flex-col md:flex-row">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                className="pl-10 pr-4 py-2 rounded-full border-none shadow-md focus:ring-2 focus:ring-blue-300 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-2 rounded-full border-none shadow-md focus:ring-2 focus:ring-blue-300 bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg"
          >
            <FiAlertCircle className="mx-auto text-5xl text-white mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{error}</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={retryFetch}
              className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-full font-medium flex items-center mx-auto"
            >
              <FiRefreshCw className="mr-2" /> Retry
            </motion.button>
          </motion.div>
        ) : loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/20 backdrop-blur-md rounded-2xl p-8 text-center shadow-lg"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || selectedCategory !== "all"
                ? "No matching blogs found"
                : "No blogs available yet"}
            </h3>
            <p className="text-white/80">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter"
                : "Be the first to create a blog post!"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white shadow-xl rounded-3xl p-6 border border-gray-100 overflow-hidden"
                >
                  {/* Category Tag */}
                  {blog.category && (
                    <motion.span
                      className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-3"
                      whileHover={{ scale: 1.05 }}
                    >
                      {blog.category}
                    </motion.span>
                  )}

                  {/* Blog Title */}
                  <motion.h2
                    className="text-2xl md:text-3xl font-bold text-gray-800 mb-3"
                    whileHover={{ color: "#3B82F6" }}
                  >
                    {blog.title}
                  </motion.h2>

                  {/* Blog Content */}
                  <motion.p
                    className="text-gray-600 text-base md:text-lg leading-relaxed mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {blog.content.length > 200
                      ? `${blog.content.substring(0, 200)}...`
                      : blog.content}
                  </motion.p>

                  {/* Blog Metadata */}
                  <motion.div
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      {blog.updatedAt !== blog.createdAt && (
                        <div className="flex items-center">
                          <FiEdit2 className="mr-1" />
                          <span>
                            {new Date(blog.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium"
                    >
                      Read More
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BlogList;
