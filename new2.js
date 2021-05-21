import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";

const SIZE = 100;
const { width, height } = Dimensions.get("screen");

const snapPointsX = [0, width - SIZE];
const snapPointsY = [0, height - SIZE];

function App() {

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);


  const style = useAnimatedStyle(() => ({
    backgroundColor: "#0099ff",
    width: SIZE,
    aspectRatio: 1,
    borderRadius: SIZE / 2,
    position: "absolute",
    top: 0,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  const onGestureEvent = useAnimatedGestureHandler(
    {
      onStart: (_, ctx) => {
        // triggered at the start of the pan gesture
        console.log("onStart");
        ctx.x = translateX.value; // store the current translate value in the context object
        ctx.y = translateY.value;
      },
      onActive: ({ translationX, translationY }, ctx) => {
        console.log("onActive");
        translateX.value = ctx.x + translationX; // add the offset on every frame of the animation
        translateY.value = ctx.y + translationY;
        // triggered on every frame of the pan gesture
      },
      onEnd: ({ translationY, translationX, velocityX, velocityY }) => {
        const snapPointX = snapPoint(translationX, velocityX, snapPointsX);
        const snapPointY = snapPoint(translationY, velocityY, snapPointsY);

        translateX.value = withSpring(snapPointX, { velocity: velocityX });
        translateY.value = withSpring(snapPointY, { velocity: velocityY });
      },
    },
  );


  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={style} />
      </PanGestureHandler>
    </View>
  );
}

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
  },
});
