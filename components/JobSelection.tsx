import React from 'react';
import type { Job } from '../types';

interface JobSelectionProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}

const JobCard: React.FC<{ job: Job; onSelect: () => void }> = ({ job, onSelect }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h3>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold">{job.company}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{job.location}</p>
                </div>
                <div className="text-primary-500 bg-primary-100 dark:bg-primary-900/50 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">{job.description}</p>
        </div>
        <div className="mt-6">
            <button
                onClick={onSelect}
                className="w-full bg-primary-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-300"
            >
                Start Interview Process
            </button>
        </div>
    </div>
);


export const JobSelection: React.FC<JobSelectionProps> = ({ jobs, onSelectJob }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
          Choose Your Opportunity
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Select a job opening below to begin. Our AI will analyze your resume against the role and conduct a personalized mock interview to get you ready.
        </p>
      </div>
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map(job => (
            <JobCard key={job.id} job={job} onSelect={() => onSelectJob(job)} />
            ))}
        </div>
        ) : (
        <div className="text-center bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No Job Openings Available</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Please check back later, or contact an administrator to add a new job opening.</p>
        </div>
      )}
    </div>
  );
};
