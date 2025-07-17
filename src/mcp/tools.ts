import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const schipholTools: Tool[] = [
    {
        name: 'get_flights',
        description: 'Retrieve flights from Schiphol Airport for a specific date',
        inputSchema: {
            type: 'object',
            properties: {
                scheduleDate: {
                    type: 'string',
                    description: 'Scheduled date to get flights for. Format: yyyy-MM-dd. Defaults to today if not provided'
                },
                scheduleTime: {
                    type: 'string',
                    description: 'Scheduled time to get flights from. Format: HH:mm'
                },
                flightName: {
                    type: 'string',
                    description: 'Flight number as printed on the ticket. This is a unique flight identifier.',
                    minLength: 5,
                    maxLength: 8
                },
                flightDirection: {
                    type: 'string',
                    description: 'Direction of the flight',
                    enum: ['A', 'D']
                },
                airline: {
                    type: 'string',
                    description: 'Prefix in flight number (e.g., KL). Can be 2-character (IATA) or 3-character (ICAO)',
                    minLength: 2,
                    maxLength: 3
                },
                airlineCode: {
                    type: 'integer',
                    description: 'NVLS code of an airliner'
                },
                route: {
                    type: 'string',
                    description: 'IATA or ICAO code of an airport in the route. For example, to find flights to or from London Heathrow, you would use the code \'LHR\'. Multiple values can be provided, separated by a comma.'
                },
                includeDelays: {
                    type: 'boolean',
                    description: 'Include flights from earlier dates that have delays shifting to queried date',
                    default: false
                },
                page: {
                    type: 'integer',
                    description: 'Page number',
                    minimum: 0,
                    maximum: 499,
                    default: 0
                },
                sort: {
                    type: 'string',
                    description: 'Sort order (e.g., "+scheduleTime", "-scheduleDate")',
                    default: '+scheduleTime'
                },
                fromDateTime: {
                    type: 'string',
                    description: 'From date of search period. Format: yyyy-MM-dd\'T\'HH:mm:ss'
                },
                toDateTime: {
                    type: 'string',
                    description: 'To date of search period (inclusive). Format: yyyy-MM-dd\'T\'HH:mm:ss'
                },
                searchDateTimeField: {
                    type: 'string',
                    description: 'Query by a specific DateTime field',
                    enum: [
                        'estimatedLandingTime',
                        'actualLandingTime',
                        'publicEstimatedOffBlockTime',
                        'actualOffBlockTime',
                        'expectedTimeBoarding',
                        'expectedTimeGateClosing',
                        'expectedTimeGateOpen',
                        'expectedTimeOnBelt',
                        'scheduleDateTime',
                        'lastUpdatedAt'
                    ]
                },
                fromScheduleDate: {
                    type: 'string',
                    description: 'Query by ScheduleDate range start. Format: yyyy-MM-dd'
                },
                toScheduleDate: {
                    type: 'string',
                    description: 'Query by ScheduleDate range end. Format: yyyy-MM-dd'
                },
                isOperationalFlight: {
                    type: 'boolean',
                    description: 'Query operational (true) or non-operational (false) flights'
                }
            }
        }
    }
];
