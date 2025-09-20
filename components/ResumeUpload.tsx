import React, { useState, useCallback } from 'react';
import type { Job, ResumeAnalysis } from '../types';
import { analyzeResume } from '../services/geminiService';
import { UploadCloudIcon } from './IconComponents';

interface ResumeUploadProps {
    job: Job;
    onAnalysisComplete: (analysis: ResumeAnalysis) => void;
    onBack: () => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ job, onAnalysisComplete, onBack }) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // NOTE: In a real app, you would handle PDF/DOCX here using a library like pdf-parse on a server.
            // For this frontend-only demo, we're simplifying to text-based files.
            if (selectedFile.type === 'text/plain' || selectedFile.type === 'text/markdown' || selectedFile.type.endsWith('pdf') || selectedFile.type.endsWith('document')) {
                setFile(selectedFile);
                setFileName(selectedFile.name);
                setError('');
            } else {
                 setFile(null);
                setFileName('');
                setError('Please upload a text, markdown, PDF, or DOCX file.');
            }
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!file) {
            setError('Please select a file first.');
            return;
        }

        setIsLoading(true);
        setError('');

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            if(!text) {
                setError('Could not read file content.');
                setIsLoading(false);
                return;
            }
            try {
                const analysisResult = await analyzeResume(text, job);
                onAnalysisComplete(analysisResult);
            } catch (err) {
                setError('An error occurred during AI analysis. Please try again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
             setError('Failed to read file.');
             setIsLoading(false);
        }
        reader.readAsText(file);
    }, [file, job, onAnalysisComplete]);
    
    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
             <button onClick={onBack} className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline mb-6 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                Back to Job Selection
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analyze Your Resume for</h2>
                    <h1 className="text-3xl font-extrabold text-primary-600 dark:text-primary-400 mt-1">{job.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400">at {job.company}</p>
                </div>

                <div className="mt-8">
                    <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload your resume (.txt, .md)</label>
                    <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-10 hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                        <div className="text-center">
                            <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white dark:bg-gray-800 font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-800 hover:text-primary-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.md" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">TXT or MD up to 2MB</p>
                            {fileName && <p className="text-sm mt-4 text-green-600 dark:text-green-400 font-medium">Selected: {fileName}</p>}
                        </div>
                    </div>
                </div>

                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                
                <div className="mt-8">
                    <button
                        onClick={handleAnalyze}
                        disabled={!file || isLoading}
                        className="w-full flex justify-center items-center gap-2 bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </>
                        ) : (
                            'Analyze with AI'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
