import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import './Kanban.css';

const Column = ({ column, onTaskClick }) => {
  const { setNodeRef } = useSortable({ id: column._id });

  return (
    <div ref={setNodeRef} className="column">
      <div className="column-header">
        <h3>{column.name} ({column.tasks.length})</h3>
      </div>
      <SortableContext items={column.tasks.map(task => task._id)} strategy={verticalListSortingStrategy}>
        <div className="task-list">
          {column.tasks.map(task => (
            <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </div>
      </SortableContext>
      {/* We can add a custom-styled "Add new" button here later */}
    </div>
  );
};

export default Column;