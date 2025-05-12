import React, { useEffect, useState, useRef } from "react";
import { View, Animated, Dimensions, Image } from "react-native";

/*
 * SVG implementation
 */

/*
const frames = [
  require("@/assets/images/onboarding/splash_logo_frame1.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame2.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame3.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame4.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame5.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame6.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame7.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame8.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame9.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame10.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame11.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame12.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame13.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame14.svg").default,
  require("@/assets/images/onboarding/splash_logo_frame15.svg").default,
];

const LogoAnimation = () => {
  const [frameIndex, setFrameIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(-Dimensions.get("window").width)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // first frame slide-in
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      playFirstFrames();
    });

    // first 6 frames (and then pause)
    const playFirstFrames = () => {
      interval = setInterval(() => {
        setFrameIndex((prev) => {
          if (prev + 1 === 6) {
            clearInterval(interval!);
            setTimeout(() => {
              playRemainingFrames();
            }, 1000);
            return prev + 1;
          }
          return prev + 1;
        });
      }, 120);
    };
    

    //remaining frames (after the pause)
    const playRemainingFrames = () => {
      interval = setInterval(() => {
        setFrameIndex((prev) => {
          if (prev + 1 >= frames.length) {
            clearInterval(interval!);
            return prev;
          }
          return prev + 1;
        });
      }, 90);
    };

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [slideAnim]);

  const CurrentFrame = frames[frameIndex];

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Animated.View
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: [{ translateX: slideAnim }],
        }}
      >
        <CurrentFrame width={250} height={250} />
      </Animated.View>
    </View>
  );
};

export default LogoAnimation;
*/

/*
 * PNG implementation
 */

const frames = [
  require("@/assets/images/onboarding/splash_logo_frame1.png"),
  require("@/assets/images/onboarding/splash_logo_frame2.png"),
  require("@/assets/images/onboarding/splash_logo_frame3.png"),
  require("@/assets/images/onboarding/splash_logo_frame4.png"),
  require("@/assets/images/onboarding/splash_logo_frame5.png"),
  require("@/assets/images/onboarding/splash_logo_frame6.png"),
  require("@/assets/images/onboarding/splash_logo_frame7.png"),
  require("@/assets/images/onboarding/splash_logo_frame8.png"),
  require("@/assets/images/onboarding/splash_logo_frame9.png"),
  require("@/assets/images/onboarding/splash_logo_frame10.png"),
  require("@/assets/images/onboarding/splash_logo_frame11.png"),
  require("@/assets/images/onboarding/splash_logo_frame12.png"),
  require("@/assets/images/onboarding/splash_logo_frame13.png"),
  require("@/assets/images/onboarding/splash_logo_frame14.png"),
  require("@/assets/images/onboarding/splash_logo_frame15.png"),
];

const LogoAnimation = () => {
  const [frameIndex, setFrameIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(-Dimensions.get("window").width)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // First frame slide-in
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      playFirstFrames();
    });

    // First 6 frames (and then pause)
    const playFirstFrames = () => {
      interval = setInterval(() => {
        setFrameIndex((prev) => {
          if (prev + 1 === 6) {
            clearInterval(interval!);
            setTimeout(() => {
              playRemainingFrames();
            }, 1000);
            return prev + 1;
          }
          return prev + 1;
        });
      }, 120);
    };

    // Remaining frames (after the pause)
    const playRemainingFrames = () => {
      interval = setInterval(() => {
        setFrameIndex((prev) => {
          if (prev + 1 >= frames.length) {
            clearInterval(interval!);
            return prev;
          }
          return prev + 1;
        });
      }, 90);
    };

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [slideAnim]);

  const CurrentFrame = frames[frameIndex];

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: [{ translateX: slideAnim }],
        }}
      >
        <Image source={CurrentFrame} style={{ width: 200, height: 310 }} />
      </Animated.View>
    </View>
  );
};

export default LogoAnimation;