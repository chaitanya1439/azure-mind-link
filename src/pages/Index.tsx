import React, { useState } from 'react';
import { ChatProvider } from '../store/chatContext';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { ChatArea } from '../components/ChatArea';
import { cn } from '../lib/utils';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <ChatProvider>
      <div className="h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-secondary/5 overflow-hidden">
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} />
        
        {/* Main Content */}
        <div className="flex-1 flex min-h-0">
          {/* Sidebar */}
          <div className={cn(
            "transition-all duration-300 ease-in-out",
            "border-r border-border/50",
            isSidebarOpen ? "w-80" : "w-0",
            "md:relative absolute md:translate-x-0 z-20 h-full",
            !isSidebarOpen && "md:w-0 -translate-x-full"
          )}>
            <Sidebar className="w-80 h-full" />
          </div>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-10 md:hidden"
              onClick={toggleSidebar}
            />
          )}
          
          {/* Chat Area */}
          <div className="flex-1 min-w-0">
            <ChatArea />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default Index;
