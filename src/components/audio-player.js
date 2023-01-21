import React, { useRef, useState } from 'react';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaUndoAlt, FaRedoAlt } from 'react-icons/fa'
import { formatTime, formatHumanReadTime } from '../helpers/formatTime';
;
const AudioPlayer = ({src, transcript}) => {  
  // Create a fast-forward and rewind 15 seconds button
  // create a scrubber
  // create a playback rate button
  // volume slider
  // mute toggle
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false);
  // Create an elapse time and total time
  const [duration, setDuration] = useState(0)
  const [mediaTime, setMediaTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  

  // Create a play button that toggles play and pause
  const togglePlaying = () => {
    setIsPlaying(!isPlaying)
    isPlaying ? audioRef.current.pause() : audioRef.current.play()
  }

  const onLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  }

  const onTimeUpdate = () => {
    setMediaTime(audioRef.current.currentTime)
  }

  const onScrubberChange = (e) => {
    const newTime = e.target.value
    setMediaTime(newTime)
    audioRef.current.currentTime = newTime
  }
  const onRewind = () => {
    const { currentTime } = audioRef.current;
    const newTime = Math.max(currentTime - 15,  0);
    setMediaTime(newTime)
    audioRef.current.currentTime = newTime;
  }

   const onFastForward = () => {
    const { currentTime } = audioRef.current;
    const newTime = Math.min(currentTime + 15,  duration) ;
    setMediaTime(newTime)
    audioRef.current.currentTime = newTime;
  }

  const rates = [0.75, 1, 1.5, 2];
  formatHumanReadTime(1000);

  const onRateChange = (rate) => {
    audioRef.current.playbackRate = rate;
  }

  const onMuted = () => {
    setIsMuted(!isMuted)
    audioRef.current.muted = !isMuted
  }

  const onVolumeChange = () => {
    if(audioRef.current.muted || audioRef.current.volume === 0) {
      setIsMuted(true)
    } else if (!audioRef.current.muted) {
      setIsMuted(false)
      setVolume(audioRef.current.volume)
    }
  }

  const onVolumeScrubberChange = (event) => {
    //to be more safe we set Number on whatever is the value:
    const newVolume = Number(event.target.value);
    setVolume(newVolume)
    audioRef.current.volume = newVolume 
  }
  
  return ( 
    <>
    <div className='audio' onClick={togglePlaying}>
      <button>
        {isPlaying ? (
        <>
          <span className='visually-hidden'>Pause</span>
          <FaPause aria-hidden='true'/> 
        </>
        ) : (
        <> 
          <span className='visually-hidden'>Play</span>
          <FaPlay aria-hidden='true'/>
        </>
        )} 
      </button>
      <span className='elapsed'>Elapsed total: {formatTime(mediaTime)}</span>
      <span className='duration'>Total Duration: {formatTime(duration)}</span>
      <label htmlFor="time-scrubber">scrubber</label>
      <input 
        type="range" 
        id='time-scrubber' 
        value={mediaTime} 
        onChange={onScrubberChange} 
        min={0}
        max={duration} 
        aria-valuetext={formatHumanReadTime(mediaTime)}
      /> 
      
      {/* Redo and Rewind Buttons */}
      <button aria-label='Rewind 15 seconds' onClick={onRewind}>
        <FaUndoAlt aria-hidden='true'/>
        <span>15s</span>
      </button>

      <button arial-label='Redo 15 seconds' onClick={onFastForward}>
        <FaRedoAlt aria-hidden="true" onClick={onFastForward} />
        <span>15s</span>
      </button>
      
      {/* Map over the rates */}
      {rates.map((rate) => (
        <button key={rate} onClick={() => onRateChange(rate)}>{rate}x</button>
      ))}

      <button onClick={onMuted}>{isMuted ? 
      (
        <>
          <span className='visually-hidden'>Unmuted</span>
          <FaVolumeMute aria-hidden='true'/>
        </>
      ) : (
        <>
          <span className='visually-hidden'>mute</span>
          <FaVolumeUp aria-hidden='true'/>        
        </>

      )}
      </button>
      <label htmlFor="volume-scrubber">Volume</label>
      <input id='volume-scrubber' type="range" step={0.1} min={0} max={1} value={isMuted ? 0 : volume} onChange={onVolumeScrubberChange} />
    </div>
      <audio
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        ref={audioRef}
        onVolumeChange={onVolumeChange}
        src={src} 
        controls
      />
        
      <div>{transcript}</div>
      
    </>
  )
}

export default AudioPlayer