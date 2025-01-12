import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ImageEditor from "@react-native-community/image-editor";

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
    cropImage();
  }, [imageDimensions]);

  useEffect(() => {
    classifyWaste();
  }, [croppedImage, base64Image]);

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
