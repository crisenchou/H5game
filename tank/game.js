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
    pid : 0;
    //process : [],//分配进程
    start : function(){
        this.loadMap();//加载地图
        this.renderMap();//渲染地图
        this.pid = setInterval(Engine.work(),100);//启动计时
    },
    
    work : function(){
        //
    },
    
    // getProcessId : function(){
        
    // }
    
    //动画效果
    cartoon : function(object, derec, frequency){
        //移动规则
        if(0<=derec && 3>=derec){
            Draw.fillRect(object.x, object.y, object.size, object.size, Game.background);
            var rule = [{"x":-1,"y":0},{"x":0,"y":-1},{"x":1,"y":0},{"x":0,"y":1}];
            if(!checkCrash(object.x+rule[derec].x, object.y+rule[derec].y)){
                object.x += rule[derec].x;
                object.y += rule[derec].y;
            }
            
            this.render(object.resourceId, object.x, object.y, object.size)
        }
    },
    
    
    //图片渲染
    render : function(imgResourceId, x, y, size){
        var img = this.resource.imgResource[imgResourceId];
        Draw.drawImage(img, x, y, size, size)
    }
    
    
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
    }
    
    //渲染地图
    renderMap : function(map){
        for(var i in map){
            for(var j in map[i]){
                var position =  Game.ossfet2Position(i,j);
                Engine.render(map[i][j], position.x, position.y, Game.size);//渲染单位像素
            }
        }
    }
    
    checkCrash : function(x, y){
        var offset = Game2Offset(x, y);
        var access = Game.mapData[offset.i][offset.j];
        if(access == 1){
            return true;
        }else{
            return false;
        }
        
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
    this.size = 50;//坦克尺寸
    this.img = imgSource;
    this.moving = false;
    this.shoot = function(){
        //发射子弹  坦克坐标赋值给子弹 子弹移动
        if(this.ammo > 0){
            //初始化子弹 以及子弹运动方向 子弹移动 
            console.log("tank derec is "+this.derec);
            var bullet = new Bullet(this,this.derec, 10);
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
        //指定方向 指定移动距离  剩下的全部交给引擎来实现
        this.derec = derec;
        this.distance = 1;
        Engine.cartoon(this);
    }
}


//子弹
var Bullet = function(speed, position, derec, damage){
    //this.derec = derec || 1;
    this.speed = speed || 50;
    this = position;
    this.damage = damage || 10;
    this.derec = derec;
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
        if( tank.x < Badge.x && derec==0
            || tank.x > Badge.x && derec==2
            || tank.y < Badge.y && derec==1
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
        
        Engine.start();
        
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