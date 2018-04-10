
var mainState = {

      preload: function() {
      //처음시작할때 이함수가 시작된다
      //여기에 게임의 이미지와 사운드를 로드시킨다.

      //bird,pipe이미지를 로드 시킨다.
        game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.stage.backgroundColor = '#71c5cf';

    },

    create: function() {
      //preload함수가 호출된후 호출된다
      //게임의 설정을 하고 sprite를 보여준다

        //물리 시스켐을 설정한다
        game.physics.startSystem(Phaser.Physics.ARCADE);


        //bird를 포지션 100,245에 위치시킨다.
        //여기서 bird프로퍼티가 생성된건가?
        this.bird = game.add.sprite(100, 245, 'bird');

        //파이프가 많기때문에 group으로 관리한다.
        this.pipes = game.add.group();

        //물리시스템에 bird를 추가시킨다.
        game.physics.arcade.enable(this.bird);
        //bird에다 충력을 추가시킨다.
        this.bird.body.gravity.y = 1000;
        // 무게중심을 왼쪽아래로 이동시켯다.
        this.bird.anchor.setTo(-0.2, 0.5);
        this.level=0;

        //1.5초마다 저함수를 실행,그러면 3번째 인자는 왜넣는걸까?)
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "score: 0",
        { font: "30px Arial", fill: "#ffffff" });
        this.levelscore = game.add.text(620, 20, "level: 1",
        { font: "30px Arial", fill: "#e1c3f9" });
        this.stop_label=game.add.text(300, 190, "",
        { font: "60px Arial", fill: "#89f059" });



        //스페이스바를 눌렀을때 jump함수를 호출시킨다.
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterKey.onDown.add(this.paused, this);

        var escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escKey.onDown.add(this.start, this);



      },

    update: function() {
      //초당 60번씩 호출된다.
      //여기에다가 게임의 로직을 넣게된다.
      if (this.bird.angle < 20)
            this.bird.angle += 1;
      //bird가 게임스크린을 벗어나게 되면 다시 게임을 시작한다.
        if (this.bird.y < 0 || this.bird.y > game.world.height)
            this.menu();
        //bird와 pipe가 만났을때 hitpipe함수를 호출한다.

        game.physics.arcade.overlap(
        this.bird, this.pipes, this.hitPipe, null, this);



    },
    paused: function(){
      this.stop_label.text="stop";
      game.paused=true;
    },


    start: function(){
      this.stop_label.text="";
      game.paused=false;
    },

    jump: function() {
      if (this.bird.alive == false)
          return;
    this.levelup();
        this.bird.body.velocity.y = -450;
        // bird프로퍼티에 에니메이션을 생성하고,100밀리초마다 새의각도를 20도 변화시키고
        //그 에니메이션을 실행시킨다.
        game.add.tween(this.bird).to({angle: -20}, 100).start();

    },



    restartGame: function() {
        game.state.start('main');
    },

//게임에 파이프를 추가하는 함수
    addOnePipe: function(x, y) {
    // x,y위치에 파이프를 만든다
    var pipe = game.add.sprite(x, y, 'pipe');

    // 아까 생성한 그룹에다가 pipe를 추가한다.
    this.pipes.add(pipe);

    // 파이프를 물리에 추가한다.
    game.physics.arcade.enable(pipe);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -400;

    // 파이프가 더이상 안보일때 제거한다.
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
},
addRowOfPipes: function() {
    // pipe들 사이의 공간을 만들기위해서 hole변수에 1~5사이의 숫자를 넣는다
    var hole = Math.floor(Math.random() * 5) + 1;
    this.score += 1;
    this.labelScore.text = "score: "+this.score;




    // 중간의 hole변수위치를 제외하고 높이가70인pipe를 세운다
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1 && i != hole+2)
            this.addOnePipe(800, i * 60 + 10);   //왜 70이지? 높이는490이고 8개를쌓아야하는데
            //10은 중간 공간인가?그렇다면 왜 공간이 생기는걸까?

},
hitPipe: function() {
    // 새가 이미 pipe에 박았다면 죽은생태로 되게하여서
    if (this.bird.alive == false)
        return;

    // Set the alive property of the bird to false
    this.bird.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEach(function(p){
        p.body.velocity.x = 0;
    }, this);
    this.gover = game.add.text(400, 400, "total score: "+(this.score+this.level*3),
    { font: "60px Arial", fill: "#ffffff" });


},

menu: function(){
  this.stop_label.destroy();
  this.over = game.add.text(280, 190, "Gameover",
  { font: "60px Arial", fill: "#10110c" });
  this.re_label= game.add.text(350, 250, "restart?",
  { font: "30px Arial", fill: "#b8da30" });
  this.re_label.inputEnabled = true;
  this.re_label.events.onInputUp.add(function () {
       // 버튼을 눌렀을떄 해당함수를 실행하게한다
       this.restartGame();

   });
   this.gover = game.add.text(400, 400, "total score: "+(this.score+this.level*3),
   { font: "60px Arial", fill: "#ffffff" });
   game.paused=true;



},

//스코어가 4를 넘어가면
levelup: function(){
  this.level=this.level+Math.floor(this.score/2);
  if(this.level>2){
    game.state.start('level2');



}

}

};




