import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const CaptureOptionsScreen = () => {
    const navigation = useNavigation();

    const handleCameraPress = () => {
        navigation.navigate('Camera');
    };

    const handleGalleryPress = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
            });

            if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
                // Navigate to MenuList with the selected image URI
                navigation.navigate('MenuList', { imageUri: result.assets[0].uri });
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#39747E" translucent={false} />
            <LinearGradient colors={['#39747E', '#2c5d64']} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Choose a method</Text>
                    <Text style={styles.subtitle}>How would you like to capture the menu?</Text>
                </View>

                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={handleCameraPress}
                        activeOpacity={0.9}
                    >
                        <BlurView
                            style={styles.blurBackground}
                            blurType="light"
                            blurAmount={10}
                            reducedTransparencyFallbackColor="white"
                        />
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="camera" size={40} color="#FFF" />
                        </View>
                        <Text style={styles.optionTitle}>Camera</Text>
                        <Text style={styles.optionDescription}>
                            Take a photo of the menu to analyze
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={handleGalleryPress}
                        activeOpacity={0.9}
                    >
                        <BlurView
                            style={styles.blurBackground}
                            blurType="light"
                            blurAmount={10}
                            reducedTransparencyFallbackColor="white"
                        />
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="image" size={40} color="#FFF" />
                        </View>
                        <Text style={styles.optionTitle}>Gallery</Text>
                        <Text style={styles.optionDescription}>
                            Choose an existing photo from your device
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#39747E',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    header: {
        marginTop: 30,
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    optionsContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 25,
    },
    optionCard: {
        height: 150,
        borderRadius: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    blurBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    optionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    optionDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CaptureOptionsScreen; 