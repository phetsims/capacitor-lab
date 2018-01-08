// Copyright 2015-2017, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the 3D battery model. Shapes are in the global view coordinate
 * frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  // TODO: Reverse the shapes so they are in the model?
  var BatteryGraphicNode = require( 'CAPACITOR_LAB_BASICS/common/view/BatteryGraphicNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );

  /**
   * @constructor
   *
   * @param {Battery} battery
   * @param {CLBModelViewTransform3D} modelViewTransform
   */
  function BatteryShapeCreator( battery, modelViewTransform ) {
    assert && assert( modelViewTransform instanceof CLBModelViewTransform3D );

    // @public {Battery}
    this.battery = battery;

    // @public {CLBModelViewTransform3D}
    this.modelViewTransform = modelViewTransform;
  }

  capacitorLabBasics.register( 'BatteryShapeCreator', BatteryShapeCreator );

  return inherit( Object, BatteryShapeCreator, {

    /**
    * Creates the shape of the top positive terminal in the world coordinate frame.
    * @public
    *
    * TODO: Battery location doesn't change? Doesn't require recreation every time?
    *
    * @returns {Shape}
    */
    createPositiveTerminalShape: function() {
      var shape = BatteryGraphicNode.POSITIVE_UP.terminalShape;
      shape = shape.transformed( Matrix3.scaling( 0.3 ) );
      var batteryLocation = this.modelViewTransform.modelToViewPosition( this.battery.location );
      shape = shape.transformed( Matrix3.translation( batteryLocation.x - BatteryGraphicNode.POSITIVE_UP.bounds.centerX * 0.3,
                                                      batteryLocation.y - BatteryGraphicNode.POSITIVE_UP.bounds.centerY * 0.3 ) );
      return shape;
    },

    /**
    * Creates the shape of the top negative terminal in the world coordinate frame.
    * @public
    *
    * TODO: Battery location doesn't change? Doesn't require recreation every time?
    *
    * @returns {Shape}
    */
    createNegativeTerminalShape: function() {
      var shape = BatteryGraphicNode.POSITIVE_DOWN.terminalShape;
      shape = shape.transformed( Matrix3.scaling( 0.3 ) );
      var batteryLocation = this.modelViewTransform.modelToViewPosition( this.battery.location );
      shape = shape.transformed( Matrix3.translation( batteryLocation.x - BatteryGraphicNode.POSITIVE_DOWN.bounds.centerX * 0.3,
                                                      batteryLocation.y - BatteryGraphicNode.POSITIVE_DOWN.bounds.centerY * 0.3 ) );
      return shape;
    }
  } );

} );
