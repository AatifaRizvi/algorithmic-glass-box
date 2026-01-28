import React from 'react';
import { AlgorithmType, GraphMode, HeuristicType, heuristicDescriptions } from '@/types/graph';
import { algorithmDescriptions } from '@/data/graphs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Map,
  GitBranch,
  Zap,
  Compass,
  Info,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ControlPanelProps {
  algorithm: AlgorithmType;
  setAlgorithm: (algo: AlgorithmType) => void;
  heuristic: HeuristicType;
  setHeuristic: (h: HeuristicType) => void;
  mode: GraphMode;
  setMode: (mode: GraphMode) => void;
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  canStart: boolean;
  speed: number;
  setSpeed: (speed: number) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStep: () => void;
  onReset: () => void;
}

const algorithms: AlgorithmType[] = ['bfs', 'dfs', 'dijkstra', 'astar'];
const heuristics: HeuristicType[] = ['euclidean', 'manhattan', 'chebyshev', 'zero'];

export function ControlPanel({
  algorithm,
  setAlgorithm,
  heuristic,
  setHeuristic,
  mode,
  setMode,
  isRunning,
  isPaused,
  isComplete,
  canStart,
  speed,
  setSpeed,
  onStart,
  onPause,
  onResume,
  onStep,
  onReset,
}: ControlPanelProps) {
  const handleSpeedChange = (value: number[]) => {
    const ms = 2200 - value[0] * 400;
    setSpeed(ms);
  };

  const speedValue = Math.round((2200 - speed) / 400);

  return (
    <div className="glass-panel-elevated rounded-2xl p-5 space-y-5">
      {/* Mode Toggle */}
      <div>
        <div className="section-title">Mode</div>
        <div className="flex gap-2">
          <Button
            variant={mode === 'abstract' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('abstract')}
            className={cn(
              'flex-1 transition-all duration-300',
              mode === 'abstract' && 'glow-primary'
            )}
          >
            <GitBranch className="w-4 h-4 mr-2" />
            Graph
          </Button>
          <Button
            variant={mode === 'realworld' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('realworld')}
            className={cn(
              'flex-1 transition-all duration-300',
              mode === 'realworld' && 'glow-primary'
            )}
          >
            <Map className="w-4 h-4 mr-2" />
            City Map
          </Button>
        </div>
      </div>

      {/* Algorithm Selector */}
      <div>
        <div className="section-title">Algorithm</div>
        <div className="grid grid-cols-2 gap-2">
          {algorithms.map((algo) => {
            const info = algorithmDescriptions[algo];
            return (
              <Button
                key={algo}
                variant={algorithm === algo ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAlgorithm(algo)}
                className={cn(
                  'flex items-center gap-1.5 text-xs transition-all duration-300 h-10',
                  algorithm === algo && 'ring-2 ring-primary/50 ring-offset-2 ring-offset-card'
                )}
              >
                <span className="text-base">{info.icon}</span>
                <span className="font-medium">{info.shortName}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Heuristic Selector (only for A*) */}
      {algorithm === 'astar' && (
        <div className="animate-in">
          <div className="section-title flex items-center gap-2">
            <Compass className="w-3 h-3" />
            Heuristic Function
          </div>
          <div className="grid grid-cols-2 gap-2">
            {heuristics.map((h) => {
              const info = heuristicDescriptions[h];
              return (
                <Tooltip key={h}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={heuristic === h ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setHeuristic(h)}
                      className={cn(
                        'text-xs transition-all duration-300 h-9',
                        heuristic === h && 'ring-2 ring-primary/50 ring-offset-1 ring-offset-card'
                      )}
                    >
                      {info.name}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[200px]">
                    <div className="space-y-1">
                      <div className="font-mono text-xs text-primary">{info.formula}</div>
                      <div className="text-xs">{info.description}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          {/* Current heuristic info */}
          <div className="mt-3 p-3 rounded-lg bg-accent/50 border border-accent">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <div className="font-mono text-primary mb-1">{heuristicDescriptions[heuristic].formula}</div>
                <div className="text-muted-foreground">{heuristicDescriptions[heuristic].description}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Speed Control */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="section-title mb-0">Speed</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            <Zap className="w-3 h-3 text-primary" />
            <span className="font-medium">
              {speedValue === 1 ? 'Slow' : speedValue === 5 ? 'Fast' : `${speedValue}x`}
            </span>
          </div>
        </div>
        <div className="px-1">
          <Slider
            value={[speedValue]}
            onValueChange={handleSpeedChange}
            min={1}
            max={5}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-3">
        <div className="section-title">Controls</div>
        
        <div className="flex gap-2">
          {/* Start/Pause/Resume button */}
          {!isRunning && !isPaused ? (
            <Button
              onClick={onStart}
              disabled={!canStart}
              className="flex-1 btn-glow h-11"
            >
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          ) : isRunning ? (
            <Button
              onClick={onPause}
              variant="secondary"
              className="flex-1 h-11"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button
              onClick={onResume}
              disabled={isComplete}
              className="flex-1 btn-glow h-11"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}

          {/* Step button */}
          <Button
            onClick={onStep}
            variant="outline"
            disabled={isRunning || isComplete}
            title="Next Step"
            className="h-11 w-11 p-0"
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          {/* Reset button */}
          <Button
            onClick={onReset}
            variant="outline"
            title="Reset"
            className="h-11 w-11 p-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Status indicator */}
        {!canStart && (
          <div className="text-xs bg-gradient-to-r from-node-start/10 to-node-goal/10 border border-node-start/30 text-foreground rounded-xl p-3 text-center">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-node-start animate-pulse" />
              Click nodes to set Start & Goal
              <span className="w-2 h-2 rounded-full bg-node-goal animate-pulse" />
            </span>
          </div>
        )}
        
        {isComplete && (
          <div className="text-xs bg-node-visited/10 border border-node-visited/30 text-node-visited rounded-xl p-3 text-center flex items-center justify-center gap-2">
            <span className="text-lg">✅</span>
            Algorithm complete! Click Reset to try again.
          </div>
        )}
      </div>
    </div>
  );
}
