'use client';

import { useState, useEffect } from 'react';
import type { Task, UserStats, PixelPetConfig } from '@/lib/types';
import { PET_COLORS } from '@/lib/types';
import { TaskInput } from '@/components/pixel-quest/TaskInput';
import { TaskList } from '@/components/pixel-quest/TaskList';
import { XpDisplay } from '@/components/pixel-quest/XpDisplay';
import { PixelPet } from '@/components/pixel-quest/PixelPet';
import { TaskSuggestions } from '@/components/pixel-quest/TaskSuggestions';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import {
  getInitialUserStats,
  checkLevelUp,
  XP_PER_TASK,
  XP_PER_SUGGESTED_TASK,
} from '@/lib/xpSystem';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(getInitialUserStats());
  const [petConfig, setPetConfig] = useState<PixelPetConfig>({
    name: 'PixelPal',
    color: PET_COLORS[0].value, // Default color
  });
  const { toast } = useToast();

  // Load state from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('pixelQuestTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    const savedStats = localStorage.getItem('pixelQuestStats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
    const savedPetConfig = localStorage.getItem('pixelQuestPetConfig');
    if (savedPetConfig) {
      setPetConfig(JSON.parse(savedPetConfig));
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pixelQuestTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pixelQuestStats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('pixelQuestPetConfig', JSON.stringify(petConfig));
  }, [petConfig]);


  const handleAddTask = (text: string, isSuggested: boolean = false) => {
    const newTask: Task = {
      id: Date.now().toString(), // Simple unique ID
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    if (isSuggested) {
      // If it's a suggested task, it's added as incomplete. XP is awarded on completion.
       toast({
        title: "New Quest Accepted!",
        description: `"${text}" is ready. Complete it for bonus XP!`,
      });
    }
  };

  const handleToggleComplete = (id: string) => {
    let taskCompletedText = "";
    let wasAlreadyCompleted = false;

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          taskCompletedText = task.text;
          wasAlreadyCompleted = task.completed;
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );

    if (!wasAlreadyCompleted) {
      const isSuggested = tasks.find(t => t.id === id)?.text.startsWith("[AI] "); // A simple check
      const xpGained = isSuggested ? XP_PER_SUGGESTED_TASK : XP_PER_TASK;
      
      setUserStats((prevStats) => {
        const newXp = prevStats.xp + xpGained;
        const newStats = checkLevelUp({ ...prevStats, xp: newXp });
        if (newStats.level > prevStats.level) {
          toast({
            title: "LEVEL UP!",
            description: `Congratulations! You've reached Level ${newStats.level}!`,
            action: <Button variant="ghost" size="sm" className="text-yellow-400"><Zap className="w-4 h-4 mr-1"/> Awesome!</Button>
          });
        }
        return newStats;
      });
       toast({
          title: "Quest Complete!",
          description: `You earned ${xpGained} XP for completing "${taskCompletedText}".`,
        });
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    toast({
      title: "Quest Removed",
      description: "The quest has been removed from your list.",
      variant: "destructive"
    });
  };

  const handleUpdatePetColor = (color: string) => {
    setPetConfig((prevConfig) => ({ ...prevConfig, color }));
  };
  
  const currentTaskTexts = tasks.filter(task => !task.completed).map(task => task.text);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-body flex flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-headline text-primary tracking-wider" style={{ textShadow: '2px 2px 0px hsl(var(--foreground))' }}>
          PixelQuest To-Do
        </h1>
        <p className="text-muted-foreground font-body">Turn your tasks into epic adventures!</p>
      </header>

      <main className="w-full max-w-2xl space-y-6">
        <XpDisplay stats={userStats} />
        
        <section aria-labelledby="pixel-pet-heading">
          <h2 id="pixel-pet-heading" className="sr-only">Pixel Pet</h2>
          <PixelPet petConfig={petConfig} onUpdatePetColor={handleUpdatePetColor} />
        </section>
        
        <section aria-labelledby="add-task-heading">
           <h2 id="add-task-heading" className="text-2xl font-headline text-foreground mb-2 text-center">Add New Quest</h2>
          <TaskInput onAddTask={(text) => handleAddTask(text, false)} />
        </section>

        <section aria-labelledby="task-list-heading">
          <h2 id="task-list-heading" className="text-2xl font-headline text-foreground mb-2 text-center">Your Quests</h2>
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
          />
        </section>
        
        <section aria-labelledby="task-suggestions-heading">
          <h2 id="task-suggestions-heading" className="sr-only">Task Suggestions</h2>
          <TaskSuggestions currentTasks={currentTaskTexts} onAddSuggestedTask={(text) => handleAddTask(`[AI] ${text}`, true)} />
        </section>
      </main>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PixelQuest To-Do. Gamify Your Life!</p>
      </footer>
    </div>
  );
}
