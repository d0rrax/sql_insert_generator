$(document).ready(function() {
    $("#submitColumnCount").click(function() {
        var columnCount = $("#valueColumnCount").val();
        $("#table").html("");
        $("#table").append("<tr colspan=\"" + columnCount + "\"><th colspan=\"" + columnCount + "\"><div class=\"input-group\"> " + "<span class=\"input-group-addon\"><strong>Columns</strong></span></div></th></tr>");
        $("#table").append("<tr id=\"header\">");
        for (var i = 1; i <= columnCount; i++) {
            $("#table tr#header").append("<th class=\"columnTitle\" id=\"columnTitle_" + i + "\"><input type=\"text\" /></th>");
        }
        
        addOptionElement(columnCount);
        addQuoteCheckbox(columnCount);
    });
});

$(document).ready(function() {
    $("#submitLineCount").click(function() {
        var lineCount = $("#valueLineCount").val();
        var columnCount = $("#valueColumnCount").val();
        $("#table tr.values").remove();
        $("#table tr#valuesTitle").remove();
        $("#table").append("<tr colspan=\"" + columnCount + "\" id=\"valuesTitle\"><th colspan=\"" + columnCount + "\"><div class=\"input-group\"> " + "<span class=\"input-group-addon\"><strong>Values</strong></span></div></th></tr>");
        for (var i = 1; i <= lineCount; i++) {
            $("#table").append("<tr id=\"value_" + i + "\" class=\"values\">");
            for (var ii = 1; ii <= columnCount; ii++) {
                $("#table tr#value_" + i).append("<td><input type=\"text\" value=\"null\" class=\"valueColumn_" + ii + "\"/></td>");
            }
            $("#table").append("</tr>");
        }
    });
});

function addOptionElement(columnCount)
{
    $("#table tr#header").after("<tr id=\"columnOptions\">");    
        
    for (var i = 1; i <= columnCount; i++) {
        $("#table tr#columnOptions").append("<th class=\"columnOption\" id=\"columnOption_" + i + "\"><div class=\"input-group\"> " +
        "<select name=\"fillWith\" class=\"form-control fillWith\" id=\"fillWith_" + i + "\">" +
        "<option selected value=\"null\">null</option>" +
        "<option value=\"numeric\">Numeric</option>" + 
        "<option value=\"alphanumeric\">Alphanumeric</option>" +
        "<option value=\"alpha\">Alpha</option>" +
        "<option value=\"date\">Date</option>" +
        "</select></div></th>");
    }
        
    $("#table tr#columnOptions").after("</tr>");
}

function addQuoteCheckbox(columnCount)
{
    $("#columnOptions").after("<tr id=\"addQuotes\">");
    
    for (var i = 1; i <= columnCount; i++) {
        $("#addQuotes").append("<th><div class=\"input-group\"><span class=\"input-group-addon\">Quotes</span><span class=\"input-group-addon\"><input type=\"checkbox\" class=\"addQuoteCheckboxes\" id=\"addQuoteCheckbox_" + i + "\"></span></div></th>");
    }
}

$(document).ready(function() {
    $(document).on("click", ".addQuoteCheckboxes", function() {
        var id = $(this).attr("id");
        var split = id.split("_");
        var columnNumber = split[1];
        $(".valueColumn_" + columnNumber).each(function() {
            var oldValue = $(this).val();
            var newValue = "";
            if ("\'" === oldValue[0] || "\'" === oldValue[oldValue.Lenght - 1]) {
                newValue = oldValue.replace(/'/gi, "");
            } else {
                newValue = "\'" + oldValue + "\'";
            }
            $(this).val(newValue);
        });
    });
});

$(document).ready(function() {
    $(document).on("change", ".fillWith", function() {
        var selectedOption = $(this).val();
        var selectId = $(this).attr("id");
        var split = selectId.split("_");
        var columnNumber = split[1];
        $("#addQuoteCheckbox_" + columnNumber).prop("checked", false);
        switch(selectedOption) {
        case "null":
        default:
            $(".valueColumn_" + columnNumber).val("null");
            break;
        case "numeric":
            var i = 1;
            $(".valueColumn_" + columnNumber).each(function() {
                $(this).val(i);
                i++;
            });
            break;
        case "alphanumeric":
            $(".valueColumn_" + columnNumber).each(function() {
                $(this).val(randomString(true, 10));
            });
            break;
        case "alpha":
            $(".valueColumn_" + columnNumber).each(function() {
                $(this).val(randomString(false, 10));
            });
            break;
        case "date":
            $(".valueColumn_" + columnNumber).each(function() {
                $(this).val(randomDate(new Date(1970, 0, 1), new Date()));
            });
            break;
        }
    });
});

function randomString(withNumbers, length)
{
    var text = "";
    if (true === withNumbers) {
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    } else {
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    }
    
    for(var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function randomDate(start, end)
{
    var randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    var randomDateFormatted = formatDate(randomDate);
    return randomDateFormatted;
}

function formatDate(date)
{
    var year = date.getFullYear();
    var month = date.getMonth()+1; 
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds(); 
    
    if(month.toString().length === 1) {
        var month = '0'+month;
    }
    if(day.toString().length === 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length === 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length === 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length === 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
    
    return dateTime;
}

$(document).ready(function() {
    $("#generateButton").click(function() {
        var tableName = $("#tableName").val();
        var insertStatement = "INSERT INTO " + tableName + " VALUES <br />";
        var lineCount = $("#valueLineCount").val();
        $("tr.values").each(function(index) {
            insertStatement += "(";
            $(this).children().each(function(index) {
                var input = $(this).children("input");
                var value = $(input).val();
                if (0 < index) {
                    insertStatement += ", ";
                }
                insertStatement += value;
            });
            if (index + 1 < lineCount) {
                insertStatement += "),<br />";
            }
        });
        insertStatement += ");";
        $("#result").html(insertStatement);
    });
});