import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import axios from 'axios';
import { schipholTools } from './mcp/tools.js';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3000';

if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY must be set in environment variables');
    process.exit(1);
}

const genAI = new GoogleGenAI({
    apiKey: GEMINI_API_KEY
});

const tools = schipholTools.map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: {
        ...tool.inputSchema,
        type: Type.OBJECT,
        properties: tool.inputSchema.properties as Record<string, import('@google/genai').Schema> | undefined
    }
}));

async function callMCPTool(toolName: string, args: any) {
    try {
        const response = await axios.post(`${MCP_SERVER_URL}/mcp/tools/call`, {
            tool: toolName,
            arguments: args
        });
        return response.data;
    } catch (error) {
        console.error('Error calling MCP tool:', error);
        throw error;
    }
}

async function testGeminiWithMCP() {
    const today = getTodayDate();
    const tomorrow = getTomorrowDate();

    // Test prompts
    const prompts = [
        `What KLM flights are departing from Schiphol on ${today}?`,
        `Show me all arriving flights at Schiphol airport for ${tomorrow}`,
        `Is flight KL1234 on time on ${today}?`,
        `What flights are arriving from London Gatwick airport today, ${today}?`
    ];

    for (const prompt of prompts) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`PROMPT: ${prompt}`);
        console.log('='.repeat(80));

        const contents = [
            {
                role: 'user',
                parts: [{
                    text: prompt,
                }]
            }
        ]

        const config = {
            tools: [{
                functionDeclarations: tools
            }]
        }

        try {
            const response = await genAI.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents,
                config: config                
            });

            if (!response.functionCalls || response.functionCalls.length === 0) {
                console.log('💬 Model response (no tool calls):');
                console.log(response.text);
                continue;
            }

            console.log('\n🔧 Model requested tool calls:');

            for (const toolCall of response.functionCalls) {
                if (!toolCall.name) {
                    console.log('❌ No function name provided in the call');
                    continue;
                }

                console.log(`\n📞 Calling function: ${toolCall.name}`);
                console.log('Parameters:', JSON.stringify(toolCall.args, null, 2));

                const toolResult = await callMCPTool(toolCall.name, toolCall.args);

                if (!toolResult.success || !toolResult.result || !toolResult.result.flights) {
                    console.log('❌ No flights found or error occurred');
                    continue;
                }

                console.log(`\n✈️  Found ${toolResult.result.flights.length} flights\n`);
                const flightInfo = toolResult.result.flights;
                console.log(`Flight info: ${JSON.stringify(flightInfo, null, 2)}`);

                const toolResponse = {
                    name: toolCall.name,
                    response: { flightInfo },
                }

                if (response.candidates && response.candidates[0] && response.candidates[0].content) {
                    contents.push(response.candidates[0].content as { role: string; parts: { text: string; }[]; });
                }
                contents.push({
                    role: 'user',
                    parts: [{ functionResponse: toolResponse} as any]
                })

                // Get final response from model with tool results
                const finalResult = await genAI.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: contents,
                    config: config
                });

                console.log('\n💬 Model\'s final response:');
                if (finalResult.text) {
                    console.log(finalResult.text);
                } else {
                    console.log('No text response from model.');
                }
            }
        } catch (error) {
            console.error('❌ Error:', error);
        }
    }
}

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Helper function to get tomorrow's date in YYYY-MM-DD format
function getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

// Run the test
async function main() {
    console.log('🚀 Starting Gemini + MCP Schiphol Flights Test');
    console.log(`📅 Today's date: ${getTodayDate()}`);
    console.log(`📅 Tomorrow's date: ${getTomorrowDate()}`);

    try {
        await testGeminiWithMCP();
        console.log('\n✅ Test completed successfully');
    } catch (error) {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    }
}

main();

