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
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const getRandomIndex = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const initiliaze = React.useCallback(() => {
    setCurrentGif(getRandomIndex(gifs));
    setCurrentSong(first);
  }, []);

  const lastTrack = React.useCallback(() => {
    if (audioRef.current === null) {
      return;
    }

    setCurrentSong(lastSong);
    audioRef.current.load();
    audioRef.current.play();
  }, [audioRef, lastSong]);

  const nextTrack = React.useCallback(() => {
    if (audioRef.current === null) {
      return;
    }

    setLastSong(currentSong);
    setCurrentSong(getRandomIndex(songs));
    audioRef.current.load();
    audioRef.current.play();
  }, [audioRef, currentSong]);

  React.useEffect(() => {
    const interval = setInterval(() => setCurrentGif(getRandomIndex(gifs)), 10000);

    return () => clearInterval(interval);
  }, [currentGif]);

  React.useEffect(() => {
    if (audioRef.current !== null) {
      audioRef.current.addEventListener('ended', () => {
        setCurrentSong(getRandomIndex(songs));
        audioRef.current.load();
      });

      audioRef.current.addEventListener('stalled', () => {
        setCurrentSong(getRandomIndex(songs));
        audioRef.current.load();
      });

      audioRef.current.addEventListener('pause', () => setPlaying(false));
      audioRef.current.addEventListener('play', () => setPlaying(true));
    }
  }, [audioRef, setCurrentSong, getRandomIndex, songs]);

  React.useEffect(() => {
    if (!isPlaying) {
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
        <img src="/assets/waifusanonymous.png" alt="" className={styles['player--logo']} />
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
              aria-valuenow={currentTime}
              style={{ width: currentTime }}
            />
          </div>
          <div className={styles['player--controls']}>
            <button type="button" disabled={!lastSong} onClick={() => lastTrack()}>
              <FontAwesomeIcon icon={faBackward} />
            </button>
            <button
              type="button"
              onClick={() =>
                audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause()
              }
            >
              {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
            </button>
            <button type="button" onClick={() => nextTrack()}>
              <FontAwesomeIcon icon={faForward} />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
