import  { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";

// NOTE: Functionality is unchanged. This refactor only improves visual presentation of the
// post content, comments, and buttons—no new dependencies added.

const PostDetail = () => {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`https://blogbackend-zz2d.onrender.com/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data.post))
      .catch((err) => console.error("Error fetching post:", err));
  }, [id]);

  const hasLiked = !!(post && user && post.likes?.includes(user._id));

  const readingTime = useMemo(() => {
    if (!post?.content) return null;
    const words = post.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200)); // ~200 wpm
    return `${minutes} min read`;
  }, [post?.content]);

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to like posts.");
      return;
    }

    const url = `https://blogbackend-zz2d.onrender.com/api/posts/${id}/${hasLiked ? "unlike" : "like"}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setPost((prev) => ({ ...prev, likes: data.post.likes }));
      } else {
        toast.error(data.message || "Failed to toggle like.");
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      toast.error("Failed to toggle like.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return toast.error("You must be logged in to comment on posts.");
    if (!commentText.trim()) return toast.error("Comment cannot be empty.");

    try {
      const response = await axios.post(
        `https://blogbackend-zz2d.onrender.com/api/posts/${id}/comments`,
        { comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPost(response.data.post);
        setCommentText("");
        toast.success("Comment added successfully!");
      } else {
        toast.error("Failed to add comment.");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://blogbackend-zz2d.onrender.com/api/posts/${post._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Post deleted successfully.");
        navigate("/");
      } else {
        toast.error(data.message || "Failed to delete the post.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  if (!post) return <p style={{ color: "#a3a3a3", textAlign: "center", marginTop: 48 }}>Loading post…</p>;

  // Helpers for light/dark friendly colors
  const palette = {
    bg: "#0b0f17",
    card: "#0f1729",
    cardBorder: "rgba(255,255,255,0.06)",
    text: "#e5e7eb",
    subtext: "#9aa4b2",
    accent: "#7dd3fc",
    accentSoft: "rgba(125, 211, 252, 0.15)",
    green: "#22c55e",
    red: "#ef4444",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      background: `radial-gradient(1200px 500px at 50% -100px, rgba(125,211,252,0.15), transparent 70%), ${palette.bg}`,
      padding: "24px 16px",
    }}>
      <article style={{
        width: "100%",
        maxWidth: 820,
        background: palette.card,
        border: `1px solid ${palette.cardBorder}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        borderRadius: 20,
        overflow: "hidden",
      }}>
        {/* Cover */}
        {post.coverImage && (
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#0e0e0e" }}>
            <img
              src={post.coverImage}
              alt="Post Cover"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(1.05)" }}
            />
            {/* Soft gradient for text readability */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)" }} />
            <h1 style={{
              position: "absolute",
              left: 24,
              bottom: 20,
              right: 24,
              margin: 0,
              fontSize: 36,
              lineHeight: 1.2,
              color: "white",
              textShadow: "0 6px 30px rgba(0,0,0,0.6)",
            }}>{post.title}</h1>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: "24px 22px 10px", color: palette.text }}>
          {/* Meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              background: palette.accentSoft,
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              color: palette.accent,
              letterSpacing: 0.5,
            }}>{(post.author?.username || "?").slice(0,1).toUpperCase()}</div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 14, color: palette.subtext }}>Author</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: palette.text }}>{post.author?.username}</span>
            </div>

            <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
              {readingTime && (
                <span style={{ fontSize: 14, padding: "6px 10px", borderRadius: 999, background: "rgba(148,163,184,0.12)", color: palette.subtext }}>{readingTime}</span>
              )}
              <span style={{ fontSize: 14, color: palette.subtext }}>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Content */}
          <div style={{
            fontSize: 18,
            lineHeight: 1.8,
            color: palette.text,
            letterSpacing: 0.1,
            wordBreak: "break-word",
          }}>
            {(post.content || "").split(/\n\n+/).map((para, idx) => (
              <p key={idx} style={{ margin: "0 0 1.1em", color: palette.text }}>
                {para}
              </p>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, marginTop: 20, marginBottom: 6 }}>
            <button
              onClick={handleLikeToggle}
              aria-label={hasLiked ? "Unlike" : "Like"}
              style={{
                flexShrink: 0,
                padding: "10px 16px",
                borderRadius: 12,
                border: `1px solid ${palette.cardBorder}`,
                background: hasLiked ? "rgba(59,130,246,0.15)" : "rgba(148,163,184,0.12)",
                color: hasLiked ? "#93c5fd" : palette.text,
                cursor: "pointer",
                fontWeight: 600,
                transition: "transform 120ms ease, background 120ms ease",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {hasLiked ? "♥ Unlike" : "♡ Like"} ({post.likes?.length || 0})
            </button>

            {user && post.author?._id === user._id && (
              <button
                onClick={handleDelete}
                style={{
                  flexShrink: 0,
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: `1px solid ${palette.cardBorder}`,
                  background: "rgba(239,68,68,0.12)",
                  color: palette.red,
                  cursor: "pointer",
                  fontWeight: 700,
                  transition: "transform 120ms ease",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Delete Post
              </button>
            )}
          </div>
        </div>

        {/* Comments */}
        <div style={{ padding: "0 22px 24px" }}>
          <h2 style={{ fontSize: 22, color: palette.text, margin: "12px 0" }}>Comments</h2>

          {post.comments?.length > 0 ? (
            <div style={{ display: "grid", gap: 12 }}>
              {post.comments.map((comment) => (
                <div key={comment._id} style={{
                  border: `1px solid ${palette.cardBorder}`,
                  background: "rgba(148,163,184,0.06)",
                  borderRadius: 14,
                  padding: 12,
                }}>
                  <p style={{ margin: 0, color: palette.text }}>{comment.comment}</p>
                  <small style={{ color: palette.subtext }}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: palette.subtext, marginTop: 8 }}>No comments yet.</p>
          )}

          <form onSubmit={handleCommentSubmit} style={{ marginTop: 16 }}>
            <label htmlFor="comment" style={{ display: "block", fontSize: 14, color: palette.subtext, marginBottom: 8 }}>Add a comment</label>
            <textarea
              id="comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts…"
              required
              style={{
                width: "100%",
                border: `1px solid ${palette.cardBorder}`,
                background: "rgba(2,6,23,0.35)",
                color: palette.text,
                borderRadius: 14,
                padding: 12,
                minHeight: 110,
                outline: "none",
                boxShadow: "0 0 0 0 rgba(125,211,252,0)",
                transition: "box-shadow 120ms ease, border-color 120ms ease",
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(125,211,252,0.25)")}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "0 0 0 0 rgba(125,211,252,0)")}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button type="submit" style={{
                background: "linear-gradient(180deg, #34d399, #10b981)",
                color: "white",
                padding: "10px 18px",
                border: "none",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(16,185,129,0.25)",
                transition: "transform 120ms ease",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >Submit Comment</button>
            </div>
          </form>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
