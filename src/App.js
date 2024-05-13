import { useState, useEffect } from 'react';
import './App.css';
import Preview from './components/Preview';
import Message from './components/Message'; 
import NotesContainer from './components/Notes/NotesContainer';
import NotesList from './components/Notes/NotesList';
import Note from './components/Notes/Note';


function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);



  const addNoteHandler = () => {
    setCreating(true);
    setTitle('');
    setContent('');
    setEditing(false);
  };

  
  //حفظ الملاحظة
  const saveNoteHandler = () => {
    const note = {
      id: new Date(),
      title: title,
      content: content,
    };
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    setTitle('');
    setContent('');
    setCreating(false);
    setSelectedNote(note.id);
  };

    //اختيار ملاحظة
    const selectNoteHandler = (noteId) => {
      setSelectedNote(noteId);
      setCreating(false);
      setEditing(false);
    }; 


  
  const getAddNote = () => {

    return (
      <div>
        <h2>إضافة ملاحظة جديدة</h2>
        <div>
          <input
            type="text"
            name="title"
            className="form-input mb-30"
            placeholder="العنوان"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <textarea
            rows="10"
            name="content"
            className="form-input"
            placeholder="النص"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />

          <a href="#" className="button green" onClick={saveNoteHandler}>
            حفظ
          </a>
        </div>
      </div>
    );
  };

  const getPreview = () => {

    if (notes.length === 0) {
      return <Message title="لا يوجد ملاحظات" />;
    }

    if (!selectedNote) {
      return <Message title="الرجاء اختيار ملاحظة" />;
    }

    const note = notes.find((note) => {
      return note.id === selectedNote;
    });

    return (
      <div>
        <div className="note-operations">
          <a href="#">
            <i className="fa fa-pencil-alt" />
          </a>
          <a href="#">
            <i className="fa fa-trash" />
          </a>
        </div>
        <div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
       <NotesContainer>
        <NotesList>
          {notes.map((note) => (
            <Note
              key={note.id}
              title={note.title}
              active={selectedNote === note.id}
              noteClicked={() => selectNoteHandler(note.id)}
            />
            ))
          }
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
        </NotesContainer>
      <Preview>{creating ? getAddNote() : getPreview()}</Preview>
    </div>
  );
}

export default App;
