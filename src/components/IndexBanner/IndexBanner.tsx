import React from 'react';
import TypeIt from 'typeit-react';
import styles from './IndexBanner.module.scss';

export default function IndexBanner() {
  return (
    <header className={styles['index-banner']}>
      <img src="/assets/waifusanonymous_index_banner.png" className={styles['index-banner--img']}  alt="" />

      <div className={styles['index-banner--copy']}>
        <TypeIt
          options={{
            speed: 300,
            loop: true,
            cursor: false,
          }}
        >
          <h1>Waifus Anonymous</h1>
        </TypeIt>
      </div>
    </header>
  );
}
