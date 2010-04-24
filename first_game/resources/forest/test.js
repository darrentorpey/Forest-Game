// ---
// Copyright (c) 2010 Francesco Cottone, http://www.kesiev.com/
// Copyright (c) 2010 Darren Torpey, http://www.darrentorpey.com/
// ---

  // Hello! If you're thinking that the "Capman" demo was the easier... you're wrong ;) Well... at least is the most documented. So, let's travel between
  // the "capman"'s code. I'll be quite informal... forgive me!
  // Ow! First of all, play capman a bit, paying attention on what happens on the screen: how ghosts moves, how capman is controlled etc. Done? Ok. Let's go.

      // These objects will be reachable everywhere. Usually are the levels, the dialogues and the maingame object.
      var maingame; // The magic object that handles the full play cycle
      var maze; // The maze array, with pills and walls

    // First of all, let's load all the needed resources. Is done on the "onLoad" event of the window.
    window.addEventListener('load', function () {
      /*
      tool.makecels({
        rows:[
          [
            {img:"_bin/pacfull.png"},
            {img:"_bin/pacup1.png"},
            {img:"_bin/pacup2.png"},
            {img:"_bin/pacdown1.png"},
            {img:"_bin/pacdown2.png"},
            {img:"_bin/pacleft1.png"},
            {img:"_bin/pacleft2.png"},
            {img:"_bin/pacdead1.png"},
            {img:"_bin/pacdead2.png"},
            {img:"_bin/pacdead3.png"},
          ],
          [
            {img:"_bin/ghostup.png"},
            {img:"_bin/ghostdown.png"},
            {img:"_bin/ghostleft.png"},

            {img:"_bin/ghostup.png",filter:{replace:[{from:{r:249,g:0,b:26,a:255},to:{r:180,g:180,b:250,a:255}}]}},
            {img:"_bin/ghostdown.png",filter:{replace:[{from:{r:249,g:0,b:26,a:255},to:{r:180,g:180,b:250,a:255}}]}},
            {img:"_bin/ghostleft.png",filter:{replace:[{from:{r:249,g:0,b:26,a:255},to:{r:180,g:180,b:250,a:255}}]}},

            {img:"_bin/ghostup.png",filter:{replace:[{from:{r:249,g:0,b:26,a:255},to:{r:255,g:180,b:100,a:255}}]}},
            {img:"_bin/ghostdown.png",filter:{replace:[{from:{r:249,g:0,b:26,a:255},to:{r:255,g:180,b:100,a:255}}]}},
            {img:"_bin/ghostleft.png",filter:{replace:[{from:{r:249,g:0,b:26,a:255},to:{r:255,g:180,b:100,a:255}}]}},

            {img:"_bin/ghostup.png",filter:{replace:[{from:{r:249,g:0,b:26,a:255},to:{r:255,g:200,b:200,a:255}}]}},
            {img:"_bin/ghostdown.png",filter:{replace:[{from:{r:249,g:0,b:26,a:255},to:{r:255,g:200,b:200,a:255}}]}},
            {img:"_bin/ghostleft.png",filter:{replace:[{from:{r:249,g:0,b:26,a:255},to:{r:255,g:200,b:200,a:255}}]}},

            {img:"_bin/ghostscaredup.png"},
            {img:"_bin/ghostscareddown.png"},
            {img:"_bin/ghostscaredleft.png"},

            {img:"_bin/eatenup.png"},
            {img:"_bin/eatendown.png"},
            {img:"_bin/eatenleft.png"},

          ],
          [
            {img:"_bin/pacbonuses.png"},
          ],
          [
            {img:"_bin/capmaze.png"},
            {img:"_bin/pacpill.png"},
            {img:"_bin/pacpellet.png"}
          ]
        ]
      });
    return;*/

      help.akihabaraInit("Forest"); // Akihabara is initialized with title and all the default settings.
      gbox.setCallback(go); // the "go" method is registerd as callback: when all the resources are loaded, will be called.

      gbox.addImage("cels","resources/capman/cels.png"); // Images are loaded setting an alias and a file name. Can be sprites sheet, like this one...
      gbox.addImage("font","resources/capman/font.png"); // ...or font set.
      gbox.addImage("logo","resources/forest/logo.png"); // ...or a full image.

      gbox.addFont({id:"small",image:"font",firstletter:" ",tileh:8,tilew:8,tilerow:255,gapx:0,gapy:0}); // Font are mapped over an image, setting the first letter, the letter size, the length of all rows of letters and a horizontal/vertical gap.
      // Sometime you can find pixel fonts with multiple colors, one per row/block. You can map multiple fonts on the same image, so create many fonts, one for each color.

      gbox.addTiles({id:"capman",image:"cels",tileh:12,tilew:12,tilerow:10,gapx:0,gapy:0}); // Sprites sheets are cut here, setting the tile size, the number of sprites per row and the gap of the frames set.
      gbox.addTiles({id:"ghost1",image:"cels",tileh:12,tilew:12,tilerow:3,gapx:0,gapy:12}); // ...the first ghost is in the second row of the sheet
      gbox.addTiles({id:"ghost2",image:"cels",tileh:12,tilew:12,tilerow:3,gapx:36,gapy:12}); // ...the second is a bit on the right...
      gbox.addTiles({id:"ghost3",image:"cels",tileh:12,tilew:12,tilerow:3,gapx:36*2,gapy:12}); // ...the third one is here...
      gbox.addTiles({id:"ghost4",image:"cels",tileh:12,tilew:12,tilerow:3,gapx:36*3,gapy:12}); // ... and the fourth is here.
      gbox.addTiles({id:"ghostscared",image:"cels",tileh:12,tilew:12,tilerow:3,gapx:36*4,gapy:12}); // The scared ghost...
      gbox.addTiles({id:"ghosteaten",image:"cels",tileh:12,tilew:12,tilerow:3,gapx:36*5,gapy:12}); // ...and the eaten.
      gbox.addTiles({id:"bonus",image:"cels",tileh:12,tilew:12,tilerow:8,gapx:0,gapy:24}); // A row from bonuses...
      gbox.addTiles({id:"maze",image:"cels",tileh:4,tilew:4,tilerow:10,gapx:0,gapy:36}); // The tilesets are taken from the sprite sheet too.

      gbox.loadAll(); // When everything is ready, the "loadAll" downloads all the needed resources.

    }, false);

      // This is our "go" function we've register and will be called after all the resources are ready. i.e. gfx are loaded, tilesets and fonts are available
      function go() {

        // The very first thing to do is to set which groups will be involved in the game. Groups can be used for grouped collision detection and for rendering order
       gbox.setGroups(["background","player","ghosts","bonus","sparks","gamecycle"]); // Usually the background is the last thing rendered. The last thing is "gamecycle", that means games messages, like "gameover", menus etc.

       maingame=gamecycle.createMaingame("gamecycle","gamecycle"); // We create a new maingame into the "gamecycle" group. Will be called "gamecycle". From now, we've to "override" some of the maingame default actions.

       maingame.bullettimer=0; // Maingame is a javascript object, so it can host any kind of variable, like our "bullet timer". Keeps the game still for a while, that happens when eating a ghost or when being eated ;)

       if (gbox.dataLoad("capman-hiscore")===null) // We will keep the highscores too. So, if there is any highscore saved...
         gbox.dataSave("capman-hiscore",100); // ... we will put a "100 points" hiscore.

       // This method is called every new level. That is called also for the first level, so...
      maingame.changeLevel=function(level) {
          // The first time the "changeLevel" is called, level is NULL. Our first stage is "1", so...
          if (level==null) level=1;
          // We need to store this number somewhere, since is needed to define which is the next level.
          maingame.level=level; // "maingame" is handy enough to store some game data.
          maingame.hud.setValue("stage","value","STAGE "+level); // Put on the screen the stage name (I'll explain what the "hud" is in the "initializeGame" function)


        // Let's prepare the maze map now. Every stage is the same level but you can generate a new level each "changeLevel" call, using the "level" argument value.
        // This is just an array with the tile id or NULL for an empty transparent space.
        maze=help.finalizeTilemap({ // finalizeTilemap does some magic to the maze object: calculate real width/height of the map in pixels and values the "h" and "w" property.
          tileset:"maze", // This is the tileset used for rendering the map.
          map:help.asciiArtToMap([ // Hey, wait! This is an ascii art of the map? Yes! "asciiArtToMap" convers an array of string in an array of arrays, using...
          "||T----------------------------------------------------TxxT----------------------------------------------------T||",
          "||||                                                  ||xx||                                                  ||||",
          "||||   .   .   .   .   .   .   .   .   .   .   .   .  ||xx||   .   .   .   .   .   .   .   .   .   .   .   .  ||||",
          "||||                                                  ||xx||                                                  ||||",
          "||||   .  T------------T   .  T----------------T   .  ||xx||   .  T----------------T   .  T------------T   .  ||||",
          "||||      ||xxxxxxxxxx||      ||xxxxxxxxxxxxxx||      ||xx||      ||xxxxxxxxxxxxxx||      ||xxxxxxxxxx||      ||||",
          "||||   o  ||xxxxxxxxxx||   .  ||xxxxxxxxxxxxxx||   .  ||xx||   .  ||xxxxxxxxxxxxxx||   .  ||xxxxxxxxxx||   o  ||||",
          "||||      ||xxxxxxxxxx||      ||xxxxxxxxxxxxxx||      ||xx||      ||xxxxxxxxxxxxxx||      ||xxxxxxxxxx||      ||||",
          "||||   .  L------------J   .  L----------------J   .  L----J   .  L----------------J   .  L------------J   .  ||||",
          "||||                                                                                                          ||||",
          "||||   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .   .  ||||",
          "||||                                                                                                          ||||",
          "||||   .  T------------T   .  T----T   .  T----------------------------T   .  T----T   .  T------------T   .  ||||",
          "||||      ||xxxxxxxxxx||      ||xx||      ||xxxxxxxxxxxxxxxxxxxxxxxxxx||      ||xx||      ||xxxxxxxxxx||      ||||",
          "||||   .  L------------J   .  ||xx||   .  L------------TxxT------------J   .  ||xx||   .  L------------J   .  ||||",
          "||||                          ||xx||                  ||xx||                  ||xx||                          ||||",
          "||||   .   .   .   .   .   .  ||xx||   .   .   .   .  ||xx||   .   .   .   .  ||xx||   .   .   .   .   .   .  ||||",
          "||||                          ||xx||                  ||xx||                  ||xx||                          ||||",
          "||L--------------------T   .  ||xxL------------T      ||xx||      T------------Jxx||   .  T--------------------J||",
          "L--------------------T||      ||xxxxxxxxxxxxxx||      ||xx||      ||xxxxxxxxxxxxxx||      ||T--------------------J",
          "                    ||||   .  ||xxT------------J      L----J      L------------Txx||   .  ||||                    ",
          "                    ||||      ||xx||                                          ||xx||      ||||                    ",
          "                    ||||   .  ||xx||                                          ||xx||   .  ||||                    ",
          "                    ||||      ||xx||                                          ||xx||      ||||                    ",
          "                    ||||   .  ||xx||      T---------~~~~~~~~~~---------T      ||xx||   .  ||||                    ",
          "---------------------J||      ||xx||      ||                          ||      ||xx||      ||L---------------------",
          "-----------------------J   .  L----J      ||                          ||      L----J   .  L-----------------------",
          "                                          ||                          ||                                          ",
          "                           .              ||                          ||               .                          ",
          "                                          ||                          ||                                          ",
          "-----------------------T   .  T----T      ||                          ||      T----T   .  T-----------------------",
          "---------------------T||      ||xx||      ||                          ||      ||xx||      ||T---------------------",
          "                    ||||   .  ||xx||      L----------------------------J      ||xx||   .  ||||                    ",
          "                    ||||      ||xx||                                          ||xx||      ||||                    ",
          "                    ||||   .  ||xx||                                          ||xx||   .  ||||                    ",
          "                    ||||      ||xx||                                          ||xx||      ||||                    ",
          "                    ||||   .  ||xx||      T----------------------------T      ||xx||   .  ||||                    ",
          "T--------------------J||      ||xx||      ||xxxxxxxxxxxxxxxxxxxxxxxxxx||      ||xx||      ||L--------------------T",
          "||T--------------------J   .  L----J      L------------TxxT------------J      L----J   .  L--------------------T||",
          "||||                                                  ||xx||                                                  ||||",
          "||||   .   .   .   .   .   .   .   .   .   .   .   .  ||xx||   .   .   .   .   .   .   .   .   .   .   .   .  ||||",
          "||||                                                  ||xx||                                                  ||||",
          "||||   .  T------------T   .  T----------------T   .  ||xx||   .  T----------------T   .  T------------T   .  ||||",
          "||||      ||xxxxxxxxxx||      ||xxxxxxxxxxxxxx||      ||xx||      ||xxxxxxxxxxxxxx||      ||xxxxxxxxxx||      ||||",
          "||||   .  L--------Txx||   .  L----------------J   .  L----J   .  L----------------J   .  ||xxT--------J   .  ||||",
          "||||              ||xx||                                                                  ||xx||              ||||",
          "||||   o   .   .  ||xx||   .                                                           .  ||xx||   .   .   o  ||||",
          "||||              ||xx||                                                                  ||xx||              ||||",
          "||L--------T   .  ||xx||   .  T----T   .  T----------------------------T   .  T----T   .  ||xx||   .  T--------J||",
          "||xxxxxxxx||      ||xx||      ||xx||      ||xxxxxxxxxxxxxxxxxxxxxxxxxx||      ||xx||      ||xx||      ||xxxxxxxx||",
          "||T--------J   .  L----J   .  ||xx||   .  L------------TxxT------------J   .  ||xx||   .  L----J   .  L--------T||",
          "||||                          ||xx||                  ||xx||                  ||xx||                          ||||",
          "||||   .   .   .   .   .   .  ||xx||   .   .   .   .  ||xx||   .   .   .   .  ||xx||   .   .   .   .   .   .  ||||",
          "||||                          ||xx||                  ||xx||                  ||xx||                          ||||",
          "||||   .  T--------------------JxxL------------T   .  ||xx||   .  T------------JxxL--------------------T   .  ||||",
          "||||      ||xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx||      ||xx||      ||xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx||      ||||",
          "||||   .  L------------------------------------J   .  ||xx||   .  L------------------------------------J   .  ||||",
          "||||                                                  ||xx||                                                  ||||",
          "||||   .   .   .   .   .   .   .   .   .   .   .   .  ||xx||   .   .   .   .   .   .   .   .   .   .   .   .  ||||",
          "||||                                                  ||xx||                                                  ||||",
          "||L----------------------------------------------------JxxL----------------------------------------------------J||",
          ],[[null,"  "],[0,"||"],[1,"--"],[2,"L-"],[3,"-J"],[4,"T-"],[5,"-T"],[6,"~~"],[7,"xx"],[8," ."],[9," o"]]), // ...this array as palette. Don't you think that a map like this is quite easy to edit and read with your on-the-go text editor?
          tileIsSolid:function(obj,t){ // This function have to return true if the object "obj" is checking if the tile "t" is a wall, so...
              return (t!==null)&& // Is a wall if is not an empty space and...
                  ((t<6)||    // Is a piece of wall or...
                  ((t==6)&&(obj.status!="goout")&&(obj.status!="goin"))); // The ghost's door (only if is not a ghost that is trying to go out or in)
          }

         });
        gbox.createCanvas("mazecanvas",{w:maze.w,h:maze.h}); // Since finalizeMap have calculated the real height and width, we can create a canvas that fits perfectly our maze... Let's call it "mazecanvas".
        gbox.blitTilemap(gbox.getCanvasContext("mazecanvas"),maze); // Let's paste the maze map in the "maze" object into the just created "mazecanvas". So is now ready to be rendered.

        // Then, we need to count the number of pills to eat... quite crucial, to define when the maze was cleared. Since we're lazy, we're going to cycle the map and increase a counter instead of counting them by hand.
        this.pillscount=0; // Yes. We're creating a custom counter into the "maingame" object. You can call this dirty. I call this flexibility. And relax :)
        for (var y=0;y<maze.map.length;y++) // Let's iterate all the rows...
          for (var x=0;x<maze.map[y].length;x++) // ... and all the colums
            if (maze.map[y][x]>7) this.pillscount++; // If the row/column contains a "pill" tile (8 for plain pill, 9 for powerpill), let's increase our counter by one.
        // So now we know how many pills are in the maze.

        this.bonustimer=300; // We reset another timer. This counter is used to check when is the time to spawn a bonus in the middle of the maze. We will talk about this at last.

        this.newLife(); // We will call the local "newLife" method, since this came displaces enemies and player every new level. Do you remember this in capman? ;)
      }

      // This event is triggered every time the player "reborn". As you've seen, is manually called in the last line of "changelevel"
      maingame.newLife=function(up) {
        // Let's clean up the level from the ghosts, sparks (visual effects like explosions - in capman are sparks the earned points messages) and left bonuses, if any.
        gbox.trashGroup("sparks");
        gbox.trashGroup("bonus");
        gbox.trashGroup("ghosts");
        gbox.purgeGarbage(); // the gbox module have a garbage collector that runs sometime. Let's call this manually, for optimization (and better reinitialization)
        maingame.bullettimer=0; // Reset the bullettimer, so the game can continue normally.
      toys.topview.spawn(gbox.getObject("player","capman"),{x:maze.hw-6,y:maze.hh+50,accx:0,accy:0,xpushing:false,ypushing:false}); // Our "capman" object into the "player" group spawns in the middle of the maze every time it spawns.
      maingame.addGhost({id:1,x:maze.hw-12,y:maze.hh-20}); // Ghost are added here
      maingame.addGhost({id:2,x:maze.hw-24,y:maze.hh-17});
      maingame.addGhost({id:3,x:maze.hw+4,y:maze.hh-20});
      maingame.addGhost({id:4,x:maze.hw+14,y:maze.hh-17});
      if (this.bonustimer) this.bonustimer=300; // The timer is reset after spawning a new life, if the bouns is not appeared. As I said before, We well talk about this counter at the end.

      }


    // This method is called before starting the game, after the startup menu. Everything vital is done here, once per play.
    maingame.initializeGame=function() {

      // Maingame gives an "hud" object that is rendered over everything. Really useful for indicators, like score, lives etc. The first thing we do is to populate this object.
      maingame.hud.setWidget("label",{widget:"label",font:"small",value:"1UP",dx:240,dy:10,clear:true}); // This is a classic "1UP" static label. Unuseful but really retro!
      maingame.hud.setWidget("score",{widget:"label",font:"small",value:0,dx:240,dy:25,clear:true}); // A score counter. This not only is a displayed value but will really keep the player's score.
      maingame.hud.setWidget("label",{widget:"label",font:"small",value:"HI",dx:240,dy:40,clear:true}); // The "HI" label. Becouse "HI" is more retro.
      maingame.hud.setWidget("hiscore",{widget:"label",font:"small",value:0,dx:240,dy:55,clear:true}); // The hiscore counter. This one will be just used for displaying.

      maingame.hud.setWidget("lives",{widget:"symbols",minvalue:0,value:3-maingame.difficulty,maxshown:3,tileset:"capman",tiles:[5],dx:240,dy:70,gapx:16,gapy:0}); // The classic life indicator, with repated capman symbols. Note the "difficulty usage" ;)
      maingame.hud.setWidget("bonus",{widget:"stack",rightalign:true,tileset:"bonus",dx:gbox.getScreenW()-5,dy:gbox.getScreenH()-34,gapx:12,gapy:0,maxshown:8,value:[]}); // The bonus queue: is the "history" of the picked up bonuses, on the lower right corner, aligned to the right. Starts with an empty array. gapx and gapy is the distance between symbols
      maingame.hud.setWidget("stage",{widget:"label",font:"small",value:"",dx:0,dw:gbox.getScreenW()-5,dy:gbox.getScreenH()-13,halign:gbox.ALIGN_RIGHT,clear:true}); // The label with the stage name (low creativity: STAGE 1, STAGE 2 etc). Is empty for now, will be filled when a new level starts.

      maingame.hud.setValue("hiscore","value",gbox.dataLoad("capman-hiscore")); // setValue is used to set parametes on hud. So, well, we're setting the "hiscore value" to the loaded data "capman-hiscore" that contains the latest hiscore.

      // An object will draw the maze on the screen
       gbox.addObject({
        id:"bg", // This is the object ID
        group:"background", // Is in the "backround" group, that is the lower group in the "setGroups" list. Will be drawn for first.
        initialize:function() { // This action is executed the first time the object is called, so...
          gbox.setCameraY(2,{w:maze.w,h:maze.h}); // We place the camera a bit down, since the full maze doesn't fit the screen.
        },
        blit:function() { // Then, the most important action: the "blit", where object are drawn on the screen.
          gbox.blitFade(gbox.getBufferContext(),{alpha:1}); // First let's clear the whole screen. Blitfade draws a filled rectangle over the given context (in this case, the screen)
          gbox.blit(gbox.getBufferContext(),gbox.getCanvas("mazecanvas"),{dx:0,dy:0,dw:gbox.getCanvas("mazecanvas").width,dh:gbox.getCanvas("mazecanvas").height,sourcecamera:true}); // Simply draw the maze on the screen.
        },
        });


      // Now, let's add our capman. The player is usually added once per match and "moved" in the map on level changes (as you've seen into the newLife method)
      gbox.addObject({
        id:"capman", // Every object has an ID for being picked up every time (we've used the ID into newLife)
        group:"player", // ... and is put in a group (do you remember the setGroups command?)
        tileset:"capman", // Uses this tileset, generated during loading phase...
        killed:false, // and, for now, was not killed.
        scorecombo:1, // We'll keep also the score combo, while eating ghosts. at start is 0. Will increase while we're invincible.

        initialize:function() { // The "initialize" method is called the first frame the object spawns and never more.
          // We will use the topview toys, since capman is... well... a top view game.
          toys.topview.initialize(this,{
            colh:gbox.getTiles(this.tileset).tileh, // Topview games offers semi-isometric features but we are not using reduced collision box, since is flat 2D
            colw:gbox.getTiles(this.tileset).tilew,
            staticspeed:2, // Topview gives accelleration to object by default but the player moves at static speed in capman, without accellerations
            nodiagonals:true, // The player cannot move in diagonal direction
            noreset:true, // Do not reset moving state if any change is made, so capman keep going straight
            frames:{ // These are quite self explanatory
              still:{ speed:2, frames:[0] },
              hit:{speed:1,frames:[0,1,0,1]},
              standup:{ speed:1, frames:[0] },
              standdown:{ speed:1, frames:[0] },
              standleft:{ speed:1, frames:[0] },
              standright:{ speed:1, frames:[0] },
              movingup:{speed:3,frames:[0,2,1,2] },
              movingdown:{speed:3,frames:[0,4,3,4] },
              movingleft:{speed:3,frames:[0,6,5,6] },
              movingright:{speed:3,frames:[0,6,5,6] }
            }
            // What? Starting "x" and "y" are not here. That's because, when the first level starts, the "newLife" calls "spawn" over the player, setting the position.
          });
        },

        first:function() { // Usually everyting involving interacton is into the "first" method.
          this.counter=(this.counter+1)%10; // This line must be used in every object that uses animation. Is needed for getting the right frame (the "frames" block few lines up)

          if (!this.killed&&!maingame.gameIsHold()&&!maingame.bullettimer) { // If capman is still alive and the game is not "hold" (level changing fadein/fadeouts etc.) and the "bullet timer" is not stopping the game.

            // First of all, let's move.
            var olddata=help.createModel(this,["x","y","accx","accy","xpushing","ypushing","facing"]); // A little trick: capman cannot change direction, if hits a wall, so we backup capman's status here. Will restored if capman hits the wall.
            toys.topview.controlKeys(this,{left:"left",right:"right",up:"up",down:"down"}); // Set capman's horizontal and vertical speed.
            toys.topview.applyForces(this); // Moves capman
            // Note that our capman will keep going since we're not changing the speed given by controlKeys and applied by applyForces (i.e. toys.handleAccellerations)
            toys.topview.tileCollision(this,maze,"map",null,{tollerance:0,approximation:1}); // check tile collisions.
                                                  // Tollerance indicates how "rounded" the corners are (for turning precision - in capman have to be precise but not too much, for anticipated turnings)
                                                  // Approximation is the distance in pixel of each check. Lower approximation is better but is slower. Usually using the lower between the tile size and the sprite height is enough.
            if (this.touchedup||this.toucheddown||this.touchedleft||this.touchedright) { // If capman hits some wall
              help.copyModel(this,olddata); // the olddata properties are replaced to the local object
              toys.topview.applyForces(this); // And is moved like we've done before, like the player hasn't changed direction.
              toys.topview.tileCollision(this,maze,"map",null,{tollerance:0,approximation:1});
            }

            // The side warp. If capman reach one of the left or right side of the maze, is spawn on the other side,in the same direction
            if ((this.x<0)&&(this.facing==toys.FACE_LEFT)) // If capman reaches the left side of the maze, facing left
              this.x=maze.w-this.w; // move capman on right side
            else if ((this.x>(maze.w-this.w))&&(this.facing==toys.FACE_RIGHT)) // If capman reaches the right side of the maze, facing right
              this.x=0; // move capman on the left side.

            toys.topview.setFrame(this); // setFrame sets the right frame checking the facing and the defined animations in "initialize"

            // Then... let's eat!
            var inmouth=help.getTileInMap(this.x+this.hw,this.y+this.hh,maze,0); // I'll explain this the next line.
            // getTileInMap returns the tile in the specified coord in pixel. So the x position plus half of his width (and the same for y and half height), gives the center of capman (i.e. the mouth)
            // The third argument is the tile map we're checking, that is our maze. 0 is the returned value if the pointed coord is our from the map. All this for picking which tile is in the
            // capman's mouth!
            if (inmouth>7) { // If capman is eating a pill (8 for normal pill, 9 for power pill)
              if (inmouth == 9) { // If is a powerpill
                this.scorecombo=1; // Reset the combo counter.
                gbox.getObject("ghosts","ghost1").makeeatable(); // Make the ghosts vulnerable.
                gbox.getObject("ghosts","ghost2").makeeatable();
                gbox.getObject("ghosts","ghost3").makeeatable();
                gbox.getObject("ghosts","ghost4").makeeatable();
              }
              var mouthx=help.xPixelToTileX(maze,this.x+this.hw); // Let's get the pill coordinate in the maze...
              var mouthy=help.yPixelToTileY(maze,this.y+this.hh);
              help.setTileInMap(gbox.getCanvasContext("mazecanvas"),maze,mouthx,mouthy,null); // ... and set a null tile over that.
              maingame.hud.addValue("score","value",10); // Player earns 10 points. "hud" items also stores their values and can be used to store the real score.
              maingame.pillscount--; // Let's decrease the number of pills into the maze.
            }
          }
        },

        // The blit phase is the very last method called every frame. It should only draw the object on the bufferContext (i.e. the screen)
        blit:function() {
          if (!this.killed) // If the player is alive, then draw it on the screen. Is a nice trick, since is not needed to destroy/recreate the player every life.
            gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y,fliph:this.fliph,flipv:this.flipv,camera:this.camera,alpha:1});
            // That means: draw, from my tileset, a frame in position dx,dy flipping the sprite horizontally and/or vertcally, using the camera coords and with full opacity
            // All the arguments are taken from this: the "toys" values everything for doing something coherent from the genre of game you're using.
            // So, our "capman" flips, moves and does animation automatically. Really nerds can code something more complex, skipping or integrating the
            // "toys" methods.
        },

        // And now, a custom method. This one will kill the player and will be called by ghosts, when colliding with capman.
        kill:function() {
          if (!this.killed) { // If we're alive...
            this.killed=true; // First of all, capman is killed. As you've seen, that makes capman invisible and on hold.
            maingame.hud.addValue("lives","value",-1); // Then decrease the lives count.
            maingame.playerDied({wait:50}); // Telling the main game cycle that the player died. The arguments sets a short delay after the last fadeout, for making visible the dead animation
            toys.generate.sparks.simple(this,"sparks",null,{tileset:this.tileset,frames:{speed:4,frames:[6,5,7,8,9,9,9,9]}});
            // And here comes a common trick: the player is still where was killed and a "spark" (i.e. unuseful animation) starts in the same place.
            // This method allows many nice tricks, since avoid destruction/recreation of the player object, allow a respawn the player in the place it was killed very easily (switching
            // the killed attribute. The "spark.simple" method spawns a spark in the same position of the object in the first argument.
          }
        }

        });

      }

      // Now is the time to explain how to create a generator.
      // Is nothing but a new method of maingame that generate an object at given position.
      maingame.addGhost=function(data) {
        // Let's start with something that spawn a ghost. Objects as arguments are not only flexible, 
        // but you can give a name to the parameters or skipping them when calling.
        // Ghosts are objects too, like capman.
      gbox.addObject({
        ghostid:data.id, // We will give a number to each ghost, since their behaviour is quite similiar, with some exception I'll explain. Let's store this id here.
        id:"ghost"+data.id, // The object name is derived from the passed ID. So, addGhost({id:1}); will generate a "ghost1" object.
        group:"ghosts", // Ghosts are all on their group
        tileset:"ghost"+data.id, // A nice trick, isn't it? Ghost ID 1 will pick the "ghost1" tileset, that means a red ghost, ID 2 gets the light blue one and so on.
        status:"inhouse", // We will use a "status" property to check what the ghost is doing: if is in his house, waiting for going up, if is chasing capman or if is escaping. At the begining it is in his house...
        time:75, // ...and will stay there for 75 frames.

        initialize:function() { // From now, go back to the capman object for what I'm not commenting. You're getting better, so let's make the things harder :)
          toys.topview.initialize(this,{
            colh:gbox.getTiles(this.tileset).tileh, // That is like capman...
            colw:gbox.getTiles(this.tileset).tilew,
            staticspeed:2,
            nodiagonals:true,
            noreset:true,
            frames:{
              still:{ speed:2, frames:[0] },
              hit:{speed:1,frames:[0,1,0,1]},
              standup:{ speed:1, frames:[0] },
              standdown:{ speed:1, frames:[1] },
              standleft:{ speed:1, frames:[2] },
              standright:{ speed:1, frames:[2] },
              movingup:{speed:1,frames:[0] },
              movingdown:{speed:1,frames:[1] },
              movingleft:{speed:1,frames:[2] },
              movingright:{speed:1,frames:[2] }
            },
            x:data.x, // This time, we will place ghosts on creation. We will destroy and recreate the ghosts every time, since the status of enemies, bullets and foes rarely needs to be kept.
            y:data.y
          });
        },

        first:function() {
          this.counter=(this.counter+1)%10; // Our animation handler...

          var olddata=help.createModel(this,["x","y","accx","accy","facing"]); // Just like capman, we will use this to cancel a movement, if hits the wall.
          if (!maingame.gameIsHold()&&!maingame.bullettimer) { // The killed condition is no longer here, since the ghosts never die :(

            switch (this.status) { // capman does the same thing during the game but ghosts, instead, are busy in many activities, like...

              case "inhouse": { // ...bouncing up and down in their house.
                // Now we're going into the interesting part: things that moves by itself. Every genre of game has their ways: shoot'em up uses usually scripted or procedural movement, platform games can
                // have very complex scripts... For capman, we're going to use the "virtual stick" way: ghosts moves exactly like capman but moved by a "virtual joystick" that we're going to move for him.
                // Let's see how. There are several advantages on using virtual sticks, for example, we're using all the toys for deciding direction, movement and collisions.
                if (this.facing == toys.FACE_UP) // If the ghost is facing up...
                  toys.topview.controlKeys(this,{pressup:1}); // ...we simulate to press up on his virtual joystick...
                else
                  toys.topview.controlKeys(this,{pressdown:1}); // ...else we're pressing down.
                toys.topview.applyForces(this); // Let's move the ghost...
                toys.topview.tileCollision(this,maze,"map",null,{tollerance:0,approximation:1}); // ...and check if is colliding with a wall.
                if (this.touchedup||this.toucheddown) // If the ghost touched the border of the house...
                  this.facing=(this.facing==toys.FACE_UP?toys.FACE_DOWN:toys.FACE_UP); // Invert their direction. The next cycle, the ghost will move in the opposite direction.

                if (this.time==0) // If is time to go out from the house
                  this.status="goout"; // Let's change the status
                else
                  this.time--; // else keep counting the frames.

                break; // That's all. Our ghost is moving up and down.
              }

              case "goout": { // So we're leaving the house.
                if (this.x<maze.hw-this.hw) { // If we're on the left side of the maze (note: finalizeTilemap have valued also half width and height of the map)
                  toys.topview.setStaticSpeed(this,1); // Slowly... (notes: we're using "setStaticSpeed" when creating classic maze games, when pixel-precision with the playfield is needed, like capman or bomberman games)
                  toys.topview.controlKeys(this,{pressright:1}); //  Let's move to the right
                } else if (this.x>maze.hw-this.hw) { // If we're on the right side...
                  toys.topview.setStaticSpeed(this,1); // Slowly...
                  toys.topview.controlKeys(this,{pressleft:1}); //  Let's move to the left
                } else { // And, if we're on the center
                  toys.topview.setStaticSpeed(this,2) // Faster!
                  toys.topview.controlKeys(this,{pressup:1}); //  Let's move up, out from the house
                }
                toys.topview.applyForces(this); // Let's move the ghost...
                toys.topview.tileCollision(this,maze,"map",null,{tollerance:0,approximation:1}); // ...and check if is colliding with a wall.
                if (this.touchedup) // If the ghost touches a border up...
                  this.status="chase"; // We're out from the labirynth. Is the time to kick the capman a$$!
                break; // That is enough.
              }

              case "chase": { // We're ghosts. And angry. Let's go after capman!
                toys.topview.setStaticSpeed(this,2) // Setting the moving speed.
                // I've read somewhere that ghosts have different "aggressivity". We're going to simulate this this way: we're creating two different behaviours. The first one moves the ghost
                // toward capman's position. The second one is completely random. How to decide how much "aggressive" the ghost is?
                var aggressivity=this.ghostid; // First of all, let's calculate the aggressivity. Lower values means more aggressivity, so ghost 1 is more aggressive than ghost 4.
                aggressivity-=maingame.level-1; // The, we're going to increase the aggressivity each level. so ghost 4 is aggressive 4 in level 1, aggressive 3 in level 2, aggressive 2 in level 3 and so on.
                if (aggressivity<0) aggressivity=0; // If we're going mad (aggressivity<0) let's keep the calm: lower aggressivity threshold is 0.
                if (help.random(0,aggressivity)==0) { // ...now ghosts with lower aggressivity have more possibilites to move toward capman. Higher aggressivity means more probabilities to get a random direction.
                  // This is the "chasing" method. Is quite simple.
                  var capman=gbox.getObject("player","capman"); //  First of all, let's check where is capman.
                  if ((this.facing==toys.FACE_UP)||(this.facing==toys.FACE_DOWN)) { // Ghosts can't go in their opposite direction, so if we're moving horizontally, the next move is vertical and vice versa.
                    if (capman.x>this.x) // is on my right?
                      toys.topview.controlKeys(this,{pressright:1}); //  Let's move right.
                    else if (capman.x<this.x) // on my left?
                      toys.topview.controlKeys(this,{pressleft:1}); //  Let's move left.
                  } else {
                    if (capman.y>this.y) // is under me?
                      toys.topview.controlKeys(this,{pressdown:1}); //  Let's move down.
                    else if (capman.y<this.y) // is over me?
                      toys.topview.controlKeys(this,{pressup:1}); //  Let's move up.
                  }
                } else { // If we're moving randomly...
                  if ((this.facing==toys.FACE_UP)||(this.facing==toys.FACE_DOWN)) // The same condition of moving...
                    if (help.random(0,2)==0) toys.topview.controlKeys(this,{pressleft:1}); else toys.topview.controlKeys(this,{pressright:1}); // But direction is random, this time.
                  else
                    if (help.random(0,2)==0) toys.topview.controlKeys(this,{pressup:1}); else toys.topview.controlKeys(this,{pressdown:1});
                }
                toys.topview.applyForces(this); // Then we're moving to that direction...
                toys.topview.tileCollision(this,maze,"map",null,{tollerance:0,approximation:1}); // ...and check if is colliding with a wall.
                break;
              }

              case "eaten": { // We were eaten by capman. We need to go back to the ghost's house door, that is near the center of the maze.
                toys.topview.setStaticSpeed(this,4); // We're in a hurry now!
                if ((this.x==maze.hw-this.hw)&&(this.y==maze.hh-38)) // If we've reached the door
                  this.status="goin"; // ... and let's enter the door
                else {
                  if ((this.facing==toys.FACE_UP)||(this.facing==toys.FACE_DOWN)) { // The code is the same of the chase version, but we're going toward the center
                    if (maze.hw-this.hw>this.x) toys.topview.controlKeys(this,{pressright:1});
                    else if (maze.hw-this.hw<this.x)  toys.topview.controlKeys(this,{pressleft:1});
                  } else {
                    if (maze.hh-38>this.y) toys.topview.controlKeys(this,{pressdown:1});
                    else if (maze.hh-38<this.y) toys.topview.controlKeys(this,{pressup:1});
                  }
                }
                toys.topview.applyForces(this); // Then we're moving to that direction...
                toys.topview.tileCollision(this,maze,"map",null,{tollerance:0,approximation:1}); // ...and check if is colliding with a wall.
                break;
              }

              case "goin": { // Now we're going back at home. Just moving down slowly...
                toys.topview.setStaticSpeed(this,1) // Slowly...
                toys.topview.controlKeys(this,{pressdown:1}); // Moving down...
                toys.topview.applyForces(this); // Let's move...
                toys.topview.tileCollision(this,maze,"map",null,{tollerance:0,approximation:1}); // ...and check if is colliding with a wall.
                if (this.toucheddown) { // If we've touched the house floor...
                  this.tileset=this.id; // change wear...
                  toys.topview.setStaticSpeed(this,2) // Faster...
                  this.time=75; // We stay here for a while...
                  this.status="inhouse"; // ...and remember that after the "inhouse", the cycle starts over again: "goout" and "chase"!
                }
                break;
              }

              case "escape":{ // If we're escaping from capman, the logic is the reverse of chase, so...
                toys.topview.setStaticSpeed(this,1) // Slowly
                var capman=gbox.getObject("player","capman"); //  Where is capman?
                if ((this.facing==toys.FACE_UP)||(this.facing==toys.FACE_DOWN)) {
                  if (capman.x>this.x) // is on my right?
                    toys.topview.controlKeys(this,{pressleft:1}); //  Let's move left|
                  else if (capman.x<this.x) // on my left?
                    toys.topview.controlKeys(this,{pressright:1}); //  Let's move right!
                } else {
                  if (capman.y>this.y) // is under me?
                    toys.topview.controlKeys(this,{pressup:1}); //  Let's move up!.
                  else if (capman.y<this.y) // is over me?
                    toys.topview.controlKeys(this,{pressdown:1}); //  Let's move down!
                }
                toys.topview.applyForces(this); // Then we're moving to that direction...
                toys.topview.tileCollision(this,maze,"map",null,{tollerance:0,approximation:1}); // ...and check if is colliding with a wall.
                this.time--; // Decrease the timer. This time means for how much time the ghost is vulnerable.
                if (this.time>0) { // if we can be eaten...
                  // Now we're setting the tileset. Switching tilesets with the same number of frames allow to change dynamically how the character looks. This is a sample:
                  if (this.time>50) // If there is a lot of time left to be eaten...
                    this.tileset="ghostscared"; // let's pick the "scared" tileset (that one with blue color and wavy mouth)
                  else // ...else, if time is running out...
                    if (Math.floor(this.time/4)%2==0) // This is a little trick for make a think blinking using only a counter. The "/2" slow down the blink time and the "%2" gives an "on/off" output. So...
                      this.tileset="ghostscared"; // sometime picks the scared tileset...
                    else
                      this.tileset=this.id; // ...and sometime picks the original tileset.
                } else {
                  this.tileset=this.id; // set the original tileset...
                  this.status="chase"; // and go back for chasing!
                }


                break;
              }
            }

            // Not scripted movements can end on "still" condition (for example, we're trying to move toward a wall)
            // So, since ghosts never stop moving, we're going to make sure that a direction is taken, if the last movement touched a wall.
            if ((this.status=="chase")||(this.status=="eaten")||(this.status=="escape")) {

              if (this.touchedup||this.toucheddown||this.touchedleft||this.touchedright) { // If hitting a wall
                help.copyModel(this,olddata); // we're reversing to the old movement...
                toys.topview.controlKeys(this,{pressup:(this.facing==toys.FACE_UP),pressdown:(this.facing==toys.FACE_DOWN),pressleft:(this.facing==toys.FACE_LEFT),pressright:(this.facing==toys.FACE_RIGHT)}); // Push toward the old direction.
                toys.topview.applyForces(this); // redo the moving...
                toys.topview.tileCollision(this,maze,"map",null,{tollerance:0,approximation:1}); // ...and check collision.
                if (this.touchedup||this.toucheddown||this.touchedleft||this.touchedright) { //Uh-oh. If colliding here too, our ghost is really stuck.
                  for (var i=0;i<4;i++) // So we're trying to move in any of the four direction.
                    if (i!=((olddata.facing+2)%4)) { // Do you remember? Ghosts cannot go back, so we're skipping the opposite direction. The trick: opposite direction is current direction +2. Have a look to the toys constants.
                      help.copyModel(this,olddata); // First, go back on the starting point...
                      toys.topview.controlKeys(this,{pressup:(i==toys.FACE_UP),pressdown:(i==toys.FACE_DOWN),pressleft:(i==toys.FACE_LEFT),pressright:(i==toys.FACE_RIGHT)}); // Push one of the direction
                      toys.topview.applyForces(this); // redo the moving...
                      toys.topview.tileCollision(this,maze,"map",null,{tollerance:0,approximation:1}); // ...and check collision again.
                      if (!(this.touchedup||this.toucheddown||this.touchedleft||this.touchedright)) break; //  If we've not touched anything, we're no longer stuck!
                      // Else, we'll try the other direction
                    }
                  // If we're here, a valid direction was taken. YAY!
                }
              }

            }

            toys.topview.setFrame(this); // Every remember to call this at least once :)

            // The side warp is valid for ghosts too! :)
            if ((this.x<0)&&(this.facing==toys.FACE_LEFT))  this.x=maze.w-this.w;
            else if ((this.x>(maze.w-this.w))&&(this.facing==toys.FACE_RIGHT)) this.x=0;

            // Then... let's bug capman a bit
            var capman=gbox.getObject("player","capman"); // As usual, first we pick our capman object...
            if (gbox.collides(this,capman,2)) { // If we're colliding with capman, with a tollerance of 2 pixels...
              if (this.status=="chase") { // and we're hunting him...
                maingame.bullettimer=10; // ...stop the game for a while.
                capman.kill(); // ...kill capman. "kill" is the custom method we've created into the capman object.
              } else if (this.status=="escape") { // else, if we were escaping from capman (uh oh...)
                maingame.bullettimer=10; // ...stop the game for a while.
                toys.generate.sparks.popupText(capman,"sparks",null,{font:"small",jump:5,text:capman.scorecombo+"x100",keep:20}); // Text sparks are useful to "replace" sound effects, give quick hints o make a game really rad! ;)
                maingame.hud.addValue("score","value",capman.scorecombo*100); // Gives to the player 100*combo points...
                capman.scorecombo++; // Increase the combo counter...
                this.tileset="ghosteaten"; // change wear...
                this.status="eaten"; // ...and let's go back to the house...
              }
            }

          }
        },

        makeeatable:function() { // If called, the ghost became eatable by capman. Is called by capman when a powerpill is eaten
          if (this.status=="chase") { // If was chasing capman...
            this.status="escape"; // Time to escape!
            this.time=150; // For a while :)
          }
        },

        blit:function() { // In the blit phase, we're going to render the ghost on the screen, just like capman.
          gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y,fliph:this.fliph,flipv:this.flipv,camera:this.camera,alpha:1});
        }

        });
      }

      // Some final touch to the maingame object...
      maingame.gameIsOver=function() { // This method is called by maingame itself to check if the game is over or not. So...
        var isGameover=maingame.hud.getValue("lives","value")==0; // the game is REALLY over when lives counter reaches the zero.
        if (isGameover) // Just in time, we can do something useful, since we're here. Like... checking if we have a new *CAPMAN CHAMPION*...
          if (maingame.hud.getNumberValue("score","value")>maingame.hud.getNumberValue("hiscore","value")) // If the player's score is higher the shown hiscore...
            gbox.dataSave("capman-hiscore",maingame.hud.getNumberValue("score","value")); // ... save the player's score as new hiscore. The next time we play "capman", the new hiscore to beat will be this one.
        return isGameover; // Finally, returning if the game is ended or not.
      }
      // You can do this hiscore business in the ending animation, but for a tutorial, the "gameIsOver" is good enough. Is also unfair that there isn't an hiscore for each difficulty level. The world is bad... luckly you can this sources whenever you want, as exercise.

     // And now let's do something not related with ghosts, capmans, pills and mazes. Usually random things and hidden countings happens during the gameplay, so...
     maingame.gameEvents=function() { // This method happens every frame of the gameplay. You can keep here game timers or make happen random things, like...
       if (this.bullettimer>0) this.bullettimer--; // ...keep updated the "bullet time" counter...
       if (maingame.pillscount==0) // ...check if the maze is clear...
        maingame.gotoLevel(maingame.level+1); // ...and warp to the next level, if true.
      if (this.bonustimer>0) { // If the there is time left, before the bonus needs to be spawned...
        this.bonustimer--; // Decrease the timer
        if (this.bonustimer==0) // If the time is up...
          maingame.addBonus({bonusid:maingame.hud.getValue("bonus","value").length}); // Spawn the bonus.
        // Checking the timer after decreasing make sure that is spawned only once.
      }
      }

     // Another generator, but this one is simplier: this spawns a bonus in the middle of the maze.
      maingame.addBonus=function(data) { // Let's start with something that spawn a ghost. Objects as arguments are not only flexible, but you can give a name to the parameters or skipping them when calling.
        // All the bonuses have the same code, with a "bonusid" variable that changes its look and score. Notice that the bonus object don't use any toys, except for spawning sparks.
        // This is an example of an object implemented using nothing but the gbox object for his life cycle.
      gbox.addObject({
        id:null, // Bouns doesn't need to be referred, so we can give to him a "null" id. A random ID is given when created
        group:"bonus", // Bonuses are in their group...
        tileset:"bonus", // Using their tilesets...
        time:250, // ...and remains on the screen for a little while.
        bonusid:data.bonusid, // We're keeping here which type of bonus we are.
        frame:(data.bonusid>7?7:data.bonusid), // The bonus type. The first 8 are different. Then the last one is repeated, but with growing score.
        x:maze.hw-6,y:maze.hh+54,
        first:function() {
          // Bonuses are quite simple...
          var capman=gbox.getObject("player","capman"); // ... checking where capman is.
          if (gbox.collides(this,capman)) { // If is colliding with the bonus...
            var bonusscore=((this.bonusid+1)*100);
            maingame.hud.addValue("score","value",bonusscore); // Gives to the player the related bonus...
            maingame.hud.pushValue("bonus","value",this.frame); // Add the bonus image to the bonus queue (the pile on the bottom of the screen)
            toys.generate.sparks.popupText(this,"sparks",null,{font:"small",jump:5,text:bonusscore,keep:20}); // Our nice "text spark" with the earned score...
            gbox.trashObject(this); // ...and self-destroy.
          } else if (this.time==0) // If the time is up...
            gbox.trashObject(this); // ...too late, capman. Self-destroy without giving points
          else this.time--; // else, countdown.
        },

        blit:function() {
          gbox.blitTile(gbox.getBufferContext(),{tileset:this.tileset,tile:this.frame,dx:this.x,dy:this.y,fliph:this.fliph,flipv:this.flipv,camera:this.camera,alpha:1});
        }
       });
    }

    // Last but not least, the intro screen.
    // As you've seen, there are a bunch of method that are called by the "maingame" during the game life. We've used the default behaviour for most of them (the "let's begin" message, the "gameover" screen etc.)
    // but all of them are customizable. In this case, we're going to create a custom intro screen.
    maingame.gameTitleIntroAnimation = function(reset) {
      if (reset) { // "reset" is true before the first frame of the intro screen. We can prepare the intro animation...
        toys.resetToy(this, 'rising'); // Like resetting a local toy. Some of the toys are "helpers": they use a local datastore of an object and does stuff, when called. For example: we're reserving a data store called "rising" to the "maingame" object.
      } else { // Then, when is the time to render our animation...
        gbox.blitFade(gbox.getBufferContext(), { alpha: 1 }); // First clear up the screen...

        //toys.logos.linear(this,"rising",{image:"logo",x:gbox.getScreenHW()-gbox.getImage("logo").hwidth,y:20,sx:gbox.getScreenHW()-gbox.getImage("logo").hwidth,sy:gbox.getScreenH(),speed:3}); // Then we're telling to the "linear" toy (which renders something that moves from a point to another) to use the "rising" data store, for keeping his values.
        toys.logos.crossed(this, 'crosser', {
          image: 'logo',
          x: gbox.getScreenHW() - gbox.getImage('logo').hwidth,
          y: 20,
          speed: 2,
          gapx: 250,
          alpha: 0.5
        });
      }
    };

    // That's all. Please, gamebox... run the game!
    gbox.go();
  }