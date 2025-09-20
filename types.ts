export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
}

export enum AppStep {
  LANDING,
  SIGN_IN,
  SIGN_UP,
  JOB_SELECTION,
  RESUME_UPLOAD,
  MATCHING,
  INTERVIEW,
  FEEDBACK,
  ADMIN,
  PAYMENT,
}

export interface SkillScore {
    skill: string;
    score: number;
    justification: string;
}

export interface ResumeAnalysis {
    overallScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    skillScores: SkillScore[];
}

export interface ConversationTurn {
    role: 'user' | 'model';
    text: string;
}

export interface LearningResource {
    topic: string;
    url: string;
    description: string;
}

export interface InterviewFeedback {
    overallFeedback: string;
    clarityScore: number;
    relevanceScore: number;
    confidenceScore: number;
    strengths: string[];
    areasForImprovement: string[];
    suggestedLearning: LearningResource[];
}

export interface Plan {
    id: string;
    name: string;
    price: number; // Price in lowest currency unit (e.g., paise for INR)
    priceDisplay: string;
    features: string[];
    credits: number;
}