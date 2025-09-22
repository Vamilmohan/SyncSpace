import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskDetailModal.css';

const TaskDetailModal = ({ task, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs whenever the 'task' prop changes.
    if (task) {
      fetchComments();
    }
  }, [task]);

  const fetchComments = async () => {
    if (!task) return;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      setLoading(true);
      const { data } = await axios.get(`/api/tasks/${task._id}/comments`, config);
      setComments(data);
    } catch (err) {
      console.error('Could not fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment) return;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(`/api/tasks/${task._id}/comments`, { content: newComment }, config);
      setComments([...comments, data]); // Add new comment to the list
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment');
    }
  };

  // If no task is selected, don't render the modal
  if (!task) {
    return null;
  }

  return (
    // The overlay is the semi-transparent background
    <div className="modal-overlay" onClick={onClose}>
      {/* The modal content itself. We stop propagation so clicking inside it doesn't close it. */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task.title}</h2>
          <button onClick={onClose} className="modal-close-button">&times;</button>
        </div>
        <div className="modal-body">
          <p>{task.description || 'No description provided.'}</p>
          <div className="comments-section">
            <h3>Comments</h3>
            <form onSubmit={handleAddComment} className="add-comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                required
              />
              <button type="submit">Post</button>
            </form>
            <ul className="comment-list">
              {loading ? <p>Loading comments...</p> : comments.map(comment => (
                <li key={comment._id} className="comment">
                  <p>
                    <span className="comment-author">{comment.author.name}</span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </p>
                  <p className="comment-content">{comment.content}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;