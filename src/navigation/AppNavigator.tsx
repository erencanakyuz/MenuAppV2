import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ImageSourcePropType } from 'react-native'; // Import ImageSourcePropType

import WelcomeScreen from '../screens/WelcomeScreen';
import CameraScreen from '../screens/CameraScreen';
import MenuListScreen from '../screens/MenuListScreen';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import CaptureOptionsScreen from '../screens/CaptureOptionsScreen';

// Define MenuItem type here or import from a types.ts file
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    calories: number;
    price: number;
    image: ImageSourcePropType; // Use ImageSourcePropType for flexibility
    tags: string[];
    macros: {
        fat: number;
        protein: number;
        carbs: number;
    };
}

export type RootStackParamList = {
    Welcome: undefined;
    CaptureOptions: undefined;
    Camera: undefined;
    MenuList: { imageUri: string | null }; // For the overall scanned image URI
    FoodDetail: { foodItem: MenuItem }; // Use the specific MenuItem type
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="CaptureOptions" component={CaptureOptionsScreen} />
                <Stack.Screen name="Camera" component={CameraScreen} />
                <Stack.Screen name="MenuList" component={MenuListScreen} />
                <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;