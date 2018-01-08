// Copyright 2015-2017, University of Colorado Boulder

/**
 * Configuration information for a circuit. This is purely a data structure, whose purpose is to reduce the number of
 * parameters required in constructors and creation methods.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );

  // Constants with default assignments
  var CAPACITOR_X_SPACING = 0.024; // meters
  var CAPACITOR_Y_SPACING = 0; // meters
  var PLATE_WIDTH = CLBConstants.PLATE_WIDTH_RANGE.defaultValue;
  var PLATE_SEPARATION = CLBConstants.PLATE_SEPARATION_RANGE.defaultValue;
  var WIRE_EXTENT = 0.016; // how far the wire extends above or below the capacitor (meters)

  var CircuitConfig = {
    /**
     * Returns the default circuit config, overridden with any options.
     * @public
     *
     * @param {Object}
     * @returns {Object}
     */
    create: function( options ) {

      return _.extend( {
        modelViewTransform: new CLBModelViewTransform3D(),
        capacitorXSpacing: CAPACITOR_X_SPACING,
        capacitorYSpacing: CAPACITOR_Y_SPACING,
        plateWidth: PLATE_WIDTH,
        plateSeparation: PLATE_SEPARATION,
        wireExtent: WIRE_EXTENT,

        // Type: {Array.<CircuitState>})
        circuitConnections: [
          CircuitState.BATTERY_CONNECTED,
          CircuitState.OPEN_CIRCUIT,
          CircuitState.LIGHT_BULB_CONNECTED
        ]
      }, options );

    }
  };

  capacitorLabBasics.register( 'CircuitConfig', CircuitConfig );

  return CircuitConfig;

} );
