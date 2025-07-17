# ✈️ Schipol Flights MCP

MCP Server for [Schipol Flights API](https://www.schiphol.nl/nl/developer-center/our-flight-api-explored/)

## 🤔 What is MCP?

MCP stands for Model-Context Protocol. It is a protocol that allows developers to expose APIs as tools for large language models. In this project, MCP is used to expose the Schiphol Flights API as a tool that can be used by Google's Gemini model. The MCP server is exposed as an HTTP server.

The `src/mcp/tools.ts` file defines the `get_flights` tool, which allows the model to retrieve flight information from the Schiphol Airport API. The `src/gemini-test.ts` file contains an example of how to use this tool with the Gemini model.

Gemini is used as an example to showcase how MCP works. It can be easily replaced by models from other providers.

## ❓ Answering Questions with the `get_flights` Tool

The `get_flights` tool allows an LLM to answer a variety of questions about flights at Schiphol Airport. By using the parameters defined in `src/mcp/tools.ts`, the model can retrieve specific and detailed flight information.

Here are some examples of questions that can be answered:

*   **General flight information:**
    *   "What are the flights arriving at Schiphol on ${date}?"
    *   "What are the departure times for flights to New York (JFK) on ${date}?"
*   **Specific flight status:**
    *   "Is flight KL0897 on time ${today}?"
    *   "What is the status of flight BA430 ${today}?"
*   **Route-based queries:**
    *   "Which flights are going to London Heathrow (LHR) ${tomorrow}?"
    *   "Are there any flights from Paris (CDG) ${today} afternoon?"
*   **Airline-specific information:**
    *   "Find all flights for KLM (KL) on ${date}."
    *   "What are the EasyJet flights departing ${tomorrow} evening?"
*   **Time-based searches:**
    *   "What are the flights between 10:00 and 12:00 on ${date}?"
    *   "Show me all arrivals in the next 2 hours for ${today}."
*   **Delayed flights:**
    *   "Are there any delayed flights from ${date}$?"

These examples demonstrate the tool's ability to handle queries about flight schedules, statuses, routes, airlines, and time-based events. Note that the model needs specific dates to successfully use the tool. If a date is not given, the model replies with asking for a date.

## ⚙️ Installation

```bash
npm install
```

## 💻 Compiling

To compile the TypeScript code, run the following command:

```bash
npm run build
```

This will create a `dist` directory with the compiled JavaScript files.

## 🚀 Usage

To start the server, run:

```bash
npm start
```

To run the server in development mode, run:

```bash
npm run dev
```

## 🧪 Testing

To run the Gemini test script, use the following command:

```bash
npm run test:gemini
```
This will execute the `src/gemini-test.ts` file.