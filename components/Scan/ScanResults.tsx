import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import ImageEditor from "@react-native-community/image-editor";
import { getFirestore, getDoc, doc, increment, updateDoc } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import { updateAchievementProgress, updateMissionProgress } from "@/functions/src/updateProgress";

interface ScanResultsProps {
  image: string | null;
  imageDimensions: [number, number] | null;  
  setImage: (image: string | null) => void;
}

const ScanResults: React.FC<ScanResultsProps> = ({ image, imageDimensions, setImage }) => {
  const [base64Image, setBase64Image] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [wasteObject, setWasteObject] = useState<string>("");
  const [wasteCategory, setWasteCategory] = useState<string>("");

  useEffect(() => { 
    const fetchData = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        try {
          const docSnapshot = await getDoc(userRef);
          if (docSnapshot.exists) {
            const currentXP = docSnapshot.data()?.xp || 0;
            const currentLevel = docSnapshot.data()?.level || 1;
            const requiredXPforNextLevel = 50 * currentLevel;
            const newXP = currentXP + 10;

            if (newXP >= requiredXPforNextLevel) {
              const updateXP = newXP - requiredXPforNextLevel;
              await updateDoc(userRef, { xp: updateXP, level: increment(1) });
              await updateAchievementProgress("level", 1);
            } else {
              await updateDoc(userRef, { xp: increment(10) });
              // Gets the last scan date from firebase
              const lastScanDate = docSnapshot.data()?.lastScanDate;
              const todayDateString = new Date().toISOString().split("T")[0];

              await updateDoc(userRef, { dailyScans: increment(1) });
              await updateDoc(userRef, { totalScans: increment(1) });
              await updateAchievementProgress("scan", 1);
              await updateMissionProgress("scan", 1);
              // Only award points if the user hasn't scanned today
              // Update dailyStreak for scanning
              if (lastScanDate !== todayDateString) {
                await updateDoc(userRef, {
                  lastScanDate: todayDateString,
                  totalPoints: increment(10),
                  dailyStreak: increment(1),
                  lastStreakUpdate: Date.now(),
                });
                // Check if dailyStreak is greater than 1 to award extra points for daily streak
                const dailyStreak = docSnapshot.data()?.dailyStreak || 0;
                if (dailyStreak > 1) {
                  await updateDoc(userRef, { totalPoints: increment(2) });
                  updateAchievementProgress("points", 12);
                  updateMissionProgress("points", 12);
                } else {
                  updateAchievementProgress("points", 10);
                  updateMissionProgress("points", 10);
                }
              }
            }
          }
        } catch (error) {
          console.error("Error getting user data: ", error);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    cropImage();
  }, [image, imageDimensions]);

  useEffect(() => {
    classifyWaste();
  }, [croppedImage, base64Image]);

  // crop image to be 1600 x 1600 pixels for waste recognition model
  // center-crop with clamped offsets to ensure x, y >= 0
  const cropImage = () => {
    if (!image || !imageDimensions) return;

    const [imgW, imgH] = imageDimensions;
    const desiredCropSize = 1600;
    const cropW = Math.min(desiredCropSize, imgW);
    const cropH = Math.min(desiredCropSize, imgH);
    const offsetX = Math.max(0, (imgW - cropW) / 2);
    const offsetY = Math.max(0, (imgH - cropH) / 2);

    const cropData = {
      offset: { x: offsetX, y: offsetY },
      size: { width: cropW, height: cropH },
      displaySize: { width: cropW / 2, height: cropH / 2 },
      includeBase64: true,
    };

    ImageEditor.cropImage(image, cropData)
      .then((result) => {
        const res: any = result;
        setCroppedImage(res.uri || result);
        // TODO: fix TS
        // @ts-ignore
        setBase64Image(res.base64);
      })
      .catch((err) => {
        console.error("Crop error:", err);
      });
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
          console.error(err);
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
    <View className="flex-1 w-full h-12 items-center justify-center">
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

        <Text className="text-blue text-xl py-4">
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
