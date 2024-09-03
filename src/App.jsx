import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faThumbtack, faSearch } from '@fortawesome/free-solid-svg-icons';
 
const App = () => {
  const [notes, setNotes] = useState(() => {
    // Retrieve notes from local storage on initial load
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [noteText, setNoteText] = useState('');
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Save notes to local storage whenever notes array changes
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (!noteText.trim()) return; // Ensure non-empty note

    if (editId) {
      setNotes(notes.map(note => note.id === editId ? { ...note, text: noteText } : note));
      setEditId(null);
    } else {
      const newNote = { id: Date.now(), text: noteText, pinned: false };
      setNotes([newNote, ...notes]);
    }

    setNoteText('');
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleEditNote = (id) => {
    const noteToEdit = notes.find(note => note.id === id);
    setNoteText(noteToEdit.text);
    setEditId(noteToEdit.id);
  };

  const handlePinNote = (id) => {
    setNotes(notes.map(note => note.id === id ? { ...note, pinned: !note.pinned } : note));
  };

  const filteredNotes = notes
    .filter(note => note.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.pinned - a.pinned); // Pinned notes first

  return (
    <div className="app-container">
      <h1>Sticky Notes App</h1>

      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} />
        <input 
          type="text" 
          placeholder="Search notes..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>

      <div className="note-input">
        <textarea 
          value={noteText} 
          onChange={(e) => setNoteText(e.target.value)} 
          placeholder="Type your note here..." 
        />
        <button onClick={handleAddNote}>
          {editId ? 'Update Note' : 'Add Note'}
        </button>
      </div>

      <div className="notes-grid">
        {filteredNotes.map(note => (
          <div key={note.id} className={`note ${note.pinned ? 'pinned' : ''}`}>
            <p>{note.text}</p>
            <div className="note-actions">
              <FontAwesomeIcon icon={faEdit} onClick={() => handleEditNote(note.id)} />
              <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteNote(note.id)} />
              <FontAwesomeIcon icon={faThumbtack} onClick={() => handlePinNote(note.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
