import { useState, useCallback, useRef, useEffect } from 'react';
import { Graph, AlgorithmType, AlgorithmState, DataStructureItem, NarrationStep, HeuristicType } from '@/types/graph';
import { algorithmDescriptions } from '@/data/graphs';

// Calculate heuristic distance based on selected type
const calculateHeuristic = (
  graph: Graph,
  nodeId: string,
  goalId: string,
  heuristicType: HeuristicType
): number => {
  const node = graph.nodes.find(n => n.id === nodeId);
  const goal = graph.nodes.find(n => n.id === goalId);
  if (!node || !goal) return 0;
  
  const dx = Math.abs(node.position.x - goal.position.x);
  const dy = Math.abs(node.position.y - goal.position.y);
  
  // Normalize by dividing by 50 to make values reasonable
  const scale = 50;
  
  switch (heuristicType) {
    case 'euclidean':
      return Math.sqrt(dx * dx + dy * dy) / scale;
    case 'manhattan':
      return (dx + dy) / scale;
    case 'chebyshev':
      return Math.max(dx, dy) / scale;
    case 'zero':
      return 0;
    default:
      return Math.sqrt(dx * dx + dy * dy) / scale;
  }
};

// Get neighbors of a node
const getNeighbors = (graph: Graph, nodeId: string): { id: string; weight: number }[] => {
  const neighbors: { id: string; weight: number }[] = [];
  
  graph.edges.forEach(edge => {
    if (edge.source === nodeId) {
      neighbors.push({ id: edge.target, weight: edge.weight });
    } else if (edge.target === nodeId) {
      neighbors.push({ id: edge.source, weight: edge.weight });
    }
  });
  
  return neighbors;
};

const initialAlgorithmState: AlgorithmState = {
  currentNode: null,
  visitedNodes: new Set(),
  frontierNodes: new Set(),
  dataStructure: [],
  path: [],
  isComplete: false,
  stepCount: 0,
};

