import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import type { ResumeAnalysis } from '../types';
import { CheckCircleIcon, AlertTriangleIcon } from './IconComponents';

interface MatchScoreProps {
  analysis: ResumeAnalysis;
  onStartInterview: () => void;
  onReupload: () => void;
  onPurchase: () => void;
  credits: number;
}

const MINIMUM_SCORE = 50;

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 52;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const scoreColor = score >= 75 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="relative h-48 w-48">
            <svg className="h-full w-full" viewBox="0 0 120 120">
                <circle className="text-gray-200 dark:text-gray-800" strokeWidth="10" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                <circle
                    className={scoreColor}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${scoreColor}`}>{score}</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Match Score</span>
            </div>
        </div>
    );
};

export const MatchScore: React.FC<MatchScoreProps> = ({ analysis, onStartInterview, onReupload, onPurchase, credits }) => {
    const isQualified = analysis.overallScore >= MINIMUM_SCORE;
    const hasCredits = credits > 0;

    const chartData = analysis.skillScores.map(s => ({
        skill: s.skill,
        score: s.score,
        fullMark: 10,
    }));

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Your Resume Analysis is Ready</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{analysis.summary}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="flex justify-center items-center">
                       <ScoreCircle score={analysis.overallScore} />
                    </div>
                    <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-950/50 p-6 rounded-lg border dark:border-gray-800">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Skill Breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                <PolarGrid stroke="hsla(var(--border))" />
                                <PolarAngleAxis dataKey="skill" tick={{ className: 'text-xs text-gray-600 dark:text-gray-400 fill-current' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                                <Radar name="Your Score" dataKey="score" stroke="#299fff" fill="#299fff" fillOpacity={0.6} />
                                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem' }} />
                                <Legend wrapperStyle={{fontSize: '0.875rem'}}/>
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-900/50">
                        <h3 className="text-lg font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
                            <CheckCircleIcon className="w-6 h-6"/> Your Strengths
                        </h3>
                        <ul className="mt-4 space-y-2 list-disc list-inside text-green-700 dark:text-green-400">
                            {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 p-6 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
                        <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                            <AlertTriangleIcon className="w-6 h-6"/> Areas to Improve
                        </h3>
                        <ul className="mt-4 space-y-2 list-disc list-inside text-yellow-700 dark:text-yellow-400">
                            {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 text-center border-t border-gray-200 dark:border-gray-800 pt-8">
                    {isQualified ? (
                        hasCredits ? (
                            <>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">Congratulations! You've qualified and have {credits} interview credit(s) remaining. Ready to practice?</p>
                                <button
                                    onClick={onStartInterview}
                                    className="bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold py-3 px-8 rounded-lg hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 text-lg shadow-lg hover:shadow-primary-500/50"
                                >
                                    Start Your AI Interview
                                </button>
                            </>
                        ) : (
                             <div className="max-w-2xl mx-auto bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-900/50">
                                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300">You're Qualified, but Out of Credits!</h3>
                                <p className="mt-2 text-blue-700 dark:text-blue-300">
                                    Your resume is a great match for this role. Purchase more credits to proceed with the mock interview.
                                </p>
                                 <button
                                    onClick={onPurchase}
                                    className="mt-4 bg-primary-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300"
                                >
                                    Purchase More Credits
                                </button>
                            </div>
                        )
                    ) : (
                        <div className="max-w-2xl mx-auto bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-900/50">
                            <h3 className="text-lg font-bold text-red-800 dark:text-red-300">Interview Not Unlocked</h3>
                            <p className="mt-2 text-red-700 dark:text-red-300">
                                Your resume score is below the required {MINIMUM_SCORE}% for this role. We recommend tailoring your resume to better match the job description's key requirements and trying again.
                            </p>
                             <button
                                onClick={onReupload}
                                className="mt-4 bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300"
                            >
                                Upload a Different Resume
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};