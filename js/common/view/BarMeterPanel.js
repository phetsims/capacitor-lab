// Copyright 2015-2019, University of Colorado Boulder

/**
 * Panel which holds the bar meters and associated checkboxes which control bar meter visibility.
 *
 * This panel uses several layout boxes to achieve the desired alignment.  The meter value nodes are aligned to the
 * right while the bar meters are aligned to the left.  The checkboxes are also aligned to the left.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarMeterNode' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const Checkbox = require( 'SUN/Checkbox' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlateChargeBarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/PlateChargeBarMeterNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const CHECKBOX_VERTICAL_SPACING = 28;
  const VALUE_FONT = new PhetFont( 16 );
  const VALUE_COLOR = 'black';

  // strings
  const capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );
  const picoCoulombsPatternString = require( 'string!CAPACITOR_LAB_BASICS/picoCoulombsPattern' );
  const picoFaradsPatternString = require( 'string!CAPACITOR_LAB_BASICS/picoFaradsPattern' );
  const picoJoulesPatternString = require( 'string!CAPACITOR_LAB_BASICS/picoJoulesPattern' );
  const storedEnergyString = require( 'string!CAPACITOR_LAB_BASICS/storedEnergy' );
  const topPlateChargeString = require( 'string!CAPACITOR_LAB_BASICS/topPlateCharge' );

  /**
   * @constructor
   *
   * @param {CLBLightBulbModel} model
   * @param {Tandem} tandem
   */
  function BarMeterPanel( model, tandem ) {

    const self = this;

    const minWidth = 580;

    const parentNode = new Node(); // node that will contain all checkboxes and bar meter nodes

    // create the bar meter nodes with their text values.
    const meterNodes = new Node();

    const capacitanceMeterNode = new BarMeterNode(
      model.capacitanceMeter,
      CLBConstants.CAPACITANCE_COLOR,
      CLBConstants.CAPACITANCE_METER_MAX_VALUE,
      picoFaradsPatternString,
      capacitanceString,
      tandem.createTandem( 'capacitanceMeterNode' ) );

    const plateChargeMeterNode = new PlateChargeBarMeterNode(
      model.plateChargeMeter,
      CLBConstants.POSITIVE_CHARGE_COLOR,
      CLBConstants.PLATE_CHARGE_METER_MAX_VALUE,
      picoCoulombsPatternString,
      topPlateChargeString,
      tandem.createTandem( 'plateChargeMeterNode' ) );

    const storedEnergyMeterNode = new BarMeterNode(
      model.storedEnergyMeter,
      CLBConstants.STORED_ENERGY_COLOR,
      CLBConstants.STORED_ENERGY_METER_MAX_VALUE,
      picoJoulesPatternString,
      storedEnergyString,
      tandem.createTandem( 'storedEnergyMeterNode' ) );

    meterNodes.children = [ capacitanceMeterNode, plateChargeMeterNode, storedEnergyMeterNode ];

    // create checkboxes for each meter node
    const checkboxNodes = new Node();

    // Settings for title strings
    const fontOptions = {
      font: VALUE_FONT,
      fill: VALUE_COLOR,
      maxWidth: 120
    };

    const capacitanceLabel = new Text( capacitanceString, fontOptions );
    const capacitanceCheckbox = new Checkbox( capacitanceLabel, model.capacitanceMeterVisibleProperty, {
      tandem: tandem.createTandem( 'capacitanceCheckbox' )
    } );

    const topPlateChargeLabel = new Text( topPlateChargeString, fontOptions );
    const topPlateChargeCheckbox = new Checkbox( topPlateChargeLabel, model.topPlateChargeMeterVisibleProperty, {
      tandem: tandem.createTandem( 'topPlateChargeCheckbox' )
    } );

    const storedEnergyLabel = new Text( storedEnergyString, fontOptions );
    const storedEnergyCheckbox = new Checkbox( storedEnergyLabel, model.storedEnergyMeterVisibleProperty, {
      tandem: tandem.createTandem( 'storedEnergyCheckbox' )
    } );

    checkboxNodes.children = [ capacitanceCheckbox, topPlateChargeCheckbox, storedEnergyCheckbox ];

    parentNode.children = [ checkboxNodes, meterNodes ];

    // layout
    // checkboxes aligned vertically, centered left
    capacitanceCheckbox.translation = new Vector2( 0, 0 );
    topPlateChargeCheckbox.translation = new Vector2( 0, CHECKBOX_VERTICAL_SPACING );
    storedEnergyCheckbox.translation = new Vector2( 0, 2 * CHECKBOX_VERTICAL_SPACING );

    // The BarMeterNodes have a common x-coordinate
    const x = 0.44 * minWidth;

    let y = capacitanceCheckbox.centerY;
    capacitanceMeterNode.axisLine.translation = new Vector2( x, y );

    y = topPlateChargeCheckbox.centerY;
    plateChargeMeterNode.axisLine.translation = new Vector2( x, y );

    y = storedEnergyCheckbox.centerY;
    storedEnergyMeterNode.axisLine.translation = new Vector2( x, y );

    Panel.call( this, parentNode, {
      fill: CLBConstants.METER_PANEL_FILL,
      minWidth: minWidth,
      align: 'left',
      xMargin: 10,
      yMargin: 10,
      resize: false,
      tandem: tandem
    } );

    // link visibility to the model property
    model.barGraphsVisibleProperty.link( function( barGraphsPanelVisible ) {
      self.visible = barGraphsPanelVisible;
    } );
  }

  capacitorLabBasics.register( 'BarMeterPanel', BarMeterPanel );

  return inherit( Panel, BarMeterPanel );
} );