import React, { FC, memo } from "react";
import { View, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export interface WasteObject {
  name: string;
  material: string;
  category: string;
}

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: FC<CategoryBadgeProps> = memo(({ category }) => (
  <LinearGradient
    colors={['#004c18', '#7bff90', '#44ff5c']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0.5 }}
    style={{ borderRadius: 200, padding: 1 }}
  >
    <View className="rounded-full p-3 bg-lightBackground items-center justify-center">
      <Text className="text-darkGreen text-md font-semibold">{category}</Text>
    </View>
  </LinearGradient>
));
CategoryBadge.displayName = "CategoryBadge";

const WasteItemResult: FC<WasteObject> = ({ name, material, category }) => (
  <View className="flex-row justify-between items-center w-full p-4 py-8 mb-4 bg-lightBackground border border-darkGreen rounded-3xl">
    <View>
      <Text className="text-black text-xl font-bold">{name}</Text>
      <Text className="text-black text-md italic">{material}</Text>
    </View>
    <CategoryBadge category={category} />
  </View>
);

export default memo(WasteItemResult);
