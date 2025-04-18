import React, { forwardRef } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { View, Text, Pressable } from 'react-native'
import WasteItemResult, { WasteObject } from './WasteItemResult'
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ScanBottomSheetModalProps {
  onClose: () => void;
  wasteObjects: WasteObject[];
}

const ScanBottomSheetModal = forwardRef<BottomSheetModal, ScanBottomSheetModalProps>(
  ({ onClose, wasteObjects }, ref) => {
    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={[]}
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
                    onPress={() => {router.back()}}
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