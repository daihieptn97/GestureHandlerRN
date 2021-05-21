import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import React from "react";
import { PanGestureHandler, PinchGestureHandler } from "react-native-gesture-handler";
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
  const scaleAnimation = useSharedValue(1);
  const scaleLastAnimation = useSharedValue(1);

  const onGestureEvent = useAnimatedGestureHandler(
    {
      onStart: (_, ctx) => {
        // triggered at the start of the pan gesture
        // console.log("onStart");
        ctx.x = translateX.value;
        ctx.y = translateY.value;

      },
      onActive: ({ translationX, translationY }, { x, y }) => {
        // console.log("onActive");
        translateY.value = translationY + y;
        translateX.value = translationX + x;
      },
      onEnd: ({ velocityX, velocityY, translationY, translationX }, context) => {
        // translateY.value = translationY + context.y;
        // translateX.value = translationX + context.x;

        // const snapPointX = snapPoint(translationX, velocityX, snapPointsX);
        // const snapPointY = snapPoint(translationY, velocityY, snapPointsY);
        //
        // translateX.value = withSpring(snapPointX, {velocity: velocityX});
        // translateY.value = withSpring(snapPointY, {velocity: velocityY});
      },
    },
  );


  const styleImage = useAnimatedStyle(() => ({
    width: 300,
    height: 500,
    resizeMode: "contain",
    transform: [{ scale: scaleAnimation.value }, { translateX: translateX.value }, { translateY: translateY.value }],
    // transform: [],
  }));

  const onGestureEventPinch = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      console.log("  =================== Start", scaleLastAnimation);
      // scaleAnimation.value = ctx.scale;
      scaleAnimation.value = scaleLastAnimation.value;
    },
    onActive: (event, ctx) => {
      console.log(" =================== onActive", event.scale);
      scaleAnimation.value = event.scale * scaleLastAnimation.value;
    },
    onEnd: (event, context) => {
      console.log(" =================== onEnd", event.scale);
      scaleLastAnimation.value = event.scale * scaleLastAnimation.value;
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>
      <PanGestureHandler
        // onGestureEvent={onGestureEvent}
      >
        <Animated.View style={{
          flex: 1,
          backgroundColor: "rgba(90,222,91,0.59)",
        }}>
          <PinchGestureHandler
            onGestureEvent={onGestureEventPinch}
          >
            <Animated.View style={{
              flex: 1,
              backgroundColor: "rgba(90,222,91,0.59)",
            }}>
              <Animated.Image source={{ uri: "https://live.staticflickr.com/65535/51061758768_1928250b4d_k.jpg" }}
                              style={styleImage} />
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.66)",
  },
});
