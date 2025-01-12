import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { Camera } from "react-native-vision-camera";

interface CameraViewProps {
  device: any;
  cameraVisible: boolean;
  setCamera: (ref: any) => void;
  takePicture: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({
  device,
  cameraVisible,
  setCamera,
  takePicture,
}) => {
  return (
    <>
      <View className="bg-black/30 z-10 w-screen h-screen flex justify-center items-center">
        <View className="border-4 border-dashed rounded-md border-white bg-white/20 w-96 h-96 z-20" />
      </View>

      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={cameraVisible}
        ref={(ref) => setCamera(ref)}
        photo={true}
      />

      <Pressable
        className="p-3 rounded-lg bottom-12 absolute z-20"
        onPress={takePicture}
      >
        <View className="border-4 border-white p-4 rounded-full">
          <View className="w-12 h-12 rounded-full" />
        </View>
      </Pressable>
    </>
  );
};

export default CameraView;
