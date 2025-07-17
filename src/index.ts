import dotenv from 'dotenv';
import { createHTTPServer, createMCPServer } from './server.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const APP_ID = process.env.SCHIPHOL_APP_ID;
const APP_KEY = process.env.SCHIPHOL_APP_KEY;

if (!APP_ID || !APP_KEY) {
    console.error('Error: SCHIPHOL_APP_ID and SCHIPHOL_APP_KEY must be set in environment variables');
    process.exit(1);
}

// Start HTTP server
const httpServer = createHTTPServer(APP_ID, APP_KEY);
httpServer.listen(PORT, () => {
    console.log(`HTTP Server running at http://${HOST}:${PORT}`);
    console.log(`SSE endpoint: http://${HOST}:${PORT}/sse`);
    console.log(`API endpoint: http://${HOST}:${PORT}/api/flights`);
    console.log(`MCP tools endpoint: http://${HOST}:${PORT}/mcp/tools`);
    console.log(`MCP tool call endpoint: http://${HOST}:${PORT}/mcp/tools/call`);
});