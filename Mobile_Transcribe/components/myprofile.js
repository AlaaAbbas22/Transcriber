import { StyleSheet, View, Dimensions,  } from 'react-native';
import { Text } from '@rneui/themed';
import { ImageBackground, Image } from 'react-native';
import { useState, useEffect } from 'react';
import img from "../assets/cool-background.png"
import user from "../assets/user.png"
import Http from "./Http"



const { width } = Dimensions.get('window');


const Profile = ({baseURL}) => {
    const [name, setName] = useState("Loading...")
    const [id, setId] = useState("0")
    const [email, setEmail] = useState("0")


    async function getUser() {       
      await Http.get(`${baseURL}/getuser`).then( 
      
      function (response) {
       const data = response.data
       setEmail(data["email"])
       setId(data["id"])
       setName(data["name"])
    },).catch((e)=>console.log(e));
  
  }
    // refresher
    useEffect(()=>{
        getUser()
    }, [])

// <img src={img} className='mx-auto w-[30%]' alt="Logo" />
    
  return (
    <>
        
        <View style={styles.container} > 
        <ImageBackground source={img} style={styles.image} imageStyle={{}} resizeMode="cover">
            <Image source={user} style={{width:width*0.5,height:width*0.5, resizeMode:"contain", alignSelf:"center"}}></Image>
        <View style={{width:width, padding:50}} >
   
      <Text style={styles.header}>{name}</Text>
          <Text style={styles.data}>ID: {id}</Text>
          <Text style={styles.data}>Email: {email}</Text> 
    </View>
          </ImageBackground>
        </View>
    </>
  )
}

export default Profile
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#fff",
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
    },
    header:{
        padding:10,
        marginBottom:30,
        fontSize:30,
        borderColor:"#000",
        borderWidth: 10,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign:'center',
        textAlignVertical:'center',
        backgroundColor:'#a0d0ff',
        top:0,
        fontFamily:"serif"
      },
      data:{
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf:"center",
        fontSize:20,
      }
  
  });