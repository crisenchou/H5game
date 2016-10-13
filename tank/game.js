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


var Tank = function(type, hp, derec, position, imgSource){
    this.type = type || 1;//类型
    this.hp = hp || 20;//血量
    this.ammo = 1;//弹药数量
    this.isgod = 0;//是否无敌
    this.speed = 100;//移动速度
    this.derec =  derec || 1;//方向
    this.position = position;//依赖倒置 属性注入
    this.size = 50;//坦克尺寸
    this.img = imgSource;
    this.show = function(){
        //发射子弹  坦克坐标赋值给子弹 子弹移动
        if(this.ammo>0){
        }
	}

    this.destroyed = function(){
        //阵亡
    }

    
    this.move = function(derec){
        Draw.clearRect(this.position.x, this.position.y, this.size, this.size);
        var derec = derec || this.derec;
        switch(derec){
            case 1 : //左
                this.position.x > 0 && --this.position.x;
                break;
            case 2 : //上
                this.position.y > 0 && --this.position.y;
                break;
            case 3 : //右
                this.position.x < Game.width && ++this.position.x;
                break;
            case 4 : //下
                this.position.y > Game.height &&  ++this.position.y;
                break;
            default : 
                break;
        }
        Draw.drawImage(this.img, this.position.x, this.position.y, this.size, this.size)
        //console.log("tank is moveing");
    }
    
    //画坦克
    this.draw = function(){
        Draw.drawImage(this.img, this.position.x, this.position.y, this.size, this.size)
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
        var random = Helpers.random(0,3);
        random = random+1;
        this.tank.move(random);
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
    brush : null,
    height : 500,
    width : 500,
    background : "black",
    init : function(canvas){
        Draw.init(canvas);
        //Game.brush = draw;
        Draw.fillRect(0,0,this.height,this.width,this.background);
        var image = new Image();
        image.src = "img/player1.png";
        player1 = new Player(
            new Tank(1,10,2,new Position(200,450),image)
        );
        
        player1.tank.draw();
        setInterval("player1.move()",10);
        //console.log();
    },
    
    start : function(){
        //AI.run();
    },
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
    // random : function(min, max){
        // return Math.round(Math.random()*(max-min))+min;
    // },
    
    
    getbit: function(num){
        var bit = 0;
        while(num>0){
            num = num>>1;
            bit++;
        }
        return bit;
    },

    randomBin : function(times){
        var num = "";
        while(times>0){
            num = num + Math.round(Math.random());
            times--;
        }
        
        return parseInt(num,2);
    },

    random : function(min,max){
        var num = max-min;
        var times = this.getbit(num);
        do{
            var binNum = this.randomBin(times);
        }while(!(binNum<=num));
        return binNum+min;
    }

}


// function r(min, max){
    // var time = max-min;
    // var num = 0;
    // while(time){
        // num = num + Math.round(Math.random());
        // time--;
    // }
    // return num;
    
// }




// function prob(){
    
    // var zero = 0;
    // var one = 0;
    // for(var i=0;i<100000;i++){
        // if(Math.round(Math.random()) ==1){
            // one++;
        // }else{
            // zero++;
        // }
    // }
    // return zero+"  "+one;
// }

// for(var i=0;i<10;i++){
    // var p = prob();
    // console.log(p);
// }



// var i = 10000;
// var zero = 0;
// var one = 0;
// var two = 0;
// var three = 0
// while(i){
    // var num1 = Math.round(Math.random());
    // var num2 = Math.round(Math.random());
    // num1 = num1 + "";
    // num2 = num2 + "";
    // var num = num1+num2;
    // if(num=="00"){
        // zero++;
    // }else if(num=="01"){
        // one++;
    // }else if(num=="10"){
        // two++;
    // }else if(num=="11"){
        // three++;
    // }else{
        // console.log("assert false");
    // }
    // //console.log(num);
    // // if(Math.round(Math.random()) ==1){
        // // one++;
    // // }else{
        // // zero++;
    // // }
    // //console.log(r(1,4));
    // i--;
// }
// console.log(zero,one,two,three);


//生成多少位数的二进制数
// function random(times){
    // var num = "";
    // while(times>0){
        // num = num + Math.round(Math.random());
        // times--;
    // }
    // return num;
// }


// for(i=0;i<100;i++){
    // var n = random(4);
    // console.log(n);
// }
