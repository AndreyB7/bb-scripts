const mainBlack = "#0d1e24";
const mainWhite = "#e8e4dd";
const pageBackgroundDark = "#414E53";

ScrollTrigger.config({
  invalidateOnRefresh: true,
});

// first handle pinned heading to avoid scrollTrigger wrong positioning
const scrollSlides = gsap.utils.toArray(".scroll_slider .columns-2");
scrollSlides.forEach((scrollSlide) => {
  gsap.to(scrollSlide, {
    scrollTrigger: {
      trigger: scrollSlide,
      scrub: true,
      pin: true,
      start: "top 30%",
    },
  });
});

const headingGroupsShort = gsap.utils.toArray("[animated-heading-group]");
headingGroupsShort.forEach((headingGroup) => {
  const headingGroupsShortTL = gsap.timeline({
    scrollTrigger: {
      toggleActions: "play none none reverse",
      trigger: headingGroup,
      start: "top 70%",
    },
  });
  animateHeadingGroup(headingGroupsShortTL, headingGroup, { duration: 0.5 });
});

// heding groups long
const headingGroupsLong = gsap.utils.toArray("[animated-heading-group-long]");
headingGroupsLong.forEach((headingGroup) => {
  const headingGroupsLongTL = gsap.timeline({
    scrollTrigger: {
      toggleActions: "play none none reverse",
      trigger: headingGroup,
      start: "top 60%",
    },
  });
  animateHeadingGroup(headingGroupsLongTL, headingGroup, { duration: 0.25 });
});

// hero-light first comet
gsap.from(".hero_comet", {
  y: "-15%",
  delay: 0.5,
  // opacity: 0,
  duration: 1,
  scrollTrigger: {
    toggleActions: "play none none reverse",
    trigger: ".hero_light",
    start: "top center",
  },
  repeat: -1,
  yoyo: true,
  ease: "none",
});
// hero-light first comet
gsap.from(".hero_comet svg .glow", {
  r: 0,
  delay: 0.5,
  duration: 2,
  // repeat: -1,
  ease: "none",
  // yoyo: true,
});

// show hidden section ones animations loaded
gsap.set(".hide_before_animation", {
  opacity: 1,
  background: "transparent",
});

// show full size of the top planet before toDark animation
const heroCircleWrap = document.querySelector(".hero_circle");
ScrollTrigger.create({
  trigger: heroCircleWrap,
  start: "top 50%",
  onToggle: (self) => {
    if (self.isActive) {
      console.log("triggered");
      heroCircleWrap.scrollIntoView({ behavior: "smooth" });
    }
  },
});

const heroCircle = document.querySelector(".hero_circle svg circle");
// to dark animations
const toDark = gsap.timeline({
  scrollTrigger: {
    toggleActions: "play none none reverse",
    trigger: heroCircleWrap,
    start: "top 50%",
  },
});
toDark.to(
  heroCircle,
  {
    cy: "2000",
    r: "2000",
    duration: 1,
    onStart: function () {
      heroCircleWrap.classList.add("dark");
    },
    onReverseComplete: function () {
      heroCircleWrap.classList.remove("dark");
    },
  },
  "<"
);

toDark.to(
  ".hero_circle svg #planet-glow stop:nth-child(1)",
  {
    stopColor: "#34474E",
    duration: 0.5,
  },
  "<"
);
toDark.to(
  ".hero_circle svg #planet-glow stop:nth-child(2)",
  {
    stopColor: "#0D1E24",
    duration: 0.5,
  },
  "<"
);
toDark.to(
  ".page_wrap",
  {
    backgroundColor: mainBlack, // pageBackgroundDark - in case we need visible grid
    color: "#fff",
    duration: 1,
  },
  "<"
);
toDark.to(
  "svg .js-anumated-background-grid-color",
  {
    fill: mainBlack,
    duration: 1,
  },
  "<"
);
toDark.add(getHeroHeadingGroupTimeLine(), "<");
toDark.to(
  ".navbar_logo svg .logo-color",
  {
    fill: "#fff",
  },
  "<"
);

// add comets animation trigger. same trigger with different on onLeaveBack option
const toDarkComets = gsap.timeline({
  scrollTrigger: {
    toggleActions: "play none none reset",
    trigger: heroCircleWrap,
    start: "top 50%",
  },
});
toDarkComets.add(getHeroDarkCometTopTimeline(), "<");
toDarkComets.add(getHeroDarkCometBottomTimeline(), "<");

