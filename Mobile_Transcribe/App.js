import { NavigationContainer,DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import Mean from './components/mean';
import Login from './components/login';
import { useState } from 'react';
import Transcribe from './components/transcribe';
import FilePickerManager from 'react-native-file-picker';


const Tab = createBottomTabNavigator();
const baseURL = "http://127.0.0.1:8000"//"https://transcriber-zi3m.onrender.com"//"https://transcriber-1.onrender.com"//

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
  const [logged, setlogged] = useState(true)
  
  if (logged){return (
    
    <NavigationContainer theme={MyTheme}>
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
        <Tab.Screen name="Transcribe"  component={()=><Transcribe baseURL={"propValue"}/>} options={remove_icon} />
        <Tab.Screen name="Mean"  component={()=><Mean Name={"propValue"}/>} options={remove_icon} />
        <Tab.Screen name="Man"  component={()=><Mean Name={"propValue"}/>} options={remove_icon} />

      </Tab.Navigator>
    </NavigationContainer>
  )}
  else{
    return  <Login/>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
