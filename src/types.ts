export type SkillLevel = 'junior' | 'mid' | 'senior';

export type LabCategory = 
  | 'Basics & CLI'
  | 'Permissions & Users'
  | 'Processes & Services'
  | 'Networking'
  | 'Storage & LVM'
  | 'Security & Firewall'
  | 'Web Servers & Proxy'
  | 'Automation & Scripts'
  | 'Containers & Docker'
  | 'Kernel & Performance'
  | 'Observability & Logs'
  | 'High Availability';

export interface LabTask {
  id: string;
  text: string;
  codeSnippet?: string;
  note?: string;
}

export interface LabHint {
  id: string;
  title: string;
  content: string;
  codeSnippet?: string;
}

export interface LinuxDocRef {
  title: string;
  url: string;
  category?: string;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface DayChallenge {
  id: string;
  dayNumber: number;
  title: string;
  level: SkillLevel;
  category: LabCategory;
  durationMinutes: number;
  summary: string;
  scenario: string;
  labEnvironment: {
    quickSetupCommand: string;
    description: string;
  };
  prerequisites: string[];
  tasks: LabTask[];
  hints: LabHint[];
  verificationCommand: string;
  proTip: string;
  tags: string[];
  docReferences?: LinuxDocRef[];
  quizQuestions?: QuizQuestion[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  readTimeMinutes: number;
  publishedAt: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  docReferences?: LinuxDocRef[];
}

export interface UserProgress {
  completedDays: string[]; // day ids
  completedTasks: Record<string, string[]>; // dayId -> taskId[]
  personalNotes: Record<string, string>; // dayId -> note text
  preferredLabEnv: 'docker' | 'multipass' | 'vagrant' | 'baremetal';
  streakCount: number;
  lastActiveDate: string;
  bookmarkedBlogs: string[];
  activityLog?: Record<string, number>; // date 'YYYY-MM-DD' -> activity count
}

export interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'unlock' | 'info' | 'warning';
  duration?: number;
}
