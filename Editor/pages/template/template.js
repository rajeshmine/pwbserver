
let pwb_email = '';
let firstleter = '';
let buff;

var formData = new FormData();

$(document).ready(function () {

    pwb_email = localStorage.getItem('pwb_email');
    if (pwb_email) {
        firstleter = pwb_email.slice(0, 1);
    }

    $('.useraccount_firstletter').text(firstleter)
});

$(document).ready(function () {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
    pwbtemplatedata();
});

function pwbtemplatedata() {
    let url = Config.BaseUrl + "pwbtemplatedata?templatename=";
    API_call(url, "POST", formData, (data) => {
        if (data.StatusCode == 200) {
            $('.templaterowdiv').empty();
            let result = data.Response;
            for (let i = 0; i < result.length; i++) {
                var arr = result[i].image;
                arr = arr.data;
                var data = new Uint8Array(arr);
                buff = bufferToBase64(data);
                buff = 'data:image/png;base64,' + buff;
                let templatename = result[i].templatename;
                $('.templaterowdiv').append("<div class='col-sm-4'><div class='templatediv'><p class='templatename textcenter'>" + templatename + "</p><img class='width100per height200 borderbtm1grey' src='" + buff + "'><p class='pad10'><span>CHOOSE</span></p></div></div> ");
            }
            templatenameget();
        }
    });
}

function bufferToBase64(buf) {
    var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
}

function templatenameget() {
    var templatename;
    var websitename;

    $('.templatediv').each(function () {
        $(this).click(function () {
            templatename = $(this).find('.templatename').text();
            $.confirm({
                title: 'Prompt!',
                content: '' +
                    '<form action="" class="formName">' +
                    '<div class="form-group">' +
                    '<label>Enter Website Name</label>' +
                    '<input type="text" placeholder="Your Website Name" class="sitename form-control" required />' +
                    '</div>' +
                    '</form>',
                buttons: {
                    formSubmit: {
                        text: 'Submit',
                        btnClass: 'btn-blue',
                        action: function () {
                            websitename = this.$content.find('.sitename').val();

                            if (!websitename) {
                                $.alert('provide a valid name');
                                return false;
                            } else {
                                choosetemplate(templatename, websitename);

                            }

                        }
                    },
                    cancel: function () {
                        //close
                    },
                },
                onContentReady: function () {
                    // bind to events
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        // if the user submits the form by pressing enter in the field.
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });


        });
    });
}

function choosetemplate(templatename, websitename) {
    let url = Config.BaseUrl + "pwbtemplatedata?templatename=" + templatename + "";
    API_call(url, "POST", formData, (data) => {
        if (data.StatusCode == 200) {
            let result = data.Response;
            for (let i = 0; i < result.length; i++) {
                websitedatainsert(result[i].pagename, result[i].html, websitename, result[i].templatename);
            }
        }
    });
}

function websitedatainsert(pagename, html, websitename, templatename) {
    let url = Config.BaseUrl + "websitedatainsert?email=" + pwb_email + "&websitename=" + websitename + "&pagename=" + pagename + "&templatename=" + templatename + "";
    formData.append('html', html);
    API_call(url, "POST", formData, (data) => {
        if (data.StatusCode == 200) {
            localStorage.setItem('websitename', websitename);
            localStorage.setItem('pwb_pagename', 'home');
            location.href = "./../editor/editor.html";
        } else {
            alert(data.Message);
        }
    });
}