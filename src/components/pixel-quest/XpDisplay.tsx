'use client';

import type { UserStats } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface XpDisplayProps {
  stats: UserStats;
}

export function XpDisplay({ stats }: XpDisplayProps) {
  const progressPercentage = stats.xpToNextLevel > 0 ? (stats.xp / stats.xpToNextLevel) * 100 : 0;

  return (
    <Card className="mb-4 !rounded-none border-2 border-foreground shadow-pixel">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-2xl text-center">Level: {stats.level}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-2 font-body">
          XP: {stats.xp} / {stats.xpToNextLevel}
        </div>
        <Progress value={progressPercentage} className="h-6 !rounded-none border-2 border-foreground bg-muted" indicatorClassName="bg-accent" />
        { stats.xp >= stats.xpToNextLevel && (
          <p className="text-center mt-2 text-sm text-green-500 font-bold animate-bounce">LEVEL UP!</p>
        )}
      </CardContent>
    </Card>
  );
}

// Helper component for Progress indicator with pixel style
function PixelProgressIndicator({ className, ...props }: React.ComponentProps<typeof ProgressPrimitive.Indicator>) {
  return <ProgressPrimitive.Indicator className={cn("h-full w-full flex-1 bg-accent transition-all !rounded-none", className)} {...props} />;
}

// This import is needed if you use ProgressPrimitive directly. Since we use shadcn/ui Progress, it might not be.
// Keeping it here for context on how one might customize further.
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from '@/lib/utils';
