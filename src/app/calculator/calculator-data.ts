import type { Offset } from '@/components/marketplace/token-card';
import type { BasicFormData } from '@/components/calculator/basic-calculator-form';

export const countryOptions = [
  { value: 'US', label: '🇺🇸 United States' },
  { value: 'CA', label: '🇨🇦 Canada' },
  { value: 'GB', label: '🇬🇧 United Kingdom' },
  { value: 'DE', label: '🇩🇪 Germany' },
  { value: 'FR', label: '🇫🇷 France' },
  { value: 'JP', label: '🇯🇵 Japan' },
  { value: 'AU', label: '🇦🇺 Australia' },
  { value: 'IN', label: '🇮🇳 India' },
  { value: 'BR', label: '🇧🇷 Brazil' },
  { value: 'ZA', label: '🇿🇦 South Africa' },
  { value: 'CN', label: '🇨🇳 China' },
  { value: 'RU', label: '🇷🇺 Russia' },
  { value: 'MX', label: '🇲🇽 Mexico' },
  { value: 'IT', label: '🇮🇹 Italy' },
  { value: 'ES', label: '🇪🇸 Spain' },
  { value: 'OTHER', label: '🏳️ Other' },
];

export const sdgAlignments = [
  { value: 'All', label: '🌐 All SDGs' },
  { value: 'Climate Action', label: '🌍 Climate Action' },
  { value: 'Life on Land', label: '🌳 Life on Land' },
  { value: 'Affordable and Clean Energy', label: '💡 Affordable and Clean Energy' },
  { value: 'Good Health and Well-being', label: '❤️ Good Health and Well-being' },
  { value: 'Life Below Water', label: '🐠 Life Below Water' },
  { value: 'Sustainable Cities and Communities', label: '🏙️ Sustainable Cities and Communities' },
  { value: 'Clean Water and Sanitation', label: '💧 Clean Water and Sanitation' },
  { value: 'No Poverty', label: '🫂 No Poverty' },
  { value: 'Zero Hunger', label: '🍎 Zero Hunger' },
  { value: 'Quality Education', label: '📚 Quality Education' },
  { value: 'Gender Equality', label: '⚖️ Gender Equality' },
  { value: 'Decent Work and Economic Growth', label: '📈 Decent Work and Economic Growth' },
  { value: 'Industry, Innovation and Infrastructure', label: '🏗️ Industry, Innovation and Infrastructure' },
  { value: 'Reduced Inequalities', label: '🤝 Reduced Inequalities' },
  { value: 'Responsible Consumption and Production', label: '♻️ Responsible Consumption and Production' },
  { value: 'Peace, Justice and Strong Institutions', label: '🕊️ Peace, Justice and Strong Institutions' },
  { value: 'Partnerships for the Goals', label: '🔗 Partnerships for the Goals' }
];

export const personaOptions = [
    { value: 'custom', label: '🧑‍💻 Custom / No Persona' },
    { value: 'digital_nomad', label: '👩‍💻 Digital Nomad' },
    { value: 'philanthropist', label: '🤵 Philanthropist' },
    { value: 'family_office', label: '🏡 Family Office' },
    { value: 'business_owner', label: '🏢 Business Owner' },
    { value: 'executive', label: '✈️ C-Suite Executive' },
];

