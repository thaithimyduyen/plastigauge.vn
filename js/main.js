(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('sticky-top');
        } else {
            $('.nav-bar').removeClass('sticky-top');
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 24,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            992: {
                items: 2
            }
        }
    });

})(jQuery);

// NavLink
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(navLink => {
    navLink.onclick = () => {
        document.querySelector(".nav-link.active").classList.remove("active");
        navLink.classList.add('active');
    }
})

// Chat Zalo
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) { document.getElementById("linkzalo").href = "https://zalo.me/0367588839"; }

// Form submit
const result = document.getElementById("result");
const forms = document.querySelectorAll('.needs-validation')

Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener("submit", function (e) {
            if (!form.checkValidity()) {
                e.preventDefault()
                e.stopPropagation()
                form.classList.add('was-validated')
            } else {
                const formData = new FormData(form);
                e.preventDefault();
                var object = {};
                formData.forEach((value, key) => {
                    object[key] = value;
                });
                var json = JSON.stringify(object);
                result.style.display = "block";
                result.innerHTML = "Vui lòng chờ...";

                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: json
                })
                    .then(async (response) => {
                        if (response.status == 200) {
                            swal("Thành công!", "Bạn hãy nhấn vào nút để quay lại!", "success");
                        } else {
                            swal("Thất bại!", "Bạn hãy nhấn vào nút để quay lại!", "error");
                            console.log(response);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .then(function () {
                        form.reset();
                        result.style.display = "none";
                    });
            }
        },);
    })

    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip(); 
    });
