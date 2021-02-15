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
        $('.navbar').attr('hidden',false);
        $('.tasks').attr('hidden',false);
        fetchList(loadList,errorHandler);
        return true;
    }
    else{
        $('#loginValidationMessage').text("Invalid username or password");
        return false;
    }
}

function logout(){
    $('#username').val('');
    $('#password').val('');
    completedTasks = [];
    pendingTasks = [];
    tickCount = 0;
    $('.tasks').attr('hidden',true);
    $('.navbar').attr('hidden',true);
    $('.login').attr('hidden',false);
}

//Fetch list of tasks from api
function fetchList(callback,errorHandler){
    htmlContent = "<p class='boxMessage'>Loading..</p>"
    $('.pending-tasks').html(htmlContent);
    $('.completed-tasks').html(htmlContent);
    $.getJSON(URL,function(response, status){
        if(status === 'success'){
            callback(response);
        }
        else{
            errorHandler(status);
        }
    });
}

function errorHandler(errText){
    htmlContent = "<p class='boxMessage'>Sorry! Unable to fetch tasks.</p>"
    $('.pending-tasks').html(htmlContent);
    $('.completed-tasks').html(htmlContent);
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
    let completedIndices = [];
    for (let i in pendingTasks){
        if(pendingTasks[i].completed){
            completedTasks.unshift(pendingTasks[i]);
            // Store indices to remove from pending tasks in a seperate array
            completedIndices.push(i);
        }
    }
    for(let i in completedIndices){
        // Fade out this item.
        $(`.pending-tasks table tr:nth-child(${parseInt(completedIndices[i]) + 1})`).fadeOut(300);
        // Remove the item at previously selected indices from pendingTasks array
        // completedIndices[i]-i is used for adjusting the mismatch in index due to removing elements from pendingTasks array
        pendingTasks.splice(completedIndices[i]-i,1);
    }
    setTimeout(displayPendingTasks,300);
    displayCompletedTasks();
    // Fade in newly added 5 items in completed tasks list.
    $('.completed-tasks table tr:nth-child(-n+5)').fadeOut(1).fadeIn(300);
}

function displayPendingTasks(){
    let htmlContent = "";
    if(pendingTasks.length){
        htmlContent += "<table class='table table-borderless table-hover'>";
        for(let i in pendingTasks){
            htmlContent += "<tr>";
            htmlContent += `<td class="text-truncate" style="max-width: 50vw"><input type="checkbox" id=${i} onchange="countCheckBox(this);">`;
            htmlContent += ` ${pendingTasks[i].title}</td>`;
            htmlContent += "</tr>";
        }
        htmlContent += "</table>";
    }
    else{
        htmlContent += "<p class='boxMessage'>Hurray!! Everything done.</p>"
    }
    $('.pending-tasks').html(htmlContent);
}

function displayCompletedTasks(){
    let htmlContent = "";
    if(completedTasks.length){
        htmlContent += "<table class='table table-borderless table-hover'>";
        for(let i in completedTasks){
            htmlContent += "<tr>";
            htmlContent += `<td class="text-truncate" style="max-width: 15vw"><input type="checkbox" checked disabled=true">`;
            htmlContent += ` <s>${(completedTasks[i].title)}</s></td>`;
            htmlContent += "</tr>";
        }
        htmlContent += "</table>";
    }
    else{
        htmlContent += "<p class='boxMessage'>Nothing to show here.</p>"
    }
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