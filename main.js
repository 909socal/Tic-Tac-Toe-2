
// global variables initialized in resetGame();
var x; // = true;


var ref = new Firebase('https://tikitkai.firebaseio.com/');
var playersRef = ref.child('players');
var winningStates = ['123', '456', '789', '147', '258', '369', '159', '357'];
var newMoveX = ref.child('newMoveX');  
var newMoveO = ref.child('newMoveO');  
var newMove;  
var count = 0;
var cnt = 0;

var g_start; 

$(document).ready(init);

var mainRef = new Firebase('https://tikitkai.firebaseio.com/');
var userRef = mainRef.push();
var connectedRef = new Firebase("https://tikitkai.firebaseio.com//.info/connected");


connectedRef.on("value", function(isOnline) {
    if (isOnline.val()) {
        userRef.onDisconnect().remove();
    }
});


function init(){


    restartGame();
    $('#newGame').on('click',restartGame);
    $('.box').on('click', turnHandler)
    $('#submit').on('click',enterName)
}

function checkRemove(error)
{
    playersRef.once('value',function(snap){
        count = snap.numChildren();
    });

}

function restartGame(event)
{
    x = true;
    g_start = false;
    playersRef.remove(checkRemove);
    playersRef.once('value',function(snap){   
        count = snap.numChildren();
    });

    newMoveX.set('');  
    newMoveO.set('');
    newMove = newMoveX; 
    clearBoard();

}

function enterName(){
    console.log($('#username').val());
    playersRef.once('value',function(snapshot){
        console.log(snapshot.val());

        if(!snapshot.val()){
            playersRef.push($('#username').val());

            g_token = 'O';
            $('.turn').text("X's turn ... please wait for other player to move.");

            newMoveX.on('value', handleRemoteTurn);
            newMove = newMoveO;  
            g_start = true;
            x = true;

        } else if(Object.keys(snapshot.val()).length===1){
            playersRef.push($('#username').val());

            g_token = 'X';
            x = true;
            $('.turn').text("X's turn ... your move.");
            newMoveO.on("value",handleRemoteTurn);
            newMove = newMoveX; 

            g_start = true;
        }else{
            return;
        }
    });

}

function clearBoard()
{
    var box;
    for (var boxnum = 1; boxnum < 10; ++boxnum)
    {
        box = $('#square'+boxnum);
        box.text('')

    }
    g_start = false;
    $('.turn').text("");

}


function turnHandler(event){

    // game not started
    if (!g_start)
        return;

    // did player click when not its turn
    if ((g_token === 'X' && !x) ||(g_token === 'O' && x))
       return;

    var boxNumber = (event.target.id.slice(-1));
    newMove.set(boxNumber);
    if (x===true){
        if($(this).text() !== 'O' && $(this).text() === ''){
            $(this).text('X');
            if (g_token === 'X')
                $('.turn').text("O's turn ... wait for other player to move.");
            x = false;
        }
        
    }

    else{
        if($(this).text()!=='X' && $(this).text() === ''){
            $(this).text('O')

            if (g_token === 'O')
                $('.turn').text("X's turn ... wait for other player to move.");
            x = true;
        }
        
    }
    winner();
}

function winner(){
    cnt++;
    if      ($('#square1').text() === $('#square2').text() && $('#square2').text() !== '' && $('#square2').text() === $('#square3').text()) {alert($('#square1').text() + " Are A Winner !!! ")}
    else if ($('#square1').text() === $('#square4').text() && $('#square4').text() !== '' && $('#square4').text() === $('#square7').text()) {alert($('#square4').text() + " Are A Winner !!! ")}
    else if ($('#square1').text() === $('#square5').text() && $('#square5').text() !== '' && $('#square5').text() === $('#square9').text()) {alert($('#square5').text() + " Are A Winner !!! ")}
    else if ($('#square4').text() === $('#square5').text() && $('#square5').text() !== '' && $('#square5').text() === $('#square6').text()) {alert($('#square5').text() + " Are A Winner !!! ")}
    else if ($('#square7').text() === $('#square8').text() && $('#square8').text() !== '' && $('#square8').text() === $('#square9').text()) {alert($('#square9').text() + " Are A Winner !!! ")}
    else if ($('#square2').text() === $('#square5').text() && $('#square5').text() !== '' && $('#square5').text() === $('#square8').text()) {alert($('#square8').text() + " Are A Winner !!! ")}
    else if ($('#square3').text() === $('#square6').text() && $('#square6').text() !== '' && $('#square6').text() === $('#square9').text()) {alert($('#square8').text() + " Are A Winner !!! ")}
    else if ($('#square3').text() === $('#square5').text() && $('#square5').text() !== '' && $('#square5').text() === $('#square7').text()) {alert($('#square7').text() + " Are A Winner !!! ")}
    else if (cnt >=9){alert(" Game Is A Tie!!!")}
}


function handleRemoteTurn(snapshot)
{

    var boxNumber = snapshot.val();
    if (!g_start || boxNumber == null || boxNumber === '' )
    {

        return;
    }

    var box = $('#square'+boxNumber);
    if (x===true){
        if(box.text() !== 'O' && box.text() === ''){
            box.text('X');
            if (g_token === 'O') {
                $('.turn').text("O's turn ... your move.");

            }
            else {
                $('.turn').text("X's turn ... your move.");
                //alert("Sync bug line 140");
            }
            x = false;
        }
    }

    else{
        if(box.text()!=='X' && box.text() === ''){
            box.text('O')

            if (g_token === 'O') {
                $('.turn').text("O's turn ... your move.");

                //alert("Sync bug line 153");
            }
            else {
                $('.turn').text("X's turn ... your move.");
            }
            x = true;
        }
    }
    winner();
}