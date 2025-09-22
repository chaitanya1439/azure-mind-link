import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ChatState, Conversation, Message, AgentPersona } from '../types/chat';

interface ChatContextType {
  state: ChatState;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  createConversation: (agent: AgentPersona) => void;
  setActiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
}

type ChatAction = 
  | { type: 'ADD_MESSAGE'; payload: Omit<Message, 'id' | 'timestamp'> }
  | { type: 'CREATE_CONVERSATION'; payload: AgentPersona }
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: string }
  | { type: 'DELETE_CONVERSATION'; payload: string }
  | { type: 'UPDATE_MESSAGE'; payload: { messageId: string; updates: Partial<Message> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_STATE'; payload: ChatState };

const defaultAgents: AgentPersona[] = [
  {
    id: 'general-assistant',
    name: 'General Assistant',
    description: 'A helpful AI assistant that can help with various tasks',
    systemPrompt: 'You are a helpful, knowledgeable AI assistant.',
    capabilities: ['General conversation', 'Task planning', 'Information lookup'],
    color: 'primary'
  },
  {
    id: 'code-agent',
    name: 'Code Assistant',
    description: 'Specialized in programming and development tasks',
    systemPrompt: 'You are an expert programmer and development assistant.',
    capabilities: ['Code review', 'Bug fixing', 'Architecture advice'],
    color: 'secondary'
  },
  {
    id: 'automation-agent',
    name: 'Automation Agent',
    description: 'Focused on workflow automation and productivity',
    systemPrompt: 'You are an automation expert who helps streamline workflows.',
    capabilities: ['Process automation', 'Tool integration', 'Workflow optimization'],
    color: 'accent'
  }
];

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  agents: defaultAgents,
  isLoading: false,
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      if (!state.activeConversationId) return state;
      
      const newMessage: Message = {
        ...action.payload,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };

      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === state.activeConversationId
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                updatedAt: new Date(),
              }
            : conv
        ),
      };
    }

    case 'CREATE_CONVERSATION': {
      const newConversation: Conversation = {
        id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: 'New Chat',
        messages: [],
        agent: action.payload,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        ...state,
        conversations: [newConversation, ...state.conversations],
        activeConversationId: newConversation.id,
      };
    }

    case 'SET_ACTIVE_CONVERSATION':
      return { ...state, activeConversationId: action.payload };

    case 'DELETE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.filter(conv => conv.id !== action.payload),
        activeConversationId: 
          state.activeConversationId === action.payload
            ? state.conversations.length > 1
              ? state.conversations.find(c => c.id !== action.payload)?.id || null
              : null
            : state.activeConversationId,
      };

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map(conv => ({
          ...conv,
          messages: conv.messages.map(msg =>
            msg.id === action.payload.messageId
              ? { ...msg, ...action.payload.updates }
              : msg
          ),
        })),
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chat-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        const restored: ChatState = {
          ...parsed,
          conversations: parsed.conversations.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages: conv.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          })),
          agents: defaultAgents, // Always use latest agents
        };
        dispatch({ type: 'LOAD_STATE', payload: restored });
      }
    } catch (error) {
      console.error('Failed to load chat state:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('chat-state', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save chat state:', error);
    }
  }, [state]);

  const contextValue: ChatContextType = {
    state,
    addMessage: (message) => dispatch({ type: 'ADD_MESSAGE', payload: message }),
    createConversation: (agent) => dispatch({ type: 'CREATE_CONVERSATION', payload: agent }),
    setActiveConversation: (id) => dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: id }),
    deleteConversation: (id) => dispatch({ type: 'DELETE_CONVERSATION', payload: id }),
    updateMessage: (messageId, updates) => dispatch({ type: 'UPDATE_MESSAGE', payload: { messageId, updates } }),
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};