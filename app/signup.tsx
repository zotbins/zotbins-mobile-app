import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  View,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import LinearGradient from 'react-native-linear-gradient';
import Background from '@/assets/images/background.png';
import { FontAwesome } from '@expo/vector-icons';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const goNext = () => {
    if (!username || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
    setLoading(true);
    router.push({
      pathname: '/signupCredentials',
      params: { username, firstName, lastName },
    });
  };

  return (
    <ImageBackground
      source={Background}
      resizeMode="cover"
      className="flex-1"
    >

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        className="flex-1"
      >
        <SafeAreaView className="mx-5 pt-10 flex-1">
          <Text className="text-white text-4xl font-semibold mt-16">
            Create Account
          </Text>

          <View className="flex-1 justify-center">
            {/* Username */}
            <View className="flex-row justify-center items-center">
              <TextInput
                className="flex-1 pl-10 my-1 h-14 border-b border-white rounded-md p-2 text-[16px] text-white"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholder="Username"
                placeholderTextColor="#fff"
              />
              <FontAwesome
                name="user"
                size={26}
                color="white"
                className="absolute left-2"
              />
            </View>

            {/* First Name */}
            <View className="flex-row justify-center items-center">
              <TextInput
                className="flex-1 pl-10 my-1 h-14 border-b border-white rounded-md p-2 text-[16px] text-white"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor="#fff"
              />
              <FontAwesome
                name="user"
                size={26}
                color="white"
                className="absolute left-2"
              />
            </View>

            {/* Last Name */}
            <View className="flex-row justify-center items-center">
              <TextInput
                className="flex-1 pl-10 my-1 h-14 border-b border-white rounded-md p-2 text-[16px] text-white"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                placeholderTextColor="#fff"
              />
              <FontAwesome
                name="user"
                size={26}
                color="white"
                className="absolute left-2"
              />
            </View>

            {/* {loading ? (
              <ActivityIndicator size="small" className="m-7" />
            ) : ( */}
            <Pressable
              onPress={goNext}
              className="h-14 bg-lightestGreen rounded-full items-center justify-center mt-4"
            >
              <Text className="text-mediumGreen text-xl font-semibold">
                Next
              </Text>
            </Pressable>
            {/* )} */}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
