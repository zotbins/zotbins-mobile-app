import { Entypo } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

interface AccordionItemProps {
  question: string;
  answer: string;
  row: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  row,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // Create a shared value for rotation angle
  const rotateValue = useSharedValue(0);
  
  // Update rotation value when isOpen changes
  useEffect(() => {
    rotateValue.value = withTiming(isOpen ? 90 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isOpen]);
  
  // Create animated style for rotation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateValue.value}deg` }],
    };
  });
  
  return (
    <LinearGradient
      colors={['#004c18', '#DFFFE3', '#DFFFE3', '#004c18']}
      style={{ padding: 1, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 3.84 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="mb-4 shadow-lg rounded-lg"
      locations={[0, 0.1, 0.9, 1]}
    >
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="bg-lightBackground rounded-xl p-4"
      >
        <View className="flex flex-row items-center ">
          <Animated.View style={animatedStyle}>
            <Entypo name="chevron-right" size={24} color="#00762B" />
          </Animated.View>
          <Text className="ml-4 font-bold text-xl text-mediumGreen w-5/6">{question}</Text>
        </View>
        {isOpen && (
          <View className=" flex flex-row items-center p-2 pb-0">
            <Text className=" text-mediumGreen">{answer}</Text>
          </View>
        )}
      </Pressable>
    </LinearGradient>
  );
};

export default AccordionItem;
