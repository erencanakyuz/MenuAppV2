import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView, Alert, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    GestureHandlerRootView,
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated,
{
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    withSpring,
    interpolate,
    Extrapolate,
    runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const backgroundImage = require('../../assets/images/salad_bowl.png');
const basilLeaf1 = require('../../assets/images/basil_leaf.png');
const basilLeaf2 = require('../../assets/images/basil_leaf.png');
const basilLeaf3 = require('../../assets/images/basil_leaf.png');
const basilLeaf4 = require('../../assets/images/basil_leaf.png');
const basilLeaf5 = require('../../assets/images/basil_leaf.png');
const basilLeaf6 = require('../../assets/images/basil_leaf.png');
const basilLeaf7 = require('../../assets/images/basil_leaf.png');
const basilLeaf8 = require('../../assets/images/basil_leaf.png');
const basilLeaf9 = require('../../assets/images/basil_leaf.png');

// Slider constants
const SLIDER_WIDTH = width * 0.8;
const THUMB_SIZE = 60;
const SLIDER_HEIGHT = THUMB_SIZE;
const SLIDER_PADDING = 5;
const SLIDER_EFFECTIVE_WIDTH = SLIDER_WIDTH - SLIDER_PADDING * 2 - THUMB_SIZE;
const ACTIVATION_THRESHOLD = SLIDER_EFFECTIVE_WIDTH * 0.7;

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);

    const navigateToCamera = () => {
        navigation.navigate('Camera');
    };

    const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent,
        { startX: number }>(
            {
                onStart: (_, ctx) => {
                    ctx.startX = translateX.value;
                },
                onActive: (event, ctx) => {
                    let newTranslateX = ctx.startX + event.translationX;
                    // Clamp the value within the slider bounds
                    translateX.value = Math.max(0, Math.min(newTranslateX, SLIDER_EFFECTIVE_WIDTH));
                    // Fade out text as user swipes
                    opacity.value = interpolate(
                        translateX.value,
                        [0, SLIDER_EFFECTIVE_WIDTH / 2],
                        [1, 0],
                        Extrapolate.CLAMP
                    );
                },
                onEnd: () => {
                    if (translateX.value > ACTIVATION_THRESHOLD) {
                        // Snap to end and navigate
                        translateX.value = withSpring(SLIDER_EFFECTIVE_WIDTH, {}, () => {
                            runOnJS(navigateToCamera)();
                        });
                        opacity.value = 0;
                    } else {
                        // Snap back to start
                        translateX.value = withSpring(0);
                        opacity.value = withSpring(1);
                    }
                },
            }
        );

    const thumbAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const textAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });


    return (
        //  GestureHandlerRootView
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" backgroundColor="#39747E" translucent={false} />
                <View style={styles.container}>
                    {/* Decorative elements */}
                    <Image source={basilLeaf1} style={[styles.leaf, styles.leaf1]} />
                    <Image source={basilLeaf2} style={[styles.leaf, styles.leaf2]} />
                    <Image source={basilLeaf3} style={[styles.leaf, styles.leaf3]} />
                    <Image source={basilLeaf4} style={[styles.leaf, styles.leaf4]} />
                    <Image source={basilLeaf5} style={[styles.leaf, styles.leaf5]} />
                    <Image source={basilLeaf6} style={[styles.leaf, styles.leaf6]} />
                    <Image source={basilLeaf7} style={[styles.leaf, styles.leaf7]} />
                    <Image source={basilLeaf8} style={[styles.leaf, styles.leaf8]} />
                    <Image source={basilLeaf9} style={[styles.leaf, styles.leaf9]} />
                    {/* Decorative circles */}
                    <View style={[styles.circle, styles.circle1]} />
                    <View style={[styles.circle, styles.circle2]} />
                    <View style={[styles.circle, styles.circle3]} />
                    <View style={[styles.circle, styles.circle4]} />

                    <View style={styles.imageContainer}>
                        <Image source={backgroundImage} style={styles.mainImage} />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Hey!{`\n`}Foodie</Text>
                        <Text style={styles.subtitle}>Let's find your favorite food.</Text>
                    </View>

                    {/* Swipe Button */}
                    <View style={styles.sliderContainer}>
                        <Animated.Text style={[styles.sliderText, textAnimatedStyle]}>
                            Swipe to start
                        </Animated.Text>
                        <PanGestureHandler onGestureEvent={gestureHandler}>
                            <Animated.View style={[styles.thumb, thumbAnimatedStyle]}>
                                <Ionicons name="chevron-forward" size={30} color="#39747E" />
                            </Animated.View>
                        </PanGestureHandler>
                    </View>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#39747E',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: height * 0.05,
        paddingBottom: height * 0.08,
        backgroundColor: '#39747E',
        position: 'relative',
        overflow: 'hidden',
    },
    imageContainer: {
        width: width * 0.7,
        height: width * 0.7,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.05,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    mainImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    textContainer: {
        alignItems: 'flex-start',
        width: '100%',
        marginTop: -height * 0.05,
        paddingLeft: 10,
    },
    title: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#FFFFFF',
        lineHeight: 70,
        marginBottom: 10,
        fontFamily: 'System',
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 20,
        color: '#FFFFFF',
        opacity: 0.9,
        fontFamily: 'System',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    // Slider Styles
    sliderContainer: {
        width: SLIDER_WIDTH,
        height: SLIDER_HEIGHT,
        backgroundColor: 'rgba(248, 243, 232, 0.3)',
        borderRadius: SLIDER_HEIGHT / 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SLIDER_PADDING,
        position: 'relative',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    sliderText: {
        color: '#F8F3E8', // Use the off-white color for text
        fontSize: 16,
        fontWeight: '500',
        position: 'absolute',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        backgroundColor: '#F8F3E8',
        borderRadius: THUMB_SIZE / 2,
        position: 'absolute',
        left: SLIDER_PADDING,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.7)',
    },

    leaf: {
        position: 'absolute',
        width: 60,
        height: 60,
        resizeMode: 'contain',
        opacity: 0.9,
    },
    leaf1: {
        top: height * 0.06,
        left: width * 0.1,
        transform: [{ rotate: '-15deg' }],
        width: 70,
        height: 70,
    },
    leaf2: {
        bottom: height * 0.15,
        right: width * 0.08,
        transform: [{ rotate: '10deg' }],
        width: 65,
        height: 65,
    },
    leaf3: {
        top: height * 0.35,
        right: width * 0.05,
        transform: [{ rotate: '180deg' }],
        width: 40,
        height: 40,
    },
    leaf4: {
        top: height * 0.22,
        left: width * 0.15,
        transform: [{ rotate: '-45deg' }, { scale: 0.8 }],
        opacity: 0.7,
    },
    leaf5: {
        top: height * 0.5,
        right: width * 0.15,
        transform: [{ rotate: '30deg' }, { scale: 0.9 }],
        opacity: 0.8,
    },
    leaf6: {
        bottom: height * 0.3,
        left: width * 0.05,
        transform: [{ rotate: '-20deg' }, { scale: 0.7 }],
        opacity: 0.6,
    },
    leaf7: {
        top: height * 0.65,
        right: width * 0.3,
        transform: [{ rotate: '75deg' }, { scale: 0.65 }],
        opacity: 0.55,
    },
    leaf8: {
        bottom: height * 0.25,
        left: width * 0.3,
        transform: [{ rotate: '135deg' }, { scale: 0.85 }],
        opacity: 0.65,
    },
    leaf9: {
        top: height * 0.15,
        right: width * 0.25,
        transform: [{ rotate: '-90deg' }, { scale: 0.55 }],
        opacity: 0.5,
    },
    circle: {
        position: 'absolute',
        borderRadius: 50,
        borderWidth: 1.5,
        opacity: 0.2,
    },
    circle1: {
        borderColor: '#FFFFFF',
        width: 80, height: 80,
        top: height * 0.1,
        left: width * 0.2,
    },
    circle2: {
        borderColor: '#FFFFFF',
        width: 100, height: 100,
        top: height * 0.18,
        left: width * 0.05,
    },
    circle3: {
        borderColor: '#FFC0CB',
        width: 70, height: 70,
        top: height * 0.4,
        right: width * 0.02,
        opacity: 0.4,
    },
    circle4: {
        borderColor: '#FFFFFF',
        width: 120, height: 120,
        top: height * 0.5,
        left: width * 0.05,
        opacity: 0.2,
    }
});

export default WelcomeScreen; 