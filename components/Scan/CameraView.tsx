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
        <View className="absolute w-9/12 h-[40%]">
  
          <View className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg" />
          
          <View className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-lg" />
          
          <View className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-lg" />
          
          <View className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg" />
        </View>
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
        <View className="border-4 border-brightGreen4 rounded-full">
          <View className="p-2 rounded-full" >
            <View className="w-20 h-20 rounded-full bg-brightGreen4" />
          </View>
        </View>
      </Pressable>
    </>
  );
};

export default CameraView;