export const personaBasicValues: Record<string, BasicFormData | undefined> = {
    custom: undefined,
    digital_nomad: {
      dietType: 'low_meat',
      homeSize: 500, // sqft, will be adjusted by component
      homeEnergyEfficiency: 'average',
      carDistance: 1000, // miles, will be adjusted by component
      carFuelEfficiency: 'average',
      shortFlights: 8,
      longFlights: 4,
      shoppingHabits: 'minimalist',
    },
    philanthropist: {
      dietType: 'pescatarian',
      homeSize: 4000,
      homeEnergyEfficiency: 'high',
      carDistance: 8000,
      carFuelEfficiency: 'high',
      shortFlights: 4,
      longFlights: 6,
      shoppingHabits: 'average',
    },
    family_office: {
        dietType: 'omnivore',
        homeSize: 5000,
        homeEnergyEfficiency: 'average',
        carDistance: 15000,
        carFuelEfficiency: 'low',
        shortFlights: 6,
        longFlights: 2,
        shoppingHabits: 'frequent',
    },
    business_owner: {
        dietType: 'omnivore',
        homeSize: 2500,
        homeEnergyEfficiency: 'average',
        carDistance: 20000,
        carFuelEfficiency: 'average',
        shortFlights: 10,
        longFlights: 2,
        shoppingHabits: 'average',
    },
    executive: {
        dietType: 'low_meat',
        homeSize: 3500,
        homeEnergyEfficiency: 'high',
        carDistance: 12000,
        carFuelEfficiency: 'high',
        shortFlights: 15,
        longFlights: 8,
        shoppingHabits: 'frequent',
    }
};

export const dynamicOffsetOptions: Offset[] = [
  {
    id: 'dynamic-cookstove-01',
    name: 'Efficient Cookstoves Uganda',
    projectDescription: 'Distributes fuel-efficient cookstoves to households in Uganda, reducing wood consumption and indoor air pollution. Ideal for offsetting tiny carbon footprints.',
    price: 9.20,
    units: '1 ton CO₂e',
    environmentalImpact: 'Reduced deforestation, improved health for women and children.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Community',
    esgRating: 'BBB',
    sdgAlignment: 'Good Health and Well-being',
    region: 'Uganda (Various Districts)',
    dataAiHint: 'cookstove uganda',
    projectSizeCategory: 'Tiny',
  },
  {
    id: 'dynamic-solar-small-01',
    name: 'Small Rooftop Solar Installation',
    projectDescription: 'Supports the installation of a small rooftop solar PV system, generating clean energy. Suitable for offsetting small carbon footprints.',
    price: 25.00,
    units: 'approx. 0.5 tons CO₂e',
    environmentalImpact: 'Reduces reliance on fossil fuels, promotes renewable energy adoption.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Renewable Energy',
    esgRating: 'A',
    sdgAlignment: 'Affordable and Clean Energy',
    region: 'Global (Distributed)',
    dataAiHint: 'rooftop solar',
    projectSizeCategory: 'Small',
  },
  {
    id: 'dynamic-solarpark-large-01',
    name: 'Gochang Solapark Power Plant',
    projectDescription: 'Contributes to a large-scale 14.98MW photovoltaic power plant. Best for offsetting large carbon footprints.',
    price: 50.00,
    units: '2 tons CO₂e',
    environmentalImpact: 'Large-scale renewable energy generation, grid decarbonization.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Renewable Energy',
    esgRating: 'AA',
    sdgAlignment: 'Affordable and Clean Energy',
    region: 'South Korea (Gochang)',
    dataAiHint: 'solar farm large',
    projectSizeCategory: 'Large',
  },
  {
    id: 'dynamic-dac-massive-01',
    name: 'Frontier Direct Air Capture',
    projectDescription: 'Contributes to a cutting-edge Direct Air Capture (DAC) facility, removing CO₂ directly from the atmosphere. Ideal for offsetting massive carbon footprints.',
    price: 150.00,
    units: '5 tons CO₂e',
    environmentalImpact: 'Atmospheric CO₂ removal, supports carbon capture innovation.',
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Technology',
    esgRating: 'A',
    sdgAlignment: 'Industry, Innovation and Infrastructure',
    region: 'Global (Pilot Locations)',
    dataAiHint: 'air capture facility',
    projectSizeCategory: 'Massive',
  }
];

export const initialSectionFootprintsState = {
  nutrition: 0,
  pets: 0,
  family: 0,
  property: 0,
  technology: 0,
  shopping: 0,
  travel: 0,
  industrial: 0,
  shipping: 0,
};

