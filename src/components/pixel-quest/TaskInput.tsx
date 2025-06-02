'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (text: string) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [taskText, setTaskText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText.trim());
      setTaskText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Add a new quest..."
        className="flex-grow !rounded-none border-2 border-foreground focus:border-primary shadow-pixel-sm"
        aria-label="New task"
      />
      <Button type="submit" variant="default" className="!rounded-none border-2 border-primary-foreground shadow-pixel-sm bg-primary hover:bg-primary/90 text-primary-foreground">
        <Plus className="w-5 h-5 mr-1" /> Add
      </Button>
    </form>
  );
}
