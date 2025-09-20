import React from 'react';
import { SignedIn, SignedOut, UserButton, useUser, UserProfile } from '@clerk/clerk-react';

interface HeaderProps {
    onSignIn: () => void;
    onSignUp: () => void;
    onAdmin: () => void;
    onDashboard: () => void;
    onHome: () => void;
    credits: number;
    subscriptionTier: 'Free' | 'Pro';
}

export const Header: React.FC<HeaderProps> = ({ onSignIn, onSignUp, onAdmin, onDashboard, onHome, credits, subscriptionTier }) => {
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === 'admin';
    const isInterviewer = user?.publicMetadata?.role === 'interviewer';

    return (
        <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/80 dark:border-gray-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <button onClick={onHome} className="text-2xl font-bold">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">HireX AI</span>
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                       <SignedIn>
                           <>
                             {isAdmin && (
                                <button onClick={onAdmin} className="hidden sm:inline-block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                 Admin Panel
                                </button>
                             )}
                             {isInterviewer && (
                                <button onClick={onDashboard} className="hidden sm:inline-block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                 Dashboard
                                </button>
                             )}
                            <div className="hidden sm:flex items-center space-x-4 bg-white/80 dark:bg-gray-900/80 px-3 py-1.5 rounded-full border border-gray-200/80 dark:border-gray-800/80">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${subscriptionTier === 'Pro' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>{subscriptionTier}</span>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Credits: <span className="font-bold text-primary-600 dark:text-primary-400">{credits}</span>
                                </div>
                            </div>
                            <UserButton afterSignOutUrl="/">
                                {/* Fix: Added the required 'label' prop to satisfy the UserProfilePageProps type. */}
                                <UserButton.UserProfilePage label="account">
                                    <UserProfile path="/user-profile" routing="path" />
                                </UserButton.UserProfilePage>
                            </UserButton>
                           </>
                       </SignedIn>
                       <SignedOut>
                           <button 
                                onClick={onSignIn}
                                className="hidden sm:inline-block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={onSignUp}
                                className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-colors duration-300"
                            >
                                Sign Up
                            </button>
                       </SignedOut>
                    </div>
                </div>
            </div>
        </header>
    );
};