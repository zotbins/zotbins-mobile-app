import React, { forwardRef } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { View, Text, Pressable } from 'react-native'

interface ScanBottomSheetModalProps {
  onClose: () => void;
}

const ScanBottomSheetModal = forwardRef<BottomSheetModal, ScanBottomSheetModalProps>(
  ({ onClose }, ref) => {
    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={['50%', '90%']}  // ← give at least one snap point
        enablePanDownToClose
        onDismiss={onClose}
      >
        <BottomSheetView>
          <View className="items-center p-4">
            <Text className="text-lg font-bold mb-3">Scan Results</Text>
            <Pressable className="mt-2 p-2 bg-blue-500 rounded" onPress={onClose}>
              <Text className="text-white">Dismiss</Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    )
  }
)

export default ScanBottomSheetModal