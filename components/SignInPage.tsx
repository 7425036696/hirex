import React from 'react';
import { SignIn } from '@clerk/clerk-react';

interface SignInPageProps {
  onBack: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
        <div className="mb-6">
             <button onClick={onBack} className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                Back to Home
            </button>
        </div>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};