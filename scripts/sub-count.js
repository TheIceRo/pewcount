const remote = require('electron').remote;
var fs = require("fs"), filename = process.argv[2];
var maximized = false;
var request = require("request");
let pewds = 0;
let tseries = 0;
let key;

function loadKey(){
    var data = fs.readFileSync("google-api.key","utf8");
    key = data.toString();
    console.log("loaded key: '"+key+"'");
}

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
setInterval(function(){
    loadChannelData("PewDiePie",0);
    loadChannelData("tseries",1);
    console.log("loaded");
},3000);
setInterval(function(){
    subDifference();
},3050);
function subDifference(){
    document.getElementsByClassName("sub-diff-container")[0].getElementsByClassName("sub-diff-text")[0].innerHTML = "Pewds is ahead by: "+numberWithCommas(pewds-tseries);
}
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
function loadChannelData(username,number){
    var url = "https://www.googleapis.com/youtube/v3/channels?part=statistics"+"&forUsername="+username+"&key="+key;

    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            if(body.items[0].statistics.subscriberCount!=null){
                document.getElementsByClassName("sub-container")[number].getElementsByClassName("channel-subs")[0].innerHTML = numberWithCommas(body.items[0].statistics.subscriberCount);
                switch (number) {
                    case 0:
                        pewds = body.items[0].statistics.subscriberCount;
                    break;
                    case 1:
                        tseries = body.items[0].statistics.subscriberCount;
                    break;
                }
            }
            else{
                console.log(body);
            }
        }
    });
}
setTimeout(function(){
    subDifference();
},500)
function start(){
    loadListeners();
    loadChannelData("PewDiePie",0); loadChannelData("tseries",1);
    subDifference();
}

document.addEventListener("DOMContentLoaded",function(){
    loadKey();
    setTimeout(start(),100);
})