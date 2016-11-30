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

var Engine = {
    pid : 0,
    tankQueue : [],
    bulletQueue : [],
    //process : [],//分配进程
    start : function(){
        this.loadMap();//加载地图
        this.renderMap();//渲染地图
        this.pid = setInterval(function(){
            Engine.work()
        },100);
    },
    
    pause : function(){
        clearInterval(this.pid);
    },
    
    work : function(){
        if(Engine.tankQueue.length > 0){
            for(var i in Engine.tankQueue){
                //console.log(Engine.tankQueue);
                if(Engine.tankQueue[i].automove){
                    Engine.tankQueue[i].moving =true;
                    var derec = Helpers.random(0,3);
                    
                    if(AI.needFix(Engine.tankQueue[i], derec)){
                        Engine.tankQueue[i].derec = AI.fixDerec(Engine.tankQueue[i], derec)
                    }else{
                        Engine.tankQueue[i].derec = derec;
                    }
                    
                    Engine.tankQueue[i].distance = Helpers.random(1,5)*50;
                    //Engine.cartoon(Engine.tankQueue[i]);
                }
                
                if(Engine.tankQueue[i].moving == true){
                    Engine.cartoon(Engine.tankQueue[i]);
                }
                //console.log(Engine.tankQueue);
            }
        }
        
        
        while(Engine.bulletQueue.length > 0){
            var bullet = Engine.bulletQueue.shift();//弹药的特殊性 运行一遍之后消失  采用队列 调用渲染
            Engine.cartoon(bullet);
        }
        
    },
    
    //动画效果
    cartoon : function(object){
        var derec = object.derec;
        if(0<=derec && 3>=derec){
            Draw.clearRect(object.x, object.y, object.size, object.size);
            var rule = [{"x":-1,"y":0},{"x":0,"y":-1},{"x":1,"y":0},{"x":0,"y":1}];
            var nextX = object.x+rule[derec].x;
            var nextY = object.y+rule[derec].y;
            
            if(!Engine.checkCrash(nextX,nextY) && !Engine.checkEdge(nextX,nextY)){
                object.x += rule[derec].x;
                object.y += rule[derec].y;
                object.distance--;
            }

            if(object.distance<=0){
                object.moving = false;
            }
            Engine.render(object);
        }
    },
    

    //图片渲染
    render : function(object){
        //var img = this.resource.imgResource[object.imgResourceId];
        var img = object.img[object.derec];
        Draw.drawImage(img, object.x, object.y, object.size, object.size)
    },
    
    
    //加载地图资源
    loadMap : function(horizon, vertical){
        Map.resource = new Array(horizon);
        for(var i=0;i<horizon;i++){
            Map.resource[i] = new Array(vertical);
            for(var j=0;j<vertical;j++){
                var barrier = Helpers.random(0,4);
                Map.resource[i][j] = barrier;
            }
        }
    },
    
    //渲染地图
    renderMap : function(map){
        for(var i in map){
            for(var j in map[i]){
                var position =  Game.ossfet2Position(i,j);
                Engine.render(map[i][j], position.x, position.y, Game.size);//渲染单位像素
            }
        }
    },
    
    //碰撞检测
    checkCrash : function(x, y){
        
        if(x<0 || y<0){
            return false;
        }
        
        var offset = Game.position2Offset(x, y);
        var access = Game.mapData[offset.i][offset.j];
        
        if(access == 1){
            return true;
        }else{
            return false;
        }
    },
    
    //检测边界
    checkEdge : function(x, y){
        if(x<0 || x>Game.length){
            return false;
        }
        if(y<0 || y>Game.width){
            return false;
        }
        return true;
    }
}


//资源管理
var resManager = function(){
    var dataResource = new Array();
    var imgResource = new Array();
}


var Map = function(){
    resource : [];
}


//图像
var Img = function(src){
    this.src = src;
    var img  = new Image();
    img.src = this.src;
    return img;
}

