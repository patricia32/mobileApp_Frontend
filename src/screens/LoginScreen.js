import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity, Button, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextLogo from '../components/TextLogo';
import FullWidthButton from '../components/FullWidthButton';


export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLoginWithFacebook = () => {
    console.log('Log in with Facebook');
  };

  const handleForgottenPassword = () => {
    console.log('handleForgottenPassword');
  };

  const handleSignUp = () => {
    navigation.navigate('Signup'); 
  };

  const emptyFieldsValidation = () => {
    return username === '' || password === '';
  }
  
  const handleLogin =  () => {
    if (emptyFieldsValidation()) 
      return;

    const loggedInUserID = 'Patri'; //// fetch from server

    navigation.navigate('Feed', {loggedInUserID}); 

  };

  return (
    
    <SafeAreaView
      style={styles.fullPage }>

      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>

        <TextLogo/>
    
        <TextInput                                                      // Username container 
            style={styles.usernameField}
            placeholder="Phone number, username or email address"
            value={username}
            onChangeText={text => setUsername(text)} 
        />

        <View style={styles.passwordContainer}>    
          <View style={styles.passwordFieldAndEye}>
            <TextInput                                                   // Password container
              style={styles.passwordField}
              placeholder="Password"
              value={password}
              onChangeText={text => setPassword(text)} 
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

          <TouchableOpacity>                                       
            <Text                                                       // Forgotten password
              style={styles.forgottenPassword}
              onPress={handleForgottenPassword}
            >
              Forgotten password?
            </Text> 
          </TouchableOpacity>

        </View>

        <FullWidthButton title="Log In" onPress={handleLogin} />

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>


        <TouchableOpacity                                                 // Login with Facebook
          style={styles.facebookSquareButton} 
          onPress={handleLoginWithFacebook}
          >
          <Ionicons name="logo-facebook" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginWithFacebook}
          onPress={handleLoginWithFacebook}
        >
          <Ionicons name="logo-facebook" size={24} color="rgb(0, 149, 246)" />
          <Text 
            style={{ marginLeft: 10, color:"rgb(0, 149, 246)"}}
          >
              Log in with Facebook 
          </Text>
        </TouchableOpacity>
      </View>

      <View                                                                   // Bottom side - No account
          style={styles.noAccount}
        > 
          <Text> Don't have an account? </Text>
          
          <TouchableOpacity >
            <Text 
              style={styles.signupText}
              onPress={handleSignUp}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  fullPage:{
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 0.98,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoText: {
    width: 300,
    height: 100,
    marginBottom: 50,
  },
  usernameField: {
    height: 50,
    width: '85%',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  
  
  //password styles
  passwordContainer: {
    width: 50,
    width: '85%',
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
  forgottenPassword: {
    color: 'rgb(0, 149, 246)',
    alignSelf: 'flex-end',
    marginTop: 10,
  },

  loginButton: {
    width: '85%', 
    backgroundColor: 'rgb(0, 149, 246)',
    borderRadius: 5,
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    padding: 10,
    textAlign: 'center',
  },

  // OR container
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '85%',
    marginTop: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'gray',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: 'gray',
  },

  loginWithFacebook: {
    color: 'rgb(0, 149, 246)',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },

  noAccount: {
    flex: 0.02,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 10,
  },
  signupText: {
    color: 'rgb(0, 149, 246)', 
    marginLeft: 10,
  }
});
