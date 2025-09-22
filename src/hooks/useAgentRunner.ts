import { useState, useCallback } from 'react';
import { AgentAction, AgentPersona } from '../types/chat';
import { processUserMessage, simulateTyping } from '../lib/mockApi';
import { useChat } from '../store/chatContext';

export const useAgentRunner = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { addMessage, updateMessage, state } = useChat();

  const runAgent = useCallback(async (
    userMessage: string,
    agent: AgentPersona
  ) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Add user message
      addMessage({
        content: userMessage,
        role: 'user',
      });

      // Add initial agent message with typing indicator
      addMessage({
        content: '',
        role: 'agent',
        isTyping: true,
      });

      // Get the last message (agent message) ID from current conversation
      const currentConversation = state.conversations.find(
        conv => conv.id === state.activeConversationId
      );
      
      let agentMessageId = '';
      
      // Wait a bit for the message to be added, then get its ID
      setTimeout(async () => {
        const updatedConversation = state.conversations.find(
          conv => conv.id === state.activeConversationId
        );
        if (updatedConversation && updatedConversation.messages.length > 0) {
          agentMessageId = updatedConversation.messages[updatedConversation.messages.length - 1].id;
        }

        // Handle tool actions
        const handleActionUpdate = (action: AgentAction) => {
          updateMessage(agentMessageId, {
            actionStatus: action.status,
          });
        };

        // Process the message with the agent
        const response = await processUserMessage(
          userMessage,
          agent,
          handleActionUpdate
        );

        // Simulate typing effect
        await simulateTyping(
          response,
          (chunk, isComplete) => {
            updateMessage(agentMessageId, {
              content: chunk,
              isTyping: !isComplete,
            });
          }
        );
        
        setIsProcessing(false);
      }, 100);

    } catch (error) {
      console.error('Error running agent:', error);
      addMessage({
        content: 'Sorry, I encountered an error while processing your request.',
        role: 'agent',
      });
      setIsProcessing(false);
    }
  }, [isProcessing, addMessage, updateMessage, state]);

  return {
    runAgent,
    isProcessing,
  };
};