import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoPlayer = ({ 
  videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  title = "React Hooks Deep Dive",
  duration = 1800, // 30 minutes in seconds
  currentTime = 0,
  onTimeUpdate = () => {},
  onBookmark = () => {},
  bookmarks = [],
  className = ""
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('720p');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const qualityOptions = ['360p', '480p', '720p', '1080p'];

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const updateProgress = () => {
      const currentProgress = (video?.currentTime / video?.duration) * 100;
      setProgress(currentProgress);
      onTimeUpdate(video?.currentTime);
    };

    const updateBuffered = () => {
      if (video?.buffered?.length > 0) {
        const bufferedEnd = video?.buffered?.end(video?.buffered?.length - 1);
        const bufferedProgress = (bufferedEnd / video?.duration) * 100;
        setBuffered(bufferedProgress);
      }
    };

    video?.addEventListener('timeupdate', updateProgress);
    video?.addEventListener('progress', updateBuffered);
    video?.addEventListener('loadedmetadata', updateBuffered);

    return () => {
      video?.removeEventListener('timeupdate', updateProgress);
      video?.removeEventListener('progress', updateBuffered);
      video?.removeEventListener('loadedmetadata', updateBuffered);
    };
  }, [onTimeUpdate]);

  const togglePlay = () => {
    const video = videoRef?.current;
    if (video?.paused) {
      video?.play();
      setIsPlaying(true);
    } else {
      video?.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e?.target?.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef?.current;
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const handlePlaybackRateChange = (rate) => {
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handleSeek = (e) => {
    const video = videoRef?.current;
    const rect = e?.currentTarget?.getBoundingClientRect();
    const clickX = e?.clientX - rect?.left;
    const newTime = (clickX / rect?.width) * video?.duration;
    video.currentTime = newTime;
  };

  const skipTime = (seconds) => {
    const video = videoRef?.current;
    video.currentTime = Math.max(0, Math.min(video?.duration, video?.currentTime + seconds));
  };

  const toggleFullscreen = () => {
    const container = videoRef?.current?.parentElement;
    if (!document.fullscreenElement) {
      container?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleBookmarkClick = () => {
    const currentVideoTime = videoRef?.current?.currentTime;
    onBookmark(currentVideoTime);
  };

  return (
    <div className={`relative bg-black rounded-xl overflow-hidden group ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={() => {
          const video = videoRef?.current;
          setProgress((video?.currentTime / video?.duration) * 100);
        }}
      />
      {/* Video Overlay Controls */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmarkClick}
                className="text-white hover:bg-white/20"
              >
                <Icon name="Bookmark" size={20} />
              </Button>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <Icon name="Settings" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="w-16 h-16 text-white hover:bg-white/20 rounded-full"
          >
            <Icon name={isPlaying ? "Pause" : "Play"} size={32} />
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div 
              className="w-full h-2 bg-white/30 rounded-full cursor-pointer relative"
              onClick={handleSeek}
            >
              {/* Buffered Progress */}
              <div 
                className="absolute top-0 left-0 h-full bg-white/50 rounded-full"
                style={{ width: `${buffered}%` }}
              />
              {/* Current Progress */}
              <div 
                className="absolute top-0 left-0 h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
              {/* Bookmarks */}
              {bookmarks?.map((bookmark, index) => (
                <div
                  key={index}
                  className="absolute top-0 w-1 h-full bg-accent rounded-full"
                  style={{ left: `${(bookmark?.time / duration) * 100}%` }}
                  title={`Bookmark: ${bookmark?.title}`}
                />
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
              </Button>

              {/* Skip Buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => skipTime(-10)}
                className="text-white hover:bg-white/20"
              >
                <Icon name="RotateCcw" size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => skipTime(10)}
                className="text-white hover:bg-white/20"
              >
                <Icon name="RotateCw" size={18} />
              </Button>

              {/* Volume Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  <Icon name={isMuted ? "VolumeX" : volume > 0.5 ? "Volume2" : "Volume1"} size={18} />
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-full appearance-none slider"
                />
              </div>

              {/* Time Display */}
              <span className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Playback Speed */}
              <div className="relative group/speed">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 text-xs"
                >
                  {playbackRate}x
                </Button>
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 opacity-0 group-hover/speed:opacity-100 transition-opacity">
                  {playbackRates?.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handlePlaybackRateChange(rate)}
                      className={`block w-full text-left px-3 py-1 text-white text-sm hover:bg-white/20 rounded ${
                        rate === playbackRate ? 'bg-primary' : ''
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div className="relative group/quality">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 text-xs"
                >
                  {quality}
                </Button>
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 opacity-0 group-hover/quality:opacity-100 transition-opacity">
                  {qualityOptions?.map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`block w-full text-left px-3 py-1 text-white text-sm hover:bg-white/20 rounded ${
                        q === quality ? 'bg-primary' : ''
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Icon name={isFullscreen ? "Minimize" : "Maximize"} size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;