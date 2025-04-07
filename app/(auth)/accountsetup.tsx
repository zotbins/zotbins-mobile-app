import { Alert, KeyboardAvoidingView, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, {useState} from 'react'
import { getFirestore, doc, updateDoc, where, query, collection, getDocs } from '@react-native-firebase/firestore'
import { getAuth } from '@react-native-firebase/auth'
import { router, Stack } from 'expo-router'

const AccountSetup = () => {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const isUsernameAvailable = async (username: string) =>{
        const db = getFirestore();
        const q = query(collection(db, "users"), where("username", "==", username));
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty;
    }

    //update username, and first/last name in users document
    const setAccountDetails = async (username: string, firstName: string, lastName: string) => {
        if (username === "" || firstName === "" || lastName === "") {
            Alert.alert("Error", "Please fill out all fields");
            return;
        }

        if (!isUsernameAvailable(username)) {
            Alert.alert("Error", "Username is already taken");
            return;
        }
        const db = getFirestore();
        const user = getAuth().currentUser;
        if (user) {
            const userRef = doc(db, "users", user.uid);
            updateDoc(userRef, {
                username: username,
                firstName: firstName,
                lastName: lastName,
            });
        }
        // navigate to spirittrash page
        router.replace("/spirittrash");
    }
        

    return (
        <SafeAreaView className="mx-5 flex-1">
            <Stack.Screen
                options={{
                headerShadowVisible: false,
                headerBackVisible: false,
                headerTransparent: true,
                headerTitle: "",
                }}
            />
            
            
            <KeyboardAvoidingView 
            className="flex-1 justify-center"
            behavior="padding">
                <Text className="text-3xl font-bold mb-6 text-center">Let's set up your profile</Text>
                <TextInput
                className="my-1 h-14 border rounded-md p-2 bg-white"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholder="Username"
                />
                <TextInput
                className="my-1 h-14 border rounded-md p-2 bg-white"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                />
                <TextInput
                className="my-1 h-14 border rounded-md p-2 bg-white"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                />
                 <Pressable
                    className="items-center justify-center py-5 rounded-md bg-tintColor mt-2 active:opacity-50"
                    onPress={() => setAccountDetails(username, firstName, lastName)}
                  >
                    <Text className="text-white text-xl">Next</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AccountSetup
