var canvas;
var stage;
var container;
var captureContainers;
var captureIndex;
var rainContainer;
var textObj;
var fullText = "Gib uns Zeit, gib uns Zeit\nBevor meine Welt in dir zerbricht\nUnd vielleicht, vielleicht, vielleicht\nDenkst du auch mal an mich\nGib uns Zeit, gib uns Zeit\nBevor meine Welt in dir zerbricht";
var currentText = "";
var textIndex = 0;
var textSpeed = 15000 / fullText.length;
var stopSpawningHearts = false; 

function init() {
  canvas = document.getElementById("testCanvas");
  stage = new createjs.Stage(canvas);

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  var background = new createjs.Shape();
  background.graphics.beginFill("#0a0a0a").drawRect(0, 0, canvas.width, canvas.height);
  stage.addChild(background);

  container = new createjs.Container();
  stage.addChild(container);

  captureContainers = [];
  captureIndex = 0;

  for (var i = 0; i < 100; i++) {
    spawnHeart();
  }

  textObj = new createjs.Text("", "bold 50px Arial", "#324f72");
  textObj.textAlign = "center";
  textObj.x = canvas.width / 2;
  textObj.y = canvas.height / 2 - 200;
  stage.addChild(textObj);

  animateText();

  rainContainer = new createjs.Container();
  stage.addChild(rainContainer);

  for (let i = 0; i < 100; i++) {
    let drop = new createjs.Shape();
    drop.graphics.beginFill("rgba(173,216,230,0.7)").drawRect(0, 0, 2, Math.random() * 20 + 10);
    drop.x = Math.random() * canvas.width;
    drop.y = Math.random() * canvas.height;
    drop.velY = Math.random() * 5 + 2;
    rainContainer.addChild(drop);
  }

  for (i = 0; i < 100; i++) {
    var captureContainer = new createjs.Container();
    captureContainer.cache(0, 0, canvas.width, canvas.height);
    captureContainers.push(captureContainer);
  }

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on("tick", tick);

  setTimeout(() => {
    stopSpawningHearts = true;
  }, 20000);
}

function animateText() {
  if (textIndex < fullText.length) {
    currentText += fullText[textIndex];
    textObj.text = currentText;
    textIndex++;
    setTimeout(animateText, textSpeed);
  }
}

// Функция для создания сердечек
function spawnHeart() {
  if (stopSpawningHearts) return;

  var heart = new createjs.Shape();
  heart.graphics.beginFill(createjs.Graphics.getHSL(Math.random() * 30 - 45, 100, 50 + Math.random() * 30));
  heart.graphics.moveTo(0, -12).curveTo(1, -20, 8, -20).curveTo(16, -20, 16, -10).curveTo(16, 0, 0, 12);
  heart.graphics.curveTo(-16, 0, -16, -10).curveTo(-16, -20, -8, -20).curveTo(-1, -20, 0, -12);

  heart.x = Math.random() * canvas.width;
  heart.y = Math.random() * -canvas.height;
  heart.velY = Math.random() * 2 + 1;
  heart.scaleX = heart.scaleY = Math.random() * 0.5 + 0.5;
  heart.alpha = Math.random() * 0.75 + 0.25;

  container.addChild(heart);
}

function tick(event) {
  captureIndex = (captureIndex + 1) % captureContainers.length;
  stage.removeChildAt(1);
  var captureContainer = captureContainers[captureIndex];
  stage.addChildAt(captureContainer, 1);
  captureContainer.addChild(container);

  for (var i = 0; i < container.numChildren; i++) {
    var heart = container.getChildAt(i);
    heart.y += heart.velY;

    if (heart.y > canvas.height) {
      if (!stopSpawningHearts) {
        heart.y = Math.random() * -50;
        heart.x = Math.random() * canvas.width;
      } else {
        container.removeChild(heart);
      }
    }
  }

  for (let i = 0; i < rainContainer.numChildren; i++) {
    let drop = rainContainer.getChildAt(i);
    drop.y += drop.velY;
    if (drop.y > canvas.height) {
      drop.y = -10;
      drop.x = Math.random() * canvas.width;
    }
  }

  captureContainer.updateCache("source-over");
  stage.update(event);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  document.body.style.margin = "0";
  document.documentElement.style.margin = "0";
}

init();
