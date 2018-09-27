// Copyright 2015-2017, University of Colorado Boulder

/**
 * Control panel for view elements in Capacitor Lab: Basics.  Controls the visibility of plate charges, current
 * indicators, electric field and values.  This set of controls is used in both the 'light-bulb' and 'capacitance'
 * screens.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var CHECK_BOX_FONT = new PhetFont( 16 );

  // strings
  var barGraphsString = require( 'string!CAPACITOR_LAB_BASICS/barGraphs' );
  var conventionalString = require( 'string!CAPACITOR_LAB_BASICS/conventional' );
  var currentDirectionString = require( 'string!CAPACITOR_LAB_BASICS/currentDirection' );
  var electricFieldString = require( 'string!CAPACITOR_LAB_BASICS/electricField' );
  var electronsString = require( 'string!CAPACITOR_LAB_BASICS/electrons' );
  var plateChargesString = require( 'string!CAPACITOR_LAB_BASICS/plateCharges' );

  /**
   * @constructor
   *
   * @param {CLBModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   */
  function CLBViewControlPanel( model, tandem, options ) {

    options = _.extend( {
      maxTextWidth: 250,
      alignGroup:null
    }, options );

    var checkboxItems = [ {
      string: plateChargesString,
      property: model.plateChargesVisibleProperty,
      tandem: tandem.createTandem( 'plateChargesCheckbox' )
    }, {
      string: barGraphsString,
      property: model.barGraphsVisibleProperty,
      tandem: tandem.createTandem( 'barGraphsCheckbox' )
    }, {
      string: electricFieldString,
      property: model.electricFieldVisibleProperty,
      tandem: tandem.createTandem( 'electricFieldCheckbox' )
    }, {
      string: currentDirectionString,
      property: model.currentVisibleProperty,
      tandem: tandem.createTandem( 'currentCheckbox' )
    } ];

    var viewCheckboxItems = checkboxItems.map( function( item ) {
      return {
        node: new Text( item.string, {
          font: CHECK_BOX_FONT,
          maxWidth: options.maxTextWidth
        } ),
        property: item.property,
        label: item.string,
        tandem: item.tandem
      };
    } );

    var currentTypeRadioButtonGroup = new VerticalAquaRadioButtonGroup( [
      {
        node: new Text( electronsString, {
          font: CHECK_BOX_FONT,
          maxWidth: options.maxTextWidth
        } ),
        property: model.currentOrientation,
        value: 0,
        tandemName: 'electronsRadioButton'
      },
      {
        node: new Text( conventionalString, {
          font: CHECK_BOX_FONT,
          maxWidth: options.maxTextWidth
        } ),
        property: model.currentOrientation,
        value: Math.PI,
        tandemName: 'conventionalRadioButton'
      }
    ], {
      spacing: 5,
      touchAreaXDilation: 5,
      tandem: tandem.createTandem( 'currentTypeRadioButtonGroup' )
    } );

    var verticalCheckboxGroup = new VerticalCheckboxGroup( viewCheckboxItems, {
      checkboxOptions: {
        // The box is as wide as the largest item is tall
        boxWidth: viewCheckboxItems[ 0 ].node.height
      }
    } );

    var optionsNode = new Node( { children: [ verticalCheckboxGroup, currentTypeRadioButtonGroup ] } );

    currentTypeRadioButtonGroup.leftTop = new Vector2( verticalCheckboxGroup.left + 25, verticalCheckboxGroup.bottom + 10 );

    // {Node|AlignBox}
    var content = options.alignGroup ? new AlignBox( optionsNode, { group: options.alignGroup ,xAlign:'left'} ) : optionsNode;

    Panel.call( this, content, {
      xMargin: 10,
      yMargin: 10,
      align:'left',
      minWidth:175,
      fill: CLBConstants.METER_PANEL_FILL,
      tandem: tandem
    } );
  }

  capacitorLabBasics.register( 'CLBViewControlPanel', CLBViewControlPanel );

  return inherit( Panel, CLBViewControlPanel );
} );
