import React, { forwardRef } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { View, Text, Pressable, Alert } from 'react-native'
import WasteItemResult, { WasteObject } from './WasteItemResult'
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import storage from '@react-native-firebase/storage';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';

interface ScanBottomSheetModalProps {
  onClose: () => void;
  wasteObjects: WasteObject[];
  image: string | null;
}

const ScanBottomSheetModal = forwardRef<BottomSheetModal, ScanBottomSheetModalProps>(
  ({ onClose, wasteObjects, image }, ref) => {
    
    const handleScanSubmit = async () => {
      try {
        if (image) {
          const user = getAuth().currentUser;
          
          if (user) {
            const timestamp = new Date().getTime();
            const filename = `waste-scan-${timestamp}.jpg`;
            const storageRef = storage().ref(`zotbins-waste-images/${user.uid}/${filename}`);
                        
            await storageRef.putFile(image);
            
            const downloadURL = await storageRef.getDownloadURL();
            
            const db = getFirestore();
            const wasteImageData = {
              userId: user.uid,
              imageUrl: downloadURL,
              timestamp: serverTimestamp(),
              fileName: filename,
              wasteObjects: wasteObjects.map(item => ({
                name: item.name,
                material: item.material,
                category: item.category
              })),
              location: {
                latitude: null,
                longitude: null
              }
            };

            await addDoc(collection(db, 'waste-images'), wasteImageData);
            
            console.log('Image uploaded and metadata stored successfully');
            
            router.back();
            Alert.alert(
              "Scan Submitted",
              "Your scan has been submitted successfully.",
              [{ text: "OK" }],
              { cancelable: false }
            );
          } else {
            Alert.alert("Error", "Log in failed.");
          }
        } else {
          Alert.alert("Error", "No image to upload.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        Alert.alert(
          "Upload Failed",
          "There was an error uploading your scan. Please try again."
        );
      }
    };
    
    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={['50%']}
        enablePanDownToClose
        onDismiss={onClose}
        backgroundStyle={{ backgroundColor: '#F0FFF4' }}
      >
        <BottomSheetView>
          <View className="items-center px-4 pb-4">
            <Text className="text-xl font-bold mb-3 text-darkGreen">{wasteObjects.length} {wasteObjects.length == 1 ? "Item Scanned" : "Items Scanned"}</Text>
            {/* render each result */}
            {wasteObjects.map((item, idx) => (
              <WasteItemResult
                key={idx}
                name={item.name}
                material={item.material}
                category={item.category}
              />
            ))}
            <View className="w-full flex-row justify-between mt-4 mb-2">
                <Pressable
                    onPress={onClose}
                    className="bg-lightBackground rounded-xl p-2 px-8 border border-darkGreen items-center justify-center shadow-lg"
                >
                    <Text className="text-darkGreen font-semibold text-md">Retake</Text>
                </Pressable>
                <Pressable
                    onPress={handleScanSubmit}
                    className="flex-row bg-brightGreen rounded-xl p-2 px-10 border border-darkGreen items-center justify-center shadow-lg"
                >
                    <Text className="text-darkGreen font-semibold text-md -translate-x-1">Submit</Text>
                    <Ionicons name="arrow-forward" size={20} color="#004c18" className="absolute right-2" />
                </Pressable>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    )
  }
)

export default ScanBottomSheetModal