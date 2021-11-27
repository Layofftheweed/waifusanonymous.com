import React from 'react';
import styles from './SongPlayer.module.scss';

type Props = {
  first: string;
  songs: string[];
  gifs: string[];
};

export default function SongPlayer({ first, songs, gifs }: Props) {
  const [currentSong, setCurrentSong] = React.useState<string | null>(null);
  const [currentGif, setCurrentGif] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const getRandomIndex = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const initiliaze = React.useCallback(() => {
    setCurrentGif(getRandomIndex(gifs));
    setCurrentSong(first);
  }, []);

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
    }
  }, [audioRef, setCurrentSong, getRandomIndex, songs]);

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
        <audio autoPlay controls ref={audioRef}>
          {currentSong !== null ? (
            <source src={`/wa-radio/${currentSong}`} type="audio/mp3" />
          ) : null}
        </audio>
      </div>
    </div>
  );
}
