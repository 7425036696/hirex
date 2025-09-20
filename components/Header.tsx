import React from 'react';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';

interface HeaderProps {
    onSignIn: () => void;
    onSignUp: () => void;
    onAdmin: () => void;
    onHome: () => void;
    credits: number;
    subscriptionTier: 'Free' | 'Pro';
}

export const Header: React.FC<HeaderProps> = ({ onSignIn, onSignUp, onAdmin, onHome, credits, subscriptionTier }) => {
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === 'admin';

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <button onClick={onHome} className="text-2xl font-bold text-primary-600 dark:text-primary-400">HireX AI</button>
                    </div>
                    <div className="flex items-center space-x-4">
                       <SignedIn>
                           <>
                             {isAdmin && (
                                <button onClick={onAdmin} className="hidden sm:inline-block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                                 Admin Panel
                                </button>
                             )}
                            <div className="hidden sm:flex items-center space-x-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${subscriptionTier === 'Pro' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>{subscriptionTier} Plan</span>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Credits: <span className="font-bold text-primary-600 dark:text-primary-400">{credits}</span>
                                </div>
                            </div>
                            <UserButton afterSignOutUrl="/" />
                           </>
                       </SignedIn>
                       <SignedOut>
                           <button 
                                onClick={onSignIn}
                                className="hidden sm:inline-block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={onSignUp}
                                className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-colors duration-300"
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