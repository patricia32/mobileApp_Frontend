import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import TextLogo from '../components/TextLogo';
import FullWidthButton from '../components/FullWidthButton';

export default function SignupScreen({navigation}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());

  const scrollViewRef = useRef(null);

  const [basicFieldEror, setBasicFieldError] = useState('');                    //Empty fields validation                     
  const emptyFieldsValidation = () => {
    if ( firstName === '' || lastName === '' || username === '' || phoneNumber === '' || email === '' || password === '' || repeatedPassword === '' || birthDate === '') {
      setBasicFieldError('All fields are required');
      return false;
    }
    else{
      setBasicFieldError('');
      return true;
    } 
  };
  
  const [emailError, setEmailError] = useState('');                             //Email validation
  const validateEmail = (inputEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(inputEmail)) {
      setEmailError(''); 
      return true;
    } else {
      setEmailError('Invalid email format'); 
      return false;
    }
  };

  const [passwordDismatchError, setPasswordDismatchError] = useState('');        //Password dismatch validation
  const passwordDismatch = (text) => {
    if (password !== text) {
      setPasswordDismatchError('Passwords do not match');
      return false;
    } else {
      setPasswordDismatchError('');
      return true;
    }
  };

  const finalValidation = () => {
    return emptyFieldsValidation() && validateEmail(email) && passwordDismatch(repeatedPassword);
  };

  
  const [show, setShow] = useState(false);
  const onChangeBirthDate = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate; 
    setShow(false);
    setBirthDate(currentDate); 
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);                            //Password visibility
  const [isRepeatedPasswordVisible, setIsRepeatedPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleRepeatedPasswordVisibility = () => {
    setIsRepeatedPassword(!isRepeatedPasswordVisible);
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    if (!finalValidation()) {
      return;
    }
    const signupData = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      phoneNumber: phoneNumber,
      email: email,
      password: password,
      repeatedPassword: repeatedPassword,
      birthDate: birthDate.toISOString().split('T')[0],
    };
    console.log('Signup Data:', signupData)
  };
  

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
    
      
        <SafeAreaView style={styles.fullPage}>

          <StatusBar barStyle="dark-content" />
          {/* <View style={styles.container}> */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.topSide}>
            <TextLogo />
            </View>

            <View style={styles.fields}>
              <TextInput style={styles.basicField} placeholder="First Name" onChangeText={(text) => {setFirstName(text)}} />
              <TextInput style={styles.basicField} placeholder="Last Name" onChangeText={text => setLastName(text)}  />

              <TextInput                                                                      // Email container        
                style={styles.basicField}
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  validateEmail(text);
                }}
                keyboardType="email-address"
                autoCapitalize="none" 
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

              <TextInput style={styles.basicField} placeholder="Username" onChangeText={text => setUsername(text)}/>
              <TextInput style={styles.basicField} placeholder="Phone number" keyboardType="numeric" onChangeText={text => setPhoneNumber(text)} />
              
              <View style={styles.passwordContainer}>    
                <View style={styles.passwordFieldAndEye}>
                    <TextInput                                                   // Password container
                    style={styles.passwordField}
                    placeholder="Password"
                    value={password}
                    onChangeText={text => {setPassword(text); passwordDismatch(text)}} 
                    secureTextEntry={!isPasswordVisible}
                    />
                    <TouchableOpacity 
                      style={styles.passwordEye}
                      onPress={togglePasswordVisibility}>
                      <Ionicons
                          name={isPasswordVisible ? 'eye-off' : 'eye'}
                          size={24}
                          color="gray"
                      />
                    </TouchableOpacity> 
                </View>
              </View>

              <View style={styles.passwordContainer}>    
                <View style={styles.passwordFieldAndEye}>
                    <TextInput                                                   // Repeated Password container
                    style={styles.passwordField}
                    placeholder="Repeat Password"
                    value={repeatedPassword}
                    onChangeText={text => {setRepeatedPassword(text), passwordDismatch(text)}} 
                  
                    
                    secureTextEntry={!isRepeatedPasswordVisible}
                    />
                    <TouchableOpacity 
                    style={styles.passwordEye}
                    onPress={toggleRepeatedPasswordVisibility}>
                    <Ionicons
                        name={isRepeatedPasswordVisible ? 'eye-off' : 'eye'}
                        size={24}
                        color="gray"
                    />
                    </TouchableOpacity> 
                </View>
                {passwordDismatchError ? <Text style={styles.errorText}>{passwordDismatchError}</Text> : null}
              </View>

              <TouchableOpacity style={styles.datePickerContainer} onPress={() => setShow(true)}>
                <TextInput                                                                              // Birth date container
                  style={styles.dateInput}
                  value={birthDate.toLocaleDateString()} 
                  placeholder="Select Birth Date"
                  editable={false} 
                />
                <Ionicons name="calendar" size={24} color="gray" style={styles.calendarIcon} />
              </TouchableOpacity>

              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={birthDate} // Pass the date state here
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeBirthDate}
                />
              )}
            </View>

            <View                                                                             // Bottom side
              style={styles.bottomSide}>                                                   
              <FullWidthButton title="Sign Up" onPress={handleSignUp} />
              {basicFieldEror ? <Text style={styles.errorText}>{basicFieldEror}</Text> : null}
              
              <View style={styles.hasAccount}>
                <Text> Already have an account?</Text>
                <TouchableOpacity >
                  <Text 
                    style={styles.loginText}
                    onPress={handleLogin}
                  >
                    Log In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>

        </SafeAreaView>
      {/* </ScrollView>  */}
    
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  // scrollContainer: {
  //   flexGrow: 1,
  //   justifyContent: 'center',
  // },
  fullPage: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  container: {
    // flex: 1,
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  
  },
  topSide: {
    flex: 0.15,
    backgroundColor: '#fff',
    marginTop: 30,
  },
  fields: {
    flex: 0.80,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSide: {
    flex: 0.15,
    backgroundColor: '#fff',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  basicField: {
    height: 50,
    width: '85%',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    marginTop: 12,
    borderRadius: 5,
  },

  // date field styles
  selectedDateText: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%', 
    marginTop: 12,
    backgroundColor: '#f9f9f9', 
    borderRadius: 5,
    paddingHorizontal: 10, 
    height: 50, 
  },
  dateInput: {
    flex: 1,
    height: '100%', 
    backgroundColor: 'transparent', 
    paddingHorizontal: 0, 
  },
  calendarIcon: {
    marginLeft: 10, 
  },

  //password styles
  passwordContainer: {
    width: 50,
    width: '85%',
    marginTop: 12,
    borderRadius: 5,
  },
  passwordFieldAndEye: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
  },
  passwordField: {
    flex: 0.9,
    paddingHorizontal: 10,
  },
  passwordEye: {
    flex: 0.1,
    alignSelf: 'center',
  },

  //has account styles
  hasAccount: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  loginText: {
    color: 'rgb(0, 149, 246)', 
    marginLeft: 10,
  },

  errorText: {
    color: 'red',
    marginBottom: 0, // Spațiu după mesajul de eroare
    marginTop: 0, // Spațiu înainte de mesajul de eroar
    fontSize: 14,
  },
});
