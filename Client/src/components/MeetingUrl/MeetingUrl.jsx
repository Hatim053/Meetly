import { useState } from "react";
import styles from "./meetingUrl.module.css";
import { useSelector } from 'react-redux'

const MeetingUrl = () => {
  const [copied, setCopied] = useState(false);
const meetingUrl = useSelector(state => state.roomId)

async function handleCopy() {
    try {
        await navigator.clipboard.writeText(`/call/${meetingUrl}`)
        setCopied(!copied)
        setTimeout(() => {
            setCopied(!copied)
        } , 2000)
    } catch (error) {
        console.log('something went wrong' , error)
    }
}
console.log(`https://meetly-tan.vercel.app/call/${meetingUrl}`)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>🔗</span>
        <h3>Share this meeting link</h3>
      </div>

      <div className={styles.linkBox}>
        <input
          type="text"
          value={`https://meetly-tan.vercel.app/call/${meetingUrl}`}
          readOnly
          className={styles.input}
        />
        <button onClick={handleCopy} className={styles.copyBtn}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

   
    </div>
  );
};

export default MeetingUrl;