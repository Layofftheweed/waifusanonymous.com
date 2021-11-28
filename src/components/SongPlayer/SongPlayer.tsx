import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward, faPlay, faPause, faBackward } from '@fortawesome/free-solid-svg-icons';
import styles from './SongPlayer.module.scss';

type Props = {
  first: string;
  songs: string[];
  gifs: string[];
};

export default function SongPlayer({ first, songs, gifs }: Props) {
  const [currentSong, setCurrentSong] = React.useState<string | null>(null);
  const [lastSong, setLastSong] = React.useState<string | null>(null);
  const [currentGif, setCurrentGif] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [isPlaying, setPlaying] = React.useState<boolean>(false);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const getRandomIndex = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const initiliaze = React.useCallback(() => {
    setCurrentGif(getRandomIndex(gifs));
    setCurrentSong(first);
  }, []);

  const lastTrack = React.useCallback(async () => {
    if (audioRef.current === null) {
      return;
    }

    setCurrentSong(lastSong);
    await audioRef.current.load();
    audioRef.current.play();
  }, [audioRef, lastSong]);

  const nextTrack = React.useCallback(async () => {
    if (audioRef.current === null) {
      return;
    }

    let nextSong = getRandomIndex(songs);
    if (nextSong === currentSong) {
      nextSong = getRandomIndex(songs);
    }
    setLastSong(currentSong);
    setCurrentSong(nextSong);
    await audioRef.current.load();
    audioRef.current.play();
  }, [audioRef, currentSong]);

  const currentProgress = React.useMemo(() => {
    if (audioRef.current === null) {
      return 0;
    }
    return parseInt((currentTime / audioRef.current.duration) * 100, 10);
  }, [currentTime]);

  React.useEffect(() => {
    const interval = setInterval(() => setCurrentGif(getRandomIndex(gifs)), 10000);

    return () => clearInterval(interval);
  }, [currentGif]);

  React.useEffect(() => {
    if (audioRef.current === null) {
      return;
    }

    const endedListener = async () => {
      let nextSong = getRandomIndex(songs);
      if (nextSong === first) {
        nextSong = getRandomIndex(songs);
      }
      setCurrentSong(nextSong);
      await audioRef.current.load();
      audioRef.current.play();
    };

    const stalledListener = async () => {
      setCurrentSong(getRandomIndex(songs));
      await audioRef.current.load();
      audioRef.current.play();
    };

    const pauseListener = () => setPlaying(false);

    const playListener = () => setPlaying(true);

    const loadStartListener = () => setLoading(true);

    const loadedDataListener = () => setLoading(false);

    audioRef.current.addEventListener('ended', endedListener);
    audioRef.current.addEventListener('stalled', stalledListener);
    audioRef.current.addEventListener('pause', pauseListener);
    audioRef.current.addEventListener('play', playListener);
    audioRef.current.addEventListener('loadstart', loadStartListener);
    audioRef.current.addEventListener('loadeddata', loadedDataListener);

    return () => {
      audioRef.current.removeEventListener('ended', endedListener);
      audioRef.current.removeEventListener('stalled', stalledListener);
      audioRef.current.removeEventListener('pause', pauseListener);
      audioRef.current.removeEventListener('play', playListener);
      audioRef.current.removeEventListener('loadstart', loadStartListener);
      audioRef.current.removeEventListener('loadeddata', loadedDataListener);
    };
  }, [audioRef, setCurrentSong, getRandomIndex, songs]);

  React.useEffect(() => {
    if (!isPlaying || audioRef.current === null) {
      return;
    }

    const interval = setInterval(() => setCurrentTime(audioRef.current.currentTime), 1000);

    return () => clearInterval(interval);
  }, [isPlaying, audioRef]);

  React.useEffect(() => {
    initiliaze();
  }, [initiliaze]);

  return (
    <div className={styles['player']}>
      <div className={styles['player--img-container']}>
        {currentGif !== null ? (
          <img src={`/assets/gifs/${currentGif}`} alt="" className={styles['player--img']} />
        ) : null}
      </div>
      <div className={styles['player--audio-container']}>
        <audio ref={audioRef}>
          {currentSong !== null ? (
            <source src={`/wa-radio/${currentSong}`} type="audio/mp3" />
          ) : null}
        </audio>
      </div>
      {audioRef.current !== null ? (
        <>
          <div className={styles['player--track-info']}>
            <p>{currentSong.replace('.mp3', '')}</p>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={currentProgress}
              style={{ width: currentTime }}
            />
          </div>
          <div className={styles['player--controls']}>
            <button type="button" disabled={!lastSong || isLoading} onClick={() => lastTrack()}>
              <FontAwesomeIcon icon={faBackward} />
            </button>
            <button
              type="button"
              onClick={() =>
                audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause()
              }
              disabled={isLoading}
            >
              {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
            </button>
            <button type="button" onClick={() => nextTrack()} disabled={isLoading}>
              <FontAwesomeIcon icon={faForward} />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
