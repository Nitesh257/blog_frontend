// src/pages/Posts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

import PostItem from "../components/PostItem";
import { useAuth } from "../store/auth";
import useCountdownToast from "../components/countdown";
import { toast } from "react-toastify";
const Posts = () => {
  const { isLoggedIn } = useAuth();
  const [posts, setPosts] = useState([]);
  const { showToastWithTimer, dismissToast } = useCountdownToast();

  useEffect(() => {
    showToastWithTimer("Getting Posts", 60);

    axios
      .get("https://blogbackend-zz2d.onrender.com/api/posts/")
      .then((res) => {
        setPosts(res.data.posts);
        dismissToast(); 
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        dismissToast(); 
        toast.error("Failed to fetch posts.");
      });

    return () => dismissToast(); 
  }, []);

  return (
    <div className="max-w-3xl mx-auto ">
      <h1 className="text-3xl font-bold my-6">All Posts</h1>
      <div className="">
        {posts.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            {posts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#4a5568" }}>
            Login To see Posts
          </p>
        )}
      </div>
    </div>
  );
};

export default Posts;
