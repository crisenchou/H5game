// 定义 0左 1下 2右

// 反ㄣ型
var shapeA = [
	[{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:1,y:2}],
	[{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:2,y:0}],
	[{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:1,y:2}],
	[{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:2,y:0}],
];

// ㄣ型
var shapeB = [
	[{x:0,y:2},{x:0,y:1},{x:1,y:1},{x:1,y:0}],
	[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:1}],
	[{x:0,y:2},{x:0,y:1},{x:1,y:1},{x:1,y:0}],
	[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:1}],
];

//反7型
var shapeC = [
	[{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:2}],
	[{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:2,y:0}],
	[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:1,y:2}],
	[{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:0,y:1}]
];

// 7型
var shapeD = [
	[{x:0,y:2},{x:1,y:2},{x:1,y:1},{x:1,y:0}],
	[{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:2,y:1}],
	[{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:0}],
	[{x:0,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:1}]
];

// 土型
var shapeE = [
	[{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:1,y:1}],
	[{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:1,y:2}],
	[{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:1,y:0}],
	[{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:2,y:1}]
];

// 田型
var shapeF = [
	[{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}],
	[{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}],
	[{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}],
	[{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}]
];

//竖条
var shapeG = [
	[{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:0,y:3}],
	[{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}],
	[{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:0,y:3}],
	[{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}],
];




var game = {
	gid : 0,
    elementId : "myCanvas",
	length : 200,
	height : 600,
	background : "white",
	level : 1,
	status : 0,
	score : 0,
	name : "tetris",
	init : function($config){
        var $config = $config || this.elementId;
        this.score = 0;
		draw.init($config);
		draw.drawGame(0, 0, this.background, this.length, this.height);
        tetris.init();
	},

	start : function(){
		if(game.status == 0){
			this.status = 1;
            if(this.level>5){
                alert("参数错误");
                return false;
            }

            var speed = Math.pow(2,5-this.level)*100;
			this.gid = setInterval('tetris.run();', speed);
		}
		return false;
		
	},
	
	pause : function(){
		if(game.status == 1){
			game.status = 0;
			clearInterval(game.gid);
		}
		
	},
    
    restart : function(){
        this.init();
    },
    
	control : function($op){
		if($op == "left"){
			tetris.left();
		}
		if($op == "right"){
			tetris.right();
		}
		if($op == "down"){
			tetris.down();
		}
		if($op == "up"){
			tetris.up();
		}
	},
    
    end : function(){
        alert("game over,the score is "+game.score);
        this.init();
        console.log("end");
    }
    
}


