
'use client';

import { useState, useEffect } from 'react';
import type { Task, UserStats, PixelPetConfig } from '@/lib/types';
import { PET_COLORS } from '@/lib/types';
import { TaskInput } from '@/components/pixel-quest/TaskInput';
import { TaskList } from '@/components/pixel-quest/TaskList';
import { XpDisplay } from '@/components/pixel-quest/XpDisplay';
import { PixelPet } from '@/components/pixel-quest/PixelPet';
import { TaskSuggestions } from '@/components/pixel-quest/TaskSuggestions';
import { ThemeToggle } from '@/components/pixel-quest/ThemeToggle';
import { RealTimeClock } from '@/components/pixel-quest/RealTimeClock'; // Import the new component
import { Button } from '@/components/ui/button';
import { Zap, RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
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


  const handleAddTask = (text: string, isSystemGenerated: boolean = false) => {
    let taskTextForDisplay = text;
    if (isSystemGenerated) {
      // Remove [AI] prefix for display if it's system generated
      taskTextForDisplay = text.replace(/^\[AI\]\s*/, '');
    }

    const newTask: Task = {
      id: Date.now().toString(), // Simple unique ID
      text: taskTextForDisplay,
      completed: false,
      createdAt: Date.now(),
      isAISuggested: isSystemGenerated, // Set the flag
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);

    if (isSystemGenerated) {
       toast({
        title: "New Quest Accepted!",
        description: `"${taskTextForDisplay}" is ready. Complete it for bonus XP!`,
      });
    }
  };

  const handleToggleComplete = (id: string) => {
    let taskCompletedText = "";
    let wasAlreadyCompleted = false;
    let taskIsAISuggested = false;

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          taskCompletedText = task.text;
          wasAlreadyCompleted = task.completed;
          taskIsAISuggested = !!task.isAISuggested; // Check the flag
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );

    if (!wasAlreadyCompleted) {
      const xpGained = taskIsAISuggested ? XP_PER_SUGGESTED_TASK : XP_PER_TASK;
      
      setUserStats((prevStats) => {
        const newXp = prevStats.xp + xpGained;
        const newStats = checkLevelUp({ ...prevStats, xp: newXp });
        if (newStats.level > prevStats.level) {
          toast({
            title: "LEVEL UP!",
            description: `Congratulations! You've reached Level ${newStats.level}!`,
            action: <Button variant="ghost" size="sm" className="text-yellow-400 !rounded-none"><Zap className="w-4 h-4 mr-1"/> Awesome!</Button>
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
  
  const handleResetLevel = () => {
    setUserStats(getInitialUserStats());
    toast({
      title: "Level Reset!",
      description: "You are back to Level 1 with 0 XP. A fresh start!",
      variant: "default",
    });
    setIsResetDialogOpen(false);
  };

  const currentTaskTexts = tasks.filter(task => !task.completed).map(task => task.text);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-body flex flex-col items-center">
      <header className="mb-4 text-center w-full max-w-2xl relative">
        <div className="flex justify-center items-center relative">
            <h1 className="text-5xl font-headline text-primary tracking-wider uppercase" style={{ textShadow: '3px 3px 0px hsl(var(--foreground))' }}>
            PixelQuest To-Do
            </h1>
            <ThemeToggle className="!rounded-none border-2 border-foreground shadow-pixel-sm w-10 h-10 absolute top-1/2 right-0 transform -translate-y-1/2 mr-2 md:mr-0" />
        </div>
        <p className="text-muted-foreground font-body text-lg mt-2">Turn your tasks into epic adventures!</p>
        <RealTimeClock /> {/* Add the RealTimeClock component here */}
      </header>

      <main className="w-full max-w-2xl space-y-6">
        <XpDisplay stats={userStats} />
        
        <section aria-labelledby="pixel-pet-heading">
          <h2 id="pixel-pet-heading" className="sr-only">Pixel Pet</h2>
          <PixelPet petConfig={petConfig} onUpdatePetColor={handleUpdatePetColor} />
        </section>
        
        <section aria-labelledby="add-task-heading">
           <h2 id="add-task-heading" className="text-2xl font-headline text-foreground mb-2 text-center uppercase">Add New Quest</h2>
          <TaskInput onAddTask={(text) => handleAddTask(text, false)} />
        </section>

        <section aria-labelledby="task-list-heading">
          <h2 id="task-list-heading" className="text-2xl font-headline text-foreground mb-2 text-center uppercase">Your Quests</h2>
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

        <section aria-labelledby="settings-heading" className="pt-4">
            <h2 id="settings-heading" className="text-xl font-headline text-foreground mb-2 text-center uppercase">Game Settings</h2>
            <div className="flex justify-center">
            <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="!rounded-none border-2 border-foreground shadow-pixel-sm font-body text-base">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Level & XP
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="font-body !rounded-none border-2 border-foreground shadow-pixel">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-headline uppercase">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="font-body text-base">
                    This action will reset your Level to 1 and your XP to 0.
                    All your hard-earned progress will be lost. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel 
                    onClick={() => setIsResetDialogOpen(false)}
                    className="!rounded-none border-2 border-foreground shadow-pixel-sm font-body text-base"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleResetLevel} 
                    className="!rounded-none border-2 border-foreground shadow-pixel-sm bg-destructive hover:bg-destructive/90 text-destructive-foreground font-body text-base"
                  >
                    Yes, Reset Progress
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </div>
        </section>
      </main>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PixelQuest To-Do. Gamify Your Life!</p>
      </footer>
    </div>
  );
}
