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
var Position = {
    x : 0,
    y : 0,
    init : function(x,y){
        this.x = x;
        this.y = y;
    }
}


//坦克类
var Tank = {
    type : 1,//类型
    hp : 20,//血量
    ammo : 1,//弹药数量
    derec : 1,//方向 1左 2上 3右 4下
    isgod : 0,//是否无敌
    speed : 100,//移动速度
    postion : null,
    shot : function(){
        //发射子弹  坦克坐标赋值给子弹 子弹移动
        if(this.ammo>0){
            Bullet.init(this.derec,this.position);
            Bullet.move();
            this.ammo--;
        }
    },
    move : function(derec){
        //移动
        this.derec = derec;
        //移动动画与坐标
    },
    create : function(type,hp,derec,speed,position){
        this.type = type;
        this.hp = hp;
        this.derec = derec;
        this.speed = speed;
        this.position =  position;
        return this;
    },
    destroyed : function(){
        //阵亡
    }
}

//子弹
var Bullet = {
    derec : 1,//方向
    speed : 500,//速度
    position : null,
    damage : 10,
    init : function(derec,position){
        this.derec = derec;
        this.position = position;
    },
    move : function(){
        //移动
    }
}

//障碍
var Barrier = {
    type : 0,//0空 1铁 2砖 3草 4水 5泥
    init : function(){
        //生成障碍物
    }
}


//玩家1
var Player1 = {
    tank : null,
    score : 0,
    init : function(){
        var type = 1,hp=20,derec=2;
        var position = Position.init();
        this.tank = Tank.init(type,hp,derec,position);
    }
}

//玩家2
var Player1 = {
    tank : null,
    score : 0,
    init : function(){
        
    }
}


//电脑AI
var AI = {
    amount : 20,//总数20
    currentAmout : 6,
    tanks : [],
    init : function(){
        this.tanks = new Array(6);
        for(var i=0; i<6; i++){
            var type = Helpers.random(0,4);
            var hp = Helpers.random(0,4)*10;
            this.tanks[i] = tank.init();
        }
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
        Draw.init();
        Map.init();
        AI.init();
        Player1.init(),
    },
    start : function(){
        AI.run();
    },
}


//画布
var Draw = {
    ctx : false,
    init : function(canvas){
        var c = document.getElementById(canvas);
        //getContext("2d") 是内建的html 5对象 
        this.ctx = c.getContext("2d");
    },
    //画矩形 无填充
    drawRect : function(x, y, length, size, color){
        this.ctx.fillStyle = color;
        this.ctx.strokeRect(x,y,length,size);
    },
    
    //绘制填充的矩形
    fillRect : function(x, y, length, size, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x,y,length,size);
    },
    
    //清除指定像素
    clearRect : function(x, y, length, size){
        this.ctx.clearRect(x, y, length, size);
    },
    
    //画图像
    drawImage : function(img, x, y, width, height){
        this.ctx.drawImage(img, x, y, width, height);
    },
    
    //返回图像的数据
    getImageData : function(x, y, length, size){
        return this.ctx.getImageData(x, y, length, size);
    },
    
    //将图像的数据填充到某一个坐标
    putImageData : function(img, x, y){
        this.ctx.putImageData(img, x, y);
    },
        
    //动画效果 
    drawdynamicImag : function(img, x, y, length, size, speed){
        setTimeout(function(){
            Draw.drawdynamicImag(img, x, y, length, size,speed);
        },speed);
    },
}



//辅助类
var Helpers = {
    random : function(min, max){
        return Math.round(Math.random()*max+min);
    },
}