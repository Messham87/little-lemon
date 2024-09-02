import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-community/async-storage';
import Home from './screens/Home';
import Onboarding from './screens/Onboarding';
import SplashScreen from './screens/SplashScreen';
import Profile from './screens/Profile';
import { AuthContext, DataContext } from './utils/context';

const Stack = createNativeStackNavigator();

function App() {
  const initialLoginState = {
    isLoading: true,
    userName: null,
    email: null,
    userToken: null,
    surName: null,
    phoneNumber: null,
    notOrderStatus: null,
    notPasswordChanges: null,
    notOffers: null,
    notNewsletter: null,
    profileImage: null,
    reRenderApp: false,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userName: action.userName,
          email: action.email,
          userToken: action.token,
          profileImage: action.profileImage,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.userName,
          email: action.email,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          isLoading: true,
          userName: null,
          email: null,
          userToken: null,
          surName: null,
          phoneNumber: null,
          notOrderStatus: null,
          notPasswordChanges: null,
          notOffers: null,
          notNewsletter: null,
          profileImage: null,
        };
      case 'PROFILE':
        return {
          ...prevState,
          userName: action.userName,
          email: action.email,
          surName: action.surname,
          phoneNumber: action.phoneNumber,
          notOrderStatus: action.notOrderStatus,
          notPasswordChanges: action.notPasswordChanges,
          notOffers: action.notOffers,
          notNewsletter: action.notNewsletter,
          isLoading: false,
          reRenderApp: true,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (userName, email, checkUsername, checkEmail, reRenderApp) => {
        let userToken;
        userToken = null;
        if (checkUsername && checkEmail) {
          try {
            userToken = 'abcd';
            await AsyncStorage.setItem('userToken', userToken);
            await AsyncStorage.setItem('userName', userName);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem(
            'reRenderApp',
            JSON.stringify(reRenderApp))
          } catch (e) {
            console.log(e);
          }
        }
        dispatch({
          type: 'LOGIN',
          userName: userName,
          email: email,
          token: userToken,
        });
      },
      saveProfile: async (
        userName,
        email,
        surName,
        phoneNumber,
        notOrderStatus,
        notPasswordChanges,
        notOffers,
        notNewsletter,
        profileImage,
        reRenderApp
      ) => {
        try {
          await AsyncStorage.setItem('userName', userName);
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('surName', surName);
          await AsyncStorage.setItem('phoneNumber', phoneNumber);
          await AsyncStorage.setItem(
            'notOrderStatus',
            JSON.stringify(notOrderStatus)
          );
          await AsyncStorage.setItem(
            'notPasswordChanges',
            JSON.stringify(notPasswordChanges)
          );
          await AsyncStorage.setItem('notOffers', JSON.stringify(notOffers));
          await AsyncStorage.setItem(
            'notNewsletter',
            JSON.stringify(notNewsletter)
          );
          await AsyncStorage.setItem(
            'profileImage',
            JSON.stringify(profileImage)
          );
          await AsyncStorage.setItem(
            'reRenderApp',
            JSON.stringify(reRenderApp)
          );
        } catch (e) {
          console.log(e);
        }
        dispatch({
          type: 'PROFILE',
          userName: userName,
          email: email,
          surName: surName,
          phoneNumber: phoneNumber,
          notOrderStatus: notOrderStatus,
          notPasswordChanges: notPasswordChanges,
          notOffers: notOffers,
          notNewsletter: notNewsletter,
          profileImage: profileImage,
          reRenderApp: reRenderApp,
        });
      },
      signOut: async () => {
        try {
          await AsyncStorage.clear();
          // await AsyncStorage.removeItem('userToken')
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: 'LOGOUT' });
      },
      signUp: () => {
        dispatch({
          type: 'LOGIN',
          userName: userName,
          email: email,
          token: userToken,
        });
      },
    }),
    []
  );
  React.useEffect(() => {
      setTimeout(async () => {
        let userToken;
        let userName;
        let email;
        let profileImage;
        userToken = null;
        userName = null;
        email = null;
        profileImage = null;
        try {
          userToken = await AsyncStorage.getItem('userToken');
          userName = await AsyncStorage.getItem('userName');
          email = await AsyncStorage.getItem('email');
          profileImage = await AsyncStorage.getItem('profileImage');
        } catch (e) {
          console.log(e);
        }
        dispatch({
          type: 'RETRIEVE_TOKEN',
          token: userToken,
          userName: userName,
          email: email,
          profileImage: JSON.parse(profileImage),
        });
      }, 1000);
  }, [loginState.reRenderApp]);

  if (loginState.isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <DataContext.Provider value={loginState}>
        <NavigationContainer>
          <Stack.Navigator>
            {loginState.userToken == null ? (
              // No token found, user isn't signed in
              <Stack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{
                  title: 'Sign up',
                  headerShown: false,
                }}
              />
            ) : (
              <>
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{
                    title: 'Home',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Profile"
                  component={Profile}
                  options={{
                    title: 'Profile',
                    headerShown: false,
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </DataContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
