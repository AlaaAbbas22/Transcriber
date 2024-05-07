import { Navigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from 'react'
import Http from "./Http";
import { TailSpin } from "react-loader-spinner";
import { TypeAnimation } from 'react-type-animation';
import { AxiosProgressEvent } from "axios";


const Transcribe = ({ baseURL }: {baseURL: String}) => {
      // setting vars
  const [file, setFile] = useState<FileList|null>(null)
  const [transcription, settranscription] = useState("")
  const loading = "Done"
  const [working, setworking] = useState(0)
  const [transcribing , setranscribing] = useState("");
  const [src, setsrc] = useState("")

  const config = {
    onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
      if(progressEvent?.loaded && progressEvent?.total ) {

      var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      setworking(percentCompleted)}
    }
  }
  

//handling submitting mean
async function A(file:File) {
  setworking(0)
  const formData = new FormData();
    formData.append('file.mp3', file)

  await Http.post(`${baseURL}/transcribe`, formData, config
    )
  .then(function (response) {
    settranscription(response.data.transcription)
    setranscribing("Done")
  })
  .catch(function (error) {
    console.log(error);
  });
}


function downloadString(text: BlobPart, fileType: string, fileName:string) {
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



const handlechange = (e:ChangeEvent<HTMLInputElement>)=>{
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


if (localStorage.getItem("logged_intern")=="false"){
  return <Navigate replace to="/login" />;
}
else{
  function handleSubmitVid(event: FormEvent<HTMLFormElement>): void {
    
    event.preventDefault()
    setranscribing("Wait")
    if (file){
    A(file[0])
    console.log((file[0]));}
  }

return (
(loading=="Done")&&<>
  <div className="md:mx-40 my-10 min-h-[150vh]" >
  <h1 className='my-10 font-mono ring-2 rounded-xl bg-gradient-to-r from-cyan-700 shadow-2xl to-blue-800 text-gray-200 p-4 w-[60%] mx-auto min-[0px]:text-sm md:text-2xl'>Video Transcriber</h1>
    <div className="grid grid-cols-1">
    <div className={file&&"col-span-1 m-auto"||"col-span-1"}>
      <form onSubmit={handleSubmitVid} >
      <div className="flex items-center justify-center w-full">
    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-[60vh] h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 relative">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-black z-30" aria-hidden="true" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-black z-30"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-black z-30">MP4, MP3, WAV</p>
        </div>
        <input id="dropzone-file" type="file" className="text-black  bg-transparent h-[100%] absolute top-0 w-[100%] z-30 bg-gray-500 bg-opacity-50" accept="" onClick={()=>{setFile(null)}} onChange={handlechange} />
        {file&&

          <video id="vid" autoPlay controls loop muted className="mx-auto h-[100%] absolute top-0 z-0 ">
            <source src={src}/>
          </video>
       }
    </label>
</div> 
       
        <br/>
        {file&&<button type="submit" className="w-[200px] my-3 ring-2 ring-white bg-sky-700">
          Press to Transcribe {file&&working}{file&&"% completed"}
        </button>}
        </form>
        {transcribing=="Wait"&&<div className="m-auto my-10 w-40"><TailSpin
            height="140"
            width="140"
            color="#5555ff"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        /></div>}
        {transcribing=="Done"&&<div><button onClick={()=>downloadString(transcription, "text/txt", `${file? file[0].name:""}.txt`)} className="w-[200px] my-4 ring-2 ring-white bg-green-600">
          Download Transcription
        </button><div className="w-[60vh] mx-auto py-2 ring "><TypeAnimation
        sequence={[
          String(transcription),
          1000
        ]}
        speed={70}
        repeat={Infinity}
        style={{ fontSize: '1em' }}
      /></div></div>}
      
      </div>
      
    </div>
  </div>
  
</>||<div className="m-auto my-20 w-40"><TailSpin
            height="140"
            width="140"
            color="#5555ff"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        /></div>
)}
}

export default Transcribe