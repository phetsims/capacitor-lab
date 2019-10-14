// Copyright 2015-2019, University of Colorado Boulder

/**
 * Simple model of a DC battery.  Origin is at the geometric center of the battery's body.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BatteryShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/BatteryShapeCreator' );
  const CapacitorConstants = require( 'SCENERY_PHET/capacitor/CapacitorConstants' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const PropertyIO = require( 'AXON/PropertyIO' );
  const StringIO = require( 'TANDEM/types/StringIO' );
  const Vector3 = require( 'DOT/Vector3' );

  // constants
  // size of the associated image file, determined by visual inspection
  const BODY_SIZE = new Dimension2( 0.0065, 0.01425 ); // dimensions of the rectangle that bounds the battery image

  /*
   * Positive terminal is part of the image file.
   * The terminal is a cylinder, whose dimensions were determined by visual inspection.
   * The origin of the terminal is at the center of the cylinder's top.
   */
  const POSITIVE_TERMINAL_ELLIPSE_SIZE = new Dimension2( 0.0025, 0.0005 );
  const POSITIVE_TERMINAL_CYLINDER_HEIGHT = 0.0009;
  const POSITIVE_TERMINAL_Y_OFFSET = -( BODY_SIZE.height / 2 ) - 0.00012;

  /*
   * Negative terminal is part of the image file.
   * The terminal is an ellipse, whose dimension were determined by visual inspection.
   * The origin of the terminal is at the center of the ellipse.
   */
  const NEGATIVE_TERMINAL_ELLIPSE_SIZE = new Dimension2( 0.0035, 0.0009 ); // Ellipse axes defining the negative terminal
  const NEGATIVE_TERMINAL_Y_OFFSET = -( BODY_SIZE.height / 2 ) + 0.0006; // center of negative terminal when at the top

  /**
   * @constructor
   *
   * @param {Vector3} location
   * @param {number} voltage
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Tandem} tandem
   */
  function Battery( location, voltage, modelViewTransform, tandem ) {
    assert && assert( location instanceof Vector3 );

    // @public {Property.<number>}
    this.voltageProperty = new NumberProperty( voltage, {
      tandem: tandem.createTandem( 'voltageProperty' ),
      units: 'volts',
      range: CLBConstants.BATTERY_VOLTAGE_RANGE
    } );

    // Value type: enumeration (string)
    // @public {Property.<string>} - 'POSITIVE' or 'NEGATIVE'
    this.polarityProperty = new Property( CapacitorConstants.POLARITY.POSITIVE, {
      validValues: CapacitorConstants.POLARITY.VALUES,
      tandem: tandem.createTandem( 'polarityProperty' ),
      phetioType: PropertyIO( StringIO )
    } );

    const self = this;

    // @public {Dimension2}
    this.positiveTerminalEllipseSize = POSITIVE_TERMINAL_ELLIPSE_SIZE;
    this.negativeTerminalEllipseSize = NEGATIVE_TERMINAL_ELLIPSE_SIZE;

    // @public {number}
    this.positiveTerminalCylinderHeight = POSITIVE_TERMINAL_CYLINDER_HEIGHT;

    // @public {Vector3}
    this.location = location; // @public (read-only)
    this.shapeCreator = new BatteryShapeCreator( this, modelViewTransform ); // @private

    // @private {Shape}
    this.positiveTerminalShape = this.shapeCreator.createPositiveTerminalShape();
    this.negativeTerminalShape = this.shapeCreator.createNegativeTerminalShape();

    this.voltageProperty.link( function() {
      self.polarityProperty.set( self.getPolarity( self.voltageProperty.value ) );
    } );
  }

  capacitorLabBasics.register( 'Battery', Battery );

  return inherit( Object, Battery, {

    /**
     * Convenience function to get the polarity from the object literal based on the voltage.
     * @private
     *
     * @param {number} voltage
     * @returns {string}
     */
    getPolarity: function( voltage ) {
      return ( voltage >= 0 ) ? CapacitorConstants.POLARITY.POSITIVE : CapacitorConstants.POLARITY.NEGATIVE;
    },

    /**
     * Determine if the probe tip shape contacts a battery terminal.
     * Since the bottom terminal is hidden in the 3D perspective, there is only
     * one contact region to check, which is the top terminal.
     * @public
     *
     * @param {Shape} probe - voltmeter probe tip shape
     * @returns {boolean}
     */
    contacts: function( probe ) {
      let shape;
      if ( this.polarityProperty.value === CapacitorConstants.POLARITY.POSITIVE ) {
        shape = this.positiveTerminalShape;
      }
      else {
        shape = this.negativeTerminalShape;
      }
      return probe.bounds.intersectsBounds( shape.bounds ) &&
             probe.shapeIntersection( shape ).getNonoverlappingArea() > 0;
    },

    /**
     * Gets the offset of the bottom terminal from the battery's origin, in model coordinates (meters).
     * We don't need to account for the polarity since the bottom terminal is never visible.
     * @public
     *
     * @returns {number}
     */
    getBottomTerminalYOffset: function() {
      return BODY_SIZE.height / 2;
    },

    /**
     * Gets the offset of the top terminal from the battery's origin, in model coordinates (meters).
     * This offset depends on the polarity.
     * @public
     *
     * @returns {number}
     */
    getTopTerminalYOffset: function() {
      if ( this.polarityProperty.value === CapacitorConstants.POLARITY.POSITIVE ) {
        return POSITIVE_TERMINAL_Y_OFFSET;
      }
      else {
        return NEGATIVE_TERMINAL_Y_OFFSET;
      }
    },

    // @public
    reset: function() {
      this.voltageProperty.reset();
      this.polarityProperty.reset();
    }
  } );
} );
