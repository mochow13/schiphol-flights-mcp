
# Schipol Flights MCP

MCP Server for [Schipol Flights API](https://www.schiphol.nl/nl/developer-center/our-flight-api-explored/)

## What is MCP?

MCP stands for Model-Context Protocol. It is a protocol that allows developers to expose APIs as tools for large language models. In this project, MCP is used to expose the Schiphol Flights API as a tool that can be used by Google's Gemini model. The MCP server is exposed as an HTTP server.

The `src/mcp/tools.ts` file defines the `get_flights` tool, which allows the model to retrieve flight information from the Schiphol Airport API. The `src/gemini-test.ts` file contains an example of how to use this tool with the Gemini model.

Gemini is used as an example to showcase how MCP works. It can be easily replaced by models from other providers.

## Installation

```bash
npm install
```

## Compiling

To compile the TypeScript code, run the following command:

```bash
npm run build
```

This will create a `dist` directory with the compiled JavaScript files.

## Usage

To start the server, run:

```bash
npm start
```

To run the server in development mode, run:

```bash
npm run dev
```

## Testing

To run the Gemini test script, use the following command:

```bash
npm run test:gemini
```
This will execute the `src/gemini-test.ts` file.