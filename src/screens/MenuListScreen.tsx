import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ImageSourcePropType, ActivityIndicator, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // Added useRoute, RouteProp
import { Card, IconButton, Paragraph, Title, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

// Import MenuItem and RootStackParamList from your navigator
import { MenuItem, RootStackParamList } from '../navigation/AppNavigator'; // Adjust path if necessary

// sample data with macro estimates (MenuItem type is now imported)
const sampleMenuItems: MenuItem[] = [
    {
        id: '1',
        name: 'Margherita Pizza',
        description: 'Tomato, mozzarella, fresh basil',
        calories: 750,
        price: 14.50,
        image: require('../../assets/images/pizza.png'),
        tags: ['AI analyzed', 'Vegetarian'],
        macros: { fat: 35, protein: 25, carbs: 40 },
    },
    {
        id: '2',
        name: 'Caesar Salad',
        description: 'Romaine, parmesan, caesar dressing',
        calories: 350,
        price: 9.90,
        image: require('../../assets/images/salad.png'),
        tags: ['AI analyzed', 'Low-carb', 'Recommended for vegetars'],
        macros: { fat: 60, protein: 30, carbs: 10 },
    },
    {
        id: '3',
        name: 'Classic Cheeseburger',
        description: 'Beef patty, cheddar, lettuce, tomato',
        calories: 610,
        price: 12.30,
        image: require('../../assets/images/burger.png'),
        tags: ['AI analyzed', 'High-protein'],
        macros: { fat: 40, protein: 35, carbs: 25 },
    },
];

// Helper function for tag styling 
const getTagStyle = (tag: string) => {
    switch (tag.toLowerCase()) {
        case 'ai analyzed': return styles.tagAi;
        case 'vegetarian':
        case 'recommended for vegetars': return styles.tagVeg;
        case 'low-carb': return styles.tagCarbProtein;
        case 'high-protein': return styles.tagCarbProtein;
        default: return styles.tagDefault;
    }
};

const MiniPieChart = ({ fat, protein, carbs, size = 44, strokeWidth = 5 }: { fat: number, protein: number, carbs: number, size?: number, strokeWidth?: number }) => {
    const radius = (size / 2) - (strokeWidth / 2);
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;
    const total = fat + protein + carbs;
    if (total <= 0) return null;

    const paths = [];
    let accumulatedPercentage = 0;
    const gapSize = 2; // Degrees for gap, or percentage of circumference
    const totalGaps = (fat > 0 ? 1 : 0) + (protein > 0 ? 1 : 0) + (carbs > 0 ? 1 : 0) - 1; // Max 2 gaps
    const availablePercentageForData = 100 - (totalGaps * gapSize);


    const fatPercent = total > 0 ? (fat / total) * availablePercentageForData : 0;
    const proteinPercent = total > 0 ? (protein / total) * availablePercentageForData : 0;
    // const carbPercent = total > 0 ? (carbs / total) * availablePercentageForData : 0;
    // Ensure sum is availablePercentageForData, handle potential floating point issues
    const carbPercent = Math.max(0, availablePercentageForData - fatPercent - proteinPercent);


    let largestPercent = 0;
    let largestLabel = '';
    if (fatPercent >= proteinPercent && fatPercent >= carbPercent) {
        largestPercent = fatPercent;
        largestLabel = 'F';
    } else if (proteinPercent >= fatPercent && proteinPercent >= carbPercent) {
        largestPercent = proteinPercent;
        largestLabel = 'P';
    } else {
        largestPercent = carbPercent;
        largestLabel = 'C';
    }

    const createSegment = (percentage: number, color: string, key: string) => {
        if (percentage <= 0) return null;
        // Calculate strokeDashoffset based on the data percentage *within* the available circle percentage
        const strokeDashoffset = circumference - (percentage / 100) * circumference;
        const rotation = (accumulatedPercentage / 100) * 360; // Rotate based on accumulated data percentage + gaps

        // Add data percentage for next rotation start point
        accumulatedPercentage += percentage;
        // If there's another segment after this one, add the gap
        if ((key === "fat" && (proteinPercent > 0 || carbPercent > 0)) || (key === "protein" && carbPercent > 0)) {
            accumulatedPercentage += gapSize;
        }


        return (
            <Path
                key={key}
                d={`M${center},${center} m0,-${radius} a${radius},${radius} 0 1,1 0,${2 * radius} a${radius},${radius} 0 1,1 0,-${2 * radius}`}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round" // "butt" might be better for exact gaps, "round" makes segments longer
                transform={`rotate(${rotation}, ${center}, ${center})`}
            />
        );
    };

    // Start drawing at -90 degrees (top of the circle)
    // accumulatedPercentage = -25 * (availablePercentageForData / 100); // Initial rotation offset
    accumulatedPercentage = 0; // Start from 0, apply initial rotation to Svg container if needed

    paths.push(createSegment(fatPercent, "#F59E0B", "fat"));
    paths.push(createSegment(proteinPercent, "#10B981", "protein"));
    paths.push(createSegment(carbPercent, "#6B7280", "carbs"));

    return (
        <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: [{ rotate: '-90deg' }] }} >
            <Path
                d={`M${center},${center} m0,-${radius} a${radius},${radius} 0 1,1 0,${2 * radius} a${radius},${radius} 0 1,1 0,-${2 * radius}`}
                fill="none"
                stroke="#E5E7EB" // Background track for the pie chart
                strokeWidth={strokeWidth}
            />
            {paths.filter(Boolean)}
            <SvgText
                x={center}
                y={center}
                fill="#374151"
                fontSize={size * 0.25}
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
                transform={`rotate(90, ${center}, ${center})`}
            >
                {`${largestPercent > 0 ? largestPercent.toFixed(0) : '0'}%${largestLabel}`}
            </SvgText>
        </Svg>
    );
};


