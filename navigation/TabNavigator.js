import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  Entypo,
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

//Tab screens
import { SpotlightNavigator } from './SpotlightNavigator';
import { ProductsNavigator } from './ProductsNavigator';
import { ProjectsNavigator } from './ProjectsNavigator';
import { ProposalsNavigator } from './ProposalsNavigator';

//Constants
import Colors from '../constants/Colors';

const TabStackNavigator = createMaterialBottomTabNavigator();

export const TabNavigator = (props) => {
  return (
    <>
      <TabStackNavigator.Navigator
        initialRouteName="Ge Igen"
        labeled={true}
        shifting={true}
        activeColor={Colors.lightPrimary}
        inactiveColor={Colors.mediumPrimary}
        barStyle={{ backgroundColor: Colors.darkPrimary }}
      >
        <TabStackNavigator.Screen
          name="Ge Igen"
          component={SpotlightNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name={'home'} color={color} size={23} />
            ),
          }}
        />
        <TabStackNavigator.Screen
          name="Återbruk"
          component={ProductsNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name={'hammer'} color={color} size={23} />
            ),
          }}
        />
        <TabStackNavigator.Screen
          name="Projekt"
          component={ProjectsNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Entypo name={'tools'} size={23} color={color} />
            ),
          }}
        />
        <TabStackNavigator.Screen
          name="Efterlysningar"
          component={ProposalsNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <AntDesign name={'exclamationcircle'} color={color} size={23} />
            ),
          }}
        />
      </TabStackNavigator.Navigator>
    </>
  );
};