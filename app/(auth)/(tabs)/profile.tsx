// import { getAuth } from "@react-native-firebase/auth";
// import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
// import {
//   getStorage,
//   ref,
//   getDownloadURL,
// } from "@react-native-firebase/storage";
// import * as ImagePicker from "expo-image-picker";
// import { Stack, useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   Alert,
//   Image,
//   ImageSourcePropType,
//   Pressable,
//   Text,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
// import LinearGradient from "react-native-linear-gradient";
// import Header from "@/components/Reusables/Header";
// import SimpleLogoSvg from "@/components/Reusables/SimpleLogoSVG";
// import SettingsButton from "@/components/Profile/settingsButton.svg";
// import ProfileBanner from "@/components/Profile/profile-banner.svg";
// import SpiritIcon from "@/components/Profile/spiritIcon.svg";
// import StreakIcon from "@/components/Profile/streakIcon.svg";
// import Achievements from "../achievements";

// const Profile = () => {
//   const router = useRouter();

//   const user = getAuth().currentUser;
//   // set profile picture to user's photoURL or placeholder image
//   const [profilePic, setProfilePic] = useState<string | ImageSourcePropType>(
//     user?.photoURL || require("@/assets/images/default_profile_picture.png")
//   );

//   const getImageSource = (source: string | ImageSourcePropType) => {
//     if (typeof source === "string") {
//       return { uri: source };
//     }
//     return source;
//   };

//   const [userDoc, setUserDoc] = useState<any>(null);
//   const [showPasswordForm, setShowPasswordForm] = useState(false);

//   // on user change, fetch user document from firestore
//   useEffect(() => {
//     const fetchUserDoc = async () => {
//       const uid = user?.uid;
//       if (!uid) {
//         return;
//       }

//       try {
//         const db = getFirestore();
//         const userDocRef = doc(db, "users", uid);
//         const userDocSnap = await getDoc(userDocRef);
//         if (!userDocSnap.exists) {
//           throw new Error("User document does not exist");
//         }
//         setUserDoc(userDocSnap.data());
//       } catch (error) {
//         console.error("Error fetching user document: ", error);
//         Alert.alert("Error", "Failed to fetch user document");
//       }
//     };

//     fetchUserDoc();
//   });

//   // request permission to access camera roll
//   const requestPermission = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(
//         "Sorry, we need camera roll permissions to add a profile picture!"
//       );
//     }
//   };

//   // pick image from camera roll, upload to firebase storage, and set user photoURL to storage URL
//   const pickImage = async () => {
//     requestPermission();

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0,
//     });

//     if (!result.canceled && result.assets) {
//       const selectedImageUri = result.assets[0].uri;
//       const uid = user?.uid;

//       if (!uid) {
//         return;
//       }

//       const storage = getStorage();
//       const storageRef = ref(storage, `zotzero-user-profile-pics/${uid}`);
//       const uploadTask = storageRef.putFile(selectedImageUri);

//       uploadTask.on(
//         "state_changed",
//         () => {},
//         (error) => {
//           console.error(error);
//         },
//         async () => {
//           const downloadURL = await getDownloadURL(storageRef);
//           user?.updateProfile({ photoURL: downloadURL });
//           setProfilePic(downloadURL);
//         }
//       );
//     }
//   };

//   return (
//     <>
//       <Stack.Screen options={{ headerShown: false }} />

//       <LinearGradient colors={["#F5FFF5", "#DBFFD8"]} style={{ flex: 1 }}>
//         <SafeAreaView className="flex justify-center items-center w-full">
//           <View className="w-11/12 flex flex-row justify-between items-baseline h-16">
//             <SimpleLogoSvg width={100} height={100} />
//             <SettingsButton width={50} />
//           </View>

//           <View className="relative mb-5">
//             <ProfileBanner />
//             <View className="absolute left-0 right-0 bottom-3 flex items-center justify-center">
//               <Pressable onPress={pickImage}>
//                 {/* <Image
//                   source={{ uri: profilePic }}
//                   className="w-24 h-24 rounded-full"
//                 /> */}
//                 <Image
//                   source={getImageSource(profilePic)}
//                   className="w-24 h-24 rounded-full"
//                 />
//                 <View className="absolute bottom-0 right-0 bg-mediumGreen rounded-full p-2">
//                   <FontAwesome name="pencil" size={14} color="white" />
//                 </View>
//               </Pressable>
//             </View>
//           </View>

