// Copyright 2015-2020, University of Colorado Boulder

/**
 * Base model for Capacitor Lab: Basics.  This gets extended by CLBLightBulbModel and CapacitanceModel.
 * This base model holds high level view properties that are shared by both screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import CapacitorConstants from '../../../../scenery-phet/js/capacitor/CapacitorConstants.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import Color from '../../../../scenery/js/util/Color.js';
import ColorIO from '../../../../scenery/js/util/ColorIO.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBConstants from '../CLBConstants.js';
import Voltmeter from './meter/Voltmeter.js';

// constants
// reference coordinate frame size for world nodes
const CANVAS_RENDERING_SIZE = new Dimension2( 1024, 618 );

/**
 * @constructor
 *
 * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
 * @param {YawPitchModelViewTransform3} modelViewTransform
 * @param {Tandem} tandem
 */
function CLBModel( switchUsedProperty, modelViewTransform, tandem ) {

  // @public {Property.<boolean>}
  this.switchUsedProperty = switchUsedProperty;

  // @public {YawPitchModelViewTransform3} (read-only)
  this.modelViewTransform = modelViewTransform;

  // @public {Property.<boolean>}
  this.plateChargesVisibleProperty = new BooleanProperty( true, {
    tandem: tandem.createTandem( 'plateChargesVisibleProperty' )
  } );

  // @public {Property.<boolean>}
  this.electricFieldVisibleProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'electricFieldVisibleProperty' )
  } );

  // @public {Property.<boolean>}
  this.capacitanceMeterVisibleProperty = new BooleanProperty( true, {
    tandem: tandem.createTandem( 'capacitanceMeterVisibleProperty' )
  } );

  // @public {Property.<boolean>}
  this.topPlateChargeMeterVisibleProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'topPlateChargeMeterVisibleProperty' )
  } );

  // @public {Property.<boolean>}
  this.storedEnergyMeterVisibleProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'storedEnergyMeterVisibleProperty' )
  } );

  // @public {Property.<boolean>}
  this.barGraphsVisibleProperty = new BooleanProperty( true, {
    tandem: tandem.createTandem( 'barGraphsVisibleProperty' )
  } );

  // @public {Property.<boolean>}
  this.voltmeterVisibleProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'voltmeterVisibleProperty' )
  } );

  // @public {Property.<boolean>}
  this.currentVisibleProperty = new BooleanProperty( true, {
    tandem: tandem.createTandem( 'currentVisibleProperty' )
  } );

  // @public {Property.<boolean>}
  this.currentOrientationProperty = new NumberProperty( 0, {
    tandem: tandem.createTandem( 'currentOrientationProperty' )
  } );

  // @public {Property.<Color>}
  this.arrowColorProperty = new Property( new Color( 83, 200, 236 ), {
    tandem: tandem.createTandem( 'arrowColorProperty' ),
    phetioType: Property.PropertyIO( ColorIO )
  } );

  // @public {Property.<boolean>} Whether the sim is paused
  this.isPlayingProperty = new BooleanProperty( true, {
    tandem: tandem.createTandem( 'isPlayingProperty' )
  } );

  // @public {Stopwatch}
  this.stopwatch = new Stopwatch( {
    timePropertyOptions: {
      range: Stopwatch.ZERO_TO_ALMOST_SIXTY
    },
    tandem: tandem.createTandem( 'stopwatch' )
  } );

  // @public {Property.<TimeSpeed>}
  this.timeSpeedProperty = new EnumerationProperty( TimeSpeed, TimeSpeed.NORMAL );

  // @public {Emitter}
  this.stepEmitter = new Emitter( { parameters: [ { valueType: 'number' } ] } );

  // @private {Bounds2}
  this.worldBounds = CANVAS_RENDERING_SIZE.toBounds();

  // @public {Voltmeter}
  this.voltmeter = new Voltmeter( this.circuit, this.worldBounds, modelViewTransform, this.voltmeterVisibleProperty, tandem.createTandem( 'voltmeter' ) );

  this.circuit.maxPlateCharge = this.getMaxPlateCharge();
  this.circuit.maxEffectiveEField = this.getMaxEffectiveEField();
}

capacitorLabBasics.register( 'CLBModel', CLBModel );

inherit( Object, CLBModel, {

  /**
   * Compute maximum possible charge on the top plate as
   *
   * Q_max = (epsilon_0 * A_max / d_min) * V_max
   *
   * where A is the plate area, d is the plate separation, and V is the battery voltage.
   * @public
   *
   * @returns {number} charge in Coulombs
   */
  getMaxPlateCharge: function() {

    const maxArea = CapacitorConstants.PLATE_WIDTH_RANGE.max * CapacitorConstants.PLATE_WIDTH_RANGE.max;
    const maxVoltage = CLBConstants.BATTERY_VOLTAGE_RANGE.max;

    return CLBConstants.EPSILON_0 * maxArea * maxVoltage / CapacitorConstants.PLATE_SEPARATION_RANGE.min;
  },

  /**
   * Compute maximum possible E-field in the capacitor as
   *
   * E_max = Q_max / (epsilon_0 * A_min)
   *       = (A_max / A_min) * V_max / d_min
   *
   * where A is the plate area, d is the plate separation, and V is the battery voltage.
   * @public
   *
   * @returns {number} E-field in V/m
   */
  getMaxEffectiveEField: function() {

    const maxArea = CapacitorConstants.PLATE_WIDTH_RANGE.max * CapacitorConstants.PLATE_WIDTH_RANGE.max;
    const minArea = CapacitorConstants.PLATE_WIDTH_RANGE.min * CapacitorConstants.PLATE_WIDTH_RANGE.min;

    return maxArea / minArea * CLBConstants.BATTERY_VOLTAGE_RANGE.max / CapacitorConstants.PLATE_SEPARATION_RANGE.min;
  },

  /**
   * Step function for the CLBModel.
   * @public
   *
   * @param {number} dt
   * @param {boolean} isManual
   */
  step: function( dt, isManual ) {
    if ( this.isPlayingProperty.value || isManual ) {

      // If a manual step is called the dt should be the same a normal dt value.
      const adjustedDt = isManual ? dt : dt * ( this.timeSpeedProperty.value === TimeSpeed.SLOW ? 0.125 : 1 );
      this.circuit.step( adjustedDt );
      this.stepEmitter.emit( adjustedDt );
      this.stopwatch.step( adjustedDt );
    }
  },

  /**
   * Manually steps forward in time.
   * @public
   */
  manualStep: function() {
    this.step( 0.2, true );
  },

  // @public
  reset: function() {
    this.plateChargesVisibleProperty.reset();
    this.electricFieldVisibleProperty.reset();
    this.capacitanceMeterVisibleProperty.reset();
    this.barGraphsVisibleProperty.reset();
    this.voltmeterVisibleProperty.reset();
    this.currentVisibleProperty.reset();
    this.currentOrientationProperty.reset();
    this.switchUsedProperty.reset();
    this.isPlayingProperty.reset();
    this.timeSpeedProperty.reset();
    this.stopwatch.reset();
  }
} );

export default CLBModel;