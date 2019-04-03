var url;
var email;
var webname;
var pagename;
let formData = new FormData();
$(document).ready(function(){
    url = window.location.href;
    email = url.split('?')['1'].split('/')['0'];
    webname = url.split('?')['1'].split('/')['1'];
    pagename = url.split('?')['1'].split('/')['2']
    if(!pagename){
        pagename = 'home';
    }
    publishdata();
});

function publishdata(){
    let url = Config.BaseUrl + "pwbwebsitedatabywebname?email=" + email + "&websitename=" + webname + "&pagename=" + pagename;
    API_call(url, "POST", formData, (data) => {
        if (data.StatusCode === 200) {
            console.log(data)
            $('#publishhtml').empty();
            let result = data.Response;
            let html = unescape(unescape(result[0].html));
            $('#publishhtml').append(html);
            $('*').removeAttr('contenteditable');
        } else {
            console.log(url)
        }
    });
}