// Copyright 2002-2015, University of Colorado Boulder

/**
 * Intro screen for the Capacitor Lab Basics sim.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var CapacitorLabBasicsIntroModel = require( 'CAPACITOR_LAB_BASICS/intro/model/CapacitorLabBasicsIntroModel' );
  var CapacitorLabBasicsIntroScreenView = require( 'CAPACITOR_LAB_BASICS/intro/view/CapacitorLabBasicsIntroScreenView' );
  var CLModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLModelViewTransform3D' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var capacitorLabBasicsCapacitanceTitle = require( 'string!CAPACITOR_LAB_BASICS/capacitance.title' );

  /**
   * @constructor
   */
  function CapacitorLabBasicsIntroScreen() {

    // TODO: Icons need to be created for this sim.
    var icon = new Rectangle( 0, 0, 548, 373, { fill: 'red' } );

    Screen.call( this, capacitorLabBasicsCapacitanceTitle, icon,
      function() { return new CapacitorLabBasicsIntroModel( new CLModelViewTransform3D() ); },
      function( model ) { return new CapacitorLabBasicsIntroScreenView( model ); },
      { backgroundColor: 'rgb( 236, 255, 245 )'}
    );

  }

  return inherit( Screen, CapacitorLabBasicsIntroScreen );
} );