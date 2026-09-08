/**
 * Shared lightbox / fullscreen overlay helper.
 * Supports image items and optional video media in the same gallery.
 *
 * @param {object} options
 * @param {HTMLElement} options.overlay
 * @param {HTMLImageElement} options.image
 * @param {HTMLVideoElement | null} [options.video]
 * @param {HTMLElement | null} [options.caption]
 * @param {HTMLElement[]} options.items
 * @param {HTMLElement | null} [options.prevBtn]
 * @param {HTMLElement | null} [options.nextBtn]
 * @param {HTMLElement | null} [options.closeBtn]
 * @param {boolean} [options.enableNav=true]
 * @returns {{ open: (index: number) => void, close: () => void } | null}
 */
export function createLightbox({
  overlay,
  image,
  video = null,
  caption = null,
  items,
  prevBtn = null,
  nextBtn = null,
  closeBtn = null,
  enableNav = true,
}) {
  if (!overlay || !image || !items || items.length === 0) {
    return null;
  }

  let currentIndex = 0;
  /** @type {HTMLElement | null} */
  let lastFocus = null;

  const focusableSelector =
    'button:not([disabled]), [href], input, select, textarea, video[controls], [tabindex]:not([tabindex="-1"])';

  function getFocusable() {
    return Array.from(overlay.querySelectorAll(focusableSelector)).filter(
      (el) => {
        if (!(el instanceof HTMLElement)) return false;
        if (el.hasAttribute('hidden')) return false;
        return el.offsetParent !== null || el === overlay;
      }
    );
  }

  /**
   * @param {HTMLElement} item
   * @returns {{ kind: 'image', el: HTMLImageElement } | { kind: 'video', el: HTMLVideoElement } | null}
   */
  function resolveMedia(item) {
    if (item instanceof HTMLVideoElement) {
      return { kind: 'video', el: item };
    }
    if (item instanceof HTMLImageElement) {
      return { kind: 'image', el: item };
    }
    const nestedVideo = item.querySelector('video');
    if (nestedVideo instanceof HTMLVideoElement) {
      return { kind: 'video', el: nestedVideo };
    }
    const nestedImg = item.querySelector('img');
    if (nestedImg instanceof HTMLImageElement) {
      return { kind: 'image', el: nestedImg };
    }
    return null;
  }

  function stopLightboxVideo() {
    if (!(video instanceof HTMLVideoElement)) return;
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.setAttribute('hidden', '');
    video.classList.remove('active');
  }

  function showAt(index) {
    currentIndex = (index + items.length) % items.length;
    const media = resolveMedia(items[currentIndex]);
    if (!media) return;

    if (media.kind === 'video' && video instanceof HTMLVideoElement) {
      image.setAttribute('hidden', '');
      image.removeAttribute('src');
      image.alt = '';
      stopLightboxVideo();

      const source =
        media.el.currentSrc ||
        media.el.getAttribute('src') ||
        media.el.querySelector('source')?.getAttribute('src') ||
        '';
      if (!source) return;

      video.src = source;
      video.removeAttribute('hidden');
      video.classList.add('active');
      video.muted = false;
      video.play().catch(() => {
        /* autoplay may be blocked; controls remain available */
      });

      if (caption) {
        caption.textContent =
          media.el.getAttribute('aria-label') ||
          items[currentIndex].getAttribute('aria-label') ||
          'Video snimak vožnje kvadom';
      }
      return;
    }

    stopLightboxVideo();
    image.removeAttribute('hidden');

    const img = media.el;
    if (!(img instanceof HTMLImageElement)) return;

    image.src = img.currentSrc || img.src;
    image.alt = img.alt || '';
    if (caption) {
      caption.textContent = img.dataset.desc || img.alt || '';
    }
  }

  function open(index) {
    lastFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    showAt(index);
    overlay.classList.add('active');
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    const focusables = getFocusable();
    const target = closeBtn || focusables[0] || overlay;
    target.focus();
  }

  function close() {
    stopLightboxVideo();
    overlay.classList.remove('active');
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (lastFocus) {
      lastFocus.focus();
      lastFocus = null;
    }
  }

  function showPrev() {
    showAt(currentIndex - 1);
  }

  function showNext() {
    showAt(currentIndex + 1);
  }

  if (prevBtn && enableNav) prevBtn.addEventListener('click', showPrev);
  if (nextBtn && enableNav) nextBtn.addEventListener('click', showNext);
  if (closeBtn) closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
    if (e.target === image) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }

    if (enableNav && items.length > 1) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showPrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        showNext();
      }
    }

    if (e.key === 'Tab') {
      const focusables = getFocusable();
      if (focusables.length === 0) {
        e.preventDefault();
        overlay.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  let touchStartX = 0;
  overlay.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );

  overlay.addEventListener('touchend', (e) => {
    if (!enableNav || items.length < 2) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showNext();
      else showPrev();
    }
  });

  items.forEach((item, index) => {
    const openAt = () => open(index);

    item.addEventListener('click', (e) => {
      if (e.target instanceof HTMLElement && e.target.closest('a')) return;
      openAt();
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAt();
      }
    });

    if (item instanceof HTMLImageElement) return;

    const nestedTriggers = item.querySelectorAll('img, video, .kvadovi-play, button');
    nestedTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openAt();
      });
    });
  });

  if (!overlay.hasAttribute('tabindex')) {
    overlay.setAttribute('tabindex', '-1');
  }

  return { open, close };
}
