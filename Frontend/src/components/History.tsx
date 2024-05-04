import Http from "./Http"
import { useState, useEffect } from "react"

const History = ({baseURL}: {baseURL: String}) => {
    const [num, setnum] = useState(0)
    const [MyHistory, setMyHistory] = useState([<div className="text-slate-900 text-3xl p-5"></div>])


  // refresh after delete
  const deleteitem = async (e: any) => {
    await Http.post(`${baseURL}/deleteitem`,{id: e.target.id}), setnum(Math.random())
  }




    async function Get_history() { await Http.get(`${baseURL}/gethistory`).then( 
      
      function (response) {
    
        // history list
        let newc: Array<JSX.Element> = []


    if (response.data.result.length == 0){
      newc = [<div className="text-slate-900 text-3xl p-5"> No history</div>]
      setMyHistory(newc)

    } else {
    response.data.result.map((item: Array<Array<String|Array<String>>>)=>{
              
      newc.unshift(
        <>
          <li key={String(item[2])} style={{margin: "3% 5% 1% 5%", padding:"3% 3% 1% 3%"}} className="text-black md:text-xl text-sm text-left rounded-3xl border bg-gray-100 relative" id={String(item[2])}>
            <span className="indent-8 p-3">Video Name: {item[0]}<br/><br/>Transcription: <br/>{item[1]}</span>
         
          </li>
          <button 
            id={String(item[2])} 
            className="bg-white rounded-3xl ring-2 ring-black   md:text-xl text-sm w-[50%] mx-auto mb-7 mt-0 hover:bg-red-700" 
            onClick={deleteitem}>
            Delete the transcription above
          </button>
        </>)
    },
    setMyHistory(newc)
    )
  
  }});
  
  }

    async function Clear_history() { await Http.post(`${baseURL}/clearhistory`, {}
    ).then( () => {
        setMyHistory([<div className="text-slate-900 text-3xl p-5"> No history</div>])
    });}


    // refresher
    useEffect(()=>{
      Get_history()
    }, [num])


    
  return (
    <>
        <h1 className="m-3">
          History
        </h1>
        <div style={{}} className="md:px-60 px-4"> 
          <div className="p-5">
            <div className="md:text-lg text-[12px] grid grid-cols-2">
              
              <div className="col-span-2 p-10">
              <button onClick={Clear_history} className="text-black w-1/2"> 
                Clear the history
              </button>
              </div>
            </div>
          </div>
          <div className="bg-white min-h-screen rounded-3xl text-black p-1">
            {MyHistory}
          </div>
        </div>
    </>
  )
}

export default History