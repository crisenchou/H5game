/*
* analyze
* tank 坦克
* bullet  子弹
* barrier  障碍
* Player 玩家
* Game 游戏 地图与设置
* Draw 图形类接口
* AI 电脑AI
*/


//引擎
/*var Engine = {
    //图片渲染
    render : function(img, x, y, size){
        
    }
    
    //动画效果
    cartoon : function(img, start, end){
        
    }
    
    //碰撞检测
    checkCrash : function(x, y){
        //return int
    }
    
    //资源管理
    resManager : function(){
        
    }
    
    //地图模型
    gameObject : function(){
        
    }
}*/

var Engine = {
    bulletQueue : [],
    heartId : 0,
    start : function(){
        this.heartId = setInterval(this.heartbeat,1000);
    },
    
    heartbeat : function(){
        AI.move();
        if(Engine.bulletQueue.length > 0){
            for(var i in Engine.bulletQueue){
                Engine.bulletQueue[i].move();
            }
        }
    },
    
    //动画效果
    move : function(object, derec, frequency){
        //移动规则
        if(0<=derec && 3>=derec){
            Draw.fillRect(object.x, object.y, object.size, object.size, Game.background);
            var rule = [{"x":-1,"y":0},{"x":0,"y":-1},{"x":1,"y":0},{"x":0,"y":1}];
            if(!checkCrash(object.x+rule[derec].x, object.y+rule[derec].y)){
                object.x += rule[derec].x;
                object.y += rule[derec].y;
            }
            Draw.drawImage(object.img, object.x, object.y, object.size, object.size)
        }
    },
    
    
    
    
    
    checkCrash : function(x, y){
        var offset = Game.position2Offset(x, y);
        var access = Game.mapData[offset.i][offset.j];
        if(access == 1){
            return true;
        }else{
            return false;
        }
        
    }
}



//坐标
var Position = function(x,y){
    this.x = x || 0; //横坐标
    this.y = y || 0; //纵坐标
}


//图像
var Img = function(src){
    this.src = src;
    var img  = new Image();
    img.src = this.src;
    return img;
}


//坦克
var Tank = function(type, hp, derec, position, imgSource){
    // this.x = x;
    // this.y = y;
    this.type = type || 1;//类型
    this.hp = hp || 20;//血量
    this.ammo = 1;//弹药数量
    this.isgod = 0;//是否无敌
    this.speed = 1;//移动速度
    this.derec =  derec || 3;//方向
    this.position = position;//依赖倒置 属性注入
    this.size = 50;//坦克尺寸
    this.img = imgSource;
    this.shoot = function(){
        //发射子弹  坦克坐标赋值给子弹 子弹移动
        if(this.ammo>0){
            //初始化子弹 以及子弹运动方向 子弹移动 
            console.log("tank derec is "+this.derec);
            var bullet = new Bullet(this.position,this.derec, 10);
            //setInterval(function(){bullet.move()},100);
            //this.ammo--;
            //bullet.move();
            //this.ammo--;
        }
	}

    this.destroyed = function(){
        //阵亡
        this.hp = 0;
    }
    
    this.move = function(derec){
        this.clear();
        switch(derec){
            case 0 : //左
                this.position.x > 0 && (this.position.x -= this.speed);
                break;
            case 1 : //上
                this.position.y > 0 && (this.position.y -= this.speed);
                break;
            case 2 : //右
                this.position.x < (Game.width-this.size) &&  (this.position.x += this.speed);
                break;
            case 3 : //下
                this.position.y < (Game.height-this.size) && (this.position.y += this.speed);
                break;
            default : 
                break;
        }

        this.derec = derec;//改变当前坦克方向
        this.draw(derec);
        //Draw.drawImage(this.img, this.position.x, this.position.y, this.size, this.size)
        //console.log("tank is moveing");
    }
    
    //画坦克
    this.draw = function(derec){
        //var derec = derec || 1;
        Draw.drawImage(this.img[derec], this.position.x, this.position.y, this.size-2, this.size-2)
    }
    
    //清除坦克
    this.clear = function(){
        Draw.clearRect(this.position.x, this.position.y, this.size, this.size);
        Draw.fillRect(this.position.x, this.position.y, this.size, this.size, Game.background);
    }
}


