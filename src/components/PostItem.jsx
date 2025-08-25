/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const PostItem = ({ post }) => {
  const { user, isLoggedIn } = useAuth();
  const [likes, setLikes] = useState(post.likes);

  const hasLiked = user && likes.includes(user._id);

  const handleLikeToggle = () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to like posts.");
      return;
    }

    const url = `https://blogbackend-zz2d.onrender.com/api/posts/${post._id}/${
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
          setLikes(data.post.likes);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        console.error("Error toggling like:", err);
        toast.error("Failed to toggle like.");
      });
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "20px",
        margin: "16px",
        padding: "16px",
        width: "350px",
        minHeight: "420px",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#e1d2d2ff",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      className="post-card"
    >
      <div
        style={{
          width: "100%",
          height: "180px",
          overflow: "hidden",
          borderRadius: "12px",
          marginBottom: "12px",
        }}
      >
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt="Cover"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            className="post-image"
          />
        )}
      </div>

      <h2
        style={{
          fontSize: "1.4rem",
          textAlign: "center",
          fontWeight: "700",
          marginBottom: "8px",
          color: "#2d3748",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {post.title}
      </h2>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.95rem",
          color: "#4a5568",
          marginBottom: "16px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {post.content.substring(0, 80)}...
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <button
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: hasLiked ? "#3182ce" : "#a0aec0",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background-color 0.2s ease",
          }}
          onClick={handleLikeToggle}
        >
          {hasLiked ? "Unlike" : "Like"} ({likes.length})
        </button>

        <Link
          to={`/posts/${post._id}`}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#38a169",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "500",
            transition: "background-color 0.2s ease",
          }}
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostItem;