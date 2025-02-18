import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import AccordionItem from "./AccordionItem";

interface AccordionProps {
  questions: string[][];
}

// accepts a list of list of strings: questions[[q, a]]
const Accordion: React.FC<AccordionProps> = ({ questions }) => {
  return questions.map((question: string[], index: number) => (
    <View className="px-2" key={index}>
      <AccordionItem question={question[0]} answer={question[1]} row={index} />
    </View>
  ));
};

export default Accordion;
