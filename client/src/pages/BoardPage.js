import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TaskDetailModal from '../components/kanban/TaskDetailModal';
import { arrayMove } from '@dnd-kit/sortable'; // Make sure this is imported if you moved DND logic here

const BoardPage = () => {
  const { id: workspaceId } = useParams();
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [workspaceName, setWorkspaceName] = useState('Project Name'); // Placeholder

  const fetchBoard = async () => { 
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`/api/boards/${workspaceId}`, config);
      setColumns(data);
    } catch (err) {
      setError('Could not fetch board data.');
    } finally {
      setLoading(false);
    }
   };
  useEffect(() => { fetchBoard(); }, [workspaceId]);

  const handleTaskClick = (task) => setSelectedTask(task);
  const handleCloseModal = () => { setSelectedTask(null); fetchBoard(); };

  const handleDragEnd = async (event) => { /* Your existing handleDragEnd logic goes here */ };

  if (loading) return <p className="loading-spinner">Loading...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  return (
    <div className="board-page-container">
      <header className="board-header">
        <h1>{workspaceName}</h1>
        <div className="board-share-section">
          {/* Placeholder for avatars */}
          <button className="board-share-button">
            <span>&#43;</span> Share
          </button>
        </div>
      </header>

      <KanbanBoard 
        columns={columns} 
        onTaskClick={handleTaskClick} 
        handleDragEnd={handleDragEnd} 
        setColumns={setColumns} // Pass setColumns for optimistic updates
      />
      
      <TaskDetailModal task={selectedTask} onClose={handleCloseModal} />
    </div>
  );
};

export default BoardPage;