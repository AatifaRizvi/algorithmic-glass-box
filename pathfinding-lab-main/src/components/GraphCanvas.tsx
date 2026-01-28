import React, { useMemo } from 'react';
import { Graph, NodeState, AlgorithmState } from '@/types/graph';
import { cn } from '@/lib/utils';

interface GraphCanvasProps {
  graph: Graph;
  algorithmState: AlgorithmState;
  startNode: string | null;
  goalNode: string | null;
  onNodeClick: (nodeId: string) => void;
  isMapMode: boolean;
}

// Determine the visual state of a node
const getNodeState = (
  nodeId: string,
  algorithmState: AlgorithmState,
  startNode: string | null,
  goalNode: string | null
): NodeState => {
  if (algorithmState.currentNode === nodeId) return 'current';
  if (nodeId === startNode && algorithmState.stepCount === 0) return 'start';
  if (nodeId === goalNode) return 'goal';
  if (algorithmState.visitedNodes.has(nodeId)) return 'visited';
  if (algorithmState.frontierNodes.has(nodeId)) return 'frontier';
  if (nodeId === startNode) return 'start';
  return 'default';
};

// Get node colors based on state
const getNodeStyles = (state: NodeState): { bg: string; text: string; ring: string; glow: string } => {
  switch (state) {
    case 'start':
      return { bg: 'bg-node-start', text: 'text-node-start-foreground', ring: 'ring-node-start', glow: 'shadow-[0_0_20px_hsl(262_75%_60%/0.5)]' };
    case 'goal':
      return { bg: 'bg-node-goal', text: 'text-node-goal-foreground', ring: 'ring-node-goal', glow: 'shadow-[0_0_20px_hsl(340_80%_60%/0.5)]' };
    case 'current':
      return { bg: 'bg-node-current', text: 'text-node-current-foreground', ring: 'ring-node-current', glow: 'shadow-[0_0_25px_hsl(38_95%_55%/0.6)]' };
    case 'visited':
      return { bg: 'bg-node-visited', text: 'text-node-visited-foreground', ring: 'ring-node-visited', glow: 'shadow-[0_0_15px_hsl(152_70%_45%/0.4)]' };
    case 'frontier':
      return { bg: 'bg-node-frontier', text: 'text-node-frontier-foreground', ring: 'ring-node-frontier', glow: 'shadow-[0_0_15px_hsl(200_85%_55%/0.4)]' };
    default:
      return { bg: 'bg-node-default', text: 'text-node-default-foreground', ring: 'ring-node-default', glow: '' };
  }
};

