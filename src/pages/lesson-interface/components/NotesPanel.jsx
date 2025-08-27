import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const NotesPanel = ({ 
  isOpen = false,
  onToggle = () => {},
  onClose = () => {},
  currentTime = 0,
  lessonId = 1,
  className = ""
}) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState('');
  const textareaRef = useRef(null);

  // Mock notes data
  const mockNotes = [
    {
      id: 1,
      text: "useState hook allows functional components to have state. The hook returns an array with current state and setter function.",
      timestamp: 45,
      videoTime: "0:45",
      tags: ['hooks', 'state'],
      createdAt: new Date(Date.now() - 3600000),
      color: 'blue'
    },
    {
      id: 2,
      text: "useEffect is like componentDidMount, componentDidUpdate, and componentWillUnmount combined. Very powerful for side effects.",
      timestamp: 125,
      videoTime: "2:05",
      tags: ['hooks', 'lifecycle'],
      createdAt: new Date(Date.now() - 1800000),
      color: 'green'
    },
    {
      id: 3,
      text: "Dependency array in useEffect determines when the effect runs. Empty array = run once, no array = run every render.",
      timestamp: 180,
      videoTime: "3:00",
      tags: ['hooks', 'dependencies'],
      createdAt: new Date(Date.now() - 900000),
      color: 'yellow'
    },
    {
      id: 4,
      text: "Custom hooks are just functions that use other hooks. Great for reusing stateful logic between components.",
      timestamp: 240,
      videoTime: "4:00",
      tags: ['hooks', 'custom'],
      createdAt: new Date(Date.now() - 300000),
      color: 'purple'
    }
  ];

  const [allNotes, setAllNotes] = useState(mockNotes);

  const availableTags = ['all', 'hooks', 'state', 'lifecycle', 'dependencies', 'custom'];
  const noteColors = ['blue', 'green', 'yellow', 'purple', 'pink', 'orange'];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date?.toLocaleDateString();
  };

  const handleAddNote = () => {
    if (!newNote?.trim()) return;

    const note = {
      id: Date.now(),
      text: newNote,
      timestamp: currentTime,
      videoTime: formatTime(currentTime),
      tags: extractTags(newNote),
      createdAt: new Date(),
      color: noteColors?.[Math.floor(Math.random() * noteColors?.length)]
    };

    setAllNotes(prev => [note, ...prev]);
    setNewNote('');
  };

  const extractTags = (text) => {
    const words = text?.toLowerCase()?.split(' ');
    const foundTags = availableTags?.filter(tag => 
      tag !== 'all' && words?.some(word => word?.includes(tag))
    );
    return foundTags?.length > 0 ? foundTags : ['general'];
  };

  const handleEditNote = (noteId, newText) => {
    setAllNotes(prev => prev?.map(note => 
      note?.id === noteId 
        ? { ...note, text: newText, tags: extractTags(newText) }
        : note
    ));
    setIsEditing(null);
    setEditText('');
  };

  const handleDeleteNote = (noteId) => {
    setAllNotes(prev => prev?.filter(note => note?.id !== noteId));
  };

  const filteredNotes = allNotes?.filter(note => {
    const matchesSearch = !searchQuery || 
      note?.text?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      note?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
    
    const matchesTag = selectedTag === 'all' || note?.tags?.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && (e?.ctrlKey || e?.metaKey)) {
      handleAddNote();
    }
  };

  useEffect(() => {
    if (textareaRef?.current && isOpen) {
      textareaRef?.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-y-0 left-0 w-80 glass-lg border-r border-white/20 z-30 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="font-semibold">Lesson Notes</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      {/* Add Note Section */}
      <div className="p-4 border-b border-white/10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Current time: {formatTime(currentTime)}</span>
          </div>
          
          <textarea
            ref={textareaRef}
            value={newNote}
            onChange={(e) => setNewNote(e?.target?.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add a note at current timestamp..."
            className="w-full h-20 p-3 bg-muted border border-white/10 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Ctrl+Enter to save
            </span>
            <Button
              variant="default"
              size="sm"
              onClick={handleAddNote}
              disabled={!newNote?.trim()}
            >
              <Icon name="Plus" size={14} className="mr-1" />
              Add Note
            </Button>
          </div>
        </div>
      </div>
      {/* Search and Filter */}
      <div className="p-4 border-b border-white/10 space-y-3">
        <Input
          type="search"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
        />
        
        <div className="flex flex-wrap gap-1">
          {availableTags?.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2 py-1 text-xs rounded-full transition-smooth capitalize ${
                selectedTag === tag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredNotes?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="FileText" size={48} className="mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              {searchQuery || selectedTag !== 'all' ? 'No matching notes found' : 'No notes yet'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {!searchQuery && selectedTag === 'all' && 'Start taking notes to remember key insights'}
            </p>
          </div>
        ) : (
          filteredNotes?.map((note) => (
            <div
              key={note?.id}
              className={`p-3 rounded-lg border-l-4 bg-muted/50 hover:bg-muted/70 transition-smooth group ${
                note?.color === 'blue' ? 'border-l-blue-500' :
                note?.color === 'green' ? 'border-l-green-500' :
                note?.color === 'yellow' ? 'border-l-yellow-500' :
                note?.color === 'purple' ? 'border-l-purple-500' :
                note?.color === 'pink'? 'border-l-pink-500' : 'border-l-orange-500'
              }`}
            >
              {/* Note Header */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => {/* Jump to timestamp */}}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-smooth"
                >
                  <Icon name="Play" size={12} />
                  {note?.videoTime}
                </button>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsEditing(note?.id);
                      setEditText(note?.text);
                    }}
                    className="h-6 w-6"
                  >
                    <Icon name="Edit2" size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteNote(note?.id)}
                    className="h-6 w-6 text-error hover:text-error/80"
                  >
                    <Icon name="Trash2" size={12} />
                  </Button>
                </div>
              </div>

              {/* Note Content */}
              {isEditing === note?.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e?.target?.value)}
                    className="w-full h-20 p-2 bg-background border border-white/10 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleEditNote(note?.id, editText)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(null);
                        setEditText('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed mb-2">{note?.text}</p>
              )}

              {/* Note Footer */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {note?.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(note?.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filteredNotes?.length} notes</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs">
              <Icon name="Download" size={12} className="mr-1" />
              Export
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              <Icon name="Share" size={12} className="mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;