//           <View className="w-10/12">
//             <LinearGradient
//               colors={["#018029", "#DFFFE3", "#b4fabd", "#004c18"]}
//               style={{
//                 padding: 1.3,
//                 borderRadius: 35,
//               }}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               className="mb-4 shadow-lg"
//               locations={[0.1, 0.5, 0.8, 1]}
//             >
//               <View className="bg-lightBackground rounded-full py-2 px-6 flex flex-row items-center justify-between">
//                 <View className="flex flex-col items-center">
//                   <SpiritIcon />
//                   <Text className="font-medium text-sm">Spirit Trash</Text>
//                 </View>

//                 <View className="flex flex-col items-center pr-4">
//                   <Text className="font-semibold">Level 4</Text>
//                   <Text className="text-xs">20/100 XP to reach Level 5</Text>
//                 </View>

//                 <View className="flex flex-col items-center">
//                   <View className="flex flex-row items-center gap-x-1">
//                     <Text>16</Text>
//                     <StreakIcon />
//                   </View>
//                   <Text className="font-medium text-sm">Streak</Text>
//                 </View>
//               </View>
//             </LinearGradient>
//           </View>
//         </SafeAreaView>

//         <View className="flex flex-col">
//           <Text className="text-xl font-medium">
//             Achievements <Text className="text-sm">See all</Text>
//           </Text>
//         </View>

//         <Achievements className="flex-1" />

//         <View className="flex-1 p-4">
//           <View className="flex-row justify-between items-center mb-4">
//             <View className="items-center">
//               <Text className="text-black text-lg font-bold">Footprint</Text>
//               <Text className="text-black">{userDoc?.footprint}</Text>
//             </View>
//             <View className="items-center">
//               <Text className="text-black text-lg font-bold">Spirit Trash</Text>
//               <Text className="text-black">{userDoc?.spiritTrash}</Text>
//             </View>
//           </View>

//           <Pressable
//             onPress={() => router.push("/envimpact")}
//             className="bg-blue py-3 rounded-lg"
//           >
//             <Text className="text-white text-center">
//               Check Environmental Impact
//             </Text>
//           </Pressable>

//           {/* Friends container */}
//           <View className="pb-2">
//             <Pressable
//               onPress={() => router.push("/friendrequests")}
//               className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
//             >
//               <Text className="text-white text-center">Friend Requests</Text>
//             </Pressable>
//             <Text className="text-xl text-center font-bold">Friends</Text>
//             {userDoc?.friendsList?.length > 0 ? (
//               // TODO: Update types
//               userDoc.friendsList.map((friend: any, index: number) => (
//                 <Text key={index} className="text-center">
//                   {friend}
//                 </Text>
//               ))
//             ) : (
//               <Text>No friends added yet!</Text>
//             )}
//           </View>

//           <Pressable
//             onPress={() => router.push("/achievements")}
//             className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
//           >
//             <Text className="text-white text-center">Achievements</Text>
//           </Pressable>

//           <Pressable
//             onPress={() => router.push("/faq")}
//             className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
//           >
//             <Text className="text-white text-center">FAQ</Text>
//           </Pressable>

//           <Pressable
//             onPress={() => router.replace("/(auth)/spirittrash")}
//             className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
//           >
//             <Text className="text-white text-center">
//               Retake Spirit Trash Quiz
//             </Text>
//           </Pressable>

//           <Pressable
//             onPress={() => getAuth().signOut()}
//             className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
//           >
//             <Text className="text-white text-center">Sign Out</Text>
//           </Pressable>

//           <Pressable
//             onPress={() => router.push("/passwordchange")}
//             className="bg-blue px-4 py-3 rounded-lg my-2 active:opacity-50"
//           >
//             <Text className="text-white text-center">Change Password</Text>
//           </Pressable>
//         </View>
//       </LinearGradient>
//     </>
//   );
// };

// export default Profile;
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
} from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient";
import Header from "@/components/Reusables/Header";
import SimpleLogoSvg from "@/components/Reusables/SimpleLogoSVG";
import SettingsButton from "@/components/Profile/settingsButton.svg";
import ProfileBanner from "@/components/Profile/profile-banner.svg";
import SpiritIcon from "@/components/Profile/spiritIcon.svg";
import StreakIcon from "@/components/Profile/streakIcon.svg";
import StatusBar from "@/components/Profile/statusBar.svg";
import Achievements from "../achievements";
import Settings from "../settings";