export function GraphCanvas({
  graph,
  algorithmState,
  startNode,
  goalNode,
  onNodeClick,
  isMapMode,
}: GraphCanvasProps) {
  // Calculate edge states
  const edgeStates = useMemo(() => {
    const states: Record<string, 'default' | 'path' | 'exploring'> = {};
    
    graph.edges.forEach(edge => {
      const sourceVisited = algorithmState.visitedNodes.has(edge.source);
      const targetVisited = algorithmState.visitedNodes.has(edge.target);
      const sourceIsCurrent = algorithmState.currentNode === edge.source;
      const targetIsCurrent = algorithmState.currentNode === edge.target;
      
      if (sourceIsCurrent || targetIsCurrent) {
        states[edge.id] = 'exploring';
      } else if (sourceVisited && targetVisited) {
        states[edge.id] = 'path';
      } else {
        states[edge.id] = 'default';
      }
    });
    
    return states;
  }, [graph.edges, algorithmState]);

  // Find node position by ID
  const getNodePosition = (nodeId: string) => {
    const node = graph.nodes.find(n => n.id === nodeId);
    return node?.position || { x: 0, y: 0 };
  };

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded-xl">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-panel-graph" />
      
      {/* Animated grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border"
            />
          </pattern>
          <radialGradient id="fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="fadeMask">
            <rect width="100%" height="100%" fill="url(#fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#fadeMask)" />
      </svg>

      {/* Edges SVG layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {graph.edges.map(edge => {
          const sourcePos = getNodePosition(edge.source);
          const targetPos = getNodePosition(edge.target);
          const state = edgeStates[edge.id];
          
          // Calculate midpoint for weight label
          const midX = (sourcePos.x + targetPos.x) / 2;
          const midY = (sourcePos.y + targetPos.y) / 2;
          
          return (
            <g key={edge.id}>
              {/* Edge glow for active edges */}
              {state !== 'default' && (
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  className={cn(
                    'transition-all duration-300',
                    state === 'exploring' && 'stroke-edge-exploring',
                    state === 'path' && 'stroke-edge-path'
                  )}
                  strokeWidth={8}
                  strokeLinecap="round"
                  opacity={0.3}
                  filter="url(#glow)"
                />
              )}
              {/* Main edge line */}
              <line
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                className={cn(
                  'transition-all duration-300',
                  state === 'exploring' && 'stroke-edge-exploring edge-animate',
                  state === 'path' && 'stroke-edge-path',
                  state === 'default' && 'stroke-edge-default'
                )}
                strokeWidth={state === 'default' ? 2 : 3}
                strokeLinecap="round"
              />
              {/* Edge weight label */}
              <g transform={`translate(${midX}, ${midY})`}>
                <circle 
                  r="14" 
                  className={cn(
                    'transition-all duration-300',
                    state === 'default' ? 'fill-card stroke-border' : 'fill-card stroke-primary/50'
                  )} 
                  strokeWidth="1.5" 
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-mono font-semibold fill-foreground"
                >
                  {edge.weight}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {graph.nodes.map(node => {
        const state = getNodeState(node.id, algorithmState, startNode, goalNode);
        const styles = getNodeStyles(state);
        
        return (
          <button
            key={node.id}
            onClick={() => onNodeClick(node.id)}
            className={cn(
              'absolute transform -translate-x-1/2 -translate-y-1/2',
              'flex flex-col items-center gap-1.5 group cursor-pointer',
              'transition-all duration-300 hover:scale-110 focus:outline-none'
            )}
            style={{ left: node.position.x, top: node.position.y }}
          >
            {/* Node circle */}
            <div
              className={cn(
                'flex items-center justify-center rounded-full shadow-lg',
                'ring-2 ring-offset-2 ring-offset-panel-graph transition-all duration-300',
                'border-2 border-white/10',
                styles.bg,
                styles.text,
                styles.ring,
                styles.glow,
                state === 'current' && 'node-pulse scale-110',
                isMapMode ? 'w-16 h-16 text-2xl' : 'w-14 h-14 text-lg font-bold'
              )}
            >
              {isMapMode ? node.label.split(' ')[0] : node.label}
            </div>
            
            {/* Node label (for map mode) */}
            {isMapMode && (
              <span className={cn(
                'text-xs font-semibold px-2.5 py-1 rounded-full',
                'bg-card/95 text-foreground shadow-lg border border-border/50',
                'whitespace-nowrap backdrop-blur-sm'
              )}>
                {node.label.split(' ').slice(1).join(' ')}
              </span>
            )}
            
            {/* Start/Goal indicators */}
            {node.id === startNode && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider text-node-start bg-node-start/20 px-2.5 py-1 rounded-full border border-node-start/30 uppercase">
                Start
              </span>
            )}
            {node.id === goalNode && (
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider text-node-goal bg-node-goal/20 px-2.5 py-1 rounded-full border border-node-goal/30 uppercase">
                Goal
              </span>
            )}
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-panel rounded-xl p-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Legend</div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-node-start shadow-[0_0_8px_hsl(262_75%_60%/0.5)]" />
            <span className="text-muted-foreground">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-node-goal shadow-[0_0_8px_hsl(340_80%_60%/0.5)]" />
            <span className="text-muted-foreground">Goal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-node-current shadow-[0_0_8px_hsl(38_95%_55%/0.5)]" />
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-node-visited shadow-[0_0_8px_hsl(152_70%_45%/0.4)]" />
            <span className="text-muted-foreground">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-node-frontier shadow-[0_0_8px_hsl(200_85%_55%/0.4)]" />
            <span className="text-muted-foreground">Frontier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
