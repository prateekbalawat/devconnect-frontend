import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post } from "../types/Post";
import { useAuth } from "../context/AuthContext";
import CreatePostModal from "../components/CreatePostModal";
import EditPostModal from "../components/EditPostModal";
import FullScreenLoader from "../components/FullScreenLoader";

const Profile = () => {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE;
  const isOwnProfile = user?.email === email;

  // Fetch profile posts and basic user info
  useEffect(() => {
    if (!email) return;

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/users/${email}/posts`);
        if (!res.ok) throw new Error("User not found");

        const { user: userData, posts: userPosts } = await res.json();
        setProfileUser(userData);
        setPosts(userPosts.reverse());
      } catch (err) {
        console.error("Error loading profile:", err);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [email, API_BASE, navigate]);

  // Fetch follow counts + whether current user is following this profile
  useEffect(() => {
    if (!email || !user) return;

    const fetchFollowData = async () => {
      setLoading(true);
      try {
        const [followersRes, followingRes] = await Promise.all([
          fetch(`${API_BASE}/api/users/${email}/followers`),
          fetch(`${API_BASE}/api/users/${email}/following`),
        ]);

        const followers = await followersRes.json();
        const following = await followingRes.json();

        setFollowersCount(followers.count);
        setFollowingCount(following.count);
        console.log("followers", followers);
        console.log("following", following);
        setIsFollowingUser(followers.followers.includes(user.email));
      } catch (err) {
        console.error("Error fetching follow data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowData();
  }, [email, user]);

  const handleToggleFollow = async () => {
    if (!user || !email) return;

    const action = isFollowingUser ? "unfollow" : "follow";
    const url = `${API_BASE}/api/users/${email}/${action}`;

    try {
      setLoading(true);
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email }),
      });

      // Refresh follow state
      const res = await fetch(`${API_BASE}/api/users/${email}/followers`);
      const updatedFollowers = await res.json();
      console.log("updatedfollowers", updatedFollowers);
      setFollowersCount(updatedFollowers.count);
      setIsFollowingUser(updatedFollowers.followers.includes(user.email));
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete the post.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newPost) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      const data = await res.json();
      setPosts((prev) => [data.post, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedPost) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/posts/${updatedPost._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to update");

      setPosts((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? data.post : p))
      );
      setEditingPost(null);
    } catch (err) {
      console.error("Edit error:", err);
      alert("Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
  };

  if (loading || !profileUser) return <FullScreenLoader />;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* 👤 User Info */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{profileUser.name || "User"}</h1>
          <p className="text-sm text-gray-600">{profileUser.email}</p>
          <div className="text-sm text-gray-500 mt-1">
            <span className="mr-4">👥 Followers: {followersCount}</span>
            <span>➡️ Following: {followingCount}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {isOwnProfile ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
            >
              + New Post
            </button>
          ) : (
            <button
              onClick={handleToggleFollow}
              className={`px-4 py-2 rounded text-sm border ${
                isFollowingUser
                  ? "bg-red-100 text-red-600 border-red-300 hover:bg-red-200"
                  : "bg-green-100 text-green-600 border-green-300 hover:bg-green-200"
              }`}
            >
              {isFollowingUser ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {/* 📬 Posts */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post._id} className="border p-4 rounded shadow-sm">
                <h3 className="font-bold">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
                <p className="mb-2">{post.content}</p>

                {isOwnProfile && (
                  <div className="space-x-2 text-sm">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🎯 Modals */}
      {showCreateModal && (
        <CreatePostModal
          userEmail={user!.email}
          userName={user!.name}
          onSave={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onUpdate={handleUpdate}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
};

export default Profile;
