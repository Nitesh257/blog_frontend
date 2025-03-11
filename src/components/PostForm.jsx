import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import useCountdownToast from "./countdown";

const PostForm = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { showToastWithTimer, dismissToast } = useCountdownToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    showToastWithTimer("Creating Post",60);
    if (!isLoggedIn) {
      toast.error("Please log in to create a post.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      //  Create post without image
      const postResponse = await fetch("https://blogbackend-zz2d.onrender.com/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(",").map((tag) => tag.trim()),
        }),
      });

      const postData = await postResponse.json();
      dismissToast();

      if (postData.success) {
        const postId = postData.post._id;

        //  Upload cover image if selected
        if (image) {
          const formData = new FormData();
          formData.append("coverImage", image);

          const imageResponse = await fetch(`https://blogbackend-zz2d.onrender.com/api/posts/${postId}/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          const imageData = await imageResponse.json();
          if (!imageData.success) {
            toast.error("Image upload failed.");
          }
        }

        toast.success("Post created successfully!"); 
        navigate(`/posts/${postId}`);
      } else {
        toast.error("Failed to create post.");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("An error occurred.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "16px" }}>Create New Post</h2>
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ padding: "10px" }}
        />
        <button
          type="submit"
          disabled={loading} 
          style={{
            padding: "12px",
            backgroundColor: loading ? "#ccc" : "#3182ce",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
