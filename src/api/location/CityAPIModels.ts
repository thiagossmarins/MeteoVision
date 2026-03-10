export type NominatimResponse = {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
};

export type LocationInfo = {
  city: string;
  state: string;
  country: string;
};

export type CitySearchResult = {
  displayName: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
};