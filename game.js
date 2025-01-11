let width = 480;
let height = 640;

let pjs = new PointJS(width, height, {backgroundColor: '#696969'});

let game = pjs.game;
let p = pjs.vector.point;
let math = pjs.math;

let mouse = pjs.mouseControl;
let touch = pjs.touchControl;
mouse.initControl();
touch.initControl();

let speed = 5;
let rivalCarSpeed = 7;
let wRoadL = width / 5;
let wRoadR = width / 1.5;
let countTimer = 0;
let time = 3;
let startTime = setInterval(() => time--, 1000);
let score = setInterval(() => score++, 5000);

let bloksLeft = [];
let bloksRight = [];
let blockCenter = [];
let rCar = [];
let timer = pjs.OOP.newTimer(1500, function() {carSpawner();});
let sw = 10, sh = 100;

function roadDraw() {  
    for (let i in bloksLeft) {
        bloksLeft[i].draw();
        bloksRight[i].draw();
    }
    for (let a in blockCenter) {
        blockCenter[a].draw();
    }
}

function roadMove() {
    for (let i in blockCenter) {
        blockCenter[i].move(p(0, speed));
        if(blockCenter[i].y > height) {
            blockCenter[i].setPosition(p(width / 2, 0 - blockCenter[i].h));
        }
        }
    for (let i in bloksLeft) {
        bloksLeft[i].move(p(0, speed));
        if(bloksLeft[i].y > height) {
            bloksLeft[i].setPosition(p(sw, 0 - bloksLeft[i].h));
        }
        bloksRight[i].move(p(0, speed));
        if(bloksRight[i].y > height) {
            bloksRight[i].setPosition(p(width - sw * 2, 0 - bloksRight[i].h));
        }
    } 
}

function carMove() {
    if (mouse.isDown('LEFT') || touch.isDown()) {
        let pos = mouse.getPosition();
        if (pos.x > width / 2) {
            car.setPosition(p(width / 1.5, car.y), speed, 0);
        }
        else {
            car.setPosition(p(width / 5, car.y), speed, 0);
    }
    }
}

function carSpawner() {
    countTimer = math.random(1, 4);
    if (countTimer % 2 == 0) {
        rCar.push(game.newRectObject({ 
        x : wRoadL, 
        y : 0 - 100, 
        w : 70, 
        h : 100, 
        fillColor : "#FF0000",
        strokeWidth: 1,
        strokeColor: 'black' 
    }))}
    else {
        rCar.push(game.newRectObject({ 
            x : wRoadR, 
            y : 0 - 100, 
            w : 70, 
            h : 100, 
            fillColor : "#FF0000",
            strokeWidth: 1,
            strokeColor: 'black' 
        }))
    }
    
  }

function rivalCar() {
    for (let i in rCar) {
        rCar[i].drawStaticBox();
        rCar[i].draw();
        
    }        
}

function rivalCarMove() {
    for (let i in rCar) {
        rCar[i].move(p(0, rivalCarSpeed));
        if(car.isStaticIntersect(rCar[i].getStaticBox())) {
            pjs.OOP.delObject(rCar, rCar[i]);
            score = 0;
            time = 3;
            game.setLoop('startGame');
        }
    }
}

for (let x = 0; x < 7; x++) {
    bloksLeft.push(game.newRectObject({
        x : sw, 
        y : 30 + sh * x, 
        w : sw, 
        h : sh - 30, 
        fillColor : "white",
        strokeWidth: 1,
        strokeColor: 'black'}))  
}

for (let x = 0; x < 7; x++) {
    bloksRight.push(game.newRectObject({
        x : width - sw * 2, 
        y : 30 + sh * x, 
        w : sw, 
        h : sh - 30, 
        fillColor : "white",
        strokeWidth: 1,
        strokeColor: 'black'}))  
}

for (let x = 0; x < 4; x++) {
    blockCenter.push(game.newRectObject({
    x : width / 2, 
    y : 50 + 300 * x, 
    w : sw, 
    h : height / 2 - 100, 
    fillColor : "white",
    strokeWidth: 1,
    strokeColor: 'black'}))
}

let car = game.newRectObject({ 
    x : width / 1.5, 
    y : height - 150, 
    w : 70, 
    h : 100, 
    fillColor : "#228B22",
    strokeWidth: 1,
    strokeColor: 'black' 
  });
  car.drawStaticBox();

  let text = game.newTextObject(   { 
    x : width / 10, 
    y : 30, 
    text : "Расстояние: ", 
    size : 30, 
    padding : 10, 
    color : "#000000" 
  });

  let gameName = game.newTextObject(   { 
    x : width / 3.5, 
    y : 50, 
    text : "Fast Run", 
    size : 50, 
    padding : 10, 
    color : "#000000" 
  });
  let warningText = game.newTextObject(   { 
    x : width / 3.5, 
    y : height / 3.5, 
    text : "Приготовься", 
    size : 30, 
    padding : 10, 
    color : "#000000" 
  });

let rever = pjs.OOP.newRever(0, 100000, 1);

function startGameMenu() {
    gameName.draw();
    warningText.draw();
    pjs.brush.drawText({ 
        text : time, 
        x : width / 2.5, 
        y : height / 2, 
        color : "black", 
        size : 100
        });
    if (time === 0) {
        game.setLoop('myGame');
    }
}

  game.newLoop('startGame', function() {
    startGameMenu();
  }) 
  

game.newLoop('myGame', function(){

    roadMove();
    roadDraw();
    timer.restart();
    rivalCarMove();
    rivalCar();
    
    carMove();
    car.drawStaticBox();
    car.draw();
    
    let textScore = game.newTextObject(   { 
        x : width / 1.5, 
        y : 30, 
        text : score + ' км.', 
        size : 30, 
        padding : 10, 
        color : "#000000" 
      });

    text.draw();
    textScore.draw();
});

game.setLoop('startGame');
game.start();