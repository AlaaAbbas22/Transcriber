import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TextInput,  } from 'react-native';
import { Button, Icon, Text } from '@rneui/themed';
import { ImageBackground } from 'react-native';
import { useState } from 'react';
import img from "../assets/bg.jpg"
import Http from './Http';

function Register({baseURL, navigation, setterEmail}) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function register(){
        await Http.post(`${baseURL}/register`, {
            email: username,
            password:password,
            name:name,
          }).then((response)=>{
            
            if (response.data["result"]!="User exists"){
                setterEmail(username)
                navigation.navigate("OTP");}
            else {
              
            }
          }).catch((e)=>{
            console.log(e);
          });
  }
  return (
    
    <View style={styles.container}>
    <Text style={styles.label}>Name</Text>
    <TextInput
      style={styles.input}
      onChangeText={(e)=>{setName(e)}}
      value={name}
      placeholder="Name"
    />
    <Text style={styles.label}>Username (Email Address)</Text>
    <TextInput
      style={styles.input}
      onChangeText={(e)=>{setUsername(e)}}
      value={username}
      placeholder="Email Address"
      keyboardType="email-address"
    />
    <Text style={styles.label}>Password</Text>
    <TextInput
      style={styles.input}
      onChangeText={(e)=>{setPassword(e)}}
      value={password}
      placeholder="Password"
      secureTextEntry={true}
    />
    <Button
        onPress={()=>{register()}}
        title="Refresh"
        color="#0000ff"
    ><Icon name="book" color="white" />Sign Up</Button>
    <View style={{margin:20}}>
    <Button
        onPress={()=>{navigation.navigate('Login')}}
        title="Login Instead"
        color="#aa00aa"
    ></Button>
    </View>
    <StatusBar style="auto" />
  </View>
  )}


export default Register
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "ffffff",
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width:300
    },
    image: {
        flex: 1,
        justifyContent: 'center',
      },
      label:{
        fontFamily:"serif",
        fontSize:20

      }
  
  });