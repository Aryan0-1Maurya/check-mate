/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/
var board,list=[],king,queen,clickList=[],listDup=[],boxes,ready=true,check=false,lvl=1, lost=false,page="RULES";
var piecePos = {
    1: [7,3],
    2: [7,4],
    4: [],
}

var rulePage = {
    "RULES": "This game might look like chess but it's very different from chess. <br>1. You have to checkmate the purple king i.e. the purple king shouldn't be left with any square it can stay. <br>2. You will have a king and a queen to checkmate the enemy (purple king). A king can move one step in any direction, and the queen can move diagonally and in straight line. When you click at them, you will be shown all the valid squares they can go. <br>3. The biggest difference in this game is that, the kings can touch and capture each other, your king and queen protect each other only when they are in contact with each other, if they protect each other then the opponent (purple king) can't harm you at all, it will have to go away where it is not in the vision of your king and queen. <br>4. The movement of the opponent king is randomised. <br>5. You can checkmate the opponent king with your king also lol xD, only if he is protect by your queen. <br>6. Stalemate is a drawn position, where the opponent king has no square it can go but it is not attacked/visioned by any of your pieces. <br><br>The concept of the game is 30% original and 70% copied from chess.com fog of war variant. Let's see if you can complete all the 3 levels. The position of the purple king will be revealed in the beginning of every level (further instructions are provided when you open the levels). Just to inform you, the impossible level is possible, pros might find it easy.",
    1: "The purple king can be seen even when it is out of vision of your king and queen. Don't let it capture any of your valuable pieces! This is just like a simple checkmate endgame.",
    2: "The purple king can be seen just before it moves from its place. So you will be given information 1 move late.",
    3: "This is the real challenge! Watch out for stalemate! The position of the purple king will be revealed only in the beginning and when it is in check (real concept of fog of war). The purple king will never be spawned on the edge of the board. This level also depends on your luck along with your skill.",
}

for (let i = 0; i < 8; i++) {
    list.push([0,0,0,0,0,0,0,0]);
}
for (let i = 1; i < 3; i++) {
    list[piecePos[i][0]][piecePos[i][1]] = i;
}
listDup = list.map((a)=>[...a]);

window.OpenLevel = function(x) {
    lost = false;
    lvl = page = x;
    ShowRules();
    document.getElementById("menu").style.display = "none";
    document.getElementById("decision").style.display = "none";
    document.getElementById("purple-king").style.opacity = "1";
    list = [];
    for (let i = 0; i < 8; i++) {
        list.push([0,0,0,0,0,0,0,0]);
    }
    piecePos = {
        1: [7,3],
        2: [7,4],
        4: [],
    }
    for (let i = 1; i < 3; i++) {
        list[piecePos[i][0]][piecePos[i][1]] = i;
    }
    listDup = list.map((a)=>[...a]);
    DeployEnemy();
}

window.LevelRules = function() {
    page = lvl;
    ShowRules();
}

window.onload = function() {
    board = document.getElementById("board");
    king = document.getElementById("king");
    queen = document.getElementById("queen");
    boxes = document.getElementsByClassName("boxes")
    /*for (let i = 0; i < 9; i++) {
        board.innerHTML += `<div style="height:100%;width:1px;background-color:black;top:0;left:${i*40}px;"></div>
                            <div style="width:100%;height:1px;background-color:black;left:0;top:${i*40}px;"></div>`;
    }*/
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            board.innerHTML += `<div style = "top:${i*40}px;left:${j*40}px;height:40px;width:40px;background:${(i+j)%2==0 ? "lightgreen":"white"};"></div>`;
            board.innerHTML += `<div class = "boxes" style = "top:${i*40}px;left:${j*40}px;" onclick = "BoxClicked(${i},${j})"></div>`;
        }
    }
    setTimeout(function() {
        document.getElementById("loading").style.display = "none";
        ChessPieces();
        AllRules();
    },500)
}

window.AllRules = function() {
    page = "RULES";
    ShowRules();
}

/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/

function DeployEnemy() {
    Vision(7,4,listDup);
    Vision(7,3,listDup);
    let x = Math.floor(Math.random()*8), y = Math.floor(Math.random()*8);
    while (listDup[x][y] != 0) {
        x = Math.floor(Math.random()*8);
        y = Math.floor(Math.random()*8);
    }
    if (lvl == 3) {
        x = Math.floor(Math.random()*6+1);
        y = Math.floor(Math.random()*6+1);
        while (listDup[x][y] != 0) {
            x = Math.floor(Math.random()*6+1);
            y = Math.floor(Math.random()*6+1);
        }
    }
    piecePos[4] = [x,y];
    list[x][y] = 4;
    ChessPieces();
}

function MovePurpleKing() {
    listDup = list.map((a)=>[...a]);
    let movement = [[1,0],[0,1],[-1,0],[0,-1],[-1,-1],[1,1],[1,-1],[-1,1]],possibleMoves=[];
    for (let i = 1; i < 3; i++) {
        Vision(piecePos[i][0],piecePos[i][1],listDup,true);
    }
    for (let a of movement) {
        let x = piecePos[4][0]+a[0],y = piecePos[4][1]+a[1],z = [0,1,2,3,4,5,6,7];
        if (z.includes(x) && z.includes(y) && listDup[x][y] == 0) {
            possibleMoves.push(a);
        }
        if (z.includes(x) && z.includes(y) && [1,2].includes(listDup[x][y])) {
            let protected = false;
            for (let b of movement) {
                if (z.includes(x+b[0]) && z.includes(y+b[0]) && listDup[x+b[0]][y+b[1]] == (listDup[x][y]==1 ? 2 : 1)) {
                    protected = true;
                    break;
                }
            }
            if (!protected) {
                possibleMoves = [a];
                setTimeout(function() {GiveDecision("YOU LOST");}, 500);
                lost = true;
                break;
            }
        }
    }
    if (possibleMoves.length == 0 && check) {
        GiveDecision("CHECKMATE");
    }
    else if (possibleMoves.length == 0) {
        GiveDecision("STALEMATE");
    }
    else {
        let chosen = possibleMoves[Math.floor(Math.random()*possibleMoves.length)];
        list[piecePos[4][0]+chosen[0]][piecePos[4][1]+chosen[1]] = 4;
        list[piecePos[4][0]][piecePos[4][1]] = 0;
        piecePos[4] = [piecePos[4][0]+chosen[0],piecePos[4][1]+chosen[1]];
        ChessPieces();
    }
    check=false;
    if (lvl>=2 && !lost) {
        document.getElementById("purple-king").style.opacity = "0";
    }
}

