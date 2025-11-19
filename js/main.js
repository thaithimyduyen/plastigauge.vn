(function ($) {
    "use strict";

    // =========================
    // 1. HÀM LOAD SPINNER + MENU
    // =========================
    async function loadPartials() {
        // Helper: thử lần lượt các path, path nào ok thì dùng
        async function loadAndInsert(paths, position) {
            for (const path of paths) {
                try {
                    const res = await fetch(path);
                    if (res.ok) {
                        const html = await res.text();
                        document.body.insertAdjacentHTML(position, html);
                        return true;
                    }
                } catch (e) {
                    // Bỏ qua lỗi, thử path tiếp theo
                }
            }
            return false;
        }

        // 1. Load spinner (luôn nằm trên cùng)
        await loadAndInsert(
            [
                "/spinner.html",    // ưu tiên file ở ROOT web
                "spinner.html",     // nếu trang ở root
                "../spinner.html"   // nếu trang nằm trong 1 folder con
            ],
            "afterbegin"
        );

        // 2. Load menu (sau spinner, trên nội dung trang)
        await loadAndInsert(
            [
                "/menu.html",
                "menu.html",
                "../menu.html"
            ],
            "afterbegin"
        );

        // 3. Ẩn spinner sau một lúc
        setTimeout(function () {
            var spinnerEl = document.getElementById("spinner");
            if (spinnerEl && spinnerEl.classList.contains("show")) {
                spinnerEl.classList.remove("show");
            }
            var overlay = document.querySelector(".spinner-overlay");
            if (overlay) overlay.classList.add("d-none");
        }, 800);
    }

    // =========================
    // 2. HÀM KHỞI TẠO UI SAU KHI LOAD MENU
    // =========================
    function initUI() {
        // WOW animation
        if (typeof WOW === "function") {
            new WOW().init();
        }

        // Sticky Navbar
        $(window).on("scroll", function () {
            if ($(this).scrollTop() > 45) {
                $(".nav-bar").addClass("sticky-top");
            } else {
                $(".nav-bar").removeClass("sticky-top");
            }
        });

        // Back to top button
        $(window).on("scroll", function () {
            if ($(this).scrollTop() > 300) {
                $(".back-to-top").fadeIn("slow");
            } else {
                $(".back-to-top").fadeOut("slow");
            }
        });

        $(".back-to-top").on("click", function (e) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
            return false;
        });

        // Header carousel
        if ($(".header-carousel").length) {
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
        }

        // Testimonials carousel
        if ($(".testimonial-carousel").length) {
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
        }

        // NavLink active (sau khi menu đã được chèn vào DOM)
        const navLinks = document.querySelectorAll(".nav-link");

        // Đặt active theo URL hiện tại
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            if (!href) return;
            // So đường dẫn tương đối đơn giản: nếu path kết thúc bằng href
            if (currentPath.endsWith(href)) {
                link.classList.add("active");
            }
        });

        // Click đổi active
        navLinks.forEach(navLink => {
            navLink.addEventListener("click", () => {
                document
                    .querySelectorAll(".nav-link.active")
                    .forEach(el => el.classList.remove("active"));
                navLink.classList.add("active");
            });
        });

        // Chat Zalo (mobile)
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            var zaloLink = document.getElementById("linkzalo");
            if (zaloLink) {
                zaloLink.href = "https://zalo.me/0938888958";
            }
        }

        // Form submit Web3Forms
        const result = document.getElementById("result");
        const forms = document.querySelectorAll(".needs-validation");

        Array.prototype.slice.call(forms).forEach(function (form) {
            form.addEventListener(
                "submit",
                function (e) {
                    if (!form.checkValidity()) {
                        e.preventDefault();
                        e.stopPropagation();
                        form.classList.add("was-validated");
                    } else {
                        const formData = new FormData(form);
                        e.preventDefault();
                        var object = {};
                        formData.forEach((value, key) => {
                            object[key] = value;
                        });
                        var json = JSON.stringify(object);
                        if (result) {
                            result.style.display = "block";
                            result.innerHTML = "Vui lòng chờ...";
                        }

                        fetch("https://api.web3forms.com/submit", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            },
                            body: json
                        })
                            .then(async response => {
                                if (response.status == 200) {
                                    swal(
                                        "Thành công!",
                                        "Bạn hãy nhấn vào nút để quay lại!",
                                        "success"
                                    );
                                } else {
                                    swal(
                                        "Thất bại!",
                                        "Bạn hãy nhấn vào nút để quay lại!",
                                        "error"
                                    );
                                    console.log(response);
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            })
                            .then(function () {
                                form.reset();
                                if (result) {
                                    result.style.display = "none";
                                }
                            });
                    }
                },
                false
            );
        });

        // Bootstrap tooltip
        $('[data-toggle="tooltip"]').tooltip();
    }

    // =========================
    // 3. CHẠY KHI DOM SẴN SÀNG
    // =========================
    $(function () {
        // Load spinner + menu, xong rồi mới init UI
        loadPartials().then(() => {
            initUI();
        });
    });
})(jQuery);
