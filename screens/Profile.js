import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  View,
  Button,
  Image,
} from 'react-native';
import { AuthContext } from '../utils/context';
import AsyncStorage from '@react-native-community/async-storage';
import { MaskedTextInput } from 'react-native-mask-text';
import LittleLemonHeader from './LittleLemonHeader';
import * as ImagePicker from 'expo-image-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

export default function Profile({ route }) {
  const { navigate } = useNavigation()
  const { signOut, saveProfile } = React.useContext(AuthContext);
  const [data, setData] = React.useState({
    userName: '',
    email: '',
    surName: '',
    phoneNumber: '',
    notOrderStatus: false,
    notPasswordChanges: false,
    notOffers: false,
    notNewsletter: false,
    profileImage: null,
    reRenderApp: false,
  });
  const [clear, setClear] = React.useState(false);
  React.useEffect(() => {
    const getAsyncStorageData = async () => {
      const userName = await AsyncStorage.getItem('userName');
      const email = await AsyncStorage.getItem('email');
      const surName = await AsyncStorage.getItem('surName');
      const phoneNumber = await AsyncStorage.getItem('phoneNumber');
      const notOrderStatus = await AsyncStorage.getItem('notOrderStatus');
      const notPasswordChanges = await AsyncStorage.getItem(
        'notPasswordChanges'
      );
      const notOffers = await AsyncStorage.getItem('notOffers');
      const notNewsletter = await AsyncStorage.getItem('notNewsletter');
      const profileImage = await AsyncStorage.getItem('profileImage');
      const reRenderApp = await AsyncStorage.getItem('reRenderApp');

      setData({
        userName: userName ?? '',
        email: email ?? '',
        surName: surName ?? '',
        phoneNumber: phoneNumber ?? '',
        notOrderStatus: JSON.parse(notOrderStatus) ?? '',
        notPasswordChanges: JSON.parse(notPasswordChanges) ?? '',
        notOffers: JSON.parse(notOffers) ?? '',
        notNewsletter: JSON.parse(notNewsletter) ?? '',
        profileImage: JSON.parse(profileImage),
        reRenderApp: JSON.parse(reRenderApp) ?? '',
      });
    };

    getAsyncStorageData()
      .then()
      .catch((err) => console.error(err));
  }, [clear]);

  const updateData = (itemName, itemValue) => {
    setData({
      ...data,
      [itemName]: itemValue,
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      updateData('profileImage', result.assets[0].uri);
    }
  };

  const saveHandle = (
    userName,
    email,
    surName,
    phoneNumber,
    notOrderStatus,
    notPasswordChanges,
    notOffers,
    notNewsletter,
    profileImage,
    reRenderApp
  ) => {
    saveProfile(
      userName,
      email,
      surName,
      phoneNumber,
      notOrderStatus,
      notPasswordChanges,
      notOffers,
      notNewsletter,
      profileImage,
      reRenderApp,
    );
  };

  return (
    <>
      <LittleLemonHeader routeName = {route.name} data = {data} />
      <Text style={styles.regularText}>Avatar</Text>
      <View style={styles.imageContainer}>
        {data.profileImage ? (
          <Image
            source={{ uri: data.profileImage }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.emptyImage}>
            <Text style={styles.emptyImageText}>
              {data.userName && Array.from(data.userName)[0].toUpperCase()}
              {data.surName && Array.from(data.surName)[0].toUpperCase()}
            </Text>
          </View>
        )}
        <Pressable
          title="Pick an image from camera roll"
          onPress={pickImage}
          style={styles.button}>
          <Text style={styles.buttonText}>Pick Image</Text>
        </Pressable>
        <View>
          <Pressable
            title="Clear image"
            onPress={() => updateData('profileImage', null)}
            style={styles.buttonCancel}>
            <Text style={styles.buttonTextCancel}>Clear Image</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.regularText}>First Name</Text>
        <TextInput
          style={styles.inputBox}
          onChangeText={(val) => {
            updateData('userName', val);
          }}
          value={data.userName}
          keyboardType={'default'}
        />
        <Text style={styles.regularText}>Last Name</Text>
        <TextInput
          style={styles.inputBox}
          onChangeText={(val) => {
            updateData('surName', val);
          }}
          value={data.surName}
          keyboardType={'default'}
        />
        <Text style={styles.regularText}>Email</Text>
        <TextInput
          style={styles.inputBox}
          onChangeText={(val) => {
            updateData('email', val);
          }}
          value={data.email}
          keyboardType={'default'}
        />
        <Text style={styles.regularText}>Phone Number</Text>
        <MaskedTextInput
          mask="+1 (999) 9999 999"
          onChangeText={(text, rawText) => {
            updateData("phoneNumber", rawText)
          }}
          value = {data.phoneNumber}
          placeholder = {"+1 (123) 4567 890"}
          style={styles.inputBox}
        />
        <Text style={styles.titleText}>Email notification preferences:</Text>
        <View style={styles.checkboxContainer}>
          <Pressable
            style={
              data.notOrderStatus ? styles.checkbox : styles.checkboxPressed
            }
            onPress={() => updateData('notOrderStatus', !data.notOrderStatus)}>
            {data.notOrderStatus && (
              <AntDesign name="check" size={15} color="white" />
            )}
          </Pressable>
          <Text style={styles.checkboxText}>Order statuses</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Pressable
            style={
              data.notPasswordChanges ? styles.checkbox : styles.checkboxPressed
            }
            onPress={() =>
              updateData('notPasswordChanges', !data.notPasswordChanges)
            }>
            {data.notPasswordChanges && (
              <AntDesign name="check" size={15} color="white" />
            )}
          </Pressable>
          <Text style={styles.checkboxText}>Password changes</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Pressable
            style={data.notOffers ? styles.checkbox : styles.checkboxPressed}
            onPress={() => updateData('notOffers', !data.notOffers)}>
            {data.notOffers && (
              <AntDesign name="check" size={15} color="white" />
            )}
          </Pressable>
          <Text style={styles.checkboxText}>Special offers</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Pressable
            style={
              data.notNewsletter ? styles.checkbox : styles.checkboxPressed
            }
            onPress={() => updateData('notNewsletter', !data.notNewsletter)}>
            {data.notNewsletter && (
              <AntDesign name="check" size={15} color="white" />
            )}
          </Pressable>
          <Text style={styles.checkboxText}>Newsletter</Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Pressable onPress={() => signOut()} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
        <Pressable onPress={() => setClear(!clear)} style={styles.buttonCancel}>
          <Text style={styles.buttonTextCancel}>Discard Changes</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            {saveHandle(
              data.userName,
              data.email,
              data.surName,
              data.phoneNumber,
              data.notOrderStatus,
              data.notPasswordChanges,
              data.notOffers,
              data.notNewsletter,
              data.profileImage,
              !data.reRenderApp
            );
            navigate('Home')
            }
          }
          style={styles.button}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  button: {
    width: 80,
    height: 40,
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#495E57',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#EEEEEE',
    textAlign: 'center',
    fontSize: 12,
  },
  buttonCancel: {
    width: 100,
    height: 40,
    padding: 8,
    borderRadius: 10,
    borderColor: '#333333',
    borderWidth: 1,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextCancel: {
    color: '#333333',
    textAlign: 'center',
    fontSize: 12,
  },
  regularText: {
    fontSize: 10,
    padding: 5,
    marginVertical: 0,
    color: '#333333',
    textAlign: 'left',
    margin: 10,
  },
  inputBox: {
    placeholderTextColor: '#333333',
    color: '#333333',
    height: 30,
    width: 300,
    marginLeft: 10,
    marginBottom: 10,
    borderWidth: 1,
    paddingLeft: 10,
    fontSize: 14,
    borderColor: '#333333',
    borderRadius: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#EEEEEE',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  emptyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0b9a6a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImageText: {
    fontSize: 35,
    color: '#FFFFFF',
  },
  checkbox: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxPressed: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#495E57',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 15,
    paddingBottom: 0,
    paddingTop: 1,
  },
  checkboxText: {
    fontSize: 11,
    padding: 5,
    marginVertical: 0,
    color: '#333333',
    textAlign: 'left',
    margin: 5,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 0,
    color: '#333333',
    textAlign: 'left',
    margin: 10,
  },
});
