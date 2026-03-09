import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";

export default function AnimatedSplash() {
  const text = "SkillSwap".split("");

  const translateY = useRef(text.map(() => new Animated.Value(-60))).current;

  const scale = useRef(text.map(() => new Animated.Value(0.5))).current;

  useEffect(() => {
    const animations = text.map((_, i) =>
      Animated.parallel([
        Animated.spring(translateY[i], {
          toValue: 0,
          friction: 8, // more friction = slower bounce
          tension: 40, // lower tension = slower motion
          delay: i * 180, // delay between letters
          useNativeDriver: true,
        }),
        Animated.spring(scale[i], {
          toValue: 1,
          friction: 8,
          tension: 40,
          delay: i * 180,
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.stagger(180, animations).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {text.map((letter, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.letter,
              {
                transform: [
                  { translateY: translateY[index] },
                  { scale: scale[index] },
                ],
              },
            ]}
          >
            {letter}
          </Animated.Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  letter: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#fff",
    marginHorizontal: 2,

    // static glow effect
    textShadowColor: "#00ffff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
});
