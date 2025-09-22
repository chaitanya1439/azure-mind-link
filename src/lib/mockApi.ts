import { AgentAction, AgentPersona, Message } from '../types/chat';

// Mock tools that agents can use
const mockTools = [
  {
    name: 'search_web',
    description: 'Search the web for information',
    execute: async (query: string) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return `Found relevant information about "${query}"`;
    }
  },
  {
    name: 'generate_code',
    description: 'Generate code based on requirements',
    execute: async (requirements: string) => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      return `Generated code for: ${requirements}`;
    }
  },
  {
    name: 'analyze_data',
    description: 'Analyze data and provide insights',
    execute: async (data: string) => {
      await new Promise(resolve => setTimeout(resolve, 2500));
      return `Analysis complete for the provided data`;
    }
  },
  {
    name: 'send_email',
    description: 'Send an email notification',
    execute: async (message: string) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Extract recipient from message or use default
      const recipient = message.includes('@') 
        ? message.match(/\S+@\S+\.\S+/)?.[0] || 'user@example.com'
        : 'user@example.com';
      return `Email notification sent to ${recipient}`;
    }
  }
];

const generateResponse = (message: string, agent: AgentPersona): string => {
  const responses = {
    'general-assistant': [
      "I'd be happy to help you with that! Let me think about the best approach.",
      "That's an interesting question. Based on my knowledge, I can suggest several options.",
      "I understand what you're looking for. Here's what I recommend:",
      "Great question! Let me break this down for you step by step."
    ],
    'code-agent': [
      "Let me analyze this from a technical perspective and provide you with a solid solution.",
      "I'll help you implement this feature. Here's the approach I'd recommend:",
      "Looking at your requirements, I can suggest an efficient implementation strategy.",
      "Let me walk you through the best practices for this type of implementation."
    ],
    'automation-agent': [
      "I can help you automate this process! Let me design a workflow for you.",
      "This is perfect for automation. I'll create a streamlined solution.",
      "I can integrate several tools to make this process more efficient.",
      "Let me analyze your workflow and suggest some optimizations."
    ]
  };

  const agentResponses = responses[agent.id as keyof typeof responses] || responses['general-assistant'];
  return agentResponses[Math.floor(Math.random() * agentResponses.length)];
};

export const processUserMessage = async (
  message: string,
  agent: AgentPersona,
  onActionUpdate?: (action: AgentAction) => void
): Promise<string> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if message requires tool usage
  const needsTool = message.toLowerCase().includes('search') || 
                   message.toLowerCase().includes('code') || 
                   message.toLowerCase().includes('analyze') || 
                   message.toLowerCase().includes('email');

  if (needsTool && onActionUpdate) {
    // Simulate tool usage
    const tool = mockTools[Math.floor(Math.random() * mockTools.length)];
    
    const action: AgentAction = {
      id: `action-${Date.now()}`,
      name: tool.name,
      description: tool.description,
      status: 'running',
      timestamp: new Date(),
    };

    onActionUpdate({ ...action, status: 'running' });

    try {
      const result = await tool.execute(message);
      onActionUpdate({ ...action, status: 'completed', result });
      
      return `${generateResponse(message, agent)} I used the ${tool.name} tool and ${result.toLowerCase()}.`;
    } catch (error) {
      onActionUpdate({ 
        ...action, 
        status: 'failed', 
        error: 'Tool execution failed' 
      });
      return `${generateResponse(message, agent)} However, I encountered an issue with the ${tool.name} tool.`;
    }
  }

  return generateResponse(message, agent) + ` ${message.split(' ').slice(-3).join(' ')}`;
};

export const simulateTyping = async (
  text: string,
  onChunk: (chunk: string, isComplete: boolean) => void,
  delay: number = 30
): Promise<void> => {
  const words = text.split(' ');
  let currentText = '';

  for (let i = 0; i < words.length; i++) {
    currentText += (i > 0 ? ' ' : '') + words[i];
    onChunk(currentText, i === words.length - 1);
    
    if (i < words.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};