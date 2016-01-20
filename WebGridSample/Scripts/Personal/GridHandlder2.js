var _sort;
var _sortdir;
var _page;
var _sortCol;
var header;
var Students = [];
var _newRow = 0;

function SetUpPagerUI()
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
    $('.webgrid-footer td').append($div);
}

$(document).ready(function () {
    initScripts();
});

function initScripts() {
    $('.edit-mode').hide();
    SetSortArrows();
    //SetPagerNavImage();
    SetUpPagerUI();
    SetUpNavQueryString();
    SetUpLinks();
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
            //this.href = this.href.replace('UpdateStudents', 'List')
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

function toggleLoader()
{
    $('#loader').toggle();
}

function SetSortArrows() {
    /*
        First find anchor by href pattern and set icon up or down for sorting direction wise
    */
    var dir = $('#dir').val();
    var col = $('#col').val();
    header = $('th a[href*=' + col + ']');
    if (dir == 'Ascending' || dir == 'ASC') {
        header.text(header.text() + ' ▲');
        //$("#dir").val('DESC')
    }
    if (dir == 'Descending' || dir == 'DESC') {
        header.text(header.text() + ' ▼');
        //$("#dir").val('ASC')
    }
}

$(document).on('click', '.webgrid-header a', function () {
    var $form = $('form');
    if ($form.valid()) {
        params = getUrlVars($(this).attr('href'));
        _sort = params["sort"];
        _sortdir = params["sortdir"];
        _page = params["page"];
        _sortCol = $("#col").val();

        $("#page").val(_page);
        $("#dir").val(_sortdir)

        if (_sort != $("#col").val()) {
            $("#dir").val('ASC');
        }
        $("#col").val(_sort);

        RefreshGrid();

    }
    return false;
});

$(document).on('click', '.webgrid-footer a', function () {
    var $form = $('form');
    if ($form.valid()) {
        params = getUrlVars($(this).attr('href'));
        $("#page").val(params["page"]);
        RefreshGrid();
    }
    return false;
});

function RefreshGrid() {
    var data = new Object();
    var Sortdir = $("#dir").val();
    var Sortcol = $("#col").val();
    var page = $("#page").val();

    data.page = page;
    data.sort = Sortcol;
    data.sortdir = Sortdir;

    $.ajax({
        url: RefreshUrl,
        data: JSON.stringify({ oSVm: data }),
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $('#gridContent').html(data);
            $("#page").val(page);
            $("#col").val(Sortcol);
            $("#dir").val(Sortdir);
            initScripts();
            setEditableRow();
        }
    });
}

function SetUpLinks()
{
    if ($('#dir').val() === 'ASC') {
        header.attr('href', header.attr('href').replace('ASC', 'DESC'));
    }
    else if ($('#dir').val() === 'DESC') {
        header.attr('href', header.attr('href').replace('DESC', 'ASC'));
    }

    $(".webgrid-footer a").each(function () {
        if ($('#dir').val() === 'ASC') {
            this.href = this.href.replace('ASC', 'DESC')
        }
        else if ($('#dir').val() === 'DESC') {
            this.href = this.href.replace('DESC', 'ASC')
        }
    });

}
jQuery(document).on('blur', ".webgrid-table input[type=text]", function ()
{
    var tableRow = $(this).closest('tr');
    handleLocalStore(tableRow,'UPDATE');
});


jQuery(document).on('keyup', '.webgrid-table input[type=text]', function (ev) {
    var tableRow = $(this).closest('tr');
    handleLocalStore(tableRow, 'UPDATE');
});

$(document).on('change', '[id*="cboCity"]', function () {
    var tableRow = $(this).closest('tr');
    handleLocalStore(tableRow,'UPDATE');
});

$(document).on('click', '[id*="select"]', function () {
    var tableRow = $(this).closest('tr');
    handleLocalStore(tableRow,'UPDATE');
});

$(document).on('change', '[class*="box"]', function () {
    var tableRow = $(this).closest('tr');
    handleLocalStore(tableRow, 'UPDATE');
});


