import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './Kanban.css';

const TaskCard = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
      onClick={onClick}
    >
      <div className="task-card-tag">UI Design</div>
      <p className="task-card-title">{task.title}</p>
      <div className="task-card-footer">
        <div className="task-card-stats">
          <span>
            {/* Placeholder for comments icon */}
            <span>C</span> {task.comments?.length || 0}
          </span>
          <span>
            {/* Placeholder for attachment icon */}
            <span>A</span> 0
          </span>
        </div>
        {/* Placeholder for avatars */}
        <div></div>
      </div>
    </div>
  );
};

export default TaskCard;