'use client';

import type { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { PixelCheckbox } from './PixelCheckbox';
import { SparkleEffect } from './Sparkle';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskItem({ task, onToggleComplete, onDeleteTask }: TaskItemProps) {
  const [showSparkles, setShowSparkles] = useState(false);

  const handleToggleComplete = () => {
    onToggleComplete(task.id);
    if (!task.completed) {
      setShowSparkles(true);
      // Reset sparkle trigger after animation
      setTimeout(() => setShowSparkles(false), 600);
    }
  };
  
  return (
    <div className={cn(
      "flex items-center justify-between p-3 border-2 border-foreground bg-card mb-2 relative overflow-hidden",
      task.completed ? "bg-card/60" : "bg-card shadow-pixel-sm"
      )}>
      <div className="flex items-center gap-3">
        <PixelCheckbox
          checked={task.completed}
          onChange={handleToggleComplete}
          aria-labelledby={`task-text-${task.id}`}
        />
        <span
          id={`task-text-${task.id}`}
          className={cn(
            'font-body text-card-foreground break-all',
            { 'line-through text-muted-foreground': task.completed }
          )}
        >
          {task.text}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteTask(task.id)}
        className="!rounded-none text-destructive hover:bg-destructive/10 w-8 h-8"
        aria-label={`Delete task ${task.text}`}
      >
        <Trash2 className="w-5 h-5" />
      </Button>
      {showSparkles && <SparkleEffect trigger={showSparkles} />}
    </div>
  );
}
