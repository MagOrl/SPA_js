export function initLazyImages(root = document) {
  const images = Array.from(root.querySelectorAll('img[data-src]'));
  if (images.length === 0) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    images.forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      observer.unobserve(img);
    });
  }, { rootMargin: '150px' });

  images.forEach((img) => observer.observe(img));
}