function ChessPieces() {
    king = document.getElementById("king");
    queen = document.getElementById("queen");
    var purpleKing = document.getElementById("purple-king");
    let valid = document.getElementsByClassName("valid");
    while (valid[0]) {
        valid[0].remove();
    }
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (list[i][j] === 1) {
                piecePos[1] = [i,j];
                king.style.left = j*40+2+"px";
                king.style.top = i*40+2+"px";
            }
            else if (list[i][j] === 2) {
                piecePos[2] = [i,j];
                queen.style.left = j*40+2+"px";
                queen.style.top = i*40+2+"px";
            }
            else if (clickList.length == 1 && list[i][j] === 3) {
                board.innerHTML += `<div class = "valid" style = "top:${i*40}px;left:${j*40}px;"></div>`;
            }
            else if (list[i][j] === 4) {
                purpleKing.style.left = j*40+2+"px";
                purpleKing.style.top = i*40+2+"px";
            }
        }
    }
}

window.BoxClicked = function(i,j) {
    let pieceList = ["","king","queen"];
    if (!ready) {return;}
    if (clickList.length === 1) {
        if (![0,1,2,4].includes(list[i][j])) {
            let el = document.getElementById(pieceList[clickList[0]]);
            for (let a = 0; a < 8; a++) {
                for (let b = 0; b < 8; b++) {
                    if (list[a][b]==3 || list[a][b]==clickList[0]) {
                        list[a][b]=0;
                    }
                }
            }
            list[i][j]=clickList[0];
            el.style.top = i*40+2+"px";
            el.style.left = j*40+2+"px";
            ready = false;
            setTimeout(function() {
                ChessPieces();
                listDup = list.map((a)=>[...a]);
                Vision(piecePos[1][0],piecePos[1][1], listDup, true);
                Vision(piecePos[2][0],piecePos[2][1], listDup, true);
            },300);
            setTimeout(function() {MovePurpleKing();ready=true;},600);
        }
        clickList=[];
        for (let a = 0; a < 8; a++) {
            for (let b = 0; b < 8; b++) {
                if (list[a][b]==3) {
                    list[a][b]=0;
                }
            }
        }
        ChessPieces();
    }
    else {
        if ([1,2].includes(list[i][j])) {
            clickList.push(list[i][j]);
            Vision(i,j);
            ChessPieces();
        }
    }
}

function Vision(i,j,l=list,checking=false) {
    let movement = [[1,0],[0,1],[-1,0],[0,-1],[-1,-1],[1,1],[1,-1],[-1,1]];
    if (l[i][j]==1) {
        for (let a of movement) {
            try {
                if (l[i+a[0]][j+a[1]]==0) {
                    l[i+a[0]][j+a[1]]=3;
                }
                else if (l[i+a[0]][j+a[1]]==4) {
                    check = true;
                    document.getElementById("purple-king").style.opacity = "1";
                }
            } catch (e) {}
        }
    }
    if (l[i][j]==2) {
        for (let a of movement) {
            for (let k = 1; k < 8; k++) {
                if (i+a[0]*k < 8 && j+a[1]*k < 8 && i+a[0]*k > -1 && j+a[1]*k > -1 && [0,3].includes(l[i+a[0]*k][j+a[1]*k])) {
                    l[i+a[0]*k][j+a[1]*k]=3;
                    if (lvl == 2 && checking) {
                        document.getElementById("purple-king").style.opacity = "1";
                    }
                }
                else {
                    if (checking && i+a[0]*k < 8 && j+a[1]*k < 8 && i+a[0]*k > -1 && j+a[1]*k > -1 && l[i+a[0]*k][j+a[1]*k]==4) {
                        check=true;
                        document.getElementById("purple-king").style.opacity = "1";
                    }
                    else {
                        break;
                    }
                }
            }
        }
    }
}

window.ShowRules = function() {
    document.getElementById("rules-page").style.display = "block";
    document.getElementById("rules-text").innerHTML = rulePage[page];
    document.getElementById("rules-heading").innerHTML = page;
    if (typeof page == "number") {
        document.getElementById("rules-heading").innerHTML = "LEVEL "+page;
    }
    setTimeout(function() {
        document.getElementById("rules-page").style.opacity = "1";
    },50);
}

window.HideRules = function() {
    setTimeout(function() {
        document.getElementById("rules-page").style.display = "none";
    },500);
    document.getElementById("rules-page").style.opacity = "0";
}

window.ShowMenu = function() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("decision").style.display = "none";
    document.getElementById("decision").style.opacity = "0";
    document.getElementById("board").style.display = "block";
}

function GiveDecision(x) {
    let el = document.getElementById("decision");
    el.style.display = "block";
    document.getElementById("board").style.display = "none";
    el.innerHTML = x;
    setTimeout(function() {el.style.opacity = "1";},100);
}


/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/