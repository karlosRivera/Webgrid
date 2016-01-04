
function PagerUI()
{
    var firstRecord=$('#firstRecord').val();
    var lastRecord = $('#lastRecord').val();
    var TotalRows=$('#TotalRows').val();

    var $div = $('<div id="content" />');
    var $list = $('<ul class="paginate pag5 clearfix" />');
    var $item = $('<li class="single" />').
        append('Page ' + firstRecord + ' to ' + lastRecord + ' of ' + TotalRows);
    $list.append($item);

    var $elements = $('.webgrid-footer td').contents().filter(function () {
        return (this.nodeType === 3 && $.trim(this.nodeValue) !== '')
               || this.nodeType === 1;
    });

    $elements.each(function () {
        if (!$(this).html()) {
            $item = $('<li class="current" />').append($(this));
        }
        else {
            if (!isNaN(parseInt($(this).text()))) {
                $item = $('<li />').append($(this));
            }
            else {
                $item = $('<li class="navpage"/>').append($(this));
            }
        }
        $list.append($item);
    });

    $item = $('<li class="single" />').append('<div id="loader" style="display:none;">Loading....&nbsp;&nbsp;<img src="' + loaderUrl + '" style="height:20px;width:50px;"></div>');
    $list.append($item);
    $div.append($list);
    //alert($('.webgrid-footer td').html());
    $('.webgrid-footer td').append($div);
    //$div.append($list);
    //$('#dv').append($list);

}

$(document).ready(function () {
    initScripts();
});

function initScripts() {
    SetSortArrows();
    //SetPagerNavImage();
    PagerUI();
    SetUpNavQueryString();
}

function SetPagerNavImage() {
    /*
        Adding sort pagination images just iterating in all anchor of 
        container having style called webgrid-footer
    */
    $(".webgrid-footer a").each(function () {
        var text = $(this).text().trim();
        if (text == "<<") {
            $(this).html('<img src="/images/first.png"/>');
        }

        if (text == ">>") {
            $(this).html('<img src="/images/last.png"/>');
        }

        if (text == "<") {
            $(this).html('<img src="/images/back.png"/>');
        }

        if (text == ">") {
            $(this).html('<img src="/images/next.png"/>');
        }

    });
}

function SetSortArrows() {
    /*
        First find anchor by href pattern and set icon up or down for sorting direction wise
    */
    var dir = $('#dir').val();
    var col = $('#col').val();

    var header = $('th a[href*=' + col + ']');
    if (dir == 'Ascending') {
        header.text(header.text() + ' ▲');
    }
    if (dir == 'Descending') {
        header.text(header.text() + ' ▼');
    }
}

function SetUpNavQueryString() {
    /*
        modify href of anchor to add page no to persist it in table header
    */

    $(".webgrid-header a").each(function () {
        this.href = this.href + '&page=' + $('#page').val();
    });

    /*
        modify href of anchor to add page no to persist it in table footer
    */
    $(".webgrid-footer a").each(function () {
        var res = this.href.split("&");
        var ColOrder = '';
        if (res.length <= 1) {
            if ($('#dir').val() === 'Ascending') {
                ColOrder = 'ASC';
            }
            else if ($('#dir').val() === 'Descending') {
                ColOrder = 'DESC';
            }

            this.href = this.href + '&sort=' + $('#col').val() + '&sortdir=' + ColOrder;
        }
    });

    /*
        remove specific text from href of all anchor
    */
    $('a[data-swhglnk="true"]').attr('href', function () {
        return this.href.replace(/&__swhg=[0-9]{13}/, '');
    });
}

$(document).ajaxStart(function () {
    $('#loader').show();
});

$(document).ajaxComplete(function () {
    $('#loader').hide();
})