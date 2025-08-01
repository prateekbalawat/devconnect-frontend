// pages/FollowingFeed.tsx

import { useEffect, useState } from "react";
import { Post } from "../types/Post";
import { useAuth } from "../context/AuthContext";
import CommentModal from "../components/CommentModal";
import { Link } from "react-router-dom";
import FullScreenLoader from "../components/FullScreenLoader";

const FollowingFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowedPosts = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/api/posts/following/${user.email}`
        );
        if (!res.ok) throw new Error("Failed to fetch followed posts");

        const { posts } = await res.json();
        setPosts(posts);
      } catch (err) {
        console.error("Error loading followed posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedPosts();
  }, [user]);

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: user.email }),
      });

      if (!res.ok) throw new Error("Failed to like post");

      const data = await res.json();
      const updatedPost = data.post;

      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === postId ? updatedPost : p))
      );
    } catch (err) {
      console.error("Like failed:", err);
      alert("Failed to like post.");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentUpdate = (updatedPost: Post) => {
    const newPosts = posts.map((p) =>
      p._id === updatedPost._id ? updatedPost : p
    );
    setPosts(newPosts);
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      {loading && <FullScreenLoader />}
      <h1 className="text-3xl font-bold mb-8">👥 Following</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">
          You haven’t followed anyone yet or they haven't posted.
        </p>
      ) : (
        posts.map((post) => {
          const liked = user ? post.likes?.includes(user.email) : false;

          return (
            <div
              key={post._id}
              className="bg-white border rounded-lg p-5 mb-6 shadow hover:shadow-md transition"
            >
              <Link
                to={`/profile/${post.userEmail}`}
                className="text-gray-700 hover:text-indigo-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                      {post.userEmail[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        {post.userName || post.userEmail}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {post.title}
              </h2>
              <p className="text-gray-700 mb-3">{post.content}</p>

              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center gap-1 ${
                    liked ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  ❤️ <span>{post.likes?.length || 0}</span>
                </button>

                <button
                  onClick={() => setActivePost(post)}
                  className="text-indigo-600 hover:underline"
                >
                  💬 {post.comments?.length || 0} Comments
                </button>
              </div>
            </div>
          );
        })
      )}

      {activePost && (
        <CommentModal
          post={activePost}
          onClose={() => setActivePost(null)}
          onCommentAdd={handleCommentUpdate}
        />
      )}
    </div>
  );
};

export default FollowingFeed;
