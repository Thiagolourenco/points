import React, {Fragment, useState} from 'react';
import {Dimensions, View, Text} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {Svg, Line} from 'react-native-svg';

import Point from './point';

import styles from './styles';

const {width, height} = Dimensions.get('window');

const generatePoints = numberOfPoints =>
  new Array(numberOfPoints).fill(undefined).map((_, i) => ({
    x: 0,
    y: i * 40 + 50,
  }));

const AnimatedLine = Animated.createAnimatedComponent(Line);

const AngleLine = ({index, points}) => {
  const pointX = useDerivedValue(() => points.value[index].x);
  const pointY = useDerivedValue(() => points.value[index].y);
  const nextPointX = useDerivedValue(() => points.value[index + 1].x);
  const nextPointY = useDerivedValue(() => points.value[index + 1].y);

  const animatedProps = useAnimatedProps(() => ({
    x1: pointX.value + 15,
    y1: pointY.value + 15,
    x2: nextPointX.value + 15,
    y2: nextPointY.value + 15,
  }));

  return (
    <AnimatedLine
      key={index}
      animatedProps={animatedProps}
      stroke="black"
      strokeWidth="2"
    />
  );
};
const generateAngleValue = (points, pointIndex) => {
  'worklet';

  let angleValue =
    (Math.atan2(
      points[pointIndex].x - points[pointIndex + 1].x,
      points[pointIndex].y - points[pointIndex + 1].y,
    ) *
      180) /
    Math.PI;

  angleValue = 180 - angleValue;
  if (points[pointIndex].x - points[pointIndex + 1].x < 0) {
    angleValue = 360 - angleValue;
  }

  return angleValue.toFixed(2);
};

const AngleValue = ({points, index}) => {
  const [angleValue, setAngleValue] = useState(
    generateAngleValue(points.value, index),
  );
  const pointXValue = useDerivedValue(() => points.value[index].x).value;
  const pointYValue = useDerivedValue(() => points.value[index].y).value;
  const nextPointXValue = useDerivedValue(
    () => points.value[index + 1].x,
  ).value;
  const nextPointYValue = useDerivedValue(
    () => points.value[index + 1].y,
  ).value;

  useAnimatedReaction(
    () => points.value,
    points => {
      const value = generateAngleValue(points, index);
      runOnJS(setAngleValue)(value);
    },
  );

  const animatedStyle = useAnimatedStyle(() => {
    const pointSize = 30;
    const angleVablueContainerWidth = 80;

    const centerX = (pointXValue + nextPointXValue) / 2;
    const centerY = (pointYValue + nextPointYValue) / 2;

    return {
      transform: [
        {translateX: centerX - angleVablueContainerWidth},
        {translateY: centerY - index * pointSize},
      ],
    };
  });

  return (
    <Animated.View style={[styles.angleValueContainer, animatedStyle]}>
      <Text style={styles.angleValueText}>{angleValue}</Text>
    </Animated.View>
  );
};
const Points = ({numberOfPoints}) => {
  // const {points, setPoints} = usePoints(numberOfPoints);
  const points = useSharedValue(generatePoints(numberOfPoints));

  useAnimatedReaction(
    () => points.value,
    points => {
      // console.log(points);
    },
  );

  const renderAngleLine = pointIndex => (
    <Line
      key={pointIndex}
      x1={points.value[pointIndex].x + 15}
      y1={points.value[pointIndex].y + 15}
      x2={points.value[pointIndex + 1].x + 15}
      y2={points.value[pointIndex + 1].y + 15}
      stroke="black"
      strokeWidth="2"
    />
  );

  const handleChange = data => {
    'worklet';
    const {x, y} = data.point;
    points.value = points.value.map((point, index) => {
      if (index === data.index) {
        return {
          x: x,
          y: y,
        };
      }
      return point;
    });
  };

  return (
    <View>
      <Svg height={height} width={width}>
        {points.value?.map(
          (_, index) =>
            index < points.value.length - 1 && (
              <Fragment key={index}>
                <AngleLine index={index} points={points} />
                <AngleValue index={index} points={points} />
              </Fragment>
            ),
        )}
        {points.value?.map(({x, y}, index) => {
          return (
            <Point
              x={x}
              y={y}
              key={index}
              index={index}
              onChange={handleChange}
              points={points}
            />
          );
        })}
      </Svg>
    </View>
  );
};

export default Points;
