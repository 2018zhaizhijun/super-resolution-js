$(document).ready(function () {
    $("#submit-button").click(function (e) { 
        e.preventDefault();
        var baseUrl = "http://101.35.24.184:9008/user/registry",
            formObj = {},
            formArray = $(".form-register").serializeArray();
        $.each(formArray, function (index, item) {
            if(!item.reportValidity()){
                return;
            }
             formObj[item.name] = item.value;
        });

        $.post(baseUrl, formObj,
            function (data, textStatus, jqXHR) {
                console.log("register response data: " + data);
                window.location.href = "../html/LogIn.html";
            },
        );
    });
});