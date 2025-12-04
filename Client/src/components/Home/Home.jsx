import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

function Home() {
    const [name , setName] = useState('')
    const [joinId , setJoinId] = useState('')
    const navigate = useNavigate()

    async function createMeeting() {
    
    const response = await fetch(`${import.meta.env.VITE_SERVER_SIDE_URL}/meetly/create-meeting` , {
        method : 'POST',
        headers : { 'Content-Type' : 'application/json' },
        // credentials : true,
        body : JSON.stringify({
            hostName : name || 'Host'
        })
    })

     const data = await response.json()
       navigate(`/call/:${data.roomId}` , {state : { name : name || 'Host' , isHost : true }})
    }

    function joinMeeting() {
        if(! joinId) return alert('Enter Meeting Id or Url')
            navigate(`/call/${joinId}` , { state : { name : name || 'Guest' , isHost : false } })
    }
   
    return (
    <div style={{ padding: 20 }}>
      <h2>1:1 Video Call — Home</h2>
      <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <div style={{ marginTop: 10 }}>
        <button onClick={createMeeting}>Create Meeting (Get Link)</button>
      </div>

      <hr />

      <h3>Or join a meeting</h3>
      <input placeholder="Room ID" value={joinId} onChange={(e) => setJoinId(e.target.value)} />
      <div style={{ marginTop: 10 }}>
        <button onClick={joinMeeting}>Join</button>
      </div>
    </div>
    )

}


export default Home