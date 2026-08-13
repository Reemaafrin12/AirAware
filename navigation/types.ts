import type { NavigatorScreenParams } from '@react-navigation/native';

import type { AQIReading } from '../types/airQuality';

export type AQIDetailsParams = AQIReading;

export type MainTabParamList = {
  Home: undefined;
  CitySearch: undefined;
  AQITrends: undefined;
  Locations: undefined;
  Profile: undefined;
};

export type DrawerPlaceholderRoute =
  | 'MyLocations'
  | 'FavouriteAreas'
  | 'HealthProfile'
  | 'HelpSupport';

export type MainDrawerParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  MyLocations: undefined;
  FavouriteAreas: undefined;
  HealthProfile: undefined;
  AlertSettings: undefined;
  HelpSupport: undefined;
  Feedback: undefined;
};

export type RootStackParamList = {
  SplashScreen: undefined;
  OnboardingScreen: undefined;
  LoginScreen: undefined;
  RegistrationScreen: undefined;
  MainApp: NavigatorScreenParams<MainDrawerParamList> | undefined;
  AQIDetailsScreen: AQIDetailsParams;
  AddFavoriteLocationScreen: undefined;
};
