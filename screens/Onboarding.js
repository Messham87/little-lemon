import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import { validateEmail, validateName } from '../utils/validationFunctions';
import LittleLemonHeader from './LittleLemonHeader';
import { AuthContext } from '../utils/context';

export default function Onboarding({ navigation, route}) {
  const { signIn } = React.useContext(AuthContext);
  const [data, setData] = React.useState({
    userName: null,
    surName: null,
    email: null,
    profileImage: null,
    check_textInputChange: false,
    check_emailInputChange: false,
    reRenderApp: false,
  })
  const textInputChange = (val) => {
    if (validateName(val)) {
      setData({
        ...data,
        userName: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        userName: val,
        check_textInputChange: false,
      });
    }
  }
  const emailInputChange = (val) => {
    if (validateEmail(val)) {
      setData({
        ...data,
        email: val,
        check_emailInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_emailInputChange: false,
      });
    }
  }

  const loginHandle = (userName, email, checkUsername, checkEmail) => {
    signIn(userName, email, checkUsername, checkEmail)
  };
  return (
    <>
      <View style={styles.headerContainer}>
        <LittleLemonHeader routeName = {route.name} data = {data} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.mainContainer}> 
        <Text style={styles.headerText}>Let us get to know you </Text>
        <Text style={styles.headerText}>{''} </Text>
        <Text style={styles.regularText}> First Name </Text>
        <TextInput
          style={styles.inputBox}
          onChangeText={(val) => {
            textInputChange(val)
          }}
          placeholder={'first name'}
          placeholderTextColor={'#EEEEEE'}
          keyboardType={'default'}
        />
        <Text style={styles.regularText}> Email </Text>
        <TextInput
          style={styles.inputBox}
          onChangeText={(val) => {
            emailInputChange(val)
          }}
          placeholder={'email'}
          placeholderTextColor={'#EEEEEE'}
          keyboardType={'email-address'}
        />
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() =>
            data.check_textInputChange && data.check_emailInputChange ? signIn(data.userName, data.email, data.check_textInputChange, data.check_textInputChange, data.reRenderApp) : console.log("invalid username: ")
          }
          style={[
            styles.button,
            {
              backgroundColor: data.check_textInputChange && data.check_emailInputChange ? '#495E57' : '#BBBBBB',
            },
          ]}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0.15,
    backgroundColor: '#EEEEEE',
  },
  mainContainer: {
    flex: 0.75,
    backgroundColor: '#333333',
    paddingTop: 10,
  },
  buttonContainer: {
    flex: 0.1,
    alignItems: 'right',
    backgroundColor: '#EEEEEE',
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerText: {
    padding: 40,
    fontSize: 30,
    color: '#EEEEEE',
    textAlign: 'center',
  },
  regularText: {
    fontSize: 18,
    padding: 0,
    marginVertical: 0,
    color: '#EEEEEE',
    textAlign: 'left',
    margin: 20,
  },
  inputBox: {
    placeholderTextColor: '#EEEEEE',
    color: '#EEEEEE',
    height: 40,
    width: 300,
    marginLeft: 20,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderColor: '#EEEEEE',
    backgroundColor: '#495E57',
    borderRadius: 10,
  },
  button: {
    fontSize: 22,
    width: 100,
    height: 50,
    padding: 10,
    marginVertical: 8,
    marginRight: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: '#EEEEEE',
    textAlign: 'center',
    fontSize: 25,
  },
});

