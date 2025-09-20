import React from 'react';
import type { Job } from '../types';
import { JobForm } from './JobForm';

interface AdminDashboardProps {
    jobs: Job[];
    onAddJob: (job: Omit<Job, 'id' | 'creatorId'>) => void;
    onDeleteJob: (jobId: string) => void;
    onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ jobs, onAddJob, onDeleteJob, onExitAdmin }) => {
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                 <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Admin Dashboard</h1>
                 <button onClick={onExitAdmin} className="text-sm font-semibold text-primary-600 hover:underline">Exit Admin View</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Job Form */}
                <div className="lg:col-span-1">
                    <JobForm onAddJob={onAddJob} />
                </div>

                {/* Job List */}
                <div className="lg:col-span-2">
                     <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
                         <h2 className="text-xl font-bold mb-4">Current Job Listings ({jobs.length})</h2>
                         <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {jobs.length > 0 ? jobs.map(job => (
                                <div key={job.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-800 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{job.company} - {job.location}</p>
                                    </div>
                                    <button onClick={() => onDeleteJob(job.id)} className="text-red-500 hover:text-red-700 font-semibold text-sm">Delete</button>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No jobs have been created yet.</p>
                            )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};