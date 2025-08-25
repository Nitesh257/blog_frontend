/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import PostItem from "../components/PostItem";
import useCountdownToast from "../components/countdown";
import { toast } from "react-toastify";



export const Home = () => {
  const { isLoggedIn, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const { showToastWithTimer, dismissToast } = useCountdownToast();

  useEffect(() => {
    showToastWithTimer("Getting Posts", 60);

    fetch("https://blogbackend-zz2d.onrender.com/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        dismissToast();
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        dismissToast();
        toast.error("Failed to fetch posts.");
      });

    return () => dismissToast();
  }, []);

  const palette = {
    pageBg: "#0b0f17",
    heroGrad: "radial-gradient(600px 300px at 15% -20%, rgba(125,211,252,0.18), transparent 60%), radial-gradient(800px 360px at 85% -10%, rgba(52,211,153,0.18), transparent 60%)",
    text: "#e5e7eb",
    subtext: "#9aa4b2",
    card: "#0f1729",
    cardBorder: "rgba(255,255,255,0.06)",
    primary: "#22c55e",
    secondary: "#7dd3fc",
    muted: "rgba(148,163,184,0.12)",
  };

  return (
    <>
      <main style={{ background: `${palette.heroGrad}, ${palette.pageBg}` }}>
        <section
          className="section-hero"
          style={{ padding: "64px 16px 40px" }}
        >
          <div
            className="container grid grid-two-cols"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              alignItems: "center",
              maxWidth: 1200,
              margin: "0 auto",
              gap: 32,
              color: palette.text,
            }}
          >
            <div className="hero-content" style={{ textAlign: "left" }}>
              <p style={{ fontSize: 18, color: palette.subtext, marginBottom: 10 }}>
                Hello, <strong style={{ color: palette.text }}>{user?.username || "there"}</strong>
              </p>
              <h1
                style={{
                  fontSize: 44,
                  lineHeight: 1.15,
                  fontWeight: 800,
                  marginBottom: 12,
                }}
              >
                Welcome to My Blog Website
              </h1>
              <p
                style={{
                  fontSize: 20,
                  lineHeight: 1.7,
                  color: palette.subtext,
                  marginBottom: 20,
                  maxWidth: 620,
                }}
              >
                Discover engaging stories, share your thoughts, and connect with a vibrant community of readers and writers.
              </p>

              <div className="btn btn-group" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="/contact" style={{ textDecoration: "none" }}>
                  <button
                    className="btn"
                    style={{
                      padding: "12px 18px",
                      borderRadius: 12,
                      background: "linear-gradient(180deg, #34d399, #10b981)",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 16,
                      fontWeight: 700,
                      boxShadow: "0 10px 20px rgba(16,185,129,0.25)",
                    }}
                  >
                    Connect Now
                  </button>
                </a>
                <a href="/create-post" style={{ textDecoration: "none" }}>
                  <button
                    className="btn secondary-btn"
                    style={{
                      padding: "12px 18px",
                      borderRadius: 12,
                      background: "rgba(125,211,252,0.18)",
                      color: palette.secondary,
                      border: `1px solid ${palette.cardBorder}`,
                      cursor: "pointer",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    Create your first post
                  </button>
                </a>
                <a href="/posts" style={{ textDecoration: "none" }}>
                  <button
                    className="btn secondary-btn"
                    style={{
                      padding: "12px 18px",
                      borderRadius: 12,
                      background: palette.muted,
                      color: palette.text,
                      border: `1px solid ${palette.cardBorder}`,
                      cursor: "pointer",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    See posts
                  </button>
                </a>
              </div>
            </div>

            <div className="hero-image" style={{ textAlign: "center" }}>
              <div style={{
                position: "relative",
                width: "100%",
                maxWidth: 520,
                margin: "0 auto",
                aspectRatio: "4/3",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                border: `1px solid ${palette.cardBorder}`,
                background: palette.card,
              }}>
                <img
                  src="/images/home.png"
                  alt="Coding Together"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transform: "scale(1.02)",
                  }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px 48px" }}>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            textAlign: "center",
            margin: "8px 0 22px",
            color: "#d0d4ddff",
          }}
        >
          {isLoggedIn ? "Latest posts" : "Login to see posts"}
        </h2>

        {posts.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 20,
            }}
          >
            {posts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: 16 }}>
            {isLoggedIn ? "No posts yet. Be the first to write!" : "Login & see posts"}
          </p>
        )}
      </section>
      
    </>
  );
};

export default Home;