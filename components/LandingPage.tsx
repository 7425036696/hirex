import React from 'react';
import type { Plan } from '../types';
import { BrainCircuitIcon, UserCheckIcon, ShieldCheckIcon, BarChartIcon, CheckCircleIcon } from './IconComponents';

interface LandingPageProps {
  onGetStarted: (plan: Plan) => void;
  plans: Plan[];
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300">
      {icon}
    </div>
    <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-base text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

const PricingCard: React.FC<{plan: Plan, onSelectPlan: (plan: Plan) => void}> = ({ plan, onSelectPlan }) => (
    <div className={`rounded-2xl p-8 border ${plan.name === 'Pro' ? 'bg-primary-600 text-white border-primary-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
        <h3 className={`text-lg font-semibold ${plan.name === 'Pro' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{plan.name}</h3>
        <p className={`mt-4 text-4xl font-bold tracking-tight ${plan.name === 'Pro' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{plan.priceDisplay}</p>
        <p className={`mt-1 text-sm ${plan.name === 'Pro' ? 'text-primary-200' : 'text-gray-500 dark:text-gray-400'}`}>{plan.name === 'Pro' ? 'One-time purchase' : 'Get started for free'}</p>
        <button
            onClick={() => onSelectPlan(plan)}
            className={`mt-6 block w-full rounded-md py-2.5 px-3.5 text-center text-sm font-semibold transition-colors ${plan.name === 'Pro' ? 'bg-white text-primary-600 hover:bg-primary-50' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
        >
            {plan.name === 'Pro' ? 'Purchase Plan' : 'Get Started'}
        </button>
        <ul className={`mt-8 space-y-3 text-sm ${plan.name === 'Pro' ? 'text-primary-100' : 'text-gray-600 dark:text-gray-300'}`}>
            {plan.features.map(feature => (
                <li key={feature} className="flex gap-x-3">
                    <CheckCircleIcon className={`h-6 w-5 flex-none ${plan.name === 'Pro' ? 'text-white' : 'text-primary-600'}`} aria-hidden="true" />
                    {feature}
                </li>
            ))}
        </ul>
    </div>
);


export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, plans }) => {
  const freePlan = plans.find(p => p.price === 0);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900">
         <div className="absolute inset-0 bg-grid-gray-200/[0.6] dark:bg-grid-gray-700/[0.6] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Land Your Dream Job with <span className="text-primary-600">HireX AI</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-600 dark:text-gray-300">
            Our AI-powered platform analyzes your resume, conducts realistic mock interviews, and provides instant, actionable feedback to help you ace your next interview.
          </p>
          <div className="mt-10">
            <button
              onClick={() => freePlan && onGetStarted(freePlan)}
              className="bg-primary-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 text-lg shadow-lg hover:shadow-primary-500/50"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              How HireX AI Prepares You
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              A complete toolkit to build your confidence and skills.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<UserCheckIcon className="w-6 h-6" />}
              title="AI Resume Analysis"
              description="Upload your resume and get an instant match score against any job description, highlighting your strengths and weaknesses."
            />
            <FeatureCard
              icon={<BrainCircuitIcon className="w-6 h-6" />}
              title="Personalized Interviews"
              description="Our AI generates tailored interview questions based on your resume and the specific job you're targeting."
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="w-6 h-6" />}
              title="Realistic Voice Simulation"
              description="Practice your answers in a realistic, voice-based interview environment. No more typing, just talking."
            />
            <FeatureCard
              icon={<BarChartIcon className="w-6 h-6" />}
              title="Actionable Feedback"
              description="Receive a detailed report on your performance, including scores on clarity, relevance, and confidence, plus learning resources."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
       <section id="pricing" className="py-12 sm:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Pricing Plans</h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Choose the plan that's right for you and start practicing today.</p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                {plans.map(plan => <PricingCard key={plan.id} plan={plan} onSelectPlan={onGetStarted} />)}
            </div>
        </div>
      </section>
    </div>
  );
};