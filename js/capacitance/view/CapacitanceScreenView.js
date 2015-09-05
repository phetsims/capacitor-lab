// Copyright 2002-2015, University of Colorado Boulder5

/**
 * "Intro" ScreenView for Capacitor Lab Basics.
 *
 * This this extension of ScreenView is a direct port of DielectricCanvas of Capacitor Lab without dielectrics.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var CapacitanceCircuitNode = require( 'CAPACITOR_LAB_BASICS/capacitance/view/CapacitanceCircuitNode' );
  var BarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarMeterNode' );
  var CapacitorLabBasicsViewControl = require( 'CAPACITOR_LAB_BASICS/common/view/control/CapacitorLabBasicsViewControl' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Path = require( 'SCENERY/nodes/Path' );

  // constants
  var DEBUG_SHAPES = false;

  // Strings
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );

  /**
   * @param {CapacitorLabBasicsModel} model
   * @constructor
   */
  function CapacitanceScreenView( model ) {

    ScreenView.call( this );

    this.modelViewTransform = model.modelViewTransform;

    this.model = model;

    // Maxima, for calibrating various view representations.
    var maxPlateCharge = model.getMaxPlateCharge();
    //var maxExcessDielectricPlateCharge = model.getMaxExcessDielectricPlateCharge();
    var maxEffectiveEField = model.getMaxEffectiveEField();
    //var eFieldReferenceMagnitude = model.getEFieldReferenceMagnitude();

    // circuit
    var capacitanceCircuitNode = new CapacitanceCircuitNode( model.circuit, this.modelViewTransform, model.plateChargesVisibleProperty,
      model.eFieldVisibleProperty, model.valuesVisibleProperty, maxPlateCharge, maxEffectiveEField );

    // meters
    var capacitanceMeterNode = new BarMeterNode.CapacitanceMeterNode( model.capacitanceMeter, this.modelViewTransform, capacitanceString );
    var voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform );

    // control
    // TODO: Layout calculations are messy, come back soon to clean up.
    var minWidth = this.right - capacitanceMeterNode.left;
    //var capacitanceControlPanel = new CapacitanceControlPanel( model, minWidth );
    var capacitanceViewControl = new CapacitorLabBasicsViewControl( model, minWidth );
    capacitanceViewControl.translation = this.layoutBounds.rightTop.minusXY( capacitanceViewControl.width + 10, -10 );

    capacitanceMeterNode.rightTop = capacitanceViewControl.leftTop.minusXY( 15, 0 );

    // reset button
    this.resetAllButton = new ResetAllButton( {
      listener: function() { model.reset(); },
      bottom: this.layoutBounds.bottom - 20,
      right: this.layoutBounds.right - 30,
      radius: 25
    } );

    // rendering order
    this.addChild( capacitanceCircuitNode );
    this.addChild( capacitanceMeterNode );
    this.addChild( voltmeterNode );
    this.addChild( capacitanceViewControl );
    this.addChild( this.resetAllButton );

    // debug shapes for probe collision testing, to be removed soon
    if ( DEBUG_SHAPES ) {
      var topTerminalNode = new Path( model.circuit.battery.shapeCreator.createPositiveTerminalShapeBody( model.circuit.battery.location ), {
        fill: 'rgba( 1, 0, 0, 0.5 )'
      } );
      this.addChild( topTerminalNode );
      // add a shape at the tip of the probe for debugging probe tip collisions.
      this.addChild( new Path( model.voltmeter.shapeCreator.getPositiveProbeTipShape(), {
          fill: 'rgba( 1, 0, 0, 0.5 )'
        } )
      );
      this.addChild( new Path( model.voltmeter.shapeCreator.getNegativeProbeTipShape(), {
          fill: 'rgba( 1, 0, 0, 0.5 )'
        } )
      );
    }
  }

  return inherit( ScreenView, CapacitanceScreenView );
} );