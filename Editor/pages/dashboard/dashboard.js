
let pwb_email = '';
let firstleter = '';
var formData = new FormData();
$(document).ready(function () {
    pwb_email = localStorage.getItem('pwb_email');
    firstleter = pwb_email.slice(0, 1);
    $('.useraccount_firstletter').text(firstleter)
});

$(document).ready(function () {
    pwbwebsitedata();
    $('.websitedatafound').hide();
    $('.websitedatanotfound').hide();
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});
function editsite(websitename) {
    localStorage.setItem('websitename', websitename);
    location.href = "./../editor/editor.html";
}
function createwebsite() {
    location.href = "./../template/template.html";
}

function pwbwebsitedata() {
    let url = Config.BaseUrl + "pwbwebsitedata?email=" + pwb_email + "";
    API_call(url, "POST", formData, (data) => {
        if (data.StatusCode == 200) {
            $('.websitedatafound').show();
            $('.websitelist').empty();
            let result = data.Response;
            for (let i = 0; i < result.length; i++) {
                let status = result[i].status;
                let icon = 'saved';
                let color;
                let btndisabled;

                if (status === 'Y') {
                    status = 'Website Activated';
                    icon = 'saved';
                    color = '#20cc27';
                    btndisabled = '';
                } else {
                    status = 'Website Blocked';
                    icon = 'trash';
                    color = 'red';
                    btndisabled = 'disabled';
                }

                templateimageget(result[i], color, icon, status, btndisabled);


            }
        } else {
            $('.websitedatanotfound').show();
        }
    });
}
let templateimage;
function templateimageget(websiteresult, color, icon, status, btndisabled) {
    API_call(Config.BaseUrl + "pwbtemplatedata?templatename=" + websiteresult.templatename, "POST", formData, (data) => {
        if (data.StatusCode === 200) {
            localStorage.setItem('websitename', websiteresult.websitename);
            let result = data.Response;
            templateimage = result[0].image;
            arr = templateimage.data;
            templateimage = new Uint8Array(arr);
            templateimage = bufferToBase64(templateimage);
            templateimage = 'data:image/png;base64,' + templateimage;
            $('.websitelist').append('<div class="row boxshadow1 bgwhite pad10 mar10">                <div class="col-sm-5 padlft0 borderrgttddd">                    <div>                        <img class="img-responsive" src="' + templateimage + '" style="width: 100%;height: 200px;">                    </div>                </div>                <div class="col-sm-7">                    <p class="websitename" >' + websiteresult.websitename + '</p>                    <p class="websitestatus" style="color:' + color + '">' + status + ' <i class="glyphicon glyphicon-' + icon + '"></i></p>                    <p>Last updated: ' + websiteresult.createdon.split('T')[0] + ' ' + websiteresult.createdon.split('T')[1].slice(0, 8) + '</p>                    <button class="editsitebtn" onclick="editsite(\''+ websiteresult.websitename + '\')" ' + btndisabled + '>EDIT SITE</button>                    <div class="textalignrgt dropdown">                        <svg class="dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true"                            aria-expanded="true" viewBox="0 0 24 24" style="display: inline-block; color: rgba(0, 0, 0, 0.87); fill: currentcolor; height: 50px;                            width: 50px;                            padding: 15px;cursor: pointer; user-select: none; transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;">                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>                        </svg>                        <ul class="dropdown-menu fadeIn animated" aria-labelledby="dropdownMenu1">                            <li>                                <a href="#">                                    <i class="glyphicon glyphicon-pencil pad5"></i>                                    Rename                                </a>                            </li>                            <li>                                <a href="#">                                    <i class="glyphicon glyphicon-trash pad5"></i>                                    Remove                                </a>                           </li>                        </ul>                    </div>                </div>            </div>');
        }
    });

}

function bufferToBase64(buf) {
    var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
}
