import { NavigationContainer,DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import History from './components/history';
import Login from './components/login';
import { useEffect, useState } from 'react';
import Transcribe from './components/transcribe';
import { ImageBackground } from 'react-native';
import {  Button } from '@rneui/base';
import Profile from './components/myprofile';
import Http from './components/Http';

const Tab = createBottomTabNavigator();
const baseURL = "https://transcriber-1.onrender.com"//"http://127.0.0.1:8000"//"https://transcriber-zi3m.onrender.com"//

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 0)',
    background: 'rgb(0, 0, 0)',
  },
};




export default function App() {
  const remove_icon = {tabBarIconStyle: { display: "none" } };
  const [logged, setlogged] = useState(false)
  
  useEffect(async ()=>{
    await Http.get(`${baseURL}/getuser`).then((res)=>{
      if (res.data.id){
        setlogged(true)
      }
    })
  
  },[])

  async function logout() {
    
    setlogged(false);
    await Http.post(`${baseURL}/logout`, {}).then(()=>{
      
        setlogged(false)
    
    }).catch((e)=>{
      console.log(e);
      
    });
  }

  if (logged){return (
    
    <NavigationContainer theme={MyTheme}>
      
      <View style={styles.container}>
        <View style={styles.top}>
        <Button color="red" onPress={logout}>
          Logout
        </Button>
        </View>
      </View>
      <Tab.Navigator tabBarOptions={{
        labelStyle: {
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          textAlignVertical: 'center',
          fontSize:16,
        },
      }}>
        <Tab.Screen name="Transcribe"  component={()=><Transcribe baseURL={baseURL} />} options={remove_icon} />
        <Tab.Screen name="History"  component={()=><History baseURL={baseURL} />} options={remove_icon} />
        <Tab.Screen name="My Profile"  component={()=><Profile baseURL={baseURL} />} options={remove_icon} />

      </Tab.Navigator>
      
    </NavigationContainer>
  )}
  else{
    return  <Login baseURL={baseURL} setlogged={setlogged}/>
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
   height:80
  },
    top:{
      backgroundColor: '#fff',
      position:"absolute",
      top:40,
      right:0,
      zIndex:100
    },
    
  },
);
