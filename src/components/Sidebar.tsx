import React from 'react';
import { Plus, MessageSquare, Settings, Trash2, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { useChat } from '../store/chatContext';
import { AgentCard } from './AgentCard';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { state, createConversation, setActiveConversation, deleteConversation } = useChat();
  
  const handleNewChat = () => {
    const defaultAgent = state.agents[0];
    createConversation(defaultAgent);
  };

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    deleteConversation(conversationId);
  };

  return (
    <div className={cn(
      "h-full bg-gradient-sidebar flex flex-col border-r border-border/50",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border/20">
        <div className="flex items-center gap-2 text-white mb-4">
          <Bot className="w-6 h-6" />
          <h2 className="font-semibold text-lg">AgentChat</h2>
        </div>
        
        <Button
          onClick={handleNewChat}
          className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Agent Selection */}
      <div className="p-4 border-b border-border/20">
        <h3 className="text-sm font-medium text-white/80 mb-3">Choose Agent</h3>
        <div className="space-y-2">
          {state.agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={false}
              onClick={() => createConversation(agent)}
            />
          ))}
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4">
          <h3 className="text-sm font-medium text-white/80 mb-3">Recent Chats</h3>
          <div className="space-y-1">
            {state.conversations.length === 0 ? (
              <div className="text-white/60 text-sm text-center py-8">
                No conversations yet.<br />
                Start a new chat!
              </div>
            ) : (
              state.conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/10",
                    state.activeConversationId === conversation.id 
                      ? "bg-white/20 text-white" 
                      : "text-white/70 hover:text-white"
                  )}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">
                      {conversation.title === 'New Chat' && conversation.messages.length > 0
                        ? conversation.messages[0].content.slice(0, 30) + '...'
                        : conversation.title
                      }
                    </div>
                    <div className="text-xs text-white/50">
                      {conversation.agent.name}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6 text-white/70 hover:text-red-300 hover:bg-red-500/20"
                    onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/20">
        <Button
          variant="ghost"
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};