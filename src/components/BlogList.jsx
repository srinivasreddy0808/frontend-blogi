import { useState, useEffect, useCallback } from "react";
import styles from "./BlogList.module.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [editingBlog, setEditingBlog] = useState(null);
  const token = JSON.parse(localStorage.getItem("user")).token;

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE
        }/api/v1/blogs?page=${currentPage}&search=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();

      setBlogs(data.data.blogs);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  }, [currentPage, searchTerm, token]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Create a new blog
  const handleCreate = async (blogData) => {
    try {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("content", blogData.content);
      if (blogData.image) {
        formData.append("image", blogData.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/v1/blogs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create blog");
      }
      setEditingBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  const handleUpdate = async (id, blogData) => {
    try {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("content", blogData.content);
      if (blogData.image) {
        formData.append("image", blogData.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/v1/blogs/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update blog");
      }
      setEditingBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/v1/blogs/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blog List</h1>
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchBar}
        />
      </div>

      <button
        onClick={() => setEditingBlog({})}
        className={styles.createButton}
      >
        Create New Blog
      </button>

      <div className={styles.blogList}>
        {blogs.map((blog) => (
          <div key={blog._id} className={styles.blogItem}>
            {blog.image && (
              <img
                src={`${import.meta.env.VITE_API_BASE}/${blog.image}`}
                alt={blog.title}
                className={styles.blogImage}
              />
            )}
            <h2 className={styles.blogTitle}>{blog.title}</h2>
            <p className={styles.blogContent}>{blog.content}</p>
            <div className={styles.buttonGroup}>
              <div className={styles.buttonContainer}>
                <button
                  onClick={() => setEditingBlog(blog)}
                  className={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
              <div className={styles.timestamp}>
                <span className={styles.createdAt}>
                  Created At: {new Date(blog.createdAt).toLocaleString()}
                </span>
                <span className={styles.updatedAt}>
                  Updated At: {new Date(blog.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`${styles.pageButton} ${
              currentPage === i + 1 ? styles.active : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {editingBlog && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              {editingBlog._id ? "Edit Blog" : "Create Blog"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const blogData = {
                  title: formData.get("title"),
                  content: formData.get("content"),
                  image: formData.get("image"),
                };
                if (editingBlog._id) {
                  handleUpdate(editingBlog._id, blogData);
                } else {
                  handleCreate(blogData);
                }
              }}
              className={styles.form}
              encType="multipart/form-data"
            >
              <input
                type="text"
                name="title"
                placeholder="Title"
                defaultValue={editingBlog.title || ""}
                className={styles.formInput}
              />
              <textarea
                name="content"
                placeholder="Content"
                defaultValue={editingBlog.content || ""}
                className={styles.formTextarea}
              />
              <input
                type="file"
                name="image"
                accept="image/*" // Allow only image files
                className={styles.formInput}
              />
              <div>
                <button
                  type="submit"
                  className={`${styles.formButton} ${styles.saveButton}`}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className={`${styles.formButton} ${styles.cancelButton}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
