import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column';
import './Kanban.css';

const KanbanBoard = ({ columns, onTaskClick, handleDragEnd }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        <SortableContext items={columns.map(col => col._id)} strategy={horizontalListSortingStrategy}>
          {columns.map(column => (
            <Column key={column._id} column={column} onTaskClick={onTaskClick} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default KanbanBoard;