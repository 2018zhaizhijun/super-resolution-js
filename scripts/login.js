$(document).ready(function () {
    $("#submit-button").click(function (e) { 
        e.preventDefault();
        var baseUrl = "http://101.35.24.184:9008/user/login/password",
            formObj = {},
            formArray = $(".form-login").serializeArray();
        $.each(formArray, function (index, item) { 
             formObj[item.name] = item.value;
        });
        $.get(baseUrl, formObj,
            function (data, textStatus, jqXHR) {
                console.log(data);
                var token = data["data"]["token"];
                localStorage.setItem('token', token);
                window.location.replace("../html/Index.html");
            },
            "json"
        ).fail(function () {
            alert("账号或密码错误");
        });
    });
});
