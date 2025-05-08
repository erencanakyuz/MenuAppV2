import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Linking, Dimensions } from 'react-native';
import { Camera, useCameraDevice, useCameraFormat, useCameraPermission } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const CameraScreen = () => {
    const navigation = useNavigation();
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back'); // 'front' veya 'back'
    const cameraRef = useRef<Camera>(null);
    const [isActive, setIsActive] = useState(true); // Kamera aktifliği

    // Scanning animation
    const scanLinePosition = useSharedValue(0);

    useEffect(() => {
        scanLinePosition.value = withRepeat(
            withTiming(height * 0.6, { duration: 3000, easing: Easing.linear }),
            -1, // Infinite repeat
            true // Reverse direction
        );
    }, [scanLinePosition, height]);

    const animatedScanLineStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: scanLinePosition.value }],
        };
    });

    // İzinleri kontrol et
    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    // Navigasyon odaklandığında kamerayı aktif et, odaktan çıkınca pasif et
    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            setIsActive(true);
            // Restart animation on focus
            scanLinePosition.value = 0; // Reset position
            scanLinePosition.value = withRepeat(
                withTiming(height * 0.6, { duration: 3000, easing: Easing.linear }),
                -1,
                true
            );
        });
        const unsubscribeBlur = navigation.addListener('blur', () => {
            setIsActive(false);
        });
        return () => {
            unsubscribeFocus();
            unsubscribeBlur();
        };
    }, [navigation]);


    const takePicture = async () => {
        if (cameraRef.current == null || !hasPermission) {
            console.log("Kamera hazır değil veya izin yok.");
            return;
        }
        try {
            // Animasyonlarınızı burada başlatabilirsiniz
            const photo = await cameraRef.current.takePhoto({
                qualityPrioritization: 'speed', // 'quality', 'balanced'
                flash: 'off', // 'on', 'auto'
                enableShutterSound: true
            });
            console.log('Fotoğraf çekildi:', photo.path);

            // <<< Backend Integration Point >>>
            // 1. Show a loading indicator.
            // 2. Send `photo.path` (or the image file) to your backend.
            // 3. Backend performs OCR, AI processing, image generation.
            // 4. Backend returns structured menu data.
            // 5. Navigate to MenuList with the fetched data, or handle errors.
            //    For now, we're passing the local URI.
            // setImage(photo.path); // State'e kaydet
            // setMode('preview'); // Önizleme moduna geç
            // simulateProcessing(); // İşleme simülasyonu
            navigation.navigate('MenuList', { imageUri: `file://${photo.path}` });

        } catch (e) {
            console.error('Fotoğraf çekilirken hata:', e);
            // Hata durumunda animasyonları sıfırlama
        }
    };

    if (!hasPermission) {
        return (
            <View style={styles.centered}>
                <Text>Kamera izni gerekiyor.</Text>
                <TouchableOpacity onPress={requestPermission}><Text style={styles.permissionButtonText}>İzin İste</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openSettings()}><Text style={styles.permissionButtonText}>Ayarları Aç</Text></TouchableOpacity>
            </View>
        );
    }

    if (device == null) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={styles.loadingText}>Kamera yükleniyor...</Text>
            </View>
        );
    }

    // Format seçimi (opsiyonel, daha fazla kontrol için)
    // const format = useCameraFormat(device, [
    //   { photoResolution: { width: 1920, height: 1080 } },
    //   { fps: 60 }
    // ])

    return (
        <View style={styles.container}>
            <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isActive && navigation.isFocused()} // Uygulama ve ekran odakta ise aktif
                photo={true} // Fotoğraf çekimi için
            // video={true} // Video kaydı için (opsiyonel)
            // audio={true} // Ses kaydı için (opsiyonel)
            // format={format} // Özel format seçimi
            // torch={torchOn ? 'on' : 'off'}
            // zoom={cameraZoomLevel}
            // onError={(error) => console.error("VisionCamera Error: ", error)}
            // frameProcessor={frameProcessor} // OCR için burayı kullanacaksınız
            // frameProcessorFps={5} // Saniyede kaç kare işleneceği
            />

            {/* Viewfinder/Scanning Area Overlay */}
            <View style={styles.viewfinder}>
                <Animated.View style={[styles.scanLine, animatedScanLineStyle]} />
                {/* You can add corner brackets or other UI elements for the viewfinder here */}
            </View>

            {/* Buraya kendi butonlarınızı ve overlay'lerinizi ekleyebilirsiniz */}
            {/* Örnek çekim butonu */}
            <View style={styles.controlsContainer}>
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                    <View style={styles.captureButtonInner} />
                </TouchableOpacity>
            </View>

            {/* Processing overlay'iniz ve diğer animasyonlu view'larınız buraya gelebilir */}
            {/* <Animated.View style={[styles.processingOverlay, processingOverlayStyle]} ... /> */}
        </View>
    );
};

// Stillerinizi buraya ekleyin (mevcut CameraScreen.tsx dosyanızdaki gibi)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Darker background
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000', // Consistent background
    },
    permissionButtonText: {
        color: '#1E90FF', // DodgerBlue for links
        marginTop: 10,
        fontSize: 16,
    },
    loadingText: {
        marginTop: 10,
        color: '#FFF',
        fontSize: 16,
    },
    viewfinder: {
        position: 'absolute',
        top: '20%', // Adjust as needed
        left: '10%', // Adjust as needed
        width: '80%', // Adjust as needed
        height: '60%', // Adjust as needed
        // borderWidth: 2,
        // borderColor: 'rgba(255, 255, 255, 0.5)',
        // borderRadius: 10,
        overflow: 'hidden', // Important for the scan line
    },
    scanLine: {
        width: '100%',
        height: 2,
        backgroundColor: 'rgba(0, 255, 0, 0.7)', // Greenish scanning line
        shadowColor: '#0F0',
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 40, // Adjusted for modern look
        left: 0,
        right: 0,
        flexDirection: 'row', // Align items in a row if you add more controls
        justifyContent: 'center', // Center the capture button
        alignItems: 'center',
    },
    captureButton: {
        width: 80, // Larger button
        height: 80,
        borderRadius: 40, // Perfect circle
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    captureButtonInner: {
        width: 60, // Inner circle
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    // ... diğer stilleriniz
});

export default CameraScreen;