import React, { useRef, useState, forwardRef } from 'react';
import {
  FaPlayCircle,
  FaPauseCircle,
  FaVolumeMute,
  FaVolumeUp,
  FaRedoAlt,
  FaUndoAlt,
} from "react-icons/fa";

import { formatTime, formatHumanReadTime } from '../../helpers/formatTime';
import DropdownMenu from '../dropdown-menu/dropdown-menu';
import './audio-player.css';

const AudioPlayer = forwardRef((props, ref) => {   

  const {src, transcript} = props;
  // Create a fast-forward and rewind 15 seconds button
  // create a scrubber
  // create a playback rate button
  // volume slider
  // mute toggle
  
  const [isPlaying, setIsPlaying] = useState(false);
  // Create an elapse time and total time
  const [duration, setDuration] = useState(0)
  const [mediaTime, setMediaTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)

  // Create a play button that toggles play and pause
  const togglePlaying = () => {
    setIsPlaying(!isPlaying)
    isPlaying ? ref.current.pause() : ref.current.play()
  }

  const onLoadedMetadata = () => {
    setDuration(ref.current.duration);
  }

  const onTimeUpdate = () => {
    setMediaTime(ref.current.currentTime)
  }

  const onScrubberChange = (e) => {
    const newTime = e.target.value
    setMediaTime(newTime)
    ref.current.currentTime = newTime
  }
  const onRewind = () => {
    const { currentTime } = ref.current;
    const newTime = Math.max(currentTime - 15,  0);
    setMediaTime(newTime)
    ref.current.currentTime = newTime;
  }

   const onFastForward = () => {
    const { currentTime } = ref.current;
    const newTime = Math.min(currentTime + 15,  duration) ;
    setMediaTime(newTime)
    ref.current.currentTime = newTime;
  }

  const rates = [0.75, 1, 1.5, 2];
  formatHumanReadTime(1000);

  const changeRate = (rate) => {
    setPlaybackRate(rate)
    ref.current.playbackRate = rate
  }


  const onMuted = () => {
    setIsMuted(!isMuted)
    ref.current.muted = !isMuted
  }

  const onVolumeChange = () => {
    if(ref.current.muted || ref.current.volume === 0) {
      setIsMuted(true)
    } else if (!ref.current.muted) {
      setIsMuted(false)
      setVolume(ref.current.volume)
    }
  }

  const onVolumeScrubberChange = (event) => {
    //to be more safe we set Number on whatever is the value:
    const newVolume = Number(event.target.value);
    setVolume(newVolume)
    ref.current.volume = newVolume 
  }
  
  const buttonText = (
    <>
      <span className='visually-hidden'>Playback Rates</span>
      <span>{playbackRate}x</span>
    </>
  )

  return ( 
    <>
      <div className="audio">
       <button className="audio__play-button" onClick={togglePlaying}>
        {isPlaying ? (
        <>
          <span className='visually-hidden'>Pause</span>
          <FaPauseCircle aria-hidden='true'/> 
        </>
        ) : (
        <> 
          <span className='visually-hidden'>Play</span>
          <FaPlayCircle aria-hidden='true'/>
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
      <button 
        aria-label='Rewind 15 seconds' 
        onClick={onRewind}
        className='audio__rewind-button'
      >
        <FaUndoAlt aria-hidden='true'/>
        <span className='rewind--fifteen'>15s</span>
      </button>

      <button 
        arial-label='Redo 15 seconds' 
        onClick={onFastForward}
        className='audio__fast-forward-button'
      >
        <FaRedoAlt aria-hidden="true" onClick={onFastForward} />
        <span className='fast-forward--fifteen'>15s</span>
      </button>
      
      {/* Map over the rates */}
      <DropdownMenu
        className='audio__playback-wrapper'
        buttonClass='audio__playback-toggle'
        menuClass='audio__rates-wrapper'
        rates={rates}
        onRatesClick={changeRate}
        buttonText={buttonText}
      />
      
      <button className='audio__mute-button' onClick={onMuted}>{isMuted ? 
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
        ref={ref}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onVolumeChange={onVolumeChange}
        src={src}
      />
      <div>{transcript}</div>
    </>
  )
})

export default AudioPlayer