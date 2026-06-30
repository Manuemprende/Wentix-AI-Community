export interface AITool {
  id: string;
  name: string;
  description: string;
  pricing: "Gratis" | "Freemium" | "Premium" | "Open Source" | string;
  category: string;
  score: number;
  tags: string[];
  url: string;
  stars?: number;
  isTrending?: boolean;
  isLatest?: boolean;
}

export interface GitHubRepo {
  id: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  tags: string[];
  category: "Awesome Lists" | "AI Agents" | "Open Source AI" | "Developer Tools" | string;
  url: string;
}

export interface PromptItem {
  id: string;
  title: string;
  promptText: string;
  description: string;
  model: "ChatGPT" | "Claude" | "Gemini" | "Midjourney" | "Runway" | "Sora" | "Veo" | string;
  category: string;
  difficulty: "Principiante" | "Intermedio" | "Avanzado";
  popularCount: number;
}

export interface WorkflowItem {
  id: string;
  title: string;
  description: string;
  timeSaved: string;
  targetPlatform: string;
  nodes: {
    id: string;
    label: string;
    type: "trigger" | "action" | "ai" | "output";
    status: "idle" | "running" | "success" | "error";
  }[];
  connections: {
    from: string;
    to: string;
  }[];
}

export interface ResourceArticle {
  id: string;
  title: string;
  category: string;
  difficulty?: "Principiante" | "Intermedio" | "Avanzado";
  readTime: string;
  excerpt: string;
  author: string;
  date: string;
  tags: string[];
  views: number;
  imageUrl?: string;
  sourceUrl?: string;
  learningGoals?: string[];
  contentSections?: { heading: string; body: string }[];
  actionSteps?: string[];
  closingNote?: string;
  resourceLinks?: {
    label: string;
    url: string;
    type: "github" | "official" | "docs" | "demo" | "tool" | string;
  }[];
}

export interface StackItem {
  name: string;
  description: string;
  category: string;
  freeTierInfo: string;
  lucideIcon: string;
  badge?: string;
  url?: string;
}

export interface UserBookmark {
  type: "tool" | "repo" | "prompt" | "workflow" | "article";
  id: string;
}
