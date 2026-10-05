// Thay ảnh sau này ở đây: không cần sửa HTML/CSS.
const IMAGES = {
  coverLeft: "https://w.ladicdn.com/6833feb01c8070001239a3de/png-20260905151513-m69ek.webp",
  coverRight: "https://w.ladicdn.com/6833feb01c8070001239a3de/png-1-20260905151513-u8vfh.webp",
  groom: "./assets/album/Q24_0479.jpg",
  bride: "./assets/album/Q24_0706.jpg",
  gallery: [
    "./assets/IMG_6169.JPG",
    "./assets/IMG_6170.JPG",
    "./assets/IMG_6171.JPG",
    "./assets/IMG_6172.JPG",
    "./assets/IMG_6173.JPG",
    "./assets/IMG_6174.JPG",
    "./assets/Q24_0479.jpg",
    "./assets/Q24_0490.jpg",
    "./assets/Q24_0499.jpg",
    "./assets/Q24_0673.jpg",
    "./assets/Q24_0706.jpg",
    "./assets/Q24_0747.jpg",
    "./assets/Q24_0787.jpg",
    "./assets/Q24_0845.jpg",
    "./assets/Q24_0905.jpg",
    "./assets/Q24_0952.jpg",
    "./assets/Q24_1030.jpg",
    "./assets/IMG_6169.JPG",
    "./assets/IMG_6170.JPG",
    "./assets/Q24_0479.jpg",
    "./assets/Q24_0490.jpg",
    "./assets/Q24_0499.jpg",
    "./assets/Q24_0673.jpg",
    "./assets/Q24_0706.jpg"
  ]
};

const weddingDate = new Date("2026-10-18T17:00:00+07:00");
const $ = (selector) => document.querySelector(selector);

function setupImages() {
  document.querySelector(".cover-left").style.backgroundImage = `url("${IMAGES.coverLeft}")`;
  document.querySelector(".cover-right").style.backgroundImage = `url("${IMAGES.coverRight}")`;
  document.querySelector(".photo-groom").style.backgroundImage = `url("${IMAGES.groom}")`;
  document.querySelector(".photo-bride").style.backgroundImage = `url("${IMAGES.bride}")`;

  const renderGallery = (selector, images, offset = 0) => {
    const gallery = $(selector);
    images.forEach((src, index) => {
      const button = document.createElement("button");
      button.className = "gallery-item";
      button.type = "button";
      button.dataset.src = src;
      button.setAttribute("aria-label", `Mở ảnh ${index + offset + 1}`);
      button.innerHTML = `<img src="${src}" alt="Khoảnh khắc ${index + offset + 1}" loading="lazy" decoding="async">`;
      gallery.append(button);
    });
  };

  renderGallery("#gallery-grid", [IMAGES.gallery[2], IMAGES.gallery[0], IMAGES.gallery[1]]);

  const landscapeImages = new Set([
    "./assets/IMG_6170.JPG",
    "./assets/Q24_0905.jpg",
    "./assets/Q24_1030.jpg"
  ]);
  const optimizedAlbumImages = new Map([
    ["./assets/Q24_0479.jpg", "./assets/album/Q24_0479.jpg"],
    ["./assets/Q24_0490.jpg", "./assets/album/Q24_0490.jpg"],
    ["./assets/Q24_0499.jpg", "./assets/album/Q24_0499.jpg"],
    ["./assets/Q24_0673.jpg", "./assets/album/Q24_0673.jpg"],
    ["./assets/Q24_0706.jpg", "./assets/album/Q24_0706.jpg"],
    ["./assets/Q24_0747.jpg", "./assets/album/Q24_0747.jpg"],
    ["./assets/Q24_0787.jpg", "./assets/album/Q24_0787.jpg"],
    ["./assets/Q24_0845.jpg", "./assets/album/Q24_0845.jpg"],
    ["./assets/Q24_0952.jpg", "./assets/album/Q24_0952.jpg"]
  ]);
  const albumImages = IMAGES.gallery
    .slice(3)
    .filter((src) => !landscapeImages.has(src))
    .map((src) => optimizedAlbumImages.get(src) || src);
  const featured = $("#album-featured");
  const thumbs = $("#album-thumbs");
  let albumIndex = 0;
  let slideOutTimer;
  let slideInTimer;
  let slideOutFrame;
  let slideInFrame;
  const createGalleryItem = (src, index, className) => {
    const button = document.createElement("button");
    button.className = className;
    button.type = "button";
    button.dataset.src = src;
    button.setAttribute("aria-label", `Mở ảnh ${index + 1}`);
    button.innerHTML = `<img src="${src}" alt="Khoảnh khắc ${index + 1}" loading="lazy" decoding="async">`;
    return button;
  };

  featured.append(createGalleryItem(albumImages[0], 4, "gallery-item album-featured-item"));
  albumImages.forEach((src, index) => {
    const thumb = createGalleryItem(src, index + 4, "gallery-item album-thumb");
    thumb.dataset.albumIndex = String(index);
    if (index === 0) thumb.classList.add("is-active");
    thumbs.append(thumb);
  });

  const setAlbumImage = (index) => {
    albumIndex = index % albumImages.length;
    const featuredItem = featured.querySelector(".album-featured-item");
    const featuredImage = $("#album-featured img");
    window.clearTimeout(slideOutTimer);
    window.clearTimeout(slideInTimer);
    window.cancelAnimationFrame(slideOutFrame);
    window.cancelAnimationFrame(slideInFrame);
    featuredItem.classList.remove("album-slide-out", "album-slide-in");
    slideOutFrame = window.requestAnimationFrame(() => {
      featuredItem.classList.add("album-slide-out");

      slideOutTimer = window.setTimeout(() => {
        featuredImage.src = albumImages[albumIndex];
        featuredImage.alt = `Khoảnh khắc ${albumIndex + 5}`;
        featuredItem.classList.remove("album-slide-out");
        slideInFrame = window.requestAnimationFrame(() => {
          featuredItem.classList.add("album-slide-in");
          slideInTimer = window.setTimeout(() => {
            featuredItem.classList.remove("album-slide-in");
          }, 420);
        });
      }, 220);
    });

    thumbs.querySelectorAll(".album-thumb").forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("is-active", thumbIndex === albumIndex);
    });
  };

  window.setAlbumImage = setAlbumImage;
  window.setInterval(() => setAlbumImage(albumIndex + 1), 3000);
}

