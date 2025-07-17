export interface FlightQueryParams {
  scheduleDate?: string;
  scheduleTime?: string;
  flightName?: string;
  flightDirection?: 'A' | 'D';
  airline?: string;
  airlineCode?: number;
  route?: string;
  includeDelays?: boolean;
  page?: number;
  sort?: string;
  fromDateTime?: string;
  toDateTime?: string;
  searchDateTimeField?: string;
  fromScheduleDate?: string;
  toScheduleDate?: string;
  isOperationalFlight?: boolean;
}

export interface Flight {
  lastUpdatedAt?: string;
  actualLandingTime?: string;
  actualOffBlockTime?: string;
  aircraftRegistration?: string;
  aircraftType?: {
    iataMain?: string;
    iataSub?: string;
  };
  baggageClaim?: {
    belts?: string[];
  };
  checkinAllocations?: {
    checkinAllocations?: Array<{
      endTime?: string;
      rows?: {
        rows?: Array<{
          position?: string;
          desks?: {
            desks?: Array<{
              checkinClass?: {
                code?: string;
                description?: string;
              };
              position?: number;
            }>;
          };
        }>;
      };
      startTime?: string;
    }>;
    remarks?: {
      remarks?: string[];
    };
  };
  codeshares?: {
    codeshares?: string[];
  };
  estimatedLandingTime?: string;
  expectedTimeBoarding?: string;
  expectedTimeGateClosing?: string;
  expectedTimeGateOpen?: string;
  expectedTimeOnBelt?: string;
  expectedSecurityFilter?: string;
  flightDirection?: 'A' | 'D';
  flightName?: string;
  flightNumber?: number;
  gate?: string;
  pier?: string;
  id?: string;
  isOperationalFlight?: boolean;
  mainFlight?: string;
  prefixIATA?: string;
  prefixICAO?: string;
  airlineCode?: number;
  publicEstimatedOffBlockTime?: string;
  publicFlightState?: {
    flightStates?: string[];
  };
  route?: {
    destinations?: string[];
    eu?: string;
    visa?: boolean;
  };
  scheduleDateTime?: string;
  scheduleDate?: string;
  scheduleTime?: string;
  serviceType?: string;
  terminal?: number;
  transferPositions?: {
    transferPositions?: number[];
  };
  schemaVersion?: string;
}

export interface FlightList {
  flights?: Flight[];
}

