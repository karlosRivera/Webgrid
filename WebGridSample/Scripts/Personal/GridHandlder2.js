
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
            $('#page').val($.trim($(this).text()));
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
    $('.edit-mode').hide();
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
    //$("#col").val(col);

    var header = $('th a[href*=' + col + ']');
    if (dir == 'Ascending') {
        header.text(header.text() + ' ▲');
        $("#dir").val('ASC')
    }
    if (dir == 'Descending') {
        header.text(header.text() + ' ▼');
        $("#dir").val('DESC')
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
            if ($('#dir').val() === 'Ascending' || $('#dir').val() === 'ASC') {
                ColOrder = 'ASC';
            }
            else if ($('#dir').val() === 'Descending' || $('#dir').val() === 'DESC') {
                ColOrder = 'DESC';
            }

            this.href = this.href + '&sort=' + $('#col').val() + '&sortdir=' + ColOrder;
            this.href = this.href.replace('UpdateStudents', 'List')
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
    //toggleLoader();
});

$(document).ajaxComplete(function () {
    $('#loader').hide();
    //toggleLoader();
})

function toggleLoader()
{
    $('#loader').toggle();
}

$(document).on('change', '[id*="cboState"]', function () {
    //alert('State ' + $(this).children(":selected").text() + ' ' + $(this).val());

    var cboCity = $(this).closest('tr').find("select[id*='cboCity']");

    if ($(this).val() != '') {
        $.ajax({
            url: CascadeUrl,
            data: { StateID: $(this).val() },
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                //$.each(data, function (i, item) {
                //    alert(item[i].CityID + ' ' + item[i].CityName);
                //    //items += "<option value=\"" + item.CityID + "\">" + item.CityName + "</option>";
                //});                //    cboCity.find("option:not([value=''])").remove();
                //$('#gridContent').html(data);
                //initScripts();

                $.each(data, function (i, j) {
                    alert(j[i].ID + ' ' + j[i].Name);
                    
                });
            }
        });
    }
    return false;

});

$(function () {
    $(document).on('click', '.edit-user', function () {
        var tr = $(this).parents('tr:first');
        $(tr).addClass('Editing');
        if ($(tr).find("td:nth-child(2)").hasClass('PadOn')) {
            $(tr).find("td:nth-child(2)").removeClass("PadOn");
            $(tr).find("td:nth-child(3)").removeClass("PadOn");
            $(tr).find("td:nth-child(4)").removeClass("PadOn");
            $(tr).find("td:nth-child(5)").removeClass("PadOn");

        }

        $(tr).find("td:nth-child(2)").addClass("PadOff");
        $(tr).find("td:nth-child(3)").addClass("PadOff");
        $(tr).find("td:nth-child(4)").addClass("PadOff");
        $(tr).find("td:nth-child(5)").addClass("PadOff");

        // fetching dropdown selected value
        //var stateid = $(tr).find("input[id*='HiddenStateID']").val();
        //var cityid = $(tr).find("input[id*='HiddenCityID']").val();
        //$(tr).find("select[id*='cboState']").val(stateid);
        //$(tr).find("select[id*='cboCity']").val(cityid);

        tr.find('.edit-mode, .display-mode').toggle();
        $(tr).find("input[id*='txtFirstName']").focus();
        return false;
    });

    $(document).on('click', '.cancel-user', function () {
        var tr = $(this).parents('tr:first');
        $(tr).removeClass('Editing');
        if ($(tr).find("td:nth-child(2)").hasClass('PadOff')) {
            $(tr).find("td:nth-child(2)").removeClass("PadOff");
            $(tr).find("td:nth-child(3)").removeClass("PadOff");
            $(tr).find("td:nth-child(4)").removeClass("PadOff");
            $(tr).find("td:nth-child(5)").removeClass("PadOff");

        }

        $(tr).find("td:nth-child(2)").addClass("PadOn");
        $(tr).find("td:nth-child(3)").addClass("PadOn");
        $(tr).find("td:nth-child(4)").addClass("PadOn");
        $(tr).find("td:nth-child(5)").addClass("PadOn");

        tr.find('.edit-mode, .display-mode').toggle();
        return false;
    });

    $(document).on('click', '.save-user', function () {
        var tr = $(this).parents('tr:first');

        var Sortdir = $("#dir").val();
        var Sortcol = $("#col").val();
        var page = $("#page").val();

        var ID = tr.find("input[id*='HiddenID']").val();
        var FirstName = tr.find("input[id*='txtFirstName']").val();
        var LastName = tr.find("input[id*='txtLastName']").val();
        var StateID = tr.find("select[id*='cboState'] :selected").val();
        var StateName = tr.find("select[id*='cboState'] :selected").text();
        var CityID = tr.find("select[id*='cboCity'] :selected").val();
        var CityName = tr.find("select[id*='cboCity'] :selected").text();
        var IsActive = $("[class*='box']").is(':checked');

        var data = new Object();
        var StudentArray = [];
        StudentArray.push(PopulateStudent(ID, FirstName, LastName, StateID, StateName, CityID, CityName, IsActive));

        data.page = page;
        data.sort = Sortcol;
        data.sortdir = Sortdir;
        data.Students = StudentArray;

        tr.find('.edit-mode, .display-mode').toggle();
        if ($(tr).find("td:nth-child(2)").hasClass('PadOff')) {
            $(tr).find("td:nth-child(2)").removeClass("PadOff");
            $(tr).find("td:nth-child(3)").removeClass("PadOff");
            $(tr).find("td:nth-child(4)").removeClass("PadOff");
            $(tr).find("td:nth-child(5)").removeClass("PadOff");
        }

        $(tr).find("td:nth-child(2)").addClass("PadOn");
        $(tr).find("td:nth-child(3)").addClass("PadOn");
        $(tr).find("td:nth-child(4)").addClass("PadOn");
        $(tr).find("td:nth-child(5)").addClass("PadOn");

        $.ajax({
            url: updateUrl,
            data: JSON.stringify({ oSVm: data }),
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                //alert(data);
                $('#gridContent').html(data);
                initScripts();
            }
        });
        return false;
    });

    function PopulateStudent(id, firstname, lastname, stateid, statename, cityid, cityname, isactive) {
        var Student = new Object();
        Student.ID = id;
        Student.FirstName = firstname;
        Student.LastName = lastname;
        Student.IsActive = isactive;
        Student.StateID = stateid;
        Student.StateName = statename;
        Student.CityID = cityid;
        Student.CityName = cityname;
        return Student;
    }
})
