import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
  Pressable,
  Alert
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

export default function LittleLemonHeader({ routeName, data }) {
  const { navigate } = useNavigation()
  const renderProfileImage = (routeName, data) => {
    switch (routeName) {
      case 'Onboarding':
        return;
      default:
        return (
          <Pressable 
            onPress={() => navigate('Profile')}
            >
              {data.profileImage ? (
                <Image
                  source={{ uri: data.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.emptyImage}>
                  <Text style={styles.emptyImageText}>
                    {data.userName &&
                      Array.from(data.userName)[0].toUpperCase()}
                    {data.surName && Array.from(data.surName)[0].toUpperCase()}
                  </Text>
                </View>
              )}
          </Pressable>
        );
    }
  };
  const renderBackButton = () => {
    switch (routeName) {
      case 'Onboarding':
      case 'Home':
        return;
      default:
        return (
          <View style={styles.backButton}>
            <AntDesign name="arrowleft" size={25} color="white" />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.emptyView}>{renderBackButton()}</View>
      <Image
        style={styles.logo}
        source={require('../assets/Logo.png')}
        accessible={true}
        accessibilityLabel={'Little lemon logo'}
      />
      <View style={styles.emptyView}>
        {renderProfileImage(routeName, data)}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 0.15,
    backgroundColor: '#EEEEEE',
  },
  logo: {
    width: '50%',
    resizeMode: 'contain',
  },
  emptyView: {
    width: '15%',
    resizeMode: 'contain',
    alignContent: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
  emptyImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: '#0b9a6a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImageText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