// hotfix: hide scaled top planet to show grid background under it
gsap.to(heroCircleWrap, {
  zIndex: -1,
  scrollTrigger: {
    trigger: ".hide_scaled_planet_trigger",
    toggleActions: "play none none reverse",
    start: "top 90%",
  },
});

function getHeroHeadingGroupTimeLine() {
  const heroHeadingGroup = document.querySelector(
    "[hero-dark-animated-heading-group]"
  );
  const heroHeadingGroupTL = gsap.timeline();
  animateHeadingGroup(heroHeadingGroupTL, heroHeadingGroup);
  return heroHeadingGroupTL;
}

function getHeroDarkCometTopTimeline() {
  // dark hero comet top
  gsap.set(".comet_top", {
    width: "104%",
    marginLeft: "-2%",
    marginRight: "-2%",
  });
  const cometTopWrap = document.querySelector(".hero_dark_comet_top");
  let cometTopWrapRotate = 0;
  const updateRotate = (currentRotateFunc) => {
    const currentRotate = currentRotateFunc();
    currentRotate == 0
      ? (cometTopWrapRotate += 5)
      : currentRotate > 0
      ? (cometTopWrapRotate -= 10)
      : (cometTopWrapRotate = 0);
  };
  const cometTopBody = document.querySelector(
    ".hero_dark_comet_top svg .comet"
  );
  const cometTopPath = document.querySelector(
    ".hero_dark_comet_top svg.animation-path path"
  );
  const cometPathGradientEndOffset = document.querySelector(
    ".hero_dark_comet_top svg #tail-gradient stop:nth-child(1)"
  );

  const cometTopPathLength = cometTopPath.getTotalLength();
  gsap.set(cometTopPath, { strokeDasharray: cometTopPathLength });

  const cometTopTL = gsap.timeline({
    defaults: { duration: 8, ease: "none" },
    repeat: -1,
    repeatRefresh: true,
  });
  cometTopTL.set(cometTopWrap, {
    rotation: () => cometTopWrapRotate,
  });
  cometTopTL.set(cometPathGradientEndOffset, {
    attr: { offset: "0" },
  });
  cometTopTL.to(
    cometTopBody,
    {
      motionPath: {
        path: cometTopPath,
        align: cometTopPath,
        alignOrigin: [0.5, 0.5],
        autoRotate: 175,
      },
      opacity: 1,
    },
    "<"
  );
  cometTopTL.fromTo(
    cometTopPath,
    {
      strokeDashoffset: cometTopPathLength,
    },
    {
      strokeDashoffset: "0",
    },
    "<"
  );
  cometTopTL.to(
    cometPathGradientEndOffset,
    {
      attr: { offset: "1" },
      ease: "power1.in",
      duration: 7,
      onComplete: updateRotate,
      onCompleteParams: [
        function () {
          return [cometTopWrapRotate];
        },
      ],
    },
    "-=80%"
  );
  return cometTopTL;
}

function getHeroDarkCometBottomTimeline() {
  // dark hero comet bottom
  gsap.set(".comet_bottom", {
    width: "104%",
    marginLeft: "-2%",
    marginRight: "-2%",
  });
  const cometBottomBody = document.querySelector(
    ".hero_dark_comet_bottom svg .comet"
  );
  const cometBottomPath = document.querySelector(
    ".hero_dark_comet_bottom svg.animation-path path"
  );
  const cometBottomPathGradientEndOffset = document.querySelector(
    ".hero_dark_comet_bottom svg #tail-gradient-bottom stop:nth-child(1)"
  );

  const cometBottomPathLength = cometBottomPath.getTotalLength();
  gsap.set(cometBottomPath, { strokeDasharray: cometBottomPathLength });

  gsap.set(cometBottomBody, {
    opacity: 0, // hide on load
  });

  const cometBottomTL = gsap.timeline({
    defaults: { duration: 8, ease: "none" },
    repeat: -1,
  });

  cometBottomTL.set(cometBottomBody, {
    opacity: 1, // show on timeline start
  });

  cometBottomTL.to(
    cometBottomBody,
    {
      motionPath: {
        path: cometBottomPath,
        align: cometBottomPath,
        alignOrigin: [0, 0],
        autoRotate: 175,
        offsetY: 5,
      },
      opacity: 1,
    },
    "<"
  );
  cometBottomTL.fromTo(
    cometBottomPath,
    {
      strokeDashoffset: cometBottomPathLength,
    },
    {
      strokeDashoffset: "0",
    },
    "<"
  );
  cometBottomTL.to(
    cometBottomPathGradientEndOffset,
    {
      attr: { offset: "1" },
      ease: "power1.in",
      duration: 7,
    },
    "-=80%"
  );
  return cometBottomTL;
}

