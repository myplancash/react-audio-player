import React, { useRef, useState } from 'react';

const formatTime = (time) => {
  // Hours, minutes and seconds
  const hrs = Math.floor(~~(time / 3600)); // eslint-disable-line
  const mins = Math.floor(~~((time % 3600) / 60)); // eslint-disable-line
  const secs = Math.floor(time % 60);

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += `${hrs}:${mins < 10 ? '0' : ''}`;
  }

  ret += `${mins}:${secs < 10 ? '0' : ''}`;
  ret += `${secs}`;
  return ret;
}

const AudioPlayer = ({src, transcript}) => {
  // Create a play button that toggles play and pause
  // Create an elapse time and total time
  // Create a fast-forward and rewind 15 seconds button
  // create a scrubber
  // create a playback rate button
  // volume slider
  // mute toggle
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0)
  const [mediaTime, setMediaTime] = useState(0)


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

  console.log(audioRef);
  
  return ( 
    <>
    <div className='audio' onClick={togglePlaying}>
      <button>{isPlaying ? 'pause' : 'play'}</button><br/>
      <span className='elapsed'>Elapsed total: {formatTime(mediaTime)}</span><br/>
      <span className='duration'>total Duration: {formatTime(duration)}</span>
    </div>
      <audio
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        ref={audioRef} 
        src={src} 
        controls/>
      <div>{transcript}</div>
    </>
  )
}

export default AudioPlayer