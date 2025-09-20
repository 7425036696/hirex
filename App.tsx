import React, { useState, useCallback, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { AppStep } from './types';
import type { Job, ResumeAnalysis, InterviewFeedback, Plan, Candidate } from './types';

import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { SignInPage } from './components/SignInPage';
import { SignUpPage } from './components/SignUpPage';
import { JobSelection } from './components/JobSelection';
import { ResumeUpload } from './components/ResumeUpload';
import { MatchScore } from './components/MatchScore';
import { Interview } from './components/Interview';
import { FeedbackReport } from './components/FeedbackReport';
import { AdminDashboard } from './components/AdminDashboard';
import { InterviewerDashboard } from './components/InterviewerDashboard';
import { Payment } from './components/Payment';


const initialJobs: Job[] = [
  {
    id: 'swe-01',
    creatorId: 'system',
    title: 'Senior Frontend Engineer',
    company: 'InnovateTech',
    location: 'Remote',
    description: 'Build and maintain our next-generation user interfaces using React, TypeScript, and Tailwind CSS. You will collaborate with product and design teams to create a seamless user experience.',
    requirements: ['5+ years of React experience', 'Expertise in TypeScript', 'Strong understanding of modern CSS', 'Experience with testing frameworks like Jest/RTL'],
  },
  {
    id: 'pm-01',
    creatorId: 'system',
    title: 'Product Manager',
    company: 'DataDriven Co.',
    location: 'New York, NY',
    description: 'Lead the product lifecycle from conception to launch. You will be responsible for product planning, gathering and prioritizing requirements, and working closely with engineering to deliver winning products.',
    requirements: ['3+ years in Product Management', 'Experience with Agile methodologies', 'Excellent communication skills', 'Data analysis and market research capabilities'],
  },
   {
    id: 'ds-01',
    creatorId: 'system',
    title: 'Data Scientist',
    company: 'AI Solutions Inc.',
    location: 'San Francisco, CA',
    description: 'Leverage machine learning and statistical modeling techniques to extract valuable insights from large datasets. You will be instrumental in driving our data-first culture.',
    requirements: ['PhD or Masters in a quantitative field', 'Proficiency in Python (pandas, scikit-learn)', 'Experience with ML frameworks (TensorFlow, PyTorch)', 'Strong SQL skills'],
  },
];

const plans: Plan[] = [
    { id: 'free-plan', name: 'Basic', price: 0, priceDisplay: '$0', credits: 1, features: ['1 AI Interview Credit', 'Standard Resume Analysis', 'Basic Feedback Report'] },
    { id: 'pro-plan', name: 'Pro', price: 999, priceDisplay: '$9.99', credits: 5, features: ['5 AI Interview Credits', 'Advanced Resume Analysis', 'Detailed Performance Feedback', 'Priority Support'] },
];


const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  
  // NOTE: To make a user an admin or interviewer, go to your Clerk Dashboard -> Users -> Select a user
  // -> Metadata -> Public Metadata -> and add: { "role": "admin" } or { "role": "interviewer" }
  const isAdmin = user?.publicMetadata?.role === 'admin';
  const isInterviewer = user?.publicMetadata?.role === 'interviewer';
  
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [interviewFeedback, setInterviewFeedback] = useState<InterviewFeedback | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // --- New State for Monetization ---
  // In a real app, credits and subscription would be loaded from your database via an API call
  const [credits, setCredits] = useState(1); // Default free credit
  const [subscriptionTier, setSubscriptionTier] = useState<'Free' | 'Pro'>('Free');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const getHomeStep = useCallback(() => {
    if (isAdmin) return AppStep.ADMIN;
    if (isInterviewer) return AppStep.INTERVIEWER_DASHBOARD;
    return AppStep.JOB_SELECTION;
  }, [isAdmin, isInterviewer]);

  // Effect to handle redirection based on auth state
   useEffect(() => {
    if (!isLoaded) return;
    
    if (isSignedIn) {
      if (step === AppStep.LANDING || step === AppStep.SIGN_IN || step === AppStep.SIGN_UP) {
        setStep(getHomeStep());
      }
    } else {
      handleRestart();
      setStep(AppStep.LANDING);
    }
  }, [isSignedIn, isLoaded, step, getHomeStep]);


  // --- Auth Handlers ---
  const handleGoToSignIn = useCallback(() => setStep(AppStep.SIGN_IN), []);
  const handleGoToSignUp = useCallback(() => setStep(AppStep.SIGN_UP), []);
  
  // --- Navigation & Core Flow Handlers ---
  const handleGoToAdmin = useCallback(() => setStep(AppStep.ADMIN), []);
  const handleGoToDashboard = useCallback(() => setStep(AppStep.INTERVIEWER_DASHBOARD), []);
  const handleGoHome = useCallback(() => {
      setStep(isSignedIn ? getHomeStep() : AppStep.LANDING);
  }, [isSignedIn, getHomeStep]);
  
  const handleJobSelection = useCallback((job: Job) => {
    setSelectedJob(job);
    setResumeAnalysis(null);
    setInterviewFeedback(null);
    setStep(AppStep.RESUME_UPLOAD);
  }, []);

  const handleAnalysisComplete = useCallback((analysis: ResumeAnalysis) => {
    setResumeAnalysis(analysis);
    setStep(AppStep.MATCHING);
  }, []);

  const handleStartInterview = useCallback(() => {
    if (credits > 0) {
        setCredits(prev => prev - 1);
        setStep(AppStep.INTERVIEW);
    } else {
        alert("You are out of credits. Please purchase a plan.");
        setSelectedPlan(plans.find(p => p.id === 'pro-plan') || null);
        setStep(AppStep.PAYMENT);
    }
  }, [credits]);

  const handleInterviewComplete = useCallback((feedback: InterviewFeedback) => {
    if (user && selectedJob && resumeAnalysis) {
        const newCandidate: Candidate = {
            userId: user.id,
            userName: user.fullName || 'Anonymous',
            userEmail: user.primaryEmailAddress?.emailAddress || 'no-email',
            jobId: selectedJob.id,
            jobTitle: selectedJob.title,
            resumeAnalysis: resumeAnalysis,
            interviewFeedback: feedback,
        };
        setCandidates(prev => [...prev, newCandidate]);
    }
    setInterviewFeedback(feedback);
    setStep(AppStep.FEEDBACK);
  }, [user, selectedJob, resumeAnalysis]);
  
  const handleRestart = useCallback(() => {
    setSelectedJob(null);
    setResumeAnalysis(null);
    setInterviewFeedback(null);
    setStep(isSignedIn ? getHomeStep() : AppStep.LANDING);
  }, [isSignedIn, getHomeStep]);
  
  const handleBackToJobs = useCallback(() => {
      setSelectedJob(null);
      setStep(getHomeStep());
  }, [getHomeStep]);
  
  const handleReuploadResume = useCallback(() => {
    setResumeAnalysis(null);
    setStep(AppStep.RESUME_UPLOAD);
  }, []);

  // --- Payment Handlers ---
  const handlePurchaseRequest = useCallback((plan: Plan) => {
      if (!isSignedIn) {
          handleGoToSignUp();
          return;
      }
      if (plan.price > 0) {
        setSelectedPlan(plan);
        setStep(AppStep.PAYMENT);
      }
  }, [isSignedIn, handleGoToSignUp]);
  
  const handlePaymentSuccess = useCallback(() => {
    if(selectedPlan) {
        alert("Payment successful! Your account has been upgraded.");
        setSubscriptionTier('Pro');
        setCredits(prev => prev + selectedPlan.credits);
        setSelectedPlan(null);
        setStep(getHomeStep());
    }
  }, [selectedPlan, getHomeStep]);
  
  const handlePaymentFailure = useCallback(() => {
    alert("Payment failed. Please try again.");
    setSelectedPlan(null);
    setStep(getHomeStep());
  }, [getHomeStep]);


  // --- Admin/Interviewer Handlers ---
  const handleAddJob = useCallback((newJob: Omit<Job, 'id' | 'creatorId'>) => {
      if(!user) return;
      setJobs(prevJobs => [...prevJobs, { ...newJob, id: `job-${Date.now()}`, creatorId: user.id }]);
  }, [user]);

  const handleDeleteJob = useCallback((jobId: string) => {
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  }, []);


  const renderContent = () => {
    if (!isLoaded) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (isSignedIn) {
      // Authenticated Routes
      switch (step) {
        case AppStep.ADMIN:
          if (!isAdmin) return <JobSelection jobs={jobs} onSelectJob={handleJobSelection} />;
          return <AdminDashboard jobs={jobs} onAddJob={handleAddJob} onDeleteJob={handleDeleteJob} onExitAdmin={handleGoHome} />;
        case AppStep.INTERVIEWER_DASHBOARD:
          if (!isInterviewer) return <JobSelection jobs={jobs} onSelectJob={handleJobSelection} />;
          return <InterviewerDashboard allJobs={jobs} allCandidates={candidates} onAddJob={handleAddJob} onDeleteJob={handleDeleteJob} currentUserId={user.id} />;
        case AppStep.JOB_SELECTION:
          return <JobSelection jobs={jobs} onSelectJob={handleJobSelection} />;
        case AppStep.RESUME_UPLOAD:
          if (!selectedJob) return <JobSelection jobs={jobs} onSelectJob={handleJobSelection} />;
          return <ResumeUpload job={selectedJob} onAnalysisComplete={handleAnalysisComplete} onBack={handleBackToJobs}/>;
        case AppStep.MATCHING:
          if (!resumeAnalysis) return <JobSelection jobs={jobs} onSelectJob={handleJobSelection} />;
          return <MatchScore analysis={resumeAnalysis} onStartInterview={handleStartInterview} onReupload={handleReuploadResume} credits={credits} onPurchase={() => handlePurchaseRequest(plans.find(p => p.id === 'pro-plan')!)} />;
        case AppStep.INTERVIEW:
          if (!selectedJob || !resumeAnalysis) return <JobSelection jobs={jobs} onSelectJob={handleJobSelection} />;
          return <Interview job={selectedJob} resumeAnalysis={resumeAnalysis} onInterviewComplete={handleInterviewComplete} />;
        case AppStep.FEEDBACK:
          if (!interviewFeedback) return <JobSelection jobs={jobs} onSelectJob={handleJobSelection} />;
          return <FeedbackReport feedback={interviewFeedback} onRestart={handleRestart} />;
        case AppStep.PAYMENT:
          if (!selectedPlan) return <LandingPage onGetStarted={handlePurchaseRequest} plans={plans} />;
          return <Payment plan={selectedPlan} onPaymentSuccess={handlePaymentSuccess} onPaymentFailure={handlePaymentFailure} />;
        default:
          return <JobSelection jobs={jobs} onSelectJob={handleJobSelection} />;
      }
    } else {
       // Public routes
       switch(step) {
            case AppStep.SIGN_IN:
                return <SignInPage onBack={() => setStep(AppStep.LANDING)} />;
            case AppStep.SIGN_UP:
                return <SignUpPage onBack={() => setStep(AppStep.LANDING)} />;
            case AppStep.LANDING:
            default:
                return <LandingPage onGetStarted={handlePurchaseRequest} plans={plans} />;
       }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
        <Header 
            onSignIn={handleGoToSignIn}
            onSignUp={handleGoToSignUp}
            onAdmin={handleGoToAdmin}
            onDashboard={handleGoToDashboard}
            onHome={handleGoHome}
            credits={credits}
            subscriptionTier={subscriptionTier}
        />
        <main>
            {renderContent()}
        </main>
    </div>
  );
};

export default App;