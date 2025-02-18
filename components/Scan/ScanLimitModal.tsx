import { StyleSheet, Text, View, Modal, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface ScanStreakModalProps {
  onClose: () => void;
  isVisible: boolean;
}

const ScanLimitModal: React.FC<ScanStreakModalProps> = ({ onClose, isVisible }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
    >
      <View 
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} 
      >
        <View className="bg-white p-5 rounded-lg w-11/12 mx-auto mt-20">
          <View className="flex flex-row justify-between">
            <Text className="text-2xl font-bold">Scan Limit Reached</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </Pressable>
          </View>
          <Text className="text-lg py-4">You have reached your daily scan limit of 3 scans.</Text>
          <Text className="text-lg">Please try again tomorrow.</Text>
        </View>
      </View>
    </Modal>
  )
}

export default ScanLimitModal