// logo slider
// https://codepen.io/akapowl/pen/dyVKvKj
const slides = gsap.utils.toArray(".logo-slider .logo-slide");
const logoLoop = horizontalLoop(slides, {
  paused: true,
  repeat: -1,
});

ScrollTrigger.create({
  trigger: ".logo-slider",
  animation: logoLoop,
  start: "top 90%",
  end: "top 10%",
  toggleActions: "play pause resume pause",
});

// portfolio images slider
// TODO: add ScroollTrigger, but standard solution will breack correct animation direction...
// https://codepen.io/akapowl/pen/dyVKvKj
const portfolioSlidesRight = gsap.utils.toArray(
  ".portfolio_slider.right .portfolio_slide"
);
const portfolioLoopRight = horizontalLoop(portfolioSlidesRight, {
  // paused: true,
  repeat: -1,
  speed: 0.5,
});
const portfolioSlidesLeft = gsap.utils.toArray(
  ".portfolio_slider.left .portfolio_slide"
);
const portfolioLoopLeft = horizontalLoop(portfolioSlidesLeft, {
  // paused: true,
  repeat: -1,
  reversed: true,
  speed: 0.5,
});

// animated decors
gsap.from(".bg-decor.animated", {
  y: "20%",
  x: "-20%",
  scrollTrigger: {
    toggleActions: "play none none reverse",
    trigger: ".bg-decor",
    start: "top 40%",
  },
});

// section with animated comet left
const withAnimatedComet = gsap.timeline({
  scrollTrigger: {
    toggleActions: "play none none reverse",
    trigger: ".with_animated_comet",
    start: "top 50%",
  },
});
withAnimatedComet.fromTo(
  ".comet_left svg .comet",
  {
    opacity: 0,
  },
  {
    motionPath: {
      path: ".comet_left svg .tail",
      autoRotate: 180,
      align: ".comet_left svg .tail",
      alignOrigin: [0.5, 0.5],
    },
    opacity: 1,
    duration: 1,
  }
);
const cometLeftTail = document.querySelector(".comet_left svg .tail");
const cometLeftTailLength = cometLeftTail.getTotalLength();
gsap.set(cometLeftTail, { strokeDasharray: cometLeftTailLength });
withAnimatedComet.fromTo(
  cometLeftTail,
  {
    strokeDashoffset: cometLeftTailLength,
  },
  {
    strokeDashoffset: "0",
    duration: 1,
  },
  "<"
);
withAnimatedComet.from(".comet_left svg .comet_glow_1", {
  r: 0,
  opacity: 0,
  duration: 0.5,
});
withAnimatedComet.from(
  ".comet_left svg .comet_glow_2",
  {
    r: 0,
    opacity: 0,
    duration: 0.5,
  },
  "<"
);

// button groups
const buttonGroups = gsap.utils.toArray(".scrolable_button_group");
buttonGroups.forEach((buttonsGroup) => {
  const buttons = gsap.utils.toArray(buttonsGroup.querySelectorAll(".button"));
  gsap.from(buttons, {
    opacity: "0",
    yPercent: 100,
    stagger: 0.1,
    scrollTrigger: {
      trigger: buttonsGroup,
      toggleActions: "play none none reverse",
      start: "top 60%",
    },
  });
});

// change logo on animated_bg light sections
gsap.to(".navbar_logo svg .logo-color", {
  scrollTrigger: {
    trigger: ".section_animated_bg",
    toggleActions: "play none none reverse",
    start: "top 10%",
  },
  fill: mainBlack,
  duration: 0.5,
});

