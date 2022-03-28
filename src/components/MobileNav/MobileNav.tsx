import React from 'react';
import { createPortal } from 'react-dom';
import styles from './MobileNav.module.scss';

export default function MobileNav() {
  const [isOpen, setOpen] = React.useState(false);

  if (isOpen) {
    return createPortal(
      <div role="document" className={styles['mobile-nav']}>
        <img
          src="/assets/waifusanonymous.png"
          alt="waifus anonymous"
          className={styles['mobile-nav--logo']}
        />

        <nav className={styles['mobile-nav--links']}>
          <ul>
            <li>
              <a href="/">home</a>
            </li>
            <li>
              <a href="/articles">articles</a>
            </li>
            <li>
              <a href="/contact">contact</a>
            </li>
            <li>
              <a href="/vibe">vibe</a>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className={styles['mobile-nav--close']}
        >
          close menu
        </button>
      </div>,
      document.querySelector('body')
    );
  }

  return (
    <button className={styles['nav-button']} type="button" onClick={() => setOpen(true)}>
      <div className={styles['nav-button--burger']} />
      <span className={styles['nav-button--label']}>Open menu</span>
    </button>
  );
}
