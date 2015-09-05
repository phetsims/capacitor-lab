// Copyright 2002-2015, University of Colorado Boulder

/**
 * Intro screen for the Capacitor Lab Basics sim.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var CapacitanceModel = require( 'CAPACITOR_LAB_BASICS/capacitance/model/CapacitanceModel' );
  var CapacitanceScreenView = require( 'CAPACITOR_LAB_BASICS/capacitance/view/CapacitanceScreenView' );
  var CLModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLModelViewTransform3D' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var capacitorLabBasicsCapacitanceTitle = require( 'string!CAPACITOR_LAB_BASICS/capacitance.title' );

  /**
   * @constructor
   */
  function CapacitanceScreen() {

    // TODO: Icons need to be created for this sim.
    var icon = new Rectangle( 0, 0, 548, 373, { fill: 'red' } );

    Screen.call( this, capacitorLabBasicsCapacitanceTitle, icon,
      function() { return new CapacitanceModel( new CLModelViewTransform3D() ); },
      function( model ) { return new CapacitanceScreenView( model ); },
      { backgroundColor: 'rgb( 151, 208, 255 )' }
    );

  }

  return inherit( Screen, CapacitanceScreen );
} );