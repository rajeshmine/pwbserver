

var cb_list = '';
var cb_edit = true;
var cb_snippetList = '#divSnippetList';
var cb_snippetPageSliding = false;
var oScripts = document.getElementsByTagName("script");
var sScriptPath;
for (var i = 0; i < oScripts.length; i++) {
    var sSrc = oScripts[i].src.toLowerCase();
    if (sSrc.indexOf("contentbuilder-src.js") != -1)
        sScriptPath = oScripts[i].src.replace(/contentbuilder-src.js/, "");
    if (sSrc.indexOf("contentbuilder.js") != -1)
        sScriptPath = oScripts[i].src.replace(/contentbuilder.js/, "")
}
var sScriptPathArray = sScriptPath.split("?");
sScriptPath = sScriptPathArray[0];
var sc = document.createElement('script');
sc.src = sScriptPath + 'load-image.all.min.js';
document.getElementsByTagName('head')[0].appendChild(sc);
var sc2 = document.createElement('link');
sc2.rel = 'stylesheet'; sc2.type = 'text/css';
sc2.href = sScriptPath + 'codemirror.css';
document.getElementsByTagName('head')[0].appendChild(sc2);
(function (jQuery) {
    var $activeRow;
    jQuery.contentbuilder = function (element, options) {
        var defaults = {
            selectable: "h1,h2,h3,h4,h5,h6,p,blockquote,ul,ol,small,.edit,td,i",
            editMode: 'default',
            onChange: function () {

            }, onRender: function () {

            }, onDrop: function () {

            }, onImageBrowseClick: function () {

            }, onImageSettingClick: function () {

            }, snippetFile: 'snippets.html',
            modulePath: 'assets/modules/',
            snippetPathReplace: ['', ''],
            hiquality: false,
            snippetTool: 'right',
            snippetOpen: false,
            snippetPageSliding: false,
            scrollHelper: false,
            snippetCategories: [[0, "Default"], [-1, "All"], [1, "Title"], [2, "Title, Subtitle"], [3, "Info, Title"], [4, "Info, Title, Subtitle"], [5, "Heading, Paragraph"], [6, "Paragraph"], [7, "Paragraph, Images + Caption"], [8, "Heading, Paragraph, Images + Caption"], [33, "Buttons"], [34, "Cards"], [9, "Images + Caption"], [10, "Images + Long Caption"], [11, "Images"], [12, "Single Image"], [13, "Call to Action"], [14, "List"], [15, "Quotes"], [16, "Profile"], [17, "Map"], [20, "Video"], [18, "Social"], [21, "Services"], [22, "Contact Info"], [23, "Pricing"], [24, "Team Profile"], [25, "Products/Portfolio"], [26, "How It Works"], [27, "Partners/Clients"], [28, "As Featured On"], [29, "Achievements"], [32, "Skills"], [30, "Coming Soon"], [31, "Page Not Found"], [19, "Separator"], [100, "Custom Code"]],
            addSnippetCategories: [],
            snippetCustomCode: false,
            snippetCustomCodeMessage: '<b>IMPORTANT</b>: This is a code block. Custom javascript code (&lt;script&gt; block) is allowed here but may not always work or compatible with the content builder, so proceed at your own risk. We do not support problems with custom code.',
            imageselect: '',
            fileselect: '',
            onImageSelectClick: function () {

            }, onFileSelectClick: function () {

            }, iconselect: '',
            imageEmbed: true,
            sourceEditor: true,
            buttons: ["bold", "italic", "formatting", "textsettings", "color", "font", "formatPara", "align", "list", "table", "image", "createLink", "unlink", "icon", "tags", "removeFormat", "html"],
            colors: ["#ffffc5", "#e9d4a7", "#ffd5d5", "#ffd4df", "#c5efff", "#b4fdff", "#c6f5c6", "#fcd1fe", "#ececec", "#f7e97a", "#d09f5e", "#ff8d8d", "#ff80aa", "#63d3ff", "#7eeaed", "#94dd95", "#ef97f3", "#d4d4d4", "#fed229", "#cc7f18", "#ff0e0e", "#fa4273", "#00b8ff", "#0edce2", "#35d037", "#d24fd7", "#888888", "#ff9c26", "#955705", "#c31313", "#f51f58", "#1b83df", "#0bbfc5", "#1aa71b", "#ae19b4", "#333333"],
            snippetList: '#divSnippetList',
            snippetCategoryList: '#divTool',
            toolbar: 'top',
            toolbarDisplay: 'auto',
            axis: '',
            hideDragPreview: false,
            customval: '',
            largerImageHandler: '',
            absolutePath: false,
            customTags: [],
            moduleConfig: []
        };
        this.settings = {};
        var $element = jQuery(element), element = element;
        this.undoList = [];
        this.redoList = [];
        this.init = function () {

            this.settings = jQuery.extend({

            }, defaults, options);
            var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if (is_firefox) this.settings.hideDragPreview = true;
            $element.addClass('connectSortable');
            if (cb_list == '') {
                cb_list = '#' + $element.attr('id')
            } else {
                cb_list = cb_list + ',#' + $element.attr('id')
            }
            cb_snippetList = this.settings.snippetList;
            cb_snippetPageSliding = this.settings.snippetPageSliding;
            if (jQuery('#divCb').length == 0) {
                jQuery('body').append('<div id="divCb"></div>')
            }
            for (var i = 0; i < this.settings.addSnippetCategories.length; i++) {
                this.settings.snippetCategories.push(this.settings.addSnippetCategories[i])
            }
            if (jQuery('.is-snippet-list').length == 0) {
                var html_catselect = '';
                if (this.settings.snippetCustomCode == false) {
                    for (var i = 0; i < this.settings.snippetCategories.length; i++) {
                        if (this.settings.snippetCategories[i][0] == 100) {
                            this.settings.snippetCategories.splice(i, 1)
                        }
                    }
                }
                var html_catselect = '<div id="divSnippetCat" style="display:none">Default <span class="caret"></span></div>' + '<div id="divSnippetCatOptions">'; for (var i = 0; i < this.settings.snippetCategories.length; i++) {
                    html_catselect += '<div data-value="' + this.settings.snippetCategories[i][0] + '">' + this.settings.snippetCategories[i][1] + '</div>'
                }
                html_catselect += '</div>';
                if (cb_snippetList == '#divSnippetList') {
                    var html_tool = '<div id="divTool"></div>';
                    jQuery('#divCb').append(html_tool)
                }
                jQuery(this.settings.snippetCategoryList).append(html_catselect);
                if (cb_snippetList == '#divSnippetList') {

                    var html_toolcontent = '<div id="divToolWait" style="position:absolute;top:0;left:0;width:100%;height:100%;display:table;background:rgba(255,255,255,0.2);z-index:1;">' + '<div style="display:table-cell;vertical-align:middle;text-align:center;background:rgb(217, 217, 217);"><div class="loading">' + '<div class="dot"></div>' + '<div class="dot"></div>' + '<div class="dot"></div>' + '</div></div>' + '</div>';
                    html_toolcontent += '<div id="divSnippetList"></div>';
                    html_toolcontent += '<a id="lnkToolOpen" href="#"><i class="cb-icon-left-open-big" style="font-size: 15px;"></i></a>';
                    var html_scrollhelper = '<div id="divSnippetScrollUp" style="display:none;background:rgba(0,0,0,0.3);width:45px;height:45px;line-height:45px;color:#eee;position:fixed;z-index:100000;border-radius:8px;text-align:center;font-size:12px;cursor:pointer;font-family:sans-serif;">&#9650;</div>' + '<div id="divSnippetScrollDown" style="display:none;background:rgba(0,0,0,0.3);width:45px;height:45px;line-height:45px;color:#eee;position:fixed;z-index:100000;border-radius:8px;text-align:center;font-size:12px;cursor:pointer;font-family:sans-serif;">&#9660;</div>';
                    jQuery('#divTool').append(html_toolcontent);
                    jQuery('#divCb').append(html_scrollhelper);
                    var maxScroll = 100000000;
                    jQuery('#divSnippetScrollUp').css('display', 'none');
                    jQuery('#divSnippetScrollUp').on("click touchup", function (e) {
                        jQuery("#divSnippetList").animate({
                            scrollTop: (
                                jQuery("#divSnippetList").scrollTop() - (jQuery("#divSnippetList").height() - 150)) + "px"
                        }, 300, function () {
                            if (jQuery("#divSnippetList").scrollTop() != 0) {

                                jQuery('#divSnippetScrollUp').fadeIn(300)
                            } else {
                                jQuery('#divSnippetScrollUp').fadeOut(300)
                            }
                            if (jQuery("#divSnippetList").scrollTop() != maxScroll) {
                                jQuery('#divSnippetScrollDown').fadeIn(300)
                            } else {
                                jQuery('#divSnippetScrollDown').fadeOut(300)
                            }
                        });
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false
                    });
                    jQuery('#divSnippetScrollDown').on("click touchup", function (e) {
                        jQuery("#divSnippetList").animate({ scrollTop: (jQuery("#divSnippetList").scrollTop() + (jQuery("#divSnippetList").height() - 150)) + "px" }, 300, function () {
                            if (jQuery("#divSnippetList").scrollTop() != 0) {
                                jQuery('#divSnippetScrollUp').fadeIn(300)
                            } else {
                                jQuery('#divSnippetScrollUp').fadeOut(300)
                            } if (maxScroll == 100000000) {
                                maxScroll = jQuery('#divSnippetList').prop('scrollHeight') - jQuery('#divSnippetList').height() - 10
                            }
                            if (jQuery("#divSnippetList").scrollTop() != maxScroll) {
                                jQuery('#divSnippetScrollDown').fadeIn(300)
                            }
                            else { jQuery('#divSnippetScrollDown').fadeOut(300) }
                        });
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false
                    });
                    var $window = jQuery(window);
                    var windowsize = $window.width();
                    var toolwidth = 255;
                    if (windowsize < 600) {
                        toolwidth = 150
                    } var bUseScrollHelper = this.settings.scrollHelper;
                    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
                        bUseScrollHelper = true
                    }
                    console.log(this.settings)
                    if (this.settings.snippetTool == 'right') {
                        console.log('hi')
                        jQuery('#divSnippetScrollUp').css('right', '10px');
                        jQuery('#divSnippetScrollDown').css('right', '10px');
                        if (jQuery('#divTool').css('right') != '0px') {
                            jQuery('#divTool').css('width', toolwidth + 'px');
                            jQuery('#divTool').css('right', '-' + toolwidth + 'px')
                        }
                        jQuery("#lnkToolOpen").off('click');
                        jQuery("#lnkToolOpen").click(function (e) {
                            console.log('hi')
                            jQuery('.row-tool').stop(true, true).fadeOut(0);
                            jQuery(".ui-draggable").removeClass('ui-dragbox-outlined');
                            jQuery('#rte-toolbar').css('display', 'none');
                            jQuery('.rte-pop').css('display', 'none');
                            if (cb_snippetPageSliding || ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)))) {
                                if (parseInt(jQuery('#divTool').css('right')) == 0) {
                                    jQuery('#divTool').animate({ right: '-=' + toolwidth + 'px' }, 200);
                                    jQuery('body').animate({ marginRight: '-=' + toolwidth + 'px' }, 250);
                                    jQuery('#rte-toolbar').animate({ paddingRight: '-=' + toolwidth + 'px' }, 250); jQuery('#lnkToolOpen i').attr('class', 'cb-icon-left-open-big'); jQuery('#divSnippetScrollUp').fadeOut(300);
                                    jQuery('#divSnippetScrollDown').fadeOut(300)
                                }
                                else {
                                    jQuery('#divTool').animate({ right: '+=' + toolwidth + 'px' }, 200);
                                    jQuery('body').animate({ marginRight: '+=' + toolwidth + 'px' }, 250);
                                    jQuery('#rte-toolbar').animate({ paddingRight: '+=' + toolwidth + 'px' }, 250);
                                    jQuery('#lnkToolOpen i').attr('class', 'cb-icon-right-open-big'); if (bUseScrollHelper) {
                                        var ypos = jQuery('#divSnippetList').height() / 2 - 60;
                                        jQuery('#divSnippetScrollUp').css('top', ypos);
                                        jQuery('#divSnippetScrollDown').css('top', ypos + 60);
                                        if (
                                            jQuery("#divSnippetList").scrollTop() != 0) {
                                            jQuery('#divSnippetScrollUp').fadeIn(300)
                                        } else {
                                            jQuery('#divSnippetScrollUp').fadeOut(300)
                                        }
                                        jQuery('#divSnippetScrollDown').fadeIn(300)
                                    }
                                }
                                jQuery('#rte-toolbar').css('display', 'none')
                            } else {
                                if (parseInt(jQuery('#divTool').css('right')) == 0) {
                                    jQuery('#divTool').animate({ right: '-=' + toolwidth + 'px' }, 200); jQuery('#lnkToolOpen i').attr('class', 'cb-icon-left-open-big');
                                    jQuery('#divSnippetScrollUp').css('display', 'none');
                                    jQuery('#divSnippetScrollDown').css('display', 'none')
                                } else {
                                    jQuery('#divTool').animate({ right: '+=' + toolwidth + 'px' }, 200);
                                    jQuery('#lnkToolOpen i').attr('class', 'cb-icon-right-open-big'); if (bUseScrollHelper) {
                                        var ypos = jQuery('#divSnippetList').height() / 2 - 60;
                                        jQuery('#divSnippetScrollUp').css('top', ypos);
                                        jQuery('#divSnippetScrollDown').css('top', ypos + 60); if (
                                            jQuery("#divSnippetList").scrollTop() != 0) {
                                            jQuery('#divSnippetScrollUp').fadeIn(300)
                                        } else {
                                            jQuery('#divSnippetScrollUp').fadeOut(300)
                                        }
                                        jQuery('#divSnippetScrollDown').fadeIn(300)
                                    }
                                }
                            } e.preventDefault()
                        }); jQuery('.row-tool').css('right', 'auto'); if (windowsize < 600) {
                            jQuery('.row-tool').css('left', '-30px')
                        } else {
                            jQuery('.row-tool').css('left', '-37px')
                        } if (this.settings.snippetOpen) {
                            if (
                                jQuery('#divTool').attr('data-snip-open') != 1) {
                                jQuery('#divTool').attr('data-snip-open', 1);
                                jQuery('#divTool').animate({ right: '+=' + toolwidth + 'px' }, 900);
                                jQuery("#lnkToolOpen i").attr('class', 'cb-icon-right-open-big')
                            }
                        }
                    } else {
                        console.log('hi')
                        jQuery("#lnkToolOpen i").attr('class', 'cb-icon-right-open-big');
                        jQuery('#divSnippetScrollUp').css('left', '10px');
                        jQuery('#divSnippetScrollDown').css('left', '10px');
                        jQuery('#divTool').css('width', toolwidth + 'px');
                        jQuery('#divTool').css('left', '-' + toolwidth + 'px');
                        jQuery('#lnkToolOpen').addClass('leftside');
                        jQuery("#lnkToolOpen").off('click');
                        jQuery("#lnkToolOpen").click(function (e) {
                            jQuery('.row-tool').stop(true, true).fadeOut(0);
                            jQuery(".ui-draggable").removeClass('ui-dragbox-outlined');
                            jQuery('#rte-toolbar').css('display', 'none');
                            jQuery('.rte-pop').css('display', 'none');
                            if (cb_snippetPageSliding || ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)))) { if (parseInt(jQuery('#divTool').css('left')) == 0) { jQuery('#divTool').animate({ left: '-=' + (toolwidth + 0) + 'px' }, 200); jQuery('body').animate({ marginLeft: '-=' + toolwidth + 'px' }, 250); jQuery('#rte-toolbar').animate({ paddingLeft: '-=' + toolwidth + 'px' }, 250); jQuery("#lnkToolOpen i").attr('class', 'cb-icon-right-open-big'); jQuery('#divSnippetScrollUp').fadeOut(300); jQuery('#divSnippetScrollDown').fadeOut(300) } else { jQuery('#divTool').animate({ left: '+=' + (toolwidth + 0) + 'px' }, 200); jQuery('body').animate({ marginLeft: '+=' + toolwidth + 'px' }, 250); jQuery('#rte-toolbar').animate({ paddingLeft: '+=' + toolwidth + 'px' }, 250); jQuery("#lnkToolOpen i").attr('class', 'cb-icon-left-open-big'); if (bUseScrollHelper) { var ypos = jQuery('#divSnippetList').height() / 2 - 60; jQuery('#divSnippetScrollUp').css('top', ypos); jQuery('#divSnippetScrollDown').css('top', ypos + 60); if (jQuery("#divSnippetList").scrollTop() != 0) { jQuery('#divSnippetScrollUp').fadeIn(300) } else { jQuery('#divSnippetScrollUp').fadeOut(300) } jQuery('#divSnippetScrollDown').fadeIn(300) } } jQuery('#rte-toolbar').css('display', 'none'); jQuery('.rte-pop').css('display', 'none') } else {
                                if (parseInt(jQuery('#divTool').css('left')) == 0) { jQuery('#divTool').animate({ left: '-=' + (toolwidth + 0) + 'px' }, 200); jQuery("#lnkToolOpen i").attr('class', 'cb-icon-right-open-big'); jQuery('#divSnippetScrollUp').css('display', 'none'); jQuery('#divSnippetScrollDown').css('display', 'none') }
                                else {
                                    jQuery('#divTool').animate({ left: '+=' + (toolwidth + 0) + 'px' }, 200);
                                    jQuery("#lnkToolOpen i").attr('class', 'cb-icon-left-open-big');
                                    if (bUseScrollHelper) {
                                        var ypos = jQuery('#divSnippetList').height() / 2 - 60;
                                        jQuery('#divSnippetScrollUp').css('top', ypos); jQuery('#divSnippetScrollDown').css('top', ypos + 60); if (jQuery("#divSnippetList").scrollTop() != 0) { jQuery('#divSnippetScrollUp').fadeIn(300) } else { jQuery('#divSnippetScrollUp').fadeOut(300) } jQuery('#divSnippetScrollDown').fadeIn(300)
                                    }
                                }
                            } e.preventDefault()
                        }); jQuery('.row-tool').css('left', 'auto'); if (windowsize < 600) { jQuery('.row-tool').css('right', '-30px') } else { jQuery('.row-tool').css('right', '-37px') } if (this.settings.snippetOpen) { if (jQuery('#divTool').attr('data-snip-open') != 1) { jQuery('#divTool').attr('data-snip-open', 1); jQuery('#divTool').animate({ left: '+=' + toolwidth + 'px' }, 900); jQuery("#lnkToolOpen i").attr('class', 'cb-icon-left-open-big') } }
                    }
                }
                jQuery(cb_snippetList).addClass('is-snippet-list');
                jQuery('#divSnippetCat').click(function (e) {
                    if (jQuery('#divSnippetCatOptions').hasClass('active')) {
                        jQuery('#divSnippetCatOptions').removeClass('active')
                    }
                    else {
                        jQuery('#divSnippetCatOptions').css('width', jQuery(this).css('width'));
                        jQuery('#divSnippetCatOptions').addClass('active')
                    } e.preventDefault(); e.stopImmediatePropagation()
                });
                jQuery('#divSnippetCatOptions > div').click(function () {
                    var valueSelected = jQuery(this).attr('data-value');
                    jQuery('#divSnippetCat').html(jQuery(this).html() + ' <span class="caret"></span>');
                    jQuery('#divSnippetCatOptions').removeClass('active');
                    var $cbSnippetList = jQuery(cb_snippetList + ' > div');
                    if (valueSelected == '-1') {
                        $cbSnippetList.fadeIn(200)
                    }
                    else {
                        $cbSnippetList.fadeOut(200, function () {
                            var $this = jQuery(this);
                            var $catSplit = $this.attr('data-cat').split(',');
                            for (var j = 0; j < $catSplit.length; j++) {
                                if (valueSelected == $catSplit[j]) {
                                    $this.fadeIn(400)
                                }
                            }
                        })
                    }
                });
                $('html').click(function (e) {
                    if ($(e.target).parents('#divSnippetCatOptions').length > 0) return false;
                    if ($(e.target).attr('id') == 'divSnippetCatOptions') return false;
                    if ($(e.target).parents('#divSnippetCat').length > 0) return false;
                    if ($(e.target).attr('id') == 'divSnippetCat') return false;
                    jQuery('#divSnippetCatOptions').removeClass('active')
                });
                jQuery('#divCb').append('<div id="divSnippets" style="display:none"></div>');
                jQuery.get(this.settings.snippetFile, function (data) {
                    var htmlData = '';
                    var htmlThumbs = ''; var i = 1; var bUseSnippetsFilter = false; try {
                        if ($element.data('contentbuilder').settings.snippetPathReplace[0] != '') {
                            var regex = new RegExp($element.data('contentbuilder').settings.snippetPathReplace[0], 'g'); data = data.replace(regex, $element.data('contentbuilder').settings.snippetPathReplace[1]);
                            var string1 = $element.data('contentbuilder').settings.snippetPathReplace[0].replace(/\//g, '%2F');
                            var string2 = $element.data('contentbuilder').settings.snippetPathReplace[1].replace(/\//g, '%2F'); var regex2 = new RegExp(string1, 'g'); data = data.replace(regex2, string2)
                        }
                    } catch (e) { } var $currentDataChildren = jQuery('<div/>').html(data).children('div'); for (var i = 1; $currentDataChildren.length >= i; i++) {
                        var $this = jQuery($currentDataChildren[i - 1]); var block = $this.html();
                        var blockEncoded = jQuery('<div/>').text(block).html();
                        htmlData += '<div id="snip' + i + '">' + blockEncoded + '</div>';
                        if ($this.data("cat") != null) bUseSnippetsFilter = true;
                        var thumb = $this.data("thumb");
                        if (bUseSnippetsFilter) {
                            htmlThumbs += '<div style="display:none" title="Snippet ' + i + '" data-snip="' + i + '" data-cat="' + $this.data("cat") + '"><img src="' + thumb + '" /></div>'
                        } else { htmlThumbs += '<div title="Snippet ' + i + '" data-snip="' + i + '" data-cat="' + $this.data("cat") + '"><img src="' + thumb + '" /></div>' }
                    } jQuery('#divSnippets').html(htmlData);
                    jQuery(cb_snippetList).html(htmlThumbs);
                    if (bUseSnippetsFilter) {
                        var cats = [];
                        var defaultExists = false;
                        var $cbSnippetListDivs = jQuery(cb_snippetList + ' > div');
                        for (var cbs = 0; $cbSnippetListDivs.length > cbs; cbs++) {
                            var $this = jQuery($cbSnippetListDivs[cbs]);
                            var catSplit = $this.attr('data-cat').split(',');
                            for (var j = 0; j < catSplit.length; j++) {
                                var catid = $this.attr('data-cat').split(',')[j];
                                if (catid == 0) {
                                    $this.fadeIn(400); defaultExists = true
                                }
                                if (jQuery.inArray(catid, cats) == -1) {
                                    cats.push(catid); if (jQuery('#divSnippetCatOptions').find("[data-value='" + catid + "']").length == 0) { $this.remove() }
                                }
                            }
                        }
                        var $selSnips = jQuery('#divSnippetCatOptions');
                        var $selSnipsOption = jQuery('#divSnippetCatOptions > div');
                        for (var sso = 0; $selSnipsOption.length > sso; sso++) {
                            var catid = jQuery($selSnipsOption[sso]).attr('data-value');
                            if (jQuery.inArray(catid, cats) == -1) {
                                if (catid != 0 && catid != -1) {
                                    $selSnips.find("[data-value='" + catid + "']").remove()
                                }
                            }
                        }
                        if (!defaultExists) {
                            jQuery(cb_snippetList + ' > div').css('display', 'block');
                            jQuery('#divSnippetCatOptions').find("[data-value='0']").remove();
                            jQuery('#divSnippetCat').html('All <span class="caret"></span>')
                        }
                        jQuery('#divSnippetCat').css('display', 'block')
                    } if (cb_snippetList == '#divSnippetList') {
                        if (bUseSnippetsFilter) {
                            jQuery('#divSnippetList').css('border-top', 'rgba(0,0,0,0) 52px solid')
                        }
                    }
                    $element.data('contentbuilder').applyDraggable();
                    jQuery('#divToolWait').remove()
                })
            }
            else {
                this.applyDraggable()
            }
            $element.children("*").wrap("<div class='ui-draggable'></div>");
            $element.children("*").append('<div class="row-tool">' + '<div class="row-handle"><i class="cb-icon-move"></i></div>' + '<div class="row-html"><i class="cb-icon-code"></i></div>' + '<div class="row-copy"><i class="cb-icon-plus"></i></div>' + '<div class="row-remove"><i class="cb-icon-cancel"></i></div>' + '</div>');
            if (jQuery('#temp-contentbuilder').length == 0) {
                jQuery('#divCb').append('<div id="temp-contentbuilder" style="display: none"></div>')
            }
            this.applyBehavior();
            this.blockChanged();
            this.settings.onRender();
            $element.sortable({
                helper: function (event, ui) {
                    var $clone = jQuery(ui).clone();
                    $clone.css('position', 'absolute');
                    $clone.addClass('cloned-handler');
                    if ($element.data('contentbuilder').settings.axis == '') {
                        if (!$clone.parent().is('body')) {
                            $clone.appendTo(jQuery('body'))
                        }
                    } return $clone.get(0)
                }, sort: function (event, ui) {
                    if ($element.data('contentbuilder').settings.hideDragPreview) {
                        ui.helper.css({ 'display': 'none' })
                    }
                },
                items: '.ui-draggable',
                connectWith: '.connectSortable', 'distance': 5,
                tolerance: 'pointer',
                handle: '.row-handle',
                delay: 200,
                cursor: 'move',
                placeholder: 'block-placeholder',
                start: function (e, ui) {
                    jQuery(ui.placeholder).hide();
                    jQuery(ui.placeholder).slideUp(80);
                    cb_edit = false
                }, change: function (e, ui) {
                    jQuery(ui.placeholder).hide().slideDown(80)
                },
                beforeStop: function (e, ui) {
                    jQuery(ui.placeholder).hide()
                }, deactivate: function (event, ui) {
                    jQuery(".cloned-handler").remove();
                    if (!$element.data('contentbuilder'))
                        return;
                    cb_edit = true;
                    var bDrop = false;
                    if (ui.item.find('.row-tool').length == 0) {
                        bDrop = true
                    }
                    if (ui.item.parent().attr('id') == $element.attr('id')) {
                        ui.item.find("[data-html]").each(function () {
                            var html = (decodeURIComponent(jQuery(this).attr("data-html")));
                            jQuery(this).html(html)
                        });
                        ui.item.replaceWith(ui.item.html());
                        $element.children("*").each(function () {
                            if (!jQuery(this).hasClass('ui-draggable')) {
                                jQuery(this).wrap("<div class='ui-draggable'></div>")
                            }
                        });
                        $element.children('.ui-draggable').each(function () {
                            if (jQuery(this).find('.row-tool').length == 0) {
                                jQuery(this).append('<div class="row-tool">' + '<div class="row-handle"><i class="cb-icon-move"></i></div>' + '<div class="row-html"><i class="cb-icon-code"></i></div>' + '<div class="row-copy"><i class="cb-icon-plus"></i></div>' + '<div class="row-remove"><i class="cb-icon-cancel"></i></div>' + '</div>')
                            }
                        });
                        $element.children('.ui-draggable').each(function () {
                            if (jQuery(this).children('*').length == 1) {
                                jQuery(this).remove()
                            }
                            if (jQuery(this).children('*').length == 2) {
                                if (jQuery(this).children(0).prop("tagName").toLowerCase() == 'img' && jQuery(this).children(0).attr('src').indexOf('thumbnails/') != -1) {
                                    jQuery(this).remove()
                                }
                            }
                        });
                        $element.data('contentbuilder').settings.onDrop(event, ui)
                    } else {
                        return
                    }
                    $element.data('contentbuilder').applyBehavior();
                    $element.data('contentbuilder').blockChanged();
                    $element.data('contentbuilder').settings.onRender();
                    $element.data('contentbuilder').settings.onChange();
                    saveForUndo()
                }
            });
            if (cb_list.indexOf(',') != -1) {
                jQuery(cb_list).sortable('option', 'axis', false)
            }
            if (this.settings.axis != '') {
                jQuery(cb_list).sortable('option', 'axis', this.settings.axis)
            } jQuery.ui.isOverAxis2 = function (x, reference, size) {
                return (x >= reference) && (x < (reference + size))
            };
            jQuery.ui.isOver = function (y, x, top, left, height, width) {
                return jQuery.ui.isOverAxis2(y, top, height) && jQuery.ui.isOverAxis(x, left, width)
            };
            $element.droppable({
                drop: function (event, ui) {
                    if (jQuery(ui.draggable).data('snip')) {
                        var snip = jQuery(ui.draggable).data('snip');
                        var snipHtml = jQuery('#snip' + snip).text();
                        snipHtml = snipHtml.replace(/{id}/g, makeid());
                        jQuery(ui.draggable).data('snip', null); return ui.draggable.html(snipHtml); event.preventDefault()
                    }
                },
                tolerance: 'pointer',
                greedy: true,
                hoverClass: 'drop-zone',
                activeClass: 'drop-zone',
                deactivate: function (event, ui) {
                    jQuery(cb_list).each(function () {
                        var $cb = jQuery(this);
                        $cb.children('.ui-draggable').each(function () {
                            if (jQuery(this).find('.row-tool').length == 0) {
                                jQuery(this).append('<div class="row-tool">' + '<div class="row-handle"><i class="cb-icon-move"></i></div>' + '<div class="row-html"><i class="cb-icon-code"></i></div>' + '<div class="row-copy"><i class="cb-icon-plus"></i></div>' + '<div class="row-remove"><i class="cb-icon-cancel"></i></div>' + '</div>')
                            }
                        });
                        $cb.data('contentbuilder').applyBehavior()
                    })
                }
            });
            jQuery(document).on('mousedown', function (event) {
                var $active_element;
                if (jQuery(event.target).parents(".ui-draggable").length > 0) {
                    if (jQuery(event.target).parents(".ui-draggable").parent().data('contentbuilder')) {
                        $active_element = jQuery(event.target).parents(".ui-draggable").parent()
                    }
                } if (jQuery(event.target).attr("class") == 'ovl') {
                    jQuery(event.target).css('z-index', '-1')
                }
                if (jQuery(event.target).parents('.ui-draggable').length > 0 && jQuery(event.target).parents(cb_list).length > 0) {
                    var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                    if (jQuery(event.target).parents("[data-html]").length > 0) {
                        jQuery(event.target).parents(".ui-draggable").addClass('code');
                        jQuery(event.target).parents(".ui-draggable").find('.row-tool .row-html').addClass('row-module');
                        jQuery(event.target).parents(".ui-draggable").find('.row-tool .cb-icon-code').removeClass('cb-icon-code').addClass('cb-icon-cog')
                    } if (jQuery(event.target).parents("[data-mode='readonly']").length > 0) {
                        jQuery(event.target).parents(".ui-draggable").addClass('code');
                        jQuery(event.target).parents(".ui-draggable").find('.row-tool .row-html').css('display', 'none')
                    } if (jQuery(event.target).parents("[data-mode='readonly-protected']").length > 0) {
                        jQuery(event.target).parents(".ui-draggable").addClass('code');
                        jQuery(event.target).parents(".ui-draggable").find('.row-tool .row-html').css('display', 'none');
                        jQuery(event.target).parents(".ui-draggable").find('.row-tool .row-remove').css('display', 'none');
                        jQuery(event.target).parents(".ui-draggable").find('.row-tool .row-copy').css('display', 'none')
                    }
                    jQuery(".ui-draggable").removeClass('ui-dragbox-outlined');
                    jQuery(event.target).parents(".ui-draggable").addClass('ui-dragbox-outlined');
                    if (is_firefox)
                        jQuery(event.target).parents(".ui-draggable").addClass('firefox'); jQuery('.row-tool').stop(true, true).fadeOut(0);
                    if ($active_element) {
                        if (jQuery(event.target).parents(".ui-draggable").find("[data-html-edit='off']").length > 0 || !$active_element.data('contentbuilder').settings.sourceEditor) {
                            jQuery(event.target).parents(".ui-draggable").find('.row-tool .row-html').css({ display: 'none' })
                        }
                    }
                    jQuery(event.target).parents(".ui-draggable").find('.row-tool').stop(true, true).css({ display: 'none' }).fadeIn(300); return
                } if (jQuery(event.target).parent().attr('id') == 'rte-toolbar' || jQuery(event.target).parent().parent().attr('id') == 'rte-toolbar' || jQuery(event.target).parent().hasClass('rte-pop') || jQuery(event.target).parent().parent().hasClass('rte-pop') || jQuery(event.target).parent().hasClass('md-modal')) { return }
                if (jQuery(event.target).is('[contenteditable]') || jQuery(event.target).css('position') == 'absolute' || jQuery(event.target).css('position') == 'fixed' || jQuery(event.target).hasClass('md-modal')) { return }
                var bReturn = false;
                jQuery(event.target).parents().each(function (e) {
                    if (jQuery(this).is('[contenteditable]') || jQuery(this).css('position') == 'absolute' || jQuery(this).css('position') == 'fixed' || jQuery(this).hasClass('md-modal')) { bReturn = true; return }
                });
                if (bReturn) return;
                jQuery('.row-tool').stop(true, true).fadeOut(0);
                jQuery(".ui-draggable").removeClass('ui-dragbox-outlined'); jQuery('#rte-toolbar').css('display', 'none');
                jQuery('.rte-pop').css('display', 'none')
            })
        };
        this.applyDraggable = function (obj) {
            var bJUIStable = false;
            if (jQuery.ui.version == '1.11.0') {
                bJUIStable = true
            }
            if (bJUIStable) {
                jQuery(cb_snippetList + ' > div').draggable({
                    cursor: 'move', helper: function () { return jQuery("<div class='dynamic'></div>")[0] }, delay: 200, connectToSortable: cb_list, stop: function (event, ui) {
                        jQuery(cb_list).each(function () {
                            var $cb = jQuery(this); $cb.children("div").each(function () {
                                if (jQuery(this).children("img").length == 1) { jQuery(this).remove() }
                            })
                        })
                    }
                })
            }
            else {
                jQuery(cb_snippetList + ' > div').draggable({
                    cursor: 'move', helper: "clone", drag: function (event, ui) {
                        jQuery(ui.helper).css("overflow", "hidden");
                        jQuery(ui.helper).css("padding-top", "60px");
                        jQuery(ui.helper).css("box-sizing", "border-box");
                        jQuery(ui.helper).css("width", "150px");
                        jQuery(ui.helper).css("height", "60px");
                        jQuery(ui.helper).css("border", "rgba(225,225,225,0.9) 5px solid");
                        jQuery(ui.helper).css("background", "rgba(225,225,225,0)")
                    }, connectToSortable: cb_list, stop: function (event, ui) {
                        jQuery(cb_list).each(function () {
                            var $cb = jQuery(this); $cb.children("div").each(function () {
                                if (jQuery(this).children("img").length == 1) {
                                    jQuery(this).remove()
                                }
                            })
                        })
                    }
                })
            }
        };
        this.html = function () {
            if (this.settings.absolutePath) {
                $element.find('a').each(function () {
                    var href = jQuery(this).get(0).href;
                    jQuery(this).attr('href', href)
                });
                $element.find('img').each(function () {
                    var href = jQuery(this).get(0).src;
                    jQuery(this).attr('src', href)
                })
            }
            jQuery('#temp-contentbuilder').html($element.html());
            jQuery('#temp-contentbuilder').find('.row-tool').remove();
            jQuery('#temp-contentbuilder').find('.ovl').remove();
            jQuery('#temp-contentbuilder').find('[contenteditable]').removeAttr('contenteditable'); jQuery('*[class=""]').removeAttr('class');
            jQuery('#temp-contentbuilder').find('.ui-draggable').replaceWith(function () {
                return jQuery(this).html()
            }); jQuery("#temp-contentbuilder").find("[data-html]").each(function () {
                if (jQuery(this).attr("data-html") != undefined) {
                    jQuery(this).html(decodeURIComponent(jQuery(this).attr("data-html")))
                }
            });
            var html = jQuery('#temp-contentbuilder').html().trim();
            html = html.replace(/<font/g, '<span').replace(/<\/font/g, '</span');
            return html
        }; this.clearControls = function () {
            jQuery('.row-tool').stop(true, true).fadeOut(0);
            jQuery(".ui-draggable").removeClass('ui-dragbox-outlined');
            var selectable = this.settings.selectable;
            $element.find(selectable).blur()
        };
        this.viewHtml = function () {
            var html = this.html();
            jQuery('#txtHtml').val(html);
            jQuery('#md-html').css('width', '80%');
            jQuery('#md-html').simplemodal({
                isModal: true
            }); jQuery('#md-html').data('simplemodal').show();
            jQuery('#txtHtml').css('display', 'none');
            if (jQuery('#txtHtml').data('CodeMirrorInstance')) {
                var $htmlEditor = $('#txtHtml').data('CodeMirrorInstance');
                $htmlEditor.setValue(html)
            } else {
                var myTextArea = jQuery("#txtHtml")[0];
                if (jQuery('.is-cmloaded').length == 0) {
                    getScripts([sScriptPath + "codemirror.js"], function () {
                        getScripts([sScriptPath + "codemirror/mode/xml/xml.js", sScriptPath + "codemirror/mode/javascript/javascript.js", sScriptPath + "codemirror/mode/css/css.js"], function () {
                            jQuery('body').addClass('is-cmloaded');
                            var $htmlEditor = CodeMirror.fromTextArea(myTextArea, {
                                value: html, mode: "text/html", lineWrapping: true, lineNumbers: true, tabMode: "indent"
                            }); $htmlEditor.on("change", function (cm, change) {
                                jQuery('#txtHtml').val(cm.getValue())
                            });
                            jQuery('#txtHtml').data('CodeMirrorInstance', $htmlEditor)
                        })
                    })
                } else {
                    var $htmlEditor = CodeMirror.fromTextArea(
                        myTextArea,
                        {
                            value: html,
                            mode: "text/html",
                            lineWrapping: true,
                            lineNumbers: true,
                            tabMode: "indent"
                        });
                    $htmlEditor.on("change", function (cm, change) {
                        jQuery('#txtHtml').val(cm.getValue())
                    });
                    jQuery('#txtHtml').data('CodeMirrorInstance', $htmlEditor)
                }
            }
            jQuery('#btnHtmlOk').off('click');
            jQuery('#btnHtmlOk').on('click', function (e) {
                console.log('hi')
                var $htmlEditor = $('#txtHtml').data('CodeMirrorInstance');
                jQuery('#txtHtml').val($htmlEditor.getValue());
                $element.html(jQuery('#txtHtml').val());
                jQuery('#md-html').data('simplemodal').hide();
                $element.children("*").wrap("<div class='ui-draggable'></div>");
                $element.children("*").append('<div class="row-tool">' + '<div class="row-handle"><i class="cb-icon-move"></i></div>' + '<div class="row-html"><i class="cb-icon-code"></i></div>' + '<div class="row-copy"><i class="cb-icon-plus"></i></div>' + '<div class="row-remove"><i class="cb-icon-cancel"></i></div>' + '</div>');
                $element.data('contentbuilder').applyBehavior();
                $element.data('contentbuilder').blockChanged();
                $element.data('contentbuilder').settings.onRender();
                $element.data('contentbuilder').settings.onChange();
                saveForUndo()
            }); jQuery('#btnHtmlCancel').off('click');
            jQuery('#btnHtmlCancel').on('click', function (e) {
                jQuery('#md-html').data('simplemodal').hide()
            })
        }; this.loadHTML = function (html) {
            $element.html(html);
            $element.children("*").wrap("<div class='ui-draggable'></div>");
            $element.children("*").append('<div class="row-tool">' + '<div class="row-handle"><i class="cb-icon-move"></i></div>' + '<div class="row-html"><i class="cb-icon-code"></i></div>' + '<div class="row-copy"><i class="cb-icon-plus"></i></div>' + '<div class="row-remove"><i class="cb-icon-cancel"></i></div>' + '</div>');
            $element.data('contentbuilder').applyBehavior();
            $element.data('contentbuilder').blockChanged();
            $element.data('contentbuilder').settings.onRender()
        };
        this.applyBehavior = function () {
            $element.find('a').click(function () {
                return false
            });
            if (this.settings.absolutePath) {
                $element.find('a').each(function () {
                    var href = jQuery(this).get(0).href;
                    jQuery(this).attr('href', href)
                });
                $element.find('img').each(function () {
                    var href = jQuery(this).get(0).src;
                    jQuery(this).attr('src', href)
                })
            }
            var selectable = this.settings.selectable;
            var hq = this.settings.hiquality;
            var imageEmbed = this.settings.imageEmbed;
            var buttons = this.settings.buttons;
            var colors = this.settings.colors;
            var editMode = this.settings.editMode;
            var toolbar = this.settings.toolbar;
            var toolbarDisplay = this.settings.toolbarDisplay;
            var onImageSelectClick = this.settings.onImageSelectClick;
            var onFileSelectClick = this.settings.onFileSelectClick;
            var onImageBrowseClick = this.settings.onImageBrowseClick;
            var onImageSettingClick = this.settings.onImageSettingClick;
            var customTags = this.settings.customTags;
            var imageselect = this.settings.imageselect;
            var fileselect = this.settings.fileselect;
            var iconselect = this.settings.iconselect;
            var customval = this.settings.customval;
            var largerImageHandler = this.settings.largerImageHandler;
            $element.contenteditor({
                fileselect: fileselect,
                imageselect: imageselect,
                iconselect: iconselect,
                onChange: function () {
                    $element.data('contentbuilder').settings.onChange()
                },
                editable: selectable,
                buttons: buttons,
                colors: colors,
                editMode: editMode,
                toolbar: toolbar,
                toolbarDisplay: toolbarDisplay,
                onFileSelectClick:
                    onFileSelectClick,
                onImageSelectClick: onImageSelectClick,
                customTags: customTags
            });
            $element.data('contenteditor').render();
            $element.find('img').each(function () {
                if (jQuery(this).parents("[data-html]").length > 0) return;
                if (jQuery(this).parents("[data-mode='readonly']").length > 0) return;
                if (jQuery(this).parents("[data-mode='readonly-protected']").length > 0) return;
                jQuery(this).imageembed({
                    hiquality: hq,
                    imageselect: imageselect,
                    fileselect: fileselect,
                    imageEmbed: imageEmbed,
                    onImageBrowseClick: onImageBrowseClick,
                    onImageSettingClick: onImageSettingClick,
                    onImageSelectClick: onImageSelectClick,
                    onFileSelectClick: onFileSelectClick,
                    largerImageHandler: largerImageHandler,
                    customval: customval
                });
                if (jQuery(this).parents('figure').length != 0) {
                    if (jQuery(this).parents('figure').find('figcaption').css('position') == 'absolute') {
                        jQuery(this).parents('figure').imageembed({
                            hiquality: hq,
                            imageselect: imageselect,
                            fileselect: fileselect,
                            imageEmbed: imageEmbed,
                            onImageBrowseClick: onImageBrowseClick,
                            onImageSettingClick: onImageSettingClick,
                            onImageSelectClick: onImageSelectClick,
                            onFileSelectClick: onFileSelectClick,
                            largerImageHandler: largerImageHandler,
                            customval: customval
                        })
                    }
                }
            });
            $element.find(".embed-responsive").each(function () {
                if (jQuery(this).parents("[data-html]").length > 0) return;
                if (jQuery(this).parents("[data-mode='readonly']").length > 0) return;
                if (jQuery(this).parents("[data-mode='readonly-protected']").length > 0) return;
                if (jQuery(this).find('.ovl').length == 0) {
                    jQuery(this).append('<div class="ovl" style="position:absolute;background:#fff;opacity:0.2;cursor:pointer;top:0;left:0px;width:100%;height:100%;z-index:-1"></div>')
                }
            });
            $element.on('mouseenter mouseleave', '.embed-responsive', function (e) {
                switch (e.type) {
                    case 'mouseenter': if (jQuery(this).parents("[data-html]").length > 0) return;
                        if (jQuery(this).parents("[data-mode='readonly']").length > 0) return;
                        if (jQuery(this).parents("[data-mode='readonly-protected']").length > 0) return;
                        if (jQuery(this).parents(".ui-draggable").css('outline-style') == 'none') {
                            jQuery(this).find('.ovl').css('z-index', '1')
                        } break;
                    case 'mouseleave': jQuery(this).find('.ovl').css('z-index', '-1');
                        break
                }
            });
            $element.find(selectable).off('focus');
            $element.find(selectable).focus(function () {
                var selectable = $element.data('contentbuilder').settings.selectable;
                var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                jQuery(".ui-draggable").removeClass('code');
                if (jQuery(this).parents("[data-html]").length > 0) {
                    jQuery(this).parents(".ui-draggable").addClass('code')
                }
                if (jQuery(this).parents("[data-mode='readonly']").length > 0) {
                    jQuery(this).parents(".ui-draggable").addClass('code')
                }
                if (jQuery(this).parents("[data-mode='readonly-protected']").length > 0) {
                    jQuery(this).parents(".ui-draggable").addClass('code')
                }
                jQuery(".ui-draggable").removeClass('ui-dragbox-outlined');
                jQuery(this).parents(".ui-draggable").addClass('ui-dragbox-outlined');
                if (is_firefox) jQuery(this).parents(".ui-draggable").addClass('firefox');
                jQuery('.row-tool').stop(true, true).fadeOut(0);
                if (jQuery(this).parents(".ui-draggable").find("[data-html-edit='off']").length > 0 || !$element.data('contentbuilder').settings.sourceEditor) {
                    jQuery(this).parents(".ui-draggable").find('.row-tool .row-html').css({ display: 'none' })
                }
                jQuery(this).parents(".ui-draggable").find('.row-tool').stop(true, true).css({ display: 'none' }).fadeIn(300)
            });
            $element.children("div").find('.row-remove').off('click');
            $element.children("div").find('.row-remove').click(function () {
                jQuery('#md-delrowconfirm').css('max-width', '550px'); jQuery('#md-delrowconfirm').simplemodal(); jQuery('#md-delrowconfirm').data('simplemodal').show();
                $activeRow = jQuery(this).parents('.ui-draggable'); jQuery('#btnDelRowOk').off('click'); jQuery('#btnDelRowOk').on('click', function (e) {
                    jQuery('#md-delrowconfirm').data('simplemodal').hide();
                    $activeRow.fadeOut(400, function () {
                        jQuery("#divToolImg").stop(true, true).fadeOut(0);
                        jQuery("#divToolImgSettings").stop(true, true).fadeOut(0);
                        jQuery("#divRteLink").stop(true, true).fadeOut(0);
                        jQuery("#divFrameLink").stop(true, true).fadeOut(0);
                        $activeRow.remove(); $element.data('contentbuilder').blockChanged();
                        $element.data('contentbuilder').settings.onRender();
                        $element.data('contentbuilder').settings.onChange();
                        saveForUndo()
                    })
                }); jQuery('#btnDelRowCancel').off('click');
                jQuery('#btnDelRowCancel').on('click', function (e) {
                    jQuery('#md-delrowconfirm').data('simplemodal').hide()
                })
            });
            $element.children("div").find('.row-copy').off('click');
            $element.children("div").find('.row-copy').click(function () {
                $activeRow = jQuery(this).parents('.ui-draggable');
                jQuery('#temp-contentbuilder').html($activeRow.html());
                jQuery('#temp-contentbuilder').find('[contenteditable]').removeAttr('contenteditable'); jQuery('#temp-contentbuilder *[class=""]').removeAttr('class');
                jQuery('#temp-contentbuilder *[style=""]').removeAttr('style');
                jQuery('#temp-contentbuilder .ovl').remove();
                jQuery('#temp-contentbuilder .row-tool').remove();
                var html = jQuery('#temp-contentbuilder').html().trim();
                $activeRow.after(html); $element.children("*").each(function () {
                    if (!jQuery(this).hasClass('ui-draggable')) {
                        jQuery(this).wrap("<div class='ui-draggable'></div>")
                    }
                });
                $element.children('.ui-draggable').each(function () {
                    if (jQuery(this).find('.row-tool').length == 0) {
                        jQuery(this).append('<div class="row-tool">' + '<div class="row-handle"><i class="cb-icon-move"></i></div>' + '<div class="row-html"><i class="cb-icon-code"></i></div>' + '<div class="row-copy"><i class="cb-icon-plus"></i></div>' + '<div class="row-remove"><i class="cb-icon-cancel"></i></div>' + '</div>')
                    }
                });
                $element.children('.ui-draggable').each(function () {
                    if (jQuery(this).children('*').length == 1) {
                        jQuery(this).remove()
                    }
                });
                $element.data('contentbuilder').applyBehavior();
                $element.data('contentbuilder').blockChanged();
                $element.data('contentbuilder').settings.onRender();
                $element.data('contentbuilder').settings.onChange();
                saveForUndo()
            });
            $element.children("div").find('.row-html').off('click');
            $element.children("div").find('.row-html').click(function () {
                $activeRow = jQuery(this).parents('.ui-draggable');
                if ($activeRow.find('[data-html]').length > 0) {
                    var $activeModule = $activeRow.find('[data-html]'); jQuery('body').find("[data-html]").removeAttr('data-module-active'); $activeModule.attr('data-module-active', '1'); var moduleName = $activeModule.attr('data-module'); if ($activeModule.attr('data-mode') == 'code') { moduleName = 'code' } if (moduleName == 'code') {
                        jQuery('#infoSource').html($element.data('contentbuilder').settings.snippetCustomCodeMessage); var html = decodeURIComponent($activeModule.attr("data-html")); jQuery('#txtContentCustomCode').val(html); var w = '900px'; jQuery("#md-editcontentcustomcode").css("width", "100%"); jQuery("#md-editcontentcustomcode").css("max-width", w); jQuery("#md-editcontentcustomcode").simplemodal({ isModal: true }); jQuery("#md-editcontentcustomcode").data("simplemodal").show(); if (jQuery('#txtContentCustomCode').data('CodeMirrorInstance')) { var $codeEditor = $('#txtContentCustomCode').data('CodeMirrorInstance'); $codeEditor.setValue(html) } else {
                            var myTextArea = jQuery("#txtContentCustomCode")[0]; if (jQuery('.is-cmloaded').length == 0) {
                                getScripts([sScriptPath + "codemirror/lib/codemirror.js"], function () {
                                    getScripts([sScriptPath + "codemirror/mode/xml/xml.js", sScriptPath + "codemirror/mode/javascript/javascript.js", sScriptPath + "codemirror/mode/css/css.js"], function () {
                                        jQuery('body').addClass('is-cmloaded');
                                        var $codeEditor = CodeMirror.fromTextArea(myTextArea, {
                                            value: html,
                                            mode: "text/html",
                                            lineWrapping: true,
                                            lineNumbers: true,
                                            tabMode: "indent"
                                        });
                                        $codeEditor.on("change", function (cm, change) {
                                            jQuery('#hidContentCustomCode').val(cm.getValue())
                                        });
                                        jQuery('#txtContentCustomCode').data('CodeMirrorInstance', $codeEditor)
                                    })
                                })
                            } else {
                                var $codeEditor = CodeMirror.fromTextArea(myTextArea, {
                                    value: html,
                                    mode: "text/html",
                                    lineWrapping: true,
                                    lineNumbers: true,
                                    tabMode: "indent"
                                });
                                $codeEditor.on("change", function (cm, change) {
                                    jQuery('#hidContentCustomCode').val(cm.getValue())
                                });
                                jQuery('#txtContentCustomCode').data('CodeMirrorInstance', $codeEditor)
                            }
                        }
                        jQuery('#btnContentCustomCodeOk').off('click'); jQuery('#btnContentCustomCodeOk').on('click', function (e) {
                            var $codeEditor = $('#txtContentCustomCode').data('CodeMirrorInstance');
                            jQuery('#hidContentCustomCode').val($codeEditor.getValue());
                            $activeModule.attr('data-html', encodeURIComponent(jQuery('#hidContentCustomCode').val())); $activeModule.html(jQuery('#hidContentCustomCode').val()); jQuery('#md-editcontentcustomcode').data('simplemodal').hide();
                            $element.data('contentbuilder').settings.onChange(); saveForUndo()
                        });
                        jQuery('#btnContentCustomCodeCancel').off('click');
                        jQuery('#btnContentCustomCodeCancel').on('click', function (e) {
                            jQuery('#md-editcontentcustomcode').data('simplemodal').hide()
                        })
                    } else {
                        var moduleDesc = $activeModule.attr('data-module-desc');
                        if (moduleDesc) {
                            jQuery("#md-editcontentmodule").find('.md-title').html(moduleDesc)
                        } else {
                            jQuery("#md-editcontentmodule").find('.md-title').html('Module Settings')
                        }
                        var w = $activeModule.attr('data-dialog-width');
                        if (!w || w == '') { w = '65%' }
                        jQuery("#md-editcontentmodule").css("width", "100%");
                        jQuery("#md-editcontentmodule").css("max-width", w);
                        jQuery("#md-editcontentmodule").simplemodal({ isModal: true });
                        jQuery("#md-editcontentmodule").data("simplemodal").show();
                        jQuery('#ifrContentModulePanel').attr('src', $element.data('contentbuilder').settings.modulePath + moduleName + '.html');
                        jQuery('#btnContentModuleOk').off('click');
                        jQuery('#btnContentModuleOk').on('click', function (e) {
                            $activeModule.attr('data-html', encodeURIComponent(jQuery('#hidContentModuleCode').val())); $activeModule.attr('data-settings', encodeURIComponent(jQuery('#hidContentModuleSettings').val()));
                            $activeModule.html(jQuery('#hidContentModuleCode').val());
                            jQuery('#md-editcontentmodule').data('simplemodal').hide();
                            $element.data('contentbuilder').settings.onChange();
                            saveForUndo()
                        });
                        jQuery('#btnContentModuleCancel').off('click');
                        jQuery('#btnContentModuleCancel').on('click', function (e) {
                            jQuery('#md-editcontentmodule').data('simplemodal').hide()
                        })
                    }
                } else {
                    $activeCol = jQuery(this).parents('.ui-draggable').children('*').not('.row-tool');
                    jQuery('#md-html').css('width', '60%');
                    jQuery('#md-html').simplemodal({ isModal: true });
                    jQuery('#md-html').data('simplemodal').show();
                    jQuery('#temp-contentbuilder').html($activeCol.html());
                    jQuery('#temp-contentbuilder').find('[contenteditable]').removeAttr('contenteditable');
                    jQuery('#temp-contentbuilder *[class=""]').removeAttr('class');
                    jQuery('#temp-contentbuilder *[style=""]').removeAttr('style');
                    jQuery('#temp-contentbuilder .ovl').remove();
                    var html = jQuery('#temp-contentbuilder').html().trim();
                    html = html.replace(/<font/g, '<span').replace(/<\/font/g, '</span');
                    jQuery('#txtHtml').val(html);
                    jQuery("#txtHtml").css('display', 'none');
                    if (jQuery('#txtHtml').data('CodeMirrorInstance')) {
                        var $htmlEditor = $('#txtHtml').data('CodeMirrorInstance');
                        $htmlEditor.setValue(html)
                    } else {
                        var myTextArea = jQuery("#txtHtml")[0];
                        if (jQuery('.is-cmloaded').length == 0) {
                            getScripts([sScriptPath + "codemirror/lib/codemirror.js"], function () {
                                getScripts([sScriptPath + "codemirror/mode/xml/xml.js", sScriptPath + "codemirror/mode/javascript/javascript.js", sScriptPath + "codemirror/mode/css/css.js"], function () { jQuery('body').addClass('is-cmloaded'); var $htmlEditor = CodeMirror.fromTextArea(myTextArea, { value: html, mode: "text/html", lineWrapping: true, lineNumbers: true, tabMode: "indent" }); $htmlEditor.on("change", function (cm, change) { jQuery('#txtHtml').val(cm.getValue()) }); jQuery('#txtHtml').data('CodeMirrorInstance', $htmlEditor) })
                            })
                        } else {
                            var $htmlEditor = CodeMirror.fromTextArea(myTextArea, {
                                value: html,
                                mode: "text/html",
                                lineWrapping: true,
                                lineNumbers: true,
                                tabMode: "indent"
                            });
                            $htmlEditor.on("change", function (cm, change) { jQuery('#txtHtml').val(cm.getValue()) }); jQuery('#txtHtml').data('CodeMirrorInstance', $htmlEditor)
                        }
                    } jQuery('#btnHtmlOk').off('click'); jQuery('#btnHtmlOk').on('click', function (e) { var $htmlEditor = $('#txtHtml').data('CodeMirrorInstance'); jQuery('#txtHtml').val($htmlEditor.getValue()); $activeCol.html(jQuery('#txtHtml').val()); jQuery('#md-html').data('simplemodal').hide(); $element.data('contentbuilder').applyBehavior(); $element.data('contentbuilder').blockChanged(); $element.data('contentbuilder').settings.onRender(); $element.data('contentbuilder').settings.onChange(); saveForUndo() }); jQuery('#btnHtmlCancel').off('click'); jQuery('#btnHtmlCancel').on('click', function (e) { jQuery('#md-html').data('simplemodal').hide() })
                }
            })
        }; this.blockChanged = function () { if ($element.children().length == 0) { $element.addClass('empty') } else { $element.removeClass('empty') } }; this.destroy = function () { if (!$element.data('contentbuilder')) return; var sHTML = $element.data('contentbuilder').html(); $element.html(sHTML); $element.sortable("destroy"); var cbarr = cb_list.split(","), newcbarr = []; for (var i = 0; i < cbarr.length; i++) { if (cbarr[i] != "#" + $element.attr("id")) { newcbarr.push(cbarr[i]) } } cb_list = newcbarr.join(","); for (var i = 0; i < instances.length; i++) { if (jQuery(instances[i]).attr('id') == $element.attr('id')) { instances.splice(i, 1) } } $element.removeClass('connectSortable'); $element.css({ 'min-height': '' }); $element.removeData('contentbuilder'); $element.removeData('contenteditor'); refreshAllObjects() }; this.init()
    }; jQuery.fn.contentbuilder = function (options) { return this.each(function () { if (undefined == jQuery(this).data('contentbuilder')) { var plugin = new jQuery.contentbuilder(this, options); jQuery(this).data('contentbuilder', plugin) } saveForUndo() }) }
})(jQuery);
function refreshAllObjects() {
    try { var cbarr = cb_list.split(","), newcbarr = []; for (var i = 0; i < cbarr.length; i++) { jQuery(cbarr[i]).data('contentbuilder').applyBehavior() } } catch (e) {

    }
}
var ce_toolbarDisplay = 'auto';
var ce_outline = false; var instances = [];
var savedSelPublic; (function (jQuery) {
    var $activeLink;
    var $activeElement;
    var $activeFrame;
    var $activeCell;
    jQuery.contenteditor = function (element, options) {
        var defaults = {
            editable: "h1,h2,h3,h4,h5,h6,p,ul,ol,small,.edit,td", editMode: "default", hasChanged: false, onRender: function () { }, onChange: function () { }, outline: false, fileselect: '', imageselect: '', iconselect: '', onFileSelectClick: function () { }, onImageSelectClick: function () { }, toolbar: 'top', toolbarDisplay: 'auto', buttons: ["bold", "italic", "formatting", "textsettings", "color", "font", "formatPara", "align", "list", "table", "image", "createLink", "unlink", "icon", "tags", "removeFormat", "html"], colors: ["#ffffc5", "#e9d4a7", "#ffd5d5", "#ffd4df", "#c5efff", "#b4fdff", "#c6f5c6", "#fcd1fe", "#ececec", "#f7e97a", "#d09f5e", "#ff8d8d", "#ff80aa", "#63d3ff", "#7eeaed", "#94dd95", "#ef97f3", "#d4d4d4", "#fed229", "#cc7f18", "#ff0e0e", "#fa4273", "#00b8ff", "#0edce2", "#35d037", "#d24fd7", "#888888", "#ff9c26", "#955705", "#c31313", "#f51f58", "#1b83df", "#0bbfc5", "#1aa71b", "#ae19b4", "#333333"], customTags: []
        };
        this.settings = {};
        var $element = jQuery(element),
            element = element;
        this.init = function () {
            this.settings = jQuery.extend({

            }, defaults, options);
            var bUseCustomFileSelect = false;
            if (this.settings.fileselect != '') bUseCustomFileSelect = true;


            var sFunc = (this.settings.onFileSelectClick + '').replace(/\s/g, '');
            if (sFunc != 'function(){}') {
                bUseCustomFileSelect = true
            } var bUseCustomImageSelect = false;
            if (this.settings.imageselect != '') bUseCustomImageSelect = true;
            var sFunc = (this.settings.onImageSelectClick + '').replace(/\s/g, '');
            if (sFunc != 'function(){}') {
                bUseCustomImageSelect = true
            } if (jQuery('#divCb').length == 0) {
                jQuery('body').append('<div id="divCb"></div>')
            } ce_toolbarDisplay = this.settings.toolbarDisplay;
            ce_outline = this.settings.outline; var toolbar_attr = '';
            if (this.settings.toolbar == 'left') toolbar_attr = ' class="rte-side"';
            if (this.settings.toolbar == 'right') toolbar_attr = ' class="rte-side right"';
            var icon_button = '';
            if (this.settings.iconselect != '') icon_button = '<button data-rte-cmd="icon" title="Icon"> <i class="cb-icon-smile"></i> </button>';
            var customtag_button = '';
            if (this.settings.customTags.length > 0) customtag_button = '<button data-rte-cmd="tags" title="Tags"> <i class="cb-icon-ticket"></i> </button>';
            var html_rte = '<div id="rte-toolbar"' + toolbar_attr + '><div class="rte-draggable"><i class="cb-icon-dot"></i></div>';
            for (var j = 0; j < this.settings.buttons.length; j++) {
                var btn = this.settings.buttons[j];
                if (btn == 'bold') html_rte += '<button href="#" data-rte-cmd="bold" title="Bold"> <i class="cb-icon-bold"></i> </button>';
                if (btn == 'italic') html_rte += '<button data-rte-cmd="italic" title="Italic"> <i class="cb-icon-italic"></i> </button>';
                if (btn == 'underline') html_rte += '<button data-rte-cmd="underline" title="Underline"> <i class="cb-icon-underline"></i> </button>';
                if (btn == 'strikethrough') html_rte += '<button data-rte-cmd="strikethrough" title="Strikethrough"> <i class="cb-icon-strike"></i> </button>';
                if (btn == 'formatting') html_rte += '<button data-rte-cmd="formatting" title="Formatting"> <i class="cb-icon-font"></i> </button>';
                if (btn == 'textsettings') html_rte += '<button data-rte-cmd="textsettings" title="Text Settings"> <i class="cb-icon-sliders" style="font-size:16px;line-height: 16px;"></i> </button>';
                if (btn == 'color') html_rte += '<button data-rte-cmd="color" title="Color"> <i class="cb-icon-color"></i> </button>';
                if (btn == 'fontsize') html_rte += '<button data-rte-cmd="fontsize2" title="Font Size"> <i class="cb-icon-fontsize"></i> </button>';
                if (btn == 'removeFormat') html_rte += '<button data-rte-cmd="removeFormat" title="Clean"> <i class="cb-icon-eraser"></i> </button>'; if (btn == 'formatPara') html_rte += '<button data-rte-cmd="formatPara" title="Paragraph"> <i class="cb-icon-header"></i> </button>';
                if (btn == 'font') html_rte += '<button data-rte-cmd="font" title="Font"> <i class="cb-icon-font-family" style="font-size:11px"></i> </button>';
                if (btn == 'align') html_rte += '<button data-rte-cmd="align" title="Alignment"> <i class="cb-icon-align-justify"></i> </button>';
                if (btn == 'list') html_rte += '<button data-rte-cmd="list" title="List"> <i class="cb-icon-list-bullet"></i> </button>';
                if (btn == 'image') html_rte += '<button href="#" data-rte-cmd="image" title="Image"> <i class="cb-icon-picture"></i> </button>'; if (btn == 'createLink') html_rte += '<button data-rte-cmd="createLink" title="Link"> <i class="cb-icon-link"></i> </button>';
                if (btn == 'unlink') html_rte += '<button data-rte-cmd="unlink" title="Remove Link"> <i class="cb-icon-unlink"></i> </button>';
                if (btn == 'table') html_rte += '<button href="#" data-rte-cmd="table" title="table"> <i class="cb-icon-table" style="font-size:14px;line-height:14px;"></i> </button>';
                if (btn == 'icon') html_rte += icon_button;
                if (btn == 'tags') html_rte += customtag_button;
                if (btn == 'html') html_rte += '<button data-rte-cmd="html" title="HTML"> <i class="cb-icon-code"></i> </button>'
            } var html_table = '<table id="tableInsert" class="table-insert" style="border-collapse:collapse;border-radius:5px;overflow:hidden;">'; for (var i = 1; i <= 5; i++) {
                html_table += '<tr>';
                for (var j = 1; j <= 5; j++) {
                    html_table += '<td data-row="' + i + '" data-col="' + j + '">' + i + 'x' + j + '</td>'
                }
                html_table += '</tr>'
            }
            html_table += '</table>';
            html_rte += '</div>' + '' + '<div id="divRteLink">' + '<i class="cb-icon-link"></i> Edit' + '</div>' + '' + '<div id="divFrameLink">' + '<i class="cb-icon-link"></i> Edit' + '</div>' + '' + '<div id="divRteTable">' + '<button id="btnEditTable" title="Edit"><i class="cb-icon-pencil"></i></button>' + '<button id="btnDeleteTable" title="Delete"><i class="cb-icon-cancel"></i></button>' + '</div>' + '' + '<div class="md-modal md-draggable" id="md-createlink">' + '<div class="md-content">' + '<div class="md-body">' + '<div class="md-modal-handle">' + '<i class="cb-icon-dot"></i><i class="cb-icon-cancel md-modal-close"></i>' + '</div>' + '<div class="md-label">Link:</div>' + (bUseCustomFileSelect ? '<input type="text" id="txtLink" class="inptxt" style="float:left;width:60%;" value="http:/' + '/"></input><i class="cb-icon-link md-btnbrowse" id="btnLinkBrowse" style="width:10%;"></i>' : '<input type="text" id="txtLink" class="inptxt" value="http:/' + '/" style="float:left;width:70%"></input>') + '<br style="clear:both">' + '<div class="md-label">Text:</div>' + '<input type="text" id="txtLinkText" class="inptxt" style="float:right;width:70%"></input>' + '<br style="clear:both">' + '<div class="md-label">Title:</div>' + '<input type="text" id="txtLinkTitle" class="inptxt" style="float:right;width:70%"></input>' + '<br style="clear:both">' + '<div class="md-label">Target:</div>' + '<label style="float:left;" for="chkNewWindow" class="inpchk"><input type="checkbox" id="chkNewWindow"></input> New Window</label>' + '<br style="clear:both">' + '</div>' + '<div class="md-footer">' + '<button id="btnLinkOk"> Ok </button>' + '</div>' + '</div>' + '</div>' + '' + '<div class="md-modal md-draggable" id="md-insertimage">' + '<div class="md-content">' + '<div class="md-body">' + '<div class="md-modal-handle">' + '<i class="cb-icon-dot"></i><i class="cb-icon-cancel md-modal-close"></i>' + '</div>' + '<div class="md-browse">' + '<div class="md-drop-area">' + '<input id="fileInsertImage" type="file" accept="image/*" />' + '<div class="drag-text">' + '<p><i class="cb-icon-camera"></i> Drag and drop an image or click to browse.</p>' + '</div>' + '</div>' + '<div class="md-preview-area">' + '<div><img id="imgInsertImagePreview" src="#" alt="your image" /><i class="ion-ios-close-empty"></i></div>' + '</div>' + '</div>' + '<div class="md-label">Or Specify Image Source:</div>' + (bUseCustomImageSelect ? '<input type="text" id="txtImgUrl_rte" class="inptxt" style="float:left;width:60%"></input><i class="cb-icon-link md-btnbrowse" id="btnImageBrowse_rte" style="width:10%;"></i>' : '<input type="text" id="txtImgUrl_rte" class="inptxt" style="float:left;width:70%"></input>') + '<br style="clear:both">' + '</div>' + '<div class="md-footer">' + '<button id="btnImgOk_rte"> Ok </button>' + '</div>' + '</div>' + '</div>' + '' + '<div class="md-modal" id="md-createsrc">' + '<div class="md-content">' + '<div class="md-body">' + '<input type="text" id="txtSrc" class="inptxt" value="http:/' + '/"></input>' + '</div>' + '<div class="md-footer">' + '<button id="btnSrcOk"> Ok </button>' + '</div>' + '</div>' + '</div>' + '' + '<div class="md-modal" id="md-createiframe">' + '<div class="md-content">' + '<div class="md-body">' + '<textarea id="txtIframe" class="inptxt" style="height:350px;"></textarea>' + '</div>' + '<div class="md-footer">' + '<button id="btnIframeOk"> Ok </button>' + '</div>' + '</div>' + '</div>' + '' + '<div class="rte-pop" id="pop-table">' + html_table + '</div>' + '' + '<div class="rte-pop" id="pop-align">' + '<button class="md-pickalign" data-align="left" title="Left"> <i class="cb-icon-align-left"></i> </button>' + '<button class="md-pickalign" data-align="center" title="Center"> <i class="cb-icon-align-center"></i> </button>' + '<button class="md-pickalign" data-align="right" title="Right"> <i class="cb-icon-align-right"></i> </button>' + '<button class="md-pickalign" data-align="justify" title="Full"> <i class="cb-icon-align-justify"></i> </button>' + '</div>' + '' + '<div class="md-modal md-draggable" id="md-edittable">' + '<div class="md-content">' + '<div class="md-body">' + '<div class="md-modal-handle">' + '<i class="cb-icon-dot"></i><i class="cb-icon-cancel md-modal-close"></i>' + '</div>' + '<div class="md-tabs">' + '<span id="tabTableDesign" class="active">Design</span>' + '<span id="tabTableLayout">Layout</span>' + '</div>' + '<div id="divTableDesign" style="overflow-y:auto;overflow-x:hidden;box-sizing:border-box;padding:10px 10px 10px">' + '' + '<div>' + 'Background:<br>' + '<input type="text" id="inpCellBgColor" value=""/>' + '</div>' + '<div>' + 'Text Color:<br>' + '<input type="text" id="inpCellTextColor" value=""/>' + '</div>' + '<div>' + 'Border Thickness:<br>' + '<select id="selCellBorderWidth" style="width:120px;"><option value="0">No Border</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>' + '</div>' + '<div>' + 'Border Color:<br>' + '<input type="text" id="inpCellBorderColor" value=""/>' + '</div>' + '<div>' + 'Apply To:<br>' + '<select id="selTableApplyTo" style="width:120px;">' + '<option value="table">Table</option>' + '<option value="currentrow">Current Row</option>' + '<option value="currentcol">Current Column</option>' + '<option value="evenrows">Even Rows</option>' + '<option value="oddrows">Odd Rows</option>' + '<option value="currentcell">Current Cell</option>' + '</select>' + '</div>' + '' + '</div>' + '<div id="divTableLayout" style="overflow-y:auto;overflow-x:hidden;display:none;box-sizing:border-box;padding:10px 10px 10px">' + '<div>' + 'Insert Row:<br>' + '<button data-rte-cmd="rowabove" title="Insert Row (Above)" style="width:100px;margin-right:5px"> Above </button>' + '<button data-rte-cmd="rowbelow" title="Insert Row (Below)" style="width:100px;"> Below </button>' + '</div>' + '<div>' + 'Insert Column:<br>' + '<button data-rte-cmd="columnleft" title="Insert Column (Left)" style="width:100px;margin-right:5px"> Left </button>' + '<button data-rte-cmd="columnright" title="Insert Column (Right)" style="width:100px;"> Right </button>' + '</div>' + '<div>' + 'Delete:<br>' + '<button data-rte-cmd="delrow" title="Delete Row" style="width:100px;margin-right:5px"> Row </button>' + '<button data-rte-cmd="delcolumn" title="Delete Column" style="width:100px;"> Column </button>' + '</div>' + '<div style="margin-bottom:15px;">' + 'Merge:<br>' + '<button data-rte-cmd="mergecell" title="Merge Cell" style="width:205px"> Merge Cell </button>' + '</div>' + '' + '</div>' + '</div>' + '</div>' + '</div>' + '' + '<div class="md-modal" id="md-deltableconfirm">' + '<div class="md-content">' + '<div class="md-body">' + '<div style="padding:20px 20px 25px;text-align:center;">' + '<p>Are you sure you want to delete this table?</p>' + '<button id="btnDelTableCancel"> CANCEL </button>' + '<button id="btnDelTableOk" style="margin-left:12px"> OK </button>' + '</div>' + '</div>' + '</div>' + '</div>' + '' + '<div class="rte-pop" id="pop-list">' + '<button class="md-picklist half" data-list="indent" title="Indent" style="margin-right:0px"> <i class="cb-icon-indent-right"></i> </button>' + '<button class="md-picklist half" data-list="outdent" title="Outdent"> <i class="cb-icon-indent-left"></i> </button>' + '<button class="md-picklist" data-list="insertUnorderedList" title="Bulleted List"> <i class="cb-icon-list-bullet"></i> </button>' + '<button class="md-picklist" data-list="insertOrderedList" title="Numbered List"> <i class="cb-icon-list-numbered"></i> </button>' + '</div>' + '' + '<div class="rte-pop" id="pop-formatting">' + '<div>' + '<button data-rte-cmd="underline" title="Underline"> <i class="cb-icon-underline"></i> </button>' + '<button data-rte-cmd="strikethrough" title="Strikethrough"> <i class="cb-icon-strike"></i> </button>' + '<button data-rte-cmd="superscript" title="Superscript"> <i class="cb-icon-superscript"></i> </button>' + '<button data-rte-cmd="subscript" title="Subscript"> <i class="cb-icon-subscript"></i> </button>' + '<button data-rte-cmd="uppercase" title="Uppercase"> <i class="cb-icon-uppercase"></i> </button>' + '</div>' + '</div>' + '' + '<div class="rte-pop arrow-left" id="pop-textsettings">' + '<div>' + 'Font Size: <span id="outFontSize"></span><br>' + '<button data-rte-cmd="fontsize" data-val="decrease" class="updown"> - </button>' + '<button data-rte-cmd="fontsize" data-val="increase" class="updown"> + </button>' + '<button data-rte-cmd="fontsize" data-val="clear" class="updown" style="font-size:11px"> <i class="cb-icon-eraser"></i> </button>' + '<br style="clear:both">' + '</div>' + '<div>' + 'Letter Spacing: <span id="outLetterSpacing"></span><br>' + '<button data-rte-cmd="letterspacing" data-val="decrease" class="updown"> - </button>' + '<button data-rte-cmd="letterspacing" data-val="increase" class="updown"> + </button>' + '<button data-rte-cmd="letterspacing" data-val="clear" class="updown" style="font-size:11px"> <i class="cb-icon-eraser"></i> </button>' + '<br style="clear:both">' + '</div>' + '<div>' + 'Line Height: <span id="outLineHeight"></span><br>' + '<button data-rte-cmd="lineheight" data-val="decrease" class="updown"> - </button>' + '<button data-rte-cmd="lineheight" data-val="increase" class="updown"> + </button>' + '<button data-rte-cmd="lineheight" data-val="clear" class="updown" style="font-size:11px"> <i class="cb-icon-eraser"></i> </button>' + '<br style="clear:both">' + '</div>' + '</div>' + '' + '<div class="rte-pop" id="pop-fontfamily">' + '<div>' + '<iframe id="ifrFonts" src="' + sScriptPath + 'blank.html"></iframe>' + '<button class="md-pickfontfamily" data-font-family="" data-provider="" style="display:none"></button>' + '</div>' + '</div>' + '' + '<div class="rte-pop" id="pop-headings">' + '<div>' + '<iframe id="ifrHeadings" src="' + sScriptPath + 'blank.html"></iframe>' + '<button class="md-pickheading" data-font-family="" data-provider="" style="display:none"></button>' + '</div>' + '</div>' + '' + '<div class="rte-pop" id="pop-colors">' + '<div style="margin:8px;">' + '<input type="text" id="inpTextColor"/>' + '<button id="btnTextColorClear" style="margin-left:9px;margin-bottom: 2px;padding:0 12px;width:42px;height:37px;border-radius:4px;"> <i class="cb-icon-eraser"></i> </button>' + '<div style="overflow-x:auto;overflow-y:hidden;width:245px;height:170px">' + '<div class="cust_colors">' + '[COLORS]' + '</div>' + '</div>' + '<div style="width:100%;margin-top:6px;">' + '<select id="selColorApplyTo" style="width:120px;"><option value="1">Text Color</option><option value="2">Background</option><option value="3">Block Background</option></select>' + '</div>' + '<br style="clear:both" />' + '</div>' + '</div>' + '' + '<div class="md-modal md-draggable" id="md-fontsize" style="border-radius:12px">' + '<div class="md-content" style="border-radius:12px">' + '<div class="md-body">' + '<div class="md-modal-handle">' + '<i class="cb-icon-dot"></i><i class="cb-icon-cancel md-modal-close"></i>' + '</div>' + '<iframe id="ifrFontSize" style="width:100%;height:319px;border: none;display: block;" src="' + sScriptPath + 'blank.html"></iframe>' + '<button class="md-pickfontsize" data-font-size="" style="display:none"></button>' + '</div>' + '</div>' + '</div>' + '' + '<div class="md-modal md-draggable" id="md-html">' + '<div class="md-content">' + '<div class="md-body">' + '<div class="md-modal-handle" style="display:none">' + '<i class="cb-icon-dot"></i><i class="cb-icon-cancel md-modal-close"></i>' + '</div>' + '<textarea id="txtHtml" class="inptxt" style="height:450px;"></textarea>' + '</div>' + '<div class="md-footer">' + '<button id="btnHtmlCancel" class="secondary"> Cancel </button>' + '<button id="btnHtmlOk" class="primary"> Ok </button>' + '</div>' + '</div>' + '</div>' + '' + '<div class="md-modal md-draggable" id="md-editcontentmodule">' + '<div class="md-content">' + '<div class="md-modal-handle">' + '<i class="cb-icon-dot"></i><i class="cb-icon-cancel md-modal-close"></i>' + '</div>' + '<div class="md-body">' + '<iframe id="ifrContentModulePanel" style="width:100%;height:500px;display:block;border:none;" src="' + sScriptPath + 'blank.html"></iframe>' + '<input id="hidContentModuleCode" type="hidden" />' + '<input id="hidContentModuleSettings" type="hidden" />' + '</div>' + '<div class="md-footer">' + '<button id="btnContentModuleCancel" class="secondary"> Cancel </button>' + '<button id="btnContentModuleOk" class="primary"> Ok </button>' + '</div>' + '</div>' + '</div>' + '' + '<div class="md-modal md-draggable" id="md-editcontentcustomcode">' + '<div class="md-content">' + '<div class="md-modal-handle"></div>' + '<div class="md-body" style="background: #fff;">' + '<div id="infoSource">IMPORTANT</b>: This is a custom section. Custom javascript code (&lt;script&gt; block) is allowed here but may not always work or compatible with the content builder, so proceed at your own risk. We do not support problems with custom code.</div>' + '<textarea id="txtContentCustomCode" class="inptxt" style="background: #fff;"></textarea>' + '<input id="hidContentCustomCode" type="hidden" />' + '</div>' + '<div class="md-footer">' + '<button id="btnContentCustomCodeCancel" class="secondary"> Cancel </button>' + '<button id="btnContentCustomCodeOk" class="primary"> Ok </button>' + '</div>' + '</div>' + '</div>' + '' + '<div class="md-modal" id="md-fileselect">' + '<div class="md-content">' + '<div class="md-body">' + (bUseCustomFileSelect ? '<iframe id="ifrFileBrowse" style="width:100%;height:400px;border: none;display: block;" src="' + sScriptPath + 'blank.html"></iframe>' : '') + '</div>' + '</div>' + '</div>' + '<input type="hidden" id="active-input" />' + '' + '<div class="md-modal" id="md-delrowconfirm">' + '<div class="md-content">' + '<div class="md-body">' + '<div style="padding:20px 20px 25px;text-align:center;">' + '<p>Are you sure you want to delete this block?</p>' + '<button id="btnDelRowCancel"> CANCEL </button>' + '<button id="btnDelRowOk" style="margin-left:12px"> OK </button>' + '</div>' + '</div>' + '</div>' + '</div>' + '' + '<div class="md-modal md-draggable" id="md-icon-select">' + '<div class="md-content">' + '<div class="md-body md-settings">' + '<div class="md-modal-handle">' + '<i class="cb-icon-dot"></i><i class="cb-icon-cancel md-modal-close"></i>' + '</div>' + '<iframe id="ifrIconSelect" style="width:100%;height:500px;hidden;border:none;float:left;" src="' + sScriptPath + 'blank.html"></iframe>' + '</div>' + '</div>' + '</div>' + '' + '<div class="md-modal md-draggable" id="md-tags-select">' + '<div class="md-content">' + '<div class="md-body md-settings">' + '<div class="md-modal-handle">' + '<i class="cb-icon-dot"></i><i class="cb-icon-cancel md-modal-close"></i>' + '</div>' + '<div id="divCustomTags" style="width:100%;"></div>' + '</div>' + '</div>' + '</div>' + '' + '<div id="temp-contenteditor"></div>' + '';
            var html_colors = '';
            arrC = new Array("#000000", "#3300ff", "#9900ff", "#ff0099", "#cc0099", "#990099", "#990033", "#cc0033", "#ff0033", "|", "#444444", "#3366ff", "#9966ff", "#ff6699", "#cc6699", "#996699", "#996633", "#cc6633", "#ff6633", "|", "#888888", "#3399ff", "#9999ff", "#ff9999", "#cc9999", "#999999", "#999933", "#cc9933", "#ff9933", "|", "#cccccc", "#33ccff", "#99ccff", "#ffcc99", "#cccc99", "#99cc99", "#99cc33", "#cccc33", "#ffcc33", "|", "#ffffff", "#33ffff", "#99ffff", "#ffff99", "#ccff99", "#99ff99", "#99ff33", "#ccff33", "#ffff33");
            html_colors += '<div style="clear:both;height:30px;">';
            for (var i = 0; i < arrC.length; i++) {
                if (arrC[i] != '|') {
                    var whitecell = '';
                    if (arrC[i] == '#ffffff' && i == 98) whitecell = '';
                    html_colors += '<button class="md-pick" style="background:' + arrC[i] + whitecell + ';"></button>'
                } else {
                    html_colors += '</div><div style="clear:both;height:30px;">'
                }
            }
            html_colors += '</div>';
            html_rte = html_rte.replace('[COLORS]', html_colors);
            if (jQuery('#rte-toolbar').length == 0) { jQuery('#divCb').append(html_rte); this.prepareRteCommand('superscript'); this.prepareRteCommand('subscript'); this.prepareRteCommand('undo'); this.prepareRteCommand('redo'); jQuery('#rte-toolbar').draggable({ cursor: "move", handle: ".rte-draggable", start: function (event, ui) { jQuery('.rte-pop').css('display', 'none') } }); if (this.settings.toolbar == 'left') { } else if (this.settings.toolbar == 'right') { jQuery('.rte-pop').addClass('arrow-right') } else { jQuery('.rte-pop').addClass('arrow-top') } } var isCtrl = false; $element.on('keyup', function (e) { $element.data('contenteditor').realtime() }); $element.on('mouseup', function (e) { $element.data('contenteditor').realtime() }); jQuery(document).on("paste", '#' + $element.attr('id'), function (e) { pasteContent($activeElement) }); $element.on('keydown', function (e) {
                if (e.which == 46 || e.which == 8) {
                    var el; try {
                        if (window.getSelection) {
                            el = window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode
                        } else if (document.selection) { el = document.selection.createRange().parentElement() } if (el.nodeName.toLowerCase() == 'p') { var t = ''; if (window.getSelection) { t = window.getSelection().toString() } else if (document.getSelection) { t = document.getSelection().toString() } else if (document.selection) { t = document.selection.createRange().text } if (t == el.innerText) { jQuery(el).html('<br>'); return false } }
                    } catch (e) { }
                } if (e.which == 17) { isCtrl = true; return } if ((e.which == 86 && isCtrl == true) || (e.which == 86 && e.metaKey)) { pasteContent($activeElement) } if (e.ctrlKey) { if (e.keyCode == 65 || e.keyCode == 97) { e.preventDefault(); var is_ie = detectIE(); var el; try { if (window.getSelection) { el = window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode } else if (document.selection) { el = document.selection.createRange().parentElement() } } catch (e) { return } if (is_ie) { var range = document.body.createTextRange(); range.moveToElementText(el); range.select() } else { var range = document.createRange(); range.selectNodeContents(el); var oSel = window.getSelection(); oSel.removeAllRanges(); oSel.addRange(range) } } }
            }).keyup(function (e) {
                if (e.which == 17) { isCtrl = false } $element.find('[style]').each(function () {
                    if (jQuery(this).attr('style').indexOf('font-size') != -1) {
                        if (jQuery(this).css('font-size') == jQuery(this).parent().css('font-size')) {
                            jQuery(this).css('font-size', '')
                        }
                    } if (jQuery(this).attr('style').indexOf('line-height') != -1) {
                        if (jQuery(this).css('line-height') == jQuery(this).parent().css('line-height')) {
                            jQuery(this).css('line-height', '')
                        }
                    }
                })
            });
            jQuery(document).on('mousedown', function (event) {
                var $active_element;
                if (jQuery(event.target).parents(".ui-draggable").length > 0) {
                    if (jQuery(event.target).parents(".ui-draggable").parent().data('contentbuilder')) {
                        $active_element = jQuery(event.target).parents(".ui-draggable").parent()
                    }
                }
                var bEditable = false;
                if (jQuery('#rte-toolbar').css('display') == 'none') return;
                var el = jQuery(event.target).prop("tagName").toLowerCase();
                jQuery(event.target).parents().each(function (e) {
                    if (jQuery(this).is('[contenteditable]') || jQuery(this).hasClass('md-modal') || jQuery(this).hasClass('cp-color-picker') || jQuery(this).attr('id') == 'divCb') {
                        bEditable = true;
                        return
                    }
                });
                if (jQuery(event.target).is('[contenteditable]')) {
                    bEditable = true;
                    return
                }
                if (!bEditable) {
                    $activeElement = null;
                    if (ce_toolbarDisplay == 'auto') {
                        try {
                            var el; if (window.getSelection) {
                                el = window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode
                            }
                            else if (document.selection) {
                                el = document.selection.createRange().parentElement()
                            }
                            var found = false;
                            jQuery(el).parents().each(function () {
                                if (jQuery(this).data('contentbuilder')) {
                                    found = true
                                }
                            });
                            if (!found) jQuery('#rte-toolbar').css('display', 'none');
                            ce_closePop()
                        } catch (e) {

                        }
                    } if (ce_outline) {
                        for (var i = 0; i < instances.length; i++) {
                            jQuery(instances[i]).css('outline', '');
                            jQuery(instances[i]).find('*').css('outline', '')
                        }
                    } jQuery('.row-tool').stop(true, true).fadeOut(0);
                    jQuery(".ui-draggable").removeClass('ui-dragbox-outlined');
                    jQuery('#rte-toolbar').css('display', 'none');
                    ce_closePop(); jQuery("#divRteTable").stop(true, true).fadeOut(0);
                    if (jQuery("#md-edittable").data("simplemodal")) jQuery("#md-edittable").data("simplemodal").hide();
                    if (jQuery("#md-createlink").data("simplemodal")) jQuery("#md-createlink").data("simplemodal").hide();
                    if ($activeLink)
                        if ($activeLink.attr('href') == 'http://') $activeLink.replaceWith($activeLink.html());
                    if (jQuery("#md-insertimage").data("simplemodal")) jQuery("#md-insertimage").data("simplemodal").hide();
                    if (jQuery("#md-img").data("simplemodal")) jQuery("#md-img").data("simplemodal").hide();
                    if (jQuery("#md-createsrc").data("simplemodal")) jQuery("#md-createsrc").data("simplemodal").hide();
                    if (jQuery("#md-createiframe").data("simplemodal")) jQuery("#md-createiframe").data("simplemodal").hide();
                    if (jQuery("#md-icon-select").data("simplemodal")) jQuery("#md-icon-select").data("simplemodal").hide();
                    if (jQuery("#md-tags-select").data("simplemodal")) jQuery("#md-tags-select").data("simplemodal").hide()
                }
            });
            $element.on('focus', function () {
                var $this = $(this);
                $this.data('before', $this.html());
                return $this
            }).on('keyup', function () {
                var $this = $(this);
                if ($this.data('before') !== $this.html()) {
                    $this.data('before', $this.html());
                    $element.data('contenteditor').settings.onChange();
                    saveForUndo()
                } return $this
            })
        }; this.contentRender = function () {
            this.settings = jQuery.extend({}, defaults, options);
            var iconselect = this.settings.iconselect;
            if (iconselect != '') {
                $element.find('.ui-draggable > div:first-child i').each(function () {
                    if (jQuery(this).parents("[data-html]").length > 0)
                        return;
                    if (jQuery(this).parents("[data-mode='readonly']").length > 0) return;
                    if (jQuery(this).parents("[data-mode='readonly-protected']").length > 0) return; if (jQuery(this).html() == '') {
                        jQuery(this).off('click');
                        jQuery(this).click(function () {
                            $activeIcon = jQuery(this);
                            if (jQuery('#ifrIconSelect').attr('src').indexOf('blank.html') != -1) {
                                jQuery('#ifrIconSelect').attr('src', iconselect)
                            }
                            jQuery('#md-icon-select').css('max-width', '775px');
                            jQuery('#md-icon-select').simplemodal({
                                noOverlay: true
                            });
                            jQuery('#md-icon-select').data('simplemodal').show();
                            $element.data('contenteditor').closePop()
                        })
                    }
                })
            }
        };
        this.realtime = function () {
            var is_ie = detectIE();
            var el;
            var curr;
            try {
                var el;
                if (window.getSelection) {
                    curr = window.getSelection().getRangeAt(0).commonAncestorContainer;
                    el = curr.parentNode
                }
                else if (document.selection) {
                    curr = document.selection.createRange();
                    el = curr.parentElement()
                }
            } catch (e) {
                return
            }
            if (jQuery(el).parents("[data-html]").length > 0) return;
            if (jQuery(el).parents("[data-mode='readonly']").length > 0) return;
            if (jQuery(el).parents("[data-mode='readonly-protected']").length > 0) return;
            if (el.nodeName.toLowerCase() == 'a') {
                if (is_ie) {

                } else {

                }
                if (jQuery('#md-createlink').css('display') != 'block') jQuery("#divRteLink").addClass('forceshow')
            }
            else {
                jQuery("#divRteLink").removeClass('forceshow')
            }
            if (curr) {
                if (jQuery(curr).is('[contenteditable]')) {
                    jQuery("#rte-toolbar").stop(true, true).fadeIn(200)
                }
            }
            if (jQuery(el).is('[contenteditable]')) {
                jQuery("#rte-toolbar").stop(true, true).fadeIn(200)
            }
            if (jQuery(el).parents('[contenteditable]').length > 0) {
                jQuery("#rte-toolbar").stop(true, true).fadeIn(200)
            } $element.data('contenteditor').closePop();
            var editable = $element.data('contenteditor').settings.editable;
            if (editable == '') {

            } else {
                $element.find(editable).off('mousedown');
                $element.find(editable).on('mousedown', function (e) {
                    $activeElement = jQuery(this);
                    jQuery("#rte-toolbar").stop(true, true).fadeIn(200);
                    if (ce_outline) {
                        for (var i = 0; i < instances.length; i++) {
                            jQuery(instances[i]).css('outline', '');
                            jQuery(instances[i]).find('*').css('outline', '')
                        }
                        jQuery(this).css('outline', 'rgba(0, 0, 0, 0.43) dashed 1px')
                    }
                }); $element.find('.edit').find(editable).removeAttr('contenteditable')
            }
            if (jQuery(el).parents("table").length > 0) {
                var $table = jQuery(el).parents("table").first();
                var _top = $table.offset().top - 30;
                var _left = $table.offset().left + $table.width() - parseInt(jQuery("#divRteTable").css("width"));
                jQuery("#divRteTable").css("top", _top + "px");
                jQuery("#divRteTable").css("left", _left + "px");
                if (jQuery("#divRteTable").css('display') == 'none')
                    jQuery("#divRteTable").stop(true, true).css({
                        display: 'none'
                    }).fadeIn(20)
            }
            else {
                jQuery("#divRteTable").stop(true, true).fadeOut(0)
            }
            savedSelPublic = saveSelection();
            $activeIcon = null;
            if (jQuery(curr).prop("tagName")) {
                if (jQuery(el).parents('[contenteditable]').length > 0) {
                    var sTagName = jQuery(curr).prop("tagName").toLowerCase();
                    if (sTagName == 'td' || sTagName == 'th') { $activeCell = jQuery(curr) } else if (jQuery(curr).parents('td,th').length > 0) { $activeCell = jQuery(curr).parents('td,th').first() } else { $activeCell = null; if (jQuery("#md-edittable").data("simplemodal")) jQuery("#md-edittable").data("simplemodal").hide() }
                }
            } else { if (jQuery(curr).parents('td,th').length > 0) { $activeCell = jQuery(curr).parents('td,th').first() } else { $activeCell = null; if (jQuery("#md-edittable").data("simplemodal")) jQuery("#md-edittable").data("simplemodal").hide() } } if (jQuery("#md-createlink").data("simplemodal")) jQuery("#md-createlink").data("simplemodal").hide();
            if ($activeLink) if ($activeLink.attr('href') == 'http://') $activeLink.replaceWith($activeLink.html());
            if (jQuery("#md-img").data("simplemodal")) jQuery("#md-img").data("simplemodal").hide();
            if (jQuery("#md-createsrc").data("simplemodal")) jQuery("#md-createsrc").data("simplemodal").hide();
            if (jQuery("#md-createiframe").data("simplemodal")) jQuery("#md-createiframe").data("simplemodal").hide();
            var $active_element;
            if (jQuery(el).parents(".ui-draggable").length > 0) {
                if (jQuery(el).parents(".ui-draggable").parent().data('contentbuilder')) {
                    $active_element = jQuery(el).parents(".ui-draggable").parent()
                }
            }
            if ($active_element) {
                var cb_snippetPageSliding = $active_element.data('contentbuilder').settings.snippetPageSliding; var $window = jQuery(window); var windowsize = $window.width(); var toolwidth = 255;
                if (windowsize < 600) {
                    toolwidth = 150
                }
                if ($active_element.data('contentbuilder').settings.snippetTool == 'right') {
                    if (cb_snippetPageSliding || ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)))) {
                        if (parseInt(jQuery('#divTool').css('right')) == 0) {
                            jQuery('#divTool').animate({ right: '-=' + toolwidth + 'px' }, 200); jQuery('body').animate({ marginRight: '-=' + toolwidth + 'px' }, 250); jQuery('#rte-toolbar').animate({ paddingRight: '-=' + toolwidth + 'px' }, 250); jQuery('#lnkToolOpen i').attr('class', 'cb-icon-left-open-big'); jQuery('#divSnippetScrollUp').fadeOut(300); jQuery('#divSnippetScrollDown').fadeOut(300)
                        }
                    } else {
                        if (parseInt(jQuery('#divTool').css('right')) == 0) {
                            jQuery('#divTool').animate({ right: '-=' + toolwidth + 'px' }, 200);
                            jQuery('#lnkToolOpen i').attr('class', 'cb-icon-left-open-big');
                            jQuery('#divSnippetScrollUp').css('display', 'none');
                            jQuery('#divSnippetScrollDown').css('display', 'none')
                        }
                    }
                } else {
                    if (cb_snippetPageSliding || ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)))) {
                        if (parseInt(jQuery('#divTool').css('left')) == 0) {
                            jQuery('#divTool').animate({ left: '-=' + (toolwidth + 0) + 'px' }, 200); jQuery('body').animate({ marginLeft: '-=' + toolwidth + 'px' }, 250); jQuery('#rte-toolbar').animate({ paddingLeft: '-=' + toolwidth + 'px' }, 250); jQuery("#lnkToolOpen i").attr('class', 'cb-icon-right-open-big'); jQuery('#divSnippetScrollUp').fadeOut(300); jQuery('#divSnippetScrollDown').fadeOut(300)
                        }
                    } else {
                        if (parseInt(jQuery('#divTool').css('left')) == 0) {
                            jQuery('#divTool').animate({ left: '-=' + (toolwidth + 0) + 'px' }, 200); jQuery("#lnkToolOpen i").attr('class', 'cb-icon-right-open-big'); jQuery('#divSnippetScrollUp').css('display', 'none');
                            jQuery('#divSnippetScrollDown').css('display', 'none')
                        }
                    }
                }
            } $element.data('contenteditor').getState()
        }; this.getState = function () {
            if (document.queryCommandState("bold")) {
                jQuery('[data-rte-cmd=bold]').addClass('on')
            }
            else {
                jQuery('[data-rte-cmd=bold]').removeClass('on')
            } if (document.queryCommandState("italic")) {
                jQuery('[data-rte-cmd=italic]').addClass('on')
            } else {
                jQuery('[data-rte-cmd=italic]').removeClass('on')
            }
            if (document.queryCommandState("underline")) { jQuery('[data-rte-cmd=underline]').addClass('on') }
            else {
                jQuery('[data-rte-cmd=underline]').removeClass('on')
            }
            if (document.queryCommandState("strikethrough")) { jQuery('[data-rte-cmd=strikethrough]').addClass('on') }
            else { jQuery('[data-rte-cmd=strikethrough]').removeClass('on') }
            if (document.queryCommandState("superscript")) { jQuery('[data-rte-cmd=superscript]').addClass('on') } else { jQuery('[data-rte-cmd=superscript]').removeClass('on') } if (document.queryCommandState("subscript")) { jQuery('[data-rte-cmd=subscript]').addClass('on') } else { jQuery('[data-rte-cmd=subscript]').removeClass('on') } if (document.queryCommandState("JustifyFull")) { jQuery('[data-align=justify]').addClass('on') } else { jQuery('[data-align=justify]').removeClass('on') } if (document.queryCommandState("JustifyLeft")) { jQuery('[data-align=left]').addClass('on') } else { jQuery('[data-align=left]').removeClass('on') } if (document.queryCommandState("JustifyRight")) { jQuery('[data-align=right]').addClass('on') } else { jQuery('[data-align=right]').removeClass('on') } if (document.queryCommandState("JustifyCenter")) { jQuery('[data-align=center]').addClass('on') } else { jQuery('[data-align=center]').removeClass('on') } var s = document.queryCommandValue("FontName"); var fontname = s.split(',')[0]; fontname = fontname.replace('"', '').replace('"', ''); fontname = jQuery.trim(fontname).toLowerCase(); if (jQuery('#ifrFonts').attr('src').indexOf('fonts.html') == -1) { jQuery('#ifrFonts').attr('src', sScriptPath + 'fonts.html?1') } jQuery('#ifrFonts').contents().find('[data-font-family]').removeClass('on'); jQuery('#ifrFonts').contents().find('[data-font-family]').each(function () { var f = jQuery(this).attr('data-font-family'); f = f.split(',')[0]; f = jQuery.trim(f).toLowerCase(); if (f == fontname && f != '') { jQuery(this).addClass('on') } }); var block = document.queryCommandValue("FormatBlock"); block = block.toLowerCase(); if (block == 'normal') block = 'p'; if (block == 'heading 1') block = 'h1'; if (block == 'heading 2') block = 'h2'; if (block == 'heading 3') block = 'h3'; if (block == 'heading 4') block = 'h4'; if (block == 'heading 5') block = 'h5'; if (block == 'heading 6') block = 'h6'; if (block == 'formatted') block = 'pre'; if (jQuery('#ifrHeadings').attr('src').indexOf('headings.html') == -1) { jQuery('#ifrHeadings').attr('src', sScriptPath + 'headings.html?1') } jQuery('#ifrHeadings').contents().find('[data-heading]').removeClass('on'); jQuery('#ifrHeadings').contents().find('[data-heading]').each(function () { var p = jQuery(this).attr('data-heading'); if (p == block && block != '') { jQuery(this).addClass('on') } }); var el; var curr; if (window.getSelection) { curr = window.getSelection().getRangeAt(0).commonAncestorContainer; if (curr.nodeType == 3) { el = curr.parentNode } else { el = curr } } else if (document.selection) { curr = document.selection.createRange(); el = document.selection.createRange().parentElement() } if (jQuery(el).css('text-transform') == 'uppercase') { jQuery('[data-rte-cmd=uppercase]').addClass('on') } else { jQuery('[data-rte-cmd=uppercase]').removeClass('on') }
        }; this.closePop = function () {
            jQuery('.rte-pop').css('display', 'none'); jQuery('[data-rte-cmd="formatting"]').removeClass('on'); jQuery('[data-rte-cmd="textsettings"]').removeClass('on'); jQuery('[data-rte-cmd="color"]').removeClass('on'); jQuery('[data-rte-cmd="font"]').removeClass('on'); jQuery('[data-rte-cmd="formatPara"]').removeClass('on'); jQuery('[data-rte-cmd="align"]').removeClass('on'); jQuery('[data-rte-cmd="list"]').removeClass('on'); jQuery('[data-rte-cmd="table"]').removeClass('on')
        };
        this.render = function () {
            var editable = $element.data('contenteditor').settings.editable;
            if (editable == '') {
                $element.attr('contenteditable', 'true'); $element.off('mousedown'); $element.on('mousedown', function (e) {
                    $activeElement = jQuery(this);
                    jQuery("#rte-toolbar").stop(true, true).fadeIn(200);
                    if (ce_outline) {
                        for (var i = 0; i < instances.length; i++) {
                            jQuery(instances[i]).css('outline', '');
                            jQuery(instances[i]).find('*').css('outline', '')
                        }
                        jQuery(this).css('outline', 'rgba(0, 0, 0, 0.43) dashed 1px')
                    }
                })
            }
            else {
                $element.find(editable).each(function () {
                    var editMode = $element.data('contenteditor').settings.editMode; if (editMode == 'default') {
                        if (jQuery(this).parents("[data-html]").length > 0) {
                            if (jQuery(this).hasClass('edit')) {
                                jQuery(this).attr('contenteditable', 'true')
                            }
                        }
                    }
                    else {
                        if (jQuery(this).parents("[data-html]").length > 0) return;
                        if (jQuery(this).parents("[data-mode='readonly']").length > 0) return;
                        if (jQuery(this).parents("[data-mode='readonly-protected']").length > 0) return; var attr = jQuery(this).attr('contenteditable');
                        if (typeof attr !== typeof undefined && attr !== false) {

                        }
                        else {
                            jQuery(this).attr('contenteditable', 'true')
                        }
                    }
                });
                $element.find(editable).off('mousedown');
                $element.find(editable).on('mousedown', function (e) {
                    $activeElement = jQuery(this);
                    if (ce_outline) {
                        for (var i = 0; i < instances.length; i++) {
                            jQuery(instances[i]).css('outline', '');
                            jQuery(instances[i]).find('*').css('outline', '')
                        }
                        jQuery(this).css('outline', 'rgba(0, 0, 0, 0.43) dashed 1px')
                    }
                });
                $element.find('.edit').find(editable).removeAttr('contenteditable')
            }
            $element.find('.is-btn').attr('contenteditable', 'false');
            $element.find('.is-btn').each(function () {
                jQuery(this).focus(function () {
                    jQuery(this).blur()
                })
            });
            var editMode = $element.data('contenteditor').settings.editMode;
            if (editMode == 'default') {
                $element.find("h1,h2,h3,h4,h5,h6").off('keydown');
                $element.find("h1,h2,h3,h4,h5,h6").on('keydown', function (e) {
                    if (e.keyCode == 13) {
                        var is_ie = detectIE();
                        if (is_ie && is_ie <= 10) {
                            var oSel = document.selection.createRange();
                            if (oSel.parentElement) {
                                oSel.pasteHTML('<br>');
                                e.cancelBubble = true;
                                e.returnValue = false; oSel.select();
                                oSel.moveEnd("character", 1);
                                oSel.moveStart("character", 1);
                                oSel.collapse(false); return false
                            }
                        } else {
                            var oSel = window.getSelection();
                            var range = oSel.getRangeAt(0);
                            range.extractContents();
                            range.collapse(true);
                            var docFrag = range.createContextualFragment('<br>');
                            var lastNode = docFrag.lastChild; range.insertNode(docFrag); range.setStartAfter(lastNode); range.setEndAfter(lastNode);
                            if (range.endContainer.nodeType == 1) {
                                if (range.endOffset == range.endContainer.childNodes.length - 1) {
                                    range.insertNode(range.createContextualFragment("<br />")); range.setStartAfter(lastNode);
                                    range.setEndAfter(lastNode)
                                }
                            }
                            var comCon = range.commonAncestorContainer;
                            if (comCon && comCon.parentNode) {
                                try {
                                    comCon.parentNode.normalize()
                                } catch (e) {

                                }
                            }
                            oSel.removeAllRanges();
                            oSel.addRange(range);
                            return false
                        }
                    }
                });
                $element.children('div.ui-draggable').each(function () {

                    try {
                        var attr = jQuery(this).children().first().children().first().attr('data-html');
                        if (typeof attr !== typeof undefined && attr !== false) {
                            return
                        }
                        if (jQuery(this).children().first().children().first().parents("[data-html]").length > 0) return;
                        if (jQuery(this).children().first().children().first().parents("[data-mode='readonly']").length > 0) return;
                        if (jQuery(this).children().first().children().first().parents("[data-mode='readonly-protected']").length > 0) return
                    } catch (e) { } var bEmailMode = false;
                    try {
                        if (
                            jQuery(this).children().first().children().first().prop("tagName").toLowerCase() == 'table') bEmailMode = true
                    } catch (e) { } if (bEmailMode) {
                        jQuery(this).find('td,th').each(function () {
                            if (jQuery(this).children().length == 1) {
                                if (jQuery(this).children().first().prop("tagName").toLowerCase() == 'table') {

                                } else {
                                    jQuery(this).attr('contenteditable', true)
                                }
                            } else {
                                jQuery(this).attr('contenteditable', true)
                            }
                        })
                    } else {
                        jQuery(this).children().first().children().each(function () {
                            jQuery(this).attr('contenteditable', true)
                        })
                    } var is_ie = detectIE(); var is_edge = detectEdge(); if ((is_ie && is_ie <= 11) || is_edge) {
                        try {
                            if (jQuery(this).children().first().children().first().prop("tagName").toLowerCase() == 'table') {
                                jQuery(this).children().first().attr('contenteditable', true)
                            }
                        } catch (e) {

                        }
                    }
                });
                $element.find("div").off('keyup');
                $element.find("div").on('keyup', function (e) {
                    var el; var curr;
                    try {
                        if (window.getSelection) {
                            curr = window.getSelection().getRangeAt(0).commonAncestorContainer;
                            el = window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode
                        }
                        else if (document.selection) {
                            curr = document.selection.createRange();
                            el = document.selection.createRange().parentElement()
                        }
                    } catch (e) {
                        return
                    }
                    if (e.keyCode == 13 && !e.shiftKey) {
                        var is_ie = detectIE(); if (is_ie > 0) {

                        } else {
                            var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor); var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
                            var isOpera = window.opera; var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                            if (isChrome || isOpera) {
                                if (jQuery(el).prop("tagName").toLowerCase() == 'p' || jQuery(el).prop("tagName").toLowerCase() == 'div') { document.execCommand('formatBlock', false, '<p>') }
                            }
                            if (isFirefox) { if (!jQuery(curr).html()) document.execCommand('formatBlock', false, '<p>') }
                        }
                    }
                }); $element.find("div").off('keydown'); $element.find("div").on('keydown', function (e) {
                    var el;
                    var curr;
                    try {
                        if (window.getSelection) {
                            curr = window.getSelection().getRangeAt(0).commonAncestorContainer;
                            el = window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode
                        } else if (document.selection) {
                            curr = document.selection.createRange();
                            el = document.selection.createRange().parentElement()
                        }
                    } catch (e) { return }
                    if (e.keyCode == 8 || e.keyCode == 46) {
                        if (jQuery(curr).html()) {
                            var currTag = jQuery(curr).prop("tagName").toLowerCase(); if (currTag == 'h1' || currTag == 'h1' || currTag == 'h2' || currTag == 'h3' || currTag == 'h4' || currTag == 'h5' || currTag == 'h6' || currTag == 'p') {
                                if (jQuery(curr).text() == '') { document.execCommand('removeFormat', false, null); jQuery(curr).remove(); var oSel = window.getSelection(); var range = oSel.getRangeAt(0); range.extractContents(); range.collapse(true); oSel.removeAllRanges(); oSel.addRange(range); e.preventDefault(); e.stopImmediatePropagation() }
                            }
                        }
                    }
                })
            } else {
                $element.find("p").off('keydown'); $element.find("p").on('keydown', function (e) {
                    if (e.keyCode == 13 && $element.find("li").length == 0) {
                        var UA = navigator.userAgent.toLowerCase();
                        var LiveEditor_isIE = (UA.indexOf('msie') >= 0) ? true : false;
                        if (LiveEditor_isIE) {
                            var oSel = document.selection.createRange();
                            if (oSel.parentElement) {
                                oSel.pasteHTML('<br>');
                                e.cancelBubble = true;
                                e.returnValue = false;
                                oSel.select();
                                oSel.moveEnd("character", 1);
                                oSel.moveStart("character", 1);
                                oSel.collapse(false);
                                return false
                            }
                        } else {
                            var oSel = window.getSelection();
                            var range = oSel.getRangeAt(0);
                            range.extractContents();
                            range.collapse(true);
                            var docFrag = range.createContextualFragment('<br>');
                            var lastNode = docFrag.lastChild;
                            range.insertNode(docFrag);
                            range.setStartAfter(lastNode);
                            range.setEndAfter(lastNode);
                            if (range.endContainer.nodeType == 1) {
                                if (range.endOffset == range.endContainer.childNodes.length - 1) {
                                    range.insertNode(range.createContextualFragment("<br />")); range.setStartAfter(lastNode);
                                    range.setEndAfter(lastNode)
                                }
                            }
                            var comCon = range.commonAncestorContainer;
                            if (comCon && comCon.parentNode) {
                                try {
                                    comCon.parentNode.normalize()
                                } catch (e) {

                                }
                            }
                            oSel.removeAllRanges();
                            oSel.addRange(range);
                            return false
                        }
                    }
                })
            }
            jQuery('[data-rte-cmd="fontsize"]').off('click'); jQuery('[data-rte-cmd="fontsize"]').click(function () {
                if (savedSelPublic) {
                    restoreSelection(savedSelPublic);
                    var el; var curr;
                    if (window.getSelection) {
                        curr = window.getSelection().getRangeAt(0).commonAncestorContainer;
                        if (curr.nodeType == 3) {
                            el = curr.parentNode
                        } else { el = curr }
                    }
                    else if (document.selection) {
                        curr = document.selection.createRange();
                        el = document.selection.createRange().parentElement()
                    } if (jQuery(el).attr('contenteditable') != 'true') {
                        if (jQuery(el).parents('[contenteditable]').length == 0) { return }
                    } if (jQuery(this).attr('data-val') != 'clear') {
                        var value = parseInt(jQuery(el).css('font-size')); if (jQuery(this).attr('data-val') == 'increase') { value = value + 1 }
                        if (jQuery(this).attr('data-val') == 'decrease') { value = value - 1 } var s = value + 'px'; var text = getSelected(); if (jQuery.trim(text) != '' && jQuery(el).text() != text) { document.execCommand("fontSize", false, "7"); var fontElements = document.getElementsByTagName("font"); for (var i = 0, len = fontElements.length; i < len; ++i) { if (fontElements[i].size == "7") { fontElements[i].removeAttribute("size"); fontElements[i].style.fontSize = s } } savedSelPublic = saveSelection() } else if (jQuery(el).text() == text) { if (jQuery(el).html()) { jQuery(el).css('font-size', s) } else { jQuery(el).parent().css('font-size', s) } } else { jQuery(el).css('font-size', s) }; jQuery('#outFontSize').html(s)
                    } else {
                        jQuery(el).css('font-size', ''); var el; var curr; if (window.getSelection) { curr = window.getSelection().getRangeAt(0).commonAncestorContainer; if (curr.nodeType == 3) { el = curr.parentNode } else { el = curr } } else if (document.selection) { curr = document.selection.createRange(); el = document.selection.createRange().parentElement() } var currentFontSize = parseInt(jQuery(el).css('font-size')); jQuery('#outFontSize').html(currentFontSize + 'px');
                        jQuery('#outFontSize').attr('data-initial-value', currentFontSize)
                    } saveForUndo(); $element.data('contenteditor').settings.hasChanged = true; $element.data('contenteditor').settings.onChange()
                }
            }); jQuery('[data-rte-cmd="letterspacing"]').off('click'); jQuery('[data-rte-cmd="letterspacing"]').click(function () { if (savedSelPublic) { restoreSelection(savedSelPublic); var el; var curr; if (window.getSelection) { curr = window.getSelection().getRangeAt(0).commonAncestorContainer; if (curr.nodeType == 3) { el = curr.parentNode } else { el = curr } } else if (document.selection) { curr = document.selection.createRange(); el = document.selection.createRange().parentElement() } if (jQuery(el).attr('contenteditable') != 'true') { if (jQuery(el).parents('[contenteditable]').length == 0) { return } } if (jQuery(this).attr('data-val') != 'clear') { var value = parseInt(jQuery(el).css('letter-spacing')); if (jQuery(this).attr('data-val') == 'increase') { value = value + 1 } if (jQuery(this).attr('data-val') == 'decrease') { value = value - 1 } jQuery(el).css('letter-spacing', value + 'px'); jQuery('#outLetterSpacing').html(value + 'px') } else { jQuery(el).css('letter-spacing', ''); var el; var curr; if (window.getSelection) { curr = window.getSelection().getRangeAt(0).commonAncestorContainer; if (curr.nodeType == 3) { el = curr.parentNode } else { el = curr } } else if (document.selection) { curr = document.selection.createRange(); el = document.selection.createRange().parentElement() } var currentLetterSpacing = parseInt(jQuery(el).css('letter-spacing')); jQuery('#outLetterSpacing').html(currentLetterSpacing + 'px'); jQuery('#outLetterSpacing').attr('data-initial-value', currentLetterSpacing) } saveForUndo(); $element.data('contenteditor').settings.hasChanged = true; $element.data('contenteditor').settings.onChange() } }); jQuery('[data-rte-cmd="lineheight"]').off('click'); jQuery('[data-rte-cmd="lineheight"]').click(function () { if (savedSelPublic) { restoreSelection(savedSelPublic); var el; var curr; if (window.getSelection) { curr = window.getSelection().getRangeAt(0).commonAncestorContainer; if (curr.nodeType == 3) { el = curr.parentNode } else { el = curr } } else if (document.selection) { curr = document.selection.createRange(); el = document.selection.createRange().parentElement() } if (jQuery(el).attr('contenteditable') != 'true') { if (jQuery(el).parents('[contenteditable]').length == 0) { return } } if (jQuery(this).attr('data-val') != 'clear') { var value = parseInt(jQuery(el).css('line-height')); if (jQuery(this).attr('data-val') == 'increase') { value = value + 1 } if (jQuery(this).attr('data-val') == 'decrease') { value = value - 1 } jQuery(el).css('line-height', value + 'px'); jQuery('#outLineHeight').html(value + 'px') } else { jQuery(el).css('line-height', ''); var el; var curr; if (window.getSelection) { curr = window.getSelection().getRangeAt(0).commonAncestorContainer; if (curr.nodeType == 3) { el = curr.parentNode } else { el = curr } } else if (document.selection) { curr = document.selection.createRange(); el = document.selection.createRange().parentElement() } var currentLineHeight = parseInt(jQuery(el).css('line-height')); jQuery('#outLineHeight').html(currentLineHeight + 'px'); jQuery('#outLineHeight').attr('data-initial-value', currentLineHeight) } saveForUndo(); $element.data('contenteditor').settings.hasChanged = true; $element.data('contenteditor').settings.onChange() } }); jQuery('[data-rte-cmd="removeElement"]').off('click'); jQuery('[data-rte-cmd="removeElement"]').click(function (e) { $activeElement.remove(); $element.data('contenteditor').settings.onChange(); $element.data('contenteditor').settings.hasChanged = true; $element.data('contenteditor').render(); saveForUndo(); e.preventDefault() }); jQuery('[data-rte-cmd="fontsize2"]').off('click'); jQuery('[data-rte-cmd="fontsize2"]').click(function (e) {
                var savedSel = saveSelection(); jQuery('#md-fontsize').css('max-width', '190px'); jQuery('#md-fontsize').simplemodal(); jQuery('#md-fontsize').data('simplemodal').show(savedSel); $element.data('contenteditor').closePop(); e.preventDefault(); if (jQuery('#ifrFontSize').attr('src').indexOf('fontsize.html') == -1) { jQuery('#ifrFontSize').attr('src', sScriptPath + 'fontsize.html') } var text = getSelected(); jQuery('.md-pickfontsize').off('click'); jQuery('.md-pickfontsize').click(function () {
                    restoreSelection(savedSel); var el; var curr; if (window.getSelection) { curr = window.getSelection().getRangeAt(0).commonAncestorContainer; if (curr.nodeType == 3) { el = curr.parentNode } else { el = curr } } else if (document.selection) { curr = document.selection.createRange(); el = document.selection.createRange().parentElement() } if (jQuery(el).parents('[contenteditable]').length == 0) { jQuery('#md-fontsize').data('simplemodal').hide(); return } var s = jQuery(this).attr('data-font-size'); if (jQuery.trim(text) != '' && jQuery(el).text() != text) { document.execCommand("fontSize", false, "7"); var fontElements = document.getElementsByTagName("font"); for (var i = 0, len = fontElements.length; i < len; ++i) { if (fontElements[i].size == "7") { fontElements[i].removeAttribute("size"); fontElements[i].style.fontSize = s } } } else if (jQuery(el).text() == text) {
                        if (jQuery(el).html()) { jQuery(el).css('font-size', s) } else { jQuery(el).parent().css('font-size', s) }
                    } else { jQuery(el).css('font-size', s) }; jQuery(this).blur(); $element.data('contenteditor').settings.onChange(); $element.data('contenteditor').settings.hasChanged = true; e.preventDefault(); saveForUndo()
                })
            }); jQuery('[data-rte-cmd="removeFormat"]').off('click'); jQuery('[data-rte-cmd="removeFormat"]').click(function (e) { document.execCommand('removeFormat', false, null); document.execCommand('removeFormat', false, null); jQuery(this).blur(); $element.data('contenteditor').settings.onChange(); $element.data('contenteditor').settings.hasChanged = true; e.preventDefault(); saveForUndo() }); jQuery('[data-rte-cmd="unlink"]').off('click'); jQuery('[data-rte-cmd="unlink"]').click(function (e) { document.execCommand('unlink', false, null); jQuery("#divRteLink").removeClass('forceshow'); jQuery(this).blur(); $element.data('contenteditor').settings.onChange(); $element.data('contenteditor').settings.hasChanged = true; e.preventDefault(); saveForUndo() }); var storedEl; jQuery('[data-rte-cmd="html"]').off('click'); jQuery('[data-rte-cmd="html"]').click(function (e) { var el; if (window.getSelection) { el = window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode } else if (document.selection) { el = document.selection.createRange().parentElement() } var found = false; jQuery(el).parents().each(function () { if (jQuery(this).data('contentbuilder')) { jQuery(this).data('contentbuilder').viewHtml(); found = true; storedEl = el } }); if (!found && storedEl) { el = storedEl; jQuery(el).parents().each(function () { if (jQuery(this).data('contentbuilder')) { jQuery(this).data('contentbuilder').viewHtml() } }) } e.preventDefault() }); jQuery('[data-rte-cmd="formatPara"]').off('click'); jQuery('[data-rte-cmd="formatPara"]').click(function (e) {
                savedSelPublic = saveSelection(); var top = jQuery(this).offset().top - jQuery(window).scrollTop(); var left = jQuery(this).offset().left; if (jQuery('#rte-toolbar').hasClass('rte-side')) { jQuery('#pop-headings').addClass('rte-side'); if (jQuery('#rte-toolbar').hasClass('right')) { left = left - 57 - 132 } else { left = left + 57 } }
                else { top = top + 51 } jQuery('#pop-headings').css('position', 'fixed'); jQuery('#pop-headings').css('top', top + 'px'); jQuery('#pop-headings').css('left', left + 'px'); $element.data('contenteditor').closePop(); jQuery('#pop-headings').css('display', 'block'); jQuery(this).addClass('on'); if (jQuery('#ifrHeadings').attr('src').indexOf('headings.html') == -1) { jQuery('#ifrHeadings').attr('src', sScriptPath + 'headings.html?1') } var is_ie = detectIE(); if (is_ie) restoreSelection(savedSelPublic); $element.data('contenteditor').getState(); try { var $contents = jQuery('#ifrHeadings').contents(); var $parentDiv = $contents.find('#divHeadings'); var $innerListItem = $contents.find('.on'); $parentDiv.animate({ scrollTop: $parentDiv.scrollTop() + $innerListItem.position().top - 7 }, 1000) } catch (e) { } jQuery('.md-pickheading').off('click'); jQuery('.md-pickheading').click(function () { restoreSelection(savedSelPublic); var s = jQuery(this).attr('data-heading'); document.execCommand('formatBlock', false, '<' + s + '>'); $element.data('contenteditor').getState(); $element.data('contenteditor').settings.onChange(); $element.data('contenteditor').settings.hasChanged = true; e.preventDefault(); savedSelPublic = saveSelection(); saveForUndo() })
            }); jQuery('[data-rte-cmd="font"]').off('click'); jQuery('[data-rte-cmd="font"]').click(function (e) {
                savedSelPublic = saveSelection(); var top = jQuery(this).offset().top - jQuery(window).scrollTop(); var left = jQuery(this).offset().left; if (jQuery('#rte-toolbar').hasClass('rte-side')) { jQuery('#pop-fontfamily').addClass('rte-side'); if (jQuery('#rte-toolbar').hasClass('right')) { left = left - 57 - 132 } else { left = left + 57 } } else { top = top + 51 } jQuery('#pop-fontfamily').css('position', 'fixed'); jQuery('#pop-fontfamily').css('top', top + 'px'); jQuery('#pop-fontfamily').css('left', left + 'px'); $element.data('contenteditor').closePop(); jQuery('#pop-fontfamily').css('display', 'block'); jQuery(this).addClass('on'); if (jQuery('#ifrFonts').attr('src').indexOf('fonts.html') == -1) { jQuery('#ifrFonts').attr('src', sScriptPath + 'fonts.html?1') } var text = getSelected(); $element.data('contenteditor').getState(); try { var $contents = jQuery('#ifrFonts').contents(); var $parentDiv = $contents.find('#divFontList'); var $innerListItem = $contents.find('.on'); $parentDiv.animate({ scrollTop: $parentDiv.scrollTop() + $innerListItem.position().top - 7 }, 1000) } catch (e) { } jQuery('.md-pickfontfamily').off('click'); jQuery('.md-pickfontfamily').click(function () {
                    restoreSelection(savedSelPublic); var el; var curr; if (window.getSelection) { curr = window.getSelection().getRangeAt(0).commonAncestorContainer; if (curr.nodeType == 3) { el = curr.parentNode } else { el = curr } if (el.nodeName != 'H1' && el.nodeName != 'H2' && el.nodeName != 'H3' && el.nodeName != 'H4' && el.nodeName != 'H5' && el.nodeName != 'H6' && el.nodeName != 'P') { el = el.parentNode } } else if (document.selection) { curr = document.selection.createRange(); el = document.selection.createRange().parentElement(); if (el.nodeName != 'H1' && el.nodeName != 'H2' && el.nodeName != 'H3' && el.nodeName != 'H4' && el.nodeName != 'H5' && el.nodeName != 'H6' && el.nodeName != 'P') { el = el.parentElement() } } var s = jQuery(this).attr('data-font-family'); if (jQuery.trim(text) != '' && jQuery(el).text() != text) { document.execCommand("fontName", false, s); var fontElements = document.getElementsByTagName("font"); for (var i = 0, len = fontElements.length; i < len; ++i) { if (fontElements[i].face == s) { fontElements[i].removeAttribute("face"); fontElements[i].style.fontFamily = s } } } else if (jQuery(el).text() == text) { if (jQuery(el).html()) { jQuery(el).css('font-family', s) } else { jQuery(el).parent().css('font-family', s) } } else { jQuery(el).css('font-family', s) }; var o = jQuery(this).attr('data-font-style'); if (!o) { o = '' } else { o = ':' + o }; var fontname = s.split(',')[0];
                    var provider = jQuery(this).attr('data-provider'); if (provider == 'google') { var bExist = false; var links = document.getElementsByTagName("link"); for (var i = 0; i < links.length; i++) { var sSrc = links[i].href.toLowerCase(); sSrc = sSrc.replace(/\+/g, ' ').replace(/%20/g, ' '); if (sSrc.indexOf(fontname.toLowerCase()) != -1) bExist = true } if (!bExist) { jQuery(el).parents().each(function () { if (jQuery(this).data('contentbuilder')) { jQuery(this).append('<link href="//fonts.googleapis.com/css?family=' + fontname + o + '" rel="stylesheet" property="stylesheet" type="text/css">') } }) } } jQuery(cb_list).each(function () { var $cb = jQuery(this); $cb.find('link').each(function () { var sSrc = jQuery(this).attr('href').toLowerCase(); if (sSrc.indexOf('googleapis') != -1) { sSrc = sSrc.replace(/\+/g, ' ').replace(/%20/g, ' '); var fontname = sSrc.substr(sSrc.indexOf('family=') + 7); if (fontname.indexOf(':') != -1) { fontname = fontname.split(':')[0] } if (fontname.indexOf('|') != -1) { fontname = fontname.split('|')[0] } var tmp = $cb.data('contentbuilder').html().toLowerCase(); var count = tmp.split(fontname).length; if (count < 3) { jQuery(this).attr('data-rel', '_del') } } }) }); $element.find('[data-rel="_del"]').remove(); $element.data('contenteditor').getState(); $element.data('contenteditor').settings.onChange(); $element.data('contenteditor').settings.hasChanged = true; e.preventDefault(); saveForUndo()
                })
            }); jQuery('[data-rte-cmd="image"]').off('click'); jQuery('[data-rte-cmd="image"]').click(function (e) {
                savedSelPublic = saveSelection(); jQuery('#md-insertimage').css('max-width', '550px'); jQuery('#md-insertimage').simplemodal({ noOverlay: true }); jQuery('#md-insertimage').data('simplemodal').show(savedSel); $element.data('contenteditor').closePop(); jQuery('#fileInsertImage').clearInputs(); jQuery('.md-preview-area').hide(); jQuery('.md-drop-area').show(); jQuery('.md-drop-area').removeClass('image-dropping'); jQuery('#txtImgUrl_rte').val(''); jQuery('#btnImgOk_rte').off('click'); jQuery('#btnImgOk_rte').click(function () {
                    if (!savedSelPublic) return; restoreSelection(savedSelPublic); var val = ''; if (jQuery('.md-drop-area').css('display') == 'none') { val = jQuery('#imgInsertImagePreview').attr('src') } else { val = jQuery('#txtImgUrl_rte').val() } if (val == '') return; pasteHtmlAtCaret('<img src="' + val + '" />', true); jQuery('#md-insertimage').data('simplemodal').hide(); $element.data('contenteditor').settings.onChange(); $element.data('contenteditor').settings.hasChanged = true; saveForUndo(); var el; var curr; if (window.getSelection) { curr = window.getSelection().getRangeAt(0).commonAncestorContainer; if (curr.nodeType == 3) { el = curr.parentNode } else { el = curr } } else if (document.selection) { curr = document.selection.createRange(); el = document.selection.createRange().parentElement() }
                    jQuery(el).parents().each(function () {
                        if (jQuery(this).data('contentbuilder')) {
                            jQuery(this).data('contentbuilder').applyBehavior()
                        }
                    });
                    var sel; if (window.getSelection) {
                        sel = window.getSelection()
                    } else if (document.selection) {
                        sel = document.selection
                    }
                    sel.removeAllRanges();
                    jQuery('#rte-toolbar').css('display', 'none')
                });
                e.preventDefault(); return
            });
            jQuery('#fileInsertImage').off('change'); jQuery('#fileInsertImage').on('change', function (e) {
                var input = e.target; if (input.files && input.files[0]) {
                    var reader = new FileReader(); reader.onload = function (e) {
                        jQuery('.md-drop-area').hide();
                        jQuery('#imgInsertImagePreview').attr('src', e.target.result); jQuery('.md-preview-area').show();
                        jQuery('.image-title').html(input.files[0].name)
                    }; reader.readAsDataURL(input.files[0]);
                    jQuery('#txtImgUrl_rte').val('')
                }
            });
            jQuery('.md-drop-area').off('dragover');
            jQuery('.md-drop-area').on('dragover', function () { jQuery('.md-drop-area').addClass('image-dropping') });
            jQuery('.md-drop-area').off('dragleave');
            jQuery('.md-drop-area').on('dragleave', function () {
                jQuery('.md-drop-area').removeClass('image-dropping')
            });
            jQuery('.md-preview-area i').off('click');
            jQuery('.md-preview-area i').click(function (e) { jQuery('#fileInsertImage').clearInputs(); jQuery('.md-preview-area').hide(); jQuery('.md-drop-area').show(); jQuery('.md-drop-area').removeClass('image-dropping') }); jQuery('#txtImgUrl_rte').off('keyup'); jQuery('#txtImgUrl_rte').on('keyup', function () { jQuery('#fileInsertImage').clearInputs(); jQuery('.md-preview-area').hide(); jQuery('.md-drop-area').show(); jQuery('.md-drop-area').removeClass('image-dropping') }); jQuery("#btnImageBrowse_rte").off('click'); jQuery("#btnImageBrowse_rte").on('click', function (e) { var sFunc = ($element.data('contenteditor').settings.onImageSelectClick + '').replace(/\s/g, ''); if (sFunc != 'function(){}') { $element.data('contenteditor').settings.onImageSelectClick({ targetInput: jQuery("#txtImgUrl_rte").get(0), theTrigger: jQuery("#btnImageBrowse_rte").get(0) }) } else { jQuery('#ifrImageBrowse').attr('src', $element.data('contenteditor').settings.imageselect); jQuery('#active-input').val('txtImgUrl_rte'); jQuery('#md-imageselect').css('width', '65%'); jQuery('#md-imageselect').simplemodal({ onFinish: function () { if (jQuery('#txtImgUrl_rte').val() != '') { jQuery('#fileInsertImage').clearInputs(); jQuery('.md-preview-area').hide(); jQuery('.md-drop-area').show(); jQuery('.md-drop-area').removeClass('image-dropping') } } }); jQuery('#md-imageselect').data('simplemodal').show() } }); jQuery('[data-rte-cmd="formatting"]').off('click'); jQuery('[data-rte-cmd="formatting"]').click(function (e) {
                savedSelPublic = saveSelection(); var top = jQuery(this).offset().top - jQuery(window).scrollTop(); var left = jQuery(this).offset().left;
                if (jQuery('#rte-toolbar').hasClass('rte-side')) {
                    jQuery('#pop-formatting').addClass('rte-side');
                    if (jQuery('#rte-toolbar').hasClass('right')) {
                        left = left - 58
                    } else {
                        left = left + 57
                    }
                } else {
                    top = top + 51
                }
                jQuery('#pop-formatting').css('position', 'fixed');
                jQuery('#pop-formatting').css('top', top + 'px');
                jQuery('#pop-formatting').css('left', left + 'px');
                $element.data('contenteditor').closePop();
                jQuery('#pop-formatting').css('display', 'block');
                jQuery(this).addClass('on');
                $element.data('contenteditor').getState();
                var el; var curr;
                if (window.getSelection) {
                    curr = window.getSelection().getRangeAt(0).commonAncestorContainer;
                    if (curr.nodeType == 3) {
                        el = curr.parentNode
                    } else {
                        el = curr
                    }
                } else if (document.selection) {
                    curr = document.selection.createRange();
                    el = document.selection.createRange().parentElement()
                }
                e.preventDefault()
            }); jQuery('[data-rte-cmd="textsettings"]').off('click');
            jQuery('[data-rte-cmd="textsettings"]').click(function (e) {
                savedSelPublic = saveSelection();
                var top = jQuery(this).offset().top - jQuery(window).scrollTop();
                var left = jQuery(this).offset().left;
                if (jQuery('#rte-toolbar').hasClass('rte-side')) { jQuery('#pop-textsettings').addClass('rte-side'); if (jQuery('#rte-toolbar').hasClass('right')) { left = left - 57 - 132 } else { left = left + 57 } } else { top = top + 51 } jQuery('#pop-textsettings').css('position', 'fixed'); jQuery('#pop-textsettings').css('top', top + 'px'); jQuery('#pop-textsettings').css('left', left + 'px'); $element.data('contenteditor').closePop(); jQuery('#pop-textsettings').css('display', 'block'); jQuery(this).addClass('on'); var el; var curr; if (window.getSelection) {
                    curr = window.getSelection().getRangeAt(0).commonAncestorContainer;
                    if (curr.nodeType == 3) {
                        el = curr.parentNode
                    } else {
                        el = curr
                    }
                } else if (document.selection) {
                    curr = document.selection.createRange();
                    el = document.selection.createRange().parentElement()
                }
                var currentFontSize = parseInt(jQuery(el).css('font-size'));
                jQuery('#outFontSize').html(currentFontSize + 'px');
                jQuery('#outFontSize').attr('data-initial-value', currentFontSize);
                var currentLetterSpacing = parseInt(jQuery(el).css('letter-spacing'));
                jQuery('#outLetterSpacing').html(currentLetterSpacing + 'px');
                jQuery('#outLetterSpacing').attr('data-initial-value', currentLetterSpacing);
                var currentLineHeight = parseInt(jQuery(el).css('line-height')); jQuery('#outLineHeight').html(currentLineHeight + 'px'); jQuery('#outLineHeight').attr('data-initial-value', currentLineHeight);
                e.preventDefault()
            }); jQuery('[data-rte-cmd="color"]').off('click');
            jQuery('[data-rte-cmd="color"]').click(function (e) {
                savedSelPublic = saveSelection();
                var top = jQuery(this).offset().top - jQuery(window).scrollTop();
                var left = jQuery(this).offset().left;
                if (jQuery('#rte-toolbar').hasClass('rte-side')) {
                    jQuery('#pop-colors').addClass('rte-side'); if (jQuery('#rte-toolbar').hasClass('right')) { left = left - 57 - 215 } else { left = left + 57 }
                } else { top = top + 51 } jQuery('#pop-colors').css('position', 'fixed');
                jQuery('#pop-colors').css('top', top + 'px'); jQuery('#pop-colors').css('left', left + 'px');
                $element.data('contenteditor').closePop(); jQuery('#pop-colors').css('display', 'block');
                jQuery(this).addClass('on'); var el; var curr; if (window.getSelection) {
                    curr = window.getSelection().getRangeAt(0).commonAncestorContainer; if (curr.nodeType == 3) {
                        el = curr.parentNode
                    } else { el = curr }
                } else if (document.selection) {
                    curr = document.selection.createRange(); el = document.selection.createRange().parentElement()
                } jQuery('#selColorApplyTo').off('change'); jQuery('#selColorApplyTo').on('change', function () {
                    var selColMode = jQuery('#selColorApplyTo').val(); if (selColMode == 1) { var s = jQuery(el).css("color"); jQuery('#inpTextColor').val(s); 
                    jQuery('#inpTextColor').css('background-color', s); 
                    jQuery('#inpTextColor').contrastingText() } if (selColMode == 2) { var s = jQuery(el).css("background-color"); 
                    jQuery('#inpTextColor').val(s); jQuery('#inpTextColor').css('background-color', s); 
                    jQuery('#inpTextColor').contrastingText() } if (selColMode == 3) {
                        var s = jQuery(el).parents('.ui-draggable').children().first().css('background-color'); 
                        jQuery('#inpTextColor').val(s); jQuery('#inpTextColor').css('background-color', s); 
                        jQuery('#inpTextColor').contrastingText()
                    }
                }); jQuery('#selColorApplyTo').change(); var emailmode = false;
                try {
                    if ($element.children('div.ui-draggable').first().children().first().children().first().prop("tagName").toLowerCase() == 'table') {
                        emailmode = true
                    }
                } catch (e) { }
                if (emailmode) {
                    jQuery('#selColorApplyTo').children().each(function () {
                        if (jQuery(this).attr('value') == '3') jQuery(this).remove()
                    })
                } var text = getSelected(); 
                jQuery('.md-pick').off('click'); 
                jQuery('.md-pick').click(function () {
                    var s = jQuery(this).css("background-color");
                    jQuery('#inpTextColor').val(s);
                    jQuery('#inpTextColor').css('background-color', s);
                    jQuery('#inpTextColor').contrastingText();
                    restoreSelection(savedSelPublic);
                    $element.data('contenteditor').applyColor(s, text);
                    savedSelPublic = saveSelection(); $element.data('contenteditor').settings.onChange();
                    saveForUndo()
                });
                // if (!jQuery('#inpTextColor').colorPicker) {
                //     $('#inpTextColor').colorPicker.destroy();
                // }
                // jQuery('#inpTextColor').colorPicker({
                //     dark: '#222',
                //     light: '#DDD',
                //     renderCallback: function ($elm, toggled) {
                //         if (toggled === true) {
                //             jQuery('#inpTextColor').attr('data-initial-color', jQuery('#inpTextColor').val())
                //         } else if (toggled === false) {
                //             if (jQuery('#inpTextColor').attr('data-initial-color') != jQuery('#inpTextColor').val()) {
                //                 $element.data('contenteditor').settings.onChange();
                //                 $element.data('contenteditor').settings.hasChanged = true;
                //                 saveForUndo();
                //                 jQuery('#inpTextColor').attr('data-initial-color', jQuery('#inpTextColor').val())
                //             }
                //         } else { 
                //             var s = jQuery('#inpTextColor').val(); 
                //             restoreSelection(savedSelPublic); 
                //             $element.data('contenteditor').applyColor(s, text); 
                //             savedSelPublic = saveSelection() }
                //     }
                // }); 
                var bManualColorChange = false;
                jQuery('#inpTextColor').off('keyup');
                jQuery('#inpTextColor').on('keyup', function (e) {
                    bManualColorChange = true
                });
                jQuery('#inpTextColor').off('blur');
                jQuery('#inpTextColor').on('blur', function (e) {
                    var s = jQuery('#inpTextColor').val();
                    restoreSelection(savedSelPublic);
                    $element.data('contenteditor').applyColor(s, text);
                    savedSelPublic = saveSelection();
                    if ((jQuery('#inpTextColor').attr('data-initial-color') != jQuery('#inpTextColor').val()) || bManualColorChange) {
                        $element.data('contenteditor').settings.onChange();
                        $element.data('contenteditor').settings.hasChanged = true;
                        saveForUndo();
                        jQuery('#inpTextColor').attr('data-initial-color', jQuery('#inpTextColor').val()); bManualColorChange = false
                    }
                });
                jQuery('#btnTextColorClear').off('click');
                jQuery('#btnTextColorClear').click(function () {
                    restoreSelection(savedSelPublic);
                    var el;
                    var curr;
                    if (window.getSelection) {
                        curr = window.getSelection().getRangeAt(0).commonAncestorContainer;
                        if (curr.nodeType == 3) {
                            el = curr.parentNode
                        } else {
                            el = curr
                        }
                    } else if (document.selection) {
                        curr = document.selection.createRange();
                        el = document.selection.createRange().parentElement()
                    }
                    var selColMode = jQuery('#selColorApplyTo').val();
                    if (jQuery.trim(text) != '' && jQuery(el).text() != text) {
                        if (selColMode == 1) {
                            document.execCommand("ForeColor", false, '')
                        }
                        if (selColMode == 2) { document.execCommand("BackColor", false, '') } var fontElements = document.getElementsByTagName("font");
                        for (var i = 0, len = fontElements.length; i < len; ++i) {
                            var s = fontElements[i].color; fontElements[i].removeAttribute("color"); fontElements[i].style.color = s
                        }
                    } else if (jQuery(el).text() == text) {
                        if (selColMode == 1) {
                            if (jQuery(el).html()) {
                                jQuery(el).css('color', '')
                            } else {
                                jQuery(el).parent().css('color', '')
                            }
                        }
                        if (selColMode == 2) {
                            if (jQuery(el).html()) {
                                jQuery(el).css('background-color', '')
                            } else {
                                jQuery(el).parent().css('background-color', '')
                            }
                        }
                    } else {
                        if (selColMode == 1) {
                            jQuery(el).css('color', '')
                        }
                        if (selColMode == 2) {
                            jQuery(el).css('background-color', '')
                        }
                    };
                    if (selColMode == 3) {
                        jQuery(el).parents('.ui-draggable').children().first().css('background-color', '')
                    }
                    jQuery('#selColorApplyTo').change()
                })
            });
            jQuery('[data-rte-cmd="bold"]').off('click');
            jQuery('[data-rte-cmd="bold"]').click(function (e) {
                var savedSel = saveSelection();
                var text = getSelected();
                var el;
                var curr;
                if (window.getSelection) {
                    curr = window.getSelection().getRangeAt(0).commonAncestorContainer;
                    if (curr.nodeType == 3) {
                        el = curr.parentNode
                    } else {
                        el = curr
                    }
                } else if (document.selection) {
                    curr = document.selection.createRange();
                    el = document.selection.createRange().parentElement()
                }
                var s;
                if (isNaN(jQuery(el).css('font-weight'))) {
                    if (jQuery(el).css('font-weight') == 'bold') {
                        s = 'normal'
                    } else {
                        s = 'bold'
                    }
                } else {
                    if (jQuery(el).css('font-weight') <= 500) {
                        s = 'bold'
                    } else {
                        s = 'normal'
                    }
                }
                if (jQuery.trim(text) != '') {
                    try {
                        document.execCommand('bold', false, null)
                    } catch (e) {
                        $element.attr('contenteditable', true);
                        document.execCommand('bold', false, null);
                        $element.removeAttr('contenteditable');
                        $element.data('contenteditor').render()
                    }
                    savedSel = saveSelection()
                }
                else {
                    var sTagName = jQuery(el).prop("tagName").toLowerCase();
                    if (sTagName == 'b') {
                        selectElementContents(el);
                        try {
                            document.execCommand('bold', false, null)
                        } catch (e) {
                            $element.attr('contenteditable', true);
                            document.execCommand('bold', false, null);
                            $element.removeAttr('contenteditable');
                            $element.data('contenteditor').render()
                        }
                    } else {
                        jQuery(el).css('font-weight', s)
                    }
                };
                if (jQuery.trim(text) == '') {
                    restoreSelection(savedSel)
                }
                else {

                }
                $element.data('contenteditor').getState();
                $element.data('contenteditor').settings.hasChanged = true;
                $element.data('contenteditor').settings.onChange();
                e.preventDefault();
                saveForUndo()
            }); jQuery('[data-rte-cmd="italic"]').off('click');
            jQuery('[data-rte-cmd="italic"]').click(function (e) {
                var savedSel = saveSelection();
                var text = getSelected();
                var el; var curr;
                if (window.getSelection) {
                    curr = window.getSelection().getRangeAt(0).commonAncestorContainer;
                    if (curr.nodeType == 3) {
                        el = curr.parentNode
                    }
                    else {
                        el = curr
                    }
                } else if (document.selection) {
                    curr = document.selection.createRange();
                    el = document.selection.createRange().parentElement()
                } var s;
                if (jQuery(el).css('font-style') == 'italic') {
                    s = 'normal'
                }
                else {
                    s = 'italic'
                }
                if (jQuery.trim(text) != '') {
                    try {
                        document.execCommand('italic', false, null)
                    } catch (e) {
                        $element.attr('contenteditable', true);
                        document.execCommand('italic', false, null); $element.removeAttr('contenteditable'); $element.data('contenteditor').render()
                    } savedSel = saveSelection()
                } else {
                    var sTagName = jQuery(el).prop("tagName").toLowerCase();
                    if (sTagName == 'i' || sTagName == 'em') {
                        selectElementContents(el);
                        try {
                            document.execCommand('italic', false, null)
                        }
                        catch (e) {
                            $element.attr('contenteditable', true);
                            document.execCommand('italic', false, null);
                            $element.removeAttr('contenteditable');
                            $element.data('contenteditor').render()
                        }
                    } else {
                        jQuery(el).css('font-style', s)
                    }
                }; if (jQuery.trim(text) == '') {
                    restoreSelection(savedSel)
                } else {

                }
                $element.data('contenteditor').getState();
                $element.data('contenteditor').settings.hasChanged = true;
                $element.data('contenteditor').settings.onChange();
                e.preventDefault(); saveForUndo()
            });
            jQuery('[data-rte-cmd="underline"]').off('click');
            jQuery('[data-rte-cmd="underline"]').click(function (e) {
                var savedSel = saveSelection(); var text = getSelected();
                var el;
                var curr;
                if (window.getSelection) {
                    curr = window.getSelection().getRangeAt(0).commonAncestorContainer;
                    if (curr.nodeType == 3) {
                        el = curr.parentNode
                    } else {
                        el = curr
                    }
                } else if (document.selection) {
                    curr = document.selection.createRange();
                    el = document.selection.createRange().parentElement()
                }
                var s;
                if (jQuery(el).css('text-decoration').indexOf('underline') != -1) {
                    s = ''
                } else {
                    s = 'underline'
                }
                if (jQuery.trim(text) != '') {
                    try {
                        document.execCommand('underline', false, null)
                    } catch (e) {
                        $element.attr('contenteditable', true);
                        document.execCommand('underline', false, null);
                        $element.removeAttr('contenteditable');
                        $element.data('contenteditor').render()
                    }
                    savedSel = saveSelection()
                } else {
                    var sTagName = jQuery(el).prop("tagName").toLowerCase();
                    if (sTagName == 'u') {
                        selectElementContents(el);
                        try {
                            document.execCommand('underline', false, null)
                        } catch (e) {
                            $element.attr('contenteditable', true);
                            document.execCommand('underline', false, null);
                            $element.removeAttr('contenteditable');
                            $element.data('contenteditor').render()
                        }
                    } else {
                        jQuery(el).css('text-decoration', s)
                    }
                }; if (jQuery.trim(text) == '') {
                    restoreSelection(savedSel)
                } else {

                }
                $element.data('contenteditor').getState();
                $element.data('contenteditor').settings.hasChanged = true;
                $element.data('contenteditor').settings.onChange();
                e.preventDefault();
                saveForUndo()
            });

            jQuery('[data-rte-cmd="strikethrough"]').off('click');
            jQuery('[data-rte-cmd="strikethrough"]').click(function (e) {
                var savedSel = saveSelection(); var text = getSelected();
                var el;
                var curr;
                if (window.getSelection) {
                    curr = window.getSelection().getRangeAt(0).commonAncestorContainer;
                    if (curr.nodeType == 3) {
                        el = curr.parentNode
                    } else {
                        el = curr
                    }
                } else if (document.selection) {
                    curr = document.selection.createRange();
                    el = document.selection.createRange().parentElement()
                }
                var s;
                if (jQuery(el).css('text-decoration').indexOf('line-through') != -1) {
                    s = ''
                } else {
                    s = 'line-through'
                }
                if (jQuery.trim(text) != '') {
                    try {
                        document.execCommand('strikethrough', false, null)
                    } catch (e) {
                        $element.attr('contenteditable', true);
                        document.execCommand('strikethrough', false, null);
                        $element.removeAttr('contenteditable'); $element.data('contenteditor').render()
                    } savedSel = saveSelection()
                } else {
                    var sTagName = jQuery(el).prop("tagName").toLowerCase();
                    if (sTagName == 'strike') {
                        selectElementContents(el);
                        try {
                            document.execCommand('strikethrough', false, null)
                        } catch (e) {
                            $element.attr('contenteditable', true);
                            document.execCommand('strikethrough', false, null);
                            $element.removeAttr('contenteditable');
                            $element.data('contenteditor').render()
                        }
                    } else {
                        jQuery(el).css('text-decoration', s)
                    }
                };
                if (jQuery.trim(text) == '') {
                    restoreSelection(savedSel)
                } else {

                }
                $element.data('contenteditor').getState();
                $element.data('contenteditor').settings.hasChanged = true;
                $element.data('contenteditor').settings.onChange();
                e.preventDefault(); saveForUndo()
            }); jQuery('[data-rte-cmd="uppercase"]').off('click');
            jQuery('[data-rte-cmd="uppercase"]').click(function (e) {
                var savedSel = saveSelection();
                var text = getSelected();
                var el; var curr; if (window.getSelection) {
                    curr = window.getSelection().getRangeAt(0).commonAncestorContainer;
                    if (curr.nodeType == 3) {
                        el = curr.parentNode
                    }
                    else {
                        el = curr
                    }
                }
                else if (document.selection) {
                    curr = document.selection.createRange();
                    el = document.selection.createRange().parentElement()
                }
                var s;
                if (jQuery(el).css('text-transform') == 'uppercase') {
                    s = ''
                } else {
                    s = 'uppercase'
                }
                jQuery(el).css('text-transform', s);
                if (jQuery.trim(text) == '') {
                    restoreSelection(savedSel)
                } else {

                }
                $element.data('contenteditor').getState();
                $element.data('contenteditor').settings.hasChanged = true;
                $element.data('contenteditor').settings.onChange();
                e.preventDefault(); saveForUndo()
            });
            jQuery('[data-rte-cmd="table"]').off('click');
            jQuery('[data-rte-cmd="table"]').click(function (e) {
                var savedSel = saveSelection();
                var top = jQuery(this).offset().top - jQuery(window).scrollTop();
                var left = jQuery(this).offset().left;
                if (jQuery('#rte-toolbar').hasClass('rte-side')) {
                    jQuery('#pop-table').addClass('rte-side');
                    if (jQuery('#rte-toolbar').hasClass('right')) {
                        left = left - 57 - 163
                    }
                    else {
                        left = left + 57
                    }
                }
                else {
                    top = top + 51
                }
                jQuery('#pop-table').css('position', 'fixed');
                jQuery('#pop-table').css('top', top + 'px');
                jQuery('#pop-table').css('left', left + 'px');
                $element.data('contenteditor').closePop();
                jQuery('#pop-table').css('display', 'block');
                jQuery(this).addClass('on'); e.preventDefault();
                jQuery('#tableInsert td').off('mouseover');
                jQuery('#tableInsert td').on('mouseover', function (e) {
                    var row = jQuery(this).attr('data-row');
                    var col = jQuery(this).attr('data-col');
                    var i = 0; jQuery('#tableInsert tr').each(function () {
                        var j = 0; var $tr = jQuery(this);
                        $tr.children('td').each(function () {
                            var $td = jQuery(this);
                            if (i < row && j < col) {
                                $td.addClass('highlight')
                            } else {
                                $td.removeClass('highlight')
                            } j++
                        });
                        i++
                    })
                });
                jQuery('#tableInsert').off('mouseout');
                jQuery('#tableInsert').on('mouseout', function (e) {
                    jQuery('#tableInsert tr').each(function () {
                        var $tr = jQuery(this);
                        $tr.children('td').each(function () {
                            var $td = jQuery(this);
                            $td.removeClass('highlight')
                        })
                    })
                });
                jQuery('#tableInsert td').off('click');
                jQuery('#tableInsert td').click(function (e) {
                    restoreSelection(savedSel);
                    var row = jQuery(this).attr('data-row');
                    var col = jQuery(this).attr('data-col');
                    var sHTML = '<table class="default" style="border-collapse:collapse;width:100%;">';
                    for (var i = 1; i <= row; i++) {
                        sHTML += "<tr>";
                        for (var j = 1; j <= col; j++) {
                            sHTML += '<td valign="top"><br></td>'
                        }
                        sHTML += '</tr>'
                    }
                    sHTML += '</table>';
                    pasteHtmlAtCaret(sHTML);
                    $element.data('contenteditor').closePop();
                    $element.data('contenteditor').render();
                    $element.data('contenteditor').settings.hasChanged = true;
                    $element.data('contenteditor').settings.onChange();
                    e.preventDefault();
                    saveForUndo()
                })
            });
            jQuery('#btnDeleteTable').off('click');
            jQuery('#btnDeleteTable').click(function (e) {
                if (jQuery("#md-edittable").data("simplemodal"))
                    jQuery("#md-edittable").data("simplemodal").hide();
                jQuery('#md-deltableconfirm').css('max-width', '550px');
                jQuery('#md-deltableconfirm').simplemodal();
                jQuery('#md-deltableconfirm').data('simplemodal').show();
                jQuery('#btnDelTableOk').off('click'); jQuery('#btnDelTableOk').on('click', function (e) {
                    jQuery('#md-deltableconfirm').data('simplemodal').hide(); var $table = $activeCell.parents('table').first();
                    $table.fadeOut(400, function () {
                        jQuery("#divRteTable").stop(true, true).fadeOut(0); $table.remove();
                        $element.data('contenteditor').render(); $element.data('contenteditor').settings.hasChanged = true; $element.data('contenteditor').settings.onChange(); saveForUndo()
                    })
                });
                jQuery('#btnDelTableCancel').off('click'); jQuery('#btnDelTableCancel').on('click', function (e) {
                    jQuery('#md-deltableconfirm').data('simplemodal').hide()
                })
            }); jQuery('#btnEditTable').off('click'); jQuery('#btnEditTable').click(function (e) {
                var savedSel = saveSelection(); $element.data('contenteditor').closePop(); jQuery("#md-edittable").css("width", '267px'); jQuery("#md-edittable").simplemodal({ noOverlay: true }); jQuery("#md-edittable").data("simplemodal").show(); jQuery('#tabTableDesign').off('click'); jQuery('#tabTableDesign').on('click', function (e) {
                    jQuery('#tabTableDesign').addClass('active'); jQuery('#tabTableLayout').removeClass('active');
                    jQuery('#divTableLayout').fadeOut(300, function () {
                        jQuery('#divTableDesign').fadeIn(0)
                    })
                });
                jQuery('#tabTableLayout').off('click');
                jQuery('#tabTableLayout').on('click', function (e) {
                    jQuery('#tabTableDesign').removeClass('active');
                    jQuery('#tabTableLayout').addClass('active');
                    jQuery('#divTableDesign').fadeOut(0, function () {
                        jQuery('#divTableLayout').fadeIn(300)
                    })
                });
                // if (!jQuery('#inpCellBgColor').colorPicker) {
                //     $('#inpCellBgColor').colorPicker.destroy();
                // }

                // jQuery('#inpCellBgColor').colorPicker({
                //     dark: '#222',
                //     light: '#DDD',
                //     renderCallback: function ($elm, toggled) {
                //         if (toggled === true) {
                //             jQuery('#inpCellBgColor').attr('data-initial-color', jQuery('#inpCellBgColor').val())
                //         } else if (toggled === false) {
                //             if (jQuery('#inpCellBgColor').attr('data-initial-color') != jQuery('#inpCellBgColor').val()) {
                //                 $element.data('contenteditor').settings.onChange();
                //                 $element.data('contenteditor').settings.hasChanged = true;
                //                 saveForUndo();
                //                 jQuery('#inpCellBgColor').attr('data-initial-color', jQuery('#inpCellBgColor').val())
                //             }
                //         }
                //         else {
                //             if (!$activeCell) return;
                //             var val = jQuery('#inpCellBgColor').val();
                //             restoreSelection(savedSel);
                //             var applyto = jQuery('#selTableApplyTo').val();
                //             var oTable = $activeCell.parents('table').first()[0];
                //             var oRow = $activeCell.parents('tr').first()[0];
                //             var oCell = $activeCell[0];
                //             if (applyto == 'currentcell') {
                //                 $activeCell.css('background-color', val)
                //             } for (var i = 0; i < oTable.rows.length; i++) {
                //                 var oTR = oTable.rows[i];
                //                 for (var j = 0; j < oTR.cells.length; j++) {
                //                     var oTD = oTR.cells[j];
                //                     if (applyto == 'table') {
                //                         jQuery(oTD).css('background-color', val)
                //                     }
                //                     if (applyto == 'evenrows' && isEven(i + 1)) {
                //                         jQuery(oTD).css('background-color', val)
                //                     }
                //                     if (applyto == 'oddrows' && !isEven(i + 1)) {
                //                         jQuery(oTD).css('background-color', val)
                //                     }
                //                     if (applyto == 'currentrow' && oTR == $activeCell.parents('tr').first()[0]) {
                //                         jQuery(oTD).css('background-color', val)
                //                     }
                //                     if (applyto == 'currentcol' && j == getCellIndex(oTable, oRow, oCell)) { jQuery(oTD).css('background-color', val) }
                //                 }
                //             }
                //         }
                //     }
                // });
                var bManualColorChange = false;
                jQuery('#inpCellBgColor').off('keyup');
                jQuery('#inpCellBgColor').on('keyup', function (e) {
                    bManualColorChange = true
                });
                jQuery('#inpCellBgColor').off('blur');
                jQuery('#inpCellBgColor').on('blur', function () {
                    if (!$activeCell) return;
                    restoreSelection(savedSel);
                    var val = jQuery('#inpCellBgColor').val();
                    var applyto = jQuery('#selTableApplyTo').val();
                    var oTable = $activeCell.parents('table').first()[0];
                    var oRow = $activeCell.parents('tr').first()[0];
                    var oCell = $activeCell[0];
                    if (applyto == 'currentcell') {
                        $activeCell.css('background-color', val)
                    } for (var i = 0; i < oTable.rows.length; i++) {
                        var oTR = oTable.rows[i];
                        for (var j = 0; j < oTR.cells.length; j++) {
                            var oTD = oTR.cells[j];
                            if (applyto == 'table') {
                                jQuery(oTD).css('background-color', val)
                            }
                            if (applyto == 'evenrows' && isEven(i + 1)) {
                                jQuery(oTD).css('background-color', val)
                            }
                            if (applyto == 'oddrows' && !isEven(i + 1)) {
                                jQuery(oTD).css('background-color', val)
                            } if (applyto == 'currentrow' && oTR == $activeCell.parents('tr').first()[0]) { jQuery(oTD).css('background-color', val) } if (applyto == 'currentcol' && j == getCellIndex(oTable, oRow, oCell)) { jQuery(oTD).css('background-color', val) }
                        }
                    } if ((jQuery('#inpCellBgColor').attr('data-initial-color') != jQuery('#inpCellBgColor').val()) || bManualColorChange) { $element.data('contenteditor').settings.onChange(); $element.data('contenteditor').settings.hasChanged = true; saveForUndo(); jQuery('#inpCellBgColor').attr('data-initial-color', jQuery('#inpCellBgColor').val()); bManualColorChange = false }
                });
                // if (!jQuery('#inpCellTextColor').colorPicker) {
                //     $('#inpCellTextColor').colorPicker.destroy();
                // }
                // jQuery('#inpCellTextColor').colorPicker({
                //     dark: '#222',
                //     light: '#DDD',
                //     renderCallback: function ($elm, toggled) {
                //         if (toggled === true) {
                //             jQuery('#inpCellTextColor').attr('data-initial-color', jQuery('#inpCellTextColor').val())
                //         } else if (toggled === false) {
                //             if (jQuery('#inpCellTextColor').attr('data-initial-color') != jQuery('#inpCellTextColor').val()) { $element.data('contenteditor').settings.onChange(); $element.data('contenteditor').settings.hasChanged = true; saveForUndo(); jQuery('#inpCellTextColor').attr('data-initial-color', jQuery('#inpCellTextColor').val()) }
                //         } else { if (!$activeCell) return; var val = jQuery('#inpCellTextColor').val(); restoreSelection(savedSel); var applyto = jQuery('#selTableApplyTo').val(); var oTable = $activeCell.parents('table').first()[0]; var oRow = $activeCell.parents('tr').first()[0]; var oCell = $activeCell[0]; if (applyto == 'currentcell') { $activeCell.css('color', val) } for (var i = 0; i < oTable.rows.length; i++) { var oTR = oTable.rows[i]; for (var j = 0; j < oTR.cells.length; j++) { var oTD = oTR.cells[j]; if (applyto == 'table') { jQuery(oTD).css('color', val) } if (applyto == 'evenrows' && isEven(i + 1)) { jQuery(oTD).css('color', val) } if (applyto == 'oddrows' && !isEven(i + 1)) { jQuery(oTD).css('color', val) } if (applyto == 'currentrow' && oTR == $activeCell.parents('tr').first()[0]) { jQuery(oTD).css('color', val) } if (applyto == 'currentcol' && j == getCellIndex(oTable, oRow, oCell)) { jQuery(oTD).css('color', val) } } } }
                //     }
                // });
                jQuery('#inpCellTextColor').off('keyup');
                jQuery('#inpCellTextColor').on('keyup', function (e) {
                    bManualColorChange = true
                });
                jQuery('#inpCellTextColor').off('blur');
                jQuery('#inpCellTextColor').on('blur', function () {
                    if (!$activeCell) return;
                    restoreSelection(savedSel);
                    var val = jQuery('#inpCellTextColor').val();
                    var applyto = jQuery('#selTableApplyTo').val();
                    var oTable = $activeCell.parents('table').first()[0];
                    var oRow = $activeCell.parents('tr').first()[0];
                    var oCell = $activeCell[0];
                    if (applyto == 'currentcell') {
                        $activeCell.css('color', val)
                    }
                    for (var i = 0; i < oTable.rows.length; i++) {
                        var oTR = oTable.rows[i];
                        for (var j = 0; j < oTR.cells.length; j++) {
                            var oTD = oTR.cells[j];
                            if (applyto == 'table') {
                                jQuery(oTD).css('color', val)
                            }
                            if (applyto == 'evenrows' && isEven(i + 1)) {
                                jQuery(oTD).css('color', val)
                            }
                            if (applyto == 'oddrows' && !isEven(i + 1)) {
                                jQuery(oTD).css('color', val)
                            }
                            if (applyto == 'currentrow' && oTR == $activeCell.parents('tr').first()[0]) {
                                jQuery(oTD).css('color', val)
                            }
                            if (applyto == 'currentcol' && j == getCellIndex(oTable, oRow, oCell)) {
                                jQuery(oTD).css('color', val)
                            }
                        }
                    }
                    if ((jQuery('#inpCellTextColor').attr('data-initial-color') != jQuery('#inpCellTextColor').val()) || bManualColorChange) {
                        $element.data('contenteditor').settings.onChange();
                        $element.data('contenteditor').settings.hasChanged = true;
                        saveForUndo();
                        jQuery('#inpCellTextColor').attr('data-initial-color', jQuery('#inpCellTextColor').val());
                        bManualColorChange = false
                    }
                });
                // if (!jQuery('#inpCellBorderColor').colorPicker) {
                //     $('#inpCellBorderColor').colorPicker.destroy();
                // }
                // jQuery('#inpCellBorderColor').colorPicker({
                //     dark: '#222',
                //     light: '#DDD',
                //     renderCallback: function ($elm, toggled) {
                //         if (toggled === true) {
                //             jQuery('#inpCellBorderColor').attr('data-initial-color', jQuery('#inpCellBorderColor').val())
                //         } else if (toggled === false) {
                //             if (jQuery('#inpCellBorderColor').attr('data-initial-color') != jQuery('#inpCellBorderColor').val()) {
                //                 $element.data('contenteditor').settings.onChange();
                //                 $element.data('contenteditor').settings.hasChanged = true;
                //                 saveForUndo();
                //                 jQuery('#inpCellBorderColor').attr('data-initial-color', jQuery('#inpCellBorderColor').val())
                //             }
                //         } else {
                //             if (!$activeCell) return;
                //             var val = jQuery('#inpCellBorderColor').val();
                //             var borderwidth = jQuery('#selCellBorderWidth').val();
                //             if (borderwidth == '0') {
                //                 jQuery('#selCellBorderWidth').val(1);
                //                 borderwidth = 1
                //             }
                //             restoreSelection(savedSel);
                //             var applyto = jQuery('#selTableApplyTo').val();
                //             var oTable = $activeCell.parents('table').first()[0];
                //             var oRow = $activeCell.parents('tr').first()[0];
                //             var oCell = $activeCell[0];
                //             if (applyto == 'currentcell') {
                //                 $activeCell.css('border-color', val);
                //                 $activeCell.css('border-width', borderwidth + 'px');
                //                 $activeCell.css('border-style', 'solid')
                //             }
                //             for (var i = 0; i < oTable.rows.length; i++) {
                //                 var oTR = oTable.rows[i];
                //                 for (var j = 0; j < oTR.cells.length; j++) {
                //                     var oTD = oTR.cells[j];
                //                     if (applyto == 'table') {
                //                         jQuery(oTD).css('border-color', val);
                //                         jQuery(oTD).css('border-width', borderwidth + 'px');
                //                         jQuery(oTD).css('border-style', 'solid')
                //                     }
                //                     if (applyto == 'evenrows' && isEven(i + 1)) {
                //                         jQuery(oTD).css('border-color', val);
                //                         jQuery(oTD).css('border-width', borderwidth + 'px');
                //                         jQuery(oTD).css('border-style', 'solid')
                //                     }
                //                     if (applyto == 'oddrows' && !isEven(i + 1)) {
                //                         jQuery(oTD).css('border-color', val);
                //                         jQuery(oTD).css('border-width', borderwidth + 'px');
                //                         jQuery(oTD).css('border-style', 'solid')
                //                     }
                //                     if (applyto == 'currentrow' && oTR == $activeCell.parents('tr').first()[0]) {
                //                         jQuery(oTD).css('border-color', val);
                //                         jQuery(oTD).css('border-width', borderwidth + 'px');
                //                         jQuery(oTD).css('border-style', 'solid')
                //                     }
                //                     if (applyto == 'currentcol' && j == getCellIndex(oTable, oRow, oCell)) {
                //                         jQuery(oTD).css('border-color', val);
                //                         jQuery(oTD).css('border-width', borderwidth + 'px');
                //                         jQuery(oTD).css('border-style', 'solid')
                //                     }
                //                 }
                //             }
                //         }
                //     }
                // });
                jQuery('#inpCellBorderColor').off('keyup');
                jQuery('#inpCellBorderColor').on('keyup', function (e) {
                    bManualColorChange = true
                });
                jQuery('#inpCellBorderColor').off('blur');
                jQuery('#inpCellBorderColor').on('blur', function () {
                    if (!$activeCell) return;
                    restoreSelection(savedSel);
                    var val = jQuery('#inpCellBorderColor').val();
                    var borderwidth = jQuery('#selCellBorderWidth').val();
                    var applyto = jQuery('#selTableApplyTo').val();
                    var oTable = $activeCell.parents('table').first()[0];
                    var oRow = $activeCell.parents('tr').first()[0];
                    var oCell = $activeCell[0];
                    if (applyto == 'currentcell') {
                        $activeCell.css('border-color', val);
                        $activeCell.css('border-width', borderwidth + 'px');
                        $activeCell.css('border-style', 'solid');
                        if (val == '') {
                            $activeCell.css('border-color', '');
                            $activeCell.css('border-width', '');
                            $activeCell.css('border-style', '');
                            jQuery('#selCellBorderWidth').val(0)
                        }
                    }
                    for (var i = 0; i < oTable.rows.length; i++) {
                        var oTR = oTable.rows[i];
                        for (var j = 0; j < oTR.cells.length; j++) {
                            var oTD = oTR.cells[j];
                            if (applyto == 'table') {
                                jQuery(oTD).css('border-color', val);
                                jQuery(oTD).css('border-width', borderwidth + 'px');
                                jQuery(oTD).css('border-style', 'solid');
                                if (val == '') {
                                    jQuery(oTD).css('border-color', '');
                                    jQuery(oTD).css('border-width', '');
                                    jQuery(oTD).css('border-style', '');
                                    jQuery('#selCellBorderWidth').val(0)
                                }
                            }
                            if (applyto == 'evenrows' && isEven(i + 1)) {
                                jQuery(oTD).css('border-color', val);
                                jQuery(oTD).css('border-width', borderwidth + 'px');
                                jQuery(oTD).css('border-style', 'solid');
                                if (val == '') {
                                    jQuery(oTD).css('border-color', '');
                                    jQuery(oTD).css('border-width', '');
                                    jQuery(oTD).css('border-style', '');
                                    jQuery('#selCellBorderWidth').val(0)
                                }
                            }
                            if (applyto == 'oddrows' && !isEven(i + 1)) {
                                jQuery(oTD).css('border-color', val);
                                jQuery(oTD).css('border-width', borderwidth + 'px');
                                jQuery(oTD).css('border-style', 'solid'); if (val == '') {
                                    jQuery(oTD).css('border-color', '');
                                    jQuery(oTD).css('border-width', '');
                                    jQuery(oTD).css('border-style', '');
                                    jQuery('#selCellBorderWidth').val(0)
                                }
                            }
                            if (applyto == 'currentrow' && oTR == $activeCell.parents('tr').first()[0]) {
                                jQuery(oTD).css('border-color', val);
                                jQuery(oTD).css('border-width', borderwidth + 'px');
                                jQuery(oTD).css('border-style', 'solid');
                                if (val == '') {
                                    jQuery(oTD).css('border-color', '');
                                    jQuery(oTD).css('border-width', '');
                                    jQuery(oTD).css('border-style', '');
                                    jQuery('#selCellBorderWidth').val(0)
                                }
                            } if (applyto == 'currentcol' && j == getCellIndex(oTable, oRow, oCell)) {
                                jQuery(oTD).css('border-color', val);
                                jQuery(oTD).css('border-width', borderwidth + 'px');
                                jQuery(oTD).css('border-style', 'solid');
                                if (val == '') {
                                    jQuery(oTD).css('border-color', '');
                                    jQuery(oTD).css('border-width', '');
                                    jQuery(oTD).css('border-style', '');
                                    jQuery('#selCellBorderWidth').val(0)
                                }
                            }
                        }
                    } if ((jQuery('#inpCellBorderColor').attr('data-initial-color') != jQuery('#inpCellBorderColor').val()) || bManualColorChange) {
                        $element.data('contenteditor').settings.onChange();
                        $element.data('contenteditor').settings.hasChanged = true;
                        saveForUndo();
                        jQuery('#inpCellBorderColor').attr('data-initial-color', jQuery('#inpCellBorderColor').val());
                        bManualColorChange = false
                    }
                }); jQuery('#selCellBorderWidth').off('change');
                jQuery('#selCellBorderWidth').on('change', function () {
                    if (!$activeCell) return;
                    var val = jQuery('#selCellBorderWidth').val();
                    var bordercolor = jQuery('#inpCellBorderColor').val();
                    if (bordercolor == '') {
                        jQuery('#inpCellBorderColor').val('rgb(0, 0, 0)');
                        jQuery('#inpCellBorderColor').css('background-color', 'rgb(0, 0, 0)');
                        jQuery('#inpCellBorderColor').css('color', '#ddd');
                        bordercolor = 'rgb(0, 0, 0)'
                    } restoreSelection(savedSel);
                    var applyto = jQuery('#selTableApplyTo').val();
                    var oTable = $activeCell.parents('table').first()[0];
                    var oRow = $activeCell.parents('tr').first()[0];
                    var oCell = $activeCell[0];
                    if (applyto == 'currentcell') {
                        $activeCell.css('border-width', val + 'px');
                        $activeCell.css('border-style', 'solid');
                        $activeCell.css('border-color', bordercolor);
                        if (val == '0') {
                            $activeCell.css('border-width', '');
                            $activeCell.css('border-style', '');
                            $activeCell.css('border-color', '');
                            jQuery('#inpCellBorderColor').val('');
                            jQuery('#inpCellBorderColor').css('background-color', '')
                        }
                    }
                    for (var i = 0; i < oTable.rows.length; i++) {
                        var oTR = oTable.rows[i];
                        for (var j = 0; j < oTR.cells.length; j++) {
                            var oTD = oTR.cells[j];
                            if (applyto == 'table') {
                                jQuery(oTD).css('border-width', val + 'px');
                                jQuery(oTD).css('border-style', 'solid');
                                jQuery(oTD).css('border-color', bordercolor);
                                if (val == '0') {
                                    jQuery(oTD).css('border-width', '');
                                    jQuery(oTD).css('border-style', '');
                                    jQuery(oTD).css('border-color', '');
                                    jQuery('#inpCellBorderColor').val('');
                                    jQuery('#inpCellBorderColor').css('background-color', '')
                                }
                            } if (applyto == 'evenrows' && isEven(i + 1)) {
                                jQuery(oTD).css('border-width', val + 'px');
                                jQuery(oTD).css('border-style', 'solid');
                                jQuery(oTD).css('border-color', bordercolor);
                                if (val == '0') {
                                    jQuery(oTD).css('border-width', '');
                                    jQuery(oTD).css('border-style', '');
                                    jQuery(oTD).css('border-color', '');
                                    jQuery('#inpCellBorderColor').val('');
                                    jQuery('#inpCellBorderColor').css('background-color', '')
                                }
                            }
                            if (applyto == 'oddrows' && !isEven(i + 1)) {
                                jQuery(oTD).css('border-width', val + 'px');
                                jQuery(oTD).css('border-style', 'solid');
                                jQuery(oTD).css('border-color', bordercolor);
                                if (val == '0') {
                                    jQuery(oTD).css('border-width', '');
                                    jQuery(oTD).css('border-style', '');
                                    jQuery(oTD).css('border-color', '');
                                    jQuery('#inpCellBorderColor').val('');
                                    jQuery('#inpCellBorderColor').css('background-color', '')
                                }
                            }
                            if (applyto == 'currentrow' && oTR == $activeCell.parents('tr').first()[0]) {
                                jQuery(oTD).css('border-width', val + 'px');
                                jQuery(oTD).css('border-style', 'solid');
                                jQuery(oTD).css('border-color', bordercolor);
                                if (val == '0') {
                                    jQuery(oTD).css('border-width', '');
                                    jQuery(oTD).css('border-style', '');
                                    jQuery(oTD).css('border-color', '');
                                    jQuery('#inpCellBorderColor').val('');
                                    jQuery('#inpCellBorderColor').css('background-color', '')
                                }
                            } if (applyto == 'currentcol' && j == getCellIndex(oTable, oRow, oCell)) {
                                jQuery(oTD).css('border-width', val + 'px');
                                jQuery(oTD).css('border-style', 'solid');
                                jQuery(oTD).css('border-color', bordercolor);
                                if (val == '0') {
                                    jQuery(oTD).css('border-width', '');
                                    jQuery(oTD).css('border-style', '');
                                    jQuery(oTD).css('border-color', '');
                                    jQuery('#inpCellBorderColor').val('');
                                    jQuery('#inpCellBorderColor').css('background-color', '')
                                }
                            }
                        }
                    } $element.data('contenteditor').settings.hasChanged = true;
                    $element.data('contenteditor').settings.onChange();
                    saveForUndo()
                }); jQuery('[data-rte-cmd="rowabove"]').off('click');
                jQuery('[data-rte-cmd="rowabove"]').click(function (e) {
                    if (!$activeCell) return;
                    var oTable = $activeCell.parents('table').first()[0];
                    var oRow = $activeCell.parents('tr').first()[0];
                    var oNewRow = oTable.insertRow(oRow.rowIndex);
                    for (var i = 0; i < oRow.cells.length; i++) {
                        var oNewCell = oNewRow.insertCell(oNewRow.cells.length);
                        jQuery(oNewCell).attr('style', $activeCell.attr('style'));
                        jQuery(oNewCell).attr('valign', 'top');
                        jQuery(oNewCell).html('<br>')
                    }
                    $element.data('contenteditor').settings.hasChanged = true;
                    $element.data('contenteditor').settings.onChange();
                    saveForUndo()
                });
                jQuery('[data-rte-cmd="rowbelow"]').off('click');
                jQuery('[data-rte-cmd="rowbelow"]').click(function (e) {
                    if (!$activeCell) return;
                    var oTable = $activeCell.parents('table').first()[0];
                    var oRow = $activeCell.parents('tr').first()[0];
                    var oNewRow = oTable.insertRow(oRow.rowIndex + 1);
                    for (var i = 0; i < oRow.cells.length; i++) {
                        var oNewCell = oNewRow.insertCell(oNewRow.cells.length);
                        jQuery(oNewCell).attr('style', $activeCell.attr('style'));
                        jQuery(oNewCell).attr('valign', 'top');
                        jQuery(oNewCell).html('<br>')
                    }
                    $element.data('contenteditor').settings.hasChanged = true;
                    $element.data('contenteditor').settings.onChange();
                    saveForUndo()
                });
                jQuery('[data-rte-cmd="columnleft"]').off('click');
                jQuery('[data-rte-cmd="columnleft"]').click(function (e) {
                    if (!$activeCell) return;
                    var oTable = $activeCell.parents('table').first()[0];
                    var oRow = $activeCell.parents('tr').first()[0];
                    var oCell = $activeCell[0];
                    var nCellIndex = oCell.cellIndex;
                    for (var i = 0; i < oTable.rows.length; i++) {
                        var oRowTmp = oTable.rows[i];
                        var oNewCell = oRowTmp.insertCell(nCellIndex);
                        jQuery(oNewCell).attr('style', $activeCell.attr('style'));
                        jQuery(oNewCell).attr('valign', 'top');
                        jQuery(oNewCell).html('<br>')
                    }
                    $element.data('contenteditor').settings.hasChanged = true;
                    $element.data('contenteditor').settings.onChange();
                    saveForUndo()
                });
                jQuery('[data-rte-cmd="columnright"]').off('click');
                jQuery('[data-rte-cmd="columnright"]').click(function (e) {
                    if (!$activeCell) return;
                    var oTable = $activeCell.parents('table').first()[0];
                    var oRow = $activeCell.parents('tr').first()[0];
                    var oCell = $activeCell[0];
                    var nCellIndex = oCell.cellIndex;
                    for (var i = 0; i < oTable.rows.length; i++) {
                        var oRowTmp = oTable.rows[i];
                        var oNewCell = oRowTmp.insertCell(nCellIndex + 1);
                        jQuery(oNewCell).attr('style', $activeCell.attr('style'));
                        jQuery(oNewCell).attr('valign', 'top');
                        jQuery(oNewCell).html('<br>')
                    }
                    $element.data('contenteditor').settings.hasChanged = true;
                    $element.data('contenteditor').settings.onChange();
                    saveForUndo()
                });
                jQuery('[data-rte-cmd="delrow"]').off('click');
                jQuery('[data-rte-cmd="delrow"]').click(function (e) {
                    if (!$activeCell) return;
                    var oTable = $activeCell.parents('table').first()[0];
                    var oRow = $activeCell.parents('tr').first()[0];
                    oTable.deleteRow(oRow.rowIndex);
                    $activeCell = null;
                    if (oTable.rows.length == 0) {
                        oTable.parentNode.removeChild(oTable);
                        jQuery("#divRteTable").stop(true, true).fadeOut(0);
                        if (jQuery("#md-edittable").data("simplemodal"))
                            jQuery("#md-edittable").data("simplemodal").hide()
                    }
                    $element.data('contenteditor').settings.hasChanged = true;
                    $element.data('contenteditor').settings.onChange();
                    saveForUndo()
                });
                jQuery('[data-rte-cmd="delcolumn"]').off('click');
                jQuery('[data-rte-cmd="delcolumn"]').click(function (e) {
                    if (!$activeCell) return;
                    var oTable = $activeCell.parents('table').first()[0];
                    var oRow = $activeCell.parents('tr').first()[0];
                    var oCell = $activeCell[0];
                    var nCellIndex = oCell.cellIndex;
                    for (var i = 0; i < oTable.rows.length; i++)oTable.rows[i].deleteCell(nCellIndex); $activeCell = null;
                    if (oTable.rows[0].cells.length == 0) {
                        oTable.parentNode.removeChild(oTable);
                        jQuery("#divRteTable").stop(true, true).fadeOut(0);
                        if (jQuery("#md-edittable").data("simplemodal"))
                            jQuery("#md-edittable").data("simplemodal").hide()
                    }
                    $element.data('contenteditor').settings.hasChanged = true;
                    $element.data('contenteditor').settings.onChange();
                    saveForUndo()
                });
                jQuery('[data-rte-cmd="mergecell"]').off('click');
                jQuery('[data-rte-cmd="mergecell"]').click(function (e) {
                    if (!$activeCell) return;
                    var oTable = $activeCell.parents('table').first()[0];
                    var oRow = $activeCell.parents('tr').first()[0];
                    var oCell = $activeCell[0]; oCell.colSpan = oCell.colSpan + 1;
                    if (oCell.cellIndex + 1 < oTable.rows[oRow.rowIndex].cells.length) {
                        oTable.rows[oRow.rowIndex].deleteCell(oCell.cellIndex + 1)
                    }
                    $element.data('contenteditor').settings.hasChanged = true;
                    $element.data('contenteditor').settings.onChange();
                    saveForUndo()
                })
            }); jQuery('[data-rte-cmd="align"]').off('click');
            jQuery('[data-rte-cmd="align"]').click(function (e) {
                var savedSel = saveSelection();
                var top = jQuery(this).offset().top - jQuery(window).scrollTop();
                var left = jQuery(this).offset().left;
                if (jQuery('#rte-toolbar').hasClass('rte-side')) {
                    jQuery('#pop-align').addClass('rte-side');
                    if (jQuery('#rte-toolbar').hasClass('right')) {
                        left = left - 58
                    }
                    else {
                        left = left + 57
                    }
                } else {
                    top = top + 51
                }
                jQuery('#pop-align').css('position', 'fixed');
                jQuery('#pop-align').css('top', top + 'px');
                jQuery('#pop-align').css('left', left + 'px');
                $element.data('contenteditor').closePop();
                jQuery('#pop-align').css('display', 'block');
                jQuery(this).addClass('on');
                e.preventDefault();
                jQuery('.md-pickalign').off('click');
                jQuery('.md-pickalign').click(function () {
                    restoreSelection(savedSel);
                    var el;
                    var curr;
                    if (window.getSelection) {
                        curr = window.getSelection().getRangeAt(0).commonAncestorContainer;
                        if (curr.nodeType == 3) {
                            el = curr.parentNode
                        } else {
                            el = curr
                        }
                    }
                    else if (document.selection) {
                        curr = document.selection.createRange();
                        el = document.selection.createRange().parentElement()
                    }
                    var s = jQuery(this).data('align');
                    var sTagName = jQuery(el).prop("tagName").toLowerCase();
                    if (sTagName == 'h1' || sTagName == 'h2' || sTagName == 'h3' || sTagName == 'h4' || sTagName == 'h5' || sTagName == 'h6' || sTagName == 'p' || sTagName == 'div') {
                        jQuery(el).css('text-align', s)
                    }
                    else {
                        jQuery(el).parents('h1,h2,h3,h4,h5,h6,p,div').first().css('text-align', s)
                    }
                    jQuery(this).blur();
                    $element.data('contenteditor').getState();
                    $element.data('contenteditor').settings.hasChanged = true;
                    $element.data('contenteditor').settings.onChange();
                    e.preventDefault();
                    saveForUndo()
                })
            }); jQuery('[data-rte-cmd="list"]').off('click');
            jQuery('[data-rte-cmd="list"]').click(function (e) {
                var savedSel = saveSelection();
                var top = jQuery(this).offset().top - jQuery(window).scrollTop();
                var left = jQuery(this).offset().left;
                if (jQuery('#rte-toolbar').hasClass('rte-side')) {
                    jQuery('#pop-list').addClass('rte-side');
                    if (jQuery('#rte-toolbar').hasClass('right')) {
                        left = left - 58
                    } else {
                        left = left + 57
                    }
                }
                else {
                    top = top + 51
                } jQuery('#pop-list').css('position', 'fixed');
                jQuery('#pop-list').css('top', top + 'px');
                jQuery('#pop-list').css('left', left + 'px');
                $element.data('contenteditor').closePop();
                jQuery('#pop-list').css('display', 'block');
                jQuery(this).addClass('on'); e.preventDefault();
                jQuery('.md-picklist').off('click');
                jQuery('.md-picklist').click(function () {
                    restoreSelection(savedSel);
                    var s = jQuery(this).data('list');
                    try {
                        if (s == 'normal') {
                            document.execCommand('outdent', false, null);
                            document.execCommand('outdent', false, null);
                            document.execCommand('outdent', false, null)
                        } else {
                            document.execCommand(s, false, null);
                            var el;
                            if (window.getSelection) {
                                el = window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode;
                                el = el.parentNode
                            } else if (document.selection) {
                                el = document.selection.createRange().parentElement();
                                el = el.parentElement()
                            }
                            if (el.nodeName == 'UL' || el.nodeName == 'OL') {
                                if (jQuery(el).parent().prop("tagName").toLowerCase() == "p") {
                                    el.setAttribute('contenteditable', true);
                                    jQuery(el).parent().replaceWith(function () {
                                        return this.innerHTML
                                    })
                                }
                            }
                        }
                    } catch (e) {
                        $activeElement.parents('div').addClass('edit');
                        var el;
                        if (window.getSelection) {
                            el = window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode;
                            el = el.parentNode
                        } else if (document.selection) {
                            el = document.selection.createRange().parentElement();
                            el = el.parentElement()
                        }
                        el.setAttribute('contenteditable', true);
                        if (s == 'normal') {
                            document.execCommand('outdent', false, null);
                            document.execCommand('outdent', false, null);
                            document.execCommand('outdent', false, null)
                        } else {
                            document.execCommand(s, false, null)
                        }
                        el.removeAttribute('contenteditable');
                        $element.data('contenteditor').render()
                    }
                    $element.data('contenteditor').getState();
                    $element.data('contenteditor').settings.hasChanged = true;
                    $element.data('contenteditor').settings.onChange();
                    e.preventDefault();
                    saveForUndo()
                })
            }); jQuery('[data-rte-cmd="createLink"]').off('click');
            jQuery('[data-rte-cmd="createLink"]').click(function (e) {
                var html = ""; if (typeof window.getSelection != "undefined") {
                    var sel = window.getSelection();
                    if (sel.rangeCount) {
                        var container = document.createElement("div");
                        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                            container.appendChild(sel.getRangeAt(i).cloneContents())
                        }
                        html = container.innerHTML
                    }
                } else if (typeof document.selection != "undefined") {
                    if (document.selection.type == "Text") {
                        html = document.selection.createRange().htmlText
                    }
                } if (html == '') {
                    var s = window.getSelection();
                    var range = s.getRangeAt(0);
                    var node = s.anchorNode;
                    while (range.startOffset !== 0) {
                        range.setStart(node, range.startOffset - 1);
                        if (range.toString().search(/\s/) === 0) {
                            range.setStart(node, range.startOffset + 1);
                            break
                        }
                    } while (range.endOffset < node.length) {
                        range.setEnd(node, range.endOffset + 1);
                        if (range.toString().search(/\s/) !== -1) {
                            range.setEnd(node, range.endOffset - 1);
                            break
                        }
                    }
                    selectRange(range)
                }
                var el;
                if (window.getSelection) {
                    el = window.getSelection().getRangeAt(0).commonAncestorContainer
                } else if (document.selection) {
                    el = document.selection.createRange()
                }
                if (el.nodeName.toLowerCase() == 'a') {
                    $activeLink = jQuery(el)
                } else {
                    document.execCommand('createLink', false, 'http://dummy');
                    $activeLink = jQuery("a[href='http://dummy']").first();
                    $activeLink.attr('href', 'http://')
                }
                jQuery('#md-createlink').css('max-width', '550px');
                jQuery('#md-createlink').simplemodal({
                    noOverlay: true,
                    onCancel: function () {
                        if ($activeLink.attr('href') == 'http://')
                            $activeLink.replaceWith($activeLink.html())
                    }
                });
                jQuery('#md-createlink').data('simplemodal').show();
                $element.data('contenteditor').closePop();
                jQuery('#txtLink').val($activeLink.attr('href'));
                jQuery('#txtLinkText').val($activeLink.html());
                jQuery('#txtLinkTitle').val($activeLink.attr('title'));
                if ($activeLink.attr('target') == '_blank') {
                    jQuery('#chkNewWindow').prop('checked', true)
                } else {
                    jQuery('#chkNewWindow').prop('checked', false)
                } jQuery('#btnLinkOk').off('click');
                jQuery('#btnLinkOk').on('click', function (e) {
                    $activeLink.attr('href', jQuery('#txtLink').val());
                    if (jQuery('#txtLink').val() == 'http://' || jQuery('#txtLink').val() == '') {
                        $activeLink.replaceWith($activeLink.html())
                    }
                    $activeLink.html(jQuery('#txtLinkText').val());
                    $activeLink.attr('title', jQuery('#txtLinkTitle').val());
                    if (jQuery('#chkNewWindow').is(":checked")) {
                        $activeLink.attr('target', '_blank')
                    } else {
                        $activeLink.removeAttr('target')
                    }
                    jQuery('#md-createlink').data('simplemodal').hide();
                    $element.data('contenteditor').settings.onChange();
                    $element.data('contenteditor').settings.hasChanged = true;
                    $element.data('contenteditor').render();
                    saveForUndo()
                });
                e.preventDefault()
            });
            jQuery('[data-rte-cmd="icon"]').off('click');
            jQuery('[data-rte-cmd="icon"]').click(function (e) {
                $savedSel = saveSelection();
                $activeIcon = null;
                var iconselect = $element.data('contenteditor').settings.iconselect;
                if (jQuery('#ifrIconSelect').attr('src').indexOf('blank.html') != -1) {
                    jQuery('#ifrIconSelect').attr('src', iconselect)
                }
                jQuery('#md-icon-select').css('max-width', '775px');
                jQuery('#md-icon-select').simplemodal({ noOverlay: true });
                jQuery('#md-icon-select').data('simplemodal').show($savedSel);
                $element.data('contenteditor').closePop();
                e.preventDefault();
                return
            });
            jQuery('[data-rte-cmd="tags"]').off('click');
            jQuery('[data-rte-cmd="tags"]').click(function (e) {
                jQuery('#md-tags-select').css('max-width', '255px');
                jQuery('#md-tags-select').simplemodal({
                    noOverlay: true
                });
                jQuery('#md-tags-select').data('simplemodal').show(savedSel);
                $element.data('contenteditor').closePop();
                var s = '';
                for (var j = 0; j < $element.data('contenteditor').settings.customTags.length; j++) {
                    s += '<button class="md-pick-tag" style="width:100%" data-value="' + $element.data('contenteditor').settings.customTags[j][1] + '"> ' + $element.data('contenteditor').settings.customTags[j][0] + ' </button>'
                }
                jQuery('#divCustomTags').html(s);
                jQuery('.md-pick-tag').off('click');
                jQuery('.md-pick-tag').click(function () {
                    var val = jQuery(this).data("value"); pasteHtmlAtCaret(val, true);
                    jQuery('#md-tags-select').data('simplemodal').hide();
                    saveForUndo()
                }); e.preventDefault();
                return
            });
            $element.off('mouseenter mouseleave', '.embed-responsive');
            $element.on('mouseenter mouseleave', '.embed-responsive', function (e) {
                switch (e.type) {
                    case 'mouseenter':
                        if (jQuery(this).parents("[data-html]").length > 0) return;
                        if (jQuery(this).parents("[data-mode='readonly']").length > 0) return;
                        if (jQuery(this).parents("[data-mode='readonly-protected']").length > 0) return;
                        var _top;
                        var _left;
                        var scrolltop = jQuery(window).scrollTop();
                        var offsettop = jQuery(this).offset().top;
                        var offsetleft = jQuery(this).offset().left;
                        var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                        var is_ie = detectIE(); var browserok = true;
                        if (is_firefox || is_ie) browserok = false;
                        if (browserok) { _top = (offsettop - 20) + (scrolltop - scrolltop); _left = offsetleft } else {
                            if (is_ie) {
                                var space = $element.getPos().top;
                                var adjy_val = (-space / 1.1) + space / 1.1;
                                var space2 = $element.getPos().left;
                                var adjx_val = -space2 + space2;
                                var p = jQuery(this).getPos(); _top = (p.top - 20) + adjy_val; _left = p.left + adjx_val
                            }
                            if (is_firefox) {
                                _top = offsettop - 20;
                                _left = offsetleft
                            }
                        }
                        jQuery("#divFrameLink").css("top", _top + "px");
                        jQuery("#divFrameLink").css("left", _left + "px");
                        jQuery("#divFrameLink").stop(true, true).css({
                            display: 'none'
                        }).fadeIn(20);
                        $activeFrame = jQuery(this).find('iframe');
                        jQuery("#divFrameLink").off('click');
                        jQuery("#divFrameLink").on('click', function (e) {
                            var currentSrcUrl = $activeFrame.attr('src');
                            var embeddedYoutubeRegex = /^.*\/\/www.youtube.com\/embed\//;
                            var embeddedVimeoRegex = /^.*\/\/player.vimeo.com\/video\//;
                            if (embeddedYoutubeRegex.exec(currentSrcUrl) != null || embeddedVimeoRegex.exec(currentSrcUrl) != null) {
                                if (jQuery('#md-createiframe').data('simplemodal')) jQuery('#md-createiframe').data('simplemodal').hide(); jQuery('#md-createsrc').css('max-width', '550px'); jQuery('#md-createsrc').simplemodal({
                                    noOverlay: true
                                });
                                jQuery('#md-createsrc').data('simplemodal').show();
                                $element.data('contenteditor').closePop();
                                jQuery('#txtSrc').val($activeFrame.attr('src'));
                                jQuery('#btnSrcOk').off('click');
                                jQuery('#btnSrcOk').on('click', function (e) {
                                    var srcUrl = jQuery('#txtSrc').val();
                                    var youRegex = /^http[s]?:\/\/(((www.youtube.com\/watch\?(feature=player_detailpage&)?)v=)|(youtu.be\/))([^#\&\?]*)/; var vimeoRegex = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/)|(video\/))?([0-9]+)\/?/;
                                    var youRegexMatches = youRegex.exec(srcUrl);
                                    var vimeoRegexMatches = vimeoRegex.exec(srcUrl);
                                    if (youRegexMatches != null || vimeoRegexMatches != null) {
                                        if (youRegexMatches != null && youRegexMatches.length >= 7) {
                                            var youMatch = youRegexMatches[6];
                                            srcUrl = '//www.youtube.com/embed/' + youMatch + '?rel=0'
                                        }
                                        if (vimeoRegexMatches != null && vimeoRegexMatches.length >= 7) {
                                            var vimeoMatch = vimeoRegexMatches[6];
                                            srcUrl = '//player.vimeo.com/video/' + vimeoMatch
                                        }
                                    } $activeFrame.attr('src', srcUrl);
                                    if (jQuery('#txtSrc').val() == '') {
                                        $activeFrame.attr('src', '')
                                    }
                                    jQuery('#md-createsrc').data('simplemodal').hide(); $element.data('contenteditor').settings.onChange(); $element.data('contenteditor').settings.hasChanged = true;
                                    $element.data('contenteditor').render();
                                    saveForUndo()
                                })
                            } else {
                                if (jQuery('#md-createsrc').data('simplemodal'))
                                    jQuery('#md-createsrc').data('simplemodal').hide();
                                jQuery('#md-createiframe').css('max-width', '550px');
                                jQuery('#md-createiframe').simplemodal({
                                    noOverlay: true
                                });
                                jQuery('#md-createiframe').data('simplemodal').show();
                                $element.data('contenteditor').closePop();
                                jQuery('#txtIframe').val($activeFrame[0].outerHTML);
                                jQuery('#btnIframeOk').off('click');
                                jQuery('#btnIframeOk').on('click', function (e) {
                                    var iframeSrc = jQuery('#txtIframe').val();
                                    if (iframeSrc != '') {
                                        $activeFrame.replaceWith(iframeSrc)
                                    }
                                    jQuery('#md-createiframe').data('simplemodal').hide(); $element.data('contenteditor').settings.onChange(); $element.data('contenteditor').settings.hasChanged = true; $element.data('contenteditor').render(); saveForUndo()
                                })
                            }
                        }); jQuery('#divFrameLink').off('mouseenter mouseleave'); jQuery('#divFrameLink').on('mouseenter mouseleave', function (e) { switch (e.type) { case 'mouseenter': jQuery(this).stop(true, true).css("display", "block"); break; case 'mouseleave': jQuery(this).stop(true, true).fadeOut(0); break } }); if (jQuery(this).parents(".ui-draggable").css('outline-style') == 'none') { jQuery(this).find('.ovl').css('z-index', '1') } break; case 'mouseleave': jQuery(this).find('.ovl').css('z-index', '-1'); jQuery("#divFrameLink").stop(true, true).fadeOut(0); break
                }
            }); $element.off('mouseenter mouseleave', 'a'); $element.on('mouseenter mouseleave', 'a', function (e) { if (jQuery(this).hasClass('not-a')) return; switch (e.type) { case 'mouseenter': if (jQuery('#md-createlink').css('display') == 'block') return; if (jQuery(this).parents("[data-html]").length > 0) return; if (jQuery(this).parents("[data-mode='readonly']").length > 0) return; if (jQuery(this).parents("[data-mode='readonly-protected']").length > 0) return; if (jQuery(this).children('img').length == 1 && jQuery(this).children().length == 1) return; var _top; var _left; var scrolltop = jQuery(window).scrollTop(); var offsettop = jQuery(this).offset().top; var offsetleft = jQuery(this).offset().left; var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1; var is_ie = detectIE(); var browserok = true; if (is_firefox || is_ie) browserok = false; if (browserok) { _top = (offsettop - 27) + (scrolltop - scrolltop); _left = offsetleft } else { if (is_ie) { var space = $element.getPos().top; var adjy_val = (-space / 1.1) + space / 1.1; var space2 = $element.getPos().left; var adjx_val = -space2 + space2; var p = jQuery(this).getPos(); _top = (p.top - 25) + adjy_val; _left = p.left + adjx_val } if (is_firefox) { _top = offsettop - 25; _left = offsetleft } } jQuery("#divRteLink").css("top", _top + "px"); jQuery("#divRteLink").css("left", _left + "px"); jQuery("#divRteLink").stop(true, true).css({ display: 'none' }).fadeIn(20); $activeLink = jQuery(this); jQuery("#divRteLink").off('click'); jQuery("#divRteLink").on('click', function (e) { jQuery('#md-createlink').css('max-width', '550px'); jQuery('#md-createlink').simplemodal({ noOverlay: true, onCancel: function () { if ($activeLink.attr('href') == 'http://') $activeLink.replaceWith($activeLink.html()) } }); jQuery('#md-createlink').data('simplemodal').show(); $element.data('contenteditor').closePop(); jQuery('#txtLink').val($activeLink.attr('href')); jQuery('#txtLinkText').val($activeLink.html()); jQuery('#txtLinkTitle').val($activeLink.attr('title')); if ($activeLink.attr('target') == '_blank') { jQuery('#chkNewWindow').prop('checked', true) } else { jQuery('#chkNewWindow').prop('checked', false) } jQuery('#btnLinkOk').off('click'); jQuery('#btnLinkOk').on('click', function (e) { $activeLink.attr('href', jQuery('#txtLink').val()); if (jQuery('#txtLink').val() == 'http://' || jQuery('#txtLink').val() == '') { $activeLink.replaceWith($activeLink.html()) } $activeLink.html(jQuery('#txtLinkText').val()); $activeLink.attr('title', jQuery('#txtLinkTitle').val()); if (jQuery('#chkNewWindow').is(":checked")) { $activeLink.attr('target', '_blank') } else { $activeLink.removeAttr('target') } jQuery('#md-createlink').data('simplemodal').hide(); $element.data('contenteditor').settings.onChange(); $element.data('contenteditor').settings.hasChanged = true; $element.data('contenteditor').render(); saveForUndo() }) }); jQuery("#divRteLink").off('mouseenter mouseleave'); jQuery("#divRteLink").on('mouseenter mouseleave', function (e) { switch (e.type) { case 'mouseenter': jQuery(this).stop(true, true).css("display", "block"); break; case 'mouseleave': jQuery(this).stop(true, true).fadeOut(0); break } }); break; case 'mouseleave': jQuery("#divRteLink").stop(true, true).fadeOut(0); break } }); jQuery("#btnLinkBrowse").off('click'); jQuery("#btnLinkBrowse").on('click', function (e) { jQuery("#divToolImg").stop(true, true).fadeOut(0); jQuery("#divToolImgSettings").stop(true, true).fadeOut(0); jQuery("#divRteLink").stop(true, true).fadeOut(0); jQuery("#divFrameLink").stop(true, true).fadeOut(0); var sFunc = ($element.data('contenteditor').settings.onFileSelectClick + '').replace(/\s/g, ''); if (sFunc != 'function(){}') { $element.data('contenteditor').settings.onFileSelectClick({ targetInput: jQuery("#txtLink").get(0), theTrigger: jQuery("#btnLinkBrowse").get(0) }) } else { jQuery('#ifrFileBrowse').attr('src', $element.data('contenteditor').settings.fileselect); jQuery('#active-input').val('txtLink'); jQuery('#md-fileselect').css('width', '65%'); jQuery('#md-fileselect').simplemodal(); jQuery('#md-fileselect').data('simplemodal').show(); $element.data('contenteditor').closePop() } }); $element.data('contenteditor').settings.onRender(); $element.data('contenteditor').contentRender()
        }; this.prepareRteCommand = function (s) { jQuery('[data-rte-cmd="' + s + '"]').off('click'); jQuery('[data-rte-cmd="' + s + '"]').click(function (e) { try { document.execCommand(s, false, null) } catch (e) { $element.attr('contenteditable', true); document.execCommand(s, false, null); $element.removeAttr('contenteditable'); $element.data('contenteditor').render() } $element.data('contenteditor').getState(); $element.data('contenteditor').settings.onChange(); $element.data('contenteditor').settings.hasChanged = true; e.preventDefault() }) }; this.applyColor = function (s, text) { var el; var curr; if (window.getSelection) { curr = window.getSelection().getRangeAt(0).commonAncestorContainer; if (curr.nodeType == 3) { el = curr.parentNode } else { el = curr } } else if (document.selection) { curr = document.selection.createRange(); el = document.selection.createRange().parentElement() } var selColMode = jQuery('#selColorApplyTo').val(); if (jQuery.trim(text) != '' && jQuery(el).text() != text) { if (selColMode == 1) { document.execCommand("ForeColor", false, s) } if (selColMode == 2) { document.execCommand("BackColor", false, s) } var fontElements = document.getElementsByTagName("font"); for (var i = 0, len = fontElements.length; i < len; ++i) { var s = fontElements[i].color; if (s != '') { fontElements[i].removeAttribute("color"); fontElements[i].style.color = s } } var is_ie = detectIE(); if (is_ie) { $activeElement.find('span').each(function () { if (jQuery(this).find('span').length == 1) { if (jQuery(this).text() == jQuery(this).find('span:first').text()) { var innerspanstyle = jQuery(this).find('span:first').attr('style'); jQuery(this).html(jQuery(this).find('span:first').html()); var newstyle = jQuery(this).attr('style') + ';' + innerspanstyle; jQuery(this).attr('style', newstyle) } } }) } } else if (jQuery(el).text() == text) { if (selColMode == 1) { if (jQuery(el).html()) { jQuery(el).css('color', s) } else { jQuery(el).parent().css('color', s) } } if (selColMode == 2) { if (jQuery(el).html()) { jQuery(el).css('background-color', s) } else { jQuery(el).parent().css('background-color', s) } } } else { if (selColMode == 1) { jQuery(el).css('color', s) } if (selColMode == 2) { jQuery(el).css('background-color', s) } }; if (selColMode == 3) { jQuery(el).parents('.ui-draggable').children().first().css('background-color', s) } }; this.init()
    }; jQuery.fn.contenteditor = function (options) { return this.each(function () { instances.push(this); if (undefined == jQuery(this).data('contenteditor')) { var plugin = new jQuery.contenteditor(this, options); jQuery(this).data('contenteditor', plugin) } }) }
})(jQuery); function ce_closePop() { jQuery('.rte-pop').css('display', 'none'); jQuery('[data-rte-cmd="formatting"]').removeClass('on'); jQuery('[data-rte-cmd="textsettings"]').removeClass('on'); jQuery('[data-rte-cmd="color"]').removeClass('on'); jQuery('[data-rte-cmd="font"]').removeClass('on'); jQuery('[data-rte-cmd="formatPara"]').removeClass('on'); jQuery('[data-rte-cmd="align"]').removeClass('on'); jQuery('[data-rte-cmd="list"]').removeClass('on'); jQuery('[data-rte-cmd="table"]').removeClass('on') }; function pasteContent($activeElement) { var savedSel = saveSelection(); jQuery('#idContentWord').remove(); var tmptop = $activeElement.offset().top; jQuery('#divCb').append("<div style='position:absolute;z-index:-1000;top:" + tmptop + "px;left:-1000px;width:1px;height:1px;overflow:auto;' name='idContentWord' id='idContentWord' contenteditable='true'></div>"); var pasteFrame = document.getElementById("idContentWord"); pasteFrame.focus(); setTimeout(function () { try { restoreSelection(savedSel); var $node = jQuery(getSelectionStartNode()); if (jQuery('#idContentWord').length == 0) return; var sPastedText = ''; var bRichPaste = false; if (jQuery('#idContentWord table').length > 0 || jQuery('#idContentWord img').length > 0 || jQuery('#idContentWord p').length > 0 || jQuery('#idContentWord a').length > 0) { bRichPaste = true } if (bRichPaste) { sPastedText = jQuery('#idContentWord').html(); sPastedText = cleanHTML(sPastedText); jQuery('#idContentWord').html(sPastedText); if (jQuery('#idContentWord').children('p,h1,h2,h3,h4,h5,h6,ul,li').length > 1) { jQuery('#idContentWord').contents().filter(function () { return (this.nodeType == 3 && jQuery.trim(this.nodeValue) != '') }).wrap("<p></p>").end().filter("br").remove() } sPastedText = '<div class="edit">' + jQuery('#idContentWord').html() + '</div>' } else { jQuery('#idContentWord').find('p,h1,h2,h3,h4,h5,h6').each(function () { jQuery(this).html(jQuery(this).html() + ' ') }); sPastedText = jQuery('#idContentWord').text() } jQuery('#idContentWord').remove(); var oSel = window.getSelection(); var range = oSel.getRangeAt(0); range.extractContents(); range.collapse(true); var docFrag = range.createContextualFragment(sPastedText); var lastNode = docFrag.lastChild; range.insertNode(docFrag); range.setStartAfter(lastNode); range.setEndAfter(lastNode); range.collapse(false); var comCon = range.commonAncestorContainer; if (comCon && comCon.parentNode) { try { comCon.parentNode.normalize() } catch (e) { } } oSel.removeAllRanges(); oSel.addRange(range) } catch (e) { jQuery('#idContentWord').remove() } }, 200) } var savedSel; function saveSelection() { if (window.getSelection) { sel = window.getSelection(); if (sel.getRangeAt && sel.rangeCount) { var ranges = []; for (var i = 0, len = sel.rangeCount; i < len; ++i) { ranges.push(sel.getRangeAt(i)) } return ranges } } else if (document.selection && document.selection.createRange) { return document.selection.createRange() } return null }; function restoreSelection(savedSel) { if (savedSel) { if (window.getSelection) { sel = window.getSelection(); sel.removeAllRanges(); for (var i = 0, len = savedSel.length; i < len; ++i) { sel.addRange(savedSel[i]) } } else if (document.selection && savedSel.select) { savedSel.select() } } }; function getSelectionStartNode() { var node, selection; if (window.getSelection) { selection = getSelection(); node = selection.anchorNode } if (!node && document.selection) { selection = document.selection; var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange(); node = range.commonAncestorContainer ? range.commonAncestorContainer : range.parentElement ? range.parentElement() : range.item(0) } if (node) { return (node.nodeName == "#text" ? node.parentNode : node) } }; var getSelectedNode = function () { var node, selection; if (window.getSelection) { selection = getSelection(); node = selection.anchorNode } if (!node && document.selection) { selection = document.selection; var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange(); node = range.commonAncestorContainer ? range.commonAncestorContainer : range.parentElement ? range.parentElement() : range.item(0) } if (node) { return (node.nodeName == "#text" ? node.parentNode : node) } }; function getSelected() { if (window.getSelection) { return window.getSelection() } else if (document.getSelection) { return document.getSelection() } else { var selection = document.selection && document.selection.createRange(); if (selection.text) { return selection.text } return false } return false }; function pasteHtmlAtCaret(html, selectPastedContent) { var sel, range; if (window.getSelection) { sel = window.getSelection(); if (sel.getRangeAt && sel.rangeCount) { range = sel.getRangeAt(0); range.deleteContents(); var el = document.createElement("div"); el.innerHTML = html; var frag = document.createDocumentFragment(), node, lastNode; while ((node = el.firstChild)) { lastNode = frag.appendChild(node) } var firstNode = frag.firstChild; range.insertNode(frag); if (lastNode) { range = range.cloneRange(); range.setStartAfter(lastNode); if (selectPastedContent) { range.setStartBefore(firstNode) } else { range.collapse(true) } sel.removeAllRanges(); sel.addRange(range) } } } else if ((sel = document.selection) && sel.type != "Control") { var originalRange = sel.createRange(); originalRange.collapse(true); sel.createRange().pasteHTML(html); if (selectPastedContent) { range = sel.createRange(); range.setEndPoint("StartToStart", originalRange); range.select() } } } var $savedSel; var $activeIcon; function applyIconClass(s) { if ($activeIcon) { var sClassSize = ""; if ($activeIcon.hasClass('size-12')) sClassSize = 'size-12'; if ($activeIcon.hasClass('size-14')) sClassSize = 'size-14'; if ($activeIcon.hasClass('size-16')) sClassSize = 'size-16'; if ($activeIcon.hasClass('size-18')) sClassSize = 'size-18'; if ($activeIcon.hasClass('size-21')) sClassSize = 'size-21'; if ($activeIcon.hasClass('size-24')) sClassSize = 'size-24'; if ($activeIcon.hasClass('size-32')) sClassSize = 'size-32'; if ($activeIcon.hasClass('size-48')) sClassSize = 'size-48'; if ($activeIcon.hasClass('size-64')) sClassSize = 'size-64'; if ($activeIcon.hasClass('size-80')) sClassSize = 'size-80'; if ($activeIcon.hasClass('size-96')) sClassSize = 'size-96'; $activeIcon.css('font-size', ''); if (s.indexOf('size-') == -1 && s != '') { $activeIcon.attr('class', s); if (sClassSize != '') $activeIcon.addClass(sClassSize) } else { $activeIcon.removeClass('size-12'); $activeIcon.removeClass('size-14'); $activeIcon.removeClass('size-16'); $activeIcon.removeClass('size-18'); $activeIcon.removeClass('size-21'); $activeIcon.removeClass('size-24'); $activeIcon.removeClass('size-32'); $activeIcon.removeClass('size-48'); $activeIcon.removeClass('size-64'); $activeIcon.removeClass('size-80'); $activeIcon.removeClass('size-96'); $activeIcon.addClass(s) } } else { restoreSelection(savedSelPublic); var tmpId = makeid(); pasteHtmlAtCaret(' <i id="' + tmpId + '" class="' + s + '"></i> ', true); $activeIcon = jQuery('#' + tmpId); $activeIcon.removeAttr('id'); jQuery(cb_list).each(function () { jQuery(this).data('contenteditor').contentRender() }) } } var $imgActive; (function (jQuery) {
    var tmpCanvas; var tmpCanvasNoCrop; var nInitialWidth; var nInitialHeight; jQuery.imageembed = function (element, options) {
        var defaults = { hiquality: false, imageselect: '', fileselect: '', imageEmbed: true, linkDialog: true, zoom: 0, customval: 0, largerImageHandler: '', onChanged: function () { }, onImageBrowseClick: function () { }, onImageSettingClick: function () { }, onImageSelectClick: function () { }, onFileSelectClick: function () { } }; this.settings = {}; var $element = jQuery(element), element = element; this.init = function () {
            this.settings = jQuery.extend({}, defaults, options); if (jQuery('#divCb').length == 0) { jQuery('body').append('<div id="divCb"></div>') } var html_photo_file = ''; var html_photo_file2 = ''; if (navigator.appName.indexOf('Microsoft') != -1) { html_photo_file = '<div id="divToolImg"><div class="fileinputs"><input type="file" name="fileImage" id="fileImage" class="my-file" /><div class="fakefile"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAC+klEQVRoQ+2au24aQRSGz+ySkEvPA9AQubNEhXgCSogEShmZGkSQpTS8AjUNSAjXlCRNStpQ8QK8AI6UOLazM5lZvGRvswsz43hYz0iWZe3uzPnOf25rQOVymcAzWsgAZ1xto3DGBQajsFE4Yx4wIZ0xQSM4RmGjcMY8YEI6Y4LKFy0H/9TCJ7b1VsiOo0PaAAv5Wf4ho/CBPjQhneYokRyezWZQKpW4WzuOA71eD5bLZdrx++vahnSz2YRutwu5XC4RZrPZQL1eP33g4XAI1Wo1FeRYlbVQ+FA1U+kfblitVtBut2Nvf3LgQqEAk8kE2G9VC2MM4/EYRqNRZMsnBy4WizCdTiGfz6vidffhqaw98Ha7hU6nA+v1OuCQfr8PLBV46ySB/bAeoL8qJ0GfHLA/D8P9OOmap/jJAXvq1mq12NB1lW404LL/GVqtD5QTPfwwZEJz+DtcXHwEDPf0z3+f+2mbw17oxvZjhIBgGz71LqFSqcQ6xK8wgT+AyZ0L/t+AMflNz3MiNYZXpXkKI2SDhfKw3V67xYwXAdGQJhT6lj77SqgbHP3ywMLMITeB8GIn84C9PJ3P5/s+vYPdGbxYLGAwGABv3k4aPkSIBYAZMg0tfBs4L6kP+yvy7OoKzt6dg3+UTJrQtABmpOHQThs8PGjbeuMrSuDmbdLLhTbAYZXTgJmTEMrBj+sbbs6yPb1KzMIewOJOWiLh7Nog85UH/7vxobO0bb12QYJrV4jCxZA56OuXb26Oq1pSwOGwTgtPz2gLvaRqv9gzOORXpAiyiywN3jdagXtlwaWACbnf9UWBxdRjbWmnLA1l3qK92kYs79UsOeCYaq3GrOAuokNGnC1SwLRWg4NpT37kpREwHUIwzb9HXs8LWKccZsKK/Nv24IBwYdkIGm5jB+8QuVEyh+WA2XDBqjVygfyvheJAaU9KA6cdoNt1A6ybIqrtMQqr9qhu+xmFdVNEtT1GYdUe1W0/o7Buiqi2xyis2qO67WcU1k0R1fb8BZv85KDCNGIQAAAAAElFTkSuQmCC" /></div></div></div>'; html_photo_file2 = '' } else { html_photo_file = '<div style="display:none"><input type="file" name="fileImage" id="fileImage" class="my-file"></div>'; html_photo_file2 = '<div id="divToolImg">' + '<i id="lnkEditImage" class="cb-icon-camera"></i>' + '</div>' } var html_photo_tool = '<div id="divTempContent" style="display:none"></div>' + '<div class="overlay-bg" style="position:fixed;top:0;left:0;width:1;height:1;z-index:10000;background:#fff;opacity:0.8"></div>' + '<div id="divImageEdit" style="position:absolute;display:none;z-index:10000">' + '<div id="my-mask" style="width:200px;height:200px;overflow:hidden;">' + '<img id="my-image" src="" style="max-width:none" />' + '</div>' + '<div id="img-control" style="margin-top:1px;position:absolute;top:-31px;left:0px;width:235px;opacity:0.8">' + '<button id="btnImageCancel" type="button" value="Cancel" ><i class="cb-icon-back"></i></button>' + '<button id="btnZoomOut" type="button" value="-" ><i class="cb-icon-minus"></i></button>' + '<button id="btnZoomIn" type="button" value="+" ><i class="cb-icon-plus"></i></button>' + '<button id="btnImageMore" type="button" value="..." >...</button>' + '<button id="btnChangeImage" type="button" value="Ok" ><i class="cb-icon-ok"></i> Ok</button>' + '</div>' + '<div id="divImageMore" style="display:none">' + '<label for="chkImageNoCrop"><input id="chkImageNoCrop" type="checkbox" />No Crop</label>' + '<br>' + (this.settings.largerImageHandler == '' ? '' : '<label for="chkImageClickToEnlarge"><input id="chkImageClickToEnlarge" type="checkbox" />Click to enlarge</label><br>') + '<button id="btnImageMoreOk" type="button" value="Ok" ><i class="cb-icon-ok"></i> Ok</button>' + '</div>' + '</div>' + '<div style="display:none;">' + '<canvas id="myCanvas"></canvas>' + '<canvas id="myTmpCanvas"></canvas>' + '<canvas id="myTmpCanvasNoCrop"></canvas>' + '</div>' + '<form id="canvasform" name="canvasform" method="post" action="" target="canvasframe" enctype="multipart/form-data">' + html_photo_file + '<input id="hidRefId" name="hidRefId" type="hidden" value="' + this.settings.customval + '" />' + '</form>' + '<iframe id="canvasframe" name="canvasframe" style="width:1px;height:1px;border:none;visibility:hidden;position:absolute"></iframe>'; var bUseCustomImageSelect = false; if (this.settings.imageselect != '') bUseCustomImageSelect = true; var sFunc = (this.settings.onImageSelectClick + '').replace(/\s/g, ''); if (sFunc != 'function(){}') { bUseCustomImageSelect = true } var bUseCustomFileSelect = false; if (this.settings.fileselect != '') bUseCustomFileSelect = true; var sFunc = (this.settings.onFileSelectClick + '').replace(/\s/g, ''); if (sFunc != 'function(){}') { bUseCustomFileSelect = true } var imageEmbed = this.settings.imageEmbed; var html_hover_icons = html_photo_file2 + '<div id="divToolImgSettings">' + '<i id="lnkImageSettings" class="cb-icon-link"></i>' + '</div>' + '<div id="divToolImgLoader">' + '<i id="lnkImageLoader" class="cb-icon-spin animate-spin"></i>' + '</div>' + '' + '<div class="md-modal md-draggable" id="md-img">' + '<div class="md-content">' + '<div class="md-body">' + '<div class="md-modal-handle">' + '<i class="cb-icon-dot"></i><i class="cb-icon-cancel md-modal-close"></i>' + '</div>' + '<div class="md-tabs">' + '<span id="tabImgLnk" class="active">IMAGE</span>' + '<span id="tabImgPl">CHANGE DIMENSION</span>' + '</div>' + '<div id="divImgPl" style="overflow-y:auto;overflow-x:hidden;display:none;box-sizing:border-box;padding:10px 10px 10px">';
            html_hover_icons += '<div style="padding:12px 0 0;width:100%;text-align:center;">'; html_hover_icons += 'DIMENSION (WxH): &nbsp; <select id="selImgW">'; var valW = 50; for (var i = 0; i < 231; i++) { var selected = ''; if (i == 90) selected = ' selected="selected"'; html_hover_icons += '<option value="' + valW + '"' + selected + '>' + valW + 'px</option>'; valW += 5 } html_hover_icons += '</select> &nbsp; '; html_hover_icons += '<select id="selImgH">'; var valH = 50; for (var i = 0; i < 111; i++) { var selected = ''; if (i == 40) selected = ' selected="selected"'; html_hover_icons += '<option value="' + valH + '"' + selected + '>' + valH + 'px</option>'; valH += 5 } html_hover_icons += '</select> &nbsp; '; html_hover_icons += '<select id="selImgStyle">'; html_hover_icons += '<option value="square">Square</option>'; html_hover_icons += '<option value="circle">Circle</option>'; html_hover_icons += '</select><br>'; html_hover_icons += '<button id="btnInsertPlh" style="margin-left:12px;margin-top:12px;"> REPLACE </button><br>';
            html_hover_icons += '<p>(Re-embedding/uploading image needed)</p>';
            html_hover_icons += '</div>' + '</div>' + '<div id="divImgLnk">' + '<div class="md-label">Source:</div>' + (bUseCustomImageSelect ? '<input type="text" id="txtImgUrl" class="inptxt" style="float:left;width:60%"></input><i class="cb-icon-link md-btnbrowse" id="btnImageBrowse" style="width:10%;"></i>' : '<input type="text" id="txtImgUrl" class="inptxt" style="float:left;width:70%"></input>') + '<br style="clear:both">' + '<div class="md-label">Title:</div>' + '<input type="text" id="txtAltText" class="inptxt" style="float:right;width:70%"></input>' + '<br style="clear:both">' + '<div class="md-label">Link:</div>' + (bUseCustomFileSelect ? '<input type="text" id="txtLinkUrl" class="inptxt" style="float:left;width:60%"></input><i class="cb-icon-link md-btnbrowse" id="btnFileBrowse" style="width:10%;"></i>' : '<input type="text" id="txtLinkUrl" class="inptxt" style="float:left;width:70%"></input>') + '<br style="clear:both">' + '<div class="md-label">Target:</div>' + '<label style="float:left;" for="chkNewWindow2" class="inpchk"><input type="checkbox" id="chkNewWindow2"></input> New Window</label>' + '<br style="clear:both">' + '<div id="divEmbedOriginal">' + '<div class="md-label">&nbsp;</div>' + '<label style="float:left;" for="chkCrop" class="inpchk"><input type="checkbox" id="chkCrop"></input> Crop</label>' + '<br style="clear:both" />' + '</div>' + '</div>' + '</div>' + '<div id="divImgLnkOk" class="md-footer">' + '<button id="btnImgOk"> Ok </button>' + '</div>' + '</div>' + '</div>' + '' + '<div class="md-modal" id="md-imageselect">' + '<div class="md-content">' + '<div class="md-body">' + (bUseCustomImageSelect ? '<iframe id="ifrImageBrowse" style="width:100%;height:400px;border: none;display: block;" src="' + sScriptPath + 'blank.html"></iframe>' : '') + '</div>' + '</div>' + '</div>' + '';
            if (jQuery('#md-fileselect').length == 0) {
                html_hover_icons += '<div class="md-modal" id="md-fileselect">' + '<div class="md-content">' + '<div class="md-body">' + (bUseCustomFileSelect ? '<iframe id="ifrFileBrowse" style="width:100%;height:400px;border: none;display: block;" src="' + sScriptPath + 'blank.html"></iframe>' : '') + '</div>' + '</div>' + '</div>'
            } if (jQuery('#active-input').length == 0) { html_hover_icons += '<input type="hidden" id="active-input" />' } if (jQuery('#divToolImg').length == 0) { jQuery('#divCb').append(html_photo_tool); jQuery('#divCb').append(html_hover_icons) }
            tmpCanvas = document.getElementById('myTmpCanvas'); tmpCanvasNoCrop = document.getElementById('myTmpCanvasNoCrop'); $element.on('mouseenter mouseleave', function (e) {
                switch (e.type) {
                    case 'mouseenter': var zoom; if (localStorage.getItem("zoom") != null) { zoom = localStorage.zoom } else { zoom = $element.parents('[style*="zoom"]').css('zoom'); if (zoom == 'normal') zoom = 1; if (zoom == undefined) zoom = 1 } var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1; zoom = zoom + ''; if (zoom.indexOf('%') != -1) { zoom = zoom.replace('%', '') / 100 } if (zoom == 'NaN') { zoom = 1 } localStorage.zoom = zoom; zoom = zoom * 1; if (cb_list == '') zoom = 1; if ($element.data("imageembed").settings.zoom == 1) { zoom = 1 } var _top; var _top2; var _left; var scrolltop = jQuery(window).scrollTop(); var offsettop = jQuery(this).offset().top; var offsetleft = jQuery(this).offset().left; var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1; var is_ie = detectIE(); var is_edge = detectEdge(); var browserok = true; if (is_firefox || is_ie || is_edge) browserok = false; var _top_adj = !jQuery(this).data("imageembed").settings.imageEmbed ? 9 : -35; if (browserok) { _top = ((offsettop + parseInt(jQuery(this).css('height')) / 2) - 15) * zoom + (scrolltop - scrolltop * zoom); _left = ((offsetleft + parseInt(jQuery(this).css('width')) / 2) - 15) * zoom; _top2 = _top + _top_adj } else {
                        if (is_edge) { } if (is_ie) { var space = 0; var space2 = 0; $element.parents().each(function () { if (jQuery(this).data('contentbuilder')) { space = jQuery(this).getPos().top; space2 = jQuery(this).getPos().left } }); var adjy_val = -space * zoom + space; var adjx_val = -space2 * zoom + space2; var p = jQuery(this).getPos(); _top = ((p.top - 15 + parseInt(jQuery(this).css('height')) / 2)) * zoom + adjy_val; _left = ((p.left - 15 + parseInt(jQuery(this).css('width')) / 2)) * zoom + adjx_val; _top2 = _top + _top_adj } if (is_firefox) {
                            var imgwidth = parseInt(jQuery(this).css('width'));
                            var imgheight = parseInt(jQuery(this).css('height')); _top = offsettop - 15 + imgheight * zoom / 2; _left = offsetleft - 15 + imgwidth * zoom / 2; _top2 = _top + _top_adj
                        }
                    } var fixedimage = false; $imgActive = jQuery(this); if ($imgActive.attr('data-fixed') == 1) { fixedimage = true } if (cb_edit && !fixedimage) { jQuery("#divToolImg").css("top", _top + "px"); jQuery("#divToolImg").css("left", _left + "px"); if (jQuery(this).data("imageembed").settings.imageEmbed) { jQuery("#divToolImg").stop(true, true).css({ display: 'none' }).fadeIn(20) } if (jQuery(this).data("imageembed").settings.linkDialog) { jQuery("#divToolImgSettings").css("top", _top2 + "px"); jQuery("#divToolImgSettings").css("left", _left + "px"); jQuery("#divToolImgSettings").stop(true, true).css({ display: 'none' }).fadeIn(20) } else { jQuery("#divToolImgSettings").css("top", "-10000px") } } if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) { jQuery("#lnkImageSettings").on('touchstart mouseenter focus', function (e) { if (e.type == 'touchstart') { e.stopImmediatePropagation(); e.preventDefault() } jQuery("#lnkImageSettings").click(); e.preventDefault(); e.stopImmediatePropagation() }) } jQuery("#divToolImg").off('click'); jQuery("#divToolImg").on('click', function (e) { jQuery("#divToolImg").data('image', $imgActive); var sFunc = ($element.data('imageembed').settings.onImageBrowseClick + '').replace(/\s/g, ''); if (sFunc != 'function(){}') { $element.data('imageembed').settings.onImageBrowseClick() } else { jQuery('input.my-file[type=file]').click() } e.preventDefault(); e.stopImmediatePropagation() }); jQuery("#divToolImg").off('mouseenter mouseleave'); jQuery("#divToolImg").on('mouseenter mouseleave', function (e) { switch (e.type) { case 'mouseenter': if (imageEmbed) { jQuery("#divToolImg").stop(true, true).css("display", "block") } jQuery("#divToolImgSettings").stop(true, true).css("display", "block"); break; case 'mouseleave': jQuery("#divToolImg").stop(true, true).fadeOut(0); jQuery("#divToolImgSettings").stop(true, true).fadeOut(0); break } }); $element.off('mouseenter mouseleave', 'figcaption'); $element.on('mouseenter mouseleave', 'figcaption', function (e) { switch (e.type) { case 'mouseenter': if (imageEmbed) { jQuery("#divToolImg").stop(true, true).css("display", "block") } jQuery("#divToolImgSettings").stop(true, true).css("display", "block"); break; case 'mouseleave': jQuery("#divToolImg").stop(true, true).fadeOut(0); jQuery("#divToolImgSettings").stop(true, true).fadeOut(0); break } }); jQuery("#divToolImgSettings").off('mouseenter mouseleave'); jQuery("#divToolImgSettings").on('mouseenter mouseleave', function (e) { switch (e.type) { case 'mouseenter': if (imageEmbed) { jQuery("#divToolImg").stop(true, true).css("display", "block") } jQuery("#divToolImgSettings").stop(true, true).css("display", "block"); break; case 'mouseleave': jQuery("#divToolImg").stop(true, true).fadeOut(0); jQuery("#divToolImgSettings").stop(true, true).fadeOut(0); break } }); jQuery("#lnkImageSettings").off('click'); jQuery("#lnkImageSettings").on('click', function (e) { jQuery("#divToolImg").data('image', $imgActive); jQuery("#divToolImg").stop(true, true).fadeOut(0); jQuery("#divToolImgSettings").stop(true, true).fadeOut(0); var sFunc = ($element.data('imageembed').settings.onImageSettingClick + '').replace(/\s/g, ''); if (sFunc != 'function(){}') { $element.data('imageembed').settings.onImageSettingClick(); return } jQuery('#md-img').css('max-width', '550px'); jQuery('#md-img').simplemodal({ noOverlay: true }); jQuery('#md-img').data('simplemodal').show(); var editor; $element.parents().each(function () { if (jQuery(this).data('contenteditor')) { editor = jQuery(this).data('contenteditor'); editor.closePop() } }); var $img = $element; if ($element.prop("tagName").toLowerCase() == 'figure') { $img = $element.find('img:first') } if ($img.attr('src').indexOf('base64') == -1) { jQuery('#txtImgUrl').val($img.attr('src')) } else { jQuery('#txtImgUrl').val('[Image Data]') } jQuery('#txtAltText').val($img.attr('alt')); jQuery('#txtLinkUrl').val(''); jQuery('#chkNewWindow2').prop('checked', false); if ($img.parents('a:first') != undefined) { jQuery('#txtLinkUrl').val($img.parents('a:first').attr('href')); if ($img.parents('a:first').attr('target') == '_blank') { jQuery('#chkNewWindow2').prop('checked', true) } else { jQuery('#chkNewWindow2').prop('checked', false) } } if (!$element.data('imageembed').settings.imageEmbed) { jQuery('#divEmbedOriginal').css("display", "none") } else { jQuery('#divEmbedOriginal').css("display", "none"); jQuery('#btnImgOk').off('keyup'); jQuery('#txtImgUrl').on('keyup', function () { if ($img.attr('src') == jQuery('#txtImgUrl').val()) { jQuery('#divEmbedOriginal').css("display", "none") } else { jQuery('#divEmbedOriginal').css("display", "block") } }) } jQuery('#chkCrop').removeAttr('checked'); jQuery('#btnImgOk').off('click'); jQuery('#btnImgOk').on('click', function (e) { var builder; $element.parents().each(function () { if (jQuery(this).data('contentbuilder')) { builder = jQuery(this).data('contentbuilder') } }); var insertOri = false; if (jQuery('#chkCrop').is(":checked")) { } else { insertOri = true } if (insertOri == false) { if (jQuery('#txtImgUrl').val().indexOf("http") != -1) { insertOri = true } } if ($img.attr('src') != jQuery('#txtImgUrl').val()) { if (insertOri) { if ($img.attr('src').indexOf(sScriptPath + 'image.png') != -1 && jQuery('#txtImgUrl').val().indexOf(sScriptPath + 'image.png') == -1) { $img.css('width', ''); $img.css('height', '') } if (jQuery('#txtImgUrl').val().indexOf('[Image Data]') == -1) { $img.attr('src', jQuery('#txtImgUrl').val()) } else { } } else { processImage(jQuery('#txtImgUrl').val()) } } $img.attr('alt', jQuery('#txtAltText').val()); if (jQuery('#txtLinkUrl').val() == 'http://' || jQuery('#txtLinkUrl').val() == '') { $img.parents('a:first').replaceWith($img.parents('a:first').html()) } else { var imagelink = jQuery('#txtLinkUrl').val(); if ($img.parents('a:first').length == 0) { $img.wrap('<a href="' + imagelink + '"></a>') } else { $img.parents('a:first').attr('href', imagelink) } $img.parents('a:first').attr('title', jQuery('#txtAltText').val()); if (jQuery('#chkNewWindow2').is(":checked")) { $img.parents('a:first').attr('target', '_blank') } else { $img.parents('a:first').removeAttr('target') } if (imagelink.toLowerCase().indexOf('.jpg') != -1 || imagelink.toLowerCase().indexOf('.jpeg') != -1 || imagelink.toLowerCase().indexOf('.png') != -1 || imagelink.toLowerCase().indexOf('.gif') != -1) { $img.parents('a:first').addClass('is-lightbox') } else { $img.parents('a:first').removeClass('is-lightbox') } } if (builder) builder.applyBehavior(); jQuery('#md-img').data('simplemodal').hide() }); var actualW = $img[0].naturalWidth; var actualH = $img[0].naturalHeight; if ($img.attr('src').indexOf(sScriptPath + 'image.png') != -1) { for (var i = 0; i < $img.attr("style").split(";").length; i++) { var cssval = $img.attr("style").split(";")[i]; if (jQuery.trim(cssval.split(":")[0]) == "width") { actualW = parseInt(jQuery.trim(cssval.split(":")[1])) } if (jQuery.trim(cssval.split(":")[0]) == "height") { actualH = parseInt(jQuery.trim(cssval.split(":")[1])) } } } var valW = 50; for (var i = 0; i < 231; i++) { if (valW >= actualW) { i = 231; jQuery('#selImgW').val(valW) } valW += 5 } var valH = 50; for (var i = 0; i < 111; i++) { if (valH >= actualH) { i = 111; jQuery('#selImgH').val(valH) } valH += 5 } if (parseInt($img.css('border-radius')) == 500) { jQuery('#selImgStyle').val('circle'); jQuery('#selImgH').css('display', 'none') } else { jQuery('#selImgStyle').val('square'); jQuery('#selImgH').css('display', 'inline') } jQuery('#selImgStyle').off('change'); jQuery('#selImgStyle').on('change', function (e) { if (jQuery('#selImgStyle').val() == 'circle') { jQuery('#selImgH').css('display', 'none'); jQuery('#selImgH').val(jQuery('#selImgW').val()) } else { jQuery('#selImgH').css('display', 'inline'); jQuery('#selImgH').val(jQuery('#selImgW').val()) } }); jQuery('#selImgW').off('change'); jQuery('#selImgW').on('change', function (e) { if (jQuery('#selImgStyle').val() == 'circle') { jQuery('#selImgH').val(jQuery('#selImgW').val()) } }); jQuery('#btnInsertPlh').off('click'); jQuery('#btnInsertPlh').on('click', function (e) { var builder; $element.parents().each(function () { if (jQuery(this).data('contentbuilder')) { builder = jQuery(this).data('contentbuilder') } }); $img.attr('src', sScriptPath + 'image.png'); $img.attr('alt', jQuery('#txtAltText').val()); if (jQuery('#selImgStyle').val() == 'circle') { $img.css('border-radius', '500px'); jQuery('#selImgH').val(jQuery('#selImgW').val()) } else { $img.css('border-radius', ''); $img.removeClass('circle') } $img.css('width', jQuery('#selImgW').val() + 'px'); $img.css('height', jQuery('#selImgH').val() + 'px'); if (builder) builder.applyBehavior(); jQuery('#md-img').data('simplemodal').hide() }); e.preventDefault(); e.stopImmediatePropagation() }); jQuery("#btnImageBrowse").off('click'); jQuery("#btnImageBrowse").on('click', function (e) { jQuery("#divToolImg").stop(true, true).fadeOut(0); jQuery("#divToolImgSettings").stop(true, true).fadeOut(0); jQuery("#divRteLink").stop(true, true).fadeOut(0); jQuery("#divFrameLink").stop(true, true).fadeOut(0); var sFunc = ($element.data('imageembed').settings.onImageSelectClick + '').replace(/\s/g, ''); if (sFunc != 'function(){}') { $element.data('imageembed').settings.onImageSelectClick({ targetInput: jQuery("#txtImgUrl").get(0), theTrigger: jQuery("#btnImageBrowse").get(0) }) } else { jQuery('#ifrImageBrowse').attr('src', $element.data('imageembed').settings.imageselect); jQuery('#active-input').val('txtImgUrl'); jQuery('#md-imageselect').css('width', '65%'); jQuery('#md-imageselect').simplemodal(); jQuery('#md-imageselect').data('simplemodal').show() } }); jQuery("#btnFileBrowse").off('click'); jQuery("#btnFileBrowse").on('click', function (e) { jQuery("#divToolImg").stop(true, true).fadeOut(0); jQuery("#divToolImgSettings").stop(true, true).fadeOut(0); jQuery("#divRteLink").stop(true, true).fadeOut(0); jQuery("#divFrameLink").stop(true, true).fadeOut(0); var sFunc = ($element.data('imageembed').settings.onFileSelectClick + '').replace(/\s/g, ''); if (sFunc != 'function(){}') { $element.data('imageembed').settings.onFileSelectClick({ targetInput: jQuery("#txtLinkUrl").get(0), theTrigger: jQuery("#btnFileBrowse").get(0) }) } else { jQuery('#ifrFileBrowse').attr('src', $element.data('imageembed').settings.fileselect); jQuery('#active-input').val('txtLinkUrl'); jQuery('#md-fileselect').css('width', '65%'); jQuery('#md-fileselect').simplemodal(); jQuery('#md-fileselect').data('simplemodal').show() } }); jQuery('.my-file[type=file]').off('change'); jQuery('.my-file[type=file]').on('change', function (e) { changeImage(e); jQuery('#my-image').attr('src', '') }); jQuery('#tabImgLnk').off('click'); jQuery('#tabImgLnk').on('click', function (e) { jQuery('#tabImgLnk').addClass('active'); jQuery('#tabImgPl').removeClass('active'); jQuery('#divImgPl').fadeOut(300, function () { jQuery('#divImgLnk').fadeIn(0); jQuery('#divImgLnkOk').fadeIn(0) }) }); jQuery('#tabImgPl').off('click'); jQuery('#tabImgPl').on('click', function (e) { jQuery('#tabImgLnk').removeClass('active'); jQuery('#tabImgPl').addClass('active'); jQuery('#divImgLnk').fadeOut(0); jQuery('#divImgLnkOk').fadeOut(0, function () { jQuery('#divImgPl').fadeIn(300) }) }); break; case 'mouseleave': jQuery("#divToolImg").stop(true, true).fadeOut(0); jQuery("#divToolImgSettings").stop(true, true).fadeOut(0); break
                }
            })
        }; var changeImage = function (e) { if (typeof FileReader == "undefined") return true; var file = e.target.files[0]; if (!file) return; var extension = file.name.substr((file.name.lastIndexOf('.') + 1)).toLowerCase(); if (extension != 'jpg' && extension != 'jpeg' && extension != 'png' && extension != 'gif' && extension != 'bmp') { alert('Please select an image'); return } jQuery("#divToolImg").stop(true, true).fadeOut(0); jQuery("#divToolImgSettings").stop(true, true).fadeOut(0); jQuery("#divToolImgLoader").css('top', jQuery('#divToolImg').css('top')); jQuery("#divToolImgLoader").css('left', jQuery('#divToolImg').css('left')); jQuery("#divToolImgLoader").css('display', 'block'); jQuery('.overlay-bg').css('background', 'none'); jQuery('.overlay-bg').css('width', '100%'); jQuery('.overlay-bg').css('height', '100%'); processImage(file) }; var processImage = function (file) {
            var imgname, extension; if (!file.name) { imgname = file.substr((file.lastIndexOf('/') + 1)); extension = file.substr((file.lastIndexOf('.') + 1)).toLowerCase() } else { imgname = file.name; extension = file.name.substr((file.name.lastIndexOf('.') + 1)).toLowerCase() } var hiquality = false; try { hiquality = $element.data('imageembed').settings.hiquality } catch (e) { }; var type, quality; if (hiquality == false) { if (extension == 'jpg' || extension == 'jpeg') { type = 'image/jpeg'; quality = 0.92 } else { type = 'image/png'; quality = 1 } } else { type = 'image/png'; quality = 1 } loadImage.parseMetaData(file, function (data) {
                var orientation_num; if (data.exif) { orientation_num = data.exif.get('Orientation') } loadImage(file, function (img) {
                    jQuery('.overlay-bg').css('background', 'none'); jQuery('.overlay-bg').css('width', '100%'); jQuery('.overlay-bg').css('height', '100%'); var cW, cH; if (img.width > 3200 || img.height > 3200) { cW = img.width / 2; cH = img.height / 2 } else if (img.width > 2500 || img.height > 2500) { cW = img.width / 1.25; cH = img.height / 1.25 } else { cW = img.width; cH = img.height } if (4 < orientation_num && orientation_num < 9) { nInitialWidth = cH; nInitialHeight = cW } else { nInitialWidth = cW; nInitialHeight = cH } var bResize = false; var oW; var oH; if (nInitialHeight <= $imgActive.height() && nInitialWidth > $imgActive.width()) { oW = $imgActive.width(); oH = (nInitialHeight * $imgActive.width()) / nInitialWidth; bResize = true } else if (nInitialWidth <= $imgActive.width() && nInitialHeight > $imgActive.height()) { oH = $imgActive.height(); oW = (nInitialWidth * $imgActive.height()) / nInitialHeight; bResize = true } else if (nInitialWidth <= $imgActive.width() && nInitialHeight <= $imgActive.height()) { oW = nInitialWidth; oH = nInitialHeight } else { oW = $imgActive.width(); oH = (nInitialHeight * $imgActive.width()) / nInitialWidth; bResize = true } var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent); var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; if (isSafari || iOS) { var mpImg = new MegaPixImage(img); mpImg.render(tmpCanvasNoCrop, { width: cW, height: cH, orientation: orientation_num }, function () { if (bResize) { var tmpImg = new Image(); var nW = nInitialWidth; var nH = nInitialHeight; tmpImg.onload = function () { nW /= 2; nH /= 2; if (nW < oW || nH < oH) { nW = oW; nH = oH } var mpImg = new MegaPixImage(tmpImg); mpImg.render(tmpCanvasNoCrop, { width: nW, height: nH }, function () { if (nW <= oW || nH <= oH) { return } tmpImg.src = tmpCanvasNoCrop.toDataURL(type, quality) }) }; tmpImg.src = tmpCanvasNoCrop.toDataURL(type, quality) } }) } else { var contextNoCrop = tmpCanvasNoCrop.getContext("2d"); if (4 < orientation_num && orientation_num < 9) { tmpCanvasNoCrop.width = cH; tmpCanvasNoCrop.height = cW } else { tmpCanvasNoCrop.width = cW; tmpCanvasNoCrop.height = cH } switch (orientation_num) { case 2: contextNoCrop.transform(-1, 0, 0, 1, cW, 0); break; case 3: contextNoCrop.transform(-1, 0, 0, -1, cW, cH); break; case 4: contextNoCrop.transform(1, 0, 0, -1, 0, cH); break; case 5: contextNoCrop.transform(0, 1, 1, 0, 0, 0); break; case 6: contextNoCrop.transform(0, 1, -1, 0, cH, 0); break; case 7: contextNoCrop.transform(0, -1, -1, 0, cH, cW); break; case 8: contextNoCrop.transform(0, -1, 1, 0, 0, cW); break; default: break }contextNoCrop.drawImage(img, 0, 0, cW, cH); if (bResize) { var tmpImg = new Image(); var nW = nInitialWidth; var nH = nInitialHeight; tmpImg.onload = function () { nW /= 2; nH /= 2; if (nW < oW || nH < oH) { nW = oW; nH = oH } tmpCanvasNoCrop.width = nW; tmpCanvasNoCrop.height = nH; contextNoCrop = tmpCanvasNoCrop.getContext('2d'); contextNoCrop.drawImage(tmpImg, 0, 0, nW, nH); if (nW <= oW || nH <= oH) { return } tmpImg.src = tmpCanvasNoCrop.toDataURL(type, quality) }; tmpImg.src = tmpCanvasNoCrop.toDataURL(type, quality) } } $imgActive = jQuery("#divToolImg").data('image'); var zoom = localStorage.zoom; if ($element.data('imageembed').settings.zoom == 1) { zoom = 1 } var enlarge; if ($imgActive.prop("tagName").toLowerCase() == 'img') { enlarge = $imgActive[0].naturalWidth / $imgActive.width() } else if ($imgActive.prop("tagName").toLowerCase() == 'figure') { enlarge = $imgActive.find('img')[0].naturalWidth / $imgActive.find('img').width() } var specifiedCssWidth = 0; var specifiedCssHeight = 0; if ($imgActive.prop("tagName").toLowerCase() == 'img') { if ($imgActive.attr("src").indexOf(sScriptPath + "image.png") != -1) { for (var i = 0; i < $imgActive.attr("style").split(";").length; i++) { var cssval = $imgActive.attr("style").split(";")[i]; if (jQuery.trim(cssval.split(":")[0]) == "width") { specifiedCssWidth = parseInt(jQuery.trim(cssval.split(":")[1])); enlarge = specifiedCssWidth / $imgActive.width() } if (jQuery.trim(cssval.split(":")[0]) == "height") { specifiedCssHeight = parseInt(jQuery.trim(cssval.split(":")[1])) } } } } else if ($imgActive.prop("tagName").toLowerCase() == 'figure') { if ($imgActive.find('img').attr("src").indexOf(sScriptPath + "image.png") != -1) { for (var i = 0; i < $imgActive.find('img').attr("style").split(";").length; i++) { var cssval = $imgActive.find('img').attr("style").split(";")[i]; if (jQuery.trim(cssval.split(":")[0]) == "width") { specifiedCssWidth = parseInt(jQuery.trim(cssval.split(":")[1])); enlarge = specifiedCssWidth / $imgActive.find('img').width() } if (jQuery.trim(cssval.split(":")[0]) == "height") { specifiedCssHeight = parseInt(jQuery.trim(cssval.split(":")[1])) } } } } var maskAdj = 0; if ($imgActive.prop("tagName").toLowerCase() == 'img') { jQuery("#my-mask").css('width', ($imgActive.width() * enlarge) - maskAdj + 'px'); jQuery("#my-mask").css('height', ($imgActive.height() * enlarge) - maskAdj + 'px') } else { jQuery("#my-mask").css('width', ($imgActive.innerWidth() * enlarge) - maskAdj + 'px'); jQuery("#my-mask").css('height', ($imgActive.innerHeight() * enlarge) - maskAdj + 'px') } if (specifiedCssWidth != 0) jQuery("#my-mask").css('width', specifiedCssWidth + 'px'); if (specifiedCssHeight != 0) jQuery("#my-mask").css('height', specifiedCssHeight + 'px'); jQuery("#my-mask").css('zoom', zoom / enlarge); jQuery("#my-mask").css('-moz-transform', 'scale(' + zoom / enlarge + ')'); var newW; var newY; var maskWidth = $imgActive.width(); var maskHeight = $imgActive.height(); var photoAspectRatio = nInitialWidth / nInitialHeight; var canvasAspectRatio = maskWidth / maskHeight; if (photoAspectRatio < canvasAspectRatio) { newW = maskWidth; newY = (nInitialHeight * maskWidth) / nInitialWidth } else { newW = (nInitialWidth * maskHeight) / nInitialHeight; newY = maskHeight } newW = newW * enlarge; newY = newY * enlarge; $imgActive = jQuery("#divToolImg").data('image'); jQuery("#my-image").css('top', '0px'); jQuery("#my-image").css('left', '0px'); jQuery("#my-image").css('width', newW + 'px'); jQuery("#my-image").css('height', newY + 'px'); var zoom = localStorage.zoom; zoom = zoom * 1; if ($element.data('imageembed').settings.zoom == 1) { zoom = 1 } var _top; var _left; var _top_polaroid;
                    var _left_polaroid; var scrolltop = jQuery(window).scrollTop(); var offsettop = $imgActive.offset().top; var offsetleft = $imgActive.offset().left; var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1; var is_ie = detectIE(); var browserok = true; if (is_firefox || is_ie) browserok = false; if (browserok) { _top = (offsettop * zoom) + (scrolltop - scrolltop * zoom); _left = offsetleft * zoom; _top_polaroid = ((offsettop + 5) * zoom) + (scrolltop - scrolltop * zoom); _left_polaroid = (offsetleft + 5) * zoom } else {
                        if (is_ie) { var space = 0; var space2 = 0; $element.parents().each(function () { if (jQuery(this).data('contentbuilder')) { space = jQuery(this).getPos().top; space2 = jQuery(this).getPos().left } }); var adjy_val = -space * zoom + space; var adjx_val = -space2 * zoom + space2; var p = $imgActive.getPos(); _top = (p.top * zoom) + adjy_val; _left = (p.left * zoom) + adjx_val; _top_polaroid = ((p.top + 5) * zoom) + adjy_val; _left_polaroid = ((p.left + 5) * zoom) + adjx_val }
                        if (is_firefox) { var imgwidth = parseInt($imgActive.css('width')); var imgheight = parseInt($imgActive.css('height')); var adjx_val = imgwidth / 2 - (imgwidth / 2) * zoom; var adjy_val = imgheight / 2 - (imgheight / 2) * zoom; jQuery('#img-control').css('top', 5 + adjy_val + 'px'); jQuery('#img-control').css('left', 7 + adjx_val + 'px'); _top = offsettop - adjy_val; _left = offsetleft - adjx_val; _top_polaroid = offsettop - adjy_val + 5; _left_polaroid = offsetleft - adjx_val + 5 }
                    } jQuery('#divImageEdit').css('display', 'inline-block'); if ($imgActive.attr('class') == 'img-polaroid') { jQuery("#divImageEdit").css("top", _top_polaroid + "px"); jQuery("#divImageEdit").css("left", _left_polaroid + "px") } else { jQuery("#divImageEdit").css("top", _top + "px"); jQuery("#divImageEdit").css("left", _left + "px") } if (parseInt(jQuery("#divImageEdit").css("top")) < 25) { jQuery('#img-control').css('top', 'auto'); jQuery('#img-control').css('bottom', "-24px") } jQuery("#my-mask").css('transform-origin', 'left top'); panSetup(); var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1; if (is_firefox) sleep(700); jQuery("#btnImageCancel").css('display', 'none'); jQuery("#btnZoomOut").css('display', 'none'); jQuery("#btnZoomIn").css('display', 'none'); jQuery("#btnImageMore").css('display', 'none'); jQuery("#btnChangeImage").css('display', 'none'); var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent); var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; if (isSafari || iOS) { var mpImg = new MegaPixImage(img); mpImg.render(tmpCanvas, { width: cW, height: cH, orientation: orientation_num }, function () { jQuery('#my-image').attr('src', tmpCanvas.toDataURL(type, quality)); var tmp = new Image(); var nW = nInitialWidth; var nH = nInitialHeight; tmp.onload = function () { nW /= 2; nH /= 2; if (nW < newW || nH < newY) { nW = newW; nH = newY } var mpImg = new MegaPixImage(tmp); mpImg.render(tmpCanvas, { width: nW, height: nH }, function () { if (nW <= newW || nH <= newY) { crop(); if ($imgActive.attr('class') == 'img-circle') { jQuery('#my-mask').css('-webkit-border-radius', '500px'); jQuery('#my-mask').css('-moz-border-radius', '500px'); jQuery('#my-mask').css('border-radius', '500px') } else { jQuery('#my-mask').css('-webkit-border-radius', '0px'); jQuery('#my-mask').css('-moz-border-radius', '0px'); jQuery('#my-mask').css('border-radius', '0px') } if ($imgActive.prop("tagName").toLowerCase() == 'img') { } else { jQuery('#btnZoomIn').click(); jQuery('#btnZoomIn').click() } jQuery("#divToolImgLoader").css('display', 'none'); jQuery("#btnImageCancel").css('display', 'inline-block'); jQuery("#btnZoomOut").css('display', 'inline-block'); jQuery("#btnZoomIn").css('display', 'inline-block'); jQuery("#btnImageMore").css('display', 'inline-block'); jQuery("#btnChangeImage").css('display', 'inline-block'); jQuery('.overlay-bg').css('background', '#fff'); return } tmp.src = tmpCanvas.toDataURL(type, quality) }) }; tmp.src = tmpCanvas.toDataURL(type, quality) }) } else {
                        var context = tmpCanvas.getContext("2d"); if (4 < orientation_num && orientation_num < 9) { tmpCanvas.width = cH; tmpCanvas.height = cW } else { tmpCanvas.width = cW; tmpCanvas.height = cH } switch (orientation_num) { case 2: context.transform(-1, 0, 0, 1, cW, 0); break; case 3: context.transform(-1, 0, 0, -1, cW, cH); break; case 4: context.transform(1, 0, 0, -1, 0, cH); break; case 5: context.transform(0, 1, 1, 0, 0, 0); break; case 6: context.transform(0, 1, -1, 0, cH, 0); break; case 7: context.transform(0, -1, -1, 0, cH, cW); break; case 8: context.transform(0, -1, 1, 0, 0, cW); break; default: break }context.drawImage(img, 0, 0, cW, cH); jQuery('#my-image').attr('src', tmpCanvas.toDataURL(type, quality)); var tmp = new Image(); var nW = nInitialWidth; var nH = nInitialHeight; tmp.onload = function () {
                            nW /= 2; nH /= 2; if (nW < newW || nH < newY) { nW = newW; nH = newY } tmpCanvas.width = nW; tmpCanvas.height = nH; context = tmpCanvas.getContext('2d'); context.drawImage(tmp, 0, 0, nW, nH); if (nW <= newW || nH <= newY) {
                                crop(); if ($imgActive.attr('class') == 'img-circle') { jQuery('#my-mask').css('-webkit-border-radius', '500px'); jQuery('#my-mask').css('-moz-border-radius', '500px'); jQuery('#my-mask').css('border-radius', '500px') } else {
                                    jQuery('#my-mask').css('-webkit-border-radius', '0px'); jQuery('#my-mask').css('-moz-border-radius', '0px');
                                    jQuery('#my-mask').css('border-radius', '0px')
                                } if ($imgActive.prop("tagName").toLowerCase() == 'img') { } else { jQuery('#btnZoomIn').click(); jQuery('#btnZoomIn').click() } jQuery("#divToolImgLoader").css('display', 'none'); jQuery("#btnImageCancel").css('display', 'inline-block'); jQuery("#btnZoomOut").css('display', 'inline-block'); jQuery("#btnZoomIn").css('display', 'inline-block'); jQuery("#btnImageMore").css('display', 'inline-block'); jQuery("#btnChangeImage").css('display', 'inline-block'); jQuery('.overlay-bg').css('background', '#fff'); return
                            } tmp.src = tmpCanvas.toDataURL(type, quality)
                        }; tmp.src = tmpCanvas.toDataURL(type, quality)
                    }
                    jQuery('#btnImageMore').off('click');
                    jQuery('#btnImageMore').on('click', function () {
                        if (jQuery('#divImageMore').css('display') == 'block') {
                            jQuery('#divImageMore').css('display', 'none')
                        } else {
                            jQuery('#divImageMore').css('display', 'block');
                            jQuery('#chkImageNoCrop').attr('checked', false);
                            if ($imgActive.parents('a:first').length == 0) {
                                jQuery('#chkImageClickToEnlarge').attr('checked', false)
                            } else {
                                if ($imgActive.parents('a:first').attr('href').toLowerCase().indexOf('.jpg') != -1 || $imgActive.parents('a:first').attr('href').toLowerCase().indexOf('.png') != -1)
                                    jQuery('#chkImageClickToEnlarge').attr('checked', true)
                            }
                        }
                        jQuery('.overlay-bg').off('click');
                        jQuery('.overlay-bg').on('click', function () {
                            jQuery('#divImageMore').css('display', 'none')
                        });
                        jQuery('#my-mask').off('click');
                        jQuery('#my-mask').on('click', function () {
                            jQuery('#divImageMore').css('display', 'none')
                        })
                    });
                    jQuery('#btnImageMoreOk').off('click');
                    jQuery('#btnImageMoreOk').on('click', function () {
                        if (jQuery('#chkImageClickToEnlarge').is(':checked')) {
                            var imagelink = '#';
                            if ($imgActive.parents('a:first').length == 0) {
                                $imgActive.wrap('<a href="' + imagelink + '"></a>')
                            } else {
                                $imgActive.parents('a:first').attr('href', imagelink)
                            }
                            $imgActive.parents('a:first').attr('title', ''); $imgActive.parents('a:first').addClass('is-lightbox')
                        }
                        if (jQuery('#chkImageNoCrop').is(':checked')) {
                            var canvasNoCrop = document.getElementById('myTmpCanvasNoCrop'); var image;
                            if (hiquality == false) {
                                if (extension == 'jpg' || extension == 'jpeg') {
                                    image = canvasNoCrop.toDataURL("image/jpeg", 0.92)
                                } else {
                                    image = canvasNoCrop.toDataURL("image/png", 1)
                                }
                            } else {
                                image = canvasNoCrop.toDataURL("image/png", 1)
                            }
                            if ($imgActive.prop("tagName").toLowerCase() == 'img') {
                                $imgActive.attr('src', image);
                                $imgActive.data('filename', imgname)
                            } else if ($imgActive.prop("tagName").toLowerCase() == 'figure') {
                                $imgActive.find('img').attr('src', image);
                                $imgActive.find('img').data('filename', imgname)
                            } else {
                                $imgActive.css('background-image', 'url(data:' + image + ')'); $imgActive.data('filename', imgname)
                            }
                            if ($imgActive.parent().hasClass("is-lightbox")) {
                                jQuery('#canvasform').attr('action', $element.data('imageembed').settings.largerImageHandler);
                                jQuery('#canvasform').submit()
                            } else {
                                jQuery('.my-file[type=file]').clearInputs()
                            }
                        } else {
                            jQuery('#btnChangeImage').click()
                        }
                        jQuery('#divImageEdit').css('display', 'none');
                        jQuery('.overlay-bg').css('width', '1px');
                        jQuery('.overlay-bg').css('height', '1px');
                        jQuery('body').css('overflow', '');
                        if ($imgActive.prop("tagName").toLowerCase() == 'img') {
                            $imgActive.css('width', '');
                            $imgActive.css('height', '')
                        } else if ($imgActive.prop("tagName").toLowerCase() == 'figure') {
                            $imgActive.find('img').css('width', '');
                            $imgActive.find('img').css('height', '')
                        }
                        $element.data('imageembed').settings.onChanged();
                        jQuery("#divToolImgLoader").css('display', 'none');
                        jQuery('#divImageMore').css('display', 'none');
                        var builder;
                        $element.parents().each(function () {
                            if (jQuery(this).data('contentbuilder')) {
                                builder = jQuery(this).data('contentbuilder')
                            }
                        });
                        if (!jQuery('#chkImageClickToEnlarge').is(':checked')) {
                            if ($imgActive.parents('a:first').length > 0) {
                                if ($imgActive.parents('a:first').attr('href').toLowerCase().indexOf('.jpg') != -1 || $imgActive.parents('a:first').attr('href').toLowerCase().indexOf('.png') != -1) {
                                    $imgActive.parents('a:first').replaceWith($imgActive.parents('a:first').html())
                                }
                            }
                        }
                        if (builder) {
                            builder.applyBehavior();
                            builder.settings.onRender()
                        }
                    });
                    jQuery('#btnChangeImage').off('click');
                    jQuery('#btnChangeImage').on('click', function () {
                        var canvas = document.getElementById('myCanvas');
                        $imgActive = jQuery("#divToolImg").data('image');
                        var image;
                        if (hiquality == false) {
                            if (extension == 'jpg' || extension == 'jpeg') {
                                image = canvas.toDataURL("image/jpeg", 0.92)
                            } else {
                                image = canvas.toDataURL("image/png", 1)
                            }
                        } else {
                            image = canvas.toDataURL("image/png", 1)
                        } if ($imgActive.prop("tagName").toLowerCase() == 'img') {
                            $imgActive.attr('src', image);
                            $imgActive.data('filename', imgname)
                        } else if ($imgActive.prop("tagName").toLowerCase() == 'figure') {
                            $imgActive.find('img').attr('src', image);
                            $imgActive.find('img').data('filename', imgname)
                        } else {
                            $imgActive.css('background-image', 'url(data:' + image + ')'); $imgActive.data('filename', imgname)
                        } if ($imgActive.parent().hasClass("is-lightbox") && jQuery('#fileImage').val() != '') {
                            jQuery('#canvasform').attr('action', $element.data('imageembed').settings.largerImageHandler);
                            jQuery('#canvasform').submit()
                        } else {
                            jQuery('.my-file[type=file]').clearInputs()
                        }
                        jQuery('#divImageEdit').css('display', 'none');
                        jQuery('.overlay-bg').css('width', '1px');
                        jQuery('.overlay-bg').css('height', '1px');
                        jQuery('body').css('overflow', '');
                        if ($imgActive.prop("tagName").toLowerCase() == 'img') {
                            $imgActive.css('width', '');
                            $imgActive.css('height', '')
                        } else if ($imgActive.prop("tagName").toLowerCase() == 'figure') {
                            $imgActive.find('img').css('width', '');
                            $imgActive.find('img').css('height', '')
                        }
                        $element.data('imageembed').settings.onChanged();
                        jQuery('#divImageMore').css('display', 'none')
                    });
                    jQuery('#btnImageCancel').off('click');
                    jQuery('#btnImageCancel').on('click', function () {
                        var canvas = document.getElementById('myCanvas');
                        $imgActive = jQuery("#divToolImg").data('image');
                        jQuery('#divImageEdit').css('display', 'none');
                        jQuery('.overlay-bg').css('width', '1px');
                        jQuery('.overlay-bg').css('height', '1px');
                        jQuery('body').css('overflow', '');
                        jQuery('#divImageMore').css('display', 'none');
                        jQuery('.my-file[type=file]').clearInputs()
                    });
                    jQuery('#btnZoomIn').off('click'); jQuery('#btnZoomIn').on('click', function () {
                        var nCurrentWidth = parseInt(jQuery("#my-image").css('width'));
                        var nCurrentHeight = parseInt(jQuery("#my-image").css('height'));
                        jQuery("#my-image").css('width', (nCurrentWidth / 0.9) + 'px');
                        jQuery("#my-image").css('height', (nCurrentHeight / 0.9) + 'px');
                        panSetup();
                        tmpCanvas.width = (nCurrentWidth / 0.9);
                        tmpCanvas.height = (nCurrentHeight / 0.9);
                        var imageObj = jQuery("#my-image")[0];
                        var context = tmpCanvas.getContext('2d');
                        var tmp = new Image(), context, cW, cH;
                        cW = nInitialWidth;
                        cH = nInitialHeight;
                        tmp.src = imageObj.src; tmp.onload = function () {
                            cW /= 2; cH /= 2;
                            if (cW < imageObj.width) cW = (nCurrentWidth / 0.9);
                            if (cH < imageObj.height) cH = (nCurrentHeight / 0.9);
                            tmpCanvas.width = cW;
                            tmpCanvas.height = cH;
                            context = tmpCanvas.getContext('2d'); context.drawImage(tmp, 0, 0, cW, cH); if (cW <= (nCurrentWidth / 0.9) || cH <= (nCurrentHeight / 0.9)) {
                                panSetup();
                                crop();
                                return
                            }
                            tmp.src = tmpCanvas.toDataURL(type, quality)
                        };
                        crop()
                    });
                    jQuery('#btnZoomOut').off('click');
                    jQuery('#btnZoomOut').on('click', function () {
                        var nCurrentWidth = parseInt(jQuery("#my-image").css('width'));
                        var nCurrentHeight = parseInt(jQuery("#my-image").css('height'));
                        if ((nCurrentWidth / 1.1) < jQuery("#my-mask").width()) return;
                        if ((nCurrentHeight / 1.1) < jQuery("#my-mask").height()) return;
                        jQuery("#my-image").css('width', (nCurrentWidth / 1.1) + 'px');
                        jQuery("#my-image").css('height', (nCurrentHeight / 1.1) + 'px');
                        panSetup(); tmpCanvas.width = (nCurrentWidth / 1.1);
                        tmpCanvas.height = (nCurrentHeight / 1.1);
                        var imageObj = jQuery("#my-image")[0];
                        var context = tmpCanvas.getContext('2d');
                        var tmp = new Image(), context, cW, cH;
                        cW = nInitialWidth;
                        cH = nInitialHeight;
                        tmp.src = imageObj.src;
                        tmp.onload = function () {
                            cW /= 2; cH /= 2;
                            if (cW < imageObj.width) cW = (nCurrentWidth / 1.1);
                            if (cH < imageObj.height) cH = (nCurrentHeight / 1.1);
                            tmpCanvas.width = cW;
                            tmpCanvas.height = cH;
                            context = tmpCanvas.getContext('2d');
                            context.drawImage(tmp, 0, 0, cW, cH);
                            if (cW <= (nCurrentWidth / 1.1) || cH <= (nCurrentHeight / 1.1)) {
                                panSetup();
                                crop();
                                return
                            }
                            tmp.src = tmpCanvas.toDataURL(type, quality)
                        }; crop()
                    })
                }, { canvas: false })
            })
        };
        var crop = function () {
            var maskAdj = 1.1;
            var x = parseInt(jQuery("#my-image").css('left')) - maskAdj;
            var y = parseInt(jQuery("#my-image").css('top')) - maskAdj;
            var dw = parseInt(jQuery("#my-mask").css('width'));
            var dh = parseInt(jQuery("#my-mask").css('height'));
            var canvas = document.getElementById('myCanvas');
            var context = canvas.getContext('2d');
            canvas.width = dw;
            canvas.height = dh;
            var sourceX = -1 * x;
            var sourceY = -1 * y;
            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
                var iosAdj = 0.7; sourceX = -1 * x + (x - x / iosAdj);
                sourceY = -1 * y + (y - y / iosAdj)
            }
            if (sourceY > (tmpCanvas.height - dh)) {
                sourceY = tmpCanvas.height - dh
            }
            if (sourceX > (tmpCanvas.width - dw)) {
                sourceX = tmpCanvas.width - dw
            }
            context.drawImage(tmpCanvas, sourceX, sourceY, dw, dh, 0, 0, dw, dh)
        }; var panSetup = function () {
            jQuery("#my-image").css({ top: 0, left: 0 });
            var maskWidth = jQuery("#my-mask").width();
            var maskHeight = jQuery("#my-mask").height();
            var imgPos = jQuery("#my-image").offset();
            var imgWidth = jQuery("#my-image").width();
            var imgHeight = jQuery("#my-image").height();
            var x1 = (imgPos.left + maskWidth) - imgWidth;
            var y1 = (imgPos.top + maskHeight) - imgHeight;
            var x2 = imgPos.left;
            var y2 = imgPos.top;
            jQuery("#my-image").draggable({ revert: false, containment: [x1, y1, x2, y2], scroll: false, drag: function () { crop() } });
            jQuery("#my-image").css({ cursor: 'move' })
        };
        this.init()
    };
    jQuery.fn.imageembed = function (options) {
        return this.each(function () {
            if (undefined == jQuery(this).data('imageembed')) {
                var plugin = new jQuery.imageembed(this, options);
                jQuery(this).data('imageembed', plugin)
            }
        })
    }
})(jQuery);
function applyLargerImage(s) {
    $imgActive.parents("a").attr("href", s);
    jQuery('.my-file[type=file]').clearInputs()
}
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 2; i++)text += possible.charAt(Math.floor(Math.random() * possible.length));
    var text2 = "";
    var possible2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)text2 += possible2.charAt(Math.floor(Math.random() * possible2.length)); return text + text2
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break
        }
    }
}
function getScripts(scripts, callback) {
    var progress = 0;
    scripts.forEach(function (script) {
        $.getScript(script, function () {
            if (++progress == scripts.length) callback()
        })
    })
}
jQuery.fn.clearFields = jQuery.fn.clearInputs = function (includeHidden) {
    var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; return this.each(function () {
        var t = this.type, tag = this.tagName.toLowerCase();
        if (re.test(t) || tag == 'textarea') {
            this.value = ''
        } else if (t == 'checkbox' || t == 'radio') {
            this.checked = false
        } else if (tag == 'select') {
            this.selectedIndex = -1
        } else if (t == "file") {
            if (/MSIE/.test(navigator.userAgent)) {
                jQuery(this).replaceWith(jQuery(this).clone(true))
            } else {
                jQuery(this).val('')
            }
        } else if (includeHidden) {
            if ((includeHidden === true && /hidden/.test(t)) || (typeof includeHidden == 'string' && jQuery(this).is(includeHidden))) this.value = ''
        }
    })
};
var zindex = 10000; (function (jQuery) {
    jQuery.simplemodal = function (element, options) {
        var defaults = {
            onCancel: function () {

            }, onFinish: function () {

            }, isModal: false,
            noOverlay: false
        }; this.settings = {

        };
        var $element = jQuery(element), element = element;
        var $ovlid; this.init = function () {
            this.settings = jQuery.extend({

            }, defaults, options);
            if (jQuery('#divCb').length == 0) {
                jQuery('body').append('<div id="divCb"></div>')
            }
        };
        this.hide = function () {
            $element.css('display', 'none');
            $element.removeClass('md-show');
            if (!this.settings.noOverlay) {
                $ovlid.remove()
            }
            zindex = zindex - 2;
            $element.data('simplemodal').settings.onFinish()
        }; this.show = function (savedSel) {
            zindex = zindex + 1;
            if (!this.settings.noOverlay) {
                var rnd = makeid();
                var html_overlay = '<div id="md-overlay-' + rnd + '" class="md-overlay" style="z-index:' + zindex + '"></div>';
                if (this.settings.isModal) {
                    html_overlay = '<div id="md-overlay-' + rnd + '" class="md-overlay" style="z-index:' + zindex + ';background:rgba(0, 0, 0, 0.1)"></div>'
                } jQuery('#divCb').append(html_overlay);
                $ovlid = jQuery('#md-overlay-' + rnd)
            }
            zindex = zindex + 1;
            $element.css('z-index', zindex);
            $element.addClass('md-show');
            $element.stop(true, true).css('display', 'none').fadeIn(200);
            if ($element.hasClass('md-draggable')) {
                var mw = parseInt($element.css("width"));
                var mh = parseInt($element.css("height"));
                $element.css("top", Math.max(0, (jQuery(window).height() - mh) / 2) + "px");
                $element.css("left", Math.max(0, (jQuery(window).width() - mw) / 2) + "px");
                if ($element.find('.md-modal-handle').length > 0) {
                    $element.find('.md-modal-handle').css("cursor", "move");
                    $element.draggable({
                        handle: ".md-modal-handle"
                    })
                } else {
                    $element.draggable()
                }
            }
            if ($element.find('.md-modal-close').length > 0) {
                $element.find('.md-modal-close').click(function () {
                    $element.data('simplemodal').hide()
                })
            }
            if (!this.settings.noOverlay) {
                var savedSel = savedSel;
                jQuery('#md-overlay-' + rnd).off('click');
                jQuery('#md-overlay-' + rnd).click(function () {
                    if ($element.data('simplemodal').settings.isModal)
                        return;
                    $element.stop(true, true).fadeOut(100, function () {
                        $element.removeClass('md-show')
                    });
                    $ovlid.remove();
                    zindex = zindex - 2;
                    if (savedSel) restoreSelection(savedSel);
                    $element.data('simplemodal').settings.onCancel()
                })
            }
        }; this.init()
    };
    jQuery.fn.simplemodal = function (options) {
        return this.each(function () {
            if (undefined == jQuery(this).data('simplemodal')) {
                var plugin = new jQuery.simplemodal(this, options);
                jQuery(this).data('simplemodal', plugin)
            }
        })
    }
})(jQuery); jQuery(document).keydown(function (e) {
    if (e.which === 90 && e.ctrlKey) {
        if (e.shiftKey) doRedo(); else {
            if (!e.altKey) doUndo()
        }
    } if (e.which === 89 && e.ctrlKey) {
        if (!e.altKey) doRedo()
    }
});
function saveForUndo() {
    var bChanged = false; jQuery(cb_list).each(function () {
        var $cb = jQuery(this);
        var $el = $cb.data('contentbuilder');
        if ($el) {
            if ($el.undoList[0]) {
                if ($cb.html() != $el.undoList[0][0]) bChanged = true
            } else {
                bChanged = true
            }
        }
    });
    if (!bChanged) return;
    jQuery(cb_list).each(function () {
        var $cb = jQuery(this);
        var $el = $cb.data('contentbuilder');
        for (var i = 20; i > 1; i--)$el.undoList[i - 1] = $el.undoList[i - 2];
        var curr;
        if (window.getSelection) {
            try {
                curr = window.getSelection().getRangeAt(0);
                $el.undoList[0] = [$cb.html(), curr.cloneRange()]
            } catch (e) {
                $el.undoList[0] = [$cb.html(), null]
            }
        } else if (document.selection) {
            try {
                curr = document.selection.createRange();
                var type = document.selection.type;
                if (type == "Text") $el.undoList[0] = [$cb.html(), curr.getBookmark(), "Text"];
                else if (type == "Control") {
                    curr.item(0).selThis = "selThis";
                    $el.undoList[0] = [$cb.html(), null, "Control"];
                    curr.item(0).removeAttribute("selThis", 0)
                } else {
                    $el.undoList[0] = [$cb.html(), curr.getBookmark(), "None"]
                }
            } catch (e) {
                if (type == "Text") $el.undoList[0] = [$cb.html(), null, "Text"];
                else if (type == "Control") {
                    curr.item(0).selThis = "selThis";
                    $el.undoList[0] = [$cb.html(), null, "Control"];
                    curr.item(0).removeAttribute("selThis", 0)
                } else {
                    $el.undoList[0] = [$cb.html(), null, "None"]
                }
            }
        }
        $el.redoList = []
    })
} var numUndo = 0; function doUndo() {
    var bChanged = false;
    jQuery(cb_list).each(function () {
        var $cb = jQuery(this);
        var $el = $cb.data('contentbuilder');
        if ($el.undoList[0]) {
            if ($cb.html() != $el.undoList[0][0]) bChanged = true
        } else {
            bChanged = true
        }
    });
    jQuery(cb_list).each(function () {
        var $cb = jQuery(this);
        var $el = $cb.data('contentbuilder');
        if (!$el.undoList[0]) return;
        for (var i = 20; i > 1; i--)$el.redoList[i - 1] = $el.redoList[i - 2];
        var curr;
        if (window.getSelection) {
            try {
                curr = window.getSelection().getRangeAt(0);
                $el.redoList[0] = [$cb.html(), curr.cloneRange()]
            } catch (e) {
                $el.redoList[0] = [$cb.html(), null]
            }
        } else if (document.selection) {
            curr = document.selection.createRange();
            var type = document.selection.type;
            if (type == "Text") $el.redoList[0] = [$cb.html(), curr.getBookmark(), "Text"];
            else if (type == "Control") {
                curr.item(0).selThis = "selThis";
                $el.redoList[0] = [$cb.html(), null, "Control"];
                curr.item(0).removeAttribute("selThis", 0)
            } else {
                $el.redoList[0] = [$cb.html(), curr.getBookmark(), "None"]
            }
        }
        sHTML = $el.undoList[0][0]; $cb.html(sHTML);
        for (var i = 0; i < 19; i++)$el.undoList[i] = $el.undoList[i + 1];
        $el.undoList[19] = null;
        $el.applyBehavior();
        $el.blockChanged();
        $el.settings.onRender()
    });
    if (bChanged == false && numUndo < 1) {
        numUndo = numUndo + 1; doUndo();
        return
    } numUndo = 0
}
function doRedo() {
    jQuery(cb_list).each(function () {
        var $cb = jQuery(this);
        var $el = $cb.data('contentbuilder');
        if (!$el.redoList[0]) return;
        for (var i = 20; i > 1; i--)$el.undoList[i - 1] = $el.undoList[i - 2];
        var curr;
        if (window.getSelection) {
            try {
                curr = window.getSelection().getRangeAt(0); $el.undoList[0] = [$cb.html(), curr.cloneRange()]
            } catch (e) {
                $el.undoList[0] = [$cb.html(), null]
            }
        } else if (document.selection) {
            curr = document.selection.createRange();
            var type = document.selection.type;
            if (type == "Text") $el.undoList[0] = [$cb.html(), curr.getBookmark(), "Text"];
            else if (type == "Control") {
                curr.item(0).selThis = "selThis"; $el.undoList[0] = [$cb.html(), null, "Control"];
                curr.item(0).removeAttribute("selThis", 0)
            }
            else {
                $el.undoList[0] = [$cb.html(), curr.getBookmark(), "None"]
            }
        } sHTML = $el.redoList[0][0];
        $cb.html(sHTML);
        for (var i = 0; i < 19; i++)
            $el.redoList[i] = $el.redoList[i + 1];
        $el.redoList[19] = null;
        $el.applyBehavior();
        $el.blockChanged();
        $el.settings.onRender()
    })
}
jQuery.fn.getPos = function () {
    var o = this[0];
    var left = 0, top = 0, parentNode = null, offsetParent = null; offsetParent = o.offsetParent;
    var original = o;
    var el = o;
    while (el.parentNode != null) {
        el = el.parentNode;
        if (el.offsetParent != null) {
            var considerScroll = true;
            if (window.opera) {
                if (el == original.parentNode || el.nodeName == "TR") {
                    considerScroll = false
                }
            }
            if (considerScroll) {
                if (el.scrollTop && el.scrollTop > 0) {
                    top -= el.scrollTop
                }
                if (el.scrollLeft && el.scrollLeft > 0) {
                    left -= el.scrollLeft
                }
            }
        } if (el == offsetParent) {
            left += o.offsetLeft;
            if (el.clientLeft && el.nodeName != "TABLE") {
                left += el.clientLeft
            } top += o.offsetTop;
            if (el.clientTop && el.nodeName != "TABLE") {
                top += el.clientTop
            } o = el;
            if (o.offsetParent == null) {
                if (o.offsetLeft) {
                    left += o.offsetLeft
                }
                if (o.offsetTop) { top += o.offsetTop }
            } offsetParent = o.offsetParent
        }
    } return { left: left, top: top }
};
function cleanHTML(input) {
    var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
    var output = input.replace(stringStripper, ' ');
    var commentSripper = new RegExp('<!--(.*?)-->', 'g'); var output = output.replace(commentSripper, '');
    var tagStripper = new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>', 'gi');
    output = output.replace(tagStripper, '');
    var badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];
    for (var i = 0; i < badTags.length; i++) {
        tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi');
        output = output.replace(tagStripper, '')
    }
    var badAttributes = ['style', 'start']; for (var i = 0; i < badAttributes.length; i++) {
        var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi'); output = output.replace(attributeStripper, '')
    } return output
}
function selectRange(range) {
    if (range) {
        if (typeof range.select != "undefined") { range.select() } else if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range)
        }
    }
}
function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges(); sel.addRange(range)
}
function isEven(someNumber) {
    return (someNumber % 2 == 0) ? true : false
} function getCellIndex(oTable, oTR, oTD) {
    var nCount = 0;
    var bFinish = false;
    for (var i = 0; i < oTR.cells.length; i++) {
        if (bFinish == false) { nCount += oTR.cells[i].colSpan }
        if (oTD == oTR.cells[i]) bFinish = true
    } nCount = nCount - (oTD.colSpan - 1); var nCellIndex = nCount - 1;
    return nCellIndex
} function detectIE() {
    var ua = window.navigator.userAgent; var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/'); var edge = ua.indexOf('Edge/'); if (msie > 0) { return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10) }
    if (edge > 0) {
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
    }
    if (trident > 0) {
        var rv = ua.indexOf('rv:'); return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
    } return false
}
function detectEdge() {
    var ua = window.navigator.userAgent;
    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
    } return false
} (function ($) {
    $.fn.contrastingText = function () {
        var el = this, transparent;
        transparent = function (c) {
            var m = c.match(/[0-9]+/g);
            if (m !== null) {
                return !!m[3]
            } else return false
        };
        while (transparent(el.css('background-color'))) {
            el = el.parent()
        } parts = el.css('background-color').match(/[0-9]+/g);
        this.lightBackground = !!Math.round((parseInt(parts[0], 10) + parseInt(parts[1], 10) + parseInt(parts[2], 10)) / 765);
        if (this.lightBackground) {
            this.css('color', 'black')
        }
        else {
            this.css('color', 'rgba(255, 255, 255, 0.7)')
        } return this
    }
}(jQuery));
getScripts([sScriptPath + "codemirror/lib/codemirror.js"], function () {
    getScripts([sScriptPath + "codemirror/mode/xml/xml.js", sScriptPath + "codemirror/mode/javascript/javascript.js", sScriptPath + "codemirror/mode/css/css.js"],
        function () {
            jQuery('body').addClass('is-cmloaded')
        })
});

