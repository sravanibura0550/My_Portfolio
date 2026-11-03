/* =========================================================
   SRAVANI BURA PORTFOLIO
   Stable JavaScript — original UI and animations preserved
   ========================================================= */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  onReady(() => {
    /* -------------------- PRELOADER -------------------- */
    const preloader = $("#preloader");
    const loaderCount = $("#loaderCount");
    let typingStarted = false;
    let revealStarted = false;

    function startPageAnimations() {
      if (!revealStarted) {
        revealStarted = true;
        initReveal();
      }

      if (!typingStarted && typeof window.startTyping === "function") {
        typingStarted = true;
        window.startTyping();
      }
    }

    function hidePreloader() {
      if (!preloader) {
        document.body.classList.remove("loading");
        startPageAnimations();
        return;
      }

      if (preloader.dataset.finished === "true") return;
      preloader.dataset.finished = "true";

      if (loaderCount) loaderCount.textContent = "100%";

      preloader.classList.add("hide");
      document.body.classList.remove("loading");

      // Start reveal/typing while the curtain is completing its exit.
      window.setTimeout(startPageAnimations, 500);

      // Remove the overlay from interaction after its CSS transition.
      window.setTimeout(() => {
        if (preloader.classList.contains("hide")) {
          preloader.style.pointerEvents = "none";
        }
      }, 1000);
    }

    if (preloader) {
      let letterIndex = 0;

      $$(".loader-name .word", preloader).forEach((word) => {
        // Prevent wrapping letters more than once.
        if (word.querySelector(".ch")) return;

        const originalText = word.textContent || "";
        word.textContent = "";

        [...originalText].forEach((character) => {
          const span = document.createElement("span");
          span.className = "ch";
          span.style.setProperty("--i", letterIndex++);
          span.textContent = character;
          word.appendChild(span);
        });
      });

      const duration = 1700;
      const startTime = performance.now();
      let progressComplete = false;
      let pageLoaded = document.readyState === "complete";
      let completed = false;

      function tryFinish() {
        if (completed || !progressComplete) return;
        if (!pageLoaded) return;
        completed = true;
        window.setTimeout(hidePreloader, 180);
      }

      function animateProgress(now) {
        const progress = Math.min((now - startTime) / duration, 1);

        if (loaderCount) {
          loaderCount.textContent = `${Math.floor(progress * 100)}%`;
        }

        if (progress < 1) {
          requestAnimationFrame(animateProgress);
        } else {
          progressComplete = true;
          tryFinish();
        }
      }

      if (pageLoaded) {
        // Already loaded before this script started.
        pageLoaded = true;
      } else {
        window.addEventListener("load", () => {
          pageLoaded = true;
          tryFinish();
        }, { once: true });
      }

      // Never leave the visitor trapped on the splash screen.
      window.setTimeout(() => {
        pageLoaded = true;
        progressComplete = true;
        if (loaderCount) loaderCount.textContent = "100%";
        hidePreloader();
      }, 4000);

      requestAnimationFrame(animateProgress);
    } else {
      document.body.classList.remove("loading");
      startPageAnimations();
    }


    /* -------------------- LIGHT / DARK THEME -------------------- */
    const themeToggle = $("#themeToggle");
    const themeIcon = themeToggle ? $("i", themeToggle) : null;
    const savedTheme = (() => { try { return localStorage.getItem("sravani-portfolio-theme"); } catch (_) { return null; } })();
    function applyTheme(theme) {
      const selected = theme === "light" ? "light" : "dark";
      document.body.dataset.theme = selected;
      if (themeIcon) themeIcon.className = selected === "dark" ? "fas fa-sun" : "fas fa-moon";
      if (themeToggle) themeToggle.setAttribute("aria-label", selected === "dark" ? "Switch to light mode" : "Switch to dark mode");
      try { localStorage.setItem("sravani-portfolio-theme", selected); } catch (_) {}
    }
    applyTheme(savedTheme || "dark");
    if (themeToggle) themeToggle.addEventListener("click", () => applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark"));

    /* -------------------- PORTFOLIO ASSISTANT -------------------- */
    const assistantPanel = $("#assistantPanel");
    const assistantLauncher = $("#assistantLauncher");
    const assistantClose = $("#assistantClose");
    const assistantForm = $("#assistantForm");
    const assistantInput = $("#assistantInput");
    const assistantMessages = $("#assistantMessages");

    function addAssistantMessage(message, sender) {
      if (!assistantMessages) return;
      const bubble = document.createElement("div");
      bubble.className = `assistant-message ${sender === "user" ? "user-message" : "bot-message"}`;
      bubble.textContent = message;
      assistantMessages.appendChild(bubble);
      assistantMessages.scrollTop = assistantMessages.scrollHeight;
    }

    function getAssistantReply(question) {
      const q = question.toLowerCase();
      if (/hello|hi\b|hey|good morning|good evening/.test(q)) return "Hello! 👋 Welcome to Sravani's portfolio. You can ask me about her background, skills, projects, education, achievements, or contact details.";
      if (/who|about|introduc|yourself|sravani/.test(q)) return "Sravani Bura is a BCA student at Aditya Degree College for Women, Andhra Pradesh. She has hands-on experience with web development, MERN stack projects, Android development using Java/XML/SQLite, and Python. She is interested in entry-level software and full-stack opportunities.";
      if (/skill|technolog|programming|language/.test(q)) return "Sravani's skills include C, Python, Java, HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, SQL, DBMS, DSA, Android Studio, Java + XML, SQLite, GitHub, and Figma. Her strongest project language is Python; she is continuing to build her Java and full-stack skills.";
      if (/project|work|built|develop|code learn|food zone|weather|atmos/.test(q)) return "Some of Sravani's projects:\n• Code Learn — Android learning app built with Java, XML and SQLite; it won 2nd prize at Technophilia 2K26.\n• Food Zone — food ordering web app using HTML, CSS and JavaScript.\n• Atmos Weather — MERN-based weather project with weather API integration and an AI chatbot.\nYou can explore the Projects section for more details.";
      if (/education|college|degree|bca|study/.test(q)) return "Sravani is pursuing a Bachelor of Computer Applications (BCA) at Aditya Degree College for Women (2024–2027). She completed a Diploma at Government Polytechnic for Women (2021–2024) and SSC in 2021.";
      if (/achievement|award|prize|technophilia/.test(q)) return "Sravani received 2nd Prize for her Code Learn Android Student Learning Application at the Technophilia 2K26 Project Expo, held on 27 February 2026 at Aditya Degree & PG College for Women, Kakinada.";
      if (/intern|experience|company/.test(q)) return "Sravani completed a 45-day MERN Stack Development Internship at ADHOC Company and worked as a Project Documentation Trainee at S.N. Associates, Kakinada (November 2023–May 2024).";
      if (/resume|cv|download/.test(q)) return "You can download Sravani's CV using the 'Download CV' button in the About section. The file should be named cv.pdf and placed in the same folder as index.html.";
      if (/contact|email|phone|reach|hire/.test(q)) return "You can contact Sravani at sravanibura0550@gmail.com or +91 8340848292. You can also use the contact form or visit her LinkedIn and GitHub profiles.";
      if (/location|where|kakinada/.test(q)) return "Sravani is based in Kakinada, Andhra Pradesh, India.";
      if (/github|linkedin|leetcode|profile|social/.test(q)) return "Here are Sravani's profiles:\nGitHub: github.com/sravanibura0550\nLinkedIn: linkedin.com/in/sravani-bura-7227b8341\nLeetCode: leetcode.com/u/Wnk8zQsE1m/";
      return "I can help with information about Sravani's profile, skills, projects, education, internship experience, achievements, CV, and contact details. Try asking: 'What projects has she built?'";
    }

    if (assistantLauncher && assistantPanel) {
      assistantLauncher.addEventListener("click", () => {
        assistantPanel.hidden = !assistantPanel.hidden;
        if (!assistantPanel.hidden && assistantInput) assistantInput.focus();
      });
    }
    if (assistantClose && assistantPanel) assistantClose.addEventListener("click", () => { assistantPanel.hidden = true; });
    if (assistantForm && assistantInput) {
      assistantForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const question = assistantInput.value.trim();
        if (!question) return;
        addAssistantMessage(question, "user");
        assistantInput.value = "";
        window.setTimeout(() => addAssistantMessage(getAssistantReply(question), "bot"), 250);
      });
    }
    $$(".assistant-suggestions button").forEach((button) => {
      button.addEventListener("click", () => {
        if (!assistantInput || !assistantForm) return;
        assistantInput.value = button.dataset.question || button.textContent;
        assistantForm.requestSubmit();
      });
    });

    /* -------------------- YEAR -------------------- */
    const yearElement = $("#year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    /* -------------------- TYPING EFFECT -------------------- */
    (() => {
      const roles = [
        "Full-Stack Developer",
        "MERN Stack Developer",
        "Android App Developer",
        "Creative Designer"
      ];

      const typedElement = $("#typed");
      if (!typedElement) return;

      let roleIndex = 0;
      let characterIndex = 0;
      let deleting = false;
      let timerStarted = false;

      function tick() {
        const currentRole = roles[roleIndex];

        if (!deleting) {
          characterIndex++;
          typedElement.textContent = currentRole.slice(0, characterIndex);

          if (characterIndex >= currentRole.length) {
            deleting = true;
            window.setTimeout(tick, 1600);
            return;
          }

          window.setTimeout(tick, 95);
        } else {
          characterIndex--;
          typedElement.textContent = currentRole.slice(0, characterIndex);

          if (characterIndex <= 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            window.setTimeout(tick, 400);
            return;
          }

          window.setTimeout(tick, 45);
        }
      }

      window.startTyping = () => {
        if (timerStarted) return;
        timerStarted = true;
        window.setTimeout(tick, 400);
      };
    })();

    /* -------------------- NAVBAR / SCROLL -------------------- */
    const navbar = $("#navbar");
    const progressBar = $("#scrollProgress");
    const toTopButton = $("#toTop");
    const navLinks = $$(".nav-links a");

    const sections = navLinks
      .map((link) => {
        const target = link.getAttribute("href");
        return target && target.startsWith("#") ? $(target) : null;
      });

    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;

      if (navbar) {
        navbar.classList.toggle("scrolled", scrollY > 50);
      }

      if (toTopButton) {
        toTopButton.classList.toggle("show", scrollY > 500);
      }

      if (progressBar) {
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const percentage = scrollableHeight > 0
          ? Math.min(100, Math.max(0, (scrollY / scrollableHeight) * 100))
          : 0;

        progressBar.style.width = `${percentage}%`;
      }

      let currentSection = 0;
      sections.forEach((section, index) => {
        if (section && section.getBoundingClientRect().top <= 140) {
          currentSection = index;
        }
      });

      navLinks.forEach((link, index) => {
        link.classList.toggle("active", index === currentSection);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (toTopButton) {
      toTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    /* -------------------- MOBILE MENU -------------------- */
    const hamburger = $("#hamburger");
    const mobileNav = $("#navLinks");

    if (hamburger && mobileNav) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("open");
        mobileNav.classList.toggle("open");
      });

      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          hamburger.classList.remove("open");
          mobileNav.classList.remove("open");
        });
      });

      document.addEventListener("click", (event) => {
        if (
          mobileNav.classList.contains("open") &&
          !mobileNav.contains(event.target) &&
          !hamburger.contains(event.target)
        ) {
          mobileNav.classList.remove("open");
          hamburger.classList.remove("open");
        }
      });
    }

    /* -------------------- CURSOR GLOW -------------------- */
    const cursorGlow = $("#cursorGlow");

    if (cursorGlow) {
      window.addEventListener("mousemove", (event) => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
      }, { passive: true });
    }

    /* -------------------- COUNTERS / REVEAL -------------------- */
    function animateCounter(element) {
      if (element.dataset.animated === "true") return;
      element.dataset.animated = "true";

      const target = Number(element.dataset.target);
      if (!Number.isFinite(target)) return;

      const duration = 1600;
      const startTime = performance.now();

      function updateCounter(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        element.textContent = String(Math.floor(progress * target));

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = String(target);
        }
      }

      requestAnimationFrame(updateCounter);
    }

    let observer = null;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target;
          element.classList.add("show");

          $$(".bar span", element).forEach((bar) => {
            const level = Number(bar.dataset.level);
            if (Number.isFinite(level)) {
              bar.style.width = `${Math.min(100, Math.max(0, level))}%`;
            }
          });

          $$(".counter", element).forEach(animateCounter);
          observer.unobserve(element);
        });
      }, { threshold: 0.15 });
    }

    function initReveal() {
      const revealElements = $$(".reveal, .reveal-left, .reveal-right");

      if (!observer) {
        revealElements.forEach((element) => {
          element.classList.add("show");
          $$(".bar span", element).forEach((bar) => {
            bar.style.width = `${bar.dataset.level || 0}%`;
          });
          $$(".counter", element).forEach(animateCounter);
        });
        return;
      }

      revealElements.forEach((element) => {
        if (!element.classList.contains("show")) {
          observer.observe(element);
        }
      });
    }

    /* -------------------- PROJECT FILTER -------------------- */
    const filterButtons = $$(".filter");
    const projectCards = $$(".project");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter || "all";

        projectCards.forEach((project) => {
          const categories = (project.dataset.cat || "").split(/\s+/);
          const matches = filter === "all" || categories.includes(filter);
          project.classList.toggle("hide", !matches);
        });
      });
    });

    /* -------------------- CERTIFICATIONS SLIDER -------------------- */
    (() => {
      const slides = $("#slides");
      const dotsContainer = $("#dots");

      if (!slides || !dotsContainer) return;

      const slideCount = slides.children.length;
      if (slideCount === 0) return;

      let currentIndex = 0;
      let sliderTimer = null;

      dotsContainer.innerHTML = "";

      for (let index = 0; index < slideCount; index++) {
        const dot = document.createElement("span");
        dot.setAttribute("role", "button");
        dot.setAttribute("tabindex", "0");
        dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

        dot.addEventListener("click", () => {
          goToSlide(index);
          restartSlider();
        });

        dot.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            goToSlide(index);
            restartSlider();
          }
        });

        dotsContainer.appendChild(dot);
      }

      function goToSlide(index) {
        currentIndex = (index + slideCount) % slideCount;
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;

        [...dotsContainer.children].forEach((dot, dotIndex) => {
          dot.classList.toggle("active", dotIndex === currentIndex);
          dot.setAttribute(
            "aria-current",
            dotIndex === currentIndex ? "true" : "false"
          );
        });
      }

      function restartSlider() {
        if (sliderTimer) window.clearInterval(sliderTimer);
        if (slideCount > 1) {
          sliderTimer = window.setInterval(() => {
            goToSlide(currentIndex + 1);
          }, 4000);
        }
      }

      goToSlide(0);
      restartSlider();

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          if (sliderTimer) window.clearInterval(sliderTimer);
        } else {
          restartSlider();
        }
      });
    })();

    /* -------------------- CONTACT FORM -------------------- */
    const contactForm = $("#contactForm");

    if (contactForm) {
      contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = $("#name")?.value.trim() || "";
        const email = $("#email")?.value.trim() || "";
        const subject = $("#subject")?.value.trim() || "Portfolio enquiry";
        const message = $("#message")?.value.trim() || "";

        const body = `${message}\n\n— ${name} (${email})`;
        const mailto =
          `mailto:sravanibura0550@gmail.com?subject=${encodeURIComponent(subject)}` +
          `&body=${encodeURIComponent(body)}`;

        window.location.href = mailto;
      });
    }

    /* -------------------- MARQUEE -------------------- */
    (() => {
      const track = $("#marqueeTrack");
      if (!track || track.dataset.duplicated === "true") return;

      track.innerHTML += track.innerHTML;
      track.dataset.duplicated = "true";
    })();

    /* -------------------- DESKTOP POLISH -------------------- */
    (() => {
      if (!window.matchMedia) return;

      const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!finePointer || reducedMotion) return;

      // Custom cursor
      const dot = document.createElement("div");
      dot.className = "cursor-dot";

      const ring = document.createElement("div");
      ring.className = "cursor-ring";

      document.body.append(dot, ring);
      document.body.classList.add("custom-cursor");

      let mouseX = 0;
      let mouseY = 0;
      let ringX = 0;
      let ringY = 0;
      let cursorFrameRunning = true;

      window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        dot.classList.add("on");
        ring.classList.add("on");
      }, { passive: true });

      document.addEventListener("mouseleave", () => {
        dot.classList.remove("on");
        ring.classList.remove("on");
      });

      document.addEventListener("mouseenter", () => {
        dot.classList.add("on");
        ring.classList.add("on");
      });

      function animateCursor() {
        if (!cursorFrameRunning) return;

        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

        requestAnimationFrame(animateCursor);
      }

      requestAnimationFrame(animateCursor);

      window.addEventListener("pagehide", () => {
        cursorFrameRunning = false;
      }, { once: true });

      $$("a, button, .filter, .slider-dots span").forEach((element) => {
        element.addEventListener("mouseenter", () => {
          ring.classList.add("active");
        });
        element.addEventListener("mouseleave", () => {
          ring.classList.remove("active");
        });
      });

      // 3D tilt on cards
      $$(".project, .service, .t-card, .about-frame").forEach((card) => {
        card.addEventListener("mouseenter", () => {
          card.classList.add("tilting");
        });

        card.addEventListener("mousemove", (event) => {
          const rect = card.getBoundingClientRect();
          if (!rect.width || !rect.height) return;

          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          card.style.transform =
            `perspective(900px) rotateX(${-y * 8}deg) ` +
            `rotateY(${x * 8}deg) translateY(-8px)`;
        });

        card.addEventListener("mouseleave", () => {
          card.classList.remove("tilting");
          card.style.transform = "";
        });
      });

      // Magnetic buttons
      $$(".btn, .hero-social a").forEach((button) => {
        button.addEventListener("mousemove", (event) => {
          const rect = button.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;

          button.style.transform =
            `translate(${x * 0.25}px, ${y * 0.35}px)`;
        });

        button.addEventListener("mouseleave", () => {
          button.style.transform = "";
        });
      });

      // Hero blob parallax
      const blobs = $$(".blob");

      window.addEventListener("mousemove", (event) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        blobs.forEach((blob, index) => {
          const distance = (index + 1) * 30;
          blob.style.translate = `${x * distance}px ${y * distance}px`;
        });
      }, { passive: true });
    })();

    /* Run scroll state once after setup. */
    onScroll();
  });
})();
