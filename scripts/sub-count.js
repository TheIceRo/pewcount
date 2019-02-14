const remote = require('electron').remote;
var maximized = false;
var socialblade = require('socialblade-data');

function loadListeners(){
    var window = remote.getCurrentWindow();
    document.getElementById("close").addEventListener("click",function(){
        window.close()
    });
    document.getElementById("minimize").addEventListener("click",function(){
        window.minimize();
    });
    document.getElementById("title").addEventListener("click",function(){
        window.reload();
    });
    document.getElementById("maximize").addEventListener("click",function(){
        if(maximized){
            window.restore();
            maximized = false;
        }
        else{
            maximized = true;
            window.maximize();
        }
    });
}
function loadChannelData(){
    socialblade.loadChannelData("UC03MC72mOqM02EwWGL-NGpA",function(err,data){
        console.log(data);
    });
    
}
function start(){
    loadListeners();
    loadChannelData();
}

document.addEventListener("DOMContentLoaded",function(){
    start();
})