//子弹
var Bullet = function(speed, position, derec, damage){
    //this.derec = derec || 1;
    this.speed = speed || 50;
    this.position = position;
    this.damage = damage || 10;
    this.derec = derec;
    this.size = 5;
    this.move = function(){
        console.log("bullet derec is "+this.derec);
        this.clear();
        switch(this.derec){
            case 0 : //左
                this.position.x > 0 && (this.position.x -= this.speed);
                break;
            case 1 : //上
                this.position.y > 0 && (this.position.y -= this.speed);
                break;
            case 2 : //右
                this.position.x < (Game.width-this.size) &&  (this.position.x += this.speed);
                break;
            case 3 : //下
                this.position.y < (Game.height-this.size) && (this.position.y += this.speed);
                break;
            default : 
                break;
        }
        this.draw();
    };
    
    //画子弹
    this.draw = function(){
        
        console.log("draw bullet");
        Draw.fillRect(this.position.x, this.position.y, this.size, this.size, "white")
    }
    
    //清除子弹
    this.clear = function(){
        Draw.clearRect(this.position.x, this.position.y, this.size, this.size);
        Draw.fillRect(this.position.x, this.position.y, this.size, this.size, Game.background);
    }
}


//障碍
var Barrier = function(type,isAccess){
    this.type = type;
    this.isAccess = isAccess;
}


var Badge = {
    x  : 250,
    y  : 500,
    size : 50,
    imageSrc : "img/home.jpg",
    init : function(){
        //var image = new Image();
        //image.src = this.imageSrc;
        var image = new Img(this.imageSrc);
        Draw.drawImage(image, this.x, this.y, this.size, this.size);
    }
}


//玩家1
var Player = function(tank){
    this.tank = tank;
    this.score = 0;
    this.move = function(derec){
        //console.log(derec);
        this.tank.move(derec);
    };
    
    this.controle = function(keycode){
        if(keycode<=40 && keycode>=37){
            
            this.move(keycode-37);
        }else if(keycode == 0){
            this.tank.destroyed();
            //this.shoot();
        }else{
            console.log("assert false");
        }
    };
    
    this.shoot = function(){
        this.tank.shoot();
    }
}

//电脑AI
var AI = {
    tankArr : [],
    nowAmount : 0,
    totalAmount : 20,
    defaultPosition : [0,250,500],
    init : function(){
        //初始化AI
        while(this.nowAmount < 4){
            this.create();
        }
    },
    
    create : function(){
        var random = Helpers.random(0,2);
        var px = this.defaultPosition[random];
        
        var AiImgSource = new Array(4);
        for(var i=0;i<=3;i++){
            AiImgSource[i] = new Img("img/"+i+"-player1.png");
        }

        var tank = new Tank(1,10,2,new Position(px,0),AiImgSource);
        tank.draw(3);
        this.tankArr.push(tank);
        this.nowAmount++;
        this.totalAmount--;
    },
    
    move : function(){

        if(AI.tankArr.length > 0){
            for(var i in AI.tankArr){
                if(AI.tankArr[i].hp > 0){
                    var random = Helpers.random(0,3);
                    var derec = AI.fixDerec(AI.tankArr[i], random)
                    AI.tankArr[i].move(derec);
                }
            }
        }
        
        // if(AI.tankArr.length > 0){
            // var AIProcess = setInterval(function(){
                // for(var i in AI.tankArr){
                    // var random = Helpers.random(0,3);
                    // //增加智能  目的地坐标为 500,250
                    // var derec = AI.fixDerec(AI.tankArr[i], random)
                    // AI.tankArr[i].move(derec);
                // }
            // },1000);
        // }
    },
    
    
    needFix : function(tank,derec){
        //ai在老家的左边  方向朝左 || ai在大本营的的右边  方向朝右 || ai在老家的上方  方向朝上
        if( tank.position.x < Badge.x && derec==0
            || tank.position.x > Badge.x && derec==2
            || tank.position.y < Badge.y && derec==1
        ){
            return true;
        }
        return false;
    },
    
    fixDerec : function(tank,derec){
        if(AI.needFix(tank,derec)){
            var random = Helpers.randomBin(1);
            if(random){
                return derec;
            }else{
                return 3;
            }
        }else{
            return derec;
        }
    },
}


