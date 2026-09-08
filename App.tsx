import 'react-native-gesture-handler';

import { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  type DrawerContentComponentProps,
  type DrawerNavigationProp,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';

import { LocationProvider, useLocation } from './context/LocationContext';
import { UserProvider } from './context/UserContext';
import { AQIDetailsNavigationProvider } from './navigation/AQIDetailsNavigationContext';
import type {
  DrawerPlaceholderRoute,
  MainDrawerParamList,
  MainTabParamList,
  RootStackParamList,
} from './navigation/types';
import AddFavoriteLocationScreen from './screens/AddFavoriteLocationScreen';
import AlertPreferencesScreen from './screens/AlertPreferencesScreen';
import AQIDetailsScreen from './screens/AQIDetailsScreen';
import AQITrendsScreen from './screens/AQITrendsScreen';
import CitySearchScreen from './screens/CitySearchScreen';
import DrawerPlaceholderScreen from './screens/DrawerPlaceholderScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import HomeScreen from './screens/HomeScreen';
import LocationsScreen from './screens/LocationsScreen';
import LoginScreen from './screens/LoginScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import SplashScreen from './screens/SplashScreen';
import { setLoggedIn, store, type AppDispatch } from './store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN_KEY, getValidAuthToken } from './auth';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<MainDrawerParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, string> = {
  Home: '🏠',
  CitySearch: '🔍',
  AQITrends: '📈',
  Locations: '📍',
  Profile: '👤',
};

const drawerScreens: ReadonlyArray<{
  name: DrawerPlaceholderRoute;
  title: string;
  icon: string;
}> = [
  { name: 'MyLocations', title: 'My Locations', icon: '📍' },
  { name: 'FavouriteAreas', title: 'Favourite Areas', icon: '⭐' },
  { name: 'HealthProfile', title: 'Health Profile', icon: '👤' },
  { name: 'HelpSupport', title: 'Help & Support', icon: '❓' },
];

type MainAppProps = NativeStackScreenProps<RootStackParamList, 'MainApp'>;

type AppDrawerContentProps = DrawerContentComponentProps & {
  onLogout: () => void;
};

