// src/components/PostDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";

const PostDetail = () => {
  const { id } = useParams(); // Extract post ID from URL
  const { user, isLoggedIn } = useAuth();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const navigate= useNavigate();
  const token = localStorage.getItem("token"); // Get token from storage

  useEffect(() => {
    fetch(`https://blogbackend-zz2d.onrender.com/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("fetched post ", data.post);
        setPost(data.post);
      })
      .catch((err) => console.error("Error fetching post:", err));
  }, [id]);

  const handleImageUpload = async (postId) => {
    const formData = new FormData();
    formData.append("coverImage", image);

    try {
      const response = await fetch(
        `https://blogbackend-zz2d.onrender.com/api/posts/${postId}/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setPost(data.post);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleLikeToggle = () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to like posts.");
      return;
    }

    const hasLiked = post.likes.includes(user._id); // Check if user has liked
    const url = `https://blogbackend-zz2d.onrender.com/api/posts/${id}/${
      hasLiked ? "unlike" : "like"
    }`;
    fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost((prevPost)=>({
            ...prevPost,
            likes:data.post.likes,
          }))
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        console.error("Error toggling like:", err);
        toast.error("Failed to toggle like.");
      });
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    if (!isLoggedIn) {
      toast.error("You must be logged in to comment on posts.");
      return;
    }
  
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
  
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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      const data = await response.json();
      console.log("Delete Response:", data); 
  
      if (response.ok && data.success) {
        toast.error("Post deleted successfully.");
        navigate("/");
      } else {
        toast.error(data.message || "Failed to delete the post.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };
  
  
  if (!post) return <p>Loading post...</p>;
  const hasLiked = post.likes.includes(user?._id);

  return (
    <div
      className="max-w-2xl mx-auto my-6"
      style={{
        maxWidth: "700px",
        margin: "24px auto",
        padding: "16px",
        border: "1px solid ",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {post.coverImage && (
        <div>
          <img
            src={post.coverImage}
            alt="Post Cover"
            className="post-image"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          marginBottom: "12px",
          textAlign: "center",
        }}
      >
        {post.title}
      </h1>
      <p
        style={{
          fontSize: "1.5rem",
          lineHeight: "1.6",
          color: "#4a5568",
          marginBottom: "20px",
        }}
      >
        {post.content}
      </p>
      <div
        className=""
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={handleLikeToggle}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: hasLiked ? "blue" : "grey",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {" "}
          {hasLiked ? "Unlike" : "Like"} ({post.likes.length}){" "}
        </button>
        {user && post.author._id=== user._id&& (
        <button
          onClick={handleDelete}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e53e3e",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "16px",
          }}
        >
          Delete Post
        </button>
      )}
      </div>
      <h2 style={{fontSize: "2.0rem", fontWeight: "600", marginBottom: "16px", margin:"10px"}}>Author: <h3 style={{color:"lightGreen"}}>{post.author.username}</h3> </h2>
      <h2
        style={{ fontSize: "2.5rem", fontWeight: "600", marginBottom: "16px" }}
      >
        {" "}
        Comments{" "}
      </h2>
      {post.comments.length > 0 ? (
        post.comments.map((comment) => (
          <div
            key={comment._id}
            style={{
              border: "1px solid #cbd5e0",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <p style={{ marginBottom: "6px" }}>{comment.comment}</p>
            <small style={{ color: "#718096" }}>
              {new Date(comment.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      ) : (
        <p style={{ color: "#a0aec0" }}>No comments yet.</p>
      )}
      
      <form onSubmit={handleCommentSubmit} style={{ marginTop: "20px" }}>
        {" "}
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          required
          style={{
            width: "100%",
            border: "1px solid #cbd5e0",
            borderRadius: "8px",
            padding: "10px",
            minHeight: "100px",
            marginBottom: "12px",
          }}
        />
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border rounded p-2"
          required
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#38a169",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
};

export default PostDetail;