$(document).ready(function () {
    $("#btnSaveAll").click(function () {
        var $form = $('form');
        if ($form.valid()) {
            if (_newRow === 0) {
                saveAll();
            }
            else {
                alert('New data not saved....');
            }
        }
        return false;
    });

    $("#btnAddRow").click(function () {

        var $form = $('form');
        if ($form.valid()) {
            if (_newRow === 0) {
                var cloneTr = $('#StudentGrid tr:last').clone();
                cloneTr.find('td').contents().filter(function () {
                    return this.nodeType === 3;
                }).remove();

                $('#StudentGrid').append(cloneTr);
                cloneTr.find("input[id*='HiddenID']").val(0);
                cloneTr.find("input[type='text'][id*='FirstName']").val('');
                cloneTr.find("input[type='text'][id*='LastName']").val('');
                cloneTr.find("select[id*='cboState']").val('');
                cloneTr.find("select[id*='cboCity']").val('');
                cloneTr.find("[class*='box']").attr('checked', false);
                cloneTr.find("[id*='btnEdit']").click();
                cloneTr.find("[id*='btnDelete']").prop('disabled', true);
                cloneTr.find("input[type='text'][id*='FirstName']").focus();
                _newRow = 1;
            }
            else {
                alert('New data not saved....');
            }

        }
        return false;
    });

})

function saveAll()
{
    if (typeof (Storage) !== "undefined") {
        Students = localStorage.getObject('Students');
        if (Students != null) {
            var StudentArray = [];
            for (i = 0; i < Students.length; i++) {
                var Student = Students[i];
                StudentArray.push(PopulateStudent(Student.ID, Student.FirstName, Student.LastName, Student.StateID, Student.StateName, Student.CityID, Student.CityName, Student.IsActive));
            }

            var Sortdir = $("#dir").val();
            var Sortcol = $("#col").val();
            var page = $("#page").val();

            var data = new Object();
            data.page = page;
            data.sort = Sortcol;
            data.sortdir = Sortdir;
            data.Students = StudentArray;

            $.ajax({
                url: updateUrl,
                data: JSON.stringify({ oSVm: data, 'Action': 'UPDATE' }),
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    $('#gridContent').html(data);
                    $("#page").val(page);
                    $("#col").val(Sortcol);
                    $("#dir").val(Sortdir);
                    Students = [];
                    localStorage.removeItem('Students');
                    initScripts();
                    alert("Local storage Data Saved");
                }
            });

        }
    }
    else {
        alert('local store does not support');
    }
}

function setEditableRow()
{
    $("#StudentGrid > tbody  > tr").each(function () {
        var tr = $(this).closest('tr');
        var ID = tr.find("input[id*='HiddenID']").val();
        var index = IndexOfArrayByKeyValue(Students, "ID", ID);
        if (index != null) {
            tr.find("[id*='btnEdit']").click();
        }
    });
}

function handleLocalStore(tableRow,action) {

    var ID = tableRow.find("input[id*='HiddenID']").val();
    var FirstName = tableRow.find("input[type='text'][id*='FirstName']").val();
    var LastName = tableRow.find("input[type='text'][id*='LastName']").val();
    var StateID = tableRow.find("select[id*='cboState'] :selected").val();
    var StateName = tableRow.find("select[id*='cboState'] :selected").text();
    var CityID = tableRow.find("select[id*='cboCity'] :selected").val();
    var CityName = tableRow.find("select[id*='cboCity'] :selected").text();
    var IsActive = (tableRow.find("[class*='box']").is(':checked') ? 1 : 0);

    if (typeof (FirstName) != 'undefined') {

        var index = IndexOfArrayByKeyValue(Students, "ID", ID);
        if (action.toUpperCase() == 'UPDATE') {
            if (index == null) {
                Students.push(PopulateStudent(ID, FirstName, LastName, StateID, StateName, CityID, CityName, IsActive));
            }
            else {
                Students[index].ID = ID;
                Students[index].FirstName = FirstName;
                Students[index].LastName = LastName;
                Students[index].StateID = StateID;
                Students[index].StateName = StateName;
                Students[index].CityID = CityID;
                Students[index].CityName = CityName;
                Students[index].IsActive = IsActive;
            }
        }
        else if (action.toUpperCase() == 'DELETE') {
            if (index != null) {
                Students.splice(index, 1);
            }
        }

        if (typeof (Storage) !== "undefined") {
            localStorage.setObject('Students', Students);
        }
        else {
            alert('local store does not support');
        }
        Show();
    }
}