// animated section bg
const animatedBgSection = gsap.utils.toArray(".section_animated_bg");
animatedBgSection.forEach((animSection) => {
  const animatedBgTop = animSection.querySelector(".animated_bg");
  const animatedBgBottom = animSection.querySelector(".animated_bg_bottom");
  if (animatedBgTop) {
    gsap.from(animatedBgTop, {
      scrollTrigger: {
        toggleActions: "play none none reverse",
        trigger: animSection,
        start: "top 50%",
      },
      marginLeft: "3%",
      marginRight: "3%",
      y: "3%",
      borderRadius: "50px",
      duration: 0.5,
    });
  }
  if (animatedBgBottom) {
    gsap.to(animatedBgBottom, {
      scrollTrigger: {
        toggleActions: "play none none reverse",
        trigger: animSection,
        start: "bottom 40%",
      },
      marginLeft: "3%",
      marginRight: "3%",
      y: "-3%",
      borderRadius: "50px",
      duration: 0.5,
    });
  }
});

// animated heading with comet and cards
const animatedHeadingCometCardsWrap = document.querySelector(
  "[animated-heading-comet-cards]"
);
const hedingWithCometRight =
  animatedHeadingCometCardsWrap.querySelector("[animated-heading]");

const animatedHeadingCometCardsTL = gsap.timeline({
  scrollTrigger: {
    trigger: hedingWithCometRight,
    start: "top 70%",
    toggleActions: "play none none reverse",
  },
});
// // heading
const typeSplitHedingWithCometRight = new SplitType(hedingWithCometRight, {
  types: "lines, words",
  tagName: "span",
});
animatedHeadingCometCardsTL.from(typeSplitHedingWithCometRight.words, {
  y: "100%",
  opacity: 0,
  duration: 0.5,
  stagger: 0.1,
});
// // comet
const cometRightWrap = document.querySelector(".comet_right");
const cometRightComet = document.querySelector(".comet_right svg .comet");
const cometRightTail = document.querySelector(".comet_right svg .tail");
const cometRightTailLength = cometRightTail.getTotalLength();
const cometRightPathGradientEndOffset = document.querySelector(
  ".comet_right svg #right-coment-tail stop:nth-child(1)"
);
gsap.set(cometRightWrap, {
  width: "104%",
  marginRight: "-2%",
});
animatedHeadingCometCardsTL.set(cometRightPathGradientEndOffset, {
  attr: { offset: "0" }, // return att for repeats
});
animatedHeadingCometCardsTL.fromTo(
  cometRightComet,
  {
    opacity: 0,
  },
  {
    motionPath: {
      path: cometRightTail,
      align: cometRightTail,
      alignOrigin: [0.5, 0.5],
    },
    opacity: 1,
    duration: 2,
  }
);
gsap.set(cometRightTail, { strokeDasharray: cometRightTailLength });
animatedHeadingCometCardsTL.fromTo(
  cometRightTail,
  {
    strokeDashoffset: cometRightTailLength,
  },
  {
    strokeDashoffset: "0",
    duration: 2,
  },
  "<"
);
animatedHeadingCometCardsTL.to(
  cometRightPathGradientEndOffset,
  {
    attr: { offset: "1" },
    duration: 2,
  },
  "-=50%"
);
// cards
const cards = gsap.utils.toArray(".cards .card");
cards.forEach((card, index) => {
  animatedHeadingCometCardsTL.fromTo(
    card,
    {
      yPercent: 50 * (index + 1),
      opacity: "0",
    },
    {
      yPercent: 0, // 20 * index,
      opacity: "1",
      delay: 0.1 * index, // stagger
      duration: 0.5,
      ease: "power1.out",
    },
    "<"
  );
});
const servicesCometTL = gsap.timeline({
  scrollTrigger: {
    toggleActions: "play none none reverse",
    trigger: ".services_comet",
    start: "top 20%",
  },
});
servicesCometTL.from(".services_comet", {
  y: "-100%",
  delay: 0.5,
  opacity: 0,
  duration: 1,
});
servicesCometTL.from(".services_comet svg .glow_1", {
  r: 0,
  duration: 1,
});
servicesCometTL.from(
  ".services_comet svg .glow_2",
  {
    r: 0,
    duration: 1,
  },
  "<"
);

// mouse glow
document.addEventListener("mousemove", mouseMove);
gsap.set(".mouse-blur", { opacity: 0 });
let xCTo = gsap.quickTo(".mouse-blur", "left", {
  duration: 0.2,
  ease: "power3",
});
let yCTo = gsap.quickTo(".mouse-blur", "top", {
  duration: 0.2,
  ease: "power3",
});
let isVisible = false;
function mouseMove(e) {
  if (!isVisible) {
    gsap.set(".mouse-blur", { opacity: 1 });
    isVisible = true;
  }
  const cursorPosition = {
    left: e.clientX,
    top: e.clientY,
  };

  xCTo(cursorPosition.left);
  yCTo(cursorPosition.top);
}

