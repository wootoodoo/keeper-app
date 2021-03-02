import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import axios from 'axios';
import Config from '../config/config';

function CreateArea(props) {
  const [isExpanded, setExpanded] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: "",
    noteId: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  async function submitNote(event) {
    const newNoteId = (new Date()).toJSON();
    setNote(prevNote => {
      return {
        ...prevNote,
        noteId: newNoteId
      }
    });
    props.onAdd(note);

    // post data to /usernotes/:userId
    if (window.localStorage.userId) {
      try {
        const userIdParam = "?user_id=" + window.localStorage.userId;
        let operationParam = '&operation=create'
        const url = "https://a4m9zicl40.execute-api.ap-southeast-1.amazonaws.com/dev/usernotes" + userIdParam + operationParam;
        const body = {
          "note_title": note.title,
          "note_time": newNoteId,
          "note_content": note.content,
          "user_id": window.localStorage.userId
        }
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'X-Amz-Security-Token': window.localStorage.id_token
          }
        }
        let res = axios.post(url, body, config);
      } catch (err) {
        console.log(err.message)
      }
    }

    setNote({
      title: "",
      content: "",
      noteId: ""
    });
    event.preventDefault();
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div>
      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}
        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
        />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
      
    </div>
  );
}

export default CreateArea;
