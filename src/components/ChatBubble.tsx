import React from 'react';
import { Bot, User, Loader2 } from 'lucide-react';
import { Message } from '../types/chat';
import { cn } from '../lib/utils';

interface ChatBubbleProps {
  message: Message;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, className }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex items-start gap-3 mb-4 animate-fade-in",
      isUser ? "flex-row-reverse" : "flex-row",
      className
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser 
          ? "bg-gradient-chat text-white" 
          : "bg-primary/10 text-primary border border-primary/20"
      )}>
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message Bubble */}
        <div className={cn(
          "px-4 py-3 rounded-2xl shadow-sm transition-all duration-200",
          isUser 
            ? "chat-bubble-user" 
            : "chat-bubble-agent",
          message.isTyping && "animate-pulse"
        )}>
          {message.content || (
            <span className="text-muted-foreground italic">
              {message.isTyping ? 'Typing...' : 'No content'}
            </span>
          )}
          
          {/* Typing indicator */}
          {message.isTyping && (
            <div className="flex items-center gap-1 mt-2 text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-xs">Thinking...</span>
            </div>
          )}
          
          {/* Action Status */}
          {message.actionStatus && message.actionStatus !== 'completed' && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>
                {message.actionStatus === 'pending' && 'Preparing action...'}
                {message.actionStatus === 'running' && 'Running automation...'}
                {message.actionStatus === 'failed' && 'Action failed'}
              </span>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground mt-1 px-2">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};