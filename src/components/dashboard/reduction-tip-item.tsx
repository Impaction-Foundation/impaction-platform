
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Share2, Trash2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TipSchema } from "@/ai/stubs";

export interface ActionableReductionTip extends TipSchema {
  id: string;
  isCompleted: boolean;
}

interface ReductionTipItemProps {
  tip: ActionableReductionTip;
  onToggleComplete: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export default function ReductionTipItem({ tip, onToggleComplete, onShare, onDelete }: ReductionTipItemProps) {
  let borderColorClass = 'border-l-4 border-gray-400 dark:border-gray-600';
  let difficultyBadgeBg = 'bg-gray-100 dark:bg-gray-700';
  let difficultyBadgeText = 'text-gray-700 dark:text-gray-300';

  if (tip.implementationDifficulty === 'Easy') {
    borderColorClass = 'border-l-4 border-green-500';
    difficultyBadgeBg = 'bg-green-100 dark:bg-green-800/30';
    difficultyBadgeText = 'text-green-700 dark:text-green-300';
  } else if (tip.implementationDifficulty === 'Medium') {
    borderColorClass = 'border-l-4 border-yellow-500';
    difficultyBadgeBg = 'bg-yellow-100 dark:bg-yellow-800/30';
    difficultyBadgeText = 'text-yellow-700 dark:text-yellow-300';
  } else if (tip.implementationDifficulty === 'Difficult') {
    borderColorClass = 'border-l-4 border-red-500';
    difficultyBadgeBg = 'bg-red-100 dark:bg-red-800/30';
    difficultyBadgeText = 'text-red-700 dark:text-red-300';
  }

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md",
      tip.isCompleted ? "bg-muted/50 opacity-70" : "bg-card",
      borderColorClass
    )}>
      <CardContent className="p-4 flex items-start gap-4">
        <div className="pt-1">
          <Checkbox
            id={`tip-${tip.id}`}
            checked={tip.isCompleted}
            onCheckedChange={onToggleComplete}
            aria-label={`Mark tip as ${tip.isCompleted ? 'incomplete' : 'complete'}`}
          />
        </div>
        <div className="flex-grow space-y-1.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {tip.category}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${difficultyBadgeBg} ${difficultyBadgeText}`}>
                    {tip.implementationDifficulty}
                </span>
            </div>
             <span className="text-xs font-semibold text-accent">
                Impact: {tip.potentialImpact}
            </span>
          </div>

          <label
            htmlFor={`tip-${tip.id}`}
            className={cn(
              "block text-base font-medium text-foreground cursor-pointer",
              tip.isCompleted && "line-through text-muted-foreground"
            )}
          >
            {tip.suggestion}
          </label>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0 ml-auto pl-2 pt-0.5">
          <Button variant="ghost" size="icon" onClick={onShare} aria-label="Share tip">
            <Share2 className="h-4 w-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete tip">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