//游戏选项
var Game = {
    status : 1,
    //brush : null,
    height : 550,
    width : 550,
    background : "black",
    size : 25,
    mapData : null,//地图数据
    barriers : [],
    //游戏初始化
    init : function(canvas){
        Draw.init(canvas);
        //Game.brush = draw;
        Draw.fillRect(0,0,this.height,this.width,this.background);//初始化游戏边界
        Badge.init();//初始化大本营
        
        Game.barriers = new Array(5);
        //初始化障碍资源
        for(var i=0;i<=4;i++){
            Game.barriers[i] = new Img("img/"+(i+1)+"-barrier.jpg");
        }
        
        
        
        var horizon = Game.width/Game.size;
        var vertical = Game.height/Game.size
        Game.mapData = new Array(horizon);
        for(var i=0;i<horizon;i++){
            Game.mapData[i] = new Array(vertical);
            for(var j=0;j<vertical;j++){
                var barrier = Helpers.random(0,4);
                Game.mapData[i][j] = barrier;
                var position = Game.ossfet2Position(i,j);
                var imgsource = Game.barriers[barrier]
                
                console.log(imgsource);
                Draw.drawImage(imgsource, position.x, position.y, Game.size, Game.size);
            }
        }
        
        
        
        Engine.start();//启动引擎
    },
    
    //游戏开始
    start : function(){
        //Map.init();//初始化地图
        
        //初始化玩家
        //var image = new Image();
        //image.src = "img/1-player1.png";
        var playerImgSource = new Array(4);
        for(var i=0;i<=3;i++){
            playerImgSource[i] = new Img("img/"+i+"-player1.png");
        }
        var type =1;
        var hp = 10;
        var derec = 1;
        var position =  new Position(150,Game.height-2*Game.size);
        player1 = new Player(
            new Tank(type,hp,derec,position,playerImgSource)
        );
        player1.tank.draw(derec);
        //初始化AI
        AI.init();
        //AI.move();
    },
    
    controle : function(keycode){
        player1.controle(keycode);
    },
    
    //地图坐标与地图数组之间的相互转换
    position2Offset : function(x, y){
        return {"i":x/25,"i":y/25};
    },
    
    ossfet2Position : function(i, j){
        return {"x":25*i,"y":25*j};
    }
}


//画布
var Draw ={
    ctx : null,
    init : function(canvas){
        var c = document.getElementById(canvas);
        this.ctx = c.getContext("2d");
    },
    
    //画矩形 无填充
    drawRect : function(x, y, length, width, color){
        this.ctx.fillStyle = color;
        this.ctx.strokeRect(x,y,length,width);
    },
    
    //绘制填充的矩形
    fillRect :  function(x, y, height, width, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x,y,height,width);
    },
    //清除指定像素
    clearRect :  function(x, y, height, width){
        this.ctx.clearRect(x, y, height, width);
    },
    
    //画图像
    drawImage :  function(img, x, y, height, width){
        this.ctx.drawImage(img, x, y, height, width);
    },
    
    //返回图像的数据
    getImageData :  function(x, y, height, width){
        return this.ctx.getImageData(x, y, height, width);
    },
    
    //将图像的数据填充到某一个坐标
    putImageData :  function(img, x, y){
        this.ctx.putImageData(img, x, y);
    },
        
    //动画效果 
    drawdynamicImag :  function(img, x, y, height, width, speed){
        // setTimeout(function(){
            // Draw.drawdynamicImag(img, x, y, length, size,speed);
        // },speed);
    },
}




//辅助类
/*
* js的伪随机非常的不稳定
*/
var Helpers = {
    getBit: function(num){
        var bit = 0;
        while(num>0){
            num = num>>1;
            bit++;
        }
        return bit;
    },

    randomBin : function(times){
        var num = Math.round(Math.random());
        while(times>1){
            num = (num<<1) + Math.round(Math.random());
            times--;
        }
        return num;
    },

    random : function(min,max){
        var num = max-min;
        var times = this.getBit(num);
        do{
            var binNum = this.randomBin(times);
        }while(!(binNum<=num));
        return binNum+min;
    }
}


// var zero = one = two = three = 0;
// for(var i=0; i<=10000; i++){
    // var n = Helpers.random(0,3);
    // if(n == 0){
        // zero++;
    // }else if(n == 1){
        // one++;
    // }else if(n == 2){
        // two++;
    // }else if(n == 3){
        // three++;
    // }
// }
// console.log(zero,one,two,three);