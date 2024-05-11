import { useState } from 'react'
import { Text } from '@rneui/themed'
import { Button } from '@rneui/themed'
import { ImageBackground, StyleSheet, View } from 'react-native'
import * as Clipboard from 'expo-clipboard';
import * as DocumentPicker from 'expo-document-picker';
import Http from './Http';
import img from "../assets/cool-background.png"

const Transcribe = ({ baseURL }) => {
  // setting vars
  const [transcription, settranscription] = useState("")
  const loading = "Done"
  const [uri, setUri] = useState("")
  const [name, setName] = useState("")
  

//handling submitting mean
async function A() {
  settranscription("Loading...")
  const file = {
    uri : uri,
    name: name,
    type: 'video/mp4'
};
  console.log(file)

  const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type
  })
    const headers = {
      accept: 'application/json',
      'content-type': 'multipart/form-data',
  };
      await Http.post(`${baseURL}/transcribe`, formData,{
        headers: headers,
    }).then(function (response) {
      str = response.data.transcription.substring(0, response.data.transcription.length - 1)
    settranscription(str)
    console.log(str)
  }).catch(function (error) {
    console.log(error);
  });}
    
    const handleFilePick = async () => {
      res = await DocumentPicker.getDocumentAsync({type:["video/*","audio/*"]})
      if (!res["canceled"]){            
          console.log(res)
          setName(res["assets"][0]["name"])
          setUri(res["assets"][0]["uri"])   
        } else{
          setName("")
          setUri("")  
          settranscription("")
        }     
    };
  


return (
(loading=="Done")&&<>
  
  <View style={styles.container}>
  <ImageBackground source={img} style={styles.image} imageStyle={{}} resizeMode="cover">
    <View style={{margin:50, justifyContent:"center", alignItems:"center"}}>
    <Text style={styles.header}>
      Transcriber
    </Text>

    <Text style={{margin:10,}}>
      <Button onPress={handleFilePick} color="grey" >
          Press to pick an audio or video file
      </Button>
    </Text>
    
    {name!= ""&&
    <Text style={styles.data}>
      {name}
    </Text>}

    {(name!="")&&
    <Button onPress={A}>
      Press to Transcribe
    </Button>}


    {(transcription!="")&&
    <Text style={{margin:20}}>
      "{transcription}"
    </Text>}


    {(transcription!=""&&transcription!="Loading...")&&
    <Button onPress={()=>{Clipboard.setStringAsync(transcription)}}>
      Copy Transcription
    </Button>}
    </View>
</ImageBackground>
  </View>  
</>

)}


export default Transcribe


const styles = StyleSheet.create({
    container: {
      flex: 1,
      
      justifyContent: 'center',
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
        top:-40,
        fontFamily:"serif"
      },
      logout:{
        backgroundColor:"#ffffff",
        
        position: 'absolute',
        justifyContent:"flex-start",
        top: 0,
        right: 0,
        width: 50,
        height: 50,

      },
      picker:{
        margin:20,
        alignContent:"center"
      },
      data:{
        alignItems: 'center',
        textAlign:'center',
        textAlignVertical:'center',
        marginBottom:20,
        width:300,
        fontSize:18,
        fontFamily:"serif"
      }
  });