const MenuItemCard = ({ item, onPress }: { item: MenuItem, onPress: () => void }) => {
    const chartSize = 64;
    return (
        <Card style={styles.card} onPress={onPress}>
            <View style={styles.cardContentRow}>
                <View style={styles.imageChartContainer}>
                    <Image source={item.image} style={styles.itemImage} accessibilityLabel={`Image of ${item.name}`} />
                    <View style={[styles.pieChartBelowImageOverlay, { width: chartSize, height: chartSize }]}>
                        <MiniPieChart fat={item.macros.fat} protein={item.macros.protein} carbs={item.macros.carbs} size={chartSize} strokeWidth={7} />
                    </View>
                </View>
                <View style={styles.detailsColumn}>
                    <View style={styles.tagsContainer}>
                        {item.tags.map((tag: string, index: number) => (
                            <View key={index} style={[styles.tag, getTagStyle(tag)]}><Text style={styles.tagText}>{tag}</Text></View>
                        ))}
                    </View>
                    <View style={styles.namePriceRow}>
                        <Title style={styles.itemName} numberOfLines={2}>{item.name}</Title>
                        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                    </View>
                    <View style={styles.descCaloriesRow}>
                        <Paragraph style={styles.itemDescription} numberOfLines={2}>{item.description}</Paragraph>
                        <Text style={styles.itemCalories}>{item.calories} cal</Text>
                    </View>
                    <View style={styles.whatsInsideContainer}>
                        <Text style={styles.whatsInsideTitle}>What's Inside?</Text>
                        <Paragraph style={styles.whatsInsideText}>Get full info about this dish — Ingredients, nutrition, and more!</Paragraph>
                    </View>
                </View>
            </View>
        </Card>
    );
};

const MenuListScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'MenuList'>>(); // Typed route
    const insets = useSafeAreaInsets();
    const isLoading = false;
    const restaurantName = "Your Restaurant";

    // Example of how you might use imageUri from route params:
    // const scannedMenuImageUri = route.params?.imageUri;
    // console.log("Scanned Menu Image URI:", scannedMenuImageUri); // You can use this in an <Image /> if needed

    const sampleMenuItemsMemo = useMemo(() => sampleMenuItems, []);

    const renderMenuItem = useCallback(({ item }: { item: MenuItem }) => (
        <MenuItemCard item={item} onPress={() => navigation.navigate('FoodDetail', { foodItem: item })} />
    ), [navigation]);

    const ListHeaderComponent = useMemo(() => (
        <View style={styles.listHeader}>
            <View style={styles.listHeaderBadge}>
                <Text style={styles.listHeaderTextLarge}>We've found {sampleMenuItemsMemo.length} meals</Text>
            </View>
            {restaurantName && <Paragraph style={styles.listHeaderSubText}>on the menu at {restaurantName} 🌮</Paragraph>}
            <Paragraph style={styles.listHeaderTextSmall}>Want to know more? Just tap to see details!</Paragraph>
        </View>
    ), [sampleMenuItemsMemo.length, restaurantName]);

    const optimizedProps = useMemo(() => ({
        initialNumToRender: 5,
        maxToRenderPerBatch: 10,
        windowSize: 11,
        removeClippedSubviews: Platform.OS === 'android', // true can cause issues on iOS sometimes
        keyExtractor: (item: MenuItem) => item.id,
        getItemLayout: (_: any, index: number) => ({ length: 220, offset: 220 * index, index }),
    }), []);

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator animating={true} size="large" color="#10B981" />
                <Text style={styles.loadingText}>Analyzing menu...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} iconColor="#000" />
                <Title style={styles.headerTitle}>Scan Results</Title>
                <View style={{ width: 40 }} />
            </View>
            <FlatList
                data={sampleMenuItemsMemo}
                renderItem={renderMenuItem}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={ListHeaderComponent}
                ListEmptyComponent={(
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No menu items found.</Text>
                        <Paragraph style={styles.emptySubText}>Try scanning again or select a different image.</Paragraph>
                        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.emptyButton} textColor="#10B981" >
                            Go Back
                        </Button>
                    </View>
                )}
                {...optimizedProps}
            />
        </View>
    );
};

// Styles remain the same
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
    loadingText: { marginTop: 10, fontSize: 16, color: '#6B7280', },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000000', },
    listHeader: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 30, alignItems: 'center', },
    listHeaderBadge: { backgroundColor: '#10B981', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 20, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, },
    listHeaderTextLarge: { fontWeight: 'bold', color: '#fff', textAlign: 'center', fontSize: 16, },
    listHeaderSubText: { fontSize: 16, color: '#4B5563', textAlign: 'center', marginBottom: 8, },
    listHeaderTextSmall: { color: '#6B7280', textAlign: 'center', lineHeight: 20, },
    listContent: { paddingHorizontal: 16, paddingBottom: 16, },
    card: { marginBottom: 25, borderRadius: 16, backgroundColor: '#FFFFFF', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, overflow: 'visible', },
    cardContentRow: { flexDirection: 'row', padding: 12, },
    imageChartContainer: { position: 'relative', width: 100, marginRight: 15, },
    itemImage: { width: 100, height: 130, borderRadius: 12, backgroundColor: '#F3F4F6', marginBottom: 25, },
    pieChartBelowImageOverlay: { position: 'absolute', bottom: 0, left: '50%', transform: [{ translateX: -32 }], zIndex: 1, },
    detailsColumn: { flex: 1, justifyContent: 'space-between', },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6, },
    tag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, marginRight: 6, marginBottom: 4, alignSelf: 'flex-start', },
    tagText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF', },
    tagAi: { backgroundColor: '#0E7490' },
    tagVeg: { backgroundColor: '#059669' },
    tagCarbProtein: { backgroundColor: '#D97706' },
    tagDefault: { backgroundColor: '#6B7280' },
    namePriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4, },
    itemName: { fontWeight: 'bold', color: '#111827', flex: 1, marginRight: 8, fontSize: 17, lineHeight: 22, },
    itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#111827', },
    descCaloriesRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10, },
    itemDescription: { color: '#6B7280', flex: 1, marginRight: 8, fontSize: 12.5, lineHeight: 17, },
    itemCalories: { fontSize: 13, color: '#6B7280', },
    whatsInsideContainer: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 8, marginTop: 8, },
    whatsInsideTitle: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 2, },
    whatsInsideText: { color: '#6B7280', fontSize: 11.5, lineHeight: 15, },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, marginTop: 50, },
    emptyText: { fontSize: 18, fontWeight: '600', color: '#374151', textAlign: 'center', marginBottom: 8, },
    emptySubText: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 20, },
    emptyButton: { marginTop: 10, borderColor: '#10B981', borderWidth: 1, }
});

export default MenuListScreen;