import express from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { SSEWriter } from './utils/sse.js';
import { getFlights } from './handlers/flights.js';
import { schipholTools } from './mcp/tools.js';
import { FlightQueryParams } from './types/schiphol.js';

export function createMCPServer(appId: string, appKey: string) {
    const server = new Server(
        {
            name: 'schiphol-flights',
            version: '1.0.0',
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    // Register tools
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: schipholTools,
    }));

    // Handle tool calls
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;

        if (name === 'get_flights') {
            try {
                const flights = await getFlights(args as FlightQueryParams, appId, appKey);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(flights, null, 2),
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error fetching flights: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        },
                    ],
                    isError: true,
                };
            }
        }

        throw new Error(`Unknown tool: ${name}`);
    });

    return server;
}

export function createHTTPServer(appId: string, appKey: string) {
    const app = express();
    app.use(express.json());

    // SSE endpoint for MCP communication
    app.get('/sse', (req, res) => {
        const sse = new SSEWriter(res);

        // Send initial connection event
        sse.write('connected', { message: 'Connected to Schiphol MCP Server' });

        // Keep connection alive
        const keepAlive = setInterval(() => {
            sse.write('ping', { timestamp: new Date().toISOString() });
        }, 30000);

        req.on('close', () => {
            clearInterval(keepAlive);
        });
    });

    // Direct API endpoint for testing
    app.get('/api/flights', async (req, res) => {
        try {
            const params: FlightQueryParams = {
                scheduleDate: req.query.scheduleDate as string,
                scheduleTime: req.query.scheduleTime as string,
                flightName: req.query.flightName as string,
                flightDirection: req.query.flightDirection as 'A' | 'D',
                airline: req.query.airline as string,
                airlineCode: req.query.airlineCode ? parseInt(req.query.airlineCode as string) : undefined,
                route: req.query.route as string,
                includeDelays: req.query.includeDelays === 'true',
                page: req.query.page ? parseInt(req.query.page as string) : undefined,
                sort: req.query.sort as string,
                fromDateTime: req.query.fromDateTime as string,
                toDateTime: req.query.toDateTime as string,
                searchDateTimeField: req.query.searchDateTimeField as string,
                fromScheduleDate: req.query.fromScheduleDate as string,
                toScheduleDate: req.query.toScheduleDate as string,
                isOperationalFlight: req.query.isOperationalFlight === 'true',
            };

            const flights = await getFlights(params, appId, appKey);
            res.json(flights);
        } catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });

    // MCP tool execution via HTTP
    app.post('/mcp/tools/call', async (req, res) => {
        const { tool, arguments: args } = req.body;

        if (tool === 'get_flights') {
            try {
                console.log('Calling get_flights with args:', args);
                const flights = await getFlights(args as FlightQueryParams, appId, appKey);
                res.json({
                    success: true,
                    result: flights
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        } else {
            res.status(404).json({
                success: false,
                error: `Unknown tool: ${tool}`
            });
        }
    });

    // List available tools
    app.get('/mcp/tools', (req, res) => {
        res.json({
            tools: schipholTools
        });
    });

    return app;
}
