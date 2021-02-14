const username = 'admin';
const password = '12345';
$(document).ready(function(){
    
});

// Toggle password display
function togglePassword(field){
    let pwd = $('#password');
    if(field.getAttribute('toggleStat') == 'hide'){
        field.setAttribute('toggleStat', 'show');
        field.innerHTML = 'Show password <i class="far fa-eye"></i>';
        if(pwd.val() != null){
            pwd.attr('type','text');
        }
    }
    else{
        field.setAttribute('toggleStat', 'hide');
        field.innerHTML = 'Show password <i class="far fa-eye-slash"></i>';
        if(pwd.val() != null){
            pwd.attr('type','password');
        }
    }
}

// Verify username and password
function validateLogin(input){
    if(input.username.value === username && input.password.value === password){
        $('#loginValidationMessage').text("");
        $('.login').hide();
        $('.tasks').attr('hidden',false);
        return true;
    }
    else{
        $('#loginValidationMessage').text("Invalid username or password");
        return false;
    }
}
