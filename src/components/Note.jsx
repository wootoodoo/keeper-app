import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from 'axios';

function Note(props) {
  async function handleClick() {
    const noteId = props.id;
    props.onDelete(noteId);
    
    // delete to /usernotes?userId&operation&note_id
    if (window.localStorage.userId) {
      try {
        const userIdParam = "?user_id=" + window.localStorage.userId;
        const operationParam = '&operation=delete'
        const noteIdParam = '&note_id=' + noteId
        const url = "https://a4m9zicl40.execute-api.ap-southeast-1.amazonaws.com/dev/usernotes" + userIdParam + noteIdParam + operationParam;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'X-Amz-Security-Token': window.localStorage.id_token
          }
        }
        let res = axios.delete(url, config);
      } catch (err) {
        console.log(err.message)
      }
    }
  }

  function convertTime(timeStamp) {
    const UTCtime = new Date(timeStamp);
    const date = UTCtime.toDateString();
    const time = UTCtime.toTimeString();
    return time.slice(0,5) + "    " + date.slice(8,10) + "-" + date.slice(4,7) + "-" + date.slice(11,15);
  }

  return (
    <div className="note">
      <h1>{props.title}</h1>
      <em>Created: {convertTime(props.id)}</em>
      
      <p>{props.content}</p>
      <button onClick={handleClick}>
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;
