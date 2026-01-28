import React, { useState, useCallback } from 'react';
import { AlgorithmType, GraphMode, Graph, HeuristicType } from '@/types/graph';
import { abstractGraph, cityMap } from '@/data/graphs';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { Header } from '@/components/Header';
import { GraphCanvas } from '@/components/GraphCanvas';
import { DataStructurePanel } from '@/components/DataStructurePanel';
import { NarrationPanel } from '@/components/NarrationPanel';
import { ControlPanel } from '@/components/ControlPanel';

const Index = () => {
  const [mode, setMode] = useState<GraphMode>('abstract');
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('bfs');
  const [heuristic, setHeuristic] = useState<HeuristicType>('euclidean');
  const [startNode, setStartNode] = useState<string | null>(null);
  const [goalNode, setGoalNode] = useState<string | null>(null);

  const graph: Graph = mode === 'abstract' ? abstractGraph : cityMap;

  const {
    state: algorithmState,
    narration,
    isRunning,
    isPaused,
    speed,
    setSpeed,
    start,
    pause,
    resume,
    step,
    reset,
  } = useAlgorithm(graph, algorithm, startNode, goalNode, heuristic);

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (isRunning) return;

      if (!startNode) {
        setStartNode(nodeId);
      } else if (!goalNode && nodeId !== startNode) {
        setGoalNode(nodeId);
      } else {
        setStartNode(nodeId);
        setGoalNode(null);
        reset();
      }
    },
    [startNode, goalNode, isRunning, reset]
  );

  const handleModeChange = useCallback(
    (newMode: GraphMode) => {
      setMode(newMode);
      setStartNode(null);
      setGoalNode(null);
      reset();
    },
    [reset]
  );

  const handleAlgorithmChange = useCallback(
    (newAlgo: AlgorithmType) => {
      setAlgorithm(newAlgo);
      reset();
    },
    [reset]
  );

  const handleHeuristicChange = useCallback(
    (newHeuristic: HeuristicType) => {
      setHeuristic(newHeuristic);
      reset();
    },
    [reset]
  );

  const handleReset = useCallback(() => {
    reset();
    setStartNode(null);
    setGoalNode(null);
  }, [reset]);

  const canStart = startNode !== null && goalNode !== null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full px-3 sm:px-4 lg:px-6 py-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">

          {/* LEFT: CONTROL PANEL (thin) */}
          <div className="lg:col-span-2 order-2 lg:order-1 overflow-y-auto">
            <ControlPanel
              algorithm={algorithm}
              setAlgorithm={handleAlgorithmChange}
              heuristic={heuristic}
              setHeuristic={handleHeuristicChange}
              mode={mode}
              setMode={handleModeChange}
              isRunning={isRunning}
              isPaused={isPaused}
              isComplete={algorithmState.isComplete}
              canStart={canStart}
              speed={speed}
              setSpeed={setSpeed}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onStep={step}
              onReset={handleReset}
            />
          </div>

          {/* CENTER: GRAPH */}
          <div className="lg:col-span-5 xl:col-span-6 order-1 lg:order-2 overflow-hidden">
            <div className="glass-panel-elevated rounded-2xl p-4 sm:p-5 h-[55vh] sm:h-[60vh] lg:h-full min-h-[420px] overflow-auto">
              <div className="panel-header mb-3 flex items-center gap-2">
                <span className="text-lg">{mode === 'abstract' ? '📊' : '🗺️'}</span>
                <span className="font-medium">{mode === 'abstract' ? 'Abstract Graph' : 'City Map'}</span>
              </div>

              <div className="w-full h-full overflow-auto touch-pan-x touch-pan-y">
                <GraphCanvas
                  graph={graph}
                  algorithmState={algorithmState}
                  startNode={startNode}
                  goalNode={goalNode}
                  onNodeClick={handleNodeClick}
                  isMapMode={mode === 'realworld'}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: DATA + NARRATION (wider & readable) */}
          <div className="lg:col-span-5 xl:col-span-4 order-3 space-y-4 overflow-y-auto min-w-[320px]">
            <div className="glass-panel-elevated rounded-2xl p-4 sm:p-5 h-[360px] overflow-auto">
              <DataStructurePanel
                algorithm={algorithm}
                items={algorithmState.dataStructure}
                currentNode={algorithmState.currentNode}
                heuristic={heuristic}
              />
            </div>

            <div className="glass-panel-elevated rounded-2xl p-4 sm:p-5 h-[360px] overflow-auto">
              <NarrationPanel
                narration={narration}
                algorithm={algorithm}
                mode={mode}
                isComplete={algorithmState.isComplete}
                heuristic={heuristic}
              />
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <footer className="mt-10 pb-4 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <span className="text-lg">🧪</span>
            <span className="text-sm">
              <strong className="text-foreground">Glass Box Simulator</strong>
              <span className="text-muted-foreground"> — See inside the algorithm, understand every step.</span>
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