function AppDrawerContent({ onLogout, ...props }: AppDrawerContentProps) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerBrand}>AirAware</Text>
        <Text style={styles.drawerSubtitle}>Know your air</Text>
      </View>

      <DrawerItemList {...props} />

      <View style={styles.drawerFooter}>
        <DrawerItem
          label="Logout"
          icon={() => <Text style={styles.drawerIcon}>↩</Text>}
          labelStyle={styles.drawerLabel}
          onPress={onLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

function MainTabs() {
  const { favoriteLocations } = useLocation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: styles.header,
        headerTintColor: '#12312D',
        headerTitleStyle: styles.headerTitle,
        tabBarActiveTintColor: '#267D70',
        tabBarInactiveTintColor: '#8EA09D',
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => (
          <Text style={[styles.tabIcon, focused && styles.activeNavIcon]}>
            {tabIcons[route.name]}
          </Text>
        ),
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Home',
          headerLeft: () => (
            <Pressable
              accessibilityLabel="Open navigation drawer"
              accessibilityRole="button"
              hitSlop={12}
              onPress={() =>
                navigation
                  .getParent<DrawerNavigationProp<MainDrawerParamList>>()
                  ?.openDrawer()
              }
              style={styles.headerIconButton}>
              <Text style={styles.headerIcon}>☰</Text>
            </Pressable>
          ),
        })}
      />
      <Tab.Screen
        name="CitySearch"
        component={CitySearchScreen}
        options={{ title: 'Search', tabBarLabel: 'Search' }}
      />
      <Tab.Screen
        name="AQITrends"
        component={AQITrendsScreen}
        options={{ title: 'Trends', tabBarLabel: 'Trends' }}
      />
      <Tab.Screen
        name="Locations"
        component={LocationsScreen}
        options={{
          tabBarBadge: favoriteLocations.length || undefined,
          tabBarBadgeStyle: styles.tabBadge,
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function MainApp({ navigation }: MainAppProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { setCurrentAQI } = useLocation();

  const openAQIDetails = useCallback(
    (params: RootStackParamList['AQIDetailsScreen']) => {
      setCurrentAQI(params);
      navigation.push('AQIDetailsScreen', params);
    },
    [navigation, setCurrentAQI],
  );

  const handleLogout = useCallback(async () => {
    dispatch(setLoggedIn(false));
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      Alert.alert('Logged Out', 'You have been securely logged out of AirAware.');
    } catch {
      Alert.alert('Logout Error', 'We could not clear the simulated authentication token.');
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  }, [dispatch, navigation]);

  return (
    <AQIDetailsNavigationProvider openAQIDetails={openAQIDetails}>
      <Drawer.Navigator
        initialRouteName="MainTabs"
        drawerContent={(props) => <AppDrawerContent {...props} onLogout={handleLogout} />}
        screenOptions={{
          drawerActiveBackgroundColor: '#EAF7F4',
          drawerActiveTintColor: '#267D70',
          drawerInactiveTintColor: '#5C706D',
          drawerLabelStyle: styles.drawerLabel,
          drawerStyle: styles.drawerPanel,
          headerStyle: styles.header,
          headerTintColor: '#12312D',
          headerTitleStyle: styles.headerTitle,
        }}>
        <Drawer.Screen
          name="MainTabs"
          component={MainTabs}
          options={{
            drawerItemStyle: styles.hiddenDrawerItem,
            headerShown: false,
            title: 'AirAware',
          }}
        />
        {drawerScreens.map((screen) => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            component={DrawerPlaceholderScreen}
            options={{
              drawerIcon: () => <Text style={styles.drawerIcon}>{screen.icon}</Text>,
              drawerLabel: screen.title,
              title: screen.title,
            }}
          />
        ))}
        <Drawer.Screen
          name="AlertSettings"
          component={AlertPreferencesScreen}
          options={{
            drawerIcon: () => <Text style={styles.drawerIcon}>🔔</Text>,
            drawerLabel: 'Alert Settings',
            title: 'Alert Settings',
          }}
        />
        <Drawer.Screen
          name="Feedback"
          component={FeedbackScreen}
          options={{
            drawerIcon: () => <Text style={styles.drawerIcon}>💬</Text>,
            drawerLabel: 'Feedback',
            title: 'Feedback',
          }}
        />
      </Drawer.Navigator>
    </AQIDetailsNavigationProvider>
  );
}

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);

  useEffect(() => {
    let mounted = true;
    const restoreAuthentication = async () => {
      try {
        const token = await getValidAuthToken();
        if (mounted) setHasValidToken(Boolean(token));
      } catch (error) {
        // Authentication is local-only, but a storage failure must not block launch.
        console.error('Unable to restore authentication state:', error);
      } finally {
        if (mounted) setAuthChecked(true);
      }
    };

    void restoreAuthentication();
    return () => {
      mounted = false;
    };
  }, []);

  if (!authChecked) {
    return <SplashScreen onFinish={() => undefined} />;
  }

  return (
    <GestureHandlerRootView style={styles.appRoot}>
      <ReduxProvider store={store}>
        <UserProvider>
          <LocationProvider>
            <NavigationContainer>
              <RootStack.Navigator
                initialRouteName={hasValidToken ? 'MainApp' : 'SplashScreen'}
                screenOptions={{
                  contentStyle: styles.stackContent,
                  headerStyle: styles.header,
                  headerTintColor: '#12312D',
                  headerTitleStyle: styles.headerTitle,
                }}>
                <RootStack.Screen name="SplashScreen" options={{ headerShown: false }}>
                  {({ navigation }) => (
                    <SplashScreen
                      onFinish={() => navigation.replace('OnboardingScreen')}
                    />
                  )}
                </RootStack.Screen>
                <RootStack.Screen
                  name="OnboardingScreen"
                  options={{ headerShown: false }}>
                  {({ navigation }) => (
                    <OnboardingScreen
                      onDone={() => navigation.replace('LoginScreen')}
                    />
                  )}
                </RootStack.Screen>
                <RootStack.Screen
                  name="LoginScreen"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
                <RootStack.Screen
                  name="RegistrationScreen"
                  component={RegistrationScreen}
                  options={{ title: 'Register' }}
                />
                <RootStack.Screen
                  name="MainApp"
                  component={MainApp}
                  options={{ headerShown: false }}
                />
                <RootStack.Screen
                  name="AQIDetailsScreen"
                  component={AQIDetailsScreen}
                  options={({ route }) => ({ title: route.params.locationName })}
                />
                <RootStack.Screen
                  name="AddFavoriteLocationScreen"
                  component={AddFavoriteLocationScreen}
                  options={{ title: 'Add Location' }}
                />
              </RootStack.Navigator>
            </NavigationContainer>
          </LocationProvider>
        </UserProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
  },
  stackContent: {
    backgroundColor: '#F8FBFA',
  },
  header: {
    backgroundColor: '#F8FBFA',
  },
  headerTitle: {
    color: '#12312D',
    fontSize: 18,
    fontWeight: '800',
  },
  headerIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    minHeight: 40,
    minWidth: 40,
  },
  headerIcon: {
    color: '#12312D',
    fontSize: 26,
    fontWeight: '800',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#D7E3E0',
    minHeight: 72,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.58,
  },
  activeNavIcon: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  tabBadge: {
    backgroundColor: '#D9473F',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  drawerPanel: {
    backgroundColor: '#F8FBFA',
  },
  drawerContent: {
    flexGrow: 1,
    paddingTop: 10,
  },
  drawerHeader: {
    borderBottomColor: '#D7E3E0',
    borderBottomWidth: 1,
    marginBottom: 8,
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  drawerBrand: {
    color: '#12312D',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  drawerSubtitle: {
    color: '#5C706D',
    fontSize: 14,
    fontWeight: '700',
  },
  drawerFooter: {
    borderTopColor: '#D7E3E0',
    borderTopWidth: 1,
    marginTop: 'auto',
    paddingTop: 8,
  },
  drawerIcon: {
    fontSize: 18,
    opacity: 0.9,
  },
  drawerLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  hiddenDrawerItem: {
    display: 'none',
  },
});
