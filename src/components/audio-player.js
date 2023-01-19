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
    const { currentTime } = audioRef.current
    const newTime = Math.max(currentTime - 15, 0)
    setMediaTime(newTime)
    audioRef.current.currentTime = newTime
  }

  const onFastForward = () => {
    const { currentTime } = audioRef.current
    const newTime = Math.min(currentTime + 15, duration) 
    setMediaTime(newTime)
    audioRef.current.currentTime = newTime
  }
  const rates = [0.75, 1, 1.5, 2];

  console.log(audioRef);

  const changeRate = (rate) => {
    audioRef.current.defaultPlaybackRate = rate;
  }
  
  return ( 
    <>
    <div className='audio' onClick={togglePlaying}>
      <button>{isPlaying ? 'pause' : 'play'}</button><br/>
      <span className='elapsed'>Elapsed total: {formatTime(mediaTime)}</span><br/>
      <span className='duration'>total Duration: {formatTime(duration)}</span><br/>
      <label htmlFor="time-scrubber">Time Scrubber</label>
      <input
        id='time-scrubber'
        onChange={onScrubberChange}
        type='range'
        value={mediaTime}
        min={0}
        max={duration}
      />
      <button onClick={onRewind}>Rewind 15 sec</button>
      <button onClick={onFastForward}>Fast-forward 15 sec</button>
      {rates.map((rate, i) => (
        <button key={i} onClick={() => changeRate(rate)}>
          {rate}x
        </button>
      ))}
    </div>
      <audio
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        ref={audioRef} 
        src={src} 
        controls/>
      <div>{transcript}</div>
    </>
  )
}

export default AudioPlayer