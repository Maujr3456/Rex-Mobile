var rex, rex_img;
var bordas;
var chao, chao_img, chaoinv;
var nuvem,nuvem_img;
var cacto;
var pontos = 0;
var grunuvem, grucacto;
var JOGAR = 1;
var GAME_OVER = 2;
var estado = JOGAR;
var rex_collided;
var game_over, game_over_img;
var restart, restart_img;
var jump_sound, die_sound, checkpoint_sound;
function preload(){
  //pré carrega as imagens do jogo

  rex_img = loadAnimation("trex1.png","trex3.png","trex4.png");
  chao_img = loadImage('ground2.png');
  nuvem_img = loadImage('cloud.png')

  cactus_img1 = loadImage("obstacle1.png");
  cactus_img2 = loadImage("obstacle2.png");
  cactus_img3 = loadImage("obstacle3.png");
  cactus_img4 = loadImage("obstacle4.png");
  cactus_img5 = loadImage("obstacle5.png");
  cactus_img6 = loadImage("obstacle6.png");

  rex_collided = loadImage("trex_collided.png");

  game_over_img = loadImage("gameOver.png");
  restart_img = loadImage("restart.png");

  jump_sound = loadSound("jump.mp3");
  die_sound = loadSound("die.mp3");
  checkpoint_sound = loadSound("checkpoint.mp3");
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  

  restart = createSprite(width/2,height/2+50);
  restart.addImage(restart_img);

  game_over = createSprite(width/2,height/2);
  game_over.addImage(game_over_img);


  rex = createSprite(50,height-100,10,10);
  rex.addAnimation("running",rex_img);
  rex.addImage("collided", rex_collided);
  rex.scale = 0.5;

  rex.debug = false;
  rex.setCollider('circle', 0, 0, 30);

  bordas = createEdgeSprites();
  //var rand = Math.round(random(1,10));
  //console.log(rand);


  chao = createSprite(width / 2,height - 5,width,20);
  chao.addImage(chao_img);
  chaoinv = createSprite(width/2,height,width,10)
  chaoinv.visible = false;

  grunuvem = new Group();

  grucacto = new Group();
}

function draw(){
  background('white');
  if (estado === JOGAR){
    if(touches.length > 0 && rex.y >= height -30){
      rex.velocityY = -12;
      jump_sound.play();
      touches = [];
    }

    if(pontos % 100 === 0 && pontos > 0){
      checkpoint_sound.play();
    }


    restart.visible = false;

    game_over.visible = false;


    rex.velocityY = rex.velocityY + 1;
    chao.velocityX = -(4.3 + pontos / 100);


    if(chao.x < 0){
      chao.x = chao.width / 2;

    }
    pontos = pontos + Math.round(getFrameRate() / 30);

    Nuvens();
    Cactus();

    if(rex.isTouching(grucacto)){
      estado = GAME_OVER;
      rex.changeAnimation('collided');
      die_sound.play();
    }

  }
  else if (estado === GAME_OVER){

    chao.velocityX = 0;
    grunuvem.setVelocityXEach(0);
    grucacto.setVelocityXEach(0);
    grucacto.setLifetimeEach(-1);
    grunuvem.setLifetimeEach(-1);
    rex.velocityY = 0;
    restart.visible = true;

    game_over.visible = true;

    if(touches.length > 0){
      Reset();
      touches=[];
    }

  }

  

  rex.collide(chaoinv);


  text('Pontos: ' + pontos, width -80,height - 180);


  drawSprites();
}

function Nuvens(){
  if(frameCount % 60 === 0){
    nuvem = createSprite(width+10,100,30,30);
    nuvem.velocityX = -2;
    nuvem.addImage(nuvem_img);
    nuvem.scale = 0.5
    nuvem.y = Math.round(random(height-150,height -75))

    nuvem.depth = rex.depth;
    
    rex.depth = rex.depth + 1;

    nuvem.lifetime = width+20;

    grunuvem.add(nuvem);

  }
}

function Cactus(){
  if(frameCount % 60 === 0){
    cacto = createSprite(width+10,height-16,10,10);
    cacto.velocityX = -(5 + pontos  / 100);

    var rand = Math.round(random(1,6));

    switch(rand){
      case 1: cacto.addImage(cactus_img1);
      break;
      case 2: cacto.addImage(cactus_img2);
      break;
      case 3: cacto.addImage(cactus_img3);
      break;
      case 4: cacto.addImage(cactus_img4)
      break;
      case 5: cacto.addImage(cactus_img5);
      break;
      case 6: cacto.addImage(cactus_img6);
      break;

      default: break;
    }

    cacto.scale = 0.4;

    cacto.lifetime = width +30;

    grucacto.add(cacto);
  }
}

function Reset(){
estado = JOGAR;
grucacto.destroyEach();
grunuvem.destroyEach();
pontos = 0;
rex.changeAnimation('running');

}

