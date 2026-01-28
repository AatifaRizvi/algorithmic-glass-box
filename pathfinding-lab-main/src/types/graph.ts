// Graph and Algorithm Types for the Glass Box Simulator

export interface Position {
  x: number;
  y: number;
}

export interface GraphNode {
  id: string;
  label: string;
  position: Position;
  // For A* algorithm
  gCost?: number;
  hCost?: number;
  fCost?: number;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
}

export interface Graph {
  nodes: GraphNode[];
  edges: Edge[];
}

export type NodeState = 'default' | 'start' | 'goal' | 'current' | 'visited' | 'frontier';

export type AlgorithmType = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

export type HeuristicType = 'euclidean' | 'manhattan' | 'chebyshev' | 'zero';

export type GraphMode = 'abstract' | 'realworld';

export interface AlgorithmState {
  currentNode: string | null;
  visitedNodes: Set<string>;
  frontierNodes: Set<string>;
  dataStructure: DataStructureItem[];
  path: string[];
  isComplete: boolean;
  stepCount: number;
}

export interface DataStructureItem {
  nodeId: string;
  label: string;
  priority?: number; // For priority queue (Dijkstra/A*)
  gCost?: number;
  hCost?: number;
  fCost?: number;
}

export interface NarrationStep {
  step: number;
  action: string;
  explanation: string;
  highlight?: string;
}

export interface SimulatorState {
  graph: Graph;
  mode: GraphMode;
  algorithm: AlgorithmType;
  heuristic: HeuristicType;
  startNode: string | null;
  goalNode: string | null;
  algorithmState: AlgorithmState;
  isRunning: boolean;
  isPaused: boolean;
  speed: number; // milliseconds between steps
  narration: NarrationStep[];
}

// Heuristic descriptions
export const heuristicDescriptions: Record<HeuristicType, { name: string; formula: string; description: string }> = {
  euclidean: {
    name: 'Euclidean',
    formula: '√((x₂-x₁)² + (y₂-y₁)²)',
    description: 'Straight-line distance. Best for unrestricted movement.',
  },
  manhattan: {
    name: 'Manhattan',
    formula: '|x₂-x₁| + |y₂-y₁|',
    description: 'Grid-based distance. Best for 4-directional movement.',
  },
  chebyshev: {
    name: 'Chebyshev',
    formula: 'max(|x₂-x₁|, |y₂-y₁|)',
    description: 'Allows diagonal movement. Best for 8-directional grids.',
  },
  zero: {
    name: 'Zero (Dijkstra)',
    formula: 'h(n) = 0',
    description: 'No heuristic. A* becomes Dijkstra\'s algorithm.',
  },
};