// team images
const teamImages = gsap.utils.toArray(".team_image");
gsap.from(teamImages, {
  opacity: "0",
  yPercent: 100,
  stagger: 0.1,
  scrollTrigger: {
    trigger: ".team_images",
    toggleActions: "play none none reverse",
    start: "top center",
  },
});

// testimonials slider - trigger actions on active slide
const slidesToObserve = document.querySelectorAll(".w-slide");
const testimonialHeadings = gsap.utils.toArray(".testimonial_heading");
const testimonialHeadingsSplited = testimonialHeadings.map((heading) => {
  return new SplitType(heading, {
    types: "words",
    tagName: "span",
  });
});

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (
      mutation.attributeName === "aria-hidden" &&
      !mutation.target.getAttribute("aria-hidden") // visible slide, aria-hidden changed to 'true'
    ) {
      const slideDescription = mutation.target.getAttribute("aria-label");
      const currentSlideIndex = Number(slideDescription[0]) - 1;
      gsap.fromTo(
        testimonialHeadingsSplited[currentSlideIndex].words,
        {
          y: "100%",
          opacity: 0,
        },
        {
          y: "0%",
          opacity: 1,
          delay: 0.5,
          duration: 0.5,
          stagger: 0.1,
        }
      );
    }
  });
});
slidesToObserve.forEach((slide) => {
  observer.observe(slide, {
    attributeFilter: ["aria-hidden"],
  });
});

// testimonials comet bottom
gsap.set(".testimonials_comet_bottom", {
  width: "104%",
  marginLeft: "-2%",
  marginRight: "-2%",
});
const testimonialsCometBottomBody = document.querySelector(
  ".testimonials_comet_bottom svg .comet"
);
const testimonialsCometBottomPath = document.querySelector(
  ".testimonials_comet_bottom svg.animation-path path"
);
const testimonialsCometBottomPathGradientEndOffset = document.querySelector(
  ".testimonials_comet_bottom svg #testimonials-comet-tail-gradient stop:nth-child(1)"
);

const testimonialsCometBottomPathLength =
  testimonialsCometBottomPath.getTotalLength();
gsap.set(testimonialsCometBottomPath, {
  strokeDasharray: testimonialsCometBottomPathLength,
});

gsap.set(testimonialsCometBottomBody, {
  opacity: 0, // hide on load
});

const testimonialsCometTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".testimonials_comet_bottom",
    start: "top 60%",
    toggleActions: "play none none play",
  },
  defaults: { duration: 8, ease: "none" },
  delay: 1,
  repeat: -1,
});

testimonialsCometTL.set(testimonialsCometBottomBody, {
  opacity: 1, // show on timeline start
});

testimonialsCometTL.to(
  testimonialsCometBottomBody,
  {
    motionPath: {
      path: testimonialsCometBottomPath,
      align: testimonialsCometBottomPath,
      alignOrigin: [0, 0],
      autoRotate: 175,
      offsetY: 5,
    },
    opacity: 1,
  },
  "<"
);
testimonialsCometTL.fromTo(
  testimonialsCometBottomPath,
  {
    strokeDashoffset: testimonialsCometBottomPathLength,
  },
  {
    strokeDashoffset: "0",
  },
  "<"
);
testimonialsCometTL.to(
  testimonialsCometBottomPathGradientEndOffset,
  {
    attr: { offset: "1" },
    ease: "power1.in",
    duration: 7,
  },
  "-=80%"
);

// lotties control
var lottie, animations;
async function animationLoaded(animation) {
  // Return a promise that resolves to true once animation is loaded
  if (animation.isLoaded) {
    return true;
  }
  return new Promise((resolve, reject) => {
    animation.addEventListener("DOMLoaded", () => {
      resolve(true);
    });
  });
}
// Return a promise that resolves to true once all animations are loaded
async function waitForAnimationsLoaded(animations) {
  await Promise.all(animations.map(animationLoaded));
}
async function initAnimations() {
  lottie = Webflow.require("lottie").lottie;
  animations = lottie.getRegisteredAnimations();
  await waitForAnimationsLoaded(animations);
}

var Webflow = Webflow || [];

