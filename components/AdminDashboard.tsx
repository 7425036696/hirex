import React, { useState } from 'react';
import type { Job } from '../types';

interface AdminDashboardProps {
    jobs: Job[];
    onAddJob: (job: Omit<Job, 'id'>) => void;
    onDeleteJob: (jobId: string) => void;
    onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ jobs, onAddJob, onDeleteJob, onExitAdmin }) => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !company || !description) {
            alert('Please fill all required fields');
            return;
        }
        onAddJob({
            title,
            company,
            location,
            description,
            requirements: requirements.split(',').map(r => r.trim()),
        });
        // Reset form
        setTitle('');
        setCompany('');
        setLocation('');
        setDescription('');
        setRequirements('');
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                 <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Admin Dashboard</h1>
                 <button onClick={onExitAdmin} className="text-sm font-semibold text-primary-600 hover:underline">Exit Admin View</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Job Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold mb-4">Add New Job Opening</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
                                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0" required />
                            </div>
                             <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                                <input type="text" id="company" value={company} onChange={e => setCompany(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0" required />
                            </div>
                             <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                                <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0" required></textarea>
                            </div>
                            <div>
                                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Requirements (comma-separated)</label>
                                <input type="text" id="requirements" value={requirements} onChange={e => setRequirements(e.target.value)} className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-0" />
                            </div>
                            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-300">Add Job</button>
                        </form>
                    </div>
                </div>

                {/* Job List */}
                <div className="lg:col-span-2">
                     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                         <h2 className="text-xl font-bold mb-4">Current Job Listings ({jobs.length})</h2>
                         <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {jobs.length > 0 ? jobs.map(job => (
                                <div key={job.id} className="p-4 border rounded-lg dark:border-gray-700 flex justify-between items-center">
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