function setupCover() {
  const cover = $("#opening-cover");
  const openButton = $("#open-card");
  let opened = false;

  const open = () => {
    if (opened) return;
    opened = true;
    document.body.classList.remove("cover-locked");
    cover.classList.add("is-opening");
    window.setTimeout(() => cover.classList.add("is-open"), 1250);
    tryStartMusic();
  };

  openButton.addEventListener("click", open);
  cover.addEventListener("click", (event) => {
    if (event.target === cover || event.target.closest(".cover-stage")) open();
  });
}

function setupCalendar() {
  const calendar = $("#calendar-days");
  const firstDay = new Date(2026, 9, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(2026, 10, 0).getDate();

  for (let i = 0; i < offset; i += 1) {
    const empty = document.createElement("span");
    empty.className = "is-empty";
    empty.textContent = "0";
    calendar.append(empty);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const item = document.createElement("span");
    item.textContent = day;
    if (day === 18) item.className = "is-wedding";
    calendar.append(item);
  }
}

function setupCountdown() {
  const units = {
    days: $("[data-unit=days]"),
    hours: $("[data-unit=hours]"),
    minutes: $("[data-unit=minutes]"),
    seconds: $("[data-unit=seconds]")
  };

  const update = () => {
    const remaining = Math.max(0, weddingDate.getTime() - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    units.days.textContent = String(days).padStart(2, "0");
    units.hours.textContent = String(hours).padStart(2, "0");
    units.minutes.textContent = String(minutes).padStart(2, "0");
    units.seconds.textContent = String(seconds).padStart(2, "0");
  };

  update();
  window.setInterval(update, 1000);
}

function setupGallery() {
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightbox-image");

  ["#gallery-grid", "#album-grid"].forEach((selector) => {
    $(selector).addEventListener("click", (event) => {
      const item = event.target.closest(".gallery-item");
      if (!item) return;

      if (item.classList.contains("album-thumb")) {
        window.setAlbumImage(Number(item.dataset.albumIndex));
        return;
      }

      lightboxImage.src = item.dataset.src;
      lightbox.classList.add("is-open");
      document.body.classList.add("cover-locked");
    });
  });

  const close = () => {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("cover-locked");
  };

  $("#lightbox-close").addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function setupMusic() {
  const music = $("#wedding-music");
  const toggle = $("#music-toggle");

  window.tryStartMusic = () => {
    music.play().then(() => toggle.classList.add("is-playing")).catch(() => {});
  };

  toggle.addEventListener("click", () => {
    if (music.paused) {
      tryStartMusic();
    } else {
      music.pause();
      toggle.classList.remove("is-playing");
    }
  });
}

async function connectFirebase() {
  const config = window.FIREBASE_CONFIG;
  const configured = config
    && config.apiKey
    && config.projectId
    && !String(config.apiKey).startsWith("YOUR_")
    && !String(config.projectId).startsWith("YOUR_");

  if (!configured) return null;

  try {
    const [{ initializeApp }, firestore] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js")
    ]);
    const app = initializeApp(config);
    return { ...firestore, db: firestore.getFirestore(app) };
  } catch (error) {
    console.error("Không thể tải Firebase:", error);
    return null;
  }
}

async function setupGuestbook() {
  const form = $("#wish-form");
  const list = $("#wish-list");
  const status = $("#wish-status");
  const submitButton = form.querySelector("button[type=submit]");
  const storageKey = "dung-hoang-wishes";

  const readLocal = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  };

  const render = (wishes) => {
    if (!wishes.length) {
      list.innerHTML = '<p class="wish-empty">Hãy là người đầu tiên gửi lời chúc cho Hoàng &amp; Dung.</p>';
      list.style.removeProperty("--wish-scroll-distance");
      list.style.removeProperty("--wish-scroll-duration");
      return;
    }

    const wishMarkup = wishes.map(({ name, message }) => `
      <article class="wish-item">
        <p class="wish-message">&quot;${escapeHtml(message)}&quot;</p>
        <p class="wish-author">— ${escapeHtml(name)}</p>
      </article>
    `).join("");

    list.innerHTML = `
      <div class="wish-list-track">
        <div class="wish-list-segment">${wishMarkup}</div>
        <div class="wish-list-segment" aria-hidden="true">${wishMarkup}</div>
      </div>
    `;

    const segment = list.querySelector(".wish-list-segment");
    window.requestAnimationFrame(() => {
      list.style.setProperty("--wish-scroll-distance", `-${segment.offsetHeight}px`);
      list.style.setProperty("--wish-scroll-duration", `${Math.max(18, segment.offsetHeight / 20)}s`);
    });
  };

  const setStatus = (message, type = "") => {
    status.textContent = message;
    status.dataset.state = type;
  };

  render(readLocal());
  const firebase = await connectFirebase();
  let saveWish;

  if (firebase) {
    const wishesRef = firebase.collection(firebase.db, "weddings", "dinh-tien-hoang-tran-thi-dung", "wishes");
    const wishesQuery = firebase.query(
      wishesRef,
      firebase.orderBy("createdAt", "desc"),
      firebase.limit(50)
    );

    firebase.onSnapshot(wishesQuery, (snapshot) => {
      render(snapshot.docs.map((wish) => ({ id: wish.id, ...wish.data() })));
      setStatus("");
    }, (error) => {
      console.error("Không thể đọc lời chúc từ Firebase:", error);
      setStatus("Không thể tải lời chúc từ Firebase.", "error");
    });

    saveWish = (wish) => firebase.addDoc(wishesRef, {
      ...wish,
      createdAt: firebase.serverTimestamp()
    });
  } else {
    setStatus("Firebase chưa được cấu hình — đang dùng dữ liệu tạm trên trình duyệt.", "warning");
    saveWish = (wish) => {
      const wishes = readLocal();
      wishes.unshift({ ...wish, date: new Date().toISOString() });
      localStorage.setItem(storageKey, JSON.stringify(wishes.slice(0, 30)));
      render(wishes.slice(0, 30));
      return Promise.resolve();
    };
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const wish = {
      name: String(data.get("name")).trim(),
      message: String(data.get("message")).trim()
    };

    submitButton.disabled = true;
    submitButton.textContent = "Đang gửi...";
    setStatus("");

    try {
      await saveWish(wish);
      form.reset();
      setStatus("Đã gửi lời chúc thành công.", "success");
    } catch (error) {
      console.error("Không thể lưu lời chúc:", error);
      setStatus("Chưa gửi được lời chúc. Vui lòng thử lại.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Xác nhận";
    }
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[character]));
}

