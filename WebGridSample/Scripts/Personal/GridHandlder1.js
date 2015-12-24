$(document).ready(function () {
    initScripts();
});

function initScripts() {
    SetSortArrows();
    SetPagerNavImage();
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