function Show() {
    var theTable = document.createElement('table');
    Students = localStorage.getObject('Students');

    if (Students != null) {
        for (var i = 0, tr, td; i < Students.length; i++) {
            tr = document.createElement('tr');
            td = document.createElement('td');
            td.appendChild(document.createTextNode(Students[i].ID + '\u00A0\u00A0\u00A0'));
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(Students[i].FirstName + '\u00A0\u00A0\u00A0'));
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(Students[i].LastName + '\u00A0\u00A0\u00A0'));
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(Students[i].StateName + '\u00A0\u00A0\u00A0'));
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(Students[i].CityName + '\u00A0\u00A0\u00A0'));
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(Students[i].IsActive + '\u00A0\u00A0\u00A0'));
            tr.appendChild(td);

            theTable.appendChild(tr);
        }
    }
    $("#Displaytable").html(theTable);
}

$(document).on('change', '[id*="cboState"]', function () {
    var tableRow = $(this).closest('tr');
    var cboCity = $(this).closest('tr').find("select[id*='cboCity']");

    if ($(this).val() != '') {
        $.ajax({
            url: CascadeUrl,
            data: { StateID: $(this).val() },
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                cboCity.find(" option:not([value=''])").remove();
                $.each(data.CityList, function (i, item) {
                    cboCity.append(
                            $('<option></option>').val(item.ID).html(item.Name)
                        );
                });
                handleLocalStore(tableRow, 'UPDATE');
            }
        });
    }
    return false;
});

function HideToolTips(tblRow) {
    $(document).ready(function () {
        $('#StudentGrid > tbody  > tr').each(function (i, row) {
            if (tblRow < 0) {
                $(this).find("input[type='text'][id*='FirstName']").tooltip('hide');
                $(this).find("input[type='text'][id*='LastName']").tooltip('hide');
                $(this).find("select[id*='cboState']").tooltip('hide');
                $(this).find("select[id*='cboCity']").tooltip('hide');
            }
            else if (tblRow == i) {
                $(this).find("input[type='text'][id*='FirstName']").tooltip('hide');
                $(this).find("input[type='text'][id*='LastName']").tooltip('hide');
                $(this).find("select[id*='cboState']").tooltip('hide');
                $(this).find("select[id*='cboCity']").tooltip('hide');

            }
        });
    });
}

