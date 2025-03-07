// src/pages/Posts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import PostItem from "../components/PostItem";
import { useAuth } from "../store/auth";
const Posts = () => {
  const { isLoggedIn } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("https://blogbackend-zz2d.onrender.com/api/posts/")
      .then((res) => setPosts(res.data.posts))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto " >
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
        <p style={{ textAlign: "center", color: "#4a5568" }}>Login To see Posts</p>
      )}
     </div>
    </div>
  );
};

export default Posts;
