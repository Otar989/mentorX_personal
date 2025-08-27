import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const InteractiveTranscript = ({ 
  transcript = [],
  currentTime = 0,
  onSeekTo = () => {},
  isVisible = true,
  onToggle = () => {},
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const transcriptRef = useRef(null);
  const activeItemRef = useRef(null);

  // Mock transcript data
  const mockTranscript = transcript?.length > 0 ? transcript : [
    {
      id: 1,
      startTime: 0,
      endTime: 15,
      speaker: "Instructor",
      text: "Welcome to this comprehensive lesson on React Hooks. Today we'll explore the most important hooks that will transform how you build React applications."
    },
    {
      id: 2,
      startTime: 15,
      endTime: 32,
      speaker: "Instructor", 
      text: "Let's start with useState, which is probably the most fundamental hook you'll use. It allows functional components to have state."
    },
    {
      id: 3,
      startTime: 32,
      endTime: 48,
      speaker: "Instructor",
      text: "Here's a simple example: const [count, setCount] = useState(0). This creates a state variable called count with an initial value of 0."
    },
    {
      id: 4,
      startTime: 48,
      endTime: 65,
      speaker: "Instructor",
      text: "The useState hook returns an array with two elements: the current state value and a function to update it."
    },
    {
      id: 5,
      startTime: 65,
      endTime: 82,
      speaker: "Instructor",
      text: "Next, let's look at useEffect. This hook lets you perform side effects in functional components, similar to componentDidMount and componentDidUpdate combined."
    },
    {
      id: 6,
      startTime: 82,
      endTime: 98,
      speaker: "Instructor",
      text: "useEffect takes two arguments: a function that contains the side effect logic, and an optional dependency array."
    },
    {
      id: 7,
      startTime: 98,
      endTime: 115,
      speaker: "Instructor",
      text: "If you pass an empty dependency array, the effect will only run once after the initial render, similar to componentDidMount."
    },
    {
      id: 8,
      startTime: 115,
      endTime: 132,
      speaker: "Instructor",
      text: "Now let's discuss useContext, which provides a way to pass data through the component tree without having to pass props down manually at every level."
    }
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query?.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const results = mockTranscript?.filter(item => 
      item?.text?.toLowerCase()?.includes(query?.toLowerCase())
    )?.map(item => ({
      ...item,
      highlightedText: item?.text?.replace(
        new RegExp(query, 'gi'),
        (match) => `<mark class="bg-accent/30 text-accent-foreground">${match}</mark>`
      )
    }));
    
    setSearchResults(results);
    setCurrentSearchIndex(0);
    setIsSearching(false);
  };

  const navigateSearch = (direction) => {
    if (searchResults?.length === 0) return;
    
    const newIndex = direction === 'next' 
      ? (currentSearchIndex + 1) % searchResults?.length
      : (currentSearchIndex - 1 + searchResults?.length) % searchResults?.length;
    
    setCurrentSearchIndex(newIndex);
    onSeekTo(searchResults?.[newIndex]?.startTime);
  };

  const handleTranscriptClick = (startTime) => {
    onSeekTo(startTime);
  };

  const getCurrentActiveItem = () => {
    return mockTranscript?.find(item => 
      currentTime >= item?.startTime && currentTime < item?.endTime
    );
  };

  const activeItem = getCurrentActiveItem();

  // Auto-scroll to active transcript item
  useEffect(() => {
    if (activeItemRef?.current && transcriptRef?.current) {
      const container = transcriptRef?.current;
      const activeElement = activeItemRef?.current;
      const containerRect = container?.getBoundingClientRect();
      const elementRect = activeElement?.getBoundingClientRect();
      
      if (elementRect?.top < containerRect?.top || elementRect?.bottom > containerRect?.bottom) {
        activeElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeItem]);

  if (!isVisible) return null;

  return (
    <div className={`glass-lg rounded-xl border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Icon name="FileType" size={20} className="text-primary" />
          <h3 className="font-semibold">Interactive Transcript</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      {/* Search Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => handleSearch(e?.target?.value)}
            className="pr-20"
          />
          {searchResults?.length > 0 && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <span className="text-xs text-muted-foreground">
                {currentSearchIndex + 1}/{searchResults?.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateSearch('prev')}
                className="h-6 w-6"
              >
                <Icon name="ChevronUp" size={12} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateSearch('next')}
                className="h-6 w-6"
              >
                <Icon name="ChevronDown" size={12} />
              </Button>
            </div>
          )}
        </div>
        
        {isSearching && (
          <div className="mt-2 text-sm text-muted-foreground">Searching...</div>
        )}
        
        {searchQuery && searchResults?.length === 0 && !isSearching && (
          <div className="mt-2 text-sm text-muted-foreground">No results found</div>
        )}
      </div>
      {/* Transcript Content */}
      <div 
        ref={transcriptRef}
        className="max-h-96 overflow-y-auto p-4 space-y-3"
      >
        {(searchResults?.length > 0 ? searchResults : mockTranscript)?.map((item, index) => {
          const isActive = activeItem?.id === item?.id;
          const isSearchResult = searchResults?.length > 0;
          const isCurrentSearchResult = isSearchResult && index === currentSearchIndex;
          
          return (
            <div
              key={item?.id}
              ref={isActive ? activeItemRef : null}
              onClick={() => handleTranscriptClick(item?.startTime)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 border border-primary/20' 
                  : isCurrentSearchResult
                  ? 'bg-accent/10 border border-accent/20' :'hover:bg-white/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <span className={`text-xs font-mono px-2 py-1 rounded ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {formatTime(item?.startTime)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      {item?.speaker}
                    </span>
                    {isActive && (
                      <Icon name="Play" size={12} className="text-primary" />
                    )}
                  </div>
                  
                  <p 
                    className={`text-sm leading-relaxed ${
                      isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                    dangerouslySetInnerHTML={{ 
                      __html: item?.highlightedText || item?.text 
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{mockTranscript?.length} transcript segments</span>
          <div className="flex items-center gap-4">
            <span>Click timestamp to jump to section</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              <Icon name="Download" size={14} className="mr-1" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTranscript;