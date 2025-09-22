import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isDisabled = false,
  className,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isDisabled) return;

    onSendMessage(trimmedMessage);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className={cn(
      "border-t border-border/50 bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3">
          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              disabled={isDisabled}
              className={cn(
                "w-full resize-none rounded-2xl px-4 py-3 pr-12",
                "bg-card border border-border/50 text-card-foreground",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "min-h-[52px] max-h-[120px] overflow-y-auto custom-scrollbar"
              )}
              rows={1}
            />
            
            {/* Character count */}
            {message.length > 100 && (
              <div className="absolute bottom-1 right-14 text-xs text-muted-foreground">
                {message.length}/2000
              </div>
            )}
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isDisabled}
            size="lg"
            className={cn(
              "h-[52px] w-[52px] rounded-2xl p-0 shadow-lg",
              "bg-gradient-chat hover:shadow-xl transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isDisabled ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        
        {/* Help text */}
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Ask me anything! I can help with coding, automation, research, and more.
        </div>
      </div>
    </div>
  );
};