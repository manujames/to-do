const USERNAME = '';
const PASSWORD = '';
const URL = 'https://jsonplaceholder.typicode.com/todos';
var completedTasks = [];
var pendingTasks = [];
var tickCount = 0;

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
function validateLogin(){
    let username = $('#username').val();
    let password = $('#password').val();
    if(username === USERNAME && password === PASSWORD){
        $('#loginValidationMessage').text("");
        $('.login').attr('hidden',true);
        $('.tasks').attr('hidden',false);
        fetchList(loadList);
        return true;
    }
    else{
        $('#loginValidationMessage').text("Invalid username or password");
        return false;
    }
}

//Fetch list of tasks from api
function fetchList(callback){
    $.getJSON(URL,function(response, status){
        if(status === 'success'){
            callback(response);
        }
        else{
            // Error handling
        }
    });
}

function loadList(list){
    for (let i in list){
        if(list[i].completed){
            completedTasks.push(list[i]);
        }
        else{
            pendingTasks.push(list[i]);
        }
    }
    displayPendingTasks();
    displayCompletedTasks();
}

function refreshLists(){
    for (let i in pendingTasks){
        if(pendingTasks[i].completed){
            completedTasks.unshift(pendingTasks[i]);
            pendingTasks.splice(i,1);
        }
    }
    displayPendingTasks();
    displayCompletedTasks();
}

function displayPendingTasks(){
    let htmlContent = "<table class='table table-borderless table-hover'>";
    for(let i in pendingTasks){
        htmlContent += "<tr>";
        htmlContent += `<td class="text-truncate" style="max-width: 50vw"><input type="checkbox" id=${i} onchange="countCheckBox(this);">`;
        htmlContent += ` ${pendingTasks[i].title}</td>`;
        htmlContent += "</tr>";
    }
    htmlContent += "</table>";
    $('.pending-tasks').html(htmlContent);
}

function displayCompletedTasks(){
    let htmlContent = "<table class='table table-borderless table-hover'>";
    for(let i in completedTasks){
        htmlContent += "<tr>";
        htmlContent += `<td class="text-truncate" style="max-width: 15vw"><input type="checkbox" checked disabled=true">`;
        htmlContent += ` <s>${(completedTasks[i].title)}</s></td>`;
        htmlContent += "</tr>";
    }
    htmlContent += "</table>";
    $('.completed-tasks').html(htmlContent);
}

function countCheckBox(input){
    doneFiveTasks(input)
    .then(function(){
        setTimeout(function(){
            alert("Yay! You've completed five tasks.");
            refreshLists();
        },100)
    });
}

function doneFiveTasks(input){
    return new Promise(function(resolve){
        if(input.checked){
            tickCount++;
            pendingTasks[input.id].completed = true;
        }
        else{
            tickCount--;
            pendingTasks[input.id].completed = false;
            if(tickCount < 0){
                tickCount = 0;
            }
        }
        if(tickCount >= 5){
            tickCount = 0;
            resolve();
        }
    });
}