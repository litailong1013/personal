const page = document.body.dataset.page || "home";
const rootPath = document.body.dataset.rootPath || (page === "home" ? "." : "..");
const searchParams = new URLSearchParams(window.location.search);
const isEmbeddedWebDetail = page === "web-detail" && searchParams.get("embedded") === "1";
const homeBackgroundCacheKey = page === "home" ? `?cb=${Date.now()}` : "";

if (isEmbeddedWebDetail) {
  document.documentElement.classList.add("is-embedded-detail");
}

const navItems = [
  { label: "ホーム", href: rootPath === "." ? "./index.html" : "../index.html", key: "home" },
  { label: "Project", href: `${rootPath}/pages/project.html`, key: "project" },
  { label: "Web", href: `${rootPath}/pages/web.html`, key: "web" },
  { label: "Graphic", href: `${rootPath}/pages/graphic.html`, key: "graphic" },
  { label: "3D", href: `${rootPath}/pages/3d.html`, key: "3d" },
  { label: "動画", href: `${rootPath}/pages/video.html`, key: "video" },
  // { label: "その他", href: `${rootPath}/pages/other.html`, key: "other" },
];

const shell = document.querySelector("[data-site-shell]");

if (shell) {
  shell.insertAdjacentHTML(
    "afterbegin",
    `
      ${["project", "web", "graphic", "3d", "video", "web-detail"].includes(page) ? "" : `
      <div class="moving-canvas" aria-hidden="true">
        <div class="moving-strip moving-strip-one">
          <img class="moving-card" src="${rootPath}/assets/images/background/bg-01.png${homeBackgroundCacheKey}" alt="" />
          <img class="moving-card" src="${rootPath}/assets/images/background/bg-02.png${homeBackgroundCacheKey}" alt="" />
          <img class="moving-card" src="${rootPath}/assets/images/background/bg-03.png${homeBackgroundCacheKey}" alt="" />
          <img class="moving-card" src="${rootPath}/assets/images/background/bg-04.png${homeBackgroundCacheKey}" alt="" />
        </div>
        <div class="moving-strip moving-strip-two">
          <img class="moving-card" src="${rootPath}/assets/images/background/bg-01.png${homeBackgroundCacheKey}" alt="" />
          <img class="moving-card" src="${rootPath}/assets/images/background/bg-02.png${homeBackgroundCacheKey}" alt="" />
          <img class="moving-card" src="${rootPath}/assets/images/background/bg-03.png${homeBackgroundCacheKey}" alt="" />
          <img class="moving-card" src="${rootPath}/assets/images/background/bg-04.png${homeBackgroundCacheKey}" alt="" />
        </div>
        <div class="moving-strip moving-strip-three">
          <img class="moving-card" src="${rootPath}/assets/images/background/bg-01.png${homeBackgroundCacheKey}" alt="" />
          <img class="moving-card" src="${rootPath}/assets/images/background/bg-02.png${homeBackgroundCacheKey}" alt="" />
          <img class="moving-card" src="${rootPath}/assets/images/background/bg-03.png${homeBackgroundCacheKey}" alt="" />
          <img class="moving-card" src="${rootPath}/assets/images/background/bg-04.png${homeBackgroundCacheKey}" alt="" />
        </div>
      </div>`}
      <header class="topbar">
        <a class="brand" href="${rootPath === "." ? "./index.html" : "../index.html"}" aria-label="Litailong Home">
          <img src="${rootPath}/assets/images/logo/logo.svg" alt="Litailong logo" />
        </a>
        <nav class="main-nav" id="primary-nav" aria-label="Primary">
          ${navItems
            .map(
              (item) => `
                <a class="${item.key === page ? "is-active" : ""}" href="${item.href}">
                  ${item.label}
                </a>
              `,
            )
            .join("")}
        </nav>
        <div class="topbar-actions">
          <button class="theme-toggle" type="button" aria-label="切换亮色和暗色模式">
            <span class="theme-toggle__sun"></span>
            <span class="theme-toggle__moon"></span>
          </button>
          <button
            class="menu-toggle"
            type="button"
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="primary-nav"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
    `,
  );

  shell.insertAdjacentHTML(
    "beforeend",
    `
      <footer class="site-footer">
        <p>LITAILONG © ALL RIGHTS RESERVED.</p>
      </footer>
    `,
  );
}

