import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";

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
  return (
    <View>
      <TouchableOpacity
        className={
          row == 0 && isOpen
            ? "border-t-2"
            : row == 0
            ? "border-y-2"
            : isOpen
            ? ""
            : "border-b-2"
        }
        onPress={() => setIsOpen(!isOpen)}
      >
        <View className="flex flex-row justify-between items-center p-4">
          <Text className="font-semibold text-xl">{question}</Text>
          <Text>
            {isOpen ? (
              <Entypo name="chevron-up" size={24} color="black" />
            ) : (
              <Entypo name="chevron-down" size={24} color="black" />
            )}
          </Text>
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View className="flex flex-row border-b-2 items-center p-4">
          <Text>{answer}</Text>
        </View>
      )}
    </View>
  );
};

export default AccordionItem;
