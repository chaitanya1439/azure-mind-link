import React, { useState } from 'react';
import { ChatProvider } from '../store/chatContext';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { ChatArea } from '../components/ChatArea';
import { cn } from '../lib/utils';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed on mobile
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <ChatProvider>
      <div className="bg-gradient-to-tr from-green-400 via-blue-400 to-blue-600 min-h-screen">
        {/* Main Layout Container */}
        <div className="flex flex-col sm:flex-row h-screen">
          {/* Sidebar */}
          <div className={cn(
            "bg-gradient-to-b from-green-600 to-blue-700",
            "transition-all duration-300 ease-in-out",
            // Small screens: fixed overlay when open, hidden when closed
            "fixed sm:static z-20 h-full",
            // Responsive widths
            isSidebarOpen ? "w-full sm:w-16 md:w-48 lg:w-64" : "w-0",
            // Hide/show logic
            "sm:block", // Always block on sm+
            !isSidebarOpen && "hidden sm:block sm:w-16 md:w-48 lg:w-64"
          )}>
            <Sidebar className="h-full" />
          </div>

          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-10 sm:hidden"
              onClick={toggleSidebar}
            />
          )}

          {/* Header + Chat Area Container */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <Header onToggleSidebar={toggleSidebar} />
            
            {/* Chat Area */}
            <div className="flex-1 p-4 sm:p-6 md:p-8 min-h-0">
              <ChatArea />
            </div>
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default Index;
