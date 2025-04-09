import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const handleScan = () => {
    router.push('/scan');
};

const ScanCount = ({ count }: { count: number }) => (
    <View>
        <LinearGradient
            colors={['#004c18', '#7bff90', '#44ff5c']}
            style={{ borderRadius: 200, padding: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.5 }}
        >
            <View className="rounded-full items-center justify-center p-3 bg-lightBackground">
                <Text className="text-darkGreen text-md font-semibold">
                    {count}
                    <Text className="font-normal"> left</Text>
                </Text>
            </View>
        </LinearGradient>
    </View>
);

const ScanWidget = ({ scans }: { scans: number }) => (
    <LinearGradient
        colors={['#004c18', '#DFFFE3', '#DFFFE3', '#004c18']}
        style={{ padding: 1, borderRadius: 35 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="mb-4 shadow-lg"
        locations={[0, 0.1, 0.9, 1]}
    >
        <View style={{ borderRadius: 35 }} className="bg-lightBackground p-5 w-full">
            <View className="flex-row items-center justify-between mb-2">
                <Text className="text-darkGreen text-2xl font-semibold">Scan Limit</Text>
                <Pressable onPress={() => router.push('/(auth)/faq')}>
                    <Ionicons name="help-circle-outline" size={24} color="#00762b" />
                </Pressable>
            </View>
            <View className="flex-row items-center justify-between">
                <ScanCount count={scans} />
                <Pressable
                    onPress={handleScan}
                    className="bg-primaryGreen rounded-full p-3 px-6 border border-darkGreen"
                >
                    <Text className="text-white font-semibold text-md">Scan Item</Text>
                </Pressable>
            </View>
        </View>
    </LinearGradient>
);

export default ScanWidget;

