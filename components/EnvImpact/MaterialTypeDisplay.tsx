import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

interface MaterialItem {
  label: string;
  count: number;
}

interface MaterialTypeDisplayProps {
  materials: MaterialItem[];
}

const PiecesCount = ({ count }: { count: number }) => (
  <View>
    <LinearGradient
      colors={['#004c18', '#7bff90', '#44ff5c']}
      style={{ borderRadius: 200, padding: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.5 }}
    >
      <View className="rounded-full items-center justify-center p-3 py-2 bg-white">
        <Text className="text-darkGreen text-xl font-semibold">
          {count} pieces
        </Text>
      </View>
    </LinearGradient>
  </View>
);

const MaterialTypeDisplay: React.FC<MaterialTypeDisplayProps> = ({ materials }) => {
  return (
    <View className="mb-10">
      <Text className="text-3xl text-center text-darkGreen font-bold py-6">Materials</Text>
      
      {materials.map((material, index) => (
        <View 
          key={index}
          className="flex-row items-center justify-between border border-darkGreen rounded-full px-6 py-4 mb-6 bg-white"
        >
          <Text className="text-2xl font-semibold">{material.label}</Text>
          <PiecesCount count={material.count} />
        </View>
      ))}
    </View>
  );
};

export default MaterialTypeDisplay;
