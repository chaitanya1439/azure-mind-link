import React, { useEffect, useRef } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { useChat } from '../store/chatContext';
import { useAgentRunner } from '../hooks/useAgentRunner';
import { cn } from '../lib/utils';

interface ChatAreaProps {
  className?: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ className }) => {
  const { state } = useChat();
  const { runAgent, isProcessing } = useAgentRunner();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeConversation = state.conversations.find(
    conv => conv.id === state.activeConversationId
  );

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSendMessage = async (message: string) => {
    if (!activeConversation || isProcessing) return;
    await runAgent(message, activeConversation.agent);
  };

  if (!activeConversation) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-main rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Welcome to AgentChat
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your intelligent automation assistant powered by advanced AI agents. 
              Select an agent from the sidebar to start a conversation.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Automated workflows</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>Code assistance</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Smart task planning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Chat Header */}
      <div className="flex-shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-main flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {activeConversation.agent.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeConversation.agent.description}
              </p>
            </div>
            {isProcessing && (
              <div className="ml-auto flex items-center gap-2 text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-chat-background/30">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {activeConversation.messages.length === 0 ? (
            /* Empty conversation state */
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-main rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Start a conversation
              </h3>
              <p className="text-muted-foreground mb-6">
                Ask me anything! I'm here to help with your tasks and automation needs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                {[
                  "Help me automate my daily tasks",
                  "Generate some Python code",
                  "Search for the latest AI news", 
                  "Analyze this data for insights"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(suggestion)}
                    className="p-3 text-sm text-left bg-card border border-border/50 rounded-lg hover:bg-accent/50 transition-all duration-200 hover:border-primary/30"
                    disabled={isProcessing}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="space-y-1">
              {activeConversation.messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
            </div>
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isDisabled={isProcessing}
      />
    </div>
  );
};