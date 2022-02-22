$(document).ready(function () {
    function activateItem(item){
        // var itemList = document.querySelectorAll('.nav-left li');
        // itemList.forEach(element => {
        //     element.classList.remove('active');
        // });
        $(".nav-left li").removeClass('active');
        if(item instanceof Element){
            item.classList.add('active');
        }
    }

    // function executeScript(html){
    //     const reg = /<script[^>]*>([^\x00]+)$/i;
    //     //对整段HTML片段按<\/script>拆分
    //     var htmlBlock = html.split("<\/script>");
    //     for (var i in htmlBlock) {
    //         var blocks;//匹配正则表达式的内容数组，blocks[1]就是真正的一段脚本内容，因为前面reg定义我们用了括号进行了捕获分组
    //         if (blocks = htmlBlock[i].match(reg)) {
    //             var code = blocks[1].replace(/<!--/, '');
    //             try {
    //                 eval(code);
    //             } 
    //             catch (e) {
    //                 console.log(e.message);
    //             }
    //         }
    //     }
    // }

    function IndexEventHandler(event){
        const target = event.target,
            navLeft = document.querySelector('.nav-left'),
            usrMenu = document.querySelector('.usrMenuWrapper');

        switch(target.id){
            case 'nav-left-button':
                usrMenu.classList.remove('usr-menu-active');
                navLeft.classList.toggle('nav-left-active');
                break;
            case 'usr-menu-button':
                navLeft.classList.remove('nav-left-active');
                usrMenu.classList.toggle('usr-menu-active');
                break;
            case 'link-trans':
                usrMenu.classList.remove('usr-menu-active');
                activateItem(target.parentNode);
                requestForPage('trans');
                break;
            case 'link-hist':
                usrMenu.classList.remove('usr-menu-active');
                activateItem(target.parentNode);
                requestForPage('hist');
                break;
            case 'link-usrInfo':
                usrMenu.classList.remove('usr-menu-active');
                activateItem(null);
                requestForPage('usrInfo');
                break;
            default:
                navLeft.classList.remove('nav-left-active');
                usrMenu.classList.remove('usr-menu-active');
                break;
        }
    }

    // jQuery的html()方法:如果参数中含有<script>标签，内部会使用eval和创建新节点的方式进行处理执行，
    // 如果是外联的js文件，jQuery会发一个同步的ajax请求来获取代码
    function requestForPage(fileName) {
        $.get("../html/"+fileName+".html", 
            function (data, textStatus, jqXHR) {
                $("#contentWrapper").html(data);
            },
            "html"
        );
    }

    /* 用DOM提供的innerHTML方式来添加代码时，<script>标签中的代码并不能执行，
       如果有src属性，指向的外联文件也不会被加载
    function requestForPage(fileName) {
        var xmlHttp;
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        else {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlHttp.onreadystatechange = function() {
            var contentWrapper, html_head, css, script, resonse_html;
            if (xmlHttp.readyState == 4){
                if (xmlHttp.status == 200) {
                    contentWrapper = document.getElementById('contentWrapper');
                    resonse_html = xmlHttp.responseText;
                    contentWrapper.innerHTML = resonse_html;
                    executeScript(resonse_html);
                }
                else {
                    alert("error (status:"+xmlHttp.status+")");
                    return;
                }
            }
        }

        // console.log(base_url+fileName+'.jsp');
        xmlHttp.open("GET", '../html/'+fileName+'.html');
        xmlHttp.send();
    } */

    document.addEventListener("click", IndexEventHandler);
    requestForPage('trans');
})