//坦克
var Tank = function(type, hp, derec, x, y, imgSource){
    // this.x = x;
    // this.y = y;
    this.type = type || 1;//类型
    this.hp = hp || 20;//血量
    this.ammo = 1;//弹药数量
    this.isgod = 0;//是否无敌
    this.speed = 1;//移动速度
    this.derec =  derec || 3;//方向
    this.x = x;
    this.y = y;
    this.size = 25;//坦克尺寸
    this.img = imgSource;
    this.moving = true;
    this.automove = false;
    this.distance = 0;
    this.shoot = function(){
        //发射子弹  坦克坐标赋值给子弹 子弹移动
        if(this.ammo > 0){
            //初始化子弹 以及子弹运动方向 子弹移动 
            var bullet = new Bullet(this.x,this.y,this.derec);
            Engine.bulletQueue.push(bullet);
            //console.log(this.derec)
        }
	}

    this.destroyed = function(){
        //阵亡
        this.hp = 0;
    }
    
    this.move = function(derec, distance){
        //指定方向 指定移动距离  剩下的全部交给引擎来实现
        if(!this.moving && this.derec == derec){
            this.derec = derec;
            this.moving = true;
            this.distance = distance || 5;
            Engine.cartoon(this);
        }else{
            this.derec = derec;
            Engine.cartoon(this);
        }
    }
}


//子弹
var Bullet = function(x, y, derec, damage, speed){
    var imgSource = new Array(4);
    for(var i=0;i<=3;i++){
        imgSource[i] = new Img("img/"+i+"-bullet.jpg");
    }
    this.img = imgSource;
    this.x = x;
    this.y = y;
    this.speed = speed || 50;
    this.damage = damage || 10;
    this.derec = derec;
    this.distance = 500;
    this.moving = false;
    this.size = 5;
    this.move = function(){
        Engine.cartoon(this);
    };
    
}


//障碍
var Barrier = function(type,isAccess){
    this.type = type;
    this.isAccess = isAccess;
}


//玩家1
var Player = function(tank){
    this.tank = tank;
    this.score = 0;
    this.move = function(derec){
        this.tank.move(derec, 25);
    };
    
    this.controle = function(keycode){
        if(keycode<=40 && keycode>=37){
            this.move(keycode-37);
        }else if(keycode == 0){
            //console.log(this);
            //this.tank.destroyed();
            this.shoot();
        }else{
            console.log("assert false");
        }
    };
    
    this.shoot = function(){
        console.log("shoot");
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

        var tank = new Tank(1, 10, 2, px, 0, AiImgSource);
        Engine.render(tank);
        tank.automove = true;
        this.tankArr.push(tank);
        
        Engine.tankQueue.push(tank);
        
        this.nowAmount++;
        this.totalAmount--;
    },
    
    
    needFix : function(tank,derec){
        
        
        var Badgex = 250;
        var Badgey = 550;
        //ai在老家的左边  方向朝左 || ai在大本营的的右边  方向朝右 || ai在老家的上方  方向朝上
        if( tank.x < Badgex && derec==0
            || tank.x > Badgex && derec==2
            || tank.y < Badgey && derec==1
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
                //console.log(imgsource);
                Draw.drawImage(imgsource, position.x, position.y, Game.size, Game.size);
            }
        }
        
        //console.log(Game.mapData);
        
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
        player1 = new Player(
            new Tank(type,hp,derec,150, (Game.height-2*Game.size) ,playerImgSource)
        );
        
        Engine.render(player1.tank);
        Engine.tankQueue.push(player1.tank);
        //初始化AI
        AI.init();
    },
    
    //控制
    controle : function(keycode){
        player1.controle(keycode);
    },
    
    //地图坐标与地图数组之间的相互转换
    position2Offset : function(x, y){
        return {"i":Math.floor(x/25),"j":Math.floor(y/25)};
    },
    
    ossfet2Position : function(i, j){
        return {"x":25*i,"y":25*j};
    }
}


//画布
var Draw = {
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

}




//辅助类
/*
* js的伪随机数非常的不稳定
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