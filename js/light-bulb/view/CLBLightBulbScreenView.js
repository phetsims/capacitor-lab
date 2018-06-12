// Copyright 2015-2017, University of Colorado Boulder

/**
 * ScreenView for "Light Bulb" screen of Capacitor Lab: Basics.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BarMeterPanel = require( 'CAPACITOR_LAB_BASICS/common/view/BarMeterPanel' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBViewControlPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/CLBViewControlPanel' );
  var DebugLayer = require( 'CAPACITOR_LAB_BASICS/common/view/DebugLayer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightBulbCircuitNode = require( 'CAPACITOR_LAB_BASICS/light-bulb/view/LightBulbCircuitNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var TimeControlNode = require( 'SCENERY_PHET/TimeControlNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var VoltmeterToolboxPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/VoltmeterToolboxPanel' );

  /**
   * @constructor
   *
   * @param {CLBLightBulbModel} model
   * @param {Tandem} tandem
   */
  function CLBLightBulbScreenView( model, tandem ) {

    ScreenView.call( this, { tandem: tandem } );

    // @private {CLBModelViewTransform3D}
    this.modelViewTransform = model.modelViewTransform;

    // @private {CLBLightBulbModel}
    this.model = model;

    // Circuit
    var lightBulbCircuitNode = new LightBulbCircuitNode( model, tandem.createTandem( 'lightBulbCircuitNode' ) );

    // meters
    var barMeterPanel = new BarMeterPanel( model, tandem.createTandem( 'barMeterPanel' ) );
    var voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform, model.voltmeterVisibleProperty,
      tandem.createTandem( 'voltmeterNode' ) );
    var voltmeterToolbox = new VoltmeterToolboxPanel(
      voltmeterNode,
      this.modelViewTransform,
      model.voltmeter.isDraggedProperty,
      model.voltmeterVisibleProperty,
      tandem.createTandem( 'voltmeterToolbox' )
    );

    // View control panel and voltmeter panel
    var viewControlPanel = new CLBViewControlPanel( model, tandem.createTandem( 'viewControlPanel' ), {
      maxTextWidth: 200
    } );
    viewControlPanel.rightTop = this.layoutBounds.rightTop.plus( new Vector2( -10, 10 ) );
    voltmeterToolbox.rightTop = viewControlPanel.rightBottom.plus( new Vector2( 0, 10 ) );

    // Circuit bar meter panel
    barMeterPanel.left = lightBulbCircuitNode.topWireNode.left - 40;
    barMeterPanel.top = this.layoutBounds.top + 10;

    var timeControlNode = new TimeControlNode( model.isPlayingProperty, model.isSlowMotionProperty, {
      stepCallback: function() {
        model.manualStep();
      },
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      radius: 25,
      touchAreaDilation: 20,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // rendering order
    this.addChild( lightBulbCircuitNode );
    this.addChild( barMeterPanel );
    this.addChild( viewControlPanel );
    this.addChild( voltmeterToolbox );
    this.addChild( voltmeterNode );
    this.addChild( new HBox( {
      children: [
        timeControlNode,
        resetAllButton
      ],
      spacing: 50,
      bottom: this.layoutBounds.bottom - 20,
      right: this.layoutBounds.right - 30
    } ) );
    this.addChild( new DebugLayer( model ) );
  }

  capacitorLabBasics.register( 'CLBLightBulbScreenView', CLBLightBulbScreenView );

  return inherit( ScreenView, CLBLightBulbScreenView );
} );