const Profile = () => {
  const router = useRouter();

  const user = getAuth().currentUser;
  // set profile picture to user's photoURL or placeholder image
  const [profilePic, setProfilePic] = useState<string | ImageSourcePropType>(
    user?.photoURL || require("@/assets/images/default_profile_picture.png")
  );

  const getImageSource = (source: string | ImageSourcePropType) => {
    if (typeof source === "string") {
      return { uri: source };
    }
    return source;
  };

  const [userDoc, setUserDoc] = useState<any>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // on user change, fetch user document from firestore
  useEffect(() => {
    const fetchUserDoc = async () => {
      const uid = user?.uid;
      if (!uid) {
        return;
      }

      try {
        const db = getFirestore();
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists) {
          throw new Error("User document does not exist");
        }
        setUserDoc(userDocSnap.data());
      } catch (error) {
        console.error("Error fetching user document: ", error);
        Alert.alert("Error", "Failed to fetch user document");
      }
    };

    fetchUserDoc();
  });

  // request permission to access camera roll
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Sorry, we need camera roll permissions to add a profile picture!"
      );
    }
  };

  // pick image from camera roll, upload to firebase storage, and set user photoURL to storage URL
  const pickImage = async () => {
    requestPermission();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    });

    if (!result.canceled && result.assets) {
      const selectedImageUri = result.assets[0].uri;
      const uid = user?.uid;

      if (!uid) {
        return;
      }

      const storage = getStorage();
      const storageRef = ref(storage, `zotzero-user-profile-pics/${uid}`);
      const uploadTask = storageRef.putFile(selectedImageUri);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(storageRef);
          user?.updateProfile({ photoURL: downloadURL });
          setProfilePic(downloadURL);
        }
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient colors={["#F5FFF5", "#DBFFD8"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex justify-center items-center w-full">
              <View className="w-11/12 flex flex-row justify-between items-baseline h-16">
                <SimpleLogoSvg width={100} height={100} />
                <SettingsButton width={50} />
              </View>

              <View className="relative mb-5">
                <ProfileBanner />
                <View className="absolute left-0 right-0 bottom-3 flex items-center justify-center">
                  <Pressable onPress={pickImage}>
                    <Image
                      source={getImageSource(profilePic)}
                      className="w-24 h-24 rounded-full"
                    />
                    <View className="absolute bottom-0 right-0 bg-mediumGreen rounded-full p-2">
                      <FontAwesome name="pencil" size={14} color="white" />
                    </View>
                  </Pressable>
                </View>
              </View>

              <View className="w-[336px]">
                <LinearGradient
                  colors={["#018029", "#DFFFE3", "#b4fabd", "#004c18"]}
                  style={{
                    padding: 1.3,
                    borderRadius: 35,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="mb-4 shadow-lg"
                  locations={[0.1, 0.5, 0.8, 1]}
                >
                  <View className="bg-lightBackground rounded-full py-2 flex flex-row items-center justify-between">
                    <View className="flex flex-col items-center w-1/4">
                      <SpiritIcon />
                      <Text className="font-medium text-xs">
                        {userDoc?.spiritTrash}
                      </Text>
                    </View>

                    <View className="flex flex-col items-center w-2/4 ">
                      <Text className="font-semibold">Level 4</Text>
                      <StatusBar />

                      <Text className="text-[9px] text-center">
                        20/100 XP to reach Level 5
                      </Text>
                    </View>

                    <View className="flex flex-col items-center w-1/4">
                      <View className="flex flex-row items-center gap-x-1">
                        <Text>16</Text>
                        <StreakIcon />
                      </View>
                      <Text className="font-medium text-xs">Streak</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>

            <View className="flex flex-col">
              <Text className="text-xl font-medium">
                Achievements <Text className="text-sm">See all</Text>
              </Text>
            </View>

            <Achievements />

            <View className="px-4">
              <Settings />

              <Text>IGNORE EVERYTHING BELOW - OG </Text>

              {/* ignore below */}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

export default Profile;