function setupBankCopy() {
  const status = $("#copy-status");
  $(".copy-button").addEventListener("click", async (event) => {
    const value = event.currentTarget.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      status.textContent = "Đã sao chép số tài khoản.";
    } catch {
      const input = document.createElement("input");
      input.value = value;
      document.body.append(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      status.textContent = "Đã sao chép số tài khoản.";
    }
    window.setTimeout(() => { status.textContent = ""; }, 2500);
  });
}

function setupGift() {
  const trigger = $("#gift-trigger");
  const modal = $("#gift-modal");
  const closeButton = $("#gift-modal-close");

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    trigger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("cover-locked");
  };

  trigger.addEventListener("click", () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("cover-locked");
    closeButton.focus();
  });

  closeButton.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.matches("[data-gift-close]")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) close();
  });
}

function setupFallingHearts() {
  const container = $("#falling-hearts");
  if (!container) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const createHeart = () => {
    const heart = document.createElement("span");
    const fallDuration = 5 + Math.random() * 3;
    const shakeDuration = 1.5 + Math.random() * 1.5;
    const delay = Math.random() * 1.5;
    heart.className = "falling-heart";
    const glyph = document.createElement("span");
    glyph.className = "falling-heart-glyph";
    glyph.textContent = "♥";
    heart.append(glyph);
    heart.style.fontSize = `${10 + Math.random() * 30}px`;
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${fallDuration}s`;
    heart.style.animationDelay = `${delay}s`;
    glyph.style.animationDuration = `${shakeDuration}s`;
    glyph.style.animationDelay = `${delay / 2}s`;
    container.append(heart);
    while (container.childElementCount > 36) container.firstElementChild.remove();
    window.setTimeout(() => heart.remove(), (fallDuration + delay) * 1000);
  };

  createHeart();
  window.setInterval(createHeart, 240);
}

function setupBackToTop() {
  const button = $("#back-to-top");
  window.addEventListener("scroll", () => {
    button.classList.toggle("is-visible", window.scrollY > 600);
  }, { passive: true });
  button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

document.body.classList.add("cover-locked");
setupImages();
setupCover();
setupCalendar();
setupCountdown();
setupGallery();
setupMusic();
setupGuestbook();
setupBankCopy();
setupGift();
setupFallingHearts();
setupBackToTop();
