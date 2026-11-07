/**
 * HomeoClinic — shared Hero scroll animation
 * Subtle parallax + fade across all design concepts.
 */
(function () {
  "use strict";

  var hero = document.querySelector("[data-hero]");
  if (!hero) return;

  var visual = hero.querySelector("[data-hero-visual]");
  var copy = hero.querySelector("[data-hero-copy]");
  if (!visual && !copy) return;

  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mobileQuery = window.matchMedia("(max-width: 767px)");
  var ticking = false;
  var lastProgress = -1;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function resetStyles() {
    if (visual) {
      visual.style.transform = "";
      visual.style.opacity = "";
    }
    if (copy) {
      copy.style.transform = "";
      copy.style.opacity = "";
    }
    lastProgress = -1;
  }

  function getProgress() {
    var rect = hero.getBoundingClientRect();
    var height = hero.offsetHeight || 1;
    // 0 while hero top is at/above viewport top start; 1 as hero exits
    return clamp(-rect.top / height, 0, 1);
  }

  function applyDesktop(progress) {
    if (visual) {
      var imageY = progress * -48;
      var imageScale = 1 - progress * 0.055;
      visual.style.transform =
        "translate3d(0, " + imageY.toFixed(2) + "px, 0) scale(" + imageScale.toFixed(4) + ")";
      visual.style.opacity = "";
    }

    if (copy) {
      var textY = progress * -32;
      var textOpacity = clamp(1 - progress * 1.2, 0, 1);
      copy.style.transform = "translate3d(0, " + textY.toFixed(2) + "px, 0)";
      copy.style.opacity = textOpacity.toFixed(3);
    }
  }

  function applyMobile(progress) {
    // Simplified: light fade and tiny movement only
    if (copy) {
      var textY = progress * -14;
      var textOpacity = clamp(1 - progress * 0.9, 0.15, 1);
      copy.style.transform = "translate3d(0, " + textY.toFixed(2) + "px, 0)";
      copy.style.opacity = textOpacity.toFixed(3);
    }

    if (visual) {
      var imageY = progress * -10;
      var imageScale = 1 - progress * 0.02;
      visual.style.transform =
        "translate3d(0, " + imageY.toFixed(2) + "px, 0) scale(" + imageScale.toFixed(4) + ")";
    }
  }

  function update() {
    ticking = false;

    if (reduceMotionQuery.matches) {
      resetStyles();
      return;
    }

    var progress = getProgress();
    if (Math.abs(progress - lastProgress) < 0.001) return;
    lastProgress = progress;

    if (mobileQuery.matches) {
      applyMobile(progress);
    } else {
      applyDesktop(progress);
    }
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  function onMotionPreferenceChange() {
    if (reduceMotionQuery.matches) {
      resetStyles();
    } else {
      requestTick();
    }
  }

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick, { passive: true });

  if (typeof reduceMotionQuery.addEventListener === "function") {
    reduceMotionQuery.addEventListener("change", onMotionPreferenceChange);
  } else if (typeof reduceMotionQuery.addListener === "function") {
    reduceMotionQuery.addListener(onMotionPreferenceChange);
  }

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", requestTick);
  } else if (typeof mobileQuery.addListener === "function") {
    mobileQuery.addListener(requestTick);
  }

  requestTick();
})();
