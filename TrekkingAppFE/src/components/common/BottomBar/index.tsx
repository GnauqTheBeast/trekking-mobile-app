import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StackActions } from '@react-navigation/native';
import HomeIcon from '../../../assets/icons/taskbar/home.svg';
import HomeOutlineIcon from '../../../assets/icons/taskbar/home-outline.svg';
import BookingIcon from '../../../assets/icons/taskbar/suitcase.svg';
import BookingOutlineIcon from '../../../assets/icons/taskbar/suitcase-outline.svg';
import SaveIcon from '../../../assets/icons/taskbar/heart-taskbar.svg';
import SaveOutlineIcon from '../../../assets/icons/taskbar/heart-taskbar-outline.svg';
import NotificationIcon from '../../../assets/icons/taskbar/mail.svg';
import NotificationOutlineIcon from '../../../assets/icons/taskbar/mail-outline.svg';
import AccountIcon from '../../../assets/icons/taskbar/person.svg';
import AccountOutlineIcon from '../../../assets/icons/taskbar/person-outline.svg';

const tabs = [
  { name: 'Home', stack: 'HomeStack',activeIcon: HomeIcon, inactiveIcon: HomeOutlineIcon, size: 36 },
  { name: 'Booking', stack: 'BookingStack', activeIcon: BookingIcon, inactiveIcon: BookingOutlineIcon, size: 28 },
  { name: 'Save', stack: 'SaveStack', activeIcon: SaveIcon, inactiveIcon: SaveOutlineIcon, size: 32 },
  { name: 'Notification', stack: 'NotificationStack', activeIcon: NotificationIcon, inactiveIcon: NotificationOutlineIcon, size: 32 },
  { name: 'Account', stack: 'AccountStack', activeIcon: AccountIcon, inactiveIcon: AccountOutlineIcon, size: 38 },
];

const tabScreens = {
  HomeStack: 'HomeScreen',
  BookingStack: 'TreksActiveScreen',
  SaveStack: 'SaveScreen',
  NotificationStack: 'NotificationScreen',
  AccountStack: 'AccountScreen',
};



const BottomBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {

  // {
  //   index: 0,
  //   key: "tab-2TiGWUhaMKVdq29F9dGlM",
  //   preloadedRouteKeys: [],
  //   routeNames: [
  //     "HomeStack",
  //     "BookingStack",
  //     "SaveStack",
  //     "NotificationStack",
  //     "AccountStack"
  //   ],
  //   routes: [
  //     {
  //       key: "HomeStack-M9CtbgQjx5BAqe-G3QZ82",
  //       name: "HomeStack",
  //       params: {
  //         screen: "HomeScreen"
  //       },


  const focusedStack = state?.routes[state.index]?.name;

  const firstScreenInStack = tabScreens[focusedStack as keyof typeof tabScreens]

  const currentStackState = state?.routes[state.index]?.state;
  const currentScreenInStack =
    currentStackState && typeof currentStackState.index === 'number'
      ? currentStackState.routes?.[currentStackState.index]?.name
      : firstScreenInStack;

  // console.log("current stack:", focusedStack)
  // console.log("first screen: ", firstScreenInStack)
  // console.log("Current screen:", currentScreenInStack)

  const handleOnPress = useCallback(
    (stack: string) => {
      console.log(stack)
      if (stack === focusedStack && currentScreenInStack !== firstScreenInStack ) {
          navigation.navigate(stack, { screen: firstScreenInStack });
      } else {
        navigation.navigate(stack, {screen: currentScreenInStack});
      }
    },
    [navigation, focusedStack, currentScreenInStack]
  );

  return (
    <View style={styles.container}>
      {tabs.map(({ name, stack, activeIcon: ActiveIcon, inactiveIcon: InactiveIcon, size }) => (
        <TouchableOpacity key={name} onPress={() => handleOnPress(stack)}>
          {focusedStack === stack ? (
            <ActiveIcon width={size} height={size} />
          ) : (
            <InactiveIcon width={size} height={size} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '9%',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0'
  },
});

export default BottomBar;