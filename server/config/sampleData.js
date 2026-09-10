const locations = [
  { id: 'bengaluru', name: 'Bengaluru', city: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { id: 'chennai', name: 'Chennai', city: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { id: 'delhi', name: 'Delhi', city: 'Delhi', lat: 28.6139, lng: 77.209 },
  { id: 'hyderabad', name: 'Hyderabad', city: 'Hyderabad', lat: 17.385, lng: 78.4867 },
  { id: 'kolkata', name: 'Kolkata', city: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { id: 'mumbai', name: 'Mumbai', city: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { id: 'pune', name: 'Pune', city: 'Pune', lat: 18.5204, lng: 73.8567 },
  { id: 'ahmedabad', name: 'Ahmedabad', city: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
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
    phone: '+91 98765 43210',
    address: '221B Green Avenue, Indiranagar, Bengaluru',
    healthSensitivity: 'Medium',
    preferredLocationId: 'bengaluru',
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43211',
    address: '42 Lake Road, Kolkata',
    healthSensitivity: 'High',
    preferredLocationId: 'delhi',
  },
];

const alertPreferences = {
  threshold: 100,
  dailyAdvisory: true,
  pushNotifications: true,
  units: 'US AQI (0-500)',
};

module.exports = {
  alertPreferences,
  aqiReadings,
  healthAdvisories,
  locations,
  userProfiles,
};
