import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TrekStackParamList } from '../../types/navigation';
import TrekList from '../../screens/tour-stack/TrekList';
import CreateTrek from '../../screens/tour-stack/CreateTrek';
import TrekDetail from '../../screens/tour-stack/TrekDetail';
import EditTrek from '../../screens/tour-stack/EditTrek';

const Stack = createStackNavigator<TrekStackParamList>();

const TrekStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name="TrekList" component={TrekList} />
      <Stack.Screen name="CreateTrek" component={CreateTrek} />
      <Stack.Screen name="EditTrek" component={EditTrek} />
      <Stack.Screen name="TrekDetail" component={TrekDetail} />
    </Stack.Navigator>
  );
};

export default TrekStackNavigator;