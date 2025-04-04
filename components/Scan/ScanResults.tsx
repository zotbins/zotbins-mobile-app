import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import ImageEditor from "@react-native-community/image-editor";
import firestore, { FieldValue } from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { updateAchievementProgress, updateMissionProgress } from "@/functions/src/updateProgress";

interface ScanResultsProps {
  image: string | null;
  imageDimensions: [number, number] | null;
  setImage: (image: string | null) => void;
}

const ScanResults: React.FC<ScanResultsProps> = ({
  image,
  imageDimensions,
  setImage,
}) => {
  const [base64Image, setBase64Image] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [wasteObject, setWasteObject] = useState<string>("");
  const [wasteCategory, setWasteCategory] = useState<string>("");

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const userRef = firestore().collection("users").doc(user.uid);
      userRef.get().then(async (docSnapshot) => {
        if (docSnapshot.exists) {
          const currentXP = docSnapshot.data()?.xp || 0;
          const currentLevel = docSnapshot.data()?.level || 1;
          const requiredXPforNextLevel = 50 * (currentLevel);
          const newXP = currentXP + 10;
          if (newXP >= requiredXPforNextLevel) {
            const updateXP = newXP - requiredXPforNextLevel;
            userRef.update({
              xp: updateXP,
              level: firestore.FieldValue.increment(1),
            });
            await updateAchievementProgress("level", 1);
          } else {
            userRef.update({
              xp: firestore.FieldValue.increment(10)
            });
            // Gets the last scan date from firebase
            const lastScanDate = docSnapshot.data()?.lastScanDate;
            const todayDateString = new Date().toISOString().split("T")[0];
            
            userRef.update({dailyScans: firestore.FieldValue.increment(1)});
            userRef.update({totalScans: firestore.FieldValue.increment(1)});
            await updateAchievementProgress("scan", 1);
            await updateMissionProgress("scan", 1);
            // Only award points if user hasn't scanned today
            // Update dailyStreak for scanning
            if (lastScanDate !== todayDateString) {
              userRef.update({
                lastScanDate: todayDateString,
                totalPoints: firestore.FieldValue.increment(10),
                dailyStreak: firestore.FieldValue.increment(1),
                lastStreakUpdate: Date.now(),
              });
              
              // Check if dailyStreak is greater than 1 to award extra points for daily streak
              const dailyStreak = docSnapshot.data()?.dailyStreak || 0;
              if (dailyStreak > 1) {
                userRef.update({
                  totalPoints: firestore.FieldValue.increment(2),
                });
                updateAchievementProgress("points", 12);
                updateMissionProgress("points", 12);
              } else {
                updateAchievementProgress("points", 10);
                updateMissionProgress("points", 10);
              }
            }
          }
        }
      }).catch((error) => {
        console.error("Error getting user data: ", error);
      });
    }
  }, []);

  useEffect(() => {
    cropImage();
  }, [imageDimensions]);

  useEffect(() => {
    classifyWaste();
  }, [croppedImage, base64Image]);

  // crop image to be 1600 x 1600 pixels for waste recognition model
  const cropImage = () => {
    if (imageDimensions) {
      const cropData = {
        offset: {
          x: imageDimensions[0] / 2 - 800,
          y: imageDimensions[1] / 2 - 800,
        },
        size: { width: 1600, height: 1600 },
        displaySize: { width: 800, height: 800 },
        includeBase64: true,
      };

      ImageEditor.cropImage(image as string, cropData)
        .then((result) => {
          setCroppedImage(result.uri);

          // TODO: fix TS
          // @ts-ignore
          setBase64Image(result.base64);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // send image to waste recognition model and get returned results
  const classifyWaste = async () => {
    if (croppedImage && base64Image) {
      const formData = new FormData();
      // TODO: fix TS
      // @ts-ignore
      formData.append("image", {
        uri: croppedImage,
        name: "image.jpg",
        type: "image/jpeg",
        data: base64Image,
      });

      // temporary endpoint through FastAPI (must be started manually)
      fetch(`http://${process.env.EXPO_PUBLIC_IPADDRESS}:8000/classify_img`, {
        method: "post",
        body: formData,
      })
        .then((response) => response.json())
        .then((json) => {
          setWasteObject(json[0].object);
          setWasteCategory(json[0].category);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  if (!imageDimensions || !croppedImage || !base64Image) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className=" flex-1 w-full h-12 items-center justify-center">
      <View className="items-center">
        <Text className="text-blue text-3xl py-4">
          Detected:{" "}
          <Text className="text-red">
            {wasteObject.charAt(0).toUpperCase() + wasteObject.slice(1)}
          </Text>
        </Text>

        {croppedImage && (
          <Image
            source={{ uri: croppedImage }}
            className="w-72 h-72 rounded-xl"
          />
        )}

        <Text className="text-blue  text-xl py-4">
          This belongs in{" "}
          <Text className="text-tintColor">
            {wasteCategory.charAt(0).toUpperCase() + wasteCategory.slice(1)}
          </Text>
          .
        </Text>
      </View>

      <View className="flex flex-row gap-4 pt-8">
        <TouchableOpacity className="bg-tintColor px-5 py-4 rounded-lg">
          <Text className="text-white" onPress={() => setImage(null)}>
            Retake Photo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue px-5 py-4 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white">Return Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScanResults;
