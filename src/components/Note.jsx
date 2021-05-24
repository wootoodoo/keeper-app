import React, { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import axios from 'axios';

function Note(props) {

  const [note, setNote] = useState({
    title: props.title,
    content: props.content,
    noteId: props.id
  })
  const [edit, setEdit] = useState(false);

  function handleEdit() {
    setEdit(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  async function submitEdit(event) {
    props.onEdit(note);
    setEdit(false);
    event.preventDefault();
  }

  async function handleDelete() {
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
        axios.delete(url, config);
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
      <h1>{note.title}</h1>
      <em>Created: {
        (props.isLoggedIn && props.id !== "") ? convertTime(props.id) : convertTime(Date.now())
        }</em>
      {edit && <form className="editNote"> 
                  <textarea
                    name="content"
                    onChange={handleChange}
                    value={note.content}
                  />
                  <button onClick={submitEdit}>
                    <SaveIcon />
                  </button>
              </form>}
      {!edit && <p>{note.content}</p>}
      <button onClick={handleDelete}>
        <DeleteIcon />
      </button>
      <button onClick={handleEdit}>
        <EditIcon />
      </button>
    </div>
  );
}

export default Note;
