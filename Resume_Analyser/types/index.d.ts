interface Job {
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
}

interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imagePath: string;
  resumePath: string;
  // upload.tsx saves the paths with these lowercase keys
  imagepath?: string;
  resumepath?: string;
  feedback: Feedback;
}

interface TailoredResume {
  name: string;
  contact: string[];
  summary: string;
  skills: string[];
  experience: {
    role: string;
    company: string;
    duration: string;
    bullets: string[];
  }[];
  projects: {
    name: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    duration: string;
  }[];
}

interface Feedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };
  toneAndStyle: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  content: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  structure: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  skills: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
}