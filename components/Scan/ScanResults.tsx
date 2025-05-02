import { router } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import ImageEditor from "@react-native-community/image-editor";
import {
  getFirestore,
  getDoc,
  doc,
  increment,
  updateDoc,
} from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import {
  updateAchievementProgress,
  updateMissionProgress,
} from "@/functions/src/updateProgress";
import ScanBottomSheetModal from "./ScanBottomSheetModal";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { WasteObject } from "./WasteItemResult";
import { LinearGradient } from "expo-linear-gradient";
import ScanIndicator from "./ScanIndicator";

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
  const [wasteObjects, setWasteObjects] = useState<WasteObject[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const scanPosition = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get("window").height;
  const bottomSheetRef = useRef<BottomSheetModal>(null);

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
    // work here for adding llava output
  }, [croppedImage, base64Image]);

  useEffect(() => {
    if (image) {
      if (wasteObjects.length > 0) {
        bottomSheetRef.current?.present();
        setIsScanning(false);
      } else {
        setIsScanning(true);
      }
    }
  }, [image, wasteObjects]);

  // animate the white scan‑bar up and down
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanPosition, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scanPosition, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    if (isScanning) animation.start();
    else animation.stop();
    return () => animation.stop();
  }, [isScanning]);

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

      const prompt = `You are a waste recognition model.
      1. Identify the main object in the image.
      2. Identify the primary material of the object.
      3. Classify that object as 'Landfill', 'Recyclable', or 'Compostable'.
      Return ONLY a JSON object containing the identified object name, its material, and its classification using the following structure and rules:
      - The JSON object must contain the keys: "object", "material", and "class".
      - The value for "object" should be the identified object name (string).
      - The value for "class" should be the classification ('Landfill', 'Recyclable', or 'Compostable').
      - If the "class" is "Recyclable", the value for "material" should be the identified primary material (string). If the "class" is 'Landfill' or 'Compostable', the value for "material" must be \`null\` (the JSON null value, not the string "null").
      The final output must only be the JSON object. Example structure: {"object": "...", "class": "...", "material": ...}`;

      const input = {
        image: `data:image/jpeg;base64,${base64Image}`,
        prompt: prompt,
      };

      const prediction = await fetch(
        "https://api.replicate.com/v1/predictions",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.EXPO_PUBLIC_REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
            prefer: "wait",
          },
          body: JSON.stringify({
            version:
              "80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb",
            stream: true,
            input,
          }),
        }
      );

      const data = await prediction.json();

      console.log("", data.output);

      const output = data.output.join("");
      const parsedOutput = JSON.parse(output);

      setTimeout(() => {
        setWasteObjects([
          {
            name: parsedOutput.object,
            material: parsedOutput.material,
            category: parsedOutput.class,
          },
        ]);
      }, 2000); // Simulate a delay for the scan result

      /*
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
      */
    }
  };

  if (!image || !imageDimensions || !croppedImage) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-bold">Loading...</Text>
      </View>
    );
  }

  return (
    <BottomSheetModalProvider>
      <ImageBackground
        source={{ uri: image }}
        resizeMode="cover"
        style={{ width: "100%", height: "100%", flex: 1 }}
      ></ImageBackground>

      {isScanning && (
        <ScanIndicator
          scanPosition={scanPosition}
          screenHeight={screenHeight}
        />
      )}

      <ScanBottomSheetModal
        ref={bottomSheetRef}
        onClose={() => {
          setImage(null);
        }}
        wasteObjects={wasteObjects}
        image={image}
      />
    </BottomSheetModalProvider>
  );
};

export default ScanResults;
