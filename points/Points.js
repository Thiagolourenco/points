import React, {useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Svg, Line} from 'react-native-svg';

import Point from './point';

const {width, height} = Dimensions.get('window');

// const generatePoints = numberOfPoints => {
//   const arrayNumberOfPoints = new Array.from(Array(numberOfPoints));

//   console.log('array,', arrayNumberOfPoints);

//   return arrayNumberOfPoints;
// };

const generatePoints = numberOfPoints =>
  new Array(numberOfPoints).fill(undefined).map((_, i) => ({
    x: 0,
    y: i * 40 + 50,
  }));

const usePoints = numberOfPoints => {
  const [points, setPoints] = useState(generatePoints(numberOfPoints));

  return {points, setPoints};
};

// const generateAngleValue = (points, pointIndex) => {
//   let angleValue =
//     (Math.atan2(
//       points[pointIndex].x - points[pointIndex + 1].x,
//       points[pointIndex].y - points[pointIndex + 1].y,
//     ) *
//       180) /
//     Math.PI;

//   angleValue = 180 - angleValue;
//   if (points[pointIndex].x - points[pointIndex + 1].x < 0) {
//     angleValue = 360 - angleValue;
//   }

//   return angleValue.toFixed(2);
// };

const Points = ({numberOfPoints}) => {
  const {points, setPoints} = usePoints(numberOfPoints);

  console.log('points => ', points);

  const renderAngleLine = pointIndex => (
    <Line
      key={pointIndex}
      x1={points[pointIndex].x + 15}
      y1={points[pointIndex].y + 15}
      x2={points[pointIndex + 1].x + 15}
      y2={points[pointIndex + 1].y + 15}
      stroke="black"
      strokeWidth="2"
    />
  );

  const handleChange = data => {
    const index = data?.index;
    const {x, y} = data?.point;

    setPoints(prev => {
      prev[index] = {x, y};
      return [...prev];
    });

    // console.log('X => ', x);
    // console.log('Y +> ', y);
  };

  return (
    <View>
      {points?.map(({x, y}, index) => {
        return (
          <View>
            <Point
              x={x}
              y={y}
              key={index}
              index={index}
              onChange={handleChange}
            />
          </View>
        );
      })}

      <Svg width={width} height={height}>
        {points?.map(
          (_, index) => index < points.length - 1 && renderAngleLine(index),
        )}
      </Svg>
    </View>
  );
};

export default Points;
