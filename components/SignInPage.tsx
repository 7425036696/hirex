import React from 'react';
import { SignIn } from '@clerk/clerk-react';

interface SignInPageProps {
  onBack: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-12 animate-fade-in bg-grid-gray-200/[0.6] dark:bg-grid-gray-800/[0.4]">
        <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800">
             <div className="text-center">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back!</h2>
                 <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to continue your journey with HireX AI.</p>
             </div>
             <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
             <div className="text-center">
                 <button onClick={onBack} className="flex items-center justify-center w-full text-sm text-primary-600 dark:text-primary-400 hover:underline font-semibold mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    Back to Home
                </button>
             </div>
        </div>
    </div>
  );
};