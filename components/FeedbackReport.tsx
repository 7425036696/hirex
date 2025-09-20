import React from 'react';
import type { InterviewFeedback } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';


interface FeedbackReportProps {
    feedback: InterviewFeedback;
    onRestart: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const ScoreBarChart: React.FC<{feedback: InterviewFeedback}> = ({ feedback }) => {
    const data = [
        { name: 'Clarity', score: feedback.clarityScore },
        { name: 'Relevance', score: feedback.relevanceScore },
        { name: 'Confidence', score: feedback.confidenceScore },
    ];

    return (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Performance Scores</h3>
             <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 10]} tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'currentColor', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}/>
                    <Bar dataKey="score" name="Score (out of 10)" barSize={25}>
                         {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export const FeedbackReport: React.FC<FeedbackReportProps> = ({ feedback, onRestart }) => {
    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Your Interview Feedback Report</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Here's a detailed breakdown of your performance.</p>
                </div>
                
                <div className="mb-10 p-6 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r-lg">
                    <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-300 mb-2">AI Coach Summary</h3>
                    <p className="text-primary-700 dark:text-primary-200">{feedback.overallFeedback}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <ScoreBarChart feedback={feedback} />
                    <div className="space-y-8">
                         <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-green-800 dark:text-green-300">Key Strengths</h3>
                            <ul className="mt-2 space-y-1 list-disc list-inside text-green-700 dark:text-green-400">
                                {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                         <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300">Areas for Improvement</h3>
                            <ul className="mt-2 space-y-1 list-disc list-inside text-yellow-700 dark:text-yellow-400">
                                {feedback.areasForImprovement.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Personalized Learning Resources</h2>
                    <div className="space-y-4">
                        {feedback.suggestedLearning.map((res, i) => (
                            <a href={res.url} target="_blank" rel="noopener noreferrer" key={i} className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <h4 className="font-bold text-primary-600 dark:text-primary-400">{res.topic}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{res.description}</p>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center border-t border-gray-200 dark:border-gray-700 pt-8">
                     <p className="text-gray-600 dark:text-gray-300 mb-4">Practice makes perfect. Ready to take on a new challenge?</p>
                    <button
                        onClick={onRestart}
                        className="bg-primary-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-all duration-300 text-lg shadow-lg hover:shadow-primary-500/50"
                    >
                        Start a New Interview
                    </button>
                </div>
             </div>
        </div>
    );
};
