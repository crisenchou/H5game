var draw = {
    cxt : false,
    init : function(canvas){
        var c = document.getElementById(canvas);
        draw.cxt = c.getContext("2d");//getContext("2d") ���ڽ���html 5���� ӵ�л��ƶ���ͼ�εķ���
        draw.drawDot(0,0,game.background,game.x,game.y);
    },
    drawDot : function(x,y,color,length,size){
        length = length || 10;
        size = size || 10;
        draw.cxt.fillStyle = color;
        draw.cxt.fillRect(x,y,length,size);
    },
}