import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text>Bear with us, Yogi</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})