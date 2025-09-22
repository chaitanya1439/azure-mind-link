import React from 'react';
import { Bot, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface HeaderProps {
  onToggleSidebar?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, className }) => {
  return (
    <header className={cn(
      "h-14 border-b border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-between px-4",
      className
    )}>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-main flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-foreground">
              AgentChat
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              AI-Powered Automation Assistant
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Online</span>
        </div>
      </div>
    </header>
  );
};