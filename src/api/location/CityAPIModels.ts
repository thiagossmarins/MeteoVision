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