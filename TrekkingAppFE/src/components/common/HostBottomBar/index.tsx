import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import HomeIcon from '../../../assets/icons/taskbar/home.svg';
import HomeOutlineIcon from '../../../assets/icons/taskbar/home-outline.svg';
import AccountIcon from '../../../assets/icons/taskbar/person.svg';
import AccountOutlineIcon from '../../../assets/icons/taskbar/person-outline.svg';

const tabs = [
  { name: 'Home', stack: 'HostHomeStack',activeIcon: HomeIcon, inactiveIcon: HomeOutlineIcon, size: 36 },
  { name: 'Account', stack: 'HostAccountStack', activeIcon: AccountIcon, inactiveIcon: AccountOutlineIcon, size: 38 },
];

const tabScreens = {
  HomeStack: 'HomeScreen',
  AccountStack: 'AccountScreen',
};



const HostBottomBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {

  const focusedStack = state?.routes[state.index]?.name;

  const firstScreenInStack = tabScreens[focusedStack as keyof typeof tabScreens]

  const currentStackState = state?.routes[state.index]?.state;
  const currentScreenInStack =
    currentStackState && typeof currentStackState.index === 'number'
      ? currentStackState.routes?.[currentStackState.index]?.name
      : firstScreenInStack;

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

export default HostBottomBar;