var level2 = {

      preload: function() {
      //처음시작할때 이함수가 시작된다
      //여기에 게임의 이미지와 사운드를 로드시킨다.

      //bird,pipe이미지를 로드 시킨다.
        game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.stage.backgroundColor = '#1970c9';

    },

    create: function() {
      //preload함수가 호출된후 호출된다
      //게임의 설정을 하고 sprite를 보여준다

        //물리 시스켐을 설정한다
        game.physics.startSystem(Phaser.Physics.ARCADE);


        //bird를 포지션 100,245에 위치시킨다.
        //여기서 bird프로퍼티가 생성된건가?
        this.bird = game.add.sprite(100, 245, 'bird');

        //파이프가 많기때문에 group으로 관리한다.
        this.pipes = game.add.group();

        //물리시스템에 bird를 추가시킨다.
        game.physics.arcade.enable(this.bird);
        //bird에다 충력을 추가시킨다.
        this.bird.body.gravity.y = 1000;
        // 무게중심을 왼쪽아래로 이동시켯다.
        this.bird.anchor.setTo(-0.2, 0.5);
        this.level=0;

        //1.5초마다 저함수를 실행,그러면 3번째 인자는 왜넣는걸까?)
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "score: 0",
        { font: "30px Arial", fill: "#ffffff" });
        this.levelscore = game.add.text(620, 20, "level: 2",
        { font: "30px Arial", fill: "#e1c3f9" });
        this.stop_label=game.add.text(300, 190, "",
        { font: "60px Arial", fill: "#89f059" });


        //스페이스바를 눌렀을때 jump함수를 호출시킨다.
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        enterKey.onDown.add(this.paused, this);

        var escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        escKey.onDown.add(this.start, this);



      },

    update: function() {
      //초당 60번씩 호출된다.
      //여기에다가 게임의 로직을 넣게된다.
      if (this.bird.angle < 20)
            this.bird.angle += 1;
      //bird가 게임스크린을 벗어나게 되면 다시 게임을 시작한다.
        if (this.bird.y < 0 || this.bird.y > game.world.height)
            this.menu();
        //bird와 pipe가 만났을때 hitpipe함수를 호출한다.

        game.physics.arcade.overlap(
        this.bird, this.pipes, this.hitPipe, null, this);



    },
    paused: function(){
      this.stop_label.text="stop";
      game.paused=true;
    },


    start: function(){
      this.stop_label.text="";
      game.paused=false;
    },

    jump: function() {
      if (this.bird.alive == false)
          return;

        this.bird.body.velocity.y = -450;
        // bird프로퍼티에 에니메이션을 생성하고,100밀리초마다 새의각도를 20도 변화시키고
        //그 에니메이션을 실행시킨다.
        game.add.tween(this.bird).to({angle: -20}, 100).start();

    },



    restartGame: function() {
        game.state.start('main');
    },

//게임에 파이프를 추가하는 함수
    addOnePipe: function(x, y) {
    // x,y위치에 파이프를 만든다
    var pipe = game.add.sprite(x, y, 'pipe');

    // 아까 생성한 그룹에다가 pipe를 추가한다.
    this.pipes.add(pipe);

    // 파이프를 물리에 추가한다.
    game.physics.arcade.enable(pipe);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -400;

    // 파이프가 더이상 안보일때 제거한다.
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
},
addRowOfPipes: function() {
    // pipe들 사이의 공간을 만들기위해서 hole변수에 1~5사이의 숫자를 넣는다
    var hole = Math.floor(Math.random() * 5) + 1;
    this.score += 1;
    this.labelScore.text = "score: "+this.score;



    // 중간의 hole변수위치를 제외하고 높이가70인pipe를 세운다
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1)
            this.addOnePipe(800, i * 60 + 10);   //왜 70이지? 높이는490이고 8개를쌓아야하는데
            //10은 중간 공간인가?그렇다면 왜 공간이 생기는걸까?

},
hitPipe: function() {
    // 새가 이미 pipe에 박았다면 죽은생태로 되게하여서
    if (this.bird.alive == false)
        return;

    // Set the alive property of the bird to false
    this.bird.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEach(function(p){
        p.body.velocity.x = 0;
    }, this);
    this.gover = game.add.text(400, 400, "total score: "+(this.score+this.level*3),
    { font: "60px Arial", fill: "#ffffff" });


},

menu: function(){
  this.stop_label.destroy();
  this.over = game.add.text(280, 190, "Gameover",
  { font: "60px Arial", fill: "#10110c" });
  this.re_label= game.add.text(350, 250, "restart?",
  { font: "30px Arial", fill: "#b8da30" });
  this.re_label.inputEnabled = true;
  this.re_label.events.onInputUp.add(function () {
       // 버튼을 눌렀을떄 해당함수를 실행하게한다
       this.restartGame();

   });
   this.gover = game.add.text(400, 400, "total score: "+(this.score+this.level*3),
   { font: "60px Arial", fill: "#ffffff" });
   game.paused=true;



},


};



var game = new Phaser.Game(800, 490);
game.state.add('main', mainState);
game.state.add('level2', level2);
game.state.start('main');