var tetris = {
	category : [shapeA,shapeB,shapeC,shapeD,shapeE,shapeF,shapeG],
	color : ['blue','blue','purple','purple','red','blue','red'],
	status : 0,
    fixtetris : [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
	fixColor : "black",
    init : function(){

        this.drawfix(game.background);
        for(var i=0;i<tetris.fixtetris.length;i++){
            tetris.fixtetris[i]=[];
        }
		shape.createShape();
		tetris.status = 1;
	},
	
    /* 根据当前元素的偏移量以及元素尺寸，将元素的key转换成相应的横纵坐标
    *  params shape array 方块形状  offsetx int 横坐标偏移量 offsety int 纵坐标偏移量 size方块的尺寸
    * return 
    */
    getRealPoint : function(shapeArr, offsetx, offsety, size){
        x = shapeArr.x * size + offsetx;
        y = shapeArr.y * size + offsety;
        return {"x":x,"y":y};
    },
    
    offsetyToKey : function(offsety){
        return ((game.height-offsety)/10)/2;
    },
    
    keyToOffsety : function(key){
        return game.height-20*key;
    },
    
    //形变
	up : function(){
		var direction = (shape.dir + 1) % 4;
		var nextShape = tetris.category[shape.flag][direction];
        if(this.isEdge(0, 0, nextShape)){
            return false;
        }
        
        if(this.isInFix(0, 0, nextShape)){
            return false;
        }
        
		shape.swipeshape();
		shape.changeShape();
		shape.drawshape();
	},
	
    //下落
	down : function(){
        if(this.status == 1){
            shape.swipeshape();
            while(!this.isEdge(0,shape.size) && !this.isInFix(0,shape.size)){
                shape.offsety += shape.size;
            }
            this.fix();
        }
	},
	
    //左移
	left : function(){
        //生成左移之后的元素  判断元素是否超出边界 或者存在于fix方块中
        if(this.isEdge(-shape.size,0)){
            return false;
        }
        if(this.isInFix(-shape.size,0)){
            return false;
        }
		shape.swipeshape();
		shape.offsetx -= shape.size; 
		shape.drawshape();
	},
	
    //右移
	right : function(){
        if(this.isEdge(shape.size,0)){
            return false;
        }

        if(this.isInFix(shape.size,0)){
            return false;
        }
        
		shape.swipeshape();
		shape.offsetx += shape.size; 
		shape.drawshape();
	},
	
    
    /*
    *  固定方块
    *  panrams offsety 当前坐标的偏移量
    */
	fix : function(){
        // 改变当前砖块颜色
        shape.swipeshape();
        shape.draw(this.fixColor);
        for(var i in shape.now){
            var realPiont = this.getRealPoint(shape.now[i], shape.offsetx, shape.offsety, shape.size);
            var key = this.offsetyToKey(realPiont.y);
            
            if(typeof tetris.fixtetris[key] !== "undefined"){
                tetris.fixtetris[key].push(realPiont.x);
            }
            
        }
        tetris.status = 0;
        
        if(this.canWipeLine() === true){
            this.drawfix("white");
            this.wipeLine();
            this.drawfix(this.fixColor);
        }
	},
    
    //检测是否可以消行
    canWipeLine : function(){
        for(var i in tetris.fixtetris){
            if(tetris.fixtetris[i].length >= 10){
                return true;
            }
        }
        return false;
    },
    
    //消行
	wipeLine : function(){
        var line = 0
        for(var i in tetris.fixtetris){
            if(tetris.fixtetris[i].length >= 10){
                line++;
                tetris.fixtetris[i] = [];
            }
        }
        
        for(var i=0;i<tetris.fixtetris.length;i++){
            if(tetris.fixtetris[i].length ==  0){
                for(var k=1;k<=4;k++){
                    if( typeof tetris.fixtetris[i+k] !== "undefined" &&  tetris.fixtetris[i+k].length > 0){
                        var temp = tetris.fixtetris[i];
                        tetris.fixtetris[i] = tetris.fixtetris[i+k];
                        tetris.fixtetris[i+k] = temp;
                        break;
                    }
                }
            }
        }
        
        game.score += Math.pow(2,line) * 100;
        document.getElementById("score").innerHTML = game.score;
	},
	
    
    
    //画固定方块
    drawfix : function(color){
        var color = color || this.fixColor;
        for(var i in tetris.fixtetris){
            if(tetris.fixtetris[i].length > 0){
                offsety = this.keyToOffsety(i);
                for(var j in tetris.fixtetris[i]){
                    if(tetris.fixtetris[j]){
                        draw.drawDot(tetris.fixtetris[i][j], offsety, color, shape.size-1, shape.size-1);
                    }
                }
            }
        }
    },
    
    
    /*
    * 判断某个坐标是否在fix方块中
    * param x方块的坐标x  方块的坐标y
    * return bool
    */
    checkInFix : function(x, y){
        key = this.offsetyToKey(y);
        if(typeof tetris.fixtetris[key] !== "undefined" && tetris.fixtetris[key].length > 0){
            for(var i in tetris.fixtetris[key]){
                if(x == tetris.fixtetris[key][i]){
                    return true;
                    break;
                }
            }
        }
        return false;
    },
    
    /*
    * 固定方块检测
    */
    isInFix : function(x, y, nowshape){
        x = x || 0;
        y = y || 0;
        nowshape = nowshape || shape.now;
        for(var i in nowshape){
            var realPiont = this.getRealPoint(nowshape[i], shape.offsetx, shape.offsety, shape.size);
	        if(this.checkInFix(realPiont.x+x, realPiont.y+y) === true){
		        return true;
            }
		}
        return false;
    },
    
    
    /*
    *  边界检测
    * params 当前元素的坐标x 当前坐标y
    * return bool
    */
    
    checkEdge : function(x, y){
        x = x || 0;
        y = y || 0;
        if(x>=0 && x<=game.length-shape.size && y<=game.height-shape.size){
            return false;
        }
        return true;
    },

    /*
    * 循环当前元素 检测是否达到边界
    *
    */
    isEdge : function(x, y, nowshape){
        x = x || 0;
        y = y || 0;
        nowshape = nowshape || shape.now;

        
        for(var i in nowshape){
            
            var realPiont = this.getRealPoint(nowshape[i], shape.offsetx, shape.offsety, shape.size);
	        if(this.checkEdge(realPiont.x+x, realPiont.y+y) === true){
		        return true;
            }
		}
        return false;
    },

    
    /*
    * 游戏运行  方块下落
    *
    */
	run : function(){
		if(game.status){
			if(tetris.status == 0){
				tetris.status = 1;
				shape.createShape();
                if(tetris.isInFix(0,0)){
                    game.end();
                }
			}

			if(tetris.status == 1){
                if(this.isEdge(0,shape.size)){
                    this.fix();
                    return false;
                }

                if(this.isInFix(0,shape.size)){
                    this.fix();
                    return false;
                }
                shape.swipeshape();
                shape.offsety += shape.size;
                shape.drawshape();
			}
		}
	},
}

var shape = {
	now : [],
	color : "black",
	flag : 0,
	dir : 0,
	size : 20,
	offsetx : 100,
	offsety : 0,
    down : 0,
	createShape : function(){
		shape.offsetx = game.length/2,
		shape.offsety = 0;
		shape.flag = shape.random(0,6);
		//shape.flag = 5;
		shape.color = tetris.color[shape.flag];
		shape.dir = shape.random(0,3);
		shape.now = tetris.category[shape.flag][shape.dir];//need to reflactor
	},
	
	random : function(min, max){
		return Math.round(Math.random()*max+min);
	},
	
	
	draw : function(color){
		var color = color || shape.color;
		for(var i in shape.now){
			var x = shape.now[i].x * shape.size + shape.offsetx;
			var y = shape.now[i].y * shape.size + shape.offsety;
			draw.drawDot(x, y, color, shape.size-1, shape.size-1);
		}
	},
	
	drawshape : function(){
		this.draw(shape.color);
	},

	swipeshape : function(){
		this.draw(game.background);
	},

	changeShape : function(){
		shape.dir = (shape.dir + 1) % 4;
		shape.now = tetris.category[shape.flag][shape.dir];
	},
	
}

var draw = {
    ctx : false,
    init : function(canvas){
        var c = document.getElementById(canvas);
        draw.ctx = c.getContext("2d");//getContext("2d") 
    },
    drawDot : function(x,y,color,length,size){
        length = length || 10;
        size = size || length;
		//draw.ctx.shadowBlur=20;
		//draw.ctx.shadowColor="black";
        draw.ctx.fillStyle = color;
        draw.ctx.fillRect(x+1,y,length,size);
    },
	
	drawGame : function(x,y,color,length,size){
        draw.drawDot(x+1,y,color,length,size);
		draw.ctx.strokeRect(x,y,length,size);
	}
}