export function useAlgorithm(
  graph: Graph,
  algorithm: AlgorithmType,
  startNode: string | null,
  goalNode: string | null,
  heuristic: HeuristicType = 'euclidean'
) {
  const [state, setState] = useState<AlgorithmState>(initialAlgorithmState);
  const [narration, setNarration] = useState<NarrationStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef(state);
  
  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Add narration message
  const addNarration = useCallback((action: string, explanation: string, highlight?: string) => {
    setNarration(prev => [...prev, {
      step: stateRef.current.stepCount + 1,
      action,
      explanation,
      highlight,
    }]);
  }, []);

  // Reset the algorithm
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setState(initialAlgorithmState);
    setNarration([]);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  // Initialize the algorithm
  const initialize = useCallback(() => {
    if (!startNode) return;
    
    reset();
    
    const algoInfo = algorithmDescriptions[algorithm];
    const hCost = goalNode ? calculateHeuristic(graph, startNode, goalNode, heuristic) : 0;
    const initialItem: DataStructureItem = {
      nodeId: startNode,
      label: graph.nodes.find(n => n.id === startNode)?.label || startNode,
      gCost: 0,
      hCost: hCost,
      fCost: hCost,
    };

    setState({
      currentNode: null,
      visitedNodes: new Set(),
      frontierNodes: new Set([startNode]),
      dataStructure: [initialItem],
      path: [],
      isComplete: false,
      stepCount: 0,
    });

    const heuristicNote = algorithm === 'astar' 
      ? ` Using ${heuristic} heuristic for path estimation.`
      : '';

    addNarration(
      `Initialized ${algoInfo.shortName}`,
      `Starting from "${graph.nodes.find(n => n.id === startNode)?.label}". The ${algoInfo.dataStructure} now contains the start node.${heuristicNote}`,
      startNode
    );
  }, [startNode, goalNode, algorithm, graph, heuristic, reset, addNarration]);

  // Execute one step of the algorithm
  const step = useCallback(() => {
    const currentState = stateRef.current;
    
    if (currentState.isComplete || currentState.dataStructure.length === 0) {
      if (currentState.dataStructure.length === 0 && !currentState.isComplete) {
        addNarration('Search Complete', 'No path found! The frontier is empty and the goal was not reached.');
        setState(prev => ({ ...prev, isComplete: true }));
      }
      return false;
    }

    let nextItem: DataStructureItem | undefined;
    let newDataStructure = [...currentState.dataStructure];
    
    // Select next node based on algorithm type
    switch (algorithm) {
      case 'bfs':
        // Queue: First In, First Out
        nextItem = newDataStructure.shift();
        break;
      case 'dfs':
        // Stack: Last In, First Out
        nextItem = newDataStructure.pop();
        break;
      case 'dijkstra':
        // Priority Queue: Lowest g-cost first
        newDataStructure.sort((a, b) => (a.gCost || 0) - (b.gCost || 0));
        nextItem = newDataStructure.shift();
        break;
      case 'astar':
        // Priority Queue: Lowest f-cost first
        newDataStructure.sort((a, b) => (a.fCost || 0) - (b.fCost || 0));
        nextItem = newDataStructure.shift();
        break;
    }

    if (!nextItem) return false;

    const currentNodeId = nextItem.nodeId;
    const currentLabel = graph.nodes.find(n => n.id === currentNodeId)?.label || currentNodeId;
    
    // Check if we've reached the goal
    if (goalNode && currentNodeId === goalNode) {
      const newPath = [...currentState.path, currentNodeId];
      setState(prev => ({
        ...prev,
        currentNode: currentNodeId,
        visitedNodes: new Set([...prev.visitedNodes, currentNodeId]),
        frontierNodes: new Set([...prev.frontierNodes].filter(id => id !== currentNodeId)),
        dataStructure: newDataStructure,
        path: newPath,
        isComplete: true,
        stepCount: prev.stepCount + 1,
      }));
      
      addNarration(
        '🎉 Goal Reached!',
        `Found the path to "${currentLabel}"! The algorithm successfully navigated from start to goal.`,
        currentNodeId
      );
      return false;
    }

    // Skip if already visited
    if (currentState.visitedNodes.has(currentNodeId)) {
      setState(prev => ({
        ...prev,
        dataStructure: newDataStructure,
        stepCount: prev.stepCount + 1,
      }));
      
      addNarration(
        `Skipping "${currentLabel}"`,
        `This node was already visited, so we skip it and continue.`,
        currentNodeId
      );
      return true;
    }

    // Visit the current node
    const newVisited = new Set([...currentState.visitedNodes, currentNodeId]);
    const newPath = [...currentState.path, currentNodeId];
    
    // Get and process neighbors
    const neighbors = getNeighbors(graph, currentNodeId);
    const newFrontier = new Set(currentState.frontierNodes);
    newFrontier.delete(currentNodeId);
    
    const newNeighbors: string[] = [];
    
    neighbors.forEach(neighbor => {
      if (!newVisited.has(neighbor.id) && !newDataStructure.find(item => item.nodeId === neighbor.id)) {
        const gCost = (nextItem?.gCost || 0) + neighbor.weight;
        const hCost = goalNode ? calculateHeuristic(graph, neighbor.id, goalNode, heuristic) : 0;
        
        const neighborItem: DataStructureItem = {
          nodeId: neighbor.id,
          label: graph.nodes.find(n => n.id === neighbor.id)?.label || neighbor.id,
          gCost,
          hCost,
          fCost: gCost + hCost,
        };
        
        newDataStructure.push(neighborItem);
        newFrontier.add(neighbor.id);
        newNeighbors.push(graph.nodes.find(n => n.id === neighbor.id)?.label || neighbor.id);
      }
    });

    setState({
      currentNode: currentNodeId,
      visitedNodes: newVisited,
      frontierNodes: newFrontier,
      dataStructure: newDataStructure,
      path: newPath,
      isComplete: false,
      stepCount: currentState.stepCount + 1,
    });

    // Generate narration based on algorithm
    let explanation = '';
    
    if (algorithm === 'bfs') {
      explanation = `Dequeued "${currentLabel}" from the front of the queue. `;
      if (newNeighbors.length > 0) {
        explanation += `Added neighbors [${newNeighbors.join(', ')}] to the back of the queue.`;
      } else {
        explanation += `No new neighbors to add.`;
      }
    } else if (algorithm === 'dfs') {
      explanation = `Popped "${currentLabel}" from the top of the stack. `;
      if (newNeighbors.length > 0) {
        explanation += `Pushed neighbors [${newNeighbors.join(', ')}] onto the stack.`;
      } else {
        explanation += `No new neighbors to push.`;
      }
    } else if (algorithm === 'dijkstra') {
      explanation = `Selected "${currentLabel}" with lowest distance (g=${nextItem?.gCost?.toFixed(1)}). `;
      if (newNeighbors.length > 0) {
        explanation += `Updated distances for neighbors [${newNeighbors.join(', ')}].`;
      }
    } else if (algorithm === 'astar') {
      explanation = `Selected "${currentLabel}" with lowest f-cost (f=${nextItem?.fCost?.toFixed(1)}, g=${nextItem?.gCost?.toFixed(1)}, h=${nextItem?.hCost?.toFixed(1)}). `;
      explanation += `Using ${heuristic} heuristic. `;
      if (newNeighbors.length > 0) {
        explanation += `Calculated costs for neighbors [${newNeighbors.join(', ')}].`;
      }
    }

    addNarration(`Visiting "${currentLabel}"`, explanation, currentNodeId);
    
    return true;
  }, [algorithm, graph, goalNode, heuristic, addNarration]);

  // Start auto-running
  const start = useCallback(() => {
    if (!startNode) return;
    
    if (stateRef.current.stepCount === 0) {
      initialize();
    }
    
    setIsRunning(true);
    setIsPaused(false);
    
    intervalRef.current = setInterval(() => {
      const canContinue = step();
      if (!canContinue) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsRunning(false);
      }
    }, speed);
  }, [startNode, initialize, step, speed]);

  // Pause the algorithm
  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
    setIsRunning(false);
  }, []);

  // Resume the algorithm
  const resume = useCallback(() => {
    if (stateRef.current.isComplete) return;
    start();
  }, [start]);

  // Step once manually
  const stepOnce = useCallback(() => {
    if (stateRef.current.stepCount === 0) {
      initialize();
      setTimeout(step, 100);
    } else {
      step();
    }
  }, [initialize, step]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reset when algorithm, nodes, or heuristic change
  useEffect(() => {
    reset();
  }, [algorithm, startNode, goalNode, graph, heuristic, reset]);

  return {
    state,
    narration,
    isRunning,
    isPaused,
    speed,
    setSpeed,
    start,
    pause,
    resume,
    step: stepOnce,
    reset,
    initialize,
  };
}
