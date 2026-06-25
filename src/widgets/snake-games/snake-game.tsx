/* eslint-disable */
// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";
import "./snake-game.css";

export function SnakeGame({ vertical, autoPlay }: { vertical?: boolean; autoPlay?: boolean } = {}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const g: any = {};
    g._container = wrapperRef.current;
    g._autoPlay = autoPlay === true;

/*================================================

Polyfill

================================================*/

(function(){ 'use strict';

    /*================================================
  
    Request Animation Frame
  
    ================================================*/
    
    var lastTime = 0;
    var vendors = [ 'webkit', 'moz' ];
    for( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x ) {
      window.requestAnimationFrame = (window as any)[ vendors[ x ] + 'RequestAnimationFrame' ];
      window.cancelAnimationFrame = (window as any)[ vendors[ x ] + 'CancelAnimationFrame' ] || (window as any)[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
    }
  
    if( !window.requestAnimationFrame ) {
      window.requestAnimationFrame = function( callback, element ) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
        var id = window.setTimeout(
          function() { 
            callback( currTime + timeToCall ); 
          }, timeToCall );
        lastTime = currTime + timeToCall;
        return id;
      }
    }
  
    if( !window.cancelAnimationFrame ) {
      window.cancelAnimationFrame = function( id ) {
        clearTimeout( id );
      }
    }
  
  })();
  
  /*================================================
  
  DOM Manipulation
  
  ================================================*/
  
  (function(){ 'use strict';
  
    function hasClass( elem: any, className: string ) {
      return new RegExp( ' ' + className + ' ' ).test( ' ' + elem.className + ' ' );
    };
  
    function addClass( elem: any, className: string ) {
      if( !hasClass(elem, className ) ) {
        elem.className += ' ' + className;
      }
    };
  
    function removeClass( elem: any, className: string ) {
      var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
      if( hasClass( elem, className ) ) {
        while( newClass.indexOf(' ' + className + ' ' ) >= 0 ) {
          newClass = newClass.replace( ' ' + className + ' ', ' ' );
        }
        elem.className = newClass.replace( /^\s+|\s+$/g, '' );
      }
    };
  
    function toggleClass( elem: any, className: string ) {
      var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
      if( hasClass(elem, className ) ) {
        while( newClass.indexOf( ' ' + className + ' ' ) >= 0 ) {
          newClass = newClass.replace( ' ' + className + ' ' , ' ' );
        }
        elem.className = newClass.replace( /^\s+|\s+$/g, '' );
      } else {
        elem.className += ' ' + className;
      }
    };
  
  })();
  
  /*================================================
  
  Core
  
  ================================================*/
  
  (function(){ 'use strict';
  
    /*================================================
  
    Math
  
    ================================================*/
  
    g.m = Math;
    g.mathProps = 'E LN10 LN2 LOG2E LOG10E PI SQRT1_2 SQRT2 abs acos asin atan ceil cos exp floor log round sin sqrt tan atan2 pow max min'.split( ' ' );
    for ( var i = 0; i < g.mathProps.length; i++ ) {
      g[ g.mathProps[ i ] ] = g.m[ g.mathProps[ i ] ];
    }
    g.m.TWO_PI = g.m.PI * 2;
  
    /*================================================
  
    Miscellaneous
  
    ================================================*/
  
    g.isset = function( prop: any ) {
      return typeof prop != 'undefined';
    };
  
  })();
  
  /*================================================
  
  Group
  
  ================================================*/
  
  (function(){ 'use strict';
  
    g.Group = function() {
      this.collection = [];
      this.length = 0;
    };
  
    g.Group.prototype.add = function( item: any ) {
      this.collection.push( item );
      this.length++;
    };
  
    g.Group.prototype.remove = function( index: number ) {
      if( index < this.length ) {
        this.collection.splice( index, 1 );
        this.length--;
      }
    };
  
    g.Group.prototype.empty = function() {
      this.collection.length = 0;
      this.length = 0;
    };
  
    g.Group.prototype.each = function( action: any, asc: any ) {
      var asc = asc || 0,
        i;
      if( asc ) {
        for( i = 0; i < this.length; i++ ) {
          this.collection[ i ][ action ]( i );
        }
      } else {
        i = this.length;
        while( i-- ) {
          this.collection[ i ][ action ]( i );
        }
      }
    };
  
  })();
  
  /*================================================
  
  Utilities
  
  ================================================*/
  
  (function(){ 'use strict';
  
    g.util = {};
  
    /*================================================
  
    Random
  
    ================================================*/
    
    g.util.rand = function( min: number, max: number ) {
      return g.m.random() * ( max - min ) + min;
    };
  
    g.util.randInt = function( min: number, max: number ) {
      return g.m.floor( g.m.random() * ( max - min + 1) ) + min;
    };
  
  }());
  
  /*================================================
  
  State
  
  ================================================*/
  
  (function(){ 'use strict';
  
    g.states = {};
  
    g.addState = function( state: any ) {
      g.states[ state.name ] = state;
    };
  
    g.setState = function( name: string ) {
      if( g.state ) {
        g.states[ g.state ].exit();
      }
      g.state = name;
      g.states[ g.state ].init();
    };
  
    g.currentState = function() {
      return g.states[ g.state ];
    };
  
  }());
  
  /*================================================
  
  Time
  
  ================================================*/
  
  (function(){ 'use strict';
  
    g.Time = function() {
      this.reset();
    }
  
    g.Time.prototype.reset = function() {
      this.now = Date.now();
      this.last = Date.now();
      this.delta = 60;
      this.ndelta = 1;
      this.elapsed = 0;
      this.nelapsed = 0;
      this.tick = 0;
    };
  
    g.Time.prototype.update = function() {
      this.now = Date.now();
      this.delta = this.now - this.last;
      this.ndelta = Math.min( Math.max( this.delta / ( 1000 / 60 ), 0.0001 ), 10 );
      this.elapsed += this.delta;
      this.nelapsed += this.ndelta;
      this.last = this.now;
      this.tick++;
    };
  
  })();
  
  /*================================================
  
  Grid Entity
  
  ================================================*/
  
  (function(){ 'use strict';
  
    g.Grid = function( cols: number, rows: number ) {
      this.cols = cols;
      this.rows = rows;
      this.tiles = [];
      for( var x = 0; x < cols; x++ ) {
        this.tiles[ x ] = [];
        for( var y = 0; y < rows; y++ ) {
          this.tiles[ x ].push( 'empty' );
        }
      }
    };
  
    g.Grid.prototype.get = function( x: number, y: number ) {
      return this.tiles[ x ][ y ];
    };
  
    g.Grid.prototype.set = function( x: number, y: number, val: any ) {
      this.tiles[ x ][ y ] = val;
    };
  
  })();
  
  /*================================================
  
  Board Tile Entity
  
  ================================================*/
  
  (function(){ 'use strict';
  
    g.BoardTile = function( opt: any ) {
      this.parentState = opt.parentState;
      this.parentGroup = opt.parentGroup;
      this.col = opt.col;
      this.row = opt.row;
      this.x = opt.x;
      this.y = opt.y;
      this.z = 0;
      this.w = opt.w;
      this.h = opt.h;
      this.elem = document.createElement( 'div' );
      this.elem.style.position = 'absolute';
      this.elem.className = 'tile';
      this.parentState.stageElem.appendChild( this.elem );
      this.classes = {
        pressed: 0,
        path: 0,
        up: 0,
        down: 0,
        left: 0,
        right: 0
      }
      this.updateDimensions();
    };
  
    g.BoardTile.prototype.update = function() {
      for( var k in this.classes ) {
        if( this.classes[ k ] ) {
          this.classes[ k ]--;
        }
      }
  
      if( this.parentState.food.tile.col == this.col || this.parentState.food.tile.row == this.row ) {
        this.classes.path = 1;
        if( this.col < this.parentState.food.tile.col ) {
          this.classes.right = 1;
        } else {
          this.classes.right = 0;
        }
        if( this.col > this.parentState.food.tile.col ) {
          this.classes.left = 1;
        } else {
          this.classes.left = 0;
        }
        if( this.row > this.parentState.food.tile.row ) {
          this.classes.up = 1;
        } else {
          this.classes.up = 0;
        }
        if( this.row < this.parentState.food.tile.row ) {
          this.classes.down = 1;
        } else {
          this.classes.down = 0;
        }
      } else {
        this.classes.path = 0;
      }
  
      if( this.parentState.food.eaten ) {
        this.classes.path = 0;
      }
    };
  
    g.BoardTile.prototype.updateDimensions = function() {
      this.x = this.col * this.parentState.tileWidth;
      this.y = this.row * this.parentState.tileHeight;
      this.w = this.parentState.tileWidth - this.parentState.spacing;
      this.h = this.parentState.tileHeight - this.parentState.spacing;
      this.elem.style.left = this.x + 'px';
      this.elem.style.top = this.y + 'px';
      this.elem.style.width = this.w + 'px';
      this.elem.style.height = this.h + 'px';
    };
  
    g.BoardTile.prototype.render = function() {
      var classString = '';
      for( var k in this.classes ) {
        if( this.classes[ k ] ) {
          classString += k + ' ';
        }
      }
      this.elem.className = 'tile ' + classString;
    };
  
  })();
  
  /*================================================
  
  Snake Tile Entity
  
  ================================================*/
  
  (function(){ 'use strict';
  
    g.SnakeTile = function( opt: any ) {
      this.parentState = opt.parentState;
      this.parentGroup = opt.parentGroup;
      this.col = opt.col;
      this.row = opt.row;
      this.x = opt.x;
      this.y = opt.y;
      this.w = opt.w;
      this.h = opt.h;
      this.color = null;
      this.scale = 1;
      this.rotation = 0;
      this.blur = 0;
      this.alpha = 1;
      this.borderRadius = 0;
      this.borderRadiusAmount = 0;
      this.elem = document.createElement( 'div' );
      this.elem.style.position = 'absolute';
      this.parentState.stageElem.appendChild( this.elem );
    };
  
    g.SnakeTile.prototype.update = function( i: number ) {
      this.x = this.col * this.parentState.tileWidth;
      this.y = this.row * this.parentState.tileHeight;
      if( i == 0 ) {
        this.color = '#fff';
        this.blur = this.parentState.dimAvg * 0.03 + Math.sin( this.parentState.time.elapsed / 200 ) * this.parentState.dimAvg * 0.015;
        if( this.parentState.snake.dir == 'n' ) {
          this.borderRadius = this.borderRadiusAmount + '% ' + this.borderRadiusAmount + '% 0 0';
        } else if( this.parentState.snake.dir == 's' ) {
          this.borderRadius = '0 0 ' + this.borderRadiusAmount + '% ' + this.borderRadiusAmount + '%';
        } else if( this.parentState.snake.dir == 'e' ) {
          this.borderRadius = '0 ' + this.borderRadiusAmount + '% ' + this.borderRadiusAmount + '% 0';
        } else if( this.parentState.snake.dir == 'w' ) {
          this.borderRadius = this.borderRadiusAmount + '% 0 0 ' + this.borderRadiusAmount + '%';
        }
      } else {
        this.color = '#fff';
        this.blur = 0;
        this.borderRadius = '0';
      }
      this.alpha = 1 - ( i / this.parentState.snake.tiles.length ) * 0.6;
      this.rotation = ( this.parentState.snake.justAteTick / this.parentState.snake.justAteTickMax ) * 90;
      this.scale = 1 + ( this.parentState.snake.justAteTick / this.parentState.snake.justAteTickMax ) * 1;
    };
  
    g.SnakeTile.prototype.updateDimensions = function() {
      this.w = this.parentState.tileWidth - this.parentState.spacing;
      this.h = this.parentState.tileHeight - this.parentState.spacing;
    };
  
    g.SnakeTile.prototype.render = function( i: number ) {
      this.elem.style.left = this.x + 'px';
      this.elem.style.top = this.y + 'px';
      this.elem.style.width = this.w + 'px';
      this.elem.style.height = this.h + 'px';
      this.elem.style.backgroundColor = 'rgba(255, 255, 255, ' + this.alpha + ')';
      this.elem.style.boxShadow = '0 0 ' + this.blur + 'px #fff';
      this.elem.style.borderRadius = this.borderRadius;
    };
  
  })();
  
  /*================================================
  
  Food Tile Entity
  
  ================================================*/
  
  (function(){ 'use strict';
  
    g.FoodTile = function( opt: any ) {
      this.parentState = opt.parentState;
      this.parentGroup = opt.parentGroup;
      this.col = opt.col;
      this.row = opt.row;
      this.x = opt.x;
      this.y = opt.y;
      this.w = opt.w;
      this.h = opt.h;
      this.blur = 0;
      this.scale = 1;
      this.hue = 100;
      this.opacity = 0;
      this.elem = document.createElement( 'div' );
      this.elem.style.position = 'absolute';
      this.parentState.stageElem.appendChild( this.elem );
    };
  
    g.FoodTile.prototype.update = function() {
      this.x = this.col * this.parentState.tileWidth;
      this.y = this.row * this.parentState.tileHeight;
      this.blur = this.parentState.dimAvg * 0.03 + Math.sin( this.parentState.time.elapsed / 200 ) * this.parentState.dimAvg * 0.015;
      this.scale = 0.8 + Math.sin( this.parentState.time.elapsed / 200 ) * 0.2;
  
      if( this.parentState.food.birthTick || this.parentState.food.deathTick ) {
        if( this.parentState.food.birthTick ) {
          this.opacity = 1 - ( this.parentState.food.birthTick / 1 ) * 1;
        } else {
          this.opacity = ( this.parentState.food.deathTick / 1 ) * 1;
        }
      } else {
        this.opacity = 1;
      }
    };
  
    g.FoodTile.prototype.updateDimensions = function() {
      this.w = this.parentState.tileWidth - this.parentState.spacing;
      this.h = this.parentState.tileHeight - this.parentState.spacing;
    };
  
    g.FoodTile.prototype.render = function() {
      this.elem.style.left = this.x + 'px';
      this.elem.style.top = this.y + 'px';
      this.elem.style.width = this.w + 'px';
      this.elem.style.height = this.h + 'px';
      this.elem.style[ 'transform' ] = 'translateZ(0) scale(' + this.scale + ')';
      this.elem.style.backgroundColor = 'hsla(' + this.hue + ', 100%, 60%, 1)';
      this.elem.style.boxShadow = '0 0 ' + this.blur + 'px hsla(' + this.hue + ', 100%, 60%, 1)';
      this.elem.style.opacity = this.opacity + '';
    };
  
  })();
  
  /*================================================
  
  Snake Entity
  
  ================================================*/
  
  (function(){ 'use strict';
  
    g.Snake = function( opt: any ) {
      this.parentState = opt.parentState;
      this.dir = 'e',
      this.currDir = this.dir;
      this.tiles = [];
      for( var i = 0; i < 5; i++ ) {
        this.tiles.push( new g.SnakeTile({
          parentState: this.parentState,
          parentGroup: this.tiles,
          col: 8 - i,
          row: 3,
          x: ( 8 - i ) * opt.parentState.tileWidth,
          y: 3 * opt.parentState.tileHeight,
          w: opt.parentState.tileWidth - opt.parentState.spacing,
          h: opt.parentState.tileHeight - opt.parentState.spacing
        }));
      }
      this.last = 0;
      this.updateTick = 10;
      this.updateTickMax = this.updateTick;
      this.updateTickLimit = 3;
      this.updateTickChange = 0.2;
      this.deathFlag = 0;
      this.movesSinceEat = 0;
      this.justAteTick = 0;
      this.justAteTickMax = 1;
      this.justAteTickChange = 0.05;
  
      // sync data grid of the play state
      var i = this.tiles.length;
  
      while( i-- ) {
        this.parentState.grid.set( this.tiles[ i ].col, this.tiles[ i ].row, 'snake' );
      }
    };
  
    g.Snake.prototype.updateDimensions = function() {
      var i = this.tiles.length;
      while( i-- ) {
        this.tiles[ i ].updateDimensions();
      }
    };
  
    g.Snake.prototype.update = function() {
      if( !g._autoPlay ) {
        if( this.parentState.keys.up ) {
          if( this.dir != 's' && this.dir != 'n' && this.currDir != 's' && this.currDir != 'n' ) {
            this.dir = 'n';
          }
        } else if( this.parentState.keys.down) {
          if( this.dir != 'n' && this.dir != 's' && this.currDir != 'n' && this.currDir != 's' ) {
            this.dir = 's';
          }
        } else if( this.parentState.keys.right ) {
          if( this.dir != 'w' && this.dir != 'e' && this.currDir != 'w' && this.currDir != 'e' ) {
            this.dir = 'e';
          }
        } else if( this.parentState.keys.left ) {
          if( this.dir != 'e' && this.dir != 'w' && this.currDir != 'e' && this.currDir != 'w' ) {
            this.dir = 'w';
          }
        }
        this.parentState.keys.up = 0;
        this.parentState.keys.down = 0;
        this.parentState.keys.right = 0;
        this.parentState.keys.left = 0;
      }

      this.updateTick += this.parentState.time.ndelta;
      if( this.updateTick >= this.updateTickMax ) {
        // reset the update timer to 0, or whatever leftover there is
        this.updateTick = ( this.updateTick - this.updateTickMax );

        if( g._autoPlay && this.parentState.food ) {
          var head = this.tiles[ 0 ];
          var food = this.parentState.food.tile;
          var dx = food.col - head.col;
          var dy = food.row - head.row;
          if( Math.abs( dx ) >= Math.abs( dy ) ) {
            if( dx > 0 && this.dir !== 'w' ) { this.dir = 'e'; }
            else if( dx < 0 && this.dir !== 'e' ) { this.dir = 'w'; }
            else if( dy > 0 && this.dir !== 'n' ) { this.dir = 's'; }
            else if( dy < 0 && this.dir !== 's' ) { this.dir = 'n'; }
          } else {
            if( dy > 0 && this.dir !== 'n' ) { this.dir = 's'; }
            else if( dy < 0 && this.dir !== 's' ) { this.dir = 'n'; }
            else if( dx > 0 && this.dir !== 'w' ) { this.dir = 'e'; }
            else if( dx < 0 && this.dir !== 'e' ) { this.dir = 'w'; }
          }
        }
  
        // rotate snake block array
        this.tiles.unshift( new g.SnakeTile({
          parentState: this.parentState,
          parentGroup: this.tiles,
          col: this.tiles[ 0 ].col,
          row: this.tiles[ 0 ].row,
          x: this.tiles[ 0 ].col * this.parentState.tileWidth,
          y: this.tiles[ 0 ].row * this.parentState.tileHeight,
          w: this.parentState.tileWidth - this.parentState.spacing,
          h: this.parentState.tileHeight - this.parentState.spacing
        }));
        this.last = this.tiles.pop();
        this.parentState.stageElem.removeChild( this.last.elem );
  
        this.parentState.boardTiles.collection[ this.last.col + ( this.last.row * this.parentState.cols ) ].classes.pressed = 2;
  
        // sync data grid of the play state
        var i = this.tiles.length;
  
        while( i-- ) {
          this.parentState.grid.set( this.tiles[ i ].col, this.tiles[ i ].row, 'snake' );
        }
        this.parentState.grid.set( this.last.col, this.last.row, 'empty' );
  
  
        // move the snake's head
        if ( this.dir == 'n' ) {
          this.currDir = 'n';
          this.tiles[ 0 ].row -= 1;
        } else if( this.dir == 's' ) {
          this.currDir = 's';
          this.tiles[ 0 ].row += 1;
        } else if( this.dir == 'w' ) {
          this.currDir = 'w';
          this.tiles[ 0 ].col -= 1;
        } else if( this.dir == 'e' ) {
          this.currDir = 'e';
          this.tiles[ 0 ].col += 1;
        }
  
        // wrap walls
        this.wallFlag = false;
        if( this.tiles[ 0 ].col >= this.parentState.cols ) {
          this.tiles[ 0 ].col = 0;
          this.wallFlag = true;
        }
        if( this.tiles[ 0 ].col < 0 ) {
          this.tiles[ 0 ].col = this.parentState.cols - 1;
          this.wallFlag = true;
        }
        if( this.tiles[ 0 ].row >= this.parentState.rows ) {
          this.tiles[ 0 ].row = 0;
          this.wallFlag = true;
        }
        if( this.tiles[ 0 ].row < 0 ) {
          this.tiles[ 0 ].row = this.parentState.rows - 1;
          this.wallFlag = true;
        }
  
        // check death by eating self
        if( this.parentState.grid.get( this.tiles[ 0 ].col, this.tiles[ 0 ].row ) == 'snake' ) {
          this.deathFlag = 1;
          clearTimeout( this.foodCreateTimeout );
        }

        // autoPlay stuck detection
        if( g._autoPlay && !this.deathFlag ) {
          this.movesSinceEat++;
          if( this.movesSinceEat > this.parentState.cols * this.parentState.rows * 2 ) {
            this.deathFlag = 1;
            clearTimeout( this.foodCreateTimeout );
          }
        }

        // check eating of food (skip if already dead)
        if( !this.deathFlag && this.parentState.grid.get( this.tiles[ 0 ].col, this.tiles[ 0 ].row ) == 'food' ) {
          this.tiles.push( new g.SnakeTile({
            parentState: this.parentState,
            parentGroup: this.tiles,
            col: this.last.col,
            row: this.last.row,
            x: this.last.col * this.parentState.tileWidth,
            y: this.last.row * this.parentState.tileHeight,
            w: this.parentState.tileWidth - this.parentState.spacing,
            h: this.parentState.tileHeight - this.parentState.spacing
          }));
          if( this.updateTickMax - this.updateTickChange > this.updateTickLimit ) {
            this.updateTickMax -= this.updateTickChange;
          }
          this.parentState.score++;
          this.movesSinceEat = 0;
          this.justAteTick = this.justAteTickMax;
  
          this.parentState.food.eaten = 1;
          if( this.parentState.food.tile.elem.parentNode ) {
            this.parentState.stageElem.removeChild( this.parentState.food.tile.elem );
          }
  
          var _this = this;
          
          this.foodCreateTimeout = setTimeout( function() {
            _this.parentState.food = new g.Food({
              parentState: _this.parentState
            });
          }, 300);
        }
  
        if( this.deathFlag ) {
          this.parentState.resetSnake();
        }
      }
  
      // update individual snake tiles
      var i = this.tiles.length;
      while( i-- ) {
        this.tiles[ i ].update( i );
      }
  
      if( this.justAteTick > 0 ) {
        this.justAteTick -= this.justAteTickChange;
      } else if( this.justAteTick < 0 ) {
        this.justAteTick = 0;
      }
    };
  
    g.Snake.prototype.render = function() {
      // render individual snake tiles
      var i = this.tiles.length;
      while( i-- ) {
        this.tiles[ i ].render( i );
      }
    };
  
  })();
  
  /*================================================
  
  Food Entity
  
  ================================================*/
  
  (function(){ 'use strict';
  
    g.Food = function( opt: any ) {
      this.parentState = opt.parentState;
      this.tile = new g.FoodTile({
        parentState: this.parentState,
        col: 0,
        row: 0,
        x: 0,
        y: 0,
        w: opt.parentState.tileWidth - opt.parentState.spacing,
        h: opt.parentState.tileHeight - opt.parentState.spacing
      });
      this.reset();
      this.eaten = 0;
      this.birthTick = 1;
      this.deathTick = 0;
      this.birthTickChange = 0.025;
      this.deathTickChange = 0.05;
    };
  
    g.Food.prototype.reset = function() {
      var empty = [];
      for( var x = 0; x < this.parentState.cols; x++) {
        for( var y = 0; y < this.parentState.rows; y++) {
          var tile = this.parentState.grid.get( x, y );
          if( tile == 'empty' ) {
            empty.push( { x: x, y: y } );
          }
        }
      }
      var newTile = empty[ g.util.randInt( 0, empty.length - 1 ) ];
      this.tile.col = newTile.x;
      this.tile.row = newTile.y;
    };
  
    g.Food.prototype.updateDimensions = function() {
      this.tile.updateDimensions();
    };
  
    g.Food.prototype.update = function() {
      // update food tile
      this.tile.update();
  
      if( this.birthTick > 0 ) {
        this.birthTick -= this.birthTickChange;
      } else if( this.birthTick < 0 ) {
        this.birthTick = 0;
      }
  
      // sync data grid of the play state
      this.parentState.grid.set( this.tile.col, this.tile.row, 'food' );
    };
  
    g.Food.prototype.render = function() {
      this.tile.render();
    };
  
  })();
  
  /*================================================
  
  Play State
  
  ================================================*/
  
  (function(){ 'use strict';
  
    function StatePlay() {
      this.name = 'play';
    }
  
    StatePlay.prototype.init = function() {
      var container = g._container;
      this.scoreElem = container ? container.querySelector( '.snake-score' ) : document.querySelector( '.snake-score' );
      this.stageElem = container ? container.querySelector( '.snake-stage' ) : document.querySelector( '.snake-stage' );
      
      if(!this.scoreElem || !this.stageElem) {
        console.error('Snake game elements not found');
        return;
      }
      
      this.headerHeight = 0;
      var container = this.stageElem.closest('.snake-game-container');
      var isVertical = container?.dataset.vertical === 'true';
      this.autoPlay = container?.dataset.autoplay === 'true';
      this.dimLong = isVertical ? 24 : 31;
      this.dimShort = isVertical ? 16 : 16;
      this.padding = 0; // no inner container padding
      this.boardTiles = new g.Group();
      this.keys = {};
      this.foodCreateTimeout = null;
      this.score = 0; // score not displayed
      this.time = new g.Time();
      this.getDimensions();
      if( this.winWidth < this.winHeight ) {
        this.rows = this.dimLong;
        this.cols = this.dimShort;
      } else {
        this.rows = this.dimShort;
        this.cols = this.dimLong;
      }
      this.spacing = 1;
      this.grid = new g.Grid( this.cols, this.rows );
      this.resize();
      this.createBoardTiles();
      this.bindEvents();
      this.snake = new g.Snake({
        parentState: this
      });
      this.food = new g.Food({
        parentState: this
      });
    };
  
    StatePlay.prototype.getDimensions = function() {
      // Get dimensions from parent container 628x320
      var parent = this.stageElem && this.stageElem.parentElement ? this.stageElem.parentElement : this.stageElem;
      this.winWidth = parent ? parent.clientWidth : this.stageElem.offsetWidth;
      this.winHeight = parent ? parent.clientHeight : this.stageElem.offsetHeight;
      this.activeWidth = this.winWidth - ( this.winWidth * this.padding );
      this.activeHeight = this.winHeight - ( this.winHeight * this.padding );
    };
  
    StatePlay.prototype.resize = function() {
      var _this = g.currentState();

      _this.getDimensions();

      // Keep aspect ratio of game field, but center scene with CSS
      _this.stageRatio = _this.rows / _this.cols;
      if( _this.activeWidth > _this.activeHeight / _this.stageRatio ) {
        _this.stageHeight = _this.activeHeight;
        _this.stageWidth = Math.floor( _this.stageHeight / _this.stageRatio );
      } else {
        _this.stageWidth = _this.activeWidth;
        _this.stageHeight = Math.floor( _this.stageWidth * _this.stageRatio );
      }

      _this.tileWidth = ~~( _this.stageWidth / _this.cols );
      _this.tileHeight = ~~( _this.stageHeight / _this.rows );

      _this.stageElem.style.width = ( _this.tileWidth * _this.cols ) + 'px';
      _this.stageElem.style.height = ( _this.tileHeight * _this.rows ) + 'px';
      _this.dimAvg = ( _this.activeWidth + _this.activeHeight ) / 2;
      _this.spacing = Math.max( 1, ~~( _this.dimAvg * 0.0025 ) );

      // marginTop no longer used — centering done via CSS

      _this.boardTiles.each( 'updateDimensions' );
      _this.snake !== undefined && _this.snake.updateDimensions();
      _this.food !== undefined && _this.food.updateDimensions();
    };
  
    StatePlay.prototype.createBoardTiles = function() {
      for( var y = 0; y < this.rows; y++ ) {
        for( var x = 0; x < this.cols; x++ ) {
          this.boardTiles.add( new g.BoardTile({
            parentState: this,
            parentGroup: this.boardTiles,
            col: x,
            row: y,
            x: x * this.tileWidth,
            y: y * this.tileHeight,
            w: this.tileWidth - this.spacing,
            h: this.tileHeight - this.spacing
          }));
        }
      }
    };
  
    StatePlay.prototype.upOn = function() { 
      var state = g.currentState();
      if(state && state.keys) state.keys.up = 1; 
    }
    StatePlay.prototype.downOn = function() { 
      var state = g.currentState();
      if(state && state.keys) state.keys.down = 1; 
    }
    StatePlay.prototype.rightOn = function() { 
      var state = g.currentState();
      if(state && state.keys) state.keys.right = 1; 
    }
    StatePlay.prototype.leftOn = function() { 
      var state = g.currentState();
      if(state && state.keys) state.keys.left = 1; 
    }
    StatePlay.prototype.upOff = function() { 
      var state = g.currentState();
      if(state && state.keys) state.keys.up = 0; 
    }
    StatePlay.prototype.downOff = function() { 
      var state = g.currentState();
      if(state && state.keys) state.keys.down = 0; 
    }
    StatePlay.prototype.rightOff = function() { 
      var state = g.currentState();
      if(state && state.keys) state.keys.right = 0; 
    }
    StatePlay.prototype.leftOff = function() { 
      var state = g.currentState();
      if(state && state.keys) state.keys.left = 0; 
    }
  
    StatePlay.prototype.keydown = function( e: any ) {
      var keyCode = ( e.keyCode ? e.keyCode : e.which );
      if( [37, 38, 39, 40, 65, 68, 83, 87].indexOf( keyCode ) === -1 ) return;
      e.preventDefault();
      var _this = g.currentState();
      if(!_this) return;
      if( keyCode === 38 || keyCode === 87 ) { _this.upOn && _this.upOn(); }
      if( keyCode === 39 || keyCode === 68 ) { _this.rightOn && _this.rightOn(); }
      if( keyCode === 40 || keyCode === 83 ) { _this.downOn && _this.downOn(); }
      if( keyCode === 37 || keyCode === 65 ) { _this.leftOn && _this.leftOn(); }
    };
  
    StatePlay.prototype.bindEvents = function() {
      var _this = g.currentState();
      window.addEventListener( 'keydown', _this.keydown, false );
      window.addEventListener( 'resize', _this.resize, false );
    };
  
    StatePlay.prototype.resetSnake = function() {
      // remove old snake DOM elements and clear grid
      var i = this.snake.tiles.length;
      while( i-- ) {
        this.grid.set( this.snake.tiles[ i ].col, this.snake.tiles[ i ].row, 'empty' );
        if( this.snake.tiles[ i ].elem.parentNode ) {
          this.stageElem.removeChild( this.snake.tiles[ i ].elem );
        }
      }

      // random start position with room for 5 tiles eastward
      var startCol = g.util.randInt( 4, this.cols - 1 );
      var startRow = g.util.randInt( 0, this.rows - 1 );

      // reset snake state
      this.snake.tiles = [];
      this.snake.dir = 'e';
      this.snake.currDir = 'e';
      this.snake.deathFlag = 0;
      this.snake.movesSinceEat = 0;
      this.snake.updateTick = 10;
      this.snake.updateTickMax = 10;

      for( var j = 0; j < 5; j++ ) {
        this.snake.tiles.push( new g.SnakeTile({
          parentState: this,
          parentGroup: this.snake.tiles,
          col: startCol - j,
          row: startRow,
          x: ( startCol - j ) * this.tileWidth,
          y: startRow * this.tileHeight,
          w: this.tileWidth - this.spacing,
          h: this.tileHeight - this.spacing
        }));
      }

      // sync grid
      var k = this.snake.tiles.length;
      while( k-- ) {
        this.grid.set( this.snake.tiles[ k ].col, this.snake.tiles[ k ].row, 'snake' );
      }

      // recreate food
      if( this.food && this.food.tile.elem.parentNode ) {
        this.stageElem.removeChild( this.food.tile.elem );
      }
      this.food = new g.Food({ parentState: this });
    };

    StatePlay.prototype.step = function() {
      if(!this.boardTiles || !this.snake || !this.food || !this.time) return;
      this.boardTiles.each( 'update' );
      this.boardTiles.each( 'render' );
      this.snake.update();
      this.snake.render();
      this.food.update();
      this.food.render();
      this.time.update();
    };
  
    StatePlay.prototype.exit = function() {
      window.removeEventListener( 'keydown', this.keydown, false );
      window.removeEventListener( 'resize', this.resize, false );
      if(this.stageElem) {
        this.stageElem.innerHTML = '';
      }
      if(this.grid) {
        this.grid.tiles = null;
      }
      this.time = null;
    };
  
    g.addState( new StatePlay() );
  
  })();
  
  /*================================================
  
  Game
  
  ================================================*/
  
  (function(){ 'use strict';
  
    g.config = {
      title: 'Snakely',
      debug: window.location.hash == '#debug' ? 1 : 0,
      state: 'play'
    };
  
    g.setState( g.config.state );
  
    g.time = new g.Time();
  
    g.step = function() {
      requestAnimationFrame( g.step );
      if(g.states && g.state && g.states[ g.state ] && g.states[ g.state ].step) {
        g.states[ g.state ].step();
      }
      if(g.time && g.time.update) {
        g.time.update();
      }
    };
  
    g.step();
  
  })();

    // Cleanup on unmount
    return () => {
      if (g.step) {
        g.step = function() {};
      }
      if (g.states && g.state && g.states[g.state] && g.states[g.state].exit) {
        g.states[g.state].exit();
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className="snake-game-container" data-vertical={vertical ? 'true' : 'false'} data-autoplay={autoPlay ? 'true' : 'false'}>
      <div className="snake-score"></div>
      <div className="snake-stage"></div>
    </div>
  );
}
