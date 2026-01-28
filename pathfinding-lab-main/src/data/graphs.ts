import { Graph } from '@/types/graph';

// Abstract graph for learning
export const abstractGraph: Graph = {
  nodes: [
    { id: 'A', label: 'A', position: { x: 100, y: 200 } },
    { id: 'B', label: 'B', position: { x: 250, y: 100 } },
    { id: 'C', label: 'C', position: { x: 250, y: 300 } },
    { id: 'D', label: 'D', position: { x: 400, y: 100 } },
    { id: 'E', label: 'E', position: { x: 400, y: 200 } },
    { id: 'F', label: 'F', position: { x: 400, y: 300 } },
    { id: 'G', label: 'G', position: { x: 550, y: 200 } },
  ],
  edges: [
    { id: 'e1', source: 'A', target: 'B', weight: 4 },
    { id: 'e2', source: 'A', target: 'C', weight: 2 },
    { id: 'e3', source: 'B', target: 'D', weight: 5 },
    { id: 'e4', source: 'B', target: 'E', weight: 3 },
    { id: 'e5', source: 'C', target: 'E', weight: 1 },
    { id: 'e6', source: 'C', target: 'F', weight: 4 },
    { id: 'e7', source: 'D', target: 'G', weight: 2 },
    { id: 'e8', source: 'E', target: 'G', weight: 3 },
    { id: 'e9', source: 'F', target: 'G', weight: 5 },
  ],
};

// Real-world city map
export const cityMap: Graph = {
  nodes: [
    { id: 'home', label: '🏠 Home', position: { x: 100, y: 200 } },
    { id: 'market', label: '🛒 Market', position: { x: 280, y: 100 } },
    { id: 'school', label: '🏫 School', position: { x: 280, y: 300 } },
    { id: 'hospital', label: '🏥 Hospital', position: { x: 460, y: 100 } },
    { id: 'office', label: '🏢 Office', position: { x: 460, y: 300 } },
    { id: 'park', label: '🌳 Park', position: { x: 370, y: 200 } },
  ],
  edges: [
    { id: 'r1', source: 'home', target: 'market', weight: 3 },
    { id: 'r2', source: 'home', target: 'school', weight: 2 },
    { id: 'r3', source: 'market', target: 'hospital', weight: 4 },
    { id: 'r4', source: 'market', target: 'park', weight: 2 },
    { id: 'r5', source: 'school', target: 'park', weight: 1 },
    { id: 'r6', source: 'school', target: 'office', weight: 3 },
    { id: 'r7', source: 'hospital', target: 'park', weight: 2 },
    { id: 'r8', source: 'park', target: 'office', weight: 2 },
  ],
};

// Algorithm descriptions for narration
export const algorithmDescriptions = {
  bfs: {
    name: 'Breadth-First Search (BFS)',
    shortName: 'BFS',
    dataStructure: 'Queue (FIFO)',
    icon: '📊',
    description: 'Explores all neighbors at the current depth before moving deeper.',
    realWorldUse: 'BFS looks at all nearby roads first and finds the shortest path (by number of edges). Great for finding the closest hospital or store quickly!',
    color: 'primary',
  },
  dfs: {
    name: 'Depth-First Search (DFS)',
    shortName: 'DFS',
    dataStructure: 'Stack (LIFO)',
    icon: '📚',
    description: 'Explores as far as possible along each branch before backtracking.',
    realWorldUse: 'DFS explores one route deeply before trying others. Useful for exploring all possibilities but may not find the shortest path.',
    color: 'secondary',
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    shortName: 'Dijkstra',
    dataStructure: 'Priority Queue',
    icon: '⚖️',
    description: 'Finds the shortest path considering edge weights using a priority queue.',
    realWorldUse: 'Dijkstra finds the cheapest path when roads have different costs, such as tolls or traffic. Essential for GPS navigation!',
    color: 'accent',
  },
  astar: {
    name: 'A* Algorithm',
    shortName: 'A*',
    dataStructure: 'Priority Queue (with heuristic)',
    icon: '🎯',
    description: 'Uses heuristics to guide the search toward the goal efficiently.',
    realWorldUse: 'A* uses heuristics to guide the search faster toward the destination. Ideal for navigation apps and games!',
    color: 'destructive',
  },
};