Webflow.push(() => {
  initAnimations()
    .then(() => {
      // console.log("Initialized animations");
      // do the stuff with animations array
      handleLottieAnimations(animations);
    })
    .catch((error) => {
      console.error(error);
    });
});

const handleLottieAnimations = (animations) => {
  animations.forEach((animation) => {
    animation.stop();
    ScrollTrigger.create({
      trigger: animation.wrapper,
      start: "top 30%",
      end: "bottom top",
      onEnter: () => animation.play(),
      onLeave: () => animation.pause(),
      onEnterBack: () => animation.play(),
      onLeaveBack: () => animation.pause(),
    });
  });
};

// footer comet
const cometFooterWrap = document.querySelector(".footer_comet");
gsap.set(cometFooterWrap, {
  width: "104%",
  marginLeft: "-2%",
  marginRight: "-2%",
});

const cometFooterBody = document.querySelector(".footer_comet svg .comet");
const cometFooterPath = document.querySelector(
  ".footer_comet svg.animation-path path"
);
const cometFooterPathGradientEndOffset = document.querySelector(
  ".footer_comet svg #footer-tail-gradient stop:nth-child(1)"
);

const cometFooterPathLength = cometFooterPath.getTotalLength();
gsap.set(cometFooterPath, { strokeDasharray: cometFooterPathLength });

const footerCometTL = gsap.timeline({
  scrollTrigger: {
    trigger: cometFooterWrap,
    start: "top 90%",
    toggleActions: "play pause play reset",
  },
  defaults: { duration: 8, ease: "none" },
  repeat: -1,
});
footerCometTL.set(cometFooterPathGradientEndOffset, {
  attr: { offset: "0" },
});
footerCometTL.to(
  cometFooterBody,
  {
    motionPath: {
      path: cometFooterPath,
      align: cometFooterPath,
      alignOrigin: [0.5, 0.5],
      autoRotate: 175,
    },
    opacity: 1,
  },
  "<"
);
footerCometTL.fromTo(
  cometFooterPath,
  {
    strokeDashoffset: cometFooterPathLength,
  },
  {
    strokeDashoffset: "0",
  },
  "<"
);
footerCometTL.to(
  cometFooterPathGradientEndOffset,
  {
    attr: { offset: "1" },
    ease: "power1.in",
    duration: 7,
  },
  "-=80%"
);

// resize invalidation
const resizeHandler = () => {
  toDark.invalidate();
  toDark.play();
  toDarkComets.invalidate();
  toDarkComets.play();
  testimonialsCometTL.invalidate();
  testimonialsCometTL.play();
  footerCometTL.invalidate();
  footerCometTL.play();
};

const timer = gsap.delayedCall(0.2, resizeHandler).pause();

window.addEventListener("resize", () => {
  timer.restart(true);
  toDark.pause();
  toDarkComets.pause();
  testimonialsCometTL.pause();
  footerCometTL.pause();
});

//** FUNCTIONS */
// animate heading group
function animateHeadingGroup(timeline, headingGroup, options) {
  const defaultOptions = {
    duration: 1,
    stagger: 0.1,
  };
  options = { ...defaultOptions, ...options };

  const headingGroupTL = timeline;
  const headings = headingGroup.querySelectorAll("[animated-heading]");
  const subheading = headingGroup.querySelector("[animated-subheading]");
  const button = headingGroup.querySelector("[animated-button]");
  if (headings.length) {
    headings.forEach((heading) => {
      const typeSplit = new SplitType(heading, {
        types: "lines, words",
        tagName: "span",
      });
      headingGroupTL.from(typeSplit.words, {
        y: "100%",
        opacity: 0,
        duration: options.duration,
        stagger: options.stagger,
      });
    });
  }
  if (subheading) {
    headingGroupTL.from(subheading, {
      y: "100%",
      opacity: 0,
      duration: 0.5,
    });
  }
  if (button) {
    headingGroupTL.from(button, {
      y: "100%",
      opacity: 0,
      duration: 0.5,
    });
  }
}

// slider helper function
function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i;
  gsap.set(items, {
    // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
          gsap.getProperty(el, "xPercent")
      );
      return xPercents[i];
    },
  });
  gsap.set(items, { x: 0 });
  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);
  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }
  function toIndex(index, vars) {
    vars = vars || {};
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length); // always go in the shortest direction
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      // if we're wrapping the timeline's playhead, make the proper adjustments
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }
  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true); // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  return tl;
}
