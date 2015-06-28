// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model of a lightBulb, used in the Capacitor Lab: Basics sim.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector3 = require( 'DOT/Vector3' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // constants
  var BULB_BASE_SIZE = new Dimension2( 0.0020, 0.001425 );

  /**
   * Constructor for the Capacitor.
   *
   * @param {Vector3} location
   * @param {number} resistance
   * @constructor
   */
  function LightBulb( location, resistance ) {

    // immutable variables.
    this.location = location;
    this.resistance = 1.12E13; // TODO: TEST VALUE.  RESISTANCE IS VERY LARGE FOR AESTHETICS OF BULB FADE OUT TIME.

    PropertySet.call( this, {
      /* Populate with required properties */
    } );
  }
  return inherit( PropertySet, LightBulb, {

    /**
     * The top connection point is the top center of light bulb, which is the center of the
     */
    getTopConnectionPoint: function() {
      return new Vector3( this.location.x, this.location.y, this.location.z );
    },

    getBottomConnectionPoint: function() {
      return new Vector3( this.location.x - BULB_BASE_SIZE.width, this.location.y, this.location.z );
    },

    /**
     * Calculate the current flowing through this lightbulb using Ohm's Law, V = I R
     *
     * @param {number} voltage voltage accrose the resistor
     * @return {number}
     */
    getCurrent: function( voltage ) {
      return voltage / this.resistance;
    }
  }, {

    // Get the size of the bulb base.
    BULB_BASE_SIZE: BULB_BASE_SIZE

  } );
} );