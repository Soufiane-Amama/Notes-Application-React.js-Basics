import { useState, useEffect } from "react";
import "./App.css";
import Preview from "./components/Preview";
import Message from "./components/Message";
import NotesContainer from "./components/Notes/NotesContainer";
import NotesList from "./components/Notes/NotesList";
import Note from "./components/Notes/Note";
import NoteForm from './components/Notes/NoteForm';
import Alert from './components/Alert';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);


  useEffect(() => {
    if (localStorage.getItem('notes')) {
      setNotes(JSON.parse(localStorage.getItem('notes')));
    } else {
      localStorage.setItem('notes', JSON.stringify([]));
      setNotes([]);
    }
  }, []);


  useEffect(() => {
    if (validationErrors.length !== 0) {
      setTimeout(() => {
        setValidationErrors([]);
      }, 3000);
    }
  }, [validationErrors]);


   // حفظ في الذاكرة المحلية
   const saveToLocalStorage = (name, item) => {
    localStorage.setItem(name, JSON.stringify(item));
  };


  // التحقق من البيانات
  const validate = () => {
    const validationErrors = [];
    let passed = true;
    if (!title) {
      validationErrors.push('الرجاء إدخال عنوان الملاحظة');
      passed = false;
    }
    if (!content) {
      validationErrors.push('الرجاء إدخال محتوى الملاحظة');
      passed = false;
    }
    setValidationErrors(validationErrors);
    return passed;
  };



    //تغيير عنوان الملاحظة
    const changeTitleHandler = (event) => {
      setTitle(event.target.value);
    };
  
    //تغيير نص الملاحظة
    const changeContentHandler = (event) => {
      setContent(event.target.value);
    };

   //الانتقال إلى وضع إضافة ملاحظة
  const addNoteHandler = () => {
    setCreating(true);
    setTitle("");
    setContent("");
    setEditing(false);
  };

    //حفظ الملاحظة
    const saveNoteHandler = () => {
      if (!validate()) return;
      const note = {
        id: new Date(),
        title: title,
        content: content,
      };
      const updatedNotes = [...notes, note];
      saveToLocalStorage('notes', updatedNotes);
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

  //حذف الملاحظة
  const deleteNoteHandler = (noteId) => {
    const updatedNotes = [...notes];
    const noteIndex = updatedNotes.findIndex((note) => note.id === noteId);
    updatedNotes.splice(noteIndex, 1);
    saveToLocalStorage('notes', updatedNotes);
    setNotes(updatedNotes);
    setSelectedNote(null);
  };
  
    // حفظ تعديلات الملاحظة
    const updateNoteHandler = () => {
      if (!validate()) return;
      const updatedNotes = [...notes];
      const noteIndex = notes.findIndex((note) => note.id === selectedNote);
      updatedNotes[noteIndex] = {
        id: selectedNote,
        title: title,
        content: content,
      };
      saveToLocalStorage('notes', updatedNotes);
  
      setNotes(updatedNotes);
      setEditing(false);
      setTitle('');
      setContent('');
    };



  //الانتقال إلى وضع تعديل الملاحظة
  const editNoteHandler = (noteId) => {
    const note = notes.find((note) => note.id === noteId);

    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  };

  const getAddNote = () => {
    return (
    <NoteForm
      formTitle="ملاحظة جديدة"
      title={title}
      content={content}
      titleChanged={changeTitleHandler}
      contentChanged={changeContentHandler}
      submitText="حفظ"
      submitClicked={saveNoteHandler}
    />
    );
  };


   //إحضار قسم عرض الملاحظة
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

    let noteDisplay = (
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    );

    if (editing) {
      noteDisplay = (
        <NoteForm
          formTitle="تعديل ملاحظة"
          title={title}
          content={content}
          titleChanged={changeTitleHandler}
          contentChanged={changeContentHandler}
          submitText="تعديل"
          submitClicked={updateNoteHandler}
        />
      );
    }

    return (
      <div>
        {!editing && (
          <div className="note-operations">
            <a href="#" onClick={() => editNoteHandler(note.id)}>
              <i className="fa fa-pencil-alt" />
            </a>
            <a href="#" onClick={() => deleteNoteHandler(note.id)}>
              <i className="fa fa-trash" />
            </a>
          </div>
        )}
        {noteDisplay}
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
          ))}
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>
          +
        </button>
      </NotesContainer>
      <Preview>{creating ? getAddNote() : getPreview()}</Preview>

      {validationErrors.length !== 0 && (
        <Alert validationMessages={validationErrors} />
      )}
    </div>
  );
}

export default App;
