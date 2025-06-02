'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, PlusCircle, Loader2 } from 'lucide-react';
import { suggestSimilarTasks, type SuggestSimilarTasksInput } from '@/ai/flows/suggest-similar-tasks';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskSuggestionsProps {
  currentTasks: string[];
  onAddSuggestedTask: (taskText: string) => void;
}

export function TaskSuggestions({ currentTasks, onAddSuggestedTask }: TaskSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      if (currentTasks.length === 0) {
        toast({
          title: "Add some tasks first!",
          description: "AI needs existing tasks to suggest similar ones.",
          variant: "default",
        });
        setIsLoading(false);
        return;
      }
      const input: SuggestSimilarTasksInput = { tasks: currentTasks };
      const result = await suggestSimilarTasks(input);
      if (result && result.suggestedTasks) {
        setSuggestions(result.suggestedTasks);
      } else {
        setSuggestions([]);
        toast({
          title: "No suggestions found",
          description: "The AI couldn't find any similar tasks right now.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error fetching task suggestions:", error);
      toast({
        title: "Error",
        description: "Could not fetch task suggestions. Please try again.",
        variant: "destructive",
      });
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestion = (taskText: string) => {
    onAddSuggestedTask(taskText);
    // Optional: Remove from suggestions list after adding
    setSuggestions(prev => prev.filter(s => s !== taskText)); 
    toast({
      title: "Quest Added!",
      description: `"${taskText}" added with bonus XP.`,
      variant: "default"
    });
  };

  return (
    <Card className="mt-6 !rounded-none border-2 border-foreground shadow-pixel">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" /> AI Quest Helper
        </CardTitle>
        <CardDescription className="font-body">Stuck? Let AI suggest your next quests for bonus XP!</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleGetSuggestions}
          disabled={isLoading}
          className="w-full !rounded-none border-2 border-accent-foreground shadow-pixel-sm bg-accent hover:bg-accent/90 text-accent-foreground mb-4"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Suggest Quests
        </Button>

        {suggestions.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="font-headline text-md text-foreground">Suggested Quests:</h4>
            <ul className="list-none space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-background border border-muted text-sm">
                  <span>{suggestion}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddSuggestion(suggestion)}
                    className="!rounded-none text-primary hover:bg-primary/10"
                    aria-label={`Add suggested task: ${suggestion}`}
                  >
                    <PlusCircle className="w-4 h-4 mr-1" /> Add
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
