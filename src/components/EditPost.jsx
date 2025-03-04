import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://blogbackend-zz2d.onrender.com/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.post && data.post.author === user._id) {
          setTitle(data.post.title);
          setContent(data.post.content);
          setTags(data.post.tags.join(", "));
        } else {
          alert("You are not authorized to edit this post.");
          navigate("/");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        setLoading(false);
      });
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("You must be logged in to edit posts.");
      return;
    }

    try {
      const response = await fetch(`https://blogbackend-zz2d.onrender.com/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(",").map((tag) => tag.trim()),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Post updated successfully!");
        navigate(`/posts/${id}`);
      } else {
        alert("Failed to update post.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred while updating the post.");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading post details...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "16px" }}>Edit Post</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows="6"
          required
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#38a169",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
