import { useEffect, useState } from "react";
import { Post } from "../types/Post";
import { useAuth } from "../context/AuthContext";
import CommentModal from "../components/CommentModal";
import { Link } from "react-router-dom";
import FullScreenLoader from "../components/FullScreenLoader";

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/api/posts`);
        const postData = await res.json();
        if (!res.ok) throw new Error("Failed to fetch posts");

        setPosts(postData.reverse());

        // Fetch following status if user is logged in
        if (user) {
          const followRes = await fetch(
            `${API_BASE}/api/users/${user.email}/following`
          );
          const followData = await followRes.json();
          const map: Record<string, boolean> = {};
          followData.following.forEach((email: string) => {
            map[email] = true;
          });
          setFollowingMap(map);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email }),
      });

      if (!res.ok) throw new Error("Failed to toggle like");

      const data = await res.json();
      const updatedPost = data.post;

      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === postId ? updatedPost : p))
      );
    } catch (err) {
      console.error("Like failed:", err);
      setError("Could not like post. Try again.");
    }
  };

  const handleFollowToggle = async (targetEmail: string) => {
    if (!user || targetEmail === user.email) return;

    const isFollowing = followingMap[targetEmail];

    try {
      const url = `${API_BASE}/api/users/${targetEmail}/${
        isFollowing ? "unfollow" : "follow"
      }`;
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email }),
      });

      if (!res.ok) throw new Error("Failed to update follow status");

      setFollowingMap((prev) => ({
        ...prev,
        [targetEmail]: !isFollowing,
      }));
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
      setError("Failed to update follow status");
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
      <h1 className="text-3xl font-bold mb-8">🌍 Global Feed</h1>
      {error && <div className="text-center text-red-500">{error}</div>}
      {loading && <FullScreenLoader />}

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        posts.map((post) => {
          const liked = user ? post.likes?.includes(user.email) : false;
          const isSelf = post.userEmail === user?.email;
          const isFollowingUser = followingMap[post.userEmail] || false;

          return (
            <div
              key={post._id}
              className="bg-white border rounded-lg p-5 mb-6 shadow hover:shadow-md transition"
            >
              {/* Author & Follow */}
              <div className="flex items-center justify-between mb-2">
                <Link
                  to={`/profile/${post.userEmail}`}
                  className="flex items-center gap-3"
                >
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
                </Link>

                {!isSelf && (
                  <button
                    onClick={() => handleFollowToggle(post.userEmail)}
                    className={`text-xs px-3 py-1 rounded border ${
                      isFollowingUser
                        ? "bg-red-100 text-red-600 border-red-300 hover:bg-red-200"
                        : "bg-green-100 text-green-600 border-green-300 hover:bg-green-200"
                    }`}
                  >
                    {isFollowingUser ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>

              {/* Title & Content */}
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {post.title}
              </h2>
              <p className="text-gray-700 mb-3">{post.content}</p>

              {/* Actions */}
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

      {/* Comment Modal */}
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

export default Feed;
