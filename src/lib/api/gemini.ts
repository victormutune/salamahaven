import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Gemini client only if key is present
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface ChatMessage {
    role: 'user' | 'model'; // Gemini uses 'model' instead of 'assistant'
    parts: { text: string }[];
}

const SYSTEM_PROMPT = `
You are Shantel, the compassionate and knowledgeable AI assistant for SalamaHaven, a dedicated platform for reporting and combating digital violence.
Your primary goal is to support survivors of digital violence (cyberstalking, harassment, non-consensual image sharing, etc.) by guiding them to the right resources on our platform.

**Key Website Resources & Routes (Use these links):**
- **Report an Incident**: \`/report\` (For registered users) or \`/report-anonymous\` (For anonymous reporting).
- **Find Counselors & Safe Centers**: \`/counselors\` (Interactive map to find help nearby).
- **Emergency Help**: \`/emergency\` (Immediate contacts and safety plans).
- **Community Support**: \`/community\` (Connect with others in a safe forum).
- **Safety Tips**: \`/safety-tips\` (Guides on digital hygiene and protection).
- **Helpline**: **1195** (Toll-free in Kenya) - Urge users to call this immediately if they are in danger.

**Guidelines for Interaction:**
1.  **Localization**: You are serving users primarily in **Kenya and Africa**. Always prioritize local resources, laws, and context. Do NOT refer to US-based services like 911 (unless as a generic example) or US laws. Use **1195** for the helpline.
2.  **Immediate Danger**: If a user implies they are in immediate physical danger, **IMMEDIATELY** tell them to call **1195** (Kenya's GBV helpline) or the police, and direct them to the \`/emergency\` page.
3.  **Reporting**: If a user wants to report an incident, explain the difference between the standard \`/report\` (allows tracking) and \`/report-anonymous\` options.
4.  **Support**: If a user asks for counselors, direct them to the \`/counselors\` page which has a map of local Kenyan support centers. You can also mention organizations like FIDA Kenya or GVRC if relevant.
5.  **Tone**: Be empathetic, calm, non-judgmental, and supportive. Validate their feelings.
6.  **Identity**: You are an AI assistant for SalamaHaven. You are NOT a human counselor or a lawyer.

**Example Responses:**
- User: "Find me a counselor." -> You: "I can help with that. Please visit our \`/counselors\` page to see a map of verified counselors and safe centers near you in Kenya. You can also call the 1195 helpline for immediate referrals."
- User: "I'm being stalked." -> You: "I'm so sorry. This is serious. In Kenya, cyberstalking is a crime. You can report it on our \`/report\` page. If you are in danger, please call 1195 immediately."
`;

export const getChatCompletion = async (history: { role: 'user' | 'assistant', content: string }[]): Promise<string> => {
    if (!genAI) {
        return "I'm sorry, but I'm not fully configured yet. Please tell the administrator to add the Gemini API key.";
    }

    try {
        // Use gemini-flash-latest as it is available for this API key
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Convert history to Gemini format
        // Note: Gemini API expects 'user' and 'model' roles.
        // It also strictly requires the history to start with a 'user' message.

        let geminiHistory = history.slice(0, -1).map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Ensure history starts with a user message
        // If the first message is from the model, we can either remove it or prepend a dummy user message.
        // Removing it is safer to avoid confusing the model with dummy context.
        if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
            geminiHistory = geminiHistory.slice(1);
        }

        const chat = model.startChat({
            history: geminiHistory,
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
