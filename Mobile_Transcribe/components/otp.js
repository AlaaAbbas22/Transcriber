import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TextInput,  } from 'react-native';
import { Button, Icon, Text } from '@rneui/themed';
import { useState } from 'react';
import Http from './Http';

function OTP({baseURL, setlogged,email}) {
    const [otp, setOtp] = useState('');

    async function submitOtp(){

      await Http.post(`${baseURL}/emailauth`, {
        email: email,
        otp:otp,
      }).then((response)=>{
        
        if (response.data["status"]!="Incorrect"){
            setlogged(true);}
        else {

        }
      }).catch((e)=>{
        console.log(e);
      });
      
  }
  return (
    
    <View style={styles.container}>
    <Text style={styles.label}>One-Time Password (Check Email)</Text>
    <TextInput
      style={styles.input}
      onChangeText={(e)=>{setOtp(e)}}
      value={otp}
      placeholder="******"
      keyboardType="numeric"
    />
    
    <Button
        onPress={()=>{submitOtp()}}
        title="Refresh"
        color="#0000ff"
    ><Icon name="book" color="white" />Submit OTP</Button>
    <StatusBar style="auto" />
  </View>
  )}


export default OTP
  
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