import React, { useEffect, useState } from "react";
import { Analytics } from "../components/Analytics";
import { useAuth } from "../store/auth";
import PostItem from "../components/PostItem";

export const Home = () => {
  const { isLoggedIn, user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://blogbackend-zz2d.onrender.com/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <>
      <main>
        <section
          className="section-hero"
          style={{
            padding: "40px 0",
          }}
        >
          <div
            className="container grid grid-two-cols"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
              maxWidth: "1200px",
              margin: "0 auto",
              gap: "40px",
            }}
          >
            <div className="hero-content" style={{ textAlign: "left" }}>
              <p
                style={{
                  fontSize: "1.7rem",
                  color: "#ced6d6",
                  marginBottom: "12px",
                }}
              >
                Hello,{" "}
                <strong style={{ color: "#ced6d6" }}>{user.username}</strong>
              </p>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  marginBottom: "16px",
                  color: "#ced6d6",
                }}
              >
                Welcome to My Blog Website
              </h1>
              <p
                style={{
                  fontSize: "2rem",
                  lineHeight: "1.6",
                  color: "#ced6d6",
                  marginBottom: "24px",
                }}
              >
                Discover engaging articles, share your thoughts, and connect
                with a vibrant community of readers and writers. Dive into a
                world of insightful blogs and stay updated with the latest
                trends.
              </p>

              <div
                className="btn btn-group"
                style={{ display: "flex", gap: "16px" }}
              >
                <a href="/contact" style={{ textDecoration: "none" }}>
                  <button
                    className="btn"
                    style={{
                      padding: "12px 24px",
                      borderRadius: "8px",
                      backgroundColor: "#2bb573",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.5rem",
                    }}
                  >
                    Connect Now
                  </button>
                </a>
                <a href="/create-post" style={{ textDecoration: "none" }}>
                  <button
                    className="btn secondary-btn"
                    style={{
                      padding: "12px 24px",
                      borderRadius: "8px",
                      backgroundColor: "#8a916a",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.5rem",
                    }}
                  >
                    Create Your first Post
                  </button>
                </a>
                <a href="/posts" style={{ textDecoration: "none" }}>
                  <button
                    className="btn secondary-btn"
                    style={{
                      padding: "12px 24px",
                      borderRadius: "8px",
                      backgroundColor: "#4a5568",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.5rem",
                    }}
                  >
                    See Posts
                  </button>
                </a>
              </div>
            </div>

            <div className="hero-image" style={{ textAlign: "center" }}>
              <img
                src="/images/home.png"
                alt="Coding Together"
                width="400"
                height="500"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
          </div>
        </section>
      </main>
      <div style={{ maxWidth: "80vw", margin: "0 auto", padding: "20px" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Blog Posts
        </h1>

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
            No posts available.
          </p>
        )}

        {/* {isLoggedIn && <Analytics />} */}
      </div>
    </>
  );
};