const setupHomeBackgroundLoop = () => {
  if (page !== "home") {
    return;
  }

  const strips = [...document.querySelectorAll(".moving-strip")];

  if (!strips.length) {
    return;
  }

  const measureStrip = (strip) => {
    const originalCount = Number(strip.dataset.originalCount || strip.children.length);
    const direction = Number(getComputedStyle(strip).getPropertyValue("--loop-direction").trim()) || -1;

    if (!strip.dataset.loopReady) {
      strip.dataset.originalCount = String(originalCount);
      const originals = [...strip.children].slice(0, originalCount);
      [...originals].reverse().forEach((node) => {
        const clone = node.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        strip.prepend(clone);
      });
      originals.forEach((node) => {
        const clone = node.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        strip.appendChild(clone);
      });
      strip.dataset.loopReady = "true";
    }

    const firstOriginal = strip.children[originalCount];
    const firstClone = strip.children[originalCount * 2];

    if (!firstOriginal || !firstClone) {
      return;
    }

    const loopDistance = firstClone.offsetLeft - firstOriginal.offsetLeft;
    strip.style.setProperty("--loop-start", `${-loopDistance}px`);
    strip.style.setProperty("--loop-end", direction < 0 ? `${-loopDistance * 2}px` : "0px");
  };

  const measureAll = () => {
    strips.forEach(measureStrip);
  };

  window.requestAnimationFrame(measureAll);
  window.addEventListener("resize", measureAll);
};

setupHomeBackgroundLoop();

const setupHomeAge = () => {
  if (page !== "home") {
    return;
  }

  const ageDisplay = document.querySelector("[data-age-display]");

  if (!ageDisplay) {
    return;
  }

  const birthYear = Number(ageDisplay.dataset.birthYear);
  const birthMonth = Number(ageDisplay.dataset.birthMonth);

  if (!birthYear || !birthMonth) {
    return;
  }

  const nowParts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
  })
    .formatToParts(new Date())
    .reduce((result, part) => {
      if (part.type === "year" || part.type === "month") {
        result[part.type] = Number(part.value);
      }
      return result;
    }, {});

  const currentYear = Number(nowParts.year);
  const currentMonth = Number(nowParts.month);

  if (!currentYear || !currentMonth) {
    return;
  }

  const age = currentYear - birthYear - (currentMonth < birthMonth ? 1 : 0);
  ageDisplay.textContent = `${birthYear}年${birthMonth}月生まれ(${age}歳)`;
};

setupHomeAge();

const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const topbar = document.querySelector(".topbar");
const mobileQuery = window.matchMedia("(max-width: 620px)");
const storageKey = "litailong-portfolio-theme";
const savedTheme = localStorage.getItem(storageKey);

if (savedTheme === "dark") {
  document.documentElement.dataset.theme = "dark";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.add("is-theme-switching");
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(storageKey, nextTheme);
    window.clearTimeout(window.__themeSwitchTimer__);
    window.__themeSwitchTimer__ = window.setTimeout(() => {
      document.documentElement.classList.remove("is-theme-switching");
    }, 320);
  });
}

