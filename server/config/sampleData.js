const locations = [
  { id: 'bengaluru', name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946 },
  { id: 'chennai', name: 'Chennai', latitude: 13.0827, longitude: 80.2707 },
  { id: 'delhi', name: 'Delhi', latitude: 28.6139, longitude: 77.209 },
  { id: 'hyderabad', name: 'Hyderabad', latitude: 17.385, longitude: 78.4867 },
  { id: 'kolkata', name: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
  { id: 'mumbai', name: 'Mumbai', latitude: 19.076, longitude: 72.8777 },
  { id: 'pune', name: 'Pune', latitude: 18.5204, longitude: 73.8567 },
  { id: 'ahmedabad', name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
];

const aqiReadings = [
  { locationId: 'bengaluru', aqi: 72, category: 'Moderate', measuredAt: '2026-09-08T08:30:00.000Z' },
  { locationId: 'chennai', aqi: 48, category: 'Good', measuredAt: '2026-09-08T08:30:00.000Z' },
  { locationId: 'delhi', aqi: 178, category: 'Unhealthy', measuredAt: '2026-09-08T08:30:00.000Z' },
  { locationId: 'hyderabad', aqi: 84, category: 'Moderate', measuredAt: '2026-09-08T08:30:00.000Z' },
  { locationId: 'kolkata', aqi: 112, category: 'Unhealthy', measuredAt: '2026-09-08T08:30:00.000Z' },
  { locationId: 'mumbai', aqi: 58, category: 'Moderate', measuredAt: '2026-09-08T08:30:00.000Z' },
  { locationId: 'pune', aqi: 43, category: 'Good', measuredAt: '2026-09-08T08:30:00.000Z' },
  { locationId: 'ahmedabad', aqi: 96, category: 'Moderate', measuredAt: '2026-09-08T08:30:00.000Z' },
];

const healthAdvisories = {
  Good: [
    'Enjoy normal outdoor activities.',
    'Open windows for fresh indoor air when comfortable.',
    'Maintain regular exercise and hydration routines.',
  ],
  Moderate: [
    'Most people can continue normal outdoor activities.',
    'Sensitive individuals should reduce prolonged heavy exertion outdoors.',
    'Consider checking the AQI again before extended outdoor exercise.',
  ],
  Unhealthy: [
    'Limit prolonged or heavy outdoor exertion.',
    'Children, older adults, and people with heart or lung conditions should stay indoors when possible.',
    'Keep windows closed and use clean indoor air where available.',
    'Wear a well-fitted particulate mask if outdoor travel is necessary.',
  ],
};

const userProfiles = [
  {
    id: 'user-1',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    healthSensitivity: 'Medium',
    preferredLocationId: 'bengaluru',
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    healthSensitivity: 'High',
    preferredLocationId: 'delhi',
  },
];

module.exports = { aqiReadings, healthAdvisories, locations, userProfiles };
