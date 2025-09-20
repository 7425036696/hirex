
import { GoogleGenAI, Type } from "@google/genai";
import type { ResumeAnalysis, Job, ConversationTurn, InterviewFeedback } from '../types';

// IMPORTANT: Assumes API_KEY is set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Schema for resume analysis to ensure structured JSON output
const resumeAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: { type: Type.NUMBER, description: "Overall match score from 0 to 100." },
        summary: { type: Type.STRING, description: "A brief summary of the candidate's fit for the role." },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key strengths." },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key weaknesses or skill gaps." },
        skillScores: {
            type: Type.ARRAY,
            description: "Scores for key skills required by the job.",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The skill being evaluated." },
                    score: { type: Type.NUMBER, description: "Score from 0 to 10 for the skill." },
                    justification: { type: Type.STRING, description: "Brief justification for the score." }
                },
                required: ["skill", "score", "justification"]
            }
        }
    },
    required: ["overallScore", "summary", "strengths", "weaknesses", "skillScores"]
};


// Schema for interview feedback
const interviewFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        overallFeedback: { type: Type.STRING, description: "A comprehensive paragraph summarizing the interview performance." },
        clarityScore: { type: Type.NUMBER, description: "A score from 0-10 on the clarity and conciseness of answers." },
        relevanceScore: { type: Type.NUMBER, description: "A score from 0-10 on the relevance of answers to the questions." },
        confidenceScore: { type: Type.NUMBER, description: "A score from 0-10 assessing the candidate's confidence." },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of strengths demonstrated during the interview." },
        areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of areas where the candidate can improve." },
        suggestedLearning: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    topic: { type: Type.STRING },
                    url: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["topic", "url", "description"]
            }
        }
    },
    required: ["overallFeedback", "clarityScore", "relevanceScore", "confidenceScore", "strengths", "areasForImprovement", "suggestedLearning"]
};


export const analyzeResume = async (resumeText: string, job: Job): Promise<ResumeAnalysis> => {
    const prompt = `
        Act as an expert technical recruiter. Analyze the following resume against the provided job description.
        Provide a detailed analysis in JSON format based on the required schema.

        Job Title: ${job.title}
        Job Description: ${job.description}
        Job Requirements: ${job.requirements.join(', ')}

        ---
        Resume Text:
        ${resumeText}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: resumeAnalysisSchema,
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as ResumeAnalysis;
    } catch (error) {
        console.error("Error analyzing resume:", error);
        throw new Error("Failed to analyze resume with AI.");
    }
};

export const generateInterviewQuestion = async (
    job: Job,
    resumeAnalysis: ResumeAnalysis,
    history: ConversationTurn[]
): Promise<string> => {
    const historyString = history.map(turn => `${turn.role}: ${turn.text}`).join('\n');

    const prompt = `
        You are an AI interviewer for the role of "${job.title}". Your goal is to assess the candidate's skills based on their resume and the job requirements.
        
        Resume Analysis Summary: ${resumeAnalysis.summary}
        Key Strengths: ${resumeAnalysis.strengths.join(', ')}
        Identified Gaps: ${resumeAnalysis.weaknesses.join(', ')}

        Conversation History:
        ${historyString}

        Based on the above, generate the next interview question. 
        - If the history is empty, start with a welcoming behavioral question.
        - Otherwise, ask a relevant follow-up or a new technical/behavioral question.
        - Keep questions concise and direct.
        - Do not repeat questions.
        
        Your response should ONLY be the question itself. No preamble.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating question:", error);
        return "I'm sorry, I had a problem thinking of the next question. Could you please tell me more about your experience with a key technology from your resume?";
    }
};

export const getInterviewFeedback = async (
    job: Job,
    transcript: ConversationTurn[]
): Promise<InterviewFeedback> => {
    const transcriptString = transcript.map(turn => `${turn.role}: ${turn.text}`).join('\n\n');

    const prompt = `
        Act as an expert interview coach. Analyze the following interview transcript for the "${job.title}" role.
        Provide a detailed, constructive, and encouraging feedback report in JSON format based on the required schema.
        Evaluate the candidate's answers for clarity, relevance, confidence, and depth.
        Provide actionable advice and suggest real learning resources (with valid URLs).

        Interview Transcript:
        ---
        ${transcriptString}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: interviewFeedbackSchema,
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as InterviewFeedback;
    } catch (error) {
        console.error("Error generating feedback:", error);
        throw new Error("Failed to generate interview feedback with AI.");
    }
};
