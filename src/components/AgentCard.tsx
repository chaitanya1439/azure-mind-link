import React from 'react';
import { Bot, Zap, Code, Settings2 } from 'lucide-react';
import { AgentPersona } from '../types/chat';
import { cn } from '../lib/utils';

interface AgentCardProps {
  agent: AgentPersona;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

const agentIcons = {
  'general-assistant': Bot,
  'code-agent': Code,
  'automation-agent': Zap,
};

export const AgentCard: React.FC<AgentCardProps> = ({ 
  agent, 
  isSelected, 
  onClick, 
  className 
}) => {
  const IconComponent = agentIcons[agent.id as keyof typeof agentIcons] || Settings2;
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg cursor-pointer transition-all duration-200 border",
        "hover:bg-white/10 hover:border-white/30",
        isSelected 
          ? "bg-white/20 border-white/50 text-white" 
          : "bg-white/5 border-white/20 text-white/80 hover:text-white",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          "bg-white/10 border border-white/20"
        )}>
          <IconComponent className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate mb-1">
            {agent.name}
          </h4>
          <p className="text-xs opacity-70 line-clamp-2 leading-relaxed">
            {agent.description}
          </p>
          
          {/* Capabilities */}
          <div className="flex flex-wrap gap-1 mt-2">
            {agent.capabilities.slice(0, 2).map((capability) => (
              <span
                key={capability}
                className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20 truncate"
              >
                {capability}
              </span>
            ))}
            {agent.capabilities.length > 2 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                +{agent.capabilities.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};