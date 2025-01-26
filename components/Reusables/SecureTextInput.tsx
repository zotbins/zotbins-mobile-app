import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, Pressable, View } from "react-native";

interface SecureTextInputProps {
  password: string;
  setPassword: (text: string) => void;
  placeholder: string;
  className?: any;
}

const SecureTextInput: React.FC<SecureTextInputProps> = ({
  password,
  setPassword,
  placeholder,
  className,
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <View className="relative w-72">
      <TextInput
        className={className}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        value={password}
        onChangeText={setPassword}
      />
      <Pressable
        className="absolute right-0 top-0 h-full justify-center pr-3 active:opacity-50"
        onPress={() => setSecureTextEntry(!secureTextEntry)}
      >
        <Ionicons
          name={secureTextEntry ? "eye-off" : "eye"}
          size={24}
          color="black"
        />
      </Pressable>
    </View>
  );
};

export default SecureTextInput;
