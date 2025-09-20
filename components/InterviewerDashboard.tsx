import React, { useMemo } from 'react';
import type { Job, Candidate } from '../types';
import { JobForm } from './JobForm';
import { UserCheckIcon, BarChartIcon } from './IconComponents';

interface InterviewerDashboardProps {
    allJobs: Job[];
    allCandidates: Candidate[];
    onAddJob: (job: Omit<Job, 'id' | 'creatorId'>) => void;
    onDeleteJob: (jobId: string) => void;
    currentUserId: string;
}

const RESUME_SCORE_THRESHOLD = 75;
const INTERVIEW_SCORE_THRESHOLD = 7.5;

const ScoreDisplay: React.FC<{score: number, label: string, max: number}> = ({ score, label, max }) => {
    const percentage = (score / max) * 100;
    const color = percentage >= 75 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{score.toFixed(1)} / {max}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};


const CandidateCard: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
    const { clarityScore, relevanceScore, confidenceScore } = candidate.interviewFeedback;
    const avgInterviewScore = (clarityScore + relevanceScore + confidenceScore) / 3;

    return (
        <div className="bg-white dark:bg-gray-900/80 p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{candidate.userName}</h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{candidate.jobTitle}</p>
                </div>
                 <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full">Qualified</span>
            </div>
            <div className="mt-4 space-y-4">
               <ScoreDisplay score={candidate.resumeAnalysis.overallScore} label="Resume Match Score" max={100} />
               <ScoreDisplay score={avgInterviewScore} label="Avg. Interview Score" max={10} />
            </div>
             <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-3">
                 <a href={`mailto:${candidate.userEmail}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">
                     {candidate.userEmail}
                 </a>
            </div>
        </div>
    );
};

export const InterviewerDashboard: React.FC<InterviewerDashboardProps> = ({ allJobs, allCandidates, onAddJob, onDeleteJob, currentUserId }) => {

    const myJobs = useMemo(() => allJobs.filter(job => job.creatorId === currentUserId), [allJobs, currentUserId]);
    const myJobIds = useMemo(() => new Set(myJobs.map(job => job.id)), [myJobs]);
    
    const qualifiedCandidates = useMemo(() => {
        return allCandidates.filter(candidate => {
            const { resumeAnalysis, interviewFeedback } = candidate;
            const avgInterviewScore = (interviewFeedback.clarityScore + interviewFeedback.relevanceScore + interviewFeedback.confidenceScore) / 3;
            
            return myJobIds.has(candidate.jobId) &&
                   resumeAnalysis.overallScore >= RESUME_SCORE_THRESHOLD &&
                   avgInterviewScore >= INTERVIEW_SCORE_THRESHOLD;
        });
    }, [allCandidates, myJobIds]);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="mb-10">
                 <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Interviewer Dashboard</h1>
                 <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Manage your job openings and review top candidates.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 mb-8">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Qualified Candidates ({qualifiedCandidates.length})</h2>
                 {qualifiedCandidates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {qualifiedCandidates.map(candidate => <CandidateCard key={candidate.userId + candidate.jobId} candidate={candidate} />)}
                    </div>
                 ) : (
                    <div className="text-center py-10 px-6 bg-gray-50 dark:bg-gray-950/50 rounded-lg">
                        <UserCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No qualified candidates yet</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">As candidates complete interviews for your jobs and meet the criteria, they will appear here.</p>
                    </div>
                 )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Job Form */}
                <div className="lg:col-span-1">
                    <JobForm onAddJob={onAddJob} />
                </div>

                {/* My Job List */}
                <div className="lg:col-span-2">
                     <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
                         <h2 className="text-xl font-bold mb-4">Your Job Listings ({myJobs.length})</h2>
                         <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {myJobs.length > 0 ? myJobs.map(job => (
                                <div key={job.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-800 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{job.company} - {job.location}</p>
                                    </div>
                                    <button onClick={() => onDeleteJob(job.id)} className="text-red-500 hover:text-red-700 font-semibold text-sm">Delete</button>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">You haven't created any job listings yet.</p>
                            )}
                         </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
