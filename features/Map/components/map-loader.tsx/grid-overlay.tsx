import { Dimensions, View, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');

type Props = {
  size?: number;      
  color?: string;     
  opacity?: number;   
};

export default function GridOverlay({
  size = 90,
  color = '#CBD5E1',  // gris frío (tailwind slate-300)
  opacity = 0.5,
}: Props) {
  const verticalLines = Math.ceil(width / size);
  const horizontalLines = Math.ceil(height / size);

  return (
    <View className='grow' pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity }]}>
      {/* Vertical lines */}
      {Array.from({ length: verticalLines }).map((_, i) => (
        <View
          key={`v-${i}`}
          style={[
            styles.line,
            {
              left: i * size,
              height: height,
              backgroundColor: color,
            },
          ]}
        />
      ))}

      {/* Horizontal lines */}
      {Array.from({ length: horizontalLines }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={[
            styles.line,
            {
              top: i * size,
              width: width,
              backgroundColor: color,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
});
