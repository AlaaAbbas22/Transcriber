import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TextInput,  } from 'react-native';
import { Button, Icon, Text } from '@rneui/themed';
import { ImageBackground } from 'react-native';
import { useState } from 'react';
import img from "../assets/bg.jpg"

function Login() {
    const [first, setfirst] = useState("")
    const [number, onChangeNumber] = useState('');
  
    async function meanf(numbers){
      const response = await fetch('https://el-statistician-api.onrender.com/mean', {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numbers: numbers,
        }),
      })
      .then(response => response.json())
      .then(json => setfirst(json.result))
  }
  return (
    
    <View style={styles.container}>
    <Text>Enter numbers separated by commas</Text>
    <TextInput
      style={styles.input}
      onChangeText={(e)=>{onChangeNumber(e),meanf(e)}}
      value={number}
      placeholder="useless placeholder"
      keyboardType="numeric"
    />
    <Text>Mean = {first}</Text>
    <Button
        onPress={()=>{meanf(number)}}
        title="Refresh"
        color="#0000ff"
        accessibilityLabel="Learn more about this purple button"
    ><Icon name="book" color="white" />Refresh</Button>
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
    },
    image: {
        flex: 1,
        justifyContent: 'center',
      }
  
  });