import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  TapGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler';

const App = ({x, y, index, onChange}) => {
  const xs = x === undefined ? 0 : x;
  const ys = x === undefined ? 0 : y;

  const ValueX = useSharedValue(ys);
  const ValueY = useSharedValue(xs);

  const indexTest = useSharedValue();
  const xOnChangeX = useSharedValue(0);
  const YOnChangeY = useSharedValue(0);

  // const [indexT, setIndexT] = useState(0);
  // const [xOnChangeX, setXOnChangeX] = useState(0);
  // const [YOnChangeY, setYOnChangeY] = useState(0);

  // console.log('indexT', indexT);
  // console.log('xOnChangeX => ', xOnChangeX);

  // const eventHandler = useAnimatedGestureHandler({
  //   onStart: (event, ctx) => {
  //     pressed.value = true;
  //   },
  //   onEnd: (event, ctx) => {
  //     pressed.value = false;
  //   },
  // });

  // console.log('indexsT', indexT);

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = ValueX?.value;
      context.translateY = ValueY?.value;
    },
    onActive: (event, context) => {
      indexTest.value = index;
      xOnChangeX.value = event.translationX + ValueX.value - event.x;
      YOnChangeY.value = event.translationY + ValueY.value - event.y;

      // setXOnChangeX(event.translationX + ValueX.value - event.x);

      // setIndexT(index);

      ValueX.value = event.translationX + context.translateX;
      ValueY.value = event.translationY + context.translateY;
    },
    onEnd: event => {
      // indexT.value = index;
      // xOnChangeX.value = event.translationX + ValueX.value - event.x;

      // x.value = event.translationX;
      // y.value = event.translationY;
      console.log('end', event);
    },
  });

  const ballStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: ValueX?.value}, {translateY: ValueY?.value}],
    };
  });

  const handleChange = () => {
    const data = {
      index: indexTest?.value,
      point: {
        x: xOnChangeX?.value,
        y: YOnChangeY?.value,
      },
    };

    onChange(data);
  };

  return (
    // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <PanGestureHandler
      onGestureEvent={eventHandler}
      onEnded={handleChange}
      activeOffsetX={[0, 0]}>
      <Animated.View style={[styles.point, ballStyle]} />
    </PanGestureHandler>
    // </View>
  );
};

const styles = StyleSheet.create({
  point: {
    backgroundColor: '#000',
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
  },
});

export default App;
