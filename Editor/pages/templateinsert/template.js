
let pwb_email = '';
let firstleter = '';
var formData = new FormData();
$(document).ready(function () {
    pwb_email = localStorage.getItem('pwb_email');
    firstleter = pwb_email.slice(0, 1);
    $('.useraccount_firstletter').text(firstleter)
});

$(document).ready(function () {
    $('#templatename').focus();
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});
var templatename, pagename, html, templateimage;

function encodeImageFileAsURL(element) {
    formData.append('image', element.files[0]);
    // var file = element.files[0];
    // var reader = new FileReader();
    // reader.onloadend = function() {
    //     formData.append('image', reader.result);
    //     templateimage = reader.result;
    //   console.log('RESULT', reader.result)
    // }
    // reader.readAsDataURL(file);
}
function pwbtemplateinsert() {
    html = $('#html').val();
    templatename = $('#templatename').val();
    pagename = $('#pagename').val();
    formData.append('html', html);
    var url = Config.BaseUrl + "pwbtemplateinsert?templatename=" + templatename + "&pagename=" + pagename;
    API_call(url, "POST", formData, (data) => {
        console.log(data)
    });

    // $.ajax({
    //     type: "POST",
    //     url: `${Config.BaseUrl}pwbtemplateinsert?templatename=${templatename}&pagename=${pagename}&html=${html}&image=${templateimage}`,
    // }).done(function (data, jqXHR) {
    //     if (data.StatusCode === 200) {
    //         $('.websitedatafound').show();
    //         console.log(data)
    //     } else {
    //         console.log(data)
    //         $('.websitedatanotfound').show();
    //     }
    // });
}

