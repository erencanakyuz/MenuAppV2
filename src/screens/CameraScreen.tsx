import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Linking } from 'react-native';
import { Camera, useCameraDevice, useCameraFormat, useCameraPermission } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';

const CameraScreen = () => {
    const navigation = useNavigation();
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back'); // 'front' veya 'back'
    const cameraRef = useRef<Camera>(null);
    const [isActive, setIsActive] = useState(true); // Kamera aktifliği

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
                <TouchableOpacity onPress={requestPermission}><Text>İzin İste</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openSettings()}><Text>Ayarları Aç</Text></TouchableOpacity>
            </View>
        );
    }

    if (device == null) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Kamera yükleniyor...</Text>
            </View>
        );
    }

    // Format seçimi (opsiyonel, daha fazla kontrol için)
    // const format = useCameraFormat(device, [
    //   { photoResolution: { width: 1920, height: 1080 } },
    //   { fps: 60 }
    // ])

    return (
        <View style={styles.containerLight}>
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

            {/* Buraya kendi butonlarınızı ve overlay'lerinizi ekleyebilirsiniz */}
            {/* Örnek çekim butonu */}
            <View style={styles.controlsContainer}>
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                    <Text>ÇEK</Text>
                </TouchableOpacity>
            </View>

            {/* Processing overlay'iniz ve diğer animasyonlu view'larınız buraya gelebilir */}
            {/* <Animated.View style={[styles.processingOverlay, processingOverlayStyle]} ... /> */}
        </View>
    );
};

// Stillerinizi buraya ekleyin (mevcut CameraScreen.tsx dosyanızdaki gibi)
const styles = StyleSheet.create({
    containerLight: { flex: 1, backgroundColor: '#f0f0f0' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    controlsContainer: { position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center' },
    captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
    // ... diğer stilleriniz
});

export default CameraScreen;