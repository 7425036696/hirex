import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Job, ResumeAnalysis, ConversationTurn, InterviewFeedback } from '../types';
import { generateInterviewQuestion, getInterviewFeedback } from '../services/geminiService';
import { MicIcon, MicOffIcon, BrainCircuitIcon } from './IconComponents';

// Fix: Cast window to any to access non-standard SpeechRecognition API
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
// Fix: Use 'any' type for recognition to avoid conflict with the 'SpeechRecognition' variable
let recognition: any | null = null;
if(SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
}


interface InterviewProps {
  job: Job;
  resumeAnalysis: ResumeAnalysis;
  onInterviewComplete: (feedback: InterviewFeedback) => void;
}

export const Interview: React.FC<InterviewProps> = ({ job, resumeAnalysis, onInterviewComplete }) => {
    const [transcript, setTranscript] = useState<ConversationTurn[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isAITalking, setIsAITalking] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("Initializing interview...");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const totalQuestions = 5;

    const synthRef = useRef(window.speechSynthesis);
    const finalUserTranscript = useRef("");
    const transcriptEndRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcript]);

    const speak = useCallback((text: string) => {
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
        }
        setIsAITalking(true);
        setStatusText("AI is asking a question...");
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
            setIsAITalking(false);
            if(currentQuestionIndex < totalQuestions) {
                startListening();
            } else {
                finishInterview();
            }
        };
        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
            setIsAITalking(false);
             if(currentQuestionIndex < totalQuestions) {
                startListening();
            } else {
                finishInterview();
            }
        };
        synthRef.current.speak(utterance);
    }, [currentQuestionIndex]);

    const askQuestion = useCallback(async () => {
        setIsProcessing(true);
        setStatusText("AI is thinking of a question...");
        try {
            const question = await generateInterviewQuestion(job, resumeAnalysis, transcript);
            setTranscript(prev => [...prev, { role: 'model', text: question }]);
            speak(question);
        } catch (error) {
            console.error("Failed to generate question:", error);
            const fallbackQuestion = "Sorry, I had a technical issue. Let's move on. Can you tell me about a time you faced a challenge at work?";
            setTranscript(prev => [...prev, { role: 'model', text: fallbackQuestion }]);
            speak(fallbackQuestion);
        } finally {
            setIsProcessing(false);
        }
    }, [job, resumeAnalysis, transcript, speak]);

    const finishInterview = useCallback(async () => {
        setStatusText("Interview finished! Generating your feedback report...");
        setIsProcessing(true);
        try {
            const feedback = await getInterviewFeedback(job, transcript);
            onInterviewComplete(feedback);
        } catch (error) {
            console.error("Failed to get feedback:", error);
            const dummyFeedback: InterviewFeedback = {
                overallFeedback: "There was an error generating your feedback. Please try again later.",
                clarityScore: 0, relevanceScore: 0, confidenceScore: 0,
                strengths: [], areasForImprovement: [], suggestedLearning: []
            };
            onInterviewComplete(dummyFeedback);
        }
    }, [job, transcript, onInterviewComplete]);
    
    useEffect(() => {
        askQuestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startListening = () => {
        if (!recognition) return;
        finalUserTranscript.current = "";
        setIsListening(true);
        setStatusText("Listening... Please answer the question.");
        recognition.start();
    };

    const stopListening = useCallback(() => {
        if (!recognition) return;
        setIsListening(false);
        recognition.stop();
    }, []);

    const handleUserResponse = useCallback(() => {
        if (finalUserTranscript.current.trim()) {
            setTranscript(prev => [...prev, { role: 'user', text: finalUserTranscript.current.trim() }]);
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
             setCurrentQuestionIndex(prev => prev + 1);
        }
    }, []);
    
    useEffect(() => {
        if (currentQuestionIndex > 0 && currentQuestionIndex <= totalQuestions) {
            if (currentQuestionIndex === totalQuestions) {
                finishInterview();
            } else {
                askQuestion();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuestionIndex]);


    useEffect(() => {
        if (!recognition) {
            setStatusText("Speech recognition is not supported by your browser.");
            return;
        }

        recognition.onresult = (event: any) => {
            let finalTranscriptSlice = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscriptSlice += event.results[i][0].transcript;
                }
            }
            if(finalTranscriptSlice) finalUserTranscript.current = finalUserTranscript.current + ' ' + finalTranscriptSlice;
        };
        
        recognition.onend = () => {
            if(isListening){
               handleUserResponse();
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setStatusText("Sorry, I couldn't hear you. Let's try the next question.");
            stopListening();
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 2000);
        };

        return () => {
            if(recognition){
                recognition.stop();
            }
            synthRef.current.cancel();
        };
    }, [isListening, handleUserResponse, stopListening]);


    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col h-[calc(100vh-100px)] animate-fade-in">
            <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col h-full">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 text-center">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Interview for {job.title}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Question {Math.min(currentQuestionIndex, totalQuestions)} of {totalQuestions}</p>
                </div>
                
                <div className="flex-grow p-4 sm:p-6 overflow-y-auto bg-gray-50 dark:bg-gray-950/50">
                    <div className="space-y-6">
                        {transcript.map((turn, index) => (
                            <div key={index} className={`flex items-start gap-3 ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {turn.role === 'model' && <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-700"><BrainCircuitIcon className="w-5 h-5 text-gray-300"/></div>}
                                <div className={`max-w-md md:max-w-lg p-3 px-4 rounded-2xl shadow-sm ${turn.role === 'user' ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                    <p className="text-sm leading-relaxed">{turn.text}</p>
                                </div>
                            </div>
                        ))}
                         <div ref={transcriptEndRef} />
                    </div>
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-xl">
                     <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={() => { isListening ? stopListening() : startListening() }}
                            disabled={isAITalking || isProcessing || currentQuestionIndex >= totalQuestions}
                            className={`relative w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg`}
                            aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
                         >
                            {isListening && <div className="absolute inset-0 rounded-full bg-red-500/50 animate-pulse-slow -z-10"></div>}
                            <MicIcon className="w-8 h-8" />
                        </button>
                         <div className="flex-grow text-center sm:text-left p-2 bg-gray-100 dark:bg-gray-800 rounded-lg w-full">
                            <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs mb-1">Status</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{statusText}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};