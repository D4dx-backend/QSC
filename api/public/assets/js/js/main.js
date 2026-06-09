(function ($) {
  "use strict";

  var fullHeight = function () {
    $(".js-fullheight").css("height", $(window).height());
    $(window).resize(function () {
      $(".js-fullheight").css("height", $(window).height());
    });
  };
  fullHeight();

  var carousel = function () {
    $(".featured-carousel").owlCarousel({
      loop: true,
      autoplay: true,
      margin: 30,
      animateOut: "fadeOut",
      animateIn: "fadeIn",
      nav: true,
      dots: true,
      autoplayHoverPause: false,
      items: 1,
      navText: [
        "<span class='ion-ios-arrow-back'></span>",
        "<span class='ion-ios-arrow-forward'></span>",
      ],
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 4,
        },
      },
    });
  };
  carousel();
})(jQuery);

function checkScroll() {
  const elements = document.querySelectorAll(".about-sio-para");

  elements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (elementPosition < screenHeight * 0.75) {
      element.classList.add("visible");
    }
  });
}

// Event listener for scrolling
window.addEventListener("scroll", checkScroll);

// Check on page load
window.addEventListener("load", checkScroll);

// deconquista
var swiper = new Swiper(".blog-slider", {
  spaceBetween: 30,
  effect: "fade",
  loop: true,
  mousewheel: {
    invert: false,
  },
  // autoHeight: true,
  pagination: {
    el: ".blog-slider__pagination",
    clickable: true,
  },
});

// quotes
document.addEventListener("DOMContentLoaded", function () {
  let slides = document.getElementsByClassName("mySlides_quotes");
  let dots = document.getElementsByClassName("dot_quotes");

  if (slides.length > 0) {
    let slideIndex = 0;
    showSlides();

    function plusSlides(n) {
      slideIndex += n;
      showSlides();
    }

    function currentSlide(n) {
      slideIndex = n;
      showSlides();
    }

    function showSlides() {
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        dots[i].classList.remove("active_btn_quotes");
      }

      slideIndex = (slideIndex + 1) % slides.length;

      slides[slideIndex].style.display = "block";
      dots[slideIndex].classList.add("active_btn_quotes");
    }

    let autoplayInterval = setInterval(function () {
      plusSlides(1);
    }, 3000);

    // Stop autoplay on user interaction
    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    for (let i = 0; i < dots.length; i++) {
      dots[i].addEventListener("click", function () {
        currentSlide(i);
        stopAutoplay();
      });
    }
  }
});
