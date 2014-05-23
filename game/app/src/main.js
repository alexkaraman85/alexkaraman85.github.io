/*globals define*/
define(function(require, exports, module) {
    'use strict';
    
    var Utils = require('../src/util'); 
    
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var EventHandler = require('famous/core/EventHandler');
    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Body = require('famous/physics/bodies/Body');
    var Circle = require('famous/physics/bodies/Circle');
    var Wall = require('famous/physics/constraints/Wall');

    // create the main context
    var mainContext = Engine.createContext();
    var contextSize = mainContext.getSize();
    var physicsEngine = new PhysicsEngine();
    var handler = new EventHandler();
    
    //Game vars
    var leftWall    = new Wall({normal : [1,0,0],  distance : 0, restitution : 0.5});
    var rightWall   = new Wall({normal : [-1,0,0], distance : 500, restitution : 0.5});
    var topWall     = new Wall({normal : [0,1,0],  distance : 500, restitution : 0.5});
    var bottomWall  = new Wall({normal : [0,-1,0], distance : 0, restitution : 0.5});
 
    //Floor
    var floor = new Surface({
        size: [contextSize[0], 200],
        properties: {
            backgroundColor: '#F2F2F0',
        }
    });
    floor.state = new StateModifier({
        origin: [0,1]
    });
    
    //Character
    var mchar = new ImageSurface({
        size: [139,170],
        content: 'content/images/breath.gif'
    });
    mchar.state = new StateModifier({
        origin: [0, .99]
    });
    mchar.stats = {};
    mchar.stats.dmg = 1;

    //Wall
    var brickWall = new Surface({
        size: [200, 250],
        properties: {
            backgroundColor: '#FFFFFF',
        }
    });
    brickWall.state = new StateModifier({
        origin: [.15,1]
    });
    brickWall.stats = {};
    brickWall.stats.maxhealth = 75;
    brickWall.stats.health = brickWall.stats.maxhealth;

    brickWall.ui = {};
    brickWall.ui.health = new Surface({
        size:[brickWall.stats.health,5],
        properties: {
            backgroundColor: 'red',
            boxShadow: '0px 0px 0px 2px rgb(0,0,0)',
            backgroundClip: 'content-box',
            borderRight: 'inset black 0'
        }
    });
    brickWall.ui.health.state = new StateModifier({
        origin: [.15,.95]
    });

    var model;
    //Game functions
    //Create ('drop') item in world
    function createItem(){
        model = new Surface({
            size: [50,50],
            properties: {
                backgroundColor: 'teal',
                borderRadius: '50px'
            }
        });
        model.state = new StateModifier({
            origin: [.1, 1]
        }); 
        model.particle = new Circle({radius:50});
        physicsEngine.addBody(model.particle);
        mainContext.add(model.state).add(model);
        physicsEngine.attach( leftWall,  [model.particle]);
        physicsEngine.attach( rightWall, [model.particle]);
        physicsEngine.attach( topWall,   [model.particle]);
        physicsEngine.attach( bottomWall,[model.particle]);
         //monitor click
        //testing physics

        model.particle.setVelocity([1,1,0]);
   
        Engine.on('prerender', function(){
            model.state.setTransform(model.particle.getTransform())
        });  
    }
    
    /**
    *   Returns the current borderRight pixel value(as Number), which represents health.
    **/
    function getHealth() {
        return brickWall.stats.health;
    }
    
    /**
    *   Lowers the health according to the specified amount.
    *   @param - subtractionHP: value being taken away from health. Number expected to be positive.
    **/
    function lowerHealth(subtractionHP) {
      brickWall.stats.health = brickWall.stats.health - subtractionHP;
       
       var borderRightString = brickWall.ui.health.getProperties().borderRight.match(/\d+/g);
       var borderRightNum = parseInt(borderRightString);
       brickWall.ui.health.setProperties({
            borderRight: 'inset black ' + ( borderRightNum + subtractionHP) + 'px'
       });
    }
   
    //monitor keydown
    Engine.on('keydown', function(e) {
        //if keydown is 's'
        // s to test stance switch
        if(e.which == '83'){
            mchar.setContent('content/images/stanceswitch.gif');
        }
        //if keydown is 'a'
        // 'a' is considered basic attack
        else if(e.which == '65') {        
            lowerHealth(5);

            //animate the wall
            var bwBG = Utils.subtractColorsHex( brickWall.getProperties().backgroundColor, '111111');

            //when wall reaches 0, reset it and drop an item
            if(getHealth() <= 0) {
                brickWall.setProperties({
                    backgroundColor: '#FFFFFF'
                });

                lowerHealth(-brickWall.stats.maxhealth);
                
                //doing a test of item drop
                createItem();
            } else {
                brickWall.setProperties({
                    backgroundColor: bwBG 
                });
            } 
            //wait half a second and unanimate char
            /*setTimeout(function() {
                mchar.setProperties({
                    backgroundColor: 'red'
                });            
            } , 500);*/
        }
    });

    //Create characters in world
    function initTest() {
        mainContext.add(floor.state).add(floor);
        mainContext.add(mchar.state).add(mchar);
        mainContext.add(brickWall.state).add(brickWall);
        mainContext.add(brickWall.ui.health.state).add(brickWall.ui.health);     
    }
    initTest();
});