$(function () {
    $(document).on('click', '.edit-user', function () {
        var tr = $(this).parents('tr:first');
        HideToolTips($(tr).index());
        handleLocalStore(tr, 'UPDATE');

        $(tr).addClass('Editing');
        if ($(tr).find("td:nth-child(2)").hasClass('PadOn')) {
            $(tr).find("td:nth-child(1)").removeClass("PadOn");
            $(tr).find("td:nth-child(2)").removeClass("PadOn");
            $(tr).find("td:nth-child(3)").removeClass("PadOn");
            $(tr).find("td:nth-child(4)").removeClass("PadOn");
            $(tr).find("td:nth-child(5)").removeClass("PadOn");
        }

        $(tr).find("td:nth-child(1)").addClass("PadOn");
        $(tr).find("td:nth-child(2)").addClass("PadOn");
        $(tr).find("td:nth-child(3)").addClass("PadOff");
        $(tr).find("td:nth-child(4)").addClass("PadOff");
        $(tr).find("td:nth-child(5)").addClass("PadOff");
        $(tr).find("td:nth-child(6)").addClass("PadOff");

        tr.find('.edit-mode, .display-mode').toggle();
        $(tr).find("input[type='text'][id*='FirstName']").focus();
        return false;
    });

    $(document).on('click', '.cancel-user', function () {
        var tr = $(this).parents('tr:first');
        HideToolTips($(tr).index());
        handleLocalStore(tr, 'DELETE');
        var ID = $(tr).find("input[id*='HiddenID']").val();
        if (ID === '0')
        {
            tr.remove();
            return false;
        }
        var FirstName = $(tr).find("input[id*='HiddenFirstName']").val();
        var LastName = $(tr).find("input[id*='HiddenLastName']").val();
        var stateid = $(tr).find("input[id*='HiddenStateID']").val();
        var cityid = $(tr).find("input[id*='HiddenCityID']").val();

        $(tr).find("input[type='text'][id*='FirstName']").val(FirstName);
        $(tr).find("input[type='text'][id*='LastName']").val(LastName);
        $(tr).find("select[id*='cboState']").val(stateid);
        $(tr).find("select[id*='cboCity']").val(cityid);

        $(tr).removeClass('Editing');
        
        if ($(tr).find("td:nth-child(3)").hasClass('PadOff')) {
            $(tr).find("td:nth-child(1)").removeClass("PadOff");
            $(tr).find("td:nth-child(2)").removeClass("PadOff");
            $(tr).find("td:nth-child(3)").removeClass("PadOff");
            $(tr).find("td:nth-child(4)").removeClass("PadOff");
            $(tr).find("td:nth-child(5)").removeClass("PadOff");
            $(tr).find("td:nth-child(6)").removeClass("PadOff");
        }

        $(tr).find("td:nth-child(1)").addClass("PadOn");
        $(tr).find("td:nth-child(2)").addClass("PadOn");
        $(tr).find("td:nth-child(3)").addClass("PadOn");
        $(tr).find("td:nth-child(4)").addClass("PadOn");
        $(tr).find("td:nth-child(5)").addClass("PadOn");
        $(tr).find("td:nth-child(6)").addClass("PadOn");

        _newRow = 0;
        tr.find('.edit-mode, .display-mode').toggle();
        return false;
    });

    $(document).on('click', '.save-user', function () {
        var $form = $('form');
        if ($form.valid()) {
            var tr = $(this).parents('tr:first');
            HideToolTips($(tr).index());

            var Sortdir = $("#dir").val();
            var Sortcol = $("#col").val();
            var page = $("#page").val();

            var ID = tr.find("input[id*='HiddenID']").val();
            var FirstName = tr.find("input[type='text'][id*='FirstName']").val();
            var LastName = tr.find("input[type='text'][id*='LastName']").val();
            var StateID = tr.find("select[id*='cboState'] :selected").val();
            var StateName = tr.find("select[id*='cboState'] :selected").text();
            var CityID = tr.find("select[id*='cboCity'] :selected").val();
            var CityName = tr.find("select[id*='cboCity'] :selected").text();
            var IsActive = tr.find("[class*='box']").is(':checked');

            var data = new Object();
            var StudentArray = [];
            StudentArray.push(PopulateStudent(ID, FirstName, LastName, StateID, StateName, CityID, CityName, IsActive));

            data.page = page;
            data.sort = Sortcol;
            data.sortdir = Sortdir;
            data.Students = StudentArray;

            $.ajax({
                url: updateUrl,
                data: JSON.stringify({ oSVm: data, 'Action': 'UPDATE' }),
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    $('#gridContent').html(data);
                    $("#page").val(page);
                    $("#col").val(Sortcol);
                    $("#dir").val(Sortdir);
                    handleLocalStore(tr, 'DELETE');
                    initScripts();

                    tr.find('.edit-mode, .display-mode').toggle();
                    if ($(tr).find("td:nth-child(3)").hasClass('PadOff')) {
                        $(tr).find("td:nth-child(2)").removeClass("PadOff");
                        $(tr).find("td:nth-child(3)").removeClass("PadOff");
                        $(tr).find("td:nth-child(4)").removeClass("PadOff");
                        $(tr).find("td:nth-child(5)").removeClass("PadOff");
                        $(tr).find("td:nth-child(6)").removeClass("PadOff");
                    }

                    $(tr).find("td:nth-child(2)").addClass("PadOn");
                    $(tr).find("td:nth-child(3)").addClass("PadOn");
                    $(tr).find("td:nth-child(4)").addClass("PadOn");
                    $(tr).find("td:nth-child(5)").addClass("PadOn");
                    $(tr).find("td:nth-child(6)").addClass("PadOn");
                    _newRow = 0;
                }
            });
        }
        return false;
    });

    $(document).on('click', '.btnRed', function () {
        var tr = $(this).parents('tr:first');
        var Sortdir = $("#dir").val();
        var Sortcol = $("#col").val();
        var page = $("#page").val();

        var ID = tr.find("input[id*='HiddenID']").val();
        var FirstName = '';
        var LastName = '';
        var StateID = 0;
        var StateName = '';
        var CityID = 0;
        var CityName = '';
        var IsActive = 0;

        var data = new Object();
        var StudentArray = [];
        StudentArray.push(PopulateStudent(ID, FirstName, LastName, StateID, StateName, CityID, CityName, IsActive));

        data.page = page;
        data.sort = Sortcol;
        data.sortdir = Sortdir;
        data.Students = StudentArray;

        if (confirm("Are you sure you want to delete?")) {
            $.ajax({
                url: updateUrl,
                data: JSON.stringify({ oSVm: data, 'Action': 'DELETE' }),
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    $('#gridContent').html(data);
                    $("#page").val(page);
                    $("#col").val(Sortcol);
                    $("#dir").val(Sortdir);

                    initScripts();
                    handleLocalStore(tr, 'DELETE');
                }
            });
        }
        return false;
    });
})

