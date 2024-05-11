import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TextInput,  } from 'react-native';
import { Button, Icon, Text } from '@rneui/themed';
import { ImageBackground } from 'react-native';
import { useState } from 'react';
import img from "../assets/bg.jpg"
import Http from './Http';

function Login({baseURL, setlogged}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setloading] = useState("")
    async function login(){
      console.log(`${baseURL}/login`)
      await Http.post(`${baseURL}/login`, {
        email: username,
        password:password,
      }).then((response)=>{
        if (response.data["result"]=="Not found"){
          seterror("Error! User not found.")
          setloading("Done")
        }
        else{
          console.log(response.data)
          setlogged(true)
      }
      }).catch((e)=>{
        console.log(e);
        setloading("Error! Try again.")
        setloading("Done")
      });
  }
  return (
    
    <View style={styles.container}>
    <Text style={styles.label}>Username</Text>
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
        onPress={()=>{login()}}
        title="Refresh"
        color="#0000ff"
        accessibilityLabel="Learn more about this purple button"
    ><Icon name="book" color="white" />Login</Button>
    <StatusBar style="auto" />
  </View>
  )}


export default Login
  
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