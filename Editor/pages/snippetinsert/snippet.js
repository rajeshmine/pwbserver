
let pwb_email = '';
let firstleter = '';
var formData = new FormData();
$(document).ready(function () {
    pwb_email = localStorage.getItem('pwb_email');
    firstleter = pwb_email.slice(0, 1);
    $('.useraccount_firstletter').text(firstleter)

    $('#snippetcat').focus();
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
   
});
var snippetcat, snippetcode;

function encodeImageFileAsURL(element) {
    formData.append('thumbnail', element.files[0]);
}
function snippetdatainsert() {
    snippetcode = $('#snippetcode').val();
    snippetcat = $('#snippetcat').val();
    formData.append('code', snippetcode);
    var url = Config.BaseUrl + "snippetdatainsert?category=" + snippetcat;
    API_call(url, "POST", formData, (data) => {      
        if(data.StatusCode === 200){
            location.reload();
        }
    });
}


