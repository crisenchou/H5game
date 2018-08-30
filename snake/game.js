//蛇
var snake = {
    snake : [],
    tail : {x:0,y:0},
    length : 5,
    color : "white",
    nowDerec : 2,
    derec : [{x:-10,y:0},{x:0,y:-10},{x:10,y:0},{x:0,y:10}],//0左 1上 2右 3下
    init : function(){
        snake.snake = [];
        for(var i=0; i<5; i++){
            var position = {x:game.x/2-(i*10),y:game.y/2};
            snake.snake.push(position);
        }
        snake.drawSnake();
    },
    drawSnake : function(){
        for(var i in snake.snake){
            snake.snake[i].x = (snake.snake[i].x+game.x) % game.x;
            snake.snake[i].y = (snake.snake[i].y+game.y) % game.y;
            draw.drawDot(snake.snake[i].x, snake.snake[i].y, snake.color);
        }
    },
    changeDerec : function(derec){
        if(derec>=0 && derec<=3){
            var temp = Math.abs(snake.nowDerec - derec);
            if( temp != 0 && temp != 2){
                snake.nowDerec = derec;
            }
        }
    },
    move : function(){
        food.initFood();
        if(snake.snake[0].x == food.x && snake.snake[0].y == food.y ){
            game.score = game.score+food.score;
            document.getElementById("score").innerHTML = game.score;
            food.status = 0;
        }
        snake.tail.x = snake.snake[snake.length-1].x;
        snake.tail.y = snake.snake[snake.length-1].y;
        for(var i=snake.length-1; i>0; i--){
            snake.snake[i].x = snake.snake[i-1].x;
            snake.snake[i].y = snake.snake[i-1].y;
        }
        snake.snake[0].x = snake.snake[0].x + snake.derec[snake.nowDerec].x;
        snake.snake[0].y = snake.snake[0].y + snake.derec[snake.nowDerec].y;
        
        snake.checkDead();
        if(food.status == 0){
            snake.snake.push({"x":food.x,"y":food.y});
            snake.length++;
        }
        snake.drawSnake();
        draw.drawDot(snake.tail.x, snake.tail.y, game.background);
        
    },
    eat : function(){
        //need compolete
    },
    checkDead : function(){
        for(var i in snake.snake){
            if(i!=0){
                if(snake.snake[0].x == snake.snake[i].x && snake.snake[0].y == snake.snake[i].y ){
                    game.end();
                    break;
                }
            }
            
        }
        if(snake.snake[0].x<0 || snake.snake[0].x>1000){
            game.end();
        }
    }
}
//食物
var food = {
    x : 0,
    y : 0,
    score : 10,
    color : "white",
    status : 0,
    init : function(){
        food.status = 0;
        food.initFood();
    },
    initFood : function(){
        if(food.status == 0){
            food.initPosition();
            draw.drawDot(food.x,food.y,food.color);
            food.status = 1;
        }
    },
    initPosition : function(){
        food.x = food.random(0,game.x/10)*10;
        food.y = food.random(0,game.y/10)*10;
        if(!food.checkFoodPosition()){
            return food.initPosition();
        }
    },
    checkFoodPosition : function(){
        return true;
    },
    random : function(begin,end){
        return Math.floor(Math.random()*(end-begin))+begin;
    }
}
//游戏选项
var game = {
    x : 800,
    y : 600,
    endstatus : 0,
    status : 0,
    speed : 100,
    background : "black",
    score : 0,
    canvas : "",
    init : function(canvas){
        //待完善
        game.canvas = canvas
        draw.init(game.canvas);//初始化画布
        food.init();
        snake.init(); 
    },
    restart : function(){
        draw.init(game.canvas);
        food.init();
        snake.init();
        game.pause();
    },
    start : function(){
        if(game.endstatus){
            game.endstatus = 0;
            game.restart();
        }
        if(game.status){
            clearInterval(game.status);
        }
        game.status = setInterval("snake.move()",game.speed);
    },
    pause : function(){
        clearInterval(game.status);
    },
    end : function(){
        game.pause();
        game.endstatus = 1;
        alert("Game Over!The score is "+game.score);
        //draw.init(game.canvas);
        //food.init();
        //snake.init();
    },
    
}

var draw = {
    cxt : false,
    init : function(canvas){
        var c = document.getElementById(canvas);
        draw.cxt = c.getContext("2d");//getContext("2d") 是内建的html 5对象 拥有绘制多种图形的方法
        draw.drawDot(0,0,game.background,game.x,game.y);
    },
    drawDot : function(x,y,color,length,size){
        length = length || 10;
        size = size || 10;
        draw.cxt.fillStyle = color;
        draw.cxt.fillRect(x,y,length,size);
    },
}