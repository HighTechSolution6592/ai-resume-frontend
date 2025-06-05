export interface Country {
  name: string;
  code: string;
  cities: string[];
}

export const countries: Country[] = [
  {
    name: "United States",
    code: "US",
    cities: [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San Jose",
      "Austin",
      "San Francisco",
      "Seattle",
      "Denver",
      "Boston",
      "Miami",
      "Atlanta",
      "Portland",
      "Washington DC",
      "Las Vegas"
    ]
  },
  {
    name: "United Kingdom",
    code: "GB",
    cities: [
      "London",
      "Manchester",
      "Birmingham",
      "Leeds",
      "Glasgow",
      "Liverpool",
      "Newcastle",
      "Nottingham",
      "Sheffield",
      "Bristol",
      "Belfast",
      "Leicester",
      "Edinburgh",
      "Cambridge",
      "Oxford",
      "Cardiff",
      "Brighton",
      "Southampton",
      "Portsmouth",
      "Aberdeen"
    ]
  },
  {
    name: "Canada",
    code: "CA",
    cities: [
      "Toronto",
      "Montreal",
      "Vancouver",
      "Calgary",
      "Edmonton",
      "Ottawa",
      "Quebec City",
      "Winnipeg",
      "Hamilton",
      "Halifax",
      "Victoria",
      "London",
      "Saskatoon",
      "Regina",
      "St. John's",
      "Kelowna",
      "Kingston",
      "Windsor",
      "Mississauga",
      "Burnaby"
    ]
  },
  {
    name: "Australia",
    code: "AU",
    cities: [
      "Sydney",
      "Melbourne",
      "Brisbane",
      "Perth",
      "Adelaide",
      "Gold Coast",
      "Canberra",
      "Newcastle",
      "Wollongong",
      "Logan City",
      "Hobart",
      "Geelong",
      "Townsville",
      "Cairns",
      "Darwin",
      "Toowoomba",
      "Ballarat",
      "Bendigo",
      "Albury",
      "Mackay"
    ]
  }
];

export const findCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const formatLocation = (city: string, countryCode: string): string => {
  const country = findCountryByCode(countryCode);
  return country ? `${city}, ${country.name}` : city;
};