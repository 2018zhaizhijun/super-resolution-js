$(document).ready(function () {
    var sex = 1,
        base_url = "http://101.35.24.184:9008/",
        get_avatar_url = base_url + "user/avatar",
        info_url = base_url + "user/info",
        post_avatar_url = base_url + "upload/avatar",
        name_info = document.querySelector('.usr-name'),
        name_edit = document.getElementById('username'),
        sex_info = document.querySelector('.usr-sex'),
        sex_edit = document.querySelector('.sex-select'),
        save_button = document.getElementById('save-button'),
        editButton = document.querySelector('.edit-button-block a');

    function usrInfoEventHandler(event){
        var target = event.target;

        function startEdit() {
            // name_info = document.querySelector('.usr-name');
            // name_edit = document.getElementById('username');
            name_edit.value = name_info.innerHTML;
            name_info.classList.add('hidden');
            name_edit.classList.remove('hidden');

            sex_info = document.querySelector('.usr-sex');
            sex_edit = document.querySelector('.sex-select');
            if(sex) {
                document.getElementById('sex-male').checked = false;
                document.getElementById('sex-female').checked = true;
            }
            else {
                document.getElementById('sex-male').checked = true;
                document.getElementById('sex-female').checked = false;
            }
            sex_info.classList.add('hidden');
            sex_edit.classList.remove('hidden');

            save_button = document.getElementById('save-button');
            save_button.classList.remove('hidden');

            editButton = document.querySelector('.edit-button-block a');
            editButton.innerHTML = '取消';
            editButton.id = 'cancel-button';
        }

        function endEdit(update) {
            // name_info = document.querySelector('.usr-name');
            // name_edit = document.getElementById('username');
            if(update){
                name_info.innerHTML = name_edit.value;
            }
            name_info.classList.remove('hidden');
            name_edit.classList.add('hidden');

            // sex_info = document.querySelector('.usr-sex');
            // sex_edit = document.querySelector('.sex-select');
            if(update) {
                if(document.getElementById('sex-male').checked) {
                    sex = 0;
                    sex_info.innerHTML = '男';
                }
                else {
                    sex = 1;
                    sex_info.innerHTML = '女';
                }
            }
            sex_info.classList.remove('hidden');
            sex_edit.classList.add('hidden');

            // save_button = document.getElementById('save-button');
            save_button.classList.add('hidden');

            // editButton = document.querySelector('.edit-button-block a');
            editButton.innerHTML = '编辑';
            editButton.id = 'edit-button';
        }

        switch(target.id){
            case 'edit-button':
                startEdit();
                break;
            case 'cancel-button':
                endEdit(false);
                break;
            case 'save-button':
                endEdit(true);
                // post to server
                break;
            case 'upload-avatar-button':
                // post to server
                break;
            default:
                break;
        }
    }

    document.addEventListener('click', usrInfoEventHandler);

    $.get(get_avatar_url, null,
        function (data, textStatus, jqXHR) {
            console.log("get avatar response:" + data);
            if(data['data']) {
                $("#avatar").attr('src', data['data']);
            }
            else {
                $("#avatar").attr('src', '../assets/login.jpg');
            }
        },
        "json"
    );

    $.get(info_url, null,
        function (data, textStatus, jqXHR) {
            console.log("get info response:" + data);
            name_info.innerHTML = data['data']['name'];
            sex = data['data']['sex'];
            if(sex) {
                sex_info.innerHTML = '男';
            }
            else {
                sex_info.innerHTML = '女';
            }
        },
        "json"
    );
    
});