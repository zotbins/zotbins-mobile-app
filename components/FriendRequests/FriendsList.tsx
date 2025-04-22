import React from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { getFirestore, doc, getDoc, getDocs, where, query, collection } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';

const FriendsList = () => {
    const getFriendsList = async () => {
        const db = getFirestore();
        const user = getAuth().currentUser;

    }
    return (
        <View className="mx-6">
        <View className="flex-row items-center mb-5">
            <Text className="text-darkGreen text-4xl font-semibold mt-3">Friends List</Text>
            {/* {getFriendsList()} */}
        </View>
      </View>
    )
}

export default FriendsList;