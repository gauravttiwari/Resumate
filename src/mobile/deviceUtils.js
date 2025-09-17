// Utility to detect if the device is mobile. Uses multiple heuristics to be reliable
// during devtools device emulation and across high-DPR devices.
export function isMobileDevice() {
  if (typeof window === 'undefined') return false;

  try {
    // 1) Prefer CSS media query (works well with Chrome/Edge device toolbar emulation)
    if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
      return true;
    }

    // 2) Touch-capable devices are likely mobile/tablet
    if (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) {
      return true;
    }

    // 3) Fallback to user agent sniffing (last resort)
    const ua = window.navigator.userAgent || '';
    if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      return true;
    }

    // Default: treat as desktop
    return false;
  } catch (e) {
    // In case of any unexpected runtime error, default to desktop-safe behaviour
    return false;
  }
}
