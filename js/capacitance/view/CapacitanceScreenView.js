// Copyright 2015-2017, University of Colorado Boulder

/**
 * "Capacitance" ScreenView for Capacitor Lab Basics.  Assembles the view from a CapacitanceCircuit and
 * panels.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var CapacitanceBarMeterPanel = require( 'CAPACITOR_LAB_BASICS/capacitance/view/CapacitanceBarMeterPanel' );
  var CapacitanceCircuitNode = require( 'CAPACITOR_LAB_BASICS/capacitance/view/CapacitanceCircuitNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBViewControlPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/CLBViewControlPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var VoltmeterToolBoxPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/VoltmeterToolBoxPanel' );

  // constants
  var BAR_METER_PANEL_OFFSET = new Vector2( 0, 60 ); // Sign of x offset is reversed
  var DEBUG_SHAPES = false;

  /**
   * @constructor
   * @param {CLBModel} model
   * @param {Tandem} tandem
   */
  function CapacitanceScreenView( model, tandem ) {

    ScreenView.call( this, { tandem: tandem } );

    // @private {CLBModelViewTransform3D}
    this.modelViewTransform = model.modelViewTransform;

    // @private {CLBModel}
    this.model = model;

    // circuit
    var capacitanceCircuitNode = new CapacitanceCircuitNode( model, tandem.createTandem( 'capacitanceCircuitNode' ) );

    // meters
    var voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform, model.voltmeterVisibleProperty, tandem.createTandem( 'voltmeterNode' ) );
    var voltmeterToolBoxPanel = new VoltmeterToolBoxPanel( voltmeterNode, this.modelViewTransform,
      model.voltmeter.inUserControlProperty, model.voltmeterVisibleProperty, tandem.createTandem( 'voltmeterToolBox' ) );

    // control
    var viewControlPanel = new CLBViewControlPanel( model, tandem.createTandem( 'viewControlPanel' ), {
      maxTextWidth: this.layoutBounds.width - capacitanceCircuitNode.right
    } );
    viewControlPanel.translation = this.layoutBounds.rightTop.minusXY( viewControlPanel.width + 10, -10 );
    voltmeterToolBoxPanel.rightTop = viewControlPanel.rightBottom.plusXY( 0, 20 );

    var capacitanceBarMeterPanel = new CapacitanceBarMeterPanel( model, 0.75 * capacitanceCircuitNode.width,
      tandem.createTandem( 'capacitanceBarMeterPanel' ) );
    capacitanceBarMeterPanel.leftBottom = capacitanceCircuitNode.topWireNode.leftTop.minus( BAR_METER_PANEL_OFFSET );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      bottom: this.layoutBounds.bottom - 20,
      right: this.layoutBounds.right - 30,
      radius: 25,
      touchAreaDilation: 20,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // rendering order
    this.addChild( capacitanceCircuitNode );
    this.addChild( capacitanceBarMeterPanel );
    this.addChild( viewControlPanel );
    this.addChild( voltmeterToolBoxPanel );
    this.addChild( voltmeterNode );
    this.addChild( resetAllButton );

    // debug shapes for probe collision testing
    if ( DEBUG_SHAPES ) {
      var topTerminalNode = new Path(
        model.circuit.battery.shapeCreator.createPositiveTerminalShapeBody( model.circuit.battery.location ), {
          fill: 'rgba( 1, 0, 0, 0.5 )'
        } );
      this.addChild( topTerminalNode );
      // add a shape at the tip of the probe for debugging probe tip collisions.
      this.addChild( new Path( model.voltmeter.shapeCreator.getPositiveProbeTipShape(), {
        fill: 'rgba( 1, 0, 0, 0.5 )'
      } ) );
      this.addChild( new Path( model.voltmeter.shapeCreator.getNegativeProbeTipShape(), {
        fill: 'rgba( 1, 0, 0, 0.5 )'
      } ) );
    }
  }

  capacitorLabBasics.register( 'CapacitanceScreenView', CapacitanceScreenView );

  return inherit( ScreenView, CapacitanceScreenView );
} );
