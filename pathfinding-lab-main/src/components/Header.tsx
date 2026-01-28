import React from 'react';
import { Box, FlaskConical, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="glass-panel border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg glow-primary">
                <FlaskConical className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-node-current flex items-center justify-center shadow-md">
                <Box className="w-3 h-3 text-node-current-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground leading-tight tracking-tight">
                Algorithmic <span className="gradient-text">Glass Box</span>
              </h1>
              <p className="text-xs text-muted-foreground font-medium tracking-wide">
                Pathfinding Visualization Lab
              </p>
            </div>
          </div>

          {/* Lab badge */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-xs font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-foreground">Virtual Lab</span>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
