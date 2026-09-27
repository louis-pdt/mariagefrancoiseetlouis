const openingScreen = document.querySelector(".opening-screen");
let openingTimer;

const dismissOpening = () => {
  if (!openingScreen || openingScreen.classList.contains("is-opening")) return;
  window.clearTimeout(openingTimer);
  openingScreen.classList.add("is-opening");
  window.setTimeout(() => {
    openingScreen.hidden = true;
    document.documentElement.classList.remove("opening-active");
    document.body.classList.remove("opening-active");
  }, 1250);
};

if (openingScreen) {
  openingScreen.addEventListener("click", dismissOpening);
  openingTimer = window.setTimeout(dismissOpening, 10000);
}

const rsvpReminder = document.querySelector(".rsvp-reminder");
const rsvpReminderClose = document.querySelector(".rsvp-reminder-close");

if (rsvpReminder && rsvpReminderClose) {
  rsvpReminderClose.addEventListener("click", () => {
    rsvpReminder.hidden = true;
  });
}

const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

toggle?.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    links.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

const gallery = document.querySelector(".hero-gallery");
const galleryPrevious = document.querySelector(".gallery-previous");
const galleryNext = document.querySelector(".gallery-next");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrevious = document.querySelector(".lightbox-previous");
const lightboxNext = document.querySelector(".lightbox-next");
const lightboxCounter = document.querySelector(".lightbox-counter");
let currentPhotoIndex = 0;
let lastPhotoTrigger = null;
let swipeStart = null;

const getGalleryPhotos = () => Array.from(gallery?.querySelectorAll(".gallery-photo") ?? []);

const updateGalleryControls = () => {
  if (!gallery) return;
  const atStart = gallery.scrollLeft <= 1;
  const atEnd = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 1;
  if (galleryPrevious) galleryPrevious.disabled = atStart;
  if (galleryNext) galleryNext.disabled = atEnd;
};

const scrollGallery = direction => {
  const firstPhoto = getGalleryPhotos()[0];
  if (!gallery || !firstPhoto) return;
  const gap = Number.parseFloat(getComputedStyle(gallery).gap) || 0;
  gallery.scrollBy({ left: direction * (firstPhoto.getBoundingClientRect().width + gap), behavior: "smooth" });
};

galleryPrevious?.addEventListener("click", () => scrollGallery(-1));
galleryNext?.addEventListener("click", () => scrollGallery(1));
gallery?.addEventListener("scroll", updateGalleryControls, { passive: true });
window.addEventListener("resize", updateGalleryControls);
updateGalleryControls();

const showLightboxPhoto = index => {
  const photos = getGalleryPhotos();
  if (!lightbox || !lightboxImage || photos.length === 0) return;
  currentPhotoIndex = (index + photos.length) % photos.length;
  lightboxImage.src = photos[currentPhotoIndex].src;
  lightboxImage.alt = photos[currentPhotoIndex].alt;
  if (lightboxCounter) lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${photos.length}`;
  const singlePhoto = photos.length < 2;
  if (lightboxPrevious) lightboxPrevious.disabled = singlePhoto;
  if (lightboxNext) lightboxNext.disabled = singlePhoto;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
};

const openLightbox = photo => {
  const photos = getGalleryPhotos();
  const index = photos.indexOf(photo);
  if (index < 0) return;
  lastPhotoTrigger = photo;
  showLightboxPhoto(index);
  lightboxClose?.focus();
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.alt = "";
  swipeStart = null;
  if (lastPhotoTrigger?.isConnected) lastPhotoTrigger.focus();
};

gallery?.addEventListener("click", event => {
  if (!(event.target instanceof Element)) return;
  const photo = event.target.closest(".gallery-photo");
  if (photo) openLightbox(photo);
});

lightboxPrevious?.addEventListener("click", () => showLightboxPhoto(currentPhotoIndex - 1));
lightboxNext?.addEventListener("click", () => showLightboxPhoto(currentPhotoIndex + 1));
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

lightboxImage?.addEventListener("pointerdown", event => {
  swipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
});
document.addEventListener("pointerup", event => {
  if (!swipeStart || swipeStart.pointerId !== event.pointerId) return;
  const deltaX = event.clientX - swipeStart.x;
  const deltaY = event.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) return;
  showLightboxPhoto(currentPhotoIndex + (deltaX < 0 ? 1 : -1));
});
document.addEventListener("pointercancel", () => {
  swipeStart = null;
});

document.addEventListener("keydown", event => {
  if (!lightbox?.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showLightboxPhoto(currentPhotoIndex - 1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    showLightboxPhoto(currentPhotoIndex + 1);
  }
});
