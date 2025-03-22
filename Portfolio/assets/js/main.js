
(function () {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function (direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

document.addEventListener("DOMContentLoaded", () => {
  const modalTitle = document.getElementById("portfolioModalLabel");
  const modalDescription = document.getElementById("portfolioModalDescription");
  const modalLink = document.getElementById("portfolioModalLink");
  const modalMediaContainer = document.getElementById("portfolioModalImages");
  const modal = document.getElementById("portfolioModal");

  document.querySelectorAll(".details-link").forEach(link => {
    link.addEventListener("click", function () {
      const title = this.getAttribute("data-title");
      const description = this.getAttribute("data-description");
      const projectLink = this.getAttribute("data-link");
      const mediaFiles = this.getAttribute("data-images").split(",");

      // Update modal content
      modalTitle.textContent = title;
      modalDescription.textContent = description;
      modalDescription.style = "text-align:justify;";

      // Clear existing media content
      modalMediaContainer.innerHTML = "";

      // Insert new media into the modal
      mediaFiles.forEach((mediaSrc, index) => {
        mediaSrc = mediaSrc.trim();
        const mediaWrapper = document.createElement("div");
        mediaWrapper.className = "media-wrapper";
        mediaWrapper.style = "flex: 0 1 calc(48% - 1rem); margin: 0.5rem;";

        if (mediaSrc.endsWith(".mp4")) {
          // Create video element
          const videoElement = document.createElement("video");
          videoElement.controls = true;
          videoElement.className = "modal-video"; // Add class for easy selection
          videoElement.style = "max-width: 100%; height: auto; display: block;";
          videoElement.innerHTML = `<source src="${mediaSrc}" type="video/mp4"> Your browser does not support the video tag.`;

          mediaWrapper.appendChild(videoElement);
        } else {
          // Create image element with lightbox functionality
          const imageWrapper = document.createElement("a");
          imageWrapper.href = mediaSrc;
          imageWrapper.dataset.gallery = "modal-gallery";
          imageWrapper.className = "glightbox";

          const imgElement = document.createElement("img");
          imgElement.src = mediaSrc;
          imgElement.alt = `Project Media ${index + 1}`;
          imgElement.className = "img-fluid rounded";
          imgElement.style = "max-width: 100%; height: auto;";

          imageWrapper.appendChild(imgElement);
          mediaWrapper.appendChild(imageWrapper);
        }

        modalMediaContainer.appendChild(mediaWrapper);
      });

      // Ensure modal media container uses flexbox for layout
      modalMediaContainer.style.display = "flex";
      modalMediaContainer.style.flexWrap = "wrap";
      modalMediaContainer.style.justifyContent = "center";

      // Handle project link
      if (projectLink) {
        modalLink.href = projectLink;
        modalLink.style.display = "inline-block";
      } else {
        modalLink.style.display = "none";
      }

      // Reinitialize Glightbox for images
      GLightbox({ selector: ".glightbox" });
    });
  });

  // Stop video playback when the modal is closed
  modal.addEventListener("hidden.bs.modal", () => {
    document.querySelectorAll(".modal-video").forEach(video => {
      video.pause();
      video.currentTime = 0;
    });
  });
});

