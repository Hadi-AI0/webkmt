/**
 * Gemini API Proxy
 * Secure server-side proxy for Gemini AI API calls
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class GeminiProxy {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent';
        
        if (!this.apiKey) {
            console.warn('⚠️ Gemini API key not found in environment variables');
        }
    }

    async generateContent(prompt, options = {}) {
        if (!this.apiKey) {
            throw new Error('Gemini API key not configured');
        }

        try {
            const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: options.temperature || 0.7,
                        topK: options.topK || 40,
                        topP: options.topP || 0.95,
                        maxOutputTokens: options.maxTokens || 1024,
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0) {
                const content = data.candidates[0].content;
                if (content && content.parts && content.parts.length > 0) {
                    return {
                        success: true,
                        text: content.parts[0].text,
                        finishReason: data.candidates[0].finishReason
                    };
                }
            }

            throw new Error('No content generated');

        } catch (error) {
            console.error('Gemini API error:', error);
            throw error;
        }
    }
}

// API endpoint handler
async function handleGeminiRequest(req, res) {
    try {
        const { prompt, options = {} } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: 'Prompt is required'
            });
        }

        // Validate prompt length
        if (prompt.length > 10000) {
            return res.status(400).json({
                success: false,
                error: 'Prompt is too long (max 10,000 characters)'
            });
        }

        const geminiProxy = new GeminiProxy();
        const result = await geminiProxy.generateContent(prompt, options);

        res.json(result);

    } catch (error) {
        console.error('Gemini Proxy Error:', error);
        
        // Don't expose internal error details to client
        const clientError = error.message.includes('API key') 
            ? 'AI service temporarily unavailable'
            : 'Failed to generate response';
            
        res.status(500).json({
            success: false,
            error: clientError
        });
    }
}

module.exports = {
    GeminiProxy,
    handleGeminiRequest
};