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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import auth from '@react-native-firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import LeftCircle from '@/assets/images/left-bg-circle.png';
import RightCircle from '@/assets/images/right-bg-circle.png';
import BottomCircle from '@/assets/images/bottom-bg-circle.png';
import { FontAwesome } from '@expo/vector-icons';

async function createUserDocument(
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  username: string
) {
  const db = getFirestore();
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    email,
    uid,
    firstName,
    LastName: lastName,
    xp: 0,
    level: 1,
    totalPoints: 0,
    dailyStreak: 0,
    dailyScans: 0,
    totalScans: 0,
    lastLoginUpdate: Date.now(),
    lastStreakUpdate: Date.now(),
    footprint: 0,
    spiritTrash: '',
    username,
    friendsList: [],
    friendRequestsSent: [],
    friendRequestsReceived: [],
    blockedUsers: [],
  });
}

async function populateMissions(uid: string) {
  const db = getFirestore();
  const missionsRef = collection(db, 'missions');
  const userMissionsRef = collection(db, 'users', uid, 'missions');
  const missionsSnapshot = await getDocs(query(missionsRef, where('status', '==', true)));
  const batch = writeBatch(db);
  missionsSnapshot.forEach(docSnap => {
    const userMissionRef = doc(userMissionsRef, docSnap.id);
    batch.set(userMissionRef, {
      ...docSnap.data(),
      id: docSnap.id,
      progress: 0,
      userStatus: false,
      assignedAt: serverTimestamp(),
    });
  });
  await batch.commit();
}

async function populateAchievements(uid: string) {
  const db = getFirestore();
  const achRef = collection(db, 'achievements');
  const userAchRef = collection(db, 'users', uid, 'achievements');
  const achSnapshot = await getDocs(achRef);
  const batch = writeBatch(db);
  achSnapshot.forEach(docSnap => {
    const userDoc = doc(userAchRef, docSnap.id);
    batch.set(userDoc, {
      ...docSnap.data(),
      id: docSnap.id,
      progress: 0,
      userStatus: false,
    });
  });
  await batch.commit();
}

export default function SignupCredentials() {
  const router = useRouter();
  const { username, firstName, lastName } = useLocalSearchParams<{
    username: string;
    firstName: string;
    lastName: string;
  }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match");
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!re.test(password)) {
      Alert.alert(
        'Error',
        'Must contain upper, lower, number, and be ≥6 chars'
      );
      return false;
    }
    return true;
  };

  const signUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
    if (!validatePassword()) return;

    setLoading(true);
    try {
      const resp = await auth().createUserWithEmailAndPassword(email, password);
      if (resp.additionalUserInfo?.isNewUser) {
        const uid = resp.user.uid;
        await createUserDocument(
          uid,
          email,
          firstName!,
          lastName!,
          username!
        );
        await populateMissions(uid);
        await populateAchievements(uid);
        router.replace('/home');
      } else {
        Alert.alert('Info', 'Account already exists.');
      }
    } catch (e: any) {
      Alert.alert('Registration failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#48BB78', '#009838']} style={{ flex: 1 }}>
      <Image source={LeftCircle} className="absolute" />
      <Image source={RightCircle} className="absolute top-56 right-0" />
      <Image
        source={BottomCircle}
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        className="flex-1"
      >
        <SafeAreaView className="mx-5 pt-10 flex-1">
          <Text className="text-white text-4xl font-semibold mt-16 pl-1">
            Create Account
          </Text>

          <View className="flex-1 justify-center">
            {/* Email */}
            <View className="flex-row justify-center items-center">
              <TextInput
                className="flex-1 pl-10 my-1 h-14 border-b border-white rounded-md p-2 text-[16px] text-white"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Email"
                placeholderTextColor="#fff"
              />
              <FontAwesome
                name="envelope-open"
                size={19}
                color="white"
                className="absolute left-2"
              />
            </View>

            {/* Password */}
            <View className="flex-row justify-center items-center">
              <TextInput
                className="flex-1 pl-10 my-1 h-14 border-b border-white rounded-md p-2 text-[16px] text-white"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Password"
                placeholderTextColor="#fff"
              />
              <FontAwesome
                name="lock"
                size={26}
                color="white"
                className="absolute left-2"
              />
            </View>

            {/* Confirm Password */}
            <View className="flex-row justify-center items-center">
              <TextInput
                className="flex-1 pl-10 my-1 h-14 border-b border-white rounded-md p-2 text-[16px] text-white"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm Password"
                placeholderTextColor="#fff"
              />
              <FontAwesome
                name="lock"
                size={26}
                color="white"
                className="absolute left-2"
              />
            </View>

            {loading ? (
              <ActivityIndicator size="small" className="m-7" />
            ) : (
              <Pressable
                onPress={signUp}
                className="h-14 bg-lightestGreen rounded-full items-center justify-center mt-4"
              >
                <Text className="text-mediumGreen text-xl font-semibold">
                  Sign Up
                </Text>
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