$(document).ready(function () {
    var classes = { groupIdentifier: ".form-group", error: 'has-error', success: null };//success: 'has-success' 
    function updateClasses(inputElement, toAdd, toRemove) {
        var group = inputElement.closest(classes.groupIdentifier);
        if (group.length > 0) {
            group.addClass(toAdd).removeClass(toRemove);
        }
    }

    function onError(inputElement, message) {
        updateClasses(inputElement, classes.error, classes.success);

        var options = { html: true, placement: 'bottom', title: '<div class="tooltip-alert alert-danger" data-placement="bottom">' + message + '</div>' };
        $(inputElement).addClass('validation-error');
        inputElement.tooltip("destroy")
            .addClass("error")
            .tooltip(options);
        inputElement.tooltip("show");
        inputElement.addClass('HasErr');
    }

    function onSuccess(inputElement) {
        updateClasses(inputElement, classes.success, classes.error);
        inputElement.tooltip("destroy");
        $(inputElement).removeClass('validation-error');
        inputElement.tooltip("hide");
        inputElement.removeClass('HasErr');
    }

    function onValidated(errorMap, errorList) {
        $.each(errorList, function () {
            onError($(this.element), this.message);
        });

        if (this.settings.success) {
            $.each(this.successList, function () {
                onSuccess($(this));
            });
        }
    }

    $('form').each(function () {
        var validator = $(this).data('validator');
        validator.settings.showErrors = onValidated;
    });
});

function getUrlVars(url) {
    var vars = [], hash;
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(decodeURIComponent(hash[0]));
        vars[decodeURIComponent(hash[0])] = decodeURIComponent(hash[1]);
    }
    if (vars[0] == url) {
        vars = [];
    }
    return vars;
}

function findArrayByKeyValue(arraytosearch, key, valuetosearch) {
    var Person = [];
    for (var i = 0; i < arraytosearch.length; i++) {
        if (arraytosearch[i][key] == valuetosearch) {
            Person = arraytosearch[i];
        }
    }
    return Person;
}

function IndexOfArrayByKeyValue(arraytosearch, key, valuetosearch) {
    if (arraytosearch != null) {
        for (var i = 0; i < arraytosearch.length; i++) {
            if (arraytosearch[i][key] == valuetosearch) {
                return i;
            }
        }
    }
    return null;
}

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

Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}