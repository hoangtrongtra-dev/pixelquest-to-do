'use client';

import type { Task } from '@/lib/types';
import { TaskItem } from './TaskItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({ tasks, onToggleComplete, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-center text-muted-foreground py-4 font-body text-base">No quests yet! Add some to begin your adventure.</p>;
  }

  // Sort tasks: incomplete first, then by creation date (newest first for incomplete, oldest first for complete)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return a.completed ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
  });


  return (
    <ScrollArea className="h-[300px] w-full p-1 border-2 border-foreground bg-background !rounded-none">
      <div className="space-y-2 p-2">
        {sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
