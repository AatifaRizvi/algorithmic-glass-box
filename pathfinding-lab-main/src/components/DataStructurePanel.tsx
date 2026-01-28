import React from 'react';
import { AlgorithmType, DataStructureItem, HeuristicType, heuristicDescriptions } from '@/types/graph';
import { algorithmDescriptions } from '@/data/graphs';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowRight, Layers, ListOrdered, Sparkles } from 'lucide-react';

interface DataStructurePanelProps {
  algorithm: AlgorithmType;
  items: DataStructureItem[];
  currentNode: string | null;
  heuristic?: HeuristicType;
}

export function DataStructurePanel({ algorithm, items, currentNode, heuristic = 'euclidean' }: DataStructurePanelProps) {
  const algoInfo = algorithmDescriptions[algorithm];
  const isStack = algorithm === 'dfs';
  const isPriorityQueue = algorithm === 'dijkstra' || algorithm === 'astar';
  
  // Sort items for display (priority queue shows lowest first)
  const displayItems = isPriorityQueue
    ? [...items].sort((a, b) => 
        algorithm === 'astar' 
          ? (a.fCost || 0) - (b.fCost || 0)
          : (a.gCost || 0) - (b.gCost || 0)
      )
    : items;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="panel-header">
        {isStack ? <Layers className="w-4 h-4 text-primary" /> : <ListOrdered className="w-4 h-4 text-primary" />}
        <span>{algoInfo.dataStructure}</span>
        {algorithm === 'astar' && (
          <span className="ml-auto text-[10px] font-normal normal-case tracking-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {heuristicDescriptions[heuristic].name}
          </span>
        )}
      </div>

      {/* Visual representation */}
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-6">
            <div className="text-4xl mb-3 opacity-50">📭</div>
            <div className="font-medium">Empty</div>
            <div className="text-xs mt-1 opacity-70">Click "Start" or "Next Step" to begin</div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Direction indicator */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground mb-3 bg-muted/30 rounded-lg py-2">
              {isStack ? (
                <>
                  <ArrowDown className="w-3 h-3 text-primary" />
                  <span>Top of Stack (next to pop)</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-3 h-3 text-primary" />
                  <span>Front of {isPriorityQueue ? 'Priority Queue' : 'Queue'} (next)</span>
                </>
              )}
            </div>

            {/* Items */}
            <div className={cn(
              'flex gap-2',
              isStack ? 'flex-col-reverse' : 'flex-col'
            )}>
              {displayItems.map((item, index) => {
                const isNext = isStack
                  ? index === displayItems.length - 1
                  : index === 0;
                const isCurrent = item.nodeId === currentNode;
                
                return (
                  <div
                    key={`${item.nodeId}-${index}`}
                    className={cn(
                      'data-structure-item data-structure-item-enter',
                      'flex items-center justify-between',
                      'border rounded-lg',
                      isNext && 'ring-2 ring-primary/50 ring-offset-1 ring-offset-card',
                      isCurrent
                        ? 'bg-node-current/20 border-node-current/50'
                        : 'bg-card/50 border-border/50 hover:border-border'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Position indicator */}
                      <span className={cn(
                        'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold',
                        isNext 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'bg-muted text-muted-foreground'
                      )}>
                        {isStack ? displayItems.length - index : index + 1}
                      </span>
                      
                      {/* Node label */}
                      <span className="font-semibold text-foreground">{item.label}</span>
                    </div>

                    {/* Cost display for Dijkstra/A* */}
                    {isPriorityQueue && (
                      <div className="flex items-center gap-1.5 text-[10px]">
                        {algorithm === 'astar' && (
                          <>
                            <span className="px-1.5 py-1 rounded bg-node-frontier/20 text-node-frontier font-mono">
                              g:{item.gCost?.toFixed(1)}
                            </span>
                            <span className="px-1.5 py-1 rounded bg-node-start/20 text-node-start font-mono">
                              h:{item.hCost?.toFixed(1)}
                            </span>
                          </>
                        )}
                        <span className={cn(
                          'px-2 py-1 rounded font-mono font-bold',
                          algorithm === 'astar'
                            ? 'bg-node-current/20 text-node-current'
                            : 'bg-primary/20 text-primary'
                        )}>
                          {algorithm === 'astar' ? 'f:' : 'd:'}{(item.fCost ?? item.gCost)?.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Capacity indicator */}
            <div className="text-[10px] text-muted-foreground text-center mt-3 py-2 bg-muted/20 rounded-lg">
              {items.length} item{items.length !== 1 ? 's' : ''} in {algoInfo.dataStructure.toLowerCase()}
            </div>
          </div>
        )}
      </div>

      {/* Algorithm info footer */}
      <div className="mt-auto pt-3 border-t border-border/50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{algoInfo.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-foreground flex items-center gap-2">
              {algoInfo.name}
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{algoInfo.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
