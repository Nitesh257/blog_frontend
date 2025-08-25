import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import useCountdownToast from "./countdown";

// Visual-only update: improved spacing, nicer inputs, image preview, and disabled state UX.
// Functionality is unchanged.

const PostForm = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { showToastWithTimer, dismissToast } = useCountdownToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showToastWithTimer("Creating Post", 60);
    if (!isLoggedIn) {
      toast.error("Please log in to create a post.");
      dismissToast();
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const postResponse = await fetch("https://blogbackend-zz2d.onrender.com/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        }),
      });

      const postData = await postResponse.json();
      if (!postData.success) {
        dismissToast();
        toast.error(postData.message || "Failed to create post.");
        setLoading(false);
        return;
      }

      const postId = postData.post._id;

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

      dismissToast();
      toast.success("Post created successfully!");
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error("Error creating post:", err);
      dismissToast();
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 760,
      margin: "28px auto",
      padding: 24,
      borderRadius: 16,
      background: "linear-gradient(180deg, rgba(255,255,255,0.96), #ffffff)",
      boxShadow: "0 20px 50px rgba(2,6,23,0.12)",
    }}>
      <h2 style={{ fontSize: 26, marginBottom: 12, color: "#0f172a" }}>Create New Post</h2>
      <p style={{ margin: "0 0 18px 0", color: "#060c15ff", fontSize: 15 }}>
        Add a title, write your content, add tags (comma separated) and optionally upload a cover image.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ fontSize: 14, color: "#334155", fontWeight: 600 }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a clear, descriptive title"
            required
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #e6e9ee",
              fontSize: 16,
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ fontSize: 14, color: "#334155", fontWeight: 600 }}>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            rows={8}
            required
            style={{
              padding: 14,
              borderRadius: 10,
              border: "1px solid #e6e9ee",
              fontSize: 15,
              lineHeight: 1.6,
              resize: "vertical",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 14, color: "#334155", fontWeight: 600 }}>Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="news, javascript, personal"
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #e6e9ee", width: "100%", fontSize: 15 }}
            />
            <small style={{ color: "#94a3b8", display: "block", marginTop: 6 }}>Separate tags with commas.</small>
          </div>

          <div style={{ minWidth: 180 }}>
            <label style={{ fontSize: 14, color: "#334155", fontWeight: 600 }}>Cover image (optional)</label>
            <label htmlFor="cover" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              marginTop: 8,
              borderRadius: 10,
              background: "#f1f5f9",
              cursor: "pointer",
              border: "1px dashed #e2e8f0",
              fontSize: 14,
              color: "#0f172a",
            }}>
              <input id="cover" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              {image ? "Change image" : "Upload image"}
            </label>

            {imagePreview && (
              <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", border: "1px solid #e6e9ee", width: 180 }}>
                <img src={imagePreview} alt="preview" style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            type="button"
            onClick={() => { setTitle(""); setContent(""); setTags(""); setImage(null); setImagePreview(null); }}
            disabled={loading}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #e6e9ee",
              background: "transparent",
              color: "#475569",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 18px",
              borderRadius: 10,
              border: "none",
              background: loading ? "#94a3b8" : "linear-gradient(180deg,#34d399,#10b981)",
              color: "#fff",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 10px 24px rgba(16,185,129,0.18)",
            }}
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
