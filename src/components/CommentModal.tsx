import { useState } from "react";
import { Comment, Post } from "../types/Post";
import { useAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import FullScreenLoader from "../components/FullScreenLoader";

interface Props {
  post: Post;
  onClose: () => void;
  onCommentAdd: (updatedPost: Post) => void;
}

const CommentModal = ({ post, onClose, onCommentAdd }: Props) => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [localPost, setLocalPost] = useState<Post>(post);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState("");
  const [editingReplyId, setEditingReplyId] = useState<{
    commentIndex: number;
    replyIndex: number;
  } | null>(null);
  const [editedReplyContent, setEditedReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!user || !input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/posts/${localPost._id}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user.email, content: input }),
        }
      );
      const data = await res.json();
      setLocalPost(data.post);
      onCommentAdd(data.post);
      setInput("");
    } catch (err: any) {
      console.log(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveComment = async (index: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/posts/${
          localPost._id
        }/comment/${index}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editedContent }),
        }
      );
      const data = await res.json();
      setLocalPost(data.post);
      onCommentAdd(data.post);
      setEditingCommentId(null);
      setEditedContent("");
    } catch (err: any) {
      console.log(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (index: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/posts/${
          localPost._id
        }/comment/${index}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      setLocalPost(data.post);
      onCommentAdd(data.post);
    } catch (err: any) {
      console.log(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (commentIndex: number) => {
    if (!user || !replyInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/posts/${
          localPost._id
        }/comment/${commentIndex}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user.email, content: replyInput }),
        }
      );
      const data = await res.json();
      setLocalPost(data.post);
      onCommentAdd(data.post);
      setReplyInput("");
      setReplyingTo(null);
    } catch (err: any) {
      console.log(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReply = async (commentIndex: number, replyIndex: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/posts/${
          localPost._id
        }/comment/${commentIndex}/reply/${replyIndex}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editedReplyContent }),
        }
      );
      const data = await res.json();
      setLocalPost(data.post);
      onCommentAdd(data.post);
      setEditingReplyId(null);
      setEditedReplyContent("");
    } catch (err: any) {
      console.log(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReply = async (
    commentIndex: number,
    replyIndex: number
  ) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/posts/${
          localPost._id
        }/comment/${commentIndex}/reply/${replyIndex}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      setLocalPost(data.post);
      onCommentAdd(data.post);
    } catch (err: any) {
      console.log(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {loading && <FullScreenLoader />}
      <div className="bg-white rounded-xl w-full max-w-xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        {/* Post Header */}
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
              {localPost.userEmail[0].toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">
                {localPost.userEmail}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(localPost.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {localPost.title}
          </h2>
          <p className="text-gray-700">{localPost.content}</p>
        </div>

        <hr className="my-4" />

        {/* Comments Section */}
        <h3 className="text-md font-semibold mb-2">Comments</h3>
        <div className="overflow-y-auto max-h-64 pr-2 mb-4 space-y-3">
          {localPost.comments && localPost.comments.length > 0 ? (
            localPost.comments.map((comment, commentIndex) => {
              const isEditing = editingCommentId === comment.id;
              return (
                <div
                  key={comment.id}
                  className="bg-gray-50 border border-gray-200 rounded-md p-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {comment.userEmail[0].toUpperCase()}
                    </div>

                    {/* Main Comment Content */}
                    <div className="flex-grow">
                      {isEditing ? (
                        <input
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full text-sm border rounded px-2 py-1 mb-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-800 font-medium mb-1">
                          {comment.content}
                        </p>
                      )}
                      <div className="text-xs text-gray-500">
                        {comment.userEmail} •{" "}
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>

                      {/* Buttons */}
                      {user?.email === comment.userEmail && (
                        <div className="text-xs mt-1 space-x-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveComment(commentIndex)}
                                className="text-green-600 hover:underline"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingCommentId(null)}
                                className="text-gray-500 hover:underline"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditedContent(comment.content);
                                }}
                                className="text-blue-600 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteComment(commentIndex)
                                }
                                className="text-red-500 hover:underline"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {/* Reply section */}
                      {replyingTo === comment.id ? (
                        <div className="mt-2">
                          <input
                            value={replyInput}
                            onChange={(e) => setReplyInput(e.target.value)}
                            className="w-full text-sm border rounded px-2 py-1"
                            placeholder="Write a reply..."
                          />
                          <button
                            onClick={() => handleAddReply(commentIndex)}
                            className="text-indigo-600 text-xs mt-1 hover:underline"
                          >
                            Reply
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(comment.id)}
                          className="text-indigo-500 text-xs hover:underline mt-1"
                        >
                          Reply
                        </button>
                      )}

                      {/* Show replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-6 mt-3 space-y-2">
                          {comment.replies.map((reply, replyIndex) => (
                            <div
                              key={reply.id}
                              className="bg-white border border-gray-300 p-2 rounded-md"
                            >
                              <div className="flex flex-col">
                                {editingReplyId?.commentIndex ===
                                  commentIndex &&
                                editingReplyId?.replyIndex === replyIndex ? (
                                  <>
                                    <input
                                      value={editedReplyContent}
                                      onChange={(e) =>
                                        setEditedReplyContent(e.target.value)
                                      }
                                      className="text-sm border rounded px-2 py-1 mb-1"
                                    />
                                    <div className="text-xs space-x-2">
                                      <button
                                        onClick={() =>
                                          handleSaveReply(
                                            commentIndex,
                                            replyIndex
                                          )
                                        }
                                        className="text-green-600 hover:underline"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingReplyId(null)}
                                        className="text-gray-500 hover:underline"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-sm">{reply.content}</p>
                                    <div className="text-xs text-gray-500">
                                      {reply.userEmail} •{" "}
                                      {new Date(
                                        reply.createdAt
                                      ).toLocaleString()}
                                    </div>
                                    {user?.email === reply.userEmail && (
                                      <div className="text-xs mt-1 space-x-2">
                                        <button
                                          onClick={() => {
                                            setEditingReplyId({
                                              commentIndex,
                                              replyIndex,
                                            });
                                            setEditedReplyContent(
                                              reply.content
                                            );
                                          }}
                                          className="text-blue-600 hover:underline"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteReply(
                                              commentIndex,
                                              replyIndex
                                            )
                                          }
                                          className="text-red-500 hover:underline"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          )}
        </div>

        {/* Add Comment */}
        <div className="flex gap-2 mt-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow border rounded px-3 py-1 text-sm"
            placeholder="Write a comment..."
          />
          <button
            onClick={handleAddComment}
            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
