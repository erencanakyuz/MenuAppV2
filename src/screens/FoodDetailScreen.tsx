import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'; // ImageSourcePropType removed as it's part of MenuItem
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'; // Added RouteProp
import { Card, Title, Paragraph, Divider, IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

// Import RootStackParamList to get MenuItem type correctly
import { RootStackParamList } from '../navigation/AppNavigator'; // Adjust path

// Sample nutrition data
// TODO: Replace with actual fetched nutrition data if available
const nutritionFacts = {
    servingSize: '1 slice',
    calories: 250, // Example value, actual calories come from foodItem
    totalFat: 10,
    saturatedFat: 4,
    cholesterol: 20,
    sodium: 500,
    totalCarbs: 30,
    fiber: 2,
    sugars: 5,
    protein: 12,
};

type FoodDetailScreenRouteProp = RouteProp<RootStackParamList, 'FoodDetail'>;

const FoodDetailScreen = () => {
    const route = useRoute<FoodDetailScreenRouteProp>();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const { foodItem } = route.params; // foodItem is now correctly typed as MenuItem

    // foodItem.image is ImageSourcePropType, can be used directly.
    // Fallback is good practice if foodItem.image could ever be undefined/null,
    // but MenuItem type should enforce its presence.
    const imageSource = foodItem.image || require('../../assets/images/placeholder_food.png');

    return (
        <LinearGradient colors={['#f6f9f9', '#eaf4f4']} style={styles.gradientContainer} >
            <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 16 }]}>
                <View style={[styles.headerPlaceholder, { paddingTop: insets.top }]} />
                <View style={styles.imageContainer}>
                    <Image source={imageSource} style={styles.foodImage} />
                    <LinearGradient colors={['transparent', 'rgba(246,249,249,0.5)', '#f6f9f9']} style={styles.imageOverlay} />
                </View>
                <View style={styles.namePriceContainer}>
                    <Text style={styles.foodName}>{foodItem.name}</Text>
                    <Text style={styles.foodPrice}>${foodItem.price.toFixed(2)}</Text>
                </View>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.cardTitle}>Description</Title>
                        <Paragraph style={styles.paragraph}>{foodItem.description || 'No description available.'}</Paragraph>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.cardTitle}>Nutrition Facts</Title>
                        <View style={styles.nutritionRow}><Text style={styles.nutritionLabel}>Serving Size</Text><Text style={styles.nutritionValue}>{nutritionFacts.servingSize}</Text></View>
                        <Divider style={styles.divider} />
                        <View style={styles.nutritionRow}><Text style={[styles.nutritionLabel, styles.boldLabel]}>Calories</Text><Text style={[styles.nutritionValue, styles.boldValue]}>{foodItem.calories || nutritionFacts.calories}</Text></View>
                        <Divider style={styles.divider} />
                        <View style={styles.nutritionRow}><Text style={styles.nutritionLabel}>Total Fat</Text><Text style={styles.nutritionValue}>{nutritionFacts.totalFat}g</Text></View>
                        <View style={[styles.nutritionRow, styles.subRow]}><Text style={styles.nutritionLabel}>Saturated Fat</Text><Text style={styles.nutritionValue}>{nutritionFacts.saturatedFat}g</Text></View>
                        <Divider style={styles.divider} />
                        <View style={styles.nutritionRow}><Text style={styles.nutritionLabel}>Cholesterol</Text><Text style={styles.nutritionValue}>{nutritionFacts.cholesterol}mg</Text></View>
                        <Divider style={styles.divider} />
                        <View style={styles.nutritionRow}><Text style={styles.nutritionLabel}>Sodium</Text><Text style={styles.nutritionValue}>{nutritionFacts.sodium}mg</Text></View>
                        <Divider style={styles.divider} />
                        <View style={styles.nutritionRow}><Text style={styles.nutritionLabel}>Total Carbohydrates</Text><Text style={styles.nutritionValue}>{nutritionFacts.totalCarbs}g</Text></View>
                        <View style={[styles.nutritionRow, styles.subRow]}><Text style={styles.nutritionLabel}>Dietary Fiber</Text><Text style={styles.nutritionValue}>{nutritionFacts.fiber}g</Text></View>
                        <View style={[styles.nutritionRow, styles.subRow]}><Text style={styles.nutritionLabel}>Sugars</Text><Text style={styles.nutritionValue}>{nutritionFacts.sugars}g</Text></View>
                        <Divider style={styles.divider} />
                        <View style={styles.nutritionRow}><Text style={styles.nutritionLabel}>Protein</Text><Text style={styles.nutritionValue}>{nutritionFacts.protein}g</Text></View>
                    </Card.Content>
                </Card>
                <Card style={[styles.card, styles.warningCard]}>
                    <Card.Content style={styles.warningContent}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#d97706" />
                        <Paragraph style={styles.warningText}>May contain allergens: dairy, wheat, eggs (Sample)</Paragraph>
                    </Card.Content>
                </Card>
            </ScrollView>
            <IconButton icon="arrow-left" size={28} iconColor="#334155" onPress={() => navigation.goBack()} style={[styles.backButton, { top: insets.top + 5 }]} />
        </LinearGradient>
    );
};

// Styles remain the same
const styles = StyleSheet.create({
    gradientContainer: { flex: 1, },
    scrollView: { flex: 1, },
    scrollContent: { paddingHorizontal: 0, paddingTop: 0, }, // Adjusted paddingHorizontal to 0, individual sections will handle it
    headerPlaceholder: { height: 50, backgroundColor: 'transparent', },
    backButton: { position: 'absolute', left: 16, zIndex: 10, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 24, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, },
    imageContainer: { width: '100%', height: 350, overflow: 'hidden', marginBottom: 0, position: 'relative', }, // marginBottom 0
    foodImage: { width: '100%', height: '100%', resizeMode: 'cover', },
    imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, }, // Increased height for smoother fade
    namePriceContainer: { marginTop: -30, zIndex: 5, paddingHorizontal: 24, marginBottom: 24, }, // Pull up slightly over image fade
    foodName: { fontSize: 32, fontWeight: 'bold', color: '#1c1c1e', marginBottom: 4, lineHeight: 38, },
    foodPrice: { fontSize: 22, fontWeight: '600', color: '#7ecdc7', },
    card: { marginBottom: 18, marginHorizontal: 16, borderRadius: 16, elevation: 3, backgroundColor: '#ffffff', shadowColor: "#d8e3e7", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, borderWidth: 0, },
    cardTitle: { fontSize: 20, fontWeight: '600', color: '#334155', marginBottom: 12, },
    paragraph: { fontSize: 16, color: '#5a6770', lineHeight: 24, },
    nutritionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, },
    subRow: { paddingLeft: 20, paddingVertical: 4, },
    nutritionLabel: { fontSize: 16, color: '#5a6770', },
    boldLabel: { fontWeight: 'bold', color: '#334155', },
    nutritionValue: { fontSize: 16, fontWeight: '500', color: '#1c1c1e', },
    boldValue: { fontWeight: 'bold', },
    divider: { marginVertical: 6, backgroundColor: '#e2e8f0', },
    warningCard: { backgroundColor: '#fffbeb', borderLeftWidth: 5, borderLeftColor: '#f59e0b', marginHorizontal: 16, },
    warningContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, },
    warningText: { marginLeft: 12, color: '#b45309', fontSize: 15, flex: 1, },
});


export default FoodDetailScreen;