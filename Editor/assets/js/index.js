
$(document).ready(function () {
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll > 50) {
            $(".navbar-inverse").css("background", "#fff");
            $(".navbar-inverse .navbar-brand").css("color", "#000");
            $(".navbar-inverse .navbar-nav>li>a").css("color", "#000");
            $('.scrolltop:hidden').stop(true, true).fadeIn();
        }

        else {
            $(".navbar-inverse").css("background", "transparent");
            $(".navbar-inverse .navbar-brand").css("color", "#fff");
            $(".navbar-inverse .navbar-nav>li>a").css("color", "#fff");
            $('.scrolltop').stop(true, true).fadeOut();
        }
    })
})


$(function () { $(".scroll").click(function () { $("html,body").animate({ scrollTop: $(".thetop").offset().top }, "1000"); return false }) })




function loginbtnclick() {
    location.href = "./pages/login/login.html";
}

$(document).ready(function () {

    $(".owl-carousel").owlCarousel({
        items: 1,
        pagination: false,
        navigation: false,
        navigationText: ["", ""],
        slideSpeed: 1000,
        autoPlay: true,
        loop: true
    });

    $(".templatecarousel").owlCarousel({
        center: true,
        items: 4,
        pagination: false,
        navigation: true,
        navigationText: ["", ""],
        loop: true,
        margin: 10,
        autoPlay: true,
        responsive: {
            600: {
                items: 4
            }
        }
    });
});
