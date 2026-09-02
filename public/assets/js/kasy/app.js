/* Theme Name:  Kasy- Responsive Landing page template
  File Description: Main JS file of the template
*/


//  Window scroll sticky class add
function windowScroll() {
  const navbar = document.getElementById("navbar");
  if (
      document.body.scrollTop >= 50 ||
      document.documentElement.scrollTop >= 50
  ) {
      navbar.classList.add("nav-sticky");
  } else {
      navbar.classList.remove("nav-sticky");
  }
}

window.addEventListener('scroll', (ev) => {
  ev.preventDefault();
  windowScroll();
})

// AOS Init
AOS.init({
    duration: 600,
    once: true,
    offset: 80,
    easing: 'ease-out',
    delay: 0,
});

// Swiper slider

var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    loopFillGroupWithBlank: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    on: {
        slideChange: function () {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        },
    },
});

// Bootstrap carousel AOS refresh
var testimonialCarousel = document.getElementById('carouselTestimonials');
if (testimonialCarousel) {
    testimonialCarousel.addEventListener('slide.bs.carousel', function () {
        if (typeof AOS !== 'undefined') {
            setTimeout(function () { AOS.refresh(); }, 100);
        }
    });
}



//
/********************* scroll top js ************************/
//

var mybutton = document.getElementById("back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}