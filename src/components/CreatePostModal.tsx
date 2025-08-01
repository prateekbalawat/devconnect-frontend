import { useState } from "react";
import { Post } from "../types/Post";
import { v4 as uuidv4 } from "uuid";

type Props = {
  userEmail: string;
  userName: string;
  onSave: (post: Post) => void;
  onClose: () => void;
};

const CreatePostModal = ({ userEmail, userName, onSave, onClose }: Props) => {
  const [formData, setFormData] = useState({ title: "", content: "" });

  const handleSubmit = () => {
    if (!formData.title || !formData.content) return;

    const newPost: Post = {
      id: uuidv4(),
      userEmail,
      userName,
      title: formData.title,
      content: formData.content,
      createdAt: new Date().toISOString(),
    };

    onSave(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Create a Post</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full border px-3 py-2 rounded mb-3"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          className="w-full border px-3 py-2 rounded mb-3"
          rows={4}
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        ></textarea>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="text-gray-600 hover:underline">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
