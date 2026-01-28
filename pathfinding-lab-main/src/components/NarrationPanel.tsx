import React, { useEffect, useRef } from 'react';
import { NarrationStep, AlgorithmType, GraphMode, HeuristicType, heuristicDescriptions } from '@/types/graph';
import { algorithmDescriptions } from '@/data/graphs';
import { cn } from '@/lib/utils';
import { BookOpen, Lightbulb, MessageCircle, Sparkles } from 'lucide-react';

interface NarrationPanelProps {
  narration: NarrationStep[];
  algorithm: AlgorithmType;
  mode: GraphMode;
  isComplete: boolean;
  heuristic?: HeuristicType;
}

export function NarrationPanel({ narration, algorithm, mode, isComplete, heuristic = 'euclidean' }: NarrationPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const algoInfo = algorithmDescriptions[algorithm];
  
  // Auto-scroll to latest narration
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [narration]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="panel-header">
        <MessageCircle className="w-4 h-4 text-primary" />
        <span>Step-by-Step Explanation</span>
      </div>

      {/* Real-world context or heuristic info */}
      {(mode === 'realworld' || algorithm === 'astar') && (
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-accent/30 to-primary/10 border border-accent/50">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-accent-foreground" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-foreground mb-1 flex items-center gap-2">
                {mode === 'realworld' ? 'Real-World Application' : `A* with ${heuristicDescriptions[heuristic].name}`}
                <Sparkles className="w-3 h-3 text-primary" />
              </div>
              <div className="text-muted-foreground leading-relaxed text-xs">
                {mode === 'realworld' 
                  ? algoInfo.realWorldUse
                  : heuristicDescriptions[heuristic].description
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Narration log */}
      <div ref={scrollRef} className="flex-1 overflow-auto space-y-2.5 pr-1">
        {narration.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
              <BookOpen className="w-7 h-7 opacity-50" />
            </div>
            <div className="text-sm font-medium">Ready to explore</div>
            <div className="text-xs mt-1.5 opacity-70 max-w-[200px] mx-auto">
              Select start and goal nodes, then click "Start" to begin the simulation.
            </div>
          </div>
        ) : (
          narration.map((step, index) => (
            <div
              key={index}
              className={cn(
                'p-3 rounded-xl border animate-in',
                step.action.includes('Goal') || step.action.includes('🎉')
                  ? 'bg-gradient-to-r from-node-visited/10 to-transparent border-node-visited/30'
                  : step.action.includes('Skipping')
                  ? 'bg-muted/30 border-muted/50 opacity-70'
                  : 'bg-card/50 border-border/50'
              )}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold',
                  step.action.includes('Goal') || step.action.includes('🎉')
                    ? 'bg-node-visited text-node-visited-foreground'
                    : 'bg-primary/20 text-primary'
                )}>
                  {step.step}
                </span>
                <span className="font-semibold text-sm text-foreground">{step.action}</span>
              </div>
              <p className="narration-text text-muted-foreground ml-8 text-xs leading-relaxed">
                {step.explanation}
              </p>
            </div>
          ))
        )}
        
        {/* Completion message */}
        {isComplete && narration.length > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-node-visited/20 to-primary/10 border-2 border-node-visited/50 text-center animate-in">
            <div className="text-3xl mb-2">🎓</div>
            <div className="font-bold text-node-visited">Algorithm Complete!</div>
            <div className="text-xs text-muted-foreground mt-1">
              {algoInfo.name} has finished exploring the graph.
            </div>
          </div>
        )}
      </div>

      {/* Statistics footer */}
      {narration.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span className="bg-muted/50 px-2 py-1 rounded-full">Steps: {narration.length}</span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{algoInfo.shortName}</span>
          </div>
        </div>
      )}
    </div>
  );
}
