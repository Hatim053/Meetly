import React, { useEffect, useState } from "react"
import styles from './codeEditor.module.css'
import Editor from '@monaco-editor/react'
import socket from "../../../socket.js"
import { useSelector } from "react-redux"

function CodeEditor() {

const [language , setLanguage] = useState('javascript')
const [code , setCode] = useState('')
const [isTyping , setIsTyping] = useState('')
const [theme , setTheme] = useState(false)
const [version , setVersion] = useState('*')
const roomId = useSelector(state => state.roomId)
const loggedInUser = useSelector(state => state.loggedInUser)
const [output , setOutput] = useState('')

useEffect(() => {

})

function handleCodeChange(value) {
socket?.emit('code-change' , ({code , roomId , userId : loggedInUser._id}))
socket?.emit('typing' , ({name : loggedInUser.name , roomId}))
setCode(value)
}
socket?.on('on-code-change' , ({codeValue}) => setCode(codeValue))
socket?.on('on-language-change' , ({languageValue}) => setLanguage(languageValue))
socket?.on('on-typing' , ({name}) => {
    setIsTyping(name)
    setTimeout(() => setIsTyping('') , 2000)
})
socket?.on('on-run' , ({outputValue}) => {
    console.log(outputValue)
     setOutput(outputValue)
})

function handleLanguageChange() {
    socket.emit('language-change' , ({language , roomId}))
}

async function handleRunCode() {
    // fetch api here
     const response = await fetch('https://emkc.org/api/v2/piston/execute' , {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify({
            language,
            version,
            files : [
                {
                    content : code,
                }
            ]

        })
     })
     const data = await response.json()
     console.log(data.run.stdout)
     socket.emit('run' , ({roomId , outputValue : data.run.stdout}))
     setOutput(data.run.stdout)
    // and execute the code and also emit the socket emit 
}


    return (
    <>
       <div className={styles["toolbar"]}>
    <div className={styles["left-controls"]}>
      <select className={styles["language-select"]} defaultValue={'javascript'} value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value={'javascript'}>JavaScript</option>
        <option value={'python'}>Python</option>
        <option value={'cpp'}>C++</option>
        <option value={'java'}>Java</option>
      </select>

      <button className={styles["run-btn"]} onClick={handleRunCode}>▶ Run</button>
    </div>

    <div className={styles["right-controls"]}>
      <span className={styles["typing-status"]}>{isTyping && `${isTyping} is typing..`}</span>
      <button className={styles["theme-toggle"]} onClick={() => setTheme(!theme)}>🌙</button>
    </div>
  </div>

  <div className={styles["main-container"]}>
    
    <div className={styles["editor-container"]}>
             <Editor className={styles['editor']} 
        defaultLanguage="javascript"
        defaultValue="// code here"
        value={code}
        language={language}
        theme={theme}
        options={{
            minimap : {enabled : false},
            fontSize : 14,
        }}
        onChange={handleCodeChange}
        />
    </div>

    <div className={styles["output-section"]}>
      <div className={styles["output-header"]}>Output</div>
      <pre className={styles["output-console"]}>{output ? output : 'Waiting for code execution...'}</pre>
    </div>

  </div>
    </>
    )
}


export default CodeEditor