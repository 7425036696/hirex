import React, { useState } from 'react';
import type { Job } from '../types';

interface JobFormProps {
    onAddJob: (job: Omit<Job, 'id' | 'creatorId'>) => void;
}

export const JobForm: React.FC<JobFormProps> = ({ onAddJob }) => {
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
            requirements: requirements.split(',').map(r => r.trim()).filter(r => r),
        });
        // Reset form
        setTitle('');
        setCompany('');
        setLocation('');
        setDescription('');
        setRequirements('');
    };
    
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4">Add New Job Opening</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" required />
                </div>
                 <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                    <input type="text" id="company" value={company} onChange={e => setCompany(e.target.value)} className="mt-1 block w-full rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" required />
                </div>
                 <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                    <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" required></textarea>
                </div>
                <div>
                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Requirements (comma-separated)</label>
                    <input type="text" id="requirements" value={requirements} onChange={e => setRequirements(e.target.value)} className="mt-1 block w-full rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <button type="submit" className="w-full bg-primary-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-300">Add Job</button>
            </form>
        </div>
    )
};
