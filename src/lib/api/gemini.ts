import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Gemini client only if key is present
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface ChatMessage {
    role: 'user' | 'model'; // Gemini uses 'model' instead of 'assistant'
    parts: { text: string }[];
}

const SYSTEM_PROMPT = `
You are Shantel, a compassionate, supportive, and knowledgeable AI assistant for SalamaHaven, a platform for reporting digital violence.
Your goal is to provide immediate support, safety information, and resources to survivors of digital violence (cyberstalking, harassment, non-consensual image sharing, etc.).

Guidelines:
1. **Empathy First**: Always validate the user's feelings. Use a calm, non-judgmental, and supportive tone.
2. **Safety Priority**: If a user indicates immediate physical danger (e.g., "he's outside my house"), urge them to contact local emergency services (911 or local equivalent) immediately.
3. **Actionable Advice**: Provide clear, step-by-step safety tips (e.g., how to block, how to document evidence, how to secure accounts).
4. **Resource Connection**: Encourage users to use the platform's features: "Find Counselors" map, "Safe Centers," and "Report Incident" forms.
5. **Disclaimer**: Remind users you are an AI, not a human counselor or lawyer.
6. **Conciseness**: Keep responses helpful but concise enough for a chat interface.

Do not provide legal advice, but you can explain general rights regarding digital privacy and harassment.
`;

export const getChatCompletion = async (history: { role: 'user' | 'assistant', content: string }[]): Promise<string> => {
    if (!genAI) {
        return "I'm sorry, but I'm not fully configured yet. Please tell the administrator to add the Gemini API key.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert history to Gemini format
        // Note: Gemini API expects 'user' and 'model' roles.
        // We also need to inject the system prompt.
        // For simple chat, we can just prepend the system prompt to the first message or use it as context.
        // Here we'll prepend it to the history for context.

        const chat = model.startChat({
            history: history.slice(0, -1).map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            })),
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // Send the last message with the system prompt context if it's the first message, 
        // or just the last message. 
        // A better approach for system prompt in this SDK is often just to include it in the first user message.

        let lastMessageContent = history[history.length - 1].content;
        if (history.length === 1) {
            lastMessageContent = `${SYSTEM_PROMPT}\n\nUser: ${lastMessageContent}`;
        }

        const result = await chat.sendMessage(lastMessageContent);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Error getting chat completion:', error);
        return "I'm having trouble connecting right now. Please try again later.";
    }
};
