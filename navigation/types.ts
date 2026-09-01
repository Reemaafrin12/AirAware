import type { NavigatorScreenParams } from '@react-navigation/native';

import type { AQIReading } from '../types/airQuality';

/**
 * `alreadyFetched` is set by CitySearch after a successful live request so the
 * detail screen can display that exact result without making a second request.
 */
export type AQIDetailsParams = AQIReading & {
  alreadyFetched?: boolean;
};

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