if (menuToggle && topbar) {
  menuToggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("is-mobile-open");
    document.body.classList.toggle("mobile-menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!mobileQuery.matches || !topbar.classList.contains("is-mobile-open")) {
      return;
    }

    if (!topbar.contains(event.target)) {
      topbar.classList.remove("is-mobile-open");
      document.body.classList.remove("mobile-menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  topbar.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!mobileQuery.matches) {
        return;
      }

      topbar.classList.remove("is-mobile-open");
      document.body.classList.remove("mobile-menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) {
      topbar.classList.remove("is-mobile-open");
      document.body.classList.remove("mobile-menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const asideWrap = document.querySelector(".web-page__aside");
const asideLabel = document.querySelector(".web-page__aside span");

if (["project", "web", "graphic", "3d", "video"].includes(page) && asideLabel && asideWrap) {
  let ticking = false;

  const updateAsideFloat = () => {
    const desktop = window.innerWidth > 860;

    if (!desktop) {
      asideLabel.style.setProperty("--aside-float-y", "0px");
      asideLabel.style.removeProperty("--aside-left");
      ticking = false;
      return;
    }

    const wrapRect = asideWrap.getBoundingClientRect();
    asideLabel.style.setProperty("--aside-left", `${Math.round(wrapRect.left)}px`);

    const offset = Math.sin(window.scrollY * 0.008) * 4;
    asideLabel.style.setProperty("--aside-float-y", `${offset}px`);
    ticking = false;
  };

  const requestAsideUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateAsideFloat);
  };

  window.addEventListener("scroll", requestAsideUpdate, { passive: true });
  window.addEventListener("resize", requestAsideUpdate);
  requestAsideUpdate();
}

const setupGraphicLightbox = () => {
  if (!["graphic", "3d"].includes(page)) {
    return;
  }

  const cards = [...document.querySelectorAll(".graphic-card")];

  if (!cards.length) {
    return;
  }

  const items = cards
    .map((card, index) => {
      const trigger = card.querySelector("[data-graphic-trigger]");
      const image = card.querySelector(".graphic-card__image");
      const title = card.querySelector("h2");
      const badge = card.querySelector(".web-item__badge");

      if (!trigger || !image || !title || !badge) {
        return null;
      }

      trigger.setAttribute("aria-label", `查看 ${title.textContent.trim()}`);

      const computedBackgroundImage = window.getComputedStyle(image).backgroundImage;
      const imageSrcMatch = computedBackgroundImage?.match(/url\((["']?)(.*?)\1\)/);
      const imageSrc = imageSrcMatch?.[2] || "";

      return {
        index,
        card,
        trigger,
        image,
        imageSrc,
        title: title.textContent.trim(),
        badgeText: badge.textContent.trim(),
        badgeClass: badge.className,
      };
    })
    .filter(Boolean);

  if (!items.length) {
    return;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="graphic-lightbox" aria-hidden="true">
        <button class="graphic-lightbox__close" type="button" aria-label="关闭预览">×</button>
        <button class="graphic-lightbox__nav graphic-lightbox__nav--prev" type="button" aria-label="上一张">‹</button>
        <button class="graphic-lightbox__nav graphic-lightbox__nav--next" type="button" aria-label="下一张">›</button>
        <div class="graphic-lightbox__viewport">
          <div class="graphic-lightbox__track">
            ${items
              .map(
                (item) => `
                  <div class="graphic-lightbox__slide" data-graphic-index="${item.index}">
                    <div class="graphic-lightbox__media"></div>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="graphic-lightbox__footer">
          <div class="graphic-lightbox__meta">
            <h2></h2>
          </div>
          <span class="web-item__badge"></span>
        </div>
      </div>
    `,
  );

  const lightbox = document.querySelector(".graphic-lightbox");
  const closeButton = lightbox?.querySelector(".graphic-lightbox__close");
  const prevButton = lightbox?.querySelector(".graphic-lightbox__nav--prev");
  const nextButton = lightbox?.querySelector(".graphic-lightbox__nav--next");
  const viewport = lightbox?.querySelector(".graphic-lightbox__viewport");
  const track = lightbox?.querySelector(".graphic-lightbox__track");
  const footerTitle = lightbox?.querySelector(".graphic-lightbox__meta h2");
  const footerBadge = lightbox?.querySelector(".graphic-lightbox__footer .web-item__badge");

  if (
    !lightbox ||
    !closeButton ||
    !prevButton ||
    !nextButton ||
    !viewport ||
    !track ||
    !footerTitle ||
    !footerBadge
  ) {
    return;
  }

  let activeItems = items;
  let activeIndex = 0;
  let isSyncLocked = false;
  let unlockSyncFrame = 0;

  const lockScrollSync = () => {
    isSyncLocked = true;
    window.cancelAnimationFrame(unlockSyncFrame);
  };

  const unlockScrollSync = () => {
    unlockSyncFrame = window.requestAnimationFrame(() => {
      unlockSyncFrame = window.requestAnimationFrame(() => {
        isSyncLocked = false;
      });
    });
  };

  const getVisibleItems = () => {
    if (page !== "graphic") {
      return items;
    }

    const visibleItems = items.filter((item) => !item.card.hidden);
    return visibleItems.length ? visibleItems : items;
  };

  const renderSlides = () => {
    track.innerHTML = activeItems
      .map(
        (item, index) => `
          <div class="graphic-lightbox__slide" data-graphic-index="${index}">
            <div class="graphic-lightbox__media">
              ${
                item.imageSrc
                  ? `<img class="graphic-lightbox__image" src="${item.imageSrc}" alt="${item.title}" />`
                  : ""
              }
            </div>
          </div>
        `,
      )
      .join("");

    if (activeItems.some((item) => !item.imageSrc)) {
      const slideMedias = [...track.querySelectorAll(".graphic-lightbox__media")];
      activeItems.forEach((item, idx) => {
        if (!item.imageSrc && slideMedias[idx]) {
          slideMedias[idx].append(item.image.cloneNode(true));
        }
      });
    }
  };

  const updateNavState = () => {
    prevButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === activeItems.length - 1;
  };

  const renderMeta = (index) => {
    const item = activeItems[index];

    if (!item) {
      return;
    }

    activeIndex = index;
    footerTitle.textContent = item.title;
    footerBadge.textContent = item.badgeText;
    footerBadge.className = item.badgeClass;
    updateNavState();
  };

  const syncIndexFromScroll = () => {
    if (isSyncLocked) {
      return;
    }

    const slideWidth = viewport.clientWidth || 1;
    const nextIndex = Math.round(viewport.scrollLeft / slideWidth);
    renderMeta(Math.max(0, Math.min(activeItems.length - 1, nextIndex)));
  };

  const openLightbox = (item) => {
    activeItems = getVisibleItems();
    activeIndex = Math.max(
      0,
      activeItems.findIndex((currentItem) => currentItem.index === item.index),
    );
    lockScrollSync();
    renderSlides();
    renderMeta(activeIndex);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      viewport.scrollTo({
        left: viewport.clientWidth * activeIndex,
        behavior: "auto",
      });
      renderMeta(activeIndex);
      unlockScrollSync();
    });
  };

  const closeLightbox = () => {
    lockScrollSync();
    viewport.scrollTo({
      left: viewport.clientWidth * activeIndex,
      behavior: "auto",
    });
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.removeProperty("overflow");
    unlockScrollSync();
  };

  items.forEach((item) => {
    item.trigger.addEventListener("click", () => openLightbox(item));
  });

  viewport.addEventListener("scroll", syncIndexFromScroll, { passive: true });

  closeButton.addEventListener("click", closeLightbox);

  prevButton.addEventListener("click", () => {
    const nextIndex = Math.max(0, activeIndex - 1);
    viewport.scrollTo({
      left: viewport.clientWidth * nextIndex,
      behavior: "smooth",
    });
  });

  nextButton.addEventListener("click", () => {
    const nextIndex = Math.min(activeItems.length - 1, activeIndex + 1);
    viewport.scrollTo({
      left: viewport.clientWidth * nextIndex,
      behavior: "smooth",
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(activeItems.length - 1, activeIndex + delta));
      viewport.scrollTo({
        left: viewport.clientWidth * nextIndex,
        behavior: "smooth",
      });
    }
  });

  window.addEventListener("resize", () => {
    if (!lightbox.classList.contains("is-open")) {
      return;
    }

    viewport.scrollLeft = viewport.clientWidth * activeIndex;
  });

  activeItems = getVisibleItems();
  renderSlides();
  renderMeta(0);
};

setupGraphicLightbox();

const setupGraphicFilter = () => {
  if (page !== "graphic") {
    return;
  }

  const filtersWrap = document.querySelector("[data-graphic-filters]");
  const cards = [...document.querySelectorAll(".graphic-card[data-graphic-category]")];

  if (!filtersWrap || !cards.length) {
    return;
  }

  filtersWrap.addEventListener("click", (event) => {
    const button = event.target.closest("[data-graphic-filter]");

    if (!button) {
      return;
    }

    const nextFilter = button.dataset.graphicFilter || "all";

    filtersWrap.querySelectorAll("[data-graphic-filter]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    cards.forEach((card) => {
      const category = card.dataset.graphicCategory;
      const shouldShow = nextFilter === "all" || category === nextFilter;
      card.hidden = !shouldShow;
    });
  });
};

setupGraphicFilter();

const setupWebDetailModal = () => {
  if (!["web", "project"].includes(page)) {
    return;
  }

  const triggers = [...document.querySelectorAll(".web-item__button")];

  if (!triggers.length) {
    return;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div class="web-detail-modal" aria-hidden="true">
        <div class="web-detail-modal__backdrop" data-web-detail-close></div>
        <div class="web-detail-modal__panel" role="dialog" aria-modal="true" aria-label="Detail view">
          <button class="web-detail-modal__close" type="button" aria-label="关闭详情">×</button>
          <iframe class="web-detail-modal__frame" title="Detail view" loading="lazy"></iframe>
        </div>
      </div>
    `,
  );

  const modal = document.querySelector(".web-detail-modal");
  const frame = modal?.querySelector(".web-detail-modal__frame");
  const closeButton = modal?.querySelector(".web-detail-modal__close");
  const closeTargets = [...(modal?.querySelectorAll("[data-web-detail-close]") || [])];

  if (!modal || !frame || !closeButton || !closeTargets.length) {
    return;
  }

  const appendEmbeddedParam = (href) => {
    const url = new URL(href, window.location.href);
    url.searchParams.set("embedded", "1");
    url.searchParams.set("_detailcb", String(Date.now()));
    return `${url.pathname}${url.search}${url.hash}`;
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("detail-modal-open");
    window.setTimeout(() => {
      if (!modal.classList.contains("is-open")) {
        frame.removeAttribute("src");
      }
    }, 220);
  };

  const openModal = (href) => {
    frame.src = appendEmbeddedParam(href);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("detail-modal-open");
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(trigger.href);
    });
  });

  closeButton.addEventListener("click", closeModal);
  closeTargets.forEach((target) => target.addEventListener("click", closeModal));

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
    }
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) {
      return;
    }

    if (event.data?.type === "close-web-detail-modal") {
      closeModal();
    }
  });
};

setupWebDetailModal();

const setupWebDetail = () => {
  if (page !== "web-detail") {
    return;
  }

  const detail = document.querySelector("[data-web-detail]");
  const carousel = detail?.querySelector("[data-detail-carousel]");
  const track = carousel?.querySelector(".web-detail__track");
  const slides = [...(track?.children || [])];
  const dotsWrap = detail?.querySelector("[data-detail-dots]");
  const prevButton = detail?.querySelector(".web-detail__gallery-nav--prev");
  const nextButton = detail?.querySelector(".web-detail__gallery-nav--next");
  const deviceTabs = [...(detail?.querySelectorAll("[data-device-tab]") || [])];
  const devicePanels = [...(detail?.querySelectorAll("[data-device-panel]") || [])];
  const eventTabsWrap = detail?.querySelector("[data-event-tabs]");

  if (
    !detail ||
    !carousel ||
    !slides.length ||
    !dotsWrap ||
    !prevButton ||
    !nextButton ||
    !deviceTabs.length ||
    !devicePanels.length ||
    !eventTabsWrap
  ) {
    return;
  }

  const backLink = detail.querySelector(".web-detail__back");

  if (isEmbeddedWebDetail && backLink) {
    backLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.parent.postMessage({ type: "close-web-detail-modal" }, window.location.origin);
    });
  }

  const realSlides = [...slides];
  const realSlideCount = realSlides.length;
  const isInfiniteCarousel = realSlideCount > 1;
  const initialActiveDevice =
    deviceTabs.find((tab) => tab.classList.contains("is-active"))?.dataset.deviceTab ||
    devicePanels.find((panel) => panel.classList.contains("is-active"))?.dataset.devicePanel ||
    deviceTabs[0]?.dataset.deviceTab ||
    devicePanels[0]?.dataset.devicePanel ||
    "mobile";
  const initialActivePanel =
    devicePanels.find((panel) => panel.dataset.devicePanel === initialActiveDevice) || devicePanels[0];
  const initialActiveEvent =
    initialActivePanel?.querySelector("[data-event-panel].is-active")?.dataset.eventPanel ||
    initialActivePanel?.querySelector("[data-event-panel]")?.dataset.eventPanel ||
    "event-1";
  let activeDevice = initialActiveDevice;
  let activeEvent = initialActiveEvent;
  let activeSlide = isInfiniteCarousel ? 1 : 0;
  let isAnimatingCarousel = false;
  let carouselDirection = 0;
  let carouselFinishTimer = 0;

  if (isInfiniteCarousel) {
    const firstClone = realSlides[0].cloneNode(true);
    const lastClone = realSlides[realSlideCount - 1].cloneNode(true);
    firstClone.dataset.carouselClone = "first";
    lastClone.dataset.carouselClone = "last";
    track.prepend(lastClone);
    track.append(firstClone);
  }

  dotsWrap.innerHTML = realSlides
    .map((_, index) => `<button class="web-detail__gallery-dot${index === 0 ? " is-active" : ""}" type="button" aria-label="查看第 ${index + 1} 张"></button>`)
    .join("");

  const dots = [...dotsWrap.querySelectorAll(".web-detail__gallery-dot")];

  const getRealSlideIndex = (index = activeSlide) => {
    if (!isInfiniteCarousel) {
      return 0;
    }

    if (index === 0) {
      return realSlideCount - 1;
    }

    if (index === realSlideCount + 1) {
      return 0;
    }

    return index - 1;
  };

  const syncCarouselState = (index = activeSlide) => {
    const currentRealIndex = getRealSlideIndex(index);
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentRealIndex);
    });
    prevButton.disabled = false;
    nextButton.disabled = false;
  };

  const setTrackOffset = (index = activeSlide, animate = true) => {
    track.classList.toggle("is-resetting", !animate);
    track.style.transform = `translate3d(${index * -100}%, 0, 0)`;

    if (!animate) {
      track.offsetHeight;
      track.classList.remove("is-resetting");
    }
  };

  const jumpToSlide = (index) => {
    if (!isInfiniteCarousel) {
      activeSlide = 0;
      setTrackOffset(activeSlide, false);
      syncCarouselState(activeSlide);
      return;
    }

    window.clearTimeout(carouselFinishTimer);
    isAnimatingCarousel = false;
    carouselDirection = 0;
    activeSlide = index + 1;
    setTrackOffset(activeSlide, false);
    syncCarouselState(activeSlide);
  };

  const findGalleryScroller = () => carousel.closest(".web-detail__gallery");

  const canScrollerMove = (scroller, deltaY) => {
    if (!scroller) {
      return false;
    }

    const maxScrollTop = scroller.scrollHeight - scroller.clientHeight;
    if (deltaY > 0) {
      return scroller.scrollTop < maxScrollTop - 1;
    }

    return scroller.scrollTop > 1;
  };

  const forwardWheelToGallery = (event, sourceScroller, forceForward = false) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return false;
    }

    const galleryScroller = findGalleryScroller();
    if (!galleryScroller) {
      return false;
    }

    if (!forceForward && canScrollerMove(sourceScroller, event.deltaY)) {
      return false;
    }

    if (!canScrollerMove(galleryScroller, event.deltaY)) {
      return false;
    }

    event.preventDefault();
    galleryScroller.scrollTop += event.deltaY;
    return true;
  };

  carousel.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }
    forwardWheelToGallery(event, carousel, true);
  }, { passive: false });

  const updateDeviceScrollIndicator = (screenScroller) => {
    const screen = screenScroller.closest(".web-detail__screen");
    if (!screen) {
      return;
    }

    const visibleRatio = screenScroller.clientHeight / Math.max(screenScroller.scrollHeight, 1);
    const hasOverflow = visibleRatio < 0.999;

    if (!hasOverflow) {
      screen.style.setProperty("--device-scroll-indicator-size", "0px");
      screen.style.setProperty("--device-scroll-indicator-offset", "0px");
      return;
    }

    const trackHeight = screenScroller.clientHeight - 8;
    const thumbHeight = Math.max(trackHeight * visibleRatio, 28);
    const maxThumbOffset = Math.max(trackHeight - thumbHeight, 0);
    const maxScrollTop = Math.max(screenScroller.scrollHeight - screenScroller.clientHeight, 1);
    const thumbOffset = 4 + (screenScroller.scrollTop / maxScrollTop) * maxThumbOffset;

    screen.style.setProperty("--device-scroll-indicator-size", `${thumbHeight}px`);
    screen.style.setProperty("--device-scroll-indicator-offset", `${thumbOffset}px`);
  };

  detail.querySelectorAll(".web-detail__screen-scroll").forEach((screenScroller) => {
    const screen = screenScroller.closest(".web-detail__screen");
    if (!screen) {
      return;
    }

    const showIndicator = () => {
      screen.style.setProperty("--device-scroll-indicator-opacity", "1");
      updateDeviceScrollIndicator(screenScroller);
    };

    const hideIndicator = () => {
      screen.style.setProperty("--device-scroll-indicator-opacity", "0");
    };

    screenScroller.addEventListener("scroll", () => updateDeviceScrollIndicator(screenScroller), { passive: true });
    screenScroller.addEventListener("mouseenter", showIndicator);
    screenScroller.addEventListener("mouseleave", hideIndicator);
    screenScroller.addEventListener("focus", showIndicator, true);
    screenScroller.addEventListener("blur", hideIndicator, true);
    screenScroller.addEventListener("wheel", (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      event.preventDefault();
      screenScroller.scrollTop += event.deltaY;
      showIndicator();
    }, { passive: false });
    updateDeviceScrollIndicator(screenScroller);
  });

  const formatEventLabel = (eventKey) => {
    const match = eventKey?.match(/event-(\d+)/);
    return match ? `イベント${match[1]}` : eventKey || "";
  };

  const updateDevicePanels = ({ preserveScreenScroll = true } = {}) => {
    const galleryScroller = findGalleryScroller();
    const infoScroller = detail.querySelector(".web-detail__info");
    const galleryScrollTop = galleryScroller?.scrollTop ?? 0;
    const infoScrollTop = infoScroller?.scrollTop ?? 0;
    const activePanel = devicePanels.find((panel) => panel.classList.contains("is-active"));
    const activeScreen = activePanel?.querySelector('.web-detail__event-panel.is-active .web-detail__screen-scroll');
    const activeScreenScrollTop = activeScreen?.scrollTop ?? 0;

    deviceTabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.deviceTab === activeDevice);
    });

    const activeDevicePanel = devicePanels.find((panel) => panel.dataset.devicePanel === activeDevice);
    const availableEvents = [...(activeDevicePanel?.querySelectorAll("[data-event-panel]") || [])]
      .map((panel) => panel.dataset.eventPanel)
      .filter(Boolean);

    if (!availableEvents.includes(activeEvent)) {
      activeEvent = availableEvents[0] || "event-1";
    }

    eventTabsWrap.innerHTML = availableEvents
      .map(
        (eventKey) => `
          <button class="web-detail__event-tab${eventKey === activeEvent ? " is-active" : ""}" type="button" data-event-tab="${eventKey}">
            ${formatEventLabel(eventKey)}
          </button>
        `,
      )
      .join("");

    devicePanels.forEach((panel) => {
      const isActiveDevice = panel.dataset.devicePanel === activeDevice;
      panel.classList.toggle("is-active", isActiveDevice);

      const panelEvents = [...panel.querySelectorAll("[data-event-panel]")];
      panelEvents.forEach((eventPanel) => {
        eventPanel.classList.toggle("is-active", isActiveDevice && eventPanel.dataset.eventPanel === activeEvent);
      });
    });

    const restoreDetailScroll = () => {
      if (galleryScroller) {
        galleryScroller.scrollTop = galleryScrollTop;
      }

      if (infoScroller) {
        infoScroller.scrollTop = infoScrollTop;
      }

      const nextActivePanel = devicePanels.find((panel) => panel.dataset.devicePanel === activeDevice);
      const nextActiveScreen = nextActivePanel?.querySelector('.web-detail__event-panel.is-active .web-detail__screen-scroll');
      if (nextActiveScreen) {
        nextActiveScreen.scrollTop = preserveScreenScroll ? activeScreenScrollTop : 0;
      }

      detail.querySelectorAll(".web-detail__screen-scroll").forEach((screenScroller) => updateDeviceScrollIndicator(screenScroller));
    };

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(restoreDetailScroll);
    });
    window.setTimeout(restoreDetailScroll, 140);
  };

  const finishCarouselTransition = () => {
    if (!isAnimatingCarousel) {
      return;
    }

    window.clearTimeout(carouselFinishTimer);

    if (activeSlide === 0) {
      activeSlide = realSlideCount;
      setTrackOffset(activeSlide, false);
    } else if (activeSlide === realSlideCount + 1) {
      activeSlide = 1;
      setTrackOffset(activeSlide, false);
    }

    carouselDirection = 0;
    isAnimatingCarousel = false;
    syncCarouselState(activeSlide);
  };

  const moveCarousel = (direction) => {
    if (isAnimatingCarousel || !isInfiniteCarousel) {
      return;
    }

    isAnimatingCarousel = true;
    carouselDirection = direction;
    activeSlide += direction;
    syncCarouselState(activeSlide);
    setTrackOffset(activeSlide, true);
    window.clearTimeout(carouselFinishTimer);
    carouselFinishTimer = window.setTimeout(finishCarouselTransition, 430);
  };

  prevButton.addEventListener("click", () => moveCarousel(-1));
  nextButton.addEventListener("click", () => moveCarousel(1));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => jumpToSlide(index));
  });

  track.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform") {
      return;
    }
    finishCarouselTransition();
  });

  deviceTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.dataset.deviceTab === activeDevice) {
        return;
      }

      activeDevice = tab.dataset.deviceTab || "mobile";
      updateDevicePanels();
    });
  });

  eventTabsWrap.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-event-tab]");

    if (!tab) {
      return;
    }

    activeEvent = tab.dataset.eventTab || "event-1";
    updateDevicePanels({ preserveScreenScroll: false });
  });

  window.addEventListener("resize", () => {
    setTrackOffset(activeSlide, false);
    detail.querySelectorAll(".web-detail__screen-scroll").forEach((screenScroller) => updateDeviceScrollIndicator(screenScroller));
  });

  window.requestAnimationFrame(() => {
    setTrackOffset(activeSlide, false);
    syncCarouselState(activeSlide);
  });
  updateDevicePanels();
};

setupWebDetail();