let pwb_email;
let pwb_webname;
let pwb_pagename;
let formData = new FormData();
let buff;
$(document).ready(function () {
    pwb_email = localStorage.getItem('pwb_email');
    pwb_webname = localStorage.getItem('websitename');
    pwb_pagename = localStorage.getItem('pwb_pagename');
    if (pwb_pagename) {
        pwb_pagename = localStorage.getItem('pwb_pagename');
    } else {
        pwb_pagename = 'home';
    }
    $('.modalemailtxt span').text(pwb_email);
    $('.modalwebsitenametxt span').text(pwb_webname);
    $('#lnkToolOpen').click(function () {
        if ($(this).find('.cb-icon-right-open-big').length === 1) {
            $(this).find('.cb-icon-right-open-big').removeClass('cb-icon-right-open-big').addClass('cb-icon-left-open-big');
            $('#divTool').animate({ 'right': '-255px' });
        } else {
            $(this).find('.cb-icon-left-open-big').removeClass('cb-icon-left-open-big').addClass('cb-icon-right-open-big');
            $('#divTool').animate({ 'right': '0' });
        }
    });
    //snippetdataget();
    pagenameget();
    contentdataget(pwb_pagename);
});
let pagelist = '';
function pagenameget() {
    let url = Config.BaseUrl + "pwbwebsitedatapagename?email=" + pwb_email + "&websitename=" + pwb_webname;
    API_call(url, "POST", formData, (data) => {
        if (data.StatusCode == 200) {
            let result = data.Response;
            pagearr = data.Response;
            $('#pagename').empty();
            for (let i = 0; i < result.length; i++) {
                if (pwb_pagename === result[i].pagename) {
                    $('#pagename').append("<option selected value='" + result[i].pagename + "' >" + result[i].pagename + "</option>");
                } else {
                    $('#pagename').append("<option value='" + result[i].pagename + "' >" + result[i].pagename + "</option>");
                }
                pagelist += "<li><a href='" + Config.PublishUrl + "?" + pwb_email + "/" + pwb_webname + "/" + result[i].pagename + "'>" + result[i].pagename + "</a></li>"
            }
        } else {
            console.log(data)
        }
    });
}
function pwbpagechange(e) {
    localStorage.setItem('pwb_pagename', e);
    location.reload();
}
function contentdataget(pagename) {
    let url = Config.BaseUrl + "pwbwebsitedatabywebname?email=" + pwb_email + "&websitename=" + pwb_webname + "&pagename=" + pagename;
    API_call(url, "POST", formData, (data) => {
        if (data.StatusCode == 200) {
            $('#contentarea').empty();
            let result = data.Response;

            let html = unescape(unescape(result[0].html));
            $('#contentarea').append(html);
            $('.navbar-fixed-top .navbar-nav').empty();
            $('.navbar-fixed-top .navbar-nav').append(pagelist);
            contentbuilder();
        } else {
            location.href = "./../login/login.html";
        }
    });
}
function contentbuilder() {
    $("#contentarea").contentbuilder({
        onDrop: function (event, ui) {
        },
        snippetFile: './snippet.html',
        snippetOpen: true,
        toolbar: 'left',
        iconselect: './selection.html',
        // snippetCategories: [
        //     [0, "Default"],
        //     [-1, "All"],
        //     [1, "Title"],
        //     [2, "Title, Subtitle"],
        //     [3, "Info, Title"],
        //     [4, "Header"],
        //     [5, "Heading, Paragraph"],
        //     [6, "Paragraph"],
        //     [7, "Navigation"],
        // ],
        snippetCategories: [[0, "Default"], [-1, "All"], [1, "Title"], [2, "Title, Subtitle"], [3, "Info, Title"], [4, "Info, Title, Subtitle"], [5, "Heading, Paragraph"], [6, "Paragraph"], [7, "Paragraph, Images + Caption"], [8, "Heading, Paragraph, Images + Caption"], [33, "Buttons"], [34, "Cards"], [9, "Images + Caption"], [10, "Images + Long Caption"], [11, "Images"], [12, "Single Image"], [13, "Call to Action"], [14, "List"], [15, "Quotes"], [16, "Profile"], [17, "Map"], [20, "Video"], [18, "Social"], [21, "Services"], [22, "Contact Info"], [23, "Pricing"], [24, "Team Profile"], [25, "Products/Portfolio"], [26, "How It Works"], [27, "Partners/Clients"], [28, "As Featured On"], [29, "Achievements"], [32, "Skills"], [30, "Coming Soon"], [31, "Page Not Found"], [19, "Separator"], [100, "Custom Code"]],

    });
}
function logout() {
    localStorage.clear();
    location.href = "./../login/login.html";
}
function view() {
    $('#contentarea').data('contentbuilder').viewHtml();
}
function updatehtml() {
    var elHtml = '';
    var draggableremovehtml = $('#contentarea .ui-draggable');
    draggableremovehtml.find('.row-tool').remove();
    for (let i = 0; i < draggableremovehtml.length; i++) {
        elHtml += draggableremovehtml[i].innerHTML;
        if (i === draggableremovehtml.length - 1) {
            elHtml = elHtml.trim();
            formData.delete('html');
            updatewebpagedata(elHtml);
        }
    }
}
$(document).ready(function () {
    $('#selSnips').on('change', function (e) {
        var value = $(this).val().toLowerCase();
        $("#divSnippetList .Snippet").filter(function () {
            let cat_no = $(this).attr('data-cat');
            $(this).toggle((+cat_no) === (+value) || ((+value === -1 || +value == 0)))
        });
    });
});
function updatewebpagedata(elHtml) {
    formData.append('html', elHtml);
    var url = Config.BaseUrl + "updatewebpagedata?email=" + pwb_email + "&websitename=" + pwb_webname + "&pagename=" + pwb_pagename;
    API_call(url, "POST", formData, (data) => {
        if (data.StatusCode === 200) {
            let result = data.Response;
            location.reload();
        } else {
            console.log(data)
        }
    });
}
function snippetdataget() {
    var url = Config.BaseUrl + "snippetdataget";
    API_call(url, "POST", formData, (data) => {
        if (data.StatusCode === 200) {
            $('#divSnippetList').empty();
            $('#divSnippets').empty();
            let result = data.Response;
            for (let i = 0; i < result.length; i++) {
                var arr = result[i].thumbnail;
                var arrdata = new Uint8Array(arr.data);
                buff = bufferToBase64(arrdata);
                buff = 'data:image/png;base64,' + buff;
                let code = unescape(result[i].code);
                code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                $('#divSnippetList').append('<div title="Snippet ' + result[i].sno + '" data-snip="' + result[i].sno + '" data-cat="' + result[i].category + '" class="Snippet ui-draggable ui-draggable-handle"><img src="' + buff + '"></div>');
                // $('#divSnippets').append("<div id='snip" + result[i].sno + "'>" + $('<div/>').text(code).html());
                //console.log(code);
                $('#divSnippets').append("<div id='snip" + result[i].sno + "'>" + code + "</div>");
                console.log(code)
            }
        } else {
            $('#divSnippetList').empty();
        }
    });
}
function bufferToBase64(buf) {
    var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
}
function addnewpagesubmit() {
    pwb_pagename = $('.addnewpageinput').val();
    var url = Config.BaseUrl + "websitedatainsert?pagename=" + pwb_pagename + "&email=" + pwb_email + "&websitename=" + pwb_webname;
    API_call(url, "POST", formData, (data) => {
        if (data.StatusCode === 200) {
            localStorage.setItem('pwb_pagename', pwb_pagename);
            location.reload();
        } else {
            alert(data.Message)
            $('#managepage').modal('hide');
        }
    });
}
function publishweb() {
    let url = "http://192.168.1.43:8080/Projects/PWB/Editor/publish.html?" + pwb_email + "/" + pwb_webname;
    window.open(url, '_blank');
}

