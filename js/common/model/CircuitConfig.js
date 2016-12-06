// Copyright 2015, University of Colorado Boulder

/**
 * Configuration information for a circuit. This is purely a data structure, whose purpose is to reduce the number of
 * parameters required in constructors and creation methods.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );

  // Constants with default assignments
  var CAPACITOR_X_SPACING = 0.024; // meters
  var CAPACITOR_Y_SPACING = 0; // meters
  var PLATE_WIDTH = CLBConstants.PLATE_WIDTH_RANGE.defaultValue;
  var PLATE_SEPARATION = CLBConstants.PLATE_SEPARATION_RANGE.defaultValue;
  var WIRE_EXTENT = 0.016; // how far the wire extends above or below the capacitor (meters)
  var LIGHT_BULB_RESISTANCE = 5e12; // Ohms. Artificially large to stretch discharge time

  // constructor
  function CircuitConfig( options ) {

    options = _.extend( {
      modelViewTransform: new CLBModelViewTransform3D(),
      capacitorXSpacing: CAPACITOR_X_SPACING,
      capacitorYSpacing: CAPACITOR_Y_SPACING,
      plateWidth: PLATE_WIDTH,
      plateSeparation: PLATE_SEPARATION,
      wireExtent: WIRE_EXTENT,
      lightBulbResistance: LIGHT_BULB_RESISTANCE, //REVIEW: I don't see this being overridden anywhere, presumably factor it out.

      // Type: {Array.<CircuitConnectionEnum>})
      circuitConnections: [
        CircuitConnectionEnum.BATTERY_CONNECTED,
        CircuitConnectionEnum.OPEN_CIRCUIT,
        CircuitConnectionEnum.LIGHT_BULB_CONNECTED
      ]
    }, options );

    //REVIEW: Call me crazy, but `_.extend( this, { ...defaults... }, options )` would do all of this.
    // @public
    this.modelViewTransform = options.modelViewTransform;
    this.capacitorXSpacing = options.capacitorXSpacing;
    this.capacitorYSpacing = options.capacitorYSpacing;
    this.plateWidth = options.plateWidth;
    this.plateSeparation = options.plateSeparation;
    this.wireExtent = options.wireExtent;
    this.lightBulbResistance = options.lightBulbResistance;
    this.circuitConnections = options.circuitConnections;
  }

  capacitorLabBasics.register( 'CircuitConfig', CircuitConfig );

  //REVIEW: Since it has no prototype, consider CircuitConfig having just a method (CircuitConfig.create( ... )) that returns a plain object.
  return inherit( Object, CircuitConfig );

} );

