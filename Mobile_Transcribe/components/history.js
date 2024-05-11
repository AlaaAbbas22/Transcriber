import { StyleSheet, View, TextInput, ScrollView, Dimensions,  } from 'react-native';
import { Button, Icon, Text } from '@rneui/themed';
import { ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import img from "../assets/cool-background.png"
import Http from "./Http"



const { width } = Dimensions.get('window');


const History = ({baseURL}) => {
    const [num, setnum] = useState(0)
    const [MyHistory, setMyHistory] = useState([<View style={{flex:1, justifyContent:"center", alignItems:"center"}}><Text> loading</Text></View>])


  // refresh after delete
  const deleteitem = async (e) => {
    console.log(e)
    await Http.post(`${baseURL}/deleteitem`,{id: e});
    setnum(Math.random())
  }




    async function Get_history() { 
      setMyHistory([<View style={{flex:1, justifyContent:"center", alignItems:"center"}}><Text> loading</Text></View>])
      
      await Http.get(`${baseURL}/gethistory`).then( 
      
      function (response) {
        console.log("restarting")
        // history list
        let newc = []

        
    if (response.data.result.length == 0){
      newc = [<View style={{flex:1, justifyContent:"center", alignItems:"center"}}><Text> No History</Text></View>]
      setMyHistory(newc)

    } else {
    response.data.result.map((item)=>{
              
      newc.unshift(
        <>
          <View key={String(item[2])} style={{marginTop: 5, paddingTop:3, paddingBottom:0}} id={String(item[2])}>
            
            <Text>Video Name: {item[0]}</Text>
            <Text>Transcription: {item[1]}</Text>
         
          </View>
          <Button 
            id={String(item[2])} 
            onPress={()=>{deleteitem(String(item[2]))}}>
            Delete above transcription
          </Button>
        </>)
    },
    
    )
    setMyHistory(newc)
  }}).catch((e)=>console.log(e));
  
  }

    async function Clear_history() { await Http.post(`${baseURL}/clearhistory`, {}
    ).then( () => {
        setMyHistory([<View ><Text> No history</Text></View>])
    });}


    // refresher
    useEffect(()=>{
      Get_history()
    }, [num])


    
  return (
    <>
        
        <View style={styles.container} > 
        <ImageBackground source={img} style={styles.image} imageStyle={{}} resizeMode="cover">
          <View >
              <Button onPress={Get_history} color={"#0aa"}> 
                Refresh
              </Button>
              <Button onPress={Clear_history} color={"#a0a"}> 
                Clear the history
              </Button>

          </View>
          <ScrollView style={{paddingHorizontal:50, paddingVertical:10,flex:1, width:width}}>
            
            {MyHistory}
          </ScrollView>
          </ImageBackground>
        </View>
    </>
  )
}

export default History
  
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
  
  });