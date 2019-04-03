
var g_id, g_name, g_image, g_email, g_signin_status, g_id_token;
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    g_id = profile.getId();
    g_name = profile.getName();
    g_image = profile.getImageUrl();
    g_email = profile.getEmail();
    g_id_token = googleUser.getAuthResponse().id_token;
    g_signin_status = googleUser.isSignedIn();
    if (g_signin_status === true) {
        localStorage.setItem('pwb_email', g_email);
        location.href = "./../dashboard/dashboard.html";
        // pwb_register(g_name, g_id, g_image, g_email,'Gmail','');
    }
}

var fb_userID, fb_status, fb_email, fb_name, fb_image;
function statusChangeCallback(response) {
    if (response.status === 'connected') {
        fb_userID = response.authResponse.userID;
        fb_status = response.status;
        getCurrentUserInfo();
    } else {
        document.getElementById('loginstatusinbtn').innerHTML = 'Sign in';
    }
}
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}
window.fbAsyncInit = function () {
    FB.init({
        appId: '558533231255714',
        cookie: true,
        xfbml: true,
        version: 'v2.8'
    });
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
};
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
function getCurrentUserInfo() {
    FB.api('/me?fields=email,name,first_name,last_name,picture', function (response) {
        fb_name = response.name;
        fb_email = response.email;
        fb_image = response.picture.data.url;
        if (fb_status === 'connected') {
            localStorage.setItem('pwb_email', fb_email);
            location.href = "./../dashboard/dashboard.html";
            //pwb_register(fb_name, fb_userID, fb_image, fb_email,'FB', '');
        }
    });
}

$(document).ready(function () {
    $('#email').focus();
});

var email, password;
function Pwb_Login() {
    email = $('#email').val();
    password = $('#pwd').val();
    $.ajax({
        type: "GET",
        url: `${Config.BaseUrl}pwblogin?email=${email}&password=${password}`,
        beforeSend: function () {
            $('.pageloader').fadeIn();
        }
    }).done(function (data, jqXHR) {
        $('.pageloader').fadeOut();
        new Noty({
            text: 'Login Successfully!!!',
            theme: 'sunset',
            progressBar: true,
            type: 'success',
            visibilityControl: true,
            timeout: 1000,
            callbacks: {
                afterClose: function() {
                    localStorage.setItem('pwb_email', email);
                    location.href = "./../dashboard/dashboard.html";
                },
            }
        }).show();
        // localStorage.setItem('pwb_email', email);
        // location.href = "./../dashboard/dashboard.html";
        // $.alert({
        //     title: 'Success!',
        //     theme: 'dark',
        //     autoClose: 'ok|1000',
        //     content: `<h3>Welcome "${email}"</h3><p>Login Succesfully!!!</p>`,
        //     buttons: {
        //         ok: function () {
                   
        //         }
        //     }
        // });
    });
}

var reg_name, reg_email,reg_pwd;
function pwb_register() {
    reg_name = $('#reg_name').val();
    reg_email = $('#reg_email').val();
    reg_pwd = $('#reg_pwd').val();
    $.ajax({
        type: "POST",
        url: `${Config.BaseUrl}pwbregister?email=${reg_email}&id=&name=${reg_name}&profile=&accounttype=pwb&password=${reg_pwd}`,
    }).done(function (data, jqXHR) {
        if(data.StatusCode === 200){
            localStorage.setItem('pwb_email', reg_email);
            location.href = "./../dashboard/dashboard.html";
        } else{
            console.log(data)
        }       
    });
}

function pwbloginopen(){
    $('.pwb_register_div').slideUp();
    $('.pwb_login_div').slideDown();
}

function pwbregisteropen(){
    $('.pwb_login_div').slideUp();
    $('.pwb_register_div').slideDown();
   
}