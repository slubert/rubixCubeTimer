const midBox = document.getElementById("midBox")
const fiveRecentBox = document.getElementById('fiveRecentBox')
const fiveRecentList = document.getElementById('fiveRecentList')
const currentAverageTime = document.getElementById("currentAverageTime");
const info = document.getElementById('infoBox')
const startBox = document.getElementById('startBox')
const bestSingleTimeBox = document.getElementById("bestSingleTimeBox");
const bestSingleTime = document.getElementById("bestSingleTime");
const bestAverageTimeBox = document.getElementById("bestAverageTimeBox");
const bestAverageTime = document.getElementById("bestAverageTime");

console.log('v1')

let counting = false;
let initialHold = false;
let timeStop
let timeStart
boxAmount = 5
let times = []
let sumOfAvridge
let isMobile

var keys = {
    a: false,
    s: false,
    d: false,
    j: false,
    k: false,
    l: false
};

//check if the phone is flipped and relodes the sight if so 
window.addEventListener("orientationchange", function() {
    window.location.reload();
}, false);

//grabs the best times from local storage
let bestTimes = JSON.parse(localStorage.getItem('bestTimes'))
console.log(bestTimes)
if (bestTimes == null){
    bestSingleTime.textContent = ''
    bestAverageTime.textContent = ''
}
else{
    bestSingleTime.textContent = bestTimes.single + 's'
    bestAverageTime.textContent = bestTimes.average + 's'
}

// checks if user is on mobile or not
if (mobileCheck()){
    //if mobile
    isMobile = true;

    //checks so the orgentation is vertical if not asks you to flip your phone 
    if (window.innerWidth < window.innerHeight){
        hide();
        info.innerHTML = 'flip your phone'
    }
    else{
        window.addEventListener('touchstart', onKeyDown);
        window.addEventListener('touchend', onKeyUp)

        info.textContent = 'plase 6 fingers on the screen to start'
    }
}
else{
    //if on pc
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    info.textContent = 'hold \'A\' \'S\' \'D\' \'J\' \'K\' \'L\' to start'
}


function onKeyDown(event){
    // save status of the button 'pressed' == 'true'
    // A key
    if (event.keyCode == 65) {
        keys.a = true;
    // S key
    } else if (event.keyCode == 83) {
        keys["s"] = true;
    // D key
    }else if (event.keyCode == 68){
        keys["d"] = true;
    // J key
    }else if (event.keyCode == 74){
        keys["j"] = true;
    // K key
    }else if (event.keyCode == 75){
        keys["k"] = true;
    // L key
    }else if (event.keyCode == 76){
        keys.l = true;
    }

    //if "counting" == false displays a message to get the user to relice to start the timer 
    if (!counting){
        if ((isMobile && checkIfFingersAreOnScreen(event)) || checkIfKeysAreDown()){
            initialHold = true
            hide()
            info.textContent = 'relice to start'
        }
    }
    //if "counting" == true it stops the timer
    else if(counting){
        timeStop = new Date()
        //if user is on pc the counting = false erlyer
        if (!isMobile){counting = false}
        console.log('stop');
        
        //checks if the user has played 5 times
        if (times.length >= boxAmount){
            bestTimes = {
                single: bestTimes.single,
                average: currentAverageTime.textContent
            }
            localStorage.setItem('bestTimes', JSON.stringify(bestTimes))
            
            console.log('too many')
            times.length = 0;
        }
        
        setToRcentFive(timeCalculate());
        
        show()
        //display informatin on how to strat the timer again 
        if (isMobile){
            //user is on mobile 
            info.textContent = 'plase 6 fingers on the screen to start'
        }
        else{
            //user is on pc
            info.textContent = 'hold \'A\' \'S\' \'D\' \'J\' \'K\' \'L\' to start'
        }
    }
}

function onKeyUp(event){
    //checks the state of "counting"
    if (!counting && ((isMobile && initialHold) || checkIfKeysAreDown()) ){
        //gets the starting time
        timeStart = new Date()
        counting = true
        initialHold = false
        console.log('start');
        info.innerHTML = 'solve <br> press any key to stop' 
    }
    else if(counting){
        //if user is on modlile counting = false later then on pc 
        if(isMobile){counting = false}
    }

    // reset status of the button 'released' == 'false'
    // A key
    if (event.keyCode == 65) {
        keys.a = false;
    //S key
    } else if (event.keyCode == 83) {
        keys["s"] = false;
    // D key
    }else if (event.keyCode == 68){
        keys["d"] = false;
    // J key
    }else if (event.keyCode == 74){
        keys["j"] = false;
    // K key
    }else if (event.keyCode == 75){
        keys["k"] = false;
    //L key
    }else if (event.keyCode == 76){
        keys["l"] = false;
    }
}

//sets the latest playd time in the "fiver recent times box"
function setToRcentFive(time){
    times.push(time)
    sumOfAvridge = 0
    for (let i = 0; i < times.length; i++) {
        sumOfAvridge += parseFloat(times[i]) 
    }
    //calculates the avridge time from the five recent plays
    currentAverageTime.textContent = (sumOfAvridge / times.length).toFixed(3)

    fiveRecentList.innerHTML = ''
    
    //displays the numbers in times array
    for (let i = 0; i < boxAmount; i++) {
        var boxes = document.createElement('div');
        fiveRecentList.appendChild(boxes);
        boxes.classList.add('recentBoxs');
        boxes.textContent = times[i]
    }
    //gets best times from local storidge
    bestTimes = JSON.parse(localStorage.getItem('bestTimes'))
    bestSingleTime.textContent = bestTimes.single + 's'
    bestAverageTime.textContent = bestTimes.average + 's'
}

//checks so more then 6 fingers is placed on the screen at once 
function checkIfFingersAreOnScreen(event){
    if(event.touches.length > 5){
        console.log('more the 6 fingers')
        return(true)
    }
    return(false)
}

// chesk so 'a s d j k l' is pressed simultaneously 
function checkIfKeysAreDown(){
    if (keys.a && keys.s && keys.d && keys.j && keys.k && keys.l ) {
        return(true)
    }
    return(false)
}


//calculate time function
function timeCalculate(){
    finalTime = (timeStop.getTime() - timeStart.getTime()) / 1000
    checkBestTime(finalTime);
    console.log('time ' + finalTime)
    return(finalTime)
}

//checks if the recent time was better then the previus best time s
function checkBestTime(){
    if (bestTimes == null || finalTime < bestTimes.single){
        bestTimes = {
            single: finalTime,
            average: bestTimes ? bestTimes.average : ''
        }
        localStorage.setItem('bestTimes', JSON.stringify(bestTimes))
    }
}

function mobileCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

//show and hide functions
function hide(){
    fiveRecentBox.style.display = 'none'
    startBox.style.display = 'none'
    info.style.fontSize = '3rem'
}
function show(){
    fiveRecentBox.style.display = null
    startBox.style.display = null
    info.style.fontSize = '2rem'
}  