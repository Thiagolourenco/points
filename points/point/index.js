import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';

const App = ({x, y, index, onChange, points}) => {
  const pointX = useDerivedValue(() => points.value[index].x);
  const pointY = useDerivedValue(() => points.value[index].y);

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startX = points.value[index].x;
      context.startY = points.value[index].y;
    },
    onActive: (event, context) => {
      const data = {
        index: index,
        point: {
          x: context.startX + event.translationX,
          y: context.startY + event.translationY,
        },
      };
      onChange(data);
    },
    onEnd: event => {},
  });

  const ballStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: pointX?.value}, {translateY: pointY?.value}],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={eventHandler}>
      <Animated.View style={[styles.point, ballStyle]} />
    </PanGestureHandler>
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
