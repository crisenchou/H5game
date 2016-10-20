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
    this.x = x || 0; //横坐标
    this.y = y || 0; //纵坐标
}


var Tank = function(type, hp, derec, position, imgSource){
    this.type = type || 1;//类型
    this.hp = hp || 20;//血量
    this.ammo = 1;//弹药数量
    this.isgod = 0;//是否无敌
    this.speed = 5;//移动速度
    this.derec =  derec || 3;//方向
    this.position = position;//依赖倒置 属性注入
    this.size = 50;//坦克尺寸
    this.img = imgSource;
    this.shoot = function(){
        //发射子弹  坦克坐标赋值给子弹 子弹移动
        if(this.ammo>0){
            //初始化子弹 以及子弹运动方向 子弹移动 
            //var bullet = new Bullet();
            //bullet.move();
        }
	}

    this.destroyed = function(){
        //阵亡
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
        this.draw();
        //Draw.drawImage(this.img, this.position.x, this.position.y, this.size, this.size)
        //console.log("tank is moveing");
    }
    
    //画坦克
    this.draw = function(){
        Draw.drawImage(this.img, this.position.x, this.position.y, this.size-2, this.size-2)
    }
    
    //清除坦克
    this.clear = function(){
        Draw.clearRect(this.position.x, this.position.y, this.size, this.size);
        Draw.fillRect(this.position.x, this.position.y, this.size, this.size, Game.background);
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


var Badge = {
    x  : 250,
    y  : 450,
    size : 50,
    imageSrc : "img/player2.png",
    init : function(){
        var image = new Image();
        image.src = this.imageSrc;
        Draw.drawImage(image, this.x, this.y, this.size, this.size);
    }
}


//玩家1
var Player = function(tank){
    this.tank = tank;
    this.score = 0;
    this.move = function(derec){
        console.log(derec);
        this.tank.move(derec);
    };
    
    this.controle = function(keycode){
        if(keycode<=40 && keycode>=37){
            
            this.move(keycode-37);
        }else if(keycode == 32){
            this.shoot();
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
    defaultPosition : [0,200,450],
    move : function(){
        if(this.tankArr.length > 0){
            var AIProcess = setInterval(function(){
                for(var i in AI.tankArr){
                    var random = Helpers.random(0,3);
                    //增加只能  目的地坐标为 450,200
                    
                    
                    
                    AI.tankArr[i].move(random);
                }
            },1000);
        }
        
    },
    init : function(){
        //初始化玩家
        while(this.nowAmount < 4){
            this.create();
        }
    },
    create : function(){
        var image = new Image();
        image.src = "img/player1.png";
        var random = Helpers.random(0,2);
        var px = this.defaultPosition[random];
        var tank = new Tank(1,10,2,new Position(px,0),image);
        tank.draw();
        this.tankArr.push(tank);
        this.nowAmount++;
        this.totalAmount--;
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
    brush : null,
    height : 500,
    width : 500,
    background : "black",
    init : function(canvas){
        Draw.init(canvas);
        //Game.brush = draw;
        Draw.fillRect(0,0,this.height,this.width,this.background);//初始化游戏边界
        
        Badge.init();//初始化老家
        //Map.init();//初始化地图
        
        
        
        
        //初始化玩家
        var image = new Image();
        image.src = "img/player1.png";
        player1 = new Player(
            new Tank(1,10,2,new Position(200,450),image)
        );
        player1.tank.draw();
        
        
        //初始化AI
        AI.init();
        AI.move();
    },
    
    start : function(){
        //AI.run();
    },
    
    controle : function(keycode){
        player1.controle(keycode);
    }
}


//画布
var Draw ={
    ctx : null,
    init : function(canvas){
        var c = document.getElementById(canvas);
        //getContext("2d") 是内建的html5 对象 
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