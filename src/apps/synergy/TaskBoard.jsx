import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const INITIAL_TASKS = {
  todo: [
    { id: "t1", title: "Chase NHS Digital for schema sign-off", owner: "You" },
    { id: "t2", title: "Estimate cohort segmentation view", owner: "You" },
    { id: "t3", title: "Update risk register", owner: "You" },
    { id: "t4", title: "Book cohort segmentation scoping call with Marcus", owner: "You" }
  ],
  inProgress: [
    { id: "t5", title: "Patient cohort API endpoints — remaining 3", owner: "Jess Okafor" },
    { id: "t6", title: "Performance testing on staging", owner: "Dev team" },
    { id: "t7", title: "Contractor headcount breakdown for Priya", owner: "Derek Holt" }
  ],
  done: [
    { id: "t8", title: "Data ingestion pipeline v2", owner: "Dev team" },
    { id: "t9", title: "UX review session", owner: "Jess Okafor" },
    { id: "t10", title: "Patient cohort API endpoints — first 4", owner: "Jess Okafor" }
  ]
};

const OWNER_COLORS = {
  "You": "#0078d4",
  "Jess Okafor": "#038387",
  "Derek Holt": "#d83b01",
  "Marcus Webb": "#8764b8",
  "Dev team": "#107c10"
};

const getOwnerColor = (owner) => {
  if (OWNER_COLORS[owner]) return OWNER_COLORS[owner];
  
  // Generate consistent color from name
  let hash = 0;
  for (let i = 0; i < owner.length; i++) {
    hash = owner.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ["#0078d4", "#107c10", "#d83b01", "#8764b8", "#038387", "#ff8c00", "#8e562e", "#c239b3"];
  return colors[Math.abs(hash) % colors.length];
};

const SortableTask = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <div className="task-card-title">{task.title}</div>
      <div className="task-card-footer">
        <span className="task-card-owner">{task.owner}</span>
        <span 
          className="task-card-dot"
          style={{ backgroundColor: getOwnerColor(task.owner) }}
        />
      </div>
    </div>
  );
};

const TaskColumn = ({ title, tasks, columnId, onAddTask }) => {
  return (
    <div className="task-column">
      <div className="task-column-header">
        <span className="task-column-title">{title}</span>
        <span className="task-column-count">{tasks.length}</span>
      </div>
      <div className="task-column-content">
        <SortableContext 
          items={tasks.map(t => t.id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <SortableTask key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export const TaskBoard = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id) => {
    if (tasks.todo.find(t => t.id === id)) return "todo";
    if (tasks.inProgress.find(t => t.id === id)) return "inProgress";
    if (tasks.done.find(t => t.id === id)) return "done";
    return null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id) || over.id;
    
    if (activeContainer && overContainer && activeContainer !== overContainer) {
      setTasks(prev => {
        const activeItems = prev[activeContainer];
        const overItems = prev[overContainer];
        const activeIndex = activeItems.findIndex(t => t.id === active.id);
        const overIndex = overItems.findIndex(t => t.id === over.id);
        
        let newIndex;
        if (over.id in prev) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem = over && active.rect.current.translated && 
            active.rect.current.translated.top > over.rect.top + over.rect.height;
          const modifier = isBelowOverItem ? 1 : 0;
          newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }
        
        const movedTask = activeItems[activeIndex];
        
        return {
          ...prev,
          [activeContainer]: activeItems.filter(t => t.id !== active.id),
          [overContainer]: [
            ...overItems.slice(0, newIndex),
            movedTask,
            ...overItems.slice(newIndex)
          ]
        };
      });
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }
    
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id) || over.id;
    
    if (activeContainer && overContainer && activeContainer === overContainer) {
      const activeIndex = tasks[activeContainer].findIndex(t => t.id === active.id);
      const overIndex = tasks[overContainer].findIndex(t => t.id === over.id);
      
      if (activeIndex !== overIndex) {
        setTasks(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex)
        }));
      }
    }
    
    setActiveId(null);
  };

  return (
    <div className="task-board">
      <h2>Vantage Project — Task Board</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="task-board-columns">
          <TaskColumn 
            title="To Do" 
            tasks={tasks.todo} 
            columnId="todo"
          />
          <TaskColumn 
            title="In Progress" 
            tasks={tasks.inProgress} 
            columnId="inProgress"
          />
          <TaskColumn 
            title="Done" 
            tasks={tasks.done} 
            columnId="done"
          />
        </div>
      </DndContext>
    </div>
  );
};
