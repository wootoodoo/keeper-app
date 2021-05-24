import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import GetNotesFromDb from "./GetNotesFromDb"
import { BrowserRouter as Router } from 'react-router-dom';


const App = () => {
  const [notes, setNotes] = useState([]);
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  function addNote(newNote) {
    setNotes(prevNotes => {
      return [...prevNotes, newNote];
    });
  }

  function editNote(newNote) {
    setNotes( prevNotes => {
      prevNotes.map(note => 
        note.id === newNote.id 
        ? {...note, content : newNote.content}
        : note
      )
    });
  }

  function deleteNote(id) {
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem, index) => {
        return noteItem.noteId !== id;
      });
    });
  }

  return (
    <Router>  
      <div>
        <Header 
          setLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
        />
        {!isLoggedIn && <GetNotesFromDb 
          getNotes={addNote}
          setLoggedIn={setIsLoggedIn}
        />}
        <body>
          <CreateArea 
            onAdd={addNote}
            isLoggedIn={isLoggedIn}
          />
          {notes.map((noteItem, index) => {
            return (
              <Note
                key={noteItem.noteId}
                id={noteItem.noteId}
                title={noteItem.title}
                content={noteItem.content}
                onDelete={deleteNote}
                onEdit={editNote}
                isLoggedIn={isLoggedIn}
              />
            );
          })}
        </body>
        <Footer />
      </div>
    </Router>
  );
}


export default App;
