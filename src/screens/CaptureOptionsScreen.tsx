import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

// Placeholder image for menu sample
const placeholderImage = require('../../assets/images/menu_sample.png');

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

    const handleEnterManually = () => {
        // TODO: Implement manual entry
        Alert.alert("Coming Soon", "Manual entry feature is under development.");
    };

    const useSampleImage = () => {
        // Use a placeholder image for demonstration
        navigation.navigate('MenuList', { imageUri: placeholderImage });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            <LinearGradient colors={['#f6f9f9', '#f0e9d6']} style={styles.gradientContainer}>
                <View style={styles.selectionSafeArea}>
                    <View style={styles.selectionContentContainer}>
                        <View style={styles.selectionIconWrapper}>
                            <MaterialCommunityIcons name="text-search" size={64} color="#7ecdc7" />
                        </View>

                        <Text style={styles.selectionTitle}>Menu Analyzer</Text>

                        <Text style={styles.selectionSubtitle}>How would you like to add a menu?</Text>

                        <Button
                            mode="contained"
                            icon="camera"
                            onPress={handleCameraPress}
                            style={[styles.selectionButton, styles.selectionButtonCamera]}
                            labelStyle={styles.selectionButtonLabel}
                            buttonColor="#7ecdc7"
                            textColor="#ffffff"
                        >
                            Scan with Camera
                        </Button>
                        <Button
                            mode="outlined"
                            icon="image"
                            onPress={handleGalleryPress}
                            style={[styles.selectionButton, styles.selectionButtonGallery]}
                            labelStyle={styles.selectionButtonLabel}
                            textColor="#334155"
                        >
                            Select from Gallery
                        </Button>
                        <Button
                            mode="outlined"
                            icon="pencil"
                            onPress={handleEnterManually}
                            style={[styles.selectionButton, styles.selectionButtonManual]}
                            labelStyle={styles.selectionButtonLabel}
                            textColor="#cbd5e1"
                            disabled
                        >
                            Enter Manually (Soon)
                        </Button>

                        <TouchableOpacity
                            style={styles.sampleButtonSelection}
                            onPress={useSampleImage}
                        >
                            <Text style={styles.sampleButtonText}>Try with Sample Menu</Text>
                        </TouchableOpacity>

                        <View style={styles.selectionFooterContainer}>
                            <Text style={styles.selectionFooter}>Powered by AI</Text>
                            <MaterialCommunityIcons name="brain" size={14} color="#a1a1aa" style={{ marginLeft: 4 }} />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#334155" />
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f6f9f9',
    },
    gradientContainer: {
        flex: 1,
    },
    selectionSafeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectionContentContainer: {
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
        padding: 24,
        borderRadius: 32,
        backgroundColor: '#fdfdfd',
        shadowColor: "#d8e3e7",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
    selectionIconWrapper: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: "#cfd8dc",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    selectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1c1c1e',
    },
    selectionSubtitle: {
        fontSize: 16,
        color: '#5a6770',
        marginTop: 8,
        textAlign: 'center',
        marginBottom: 24,
    },
    selectionButton: {
        width: '100%',
        paddingVertical: 1,
        borderRadius: 14,
        marginTop: 12,
    },
    selectionButtonCamera: {
        marginTop: 24,
        elevation: 3,
    },
    selectionButtonGallery: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
    },
    selectionButtonManual: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
    },
    selectionButtonLabel: {
        fontSize: 15,
        fontWeight: '500',
        paddingVertical: 5,
    },
    sampleButtonSelection: {
        marginTop: 20,
        alignItems: 'center',
    },
    selectionFooterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
    },
    selectionFooter: {
        fontSize: 12,
        color: '#a1a1aa',
        fontWeight: '300',
    },
    sampleButtonText: {
        fontSize: 14,
        color: '#3b82f6',
        textDecorationLine: 'underline',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
});

export default CaptureOptionsScreen; 