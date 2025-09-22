export interface Message {
  id: string;
  content: string;
  role: 'user' | 'agent';
  timestamp: Date;
  isTyping?: boolean;
  actionStatus?: AgentActionStatus;
}

export interface AgentAction {
  id: string;
  name: string;
  description: string;
  status: AgentActionStatus;
  result?: any;
  error?: string;
  timestamp: Date;
}

export type AgentActionStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  agent: AgentPersona;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentPersona {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  systemPrompt: string;
  capabilities: string[];
  color?: string;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  agents: AgentPersona[];
  isLoading: boolean;
}