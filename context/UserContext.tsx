import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type HealthSensitivity = 'Low' | 'Medium' | 'High';

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  healthSensitivity: HealthSensitivity;
};

export type AlertPreferences = {
  threshold?: string;
  dailyAdvisory: boolean;
  pushNotifications: boolean;
  preferredScale: string;
};

type UserContextValue = {
  profile: UserProfile;
  sensitivityCategory: HealthSensitivity;
  updateProfile: (updates: Partial<UserProfile>) => void;
  alertPreferences: AlertPreferences;
  updateAlertPreferences: (updates: Partial<AlertPreferences>) => void;
  isUserHydrated: boolean;
};

const USER_PROFILE_STORAGE_KEY = 'airaware:userProfile';
const ALERT_PREFERENCES_STORAGE_KEY = 'airaware:alertPreferences';

const defaultUserProfile: UserProfile = {
  name: 'Aarav Mehta',
  email: 'aarav.mehta@example.com',
  phone: '+91 98765 43210',
  address: '221B Green Avenue, Indiranagar, Bengaluru',
  healthSensitivity: 'Medium',
};

const defaultAlertPreferences: AlertPreferences = {
  dailyAdvisory: true,
  pushNotifications: true,
  preferredScale: 'US AQI (0-500)',
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [alertPreferences, setAlertPreferences] = useState<AlertPreferences>(
    defaultAlertPreferences,
  );
  const [isUserHydrated, setIsUserHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    const hydrateUserState = async () => {
      try {
        const [[, profileValue], [, preferencesValue]] = await AsyncStorage.multiGet([
          USER_PROFILE_STORAGE_KEY,
          ALERT_PREFERENCES_STORAGE_KEY,
        ]);
        if (!active) return;
        if (profileValue) setProfile((current) => ({ ...current, ...JSON.parse(profileValue) }));
        if (preferencesValue) {
          setAlertPreferences((current) => ({ ...current, ...JSON.parse(preferencesValue) }));
        }
      } catch (error) {
        console.error('Unable to restore saved user preferences:', error);
      } finally {
        if (active) setIsUserHydrated(true);
      }
    };

    void hydrateUserState();
    return () => {
      active = false;
    };
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((currentProfile) => {
      const nextProfile = { ...currentProfile, ...updates };
      void AsyncStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
      return nextProfile;
    });
  }, []);

  const updateAlertPreferences = useCallback((updates: Partial<AlertPreferences>) => {
    setAlertPreferences((currentPreferences) => {
      const nextPreferences = { ...currentPreferences, ...updates };
      void AsyncStorage.setItem(ALERT_PREFERENCES_STORAGE_KEY, JSON.stringify(nextPreferences));
      return nextPreferences;
    });
  }, []);

  const value = useMemo(
    () => ({
      profile,
      sensitivityCategory: profile.healthSensitivity,
      updateProfile,
      alertPreferences,
      updateAlertPreferences,
      isUserHydrated,
    }),
    [alertPreferences, isUserHydrated, profile, updateAlertPreferences, updateProfile],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used inside UserProvider.');
  return context;
}
