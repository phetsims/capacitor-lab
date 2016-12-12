// Copyright 2015, University of Colorado Boulder

/**
 * Bulb Node.  Bulb is composed of a image at the base, and the bulb and filament are drawn.
 * Bulb brightness is a function of the current running through the bulb.
 *
 * NOTE: This code is borrowed directly from Faraday's Law.  LightBulbNode is still being generalized, see
 * https://github.com/phetsims/scenery-phet/issues/170.
 *
 * @author Vasily Shakhov (MLearner)
 * @author John Blanco
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var TandemNode = require( 'TANDEM/scenery/nodes/TandemNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // images
  var bulbBaseImage = require( 'mipmap!CAPACITOR_LAB_BASICS/light-bulb-base.png' );

  // constants
  var BULB_HEIGHT = 130;
  var BULB_WIDTH = 65;
  var BULB_BASE_WIDTH = 42;
  var NUM_FILAMENT_ZIG_ZAGS = 8;
  var FILAMENT_ZIG_ZAG_SPAN = 8;

  // debugging
  var DEBUG_SHAPES = false;

  /**
   * Constructor for a BulbNode.
   *
   * @param {LightBulb} lightBulb
   * @param voltageProperty - voltage across the terminals of the lightbulb, determines brightness
   * @param {Property.<string>} circuitConnectionProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function BulbNode( lightBulb, voltageProperty, circuitConnectionProperty, tandem, options ) {

    TandemNode.call( this, {
      tandem: tandem
    } );
    var self = this;

    this.bulb = drawBulbNode( options );
    this.addChild( this.bulb );

    // NOTE: this map deviates from the the bulb in faradays-law
    var bulbBrightnessMap = new LinearFunction( 0, 5E-13, 0, 300, true );

    var updateBrightnessScale = function( voltage ) {
      if ( circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED ) {
        var targetScaleFactor = bulbBrightnessMap( Math.abs( lightBulb.getCurrent( voltage ) ) );
        if ( targetScaleFactor < 0.1 ) {
          self.bulb.haloNode.visible = false;
        }
        else {
          self.bulb.haloNode.visible = true;
          var scale = targetScaleFactor / self.bulb.haloNode.transform.matrix.scaleVector.x;
          self.bulb.haloNode.scale( scale );
        }
      }

      // Light bulb is not connected to the circuit, so no current can flow through it.
      else {
        self.bulb.haloNode.visible = false;
      }
    };

    // Update the halo as the needle angle changes.
    voltageProperty.link( function( voltage ) {
      updateBrightnessScale( voltage );
    } );

    // make sure that the light bulb turns off instantly when disconnected from capacitor.
    circuitConnectionProperty.link( function( circuitConnection ) {
      updateBrightnessScale( voltageProperty.value );
    } );

    if ( DEBUG_SHAPES ) {
      // for debugging, visualize the shape of the base
      var bulbShape = new Path( lightBulb.shapeCreator.createBaseShape(), { stroke: 'red', lineWidth: 2 } );
      this.addChild( bulbShape );
    }
  }

  capacitorLabBasics.register( 'BulbNode', BulbNode );

  inherit( TandemNode, BulbNode, {}, {

    /**
     * Create a bulb node icon.  This creates a node that is not linked to any model properties.
     *
     * @param {Object} options
     */
    createBulbIcon: function( options ) {
      return drawBulbNode( options );
    }
  } );

  /**
   * Create the visual components for a bulbNode with a base, bulb, filament and halo.
   * The halo is made public so that the BulbNode can change its size as a representation
   * of brightness.
   *
   * @param  {Object} options
   * @returns {Node}
   * @private
   */
  function drawBulbNode( options ) {

    var iconNode = new Node( options );

    // Create the base of the bulb
    var bulbBase = new Image( bulbBaseImage );
    bulbBase.scale( BULB_BASE_WIDTH / bulbBase.bounds.height );

    // Important Note: For the drawing code below, the reference frame is assumed to be such that the point x=0, y=0 is
    // at the left side of the light bulb base, which is also the right side of the light bulb body, and the vertical
    // center of both.  This was the easiest to work with.

    // Create the bulb body.
    var bulbNeckWidth = BULB_BASE_WIDTH * 0.85;
    var bulbBodyHeight = BULB_HEIGHT - bulbBase.bounds.width;
    var controlPointYValue = BULB_WIDTH * 0.7;
    var bulbShape = new Shape().moveTo( 0, -bulbNeckWidth / 2 ).cubicCurveTo( -bulbBodyHeight * 0.33, -controlPointYValue, -bulbBodyHeight * 0.95, -controlPointYValue, -bulbBodyHeight, 0 ).cubicCurveTo( -bulbBodyHeight * 0.95, controlPointYValue, -bulbBodyHeight * 0.33,
      controlPointYValue, 0, bulbNeckWidth / 2 );
    var bulbBodyOutline = new Path( bulbShape, {
      stroke: 'black',
      lineCap: 'round'
    } );
    var bulbBodyFill = new Path( bulbShape, {
      fill: new RadialGradient( bulbBodyOutline.centerX, bulbBodyOutline.centerY, BULB_WIDTH / 10, bulbBodyOutline.centerX,
        bulbBodyOutline.centerY, BULB_WIDTH / 2 ).addColorStop( 0, '#eeeeee' ).addColorStop( 1, '#bbccbb' )
    } );

    // Create the filament support wires.
    var filamentWireHeight = bulbBodyHeight * 0.6;
    var filamentTopPoint = new Vector2( -filamentWireHeight, -BULB_WIDTH * 0.3 );
    var filamentBottomPoint = new Vector2( -filamentWireHeight, BULB_WIDTH * 0.3 );
    var filamentSupportWiresShape = new Shape();
    filamentSupportWiresShape.moveTo( 0, -BULB_BASE_WIDTH * 0.3 );
    filamentSupportWiresShape.cubicCurveTo( -filamentWireHeight * 0.3, -BULB_BASE_WIDTH * 0.3, -filamentWireHeight * 0.4, filamentTopPoint.y, filamentTopPoint.x, filamentTopPoint.y );
    filamentSupportWiresShape.moveTo( 0, BULB_BASE_WIDTH * 0.3 );
    filamentSupportWiresShape.cubicCurveTo( -filamentWireHeight * 0.3, BULB_BASE_WIDTH * 0.3, -filamentWireHeight * 0.4, filamentBottomPoint.y, filamentBottomPoint.x, filamentBottomPoint.y );
    var filamentSupportWires = new Path( filamentSupportWiresShape, { stroke: 'black' } );

    // Create the filament, which is a zig-zag shape.
    var filamentShape = new Shape().moveToPoint( filamentTopPoint );
    for ( var i = 0; i < NUM_FILAMENT_ZIG_ZAGS - 1; i++ ) {
      var yPos = filamentTopPoint.y + ( filamentBottomPoint.y - filamentTopPoint.y ) / NUM_FILAMENT_ZIG_ZAGS * ( i + 1 );
      if ( i % 2 === 0 ) {
        // zig
        filamentShape.lineTo( filamentTopPoint.x + FILAMENT_ZIG_ZAG_SPAN, yPos );
      }
      else {
        // zag
        filamentShape.lineTo( filamentTopPoint.x, yPos );
      }
    }
    filamentShape.lineToPoint( filamentBottomPoint );
    var filament = new Path( filamentShape, { stroke: 'black' } );

    // Create the 'halo' that makes the bulb look like it is shining.
    // @public
    iconNode.haloNode = new Node();
    iconNode.haloNode.addChild( new Circle( 5, {
      fill: 'white',
      opacity: 0.46
    } ) );
    iconNode.haloNode.addChild( new Circle( 3.75, {
      fill: 'white',
      opacity: 0.51
    } ) );
    iconNode.haloNode.addChild( new Circle( 2, {
      fill: 'white'
    } ) );

    // Add the children in the order needed to get the desired layering
    iconNode.addChild( bulbBodyFill );
    iconNode.addChild( filamentSupportWires );
    iconNode.addChild( filament );
    iconNode.addChild( iconNode.haloNode );
    iconNode.addChild( bulbBase );
    iconNode.addChild( bulbBodyOutline );

    // Do some last layout
    bulbBase.centerY = 0;
    bulbBase.left = 0;
    iconNode.haloNode.center = filament.center;
    iconNode.haloNode.visible = false;

    iconNode.rotate( Math.PI );

    return iconNode;
  }

  return BulbNode;
} );
