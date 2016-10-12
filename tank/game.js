/*
* analyze
* tank 坦克
* bullet  子弹
* barrier  障碍
* player 玩家
* game 游戏 地图与设置
* draw 图形类接口
* AI 电脑AI
*/

//坐标
var Position = function(x,y){
    this.x = x || 0;
    this.y = y || 0;
}


var Tank = function(type, hp, derec, postion, bullet){
    this.type = type || 1;//类型
    this.hp = hp || 20;//血量
    this.ammo = 1;//弹药数量
    this.isgod = 0;//是否无敌
    this.speed = 100;//移动速度
    this.derec =  derec || 1;//方向
    this.postion = postion;//依赖倒置 属性注入
    this.bullet = bullet;//依赖倒置 属性注入
    this.show = function(){
        //发射子弹  坦克坐标赋值给子弹 子弹移动
        if(this.ammo>0){
        }
	}

    this.destroyed = function(){
        //阵亡
    }
    
    this.move = function(){
        console.log("tank is moveing");
    }
}


//子弹
var Bullet = function(speed,position,damage){
    
    //this.derec = derec || 1;
    this.speed = speed || 500;
    this.position = position;
    this.damage = damage || 10;
    this.move = function(derec){
        //do smone thing
    }
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
    this.move = function(){
        this.tank.move();
    }
}

//电脑AI
var AI = function(tank){
    this.tank = tank;
    var move = function(){
        this.tank.move();
        //随机漫步算法
    }
}


//地图
var Map = {
    position : null,
    elementId : "myCanvas",
	length : 500,
	height : 500,
	background : "white",
	status : 0,
    init : function(){
        //初始化地图
    },
}

//游戏选项
var Game = {
    status : 1,
    init : function(){
        player1 = new Player(new Tank(1,10,2,new Position(100,200),123));
        player1.move();
        //console.log();
    },
    start : function(){
        AI.run();
    },
}


//画布
var Draw = function(canvas){
    
    var c = document.getElementById(canvas);
    //getContext("2d") 是内建的html 5对象 
    this.ctx = c.getContext("2d");
    
    //画矩形 无填充
    this.drawRect = function(x, y, length, size, color){
        this.ctx.fillStyle = color;
        this.ctx.strokeRect(x,y,length,size);
    }
    
    //绘制填充的矩形
    this.fillRect = function(x, y, length, size, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x,y,length,size);
    }
    //清除指定像素
    this.clearRect = function(x, y, length, size){
        this.ctx.clearRect(x, y, length, size);
    }
    
    //画图像
    this.drawImage = function(img, x, y, width, height){
        this.ctx.drawImage(img, x, y, width, height);
    }
    
    //返回图像的数据
    this.getImageData = function(x, y, length, size){
        return this.ctx.getImageData(x, y, length, size);
    }
    
    //将图像的数据填充到某一个坐标
    this.putImageData = function(img, x, y){
        this.ctx.putImageData(img, x, y);
    }
        
    //动画效果 
    this.drawdynamicImag = function(img, x, y, length, size, speed){
        // setTimeout(function(){
            // Draw.drawdynamicImag(img, x, y, length, size,speed);
        // },speed);
    }
}



//辅助类
var Helpers = {
    random : function(min, max){
        return Math.round(Math.random()*max+min);
    },
}


Game.init();