export const factors: Record<string, any> = {
  nutrition: {
    base: 100, // Base footprint for processing, transport, etc.
    vegan: 600, // kg CO2e per year
    vegetarian: 900,
    pescatarian: 1200,
    low_meat: 1500,
    omnivore: 1800,
    waste_low: 0.9,
    waste_medium: 1.0,
    waste_high: 1.1,
  },
  pets: {
    none: 0,
    dog: 770, // kg CO2e per year for a medium-sized dog
    cat: 330, // kg CO2e per year for a cat
    horse: 2500,
    tropical_fish: 50, // For a typical heated tank setup
    small_mammal: 40,
    bird: 25,
    reptile: 35,
  },
  family: {
    additional_member_factor: 1500,
  },
  property: {
    apartment_base: 1000,
    home_base: 2000,
    villa_base: 4000,
    island_property_base: 8000,
    sqft_factor: 1.5, // kg CO2e per sq ft per year
    room_factor: 100,
    energy_grid: 1.0,
    energy_solar: 0.2,
    energy_natural_gas: 0.8,
    energy_heating_oil: 1.2,
    energy_wood: 0.4,
    energy_none: 1.0,
    recycling_yes: 0.9,
    recycling_no: 1.0,
    recycling_sometimes: 0.95,
    hotel_room_base: 10, // Daily kg CO2e base
    hotel_star_1_multiplier: 0.7,
    hotel_star_2_multiplier: 0.85,
    hotel_star_3_multiplier: 1.0,
    hotel_star_4_multiplier: 1.3,
    hotel_star_5_multiplier: 1.7,
  },
  travel: {
    none: 0,
    car_gasoline: 0.2,
    car_diesel: 0.22,
    car_hybrid: 0.14,
    car_electric_grid_charged: 0.08,
    bike_motorcycle: 0.08,
    plane_short_haul: 120, // kg CO2e per hour
    plane_long_haul: 150, // kg CO2e per hour
    jet: 1500, // kg CO2e per hour (this is a simplified average)
    flightClassMultipliers: {
      economy: 1.0,
      premium_economy: 1.6,
      business: 2.9,
      first: 4.0,
    },
    hotel_base_night: 25,
    hotel_star_1_multiplier: 0.7,
    hotel_star_2_multiplier: 0.85,
    hotel_star_3_multiplier: 1.0,
    hotel_star_4_multiplier: 1.3,
    hotel_star_5_multiplier: 1.7,
    bus: 0.05,
    train_national: 0.03,
    train_local_metro: 0.02,
    tram: 0.02,
    ferry_foot_passenger: 0.1,
  },
  industrial: {
    none: 0,
    office_based: 500,
    retail: 1000,
    manufacturing_small: 5000,
    agriculture: 8000,
    tech_startup: 2000,
    other: 1500,
    data_center_kwh_factor: 0.5,
    data_center_server_factor: 250, // kg CO2e per server per year if kWh is unknown
    kwh_factor: 0.4, // Average kg CO2e per kWh for grid electricity
    employee_factor: 150, // kg CO2e per employee per year
    other_base: 1000,
    energy_grid_multiplier: 1.0,
    energy_solar_multiplier: 0.2,
    energy_natural_gas_multiplier: 0.8,
    energy_diesel_generators_multiplier: 1.2,
    energy_other_multiplier: 1.0,
    energy_none_multiplier: 1.0,
    city_small_multiplier: 0.9,
    city_medium_multiplier: 1.0,
    city_large_multiplier: 1.1,
  },
  technology: {
    computer_annual: 150,
    laptop_annual: 70,
    tablet_annual: 30,
    smartphone_annual: 20,
    router_annual: 15,
    internet_leisure_hourly: 0.03, // Streaming, gaming, etc.
    internet_work_hourly: 0.02, // General browsing, email, etc.
  },
  shopping: {
    base: 50,
    shoes: 18,
    pants: 25,
    tshirts: 7,
    shirts: 12,
    other_clothes: 15, // Average for items like jackets, dresses
  },
  shipping: {
    domestic_package: 0.5, // kg CO2e per package
    international_package: 2.5,
    speed_standard: 1.0,
    speed_express: 1.5,
    speed_eco: 0.8,
  }
};
