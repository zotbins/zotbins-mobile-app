import React from "react";
import { View, Text, Pressable } from "react-native";

interface VerificationPopupProps {
  onClose: () => void;
  onResend: () => void;
}

const VerificationPopup: React.FC<VerificationPopupProps> = ({
  onClose,
  onResend,
}) => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <View
        style={{
          backgroundColor: "#F5FFF5",
          width: "80%",
          padding: 24,
          borderRadius: 24,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          position: "relative",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#14532d",
            paddingVertical: 16,
            textAlign: "center",
          }}
        >
          Verify Your New Email
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: "#374151",
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          A verification email has been sent to your new address.{"\n"}
          Please confirm your new email.{"\n"}
          If you did not receive it in your inbox,{"\n"}
          please wait a few minutes before requesting resend.
        </Text>
        <Pressable
          onPress={onResend}
          style={{
            backgroundColor: "#48bb78",
            paddingHorizontal: 32,
            paddingVertical: 12,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Resend
          </Text>
        </Pressable>

        <Pressable
          onPress={onClose}
          style={{ position: "absolute", top: 12, right: 12 }}
        >
          <Text style={{ fontSize: 20, color: "#14532d", fontWeight: "bold" }}>
            ×
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default VerificationPopup;