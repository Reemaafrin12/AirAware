import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type HealthSensitivity = 'Low' | 'Medium' | 'High';

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  healthSensitivity: HealthSensitivity;
};

type UserContextValue = {
  profile: UserProfile;
  sensitivityCategory: HealthSensitivity;
  updateProfile: (updates: Partial<UserProfile>) => void;
};

const defaultUserProfile: UserProfile = {
  name: 'Aarav Mehta',
  email: 'aarav.mehta@example.com',
  phone: '+91 98765 43210',
  address: '221B Green Avenue, Indiranagar, Bengaluru',
  healthSensitivity: 'Medium',
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      ...updates,
    }));
  }, []);

  const value = useMemo(
    () => ({
      profile,
      sensitivityCategory: profile.healthSensitivity,
      updateProfile,
    }),
    [profile, updateProfile],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used inside UserProvider.');
  }

  return context;
}
