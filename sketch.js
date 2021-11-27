var dog,happyDog,foodS,foodStock;
var database;
var sadDog;
var fedTime,lastFed,feed,addFood,foodObject;

function preload(){
    sadDog = loadImage("Dog.png");
    happyDog = loadImage("happydog.png");
}

function setup(){
    database = firebase.database();

    createCanvas(1500,1500);
    dog = createSprite(800,200,150,150);
    dog.addImage(sadDog);
    dog.scale = 0.15
    foodObject = new Food();
 
    feed = createButton("feed the dog");
    feed.position(700,95);
    feed.mousePressed(feedDog);

    addFood= createButton("add food");
    addFood.position(800,95);
    addFood.mousePressed(addFoodS);

    foodStock = database.ref("Food");
    foodStock.on("value",readStock);
    textSize(20);
}

function draw(){
    background("black");
    foodObject.display();
    fedTime = database.ref("FeedTime");
    fedTime.on("value",function(data){
        lastFed = data.val();
    });

    drawSprites();
    fill("white");
    if(lastFed>=12){
      text("last Fed:"+lastFed%12+"pm",350,30);
    }else if(lastFed == 0){
      text("last Fed: 12 am",350,30);
    }else{
     text("last Fed:"+lastFed+"am",350,30); 
    }
}

function readStock(data){
    foodS = data.val()
    foodObject.updateFoodStock(foodS);
}

function feedDog(){
    dog.addImage(happyDog);
    if(foodObject.getFoodStock()<=0){
      foodObject.updateFoodStock(foodObject.getFoodStock()*0);
    }else{
      foodObject.updateFoodStock(foodObject.getFoodStock()-1);
    }
    database.ref("/").update({
        Food:foodObject.getFoodStock(),
        FeedTime:hour()
    })
    
}

function addFoodS(){
     foodS++;
     database.ref("/").update({
         Food:foodS
     })
}

function showError(){
    console.log("error");
}
