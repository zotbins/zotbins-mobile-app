import BackButton from "@/components/Reusables/BackButton";
import CameraView from "@/components/Scan/CameraView";
import ScanResults from "@/components/Scan/ScanResults";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";

const CameraScreen = () => {
  const [cameraVisible, setCameraVisible] = useState<boolean>(false);

  const [image, setImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<
    [number, number] | null
  >(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const [camera, setCamera] = useState<Camera | null>(null);
  const device = useCameraDevice("back");

  // request camera permission and set cameraVisible to true if permission granted
  const requestCameraPermission = async () => {
    try {
      const permission = await Camera.requestCameraPermission();

      if (permission === "granted") {
        setHasPermission(true);
        if (device) {
          setCameraVisible(true);
        }
      } else {
        setHasPermission(false);
      }
    } catch (error) {
      console.error("Camera permission error:", error);
      setHasPermission(false);
    }
  };

  // take picture with camera and set image state, rendering ScanResults component
  const takePicture = async () => {
    try {
      if (!camera) return;

      const photo = await camera.takePhoto();
      setImage(photo.path);
      setImageDimensions([photo.height, photo.width]);
    } catch (error) {
      console.error("Take picture error:", error);
      Alert.alert("Camera Error", "Failed to take picture");
    }
  };

  // request camera permission on mount
  useEffect(() => {
    requestCameraPermission();
  }, []);

  // only render camera view if camera permission granted and camera available
  useEffect(() => {
    if (hasPermission === false || !device) {
      router.back();
      Alert.alert(
        "Camera Unavailable",
        "Please ensure camera permissions are granted and a camera is available.",
        [{ text: "OK" }]
      );
    }
  }, [hasPermission, device]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTransparent: true,
          headerLeft: () => <BackButton />,
          headerTitle: "",
        }}
      />
      <View className="flex-1 bg-white items-center justify-center">
        {hasPermission === null ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : !image ? (
          <CameraView
            device={device}
            cameraVisible={cameraVisible}
            setCamera={setCamera}
            takePicture={takePicture}
          />
        ) : (
          <ScanResults
            image={image}
            imageDimensions={imageDimensions}
            setImage={setImage}
          />
        )}
      </View>
    </>
  );
};

export default CameraScreen;
