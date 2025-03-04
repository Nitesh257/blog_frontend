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
  console.log("Post Data:", post);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "25px",
        margin: "10px",
        padding: "16px",
        width: "35vw",
        height: "50vh",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "40%",
          overflow: "hidden",
          borderRadius: "15px",
          marginBottom: "12px",
        }}
      >
        {post.coverImage && (
          <img
            src={`https://blogbackend-zz2d.onrender.com${post.coverImage}`}
            alt="Cover"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            className="post-image"
          />
        )}
      </div>
      <h2
        style={{
          fontSize: "2vw",
          textAlign: "center",
          fontWeight: "600",
          marginBottom: "12px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {" "}
        {post.title}
      </h2>
      <p
        style={{
          textAlign: "center",
          fontSize: "1vw",
          color: "#4a5568",
          marginBottom: "16px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {post.content.substring(0, 50)}
      </p>

      <div
        className=""
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
            backgroundColor: hasLiked ? "blue" : "grey",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginBottom: "10px",
          }}
          onClick={handleLikeToggle}
        >
          {hasLiked ? "Unlike" : "Like"} ({likes.length})
        </button>
      </div>
      <Link
        to={`/posts/${post._id}`}
        style={{
          fontSize: "1vw",
          color: "#3182ce",
          textDecoration: "none",
          fontWeight: "500",
        }}
      >
        Read More
      </Link>
    </div>
  );
};

export default PostItem;
