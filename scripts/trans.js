$(document).ready(function () {
    var dropArea = document.querySelector('.drop-area'),
        resultArea = document.querySelector('.result-area'),
        hintUpload = document.querySelector('.hint-upload'),
        hintResult = document.querySelector('.hint-result'),
        uploadFile = document.querySelector('input[type="file"]'),
        transButton = document.querySelector('.trans-button');
    
    var itemTemplate = $.parseHTML('<div class="file-item"> \
                                        <div class="filenameWrapper"> \
                                            <i class="fas"></i> \
                                            <span class="file-name">filename.jpg</span> \
                                        </div> \
                                        <div class="fileOps"> \
                                            <a class="file-op file-preview">预览</a> \
                                            <a class="file-op file-delete">删除</a> \
                                        </div> \
                                    </div>')[0];

    function ignoreDrag(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleFiles(files) {
        let numFiles=files.length,
            itemNode, 
            fragment=document.createDocumentFragment();

        if (numFiles>0){
            hintUpload.classList.add('hidden');
        }

        for (let i=0; i<numFiles; i++){
            let file = files[i],
                fileType,
                fileTypeReg = /^(image|video)\//;

            if(!fileTypeReg.test(file.type)) {
                continue;
            }

            itemNode = itemTemplate.cloneNode(true);
            $(itemNode).data("file", file);
            itemNode.querySelector('.file-name').innerHTML = file.name;
            var icon = itemNode.querySelector('i');
            fileType = file.type.match(fileTypeReg)[1];
            console.log(fileType);
            $(itemNode).data("filetype", fileType);
            if (fileType == "image") {
                icon.classList.add('fa-file-image');
            }
            else if (fileType == "video") {
                icon.classList.add('fa-file-video');
            }

            fragment.appendChild(itemNode);
        }

        dropArea.appendChild(fragment);
    }

    function handleDrop(e) {
        ignoreDrag(e);
        var files = e.dataTransfer.files;
        console.log("ondrop fired");
        handleFiles(files);
    }

    function clearAllCookie() {  
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);  
        if(keys) {  
            for(var i = keys.length; i--;)  
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()  
        }  
    }  

    function FileUpload (fileItem) {
        var base_url = "http://101.35.24.184:9008/upload/",
            url,
            formData = new FormData(),
            file = $(fileItem).data("file"),
            fileType = $(fileItem).data("filetype"),
            bar = fileItem.querySelector(".progress-bar");
            XMLHttp = new XMLHttpRequest();

        if(fileType == "image") {
            url = base_url + "image/single";
        }
        else if(fileType == "video") {
            url = base_url + "video/single";
        }
        else {
            console.log("wrong file type: " + fileType);
        }

        this.bar = bar;
        this.XMLHttp = XMLHttp;
        
        var self = this;
        XMLHttp.onprogress = function (e) {
            if (e.lengthComputable) {
                let percent = Math.round((e.loaded/e.total)*100);
                self.bar.value = percent;
            }
            else {
                console.log("download progress is not computable");
            }
        };
        // this.XMLHttp.onload = function (e) {
        //     var response = self.XMLHttp.response;
        //     //console.log("download response: " + response);
        //     //fileItem.dataset.file = 
        //     self.bar.value = 100;
        //     var fileOps = fileItem.querySelector(".fileOps");
        //     fileOps.innerHTML = '<a class="file-op file-preview">预览</a> \
        //                         <a class="file-op file-download">下载</a>';
        // };

        console.log(localStorage.getItem("token"));
        // clearAllCookie();
        // console.log(document.cookie);
        // $.cookie('token', localStorage.getItem("token"), {  
        //     path: '/',
        //     domain: '101.35.24.184',
        //     secure: false
        // });  
        // document.cookie = "token=" + localStorage.getItem("token")
        //                      + "; path=/; domain=101.35.24.184; secure=false"; //SameSite=none;Secure=true";
        formData.append(fileType, file);
        XMLHttp.responseType = "json";
        XMLHttp.open("POST", url, true);
        XMLHttp.withCredentials = true;
        XMLHttp.timeout = 3 * 1000;
        //XMLHttp.setRequestHeader("Cookie", "token=" + encodeURIComponent(localStorage.getItem("token")));
        XMLHttp.onreadystatechange = function() {
            if(self.XMLHttp.readyState == 4) {
                if(self.XMLHttp.status == 200) {
                    console.log("download response: " + self.XMLHttp.responseText);
                    var response = self.XMLHttp.response;
                    $(fileItem).removeData("file");
                    //$(fileItem).data("url", );
                    self.bar.value = 100;
                    var fileOps = fileItem.querySelector(".fileOps");
                    fileOps.innerHTML = '<a class="file-op file-preview">预览</a> \
                                        <a class="file-op file-download">下载</a>';
                }
                else {
                    console.log("download failed: " + self.XMLHttp.status);
                }
            }
        }
        XMLHttp.ontimeout = function(e) {
            console.log("request timeout");
        }
        XMLHttp.onerror = function(e) {
            console.log(e);
        }
        console.log(document.cookie);
        XMLHttp.send(formData);
    }

    function transFiles (e) {
        let fileList = dropArea.querySelectorAll('.file-item'),
            numFiles = fileList.length,
            fragment = document.createDocumentFragment();

        if (numFiles > 0) {
            hintResult.classList.add('hidden');
        }
        
        for (let i=0; i<numFiles; i++) {
            let itemNode = fileList[i].cloneNode(true);
            $(itemNode).data("file", $(fileList[i]).data("file"));
            $(itemNode).data("filetype", $(fileList[i]).data("filetype"));
            
            let progressBar = document.createElement("progress");
            progressBar.value = 0;
            progressBar.max = 100;
            progressBar.classList.add('progress-bar');
            
            let fileOps = itemNode.querySelector(".fileOps");
            fileOps.innerHTML = "";
            fileOps.append(progressBar);
            fragment.appendChild(itemNode);

            new FileUpload(itemNode);
        }

        $(".drop-area .file-item").remove();
        dropArea.firstElementChild.classList.remove("hidden");
        resultArea.appendChild(fragment);
    }

    function previewHandler(target) {
        var file_url, 
            targetItemData = $(target).closest(".file-item").data(),
            file_type = targetItemData.filetype,
            preview_area,
            reader;

        console.log($.type(targetItemData.file));
        // if(targetItemData.file) {
        //     file_url = window.URL.createObjectURL(targetItemData.file);
        //     //file_url = targetItemData.file;
        //     console.log("create url from file");
        // }
        // else {
        //     file_url = targetItemData.url;
        //     console.log("url from link");
        // }

        if(file_type == "image") {
            preview_area = document.createElement("img");
            preview_area.alt = "抱歉，该图片无法预览，请下载后查看";
        }
        else {
            preview_area = document.createElement("video");
            preview_area.innerHTML = "抱歉，您的浏览器不支持内嵌视频，请下载后观看";
            preview_area.setAttribute("controls", "");
        }

        preview_area.height = 100;
        //preview_area.src = file_url;
        preview_area.classList.add("preview");
        preview_area.onload = function() {
            if(this.src instanceof URL) {
                window.URL.revokeObjectURL(this.src);
            }
        }
        preview_area.onclick = function() {
            preview_area.remove();
        }

        if(targetItemData.file){
            reader = new FileReader();
            reader.addEventListener("load", function() {
                preview_area.src = this.result;
                $(".transWrapper").append(preview_area);
            }, false);
            reader.readAsDataURL(targetItemData.file);
        }
        else {
            preview_area.src = file_url;
        }

        // $(".transWrapper").append(preview_area);
    }

    function downloadHandler(target) {
        var targetItem = $(target).closest(".file-item"),
            link;

        link = document.createElement("a");
        link.setAttribute("download", "");
        link.href = targetItem.dataset.url;
        link.click();
    }

    function transEventHandler(event) {
        var target = event.target,
            classes = target.classList;

        if(classes.contains("file-preview")){
            event.preventDefault();
            previewHandler(target);
            return true;
        }
        else if(classes.contains("file-download")){
            event.preventDefault();
            downloadHandler(target);
            return true;
        }
        else if(classes.contains("file-delete")){
            event.preventDefault();
            $(target).closest(".file-item").remove();
            if(dropArea.childElementCount == 1){
                dropArea.firstElementChild.classList.remove('hidden');
            }
            return true;
        }

        return false;
    }

    uploadFile.addEventListener("change", function(e) {
        console.log("onchange fired");
        handleFiles(this.files);
    }, false);
    dropArea.addEventListener("click", function(e) {
        let button_clicked = transEventHandler(e);
        if(!button_clicked){
            uploadFile.click();
        }
    }, false);
    dropArea.addEventListener("dragenter", ignoreDrag, false);
    dropArea.addEventListener("dragover", ignoreDrag, false);
    dropArea.addEventListener("drop", handleDrop, false);

    transButton.addEventListener("click", transFiles, false);
    resultArea.addEventListener("click", transEventHandler, false);
});