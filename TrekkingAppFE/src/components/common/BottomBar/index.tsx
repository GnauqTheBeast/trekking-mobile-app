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
  { name: 'Home', stack: 'HomeStack', activeIcon: HomeIcon, inactiveIcon: HomeOutlineIcon, size: 36 },
  { name: 'Booking', stack: 'BookingStack', activeIcon: BookingIcon, inactiveIcon: BookingOutlineIcon, size: 28 },
  { name: 'Save', stack: 'SaveStack', activeIcon: SaveIcon, inactiveIcon: SaveOutlineIcon, size: 32 },
  { name: 'Notification', stack: 'NotificationStack', activeIcon: NotificationIcon, inactiveIcon: NotificationOutlineIcon, size: 32 },
  { name: 'Account', stack: 'AccountStack', activeIcon: AccountIcon, inactiveIcon: AccountOutlineIcon, size: 38 },
];

const BottomBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const focusedStack = state?.routes[state.index]?.name;

  const currentStackState = state?.routes[state.index]?.state;
  const currentScreenInStack =
    currentStackState && typeof currentStackState.index === 'number'
      ? currentStackState.routes?.[currentStackState.index]?.name
      : undefined;
  console.log(focusedStack)
  console.log(currentScreenInStack)

  const handleOnPress = useCallback(
    (stack: string) => {
      if (stack === 'HomeStack') {
        if (focusedStack !== 'HomeStack') {
          navigation.navigate('HomeStack');
        } else if (currentScreenInStack !== 'HomeScreen') {
          navigation.navigate('HomeStack', { screen: 'HomeScreen' });
        }
      } else {
        navigation.navigate(stack);
      }
      // if(stack === focusedStack){
      //   navigation.navigate(focusedStack, {scree})
      // }
      // esle {
      //   navigation.navigate(stack);
      // }
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