import { ChangeEvent, FormEvent, useState } from 'react'
import { Header, Text } from '@rneui/themed'
import { Input, Button } from '@rneui/themed'
import { StyleSheet, View } from 'react-native'
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Http from './Http';
import { formToJSON } from 'axios';

const Transcribe = ({ baseURL }) => {
      // setting vars
  const [file, setFile] = useState(null)
  const [transcription, settranscription] = useState("")
  const loading = "Done"
  const [working, setworking] = useState(0)
  const [transcribing , setranscribing] = useState("");
  const [src, setsrc] = useState("")
  

  const config = {
    
  }
  

//handling submitting mean
async function A(file) {
  setworking(0)
  const formData = new FormData();
    formData.append('file.mp3', file, "file.mp3")
    console.log(formData)


    await Http.get('https://transcriber-1.onrender.com/dummy')
      .then(response => console.log(response.data))




  await Http.post(`https://transcriber-1.onrender.com/transcribe`,formToJSON(formData), {
    headers:{
      Accept:"application/json",
      "Content-Type":"application/json",
    }
  }
    )
  .then(function (response) {
    console.log("we arrived")
    
  })
  .catch(function (error) {
    console.log(error);
  });

    
}


function downloadString(text, fileType, fileName) {
  var blob = new Blob([text], { type: fileType });

  var a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
}



const handlechange = (e)=>{
  if (e.target.files?.length!=0 && e.target.files){
                        setFile(null)
                        new Promise(resolve => setTimeout(resolve, 5000));
                        setFile(e.target.files);
                            setworking(0);
                           setranscribing("");
                          console.log(URL.createObjectURL(e.target.files[0]))
                        setsrc(URL.createObjectURL(e.target.files[0]))
                        
                    }
  else {
    setFile(null)
  }
                          }


if (false){
  return <Navigate replace to="/login" />;
}
else{
  function handleSubmitVid(event) {
    
    event.preventDefault()
    setranscribing("Wait")
    if (file){
    A(file[0])
    console.log((file[0]));}
  }


const filePickerOptions = {
  title: 'Select a File',
  multiple: false,  // Allows only one file to be selected
  type: ['image/jpeg', 'image/png'],  // Only allow JPEG and PNG images
};

    
    const handleFilePick = async () => {
      console.log("f")
      res = await DocumentPicker.getDocumentAsync({type:["video/*","audio/*"]})
      console.log(res, typeof(res))
            // Read the file from the URI to a base64 string
            const fileData = await FileSystem.readAsStringAsync(res["assets"][0]["uri"], { encoding: FileSystem.EncodingType.Base64 });

            // Convert the base64 string to a Blob
            const blob = new Blob([fileData], { type: 'video/mp4' }); // Adjust MIME type accordingly
      console.log(blob)
            
    A(blob)      
    };
  


return (
(loading=="Done")&&<>
<View style={styles.container}>
    <Text style={styles.header}>Video Transcriber</Text>
    <Text >
            {/*<svg className="w-8 h-8 mb-4 text-black z-30" aria-hidden="true" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
</svg>*/}
            <Text >Click to upload</Text>
            
        </Text>
        <Text >MP4, MP3, WAV</Text>
    <Input id="dropzone-file" type="file" accept="" onClick={()=>{setFile(null)}} onChange={handlechange} />
    {(file||true)&&<Button onPress={handleFilePick}>
          Press to Transcribe {file&&working}{file&&"% completed"}
        </Button>}


        {(transcribing=="Done"||true)&&<Text><Button onClick={()=>downloadString(transcription, "text/txt", `${file? file[0].name:""}.txt`)} className="w-[200px] my-4 ring-2 ring-white bg-green-600">
          Download Transcription
        </Button><Text>
            {transcription}
            </Text></Text>}
                
        {file&&

          <video id="vid" autoPlay controls loop muted >
            <source src={src}/>
          </video>
       }

  </View>  
</>

)}
}

export default Transcribe


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"white",
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
        fontSize:30,
        borderColor:"green",
        borderWidth: 10,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign:'center',
        textAlignVertical:'center',
        backgroundColor:'yellow',
      }
  
  });