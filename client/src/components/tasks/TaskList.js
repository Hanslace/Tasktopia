import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TASK_STATUSES } from '../constants/taskStatuses';
import { connect } from 'react-redux';
import { getTasks, updateTaskStatus } from '../actions/taskActions';

const TaskList = ({ getTasks, updateTaskStatus, task: { tasks, loading } }) => {
  const [columns, setColumns] = useState({
    [TASK_STATUSES.TO_DO]: [],
    [TASK_STATUSES.IN_PROGRESS]: [],
    [TASK_STATUSES.COMPLETED]: [],
  });

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  useEffect(() => {
    if (!loading && tasks) {
      const newColumns = {
        [TASK_STATUSES.TO_DO]: tasks.filter((task) => task.status === TASK_STATUSES.TO_DO),
        [TASK_STATUSES.IN_PROGRESS]: tasks.filter((task) => task.status === TASK_STATUSES.IN_PROGRESS),
        [TASK_STATUSES.COMPLETED]: tasks.filter((task) => task.status === TASK_STATUSES.COMPLETED),
      };
      setColumns(newColumns);
    }
  }, [tasks, loading]);

  // Function to handle drag end
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return; // If no destination, exit

    // Prevent drop in the same column at the same index
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const [movedTask] = sourceColumn.splice(source.index, 1); // Remove task from source
    destColumn.splice(destination.index, 0, movedTask); // Add task to destination

    // Update columns state
    setColumns({
      ...columns,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    });

    // Update task status in the backend
    updateTaskStatus(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {Object.keys(TASK_STATUSES).map((status) => (
          <Droppable key={status} droppableId={TASK_STATUSES[status]}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  width: '30%',
                  minHeight: '400px',
                  backgroundColor: '#f0f0f0',
                  padding: '10px',
                  borderRadius: '8px',
                }}
              >
                <h3>{TASK_STATUSES[status]}</h3>
                {columns[TASK_STATUSES[status]].map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: 'none',
                          padding: '16px',
                          margin: '0 0 8px 0',
                          backgroundColor: '#fff',
                          borderRadius: '4px',
                          ...provided.draggableProps.style,
                        }}
                      >
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

const mapStateToProps = (state) => ({
  task: state.task,
});

export default connect(mapStateToProps, { getTasks, updateTaskStatus })(TaskList);
