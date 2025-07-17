import axios from 'axios';
import { FlightQueryParams, FlightList } from '../types/schiphol';

const SCHIPHOL_API_BASE = 'https://api.schiphol.nl/public-flights';

export async function getFlights(
    params: FlightQueryParams,
    appId: string,
    appKey: string
): Promise<FlightList> {
    try {
        // Build query parameters
        const queryParams = new URLSearchParams();

        if (params.scheduleDate) queryParams.append('scheduleDate', params.scheduleDate);
        if (params.scheduleTime) queryParams.append('scheduleTime', params.scheduleTime);
        if (params.flightName) queryParams.append('flightName', params.flightName);
        if (params.flightDirection) queryParams.append('flightDirection', params.flightDirection);
        if (params.airline) queryParams.append('airline', params.airline);
        if (params.airlineCode) queryParams.append('airlineCode', params.airlineCode.toString());
        if (params.route) queryParams.append('route', params.route);
        if (params.includeDelays !== undefined) queryParams.append('includedelays', params.includeDelays.toString());
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.fromDateTime) queryParams.append('fromDateTime', params.fromDateTime);
        if (params.toDateTime) queryParams.append('toDateTime', params.toDateTime);
        if (params.searchDateTimeField) queryParams.append('searchDateTimeField', params.searchDateTimeField);
        if (params.fromScheduleDate) queryParams.append('fromScheduleDate', params.fromScheduleDate);
        if (params.toScheduleDate) queryParams.append('toScheduleDate', params.toScheduleDate);
        if (params.isOperationalFlight !== undefined) queryParams.append('isOperationalFlight', params.isOperationalFlight.toString());

        const response = await axios.get(`${SCHIPHOL_API_BASE}/flights`, {
            params: queryParams,
            headers: {
                'Accept': 'application/json',
                'ResourceVersion': 'v4',
                'app_id': appId,
                'app_key': appKey
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Schiphol API error: ${error.response?.status} - ${error.response?.statusText}`);
        }
        throw error;
    }
}
