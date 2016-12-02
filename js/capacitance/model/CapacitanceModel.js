// Copyright 2015, University of Colorado Boulder

/**
 * Capacitance model for Capacitor Lab: Basics.  This model has a battery connected in parallel to a capacitor, and
 * allows the user to modify capacitor plate geometry to illustrate relationships with capacitance.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CircuitConfig = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConfig' );
  var CapacitanceCircuit = require( 'CAPACITOR_LAB_BASICS/capacitance/model/CapacitanceCircuit' );
  var BarMeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/BarMeter' );
  var Voltmeter = require( 'CAPACITOR_LAB_BASICS/common/model/meter/Voltmeter' );
  var CLBModel = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModel' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for the CapacitanceModel.
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   */
  function CapacitanceModel( switchUsedProperty, modelViewTransform, tandem ) {

    CLBModel.call( this, tandem );

    //REVIEW: All screens use this property, so we shouldn't define it here (do that in CLBModel)
    this.switchUsedProperty = switchUsedProperty; // @public

    //REVIEW: All screens use this property, so we shouldn't define it here (do that in CLBModel)
    this.modelViewTransform = modelViewTransform; // @public (read-only)

    //REVIEW: CLBModel (supertype) does this, why is this also done here?
    this.tandem = tandem; // @private

    // Configuration info for the circuit.
    // Default number of capacitors is 1, default number of lightbulbs is 0.
    //REVIEW: Not just the default, but always what it has?
    var circuitConfig = new CircuitConfig( {
      circuitConnections: [ CircuitConnectionEnum.BATTERY_CONNECTED, CircuitConnectionEnum.OPEN_CIRCUIT ]
    } );

    this.circuit = new CapacitanceCircuit( circuitConfig, tandem.createTandem( 'circuit' ) ); // @public

    //REVIEW: This is the same for both models, pull it down into CLBModel?
    this.worldBounds = CLBConstants.CANVAS_RENDERING_SIZE.toBounds(); // @private

    // Allow null instead of tandem if this component is part of a temporary circuit used for calculations
    var circuit = this.circuit;

    //REVIEW: visibility doc (public?)
    this.capacitanceMeter = new BarMeter( this.circuit, this.capacitanceMeterVisibleProperty,
      function() {
        return circuit.getTotalCapacitance();
      },
      tandem.createTandem( 'capacitanceMeter' ) );

    // @public
    //REVIEW: This is the same code as used by CLBLightBulbModel. Since it is used in both screens, it should presumably be on the supertype?
    this.voltmeter = new Voltmeter( this.circuit, this.worldBounds, modelViewTransform, tandem.createTandem( 'voltmeter' ) );

    //REVIEW: This is done in all other concrete models (CLBLightBulbModel), and should be factored out to the supertype
    this.circuit.maxPlateCharge = this.getMaxPlateCharge();
    this.circuit.maxEffectiveEField = this.getMaxEffectiveEField();
  }

  capacitorLabBasics.register( 'CapacitanceModel', CapacitanceModel );

  return inherit( CLBModel, CapacitanceModel, {

    /**
     * Reset function for this model.
     * REVIEW: visibility doc
     */
    reset: function() {
      CLBModel.prototype.reset.call( this );
      this.capacitanceMeter.reset();
      this.voltmeter.reset();
      this.circuit.reset();

      //REVIEW: This is a global property that affects both screens. Presumably it shouldn't be reset by one screen?
      this.switchUsedProperty.reset();
    },

    /**
     * Step function for the CLBModel.
     * REVIEW: visibility doc
     *
     * REVIEW: This is the same as in CLBLightBulbModel, and should be shared in the supertype.
     *
     * @param {number} dt
     */
    step: function( dt ) {
      this.circuit.step( dt );
    },

    /**
     * Gets the maximum charge on the top plate (Q_total).
     * We compute this with the battery connected because this is used to determine the range of the Plate Charge
     * slider.
     * REVIEW: visibility doc
     *
     * REVIEW: This is the same as in CLBLightBulbModel, and should be shared in the supertype.
     *
     * REVIEW: returns?
     */
    getMaxPlateCharge: function() {
      return this.getCapacitorWithMaxCharge().getPlateCharge();
    },

    /**
     * Gets the maximum effective E-field between the plates (E_effective).
     * The maximum occurs when the battery is disconnected, the Plate Charge
     * control is set to its maximum, and the plate area is set to its minimum.
     * And in this situation, plate separation is irrelevant.
     * REVIEW: visibility doc
     *
     * return {number}
     */
    getMaxEffectiveEField: function() {
      //REVIEW: a good amount of shared logic with CLBLightBulbModel's version of this. Can common logic be factored out?
      var circuitConfig = new CircuitConfig( {
        plateWidth: CLBConstants.PLATE_WIDTH_RANGE.min,
        plateSeparation: CLBConstants.PLATE_SEPARATION_RANGE.min,
        //REVIEW: Wire thickness never varies from CLBConstants.WIRE_THICKNESS. Don't need to pass this around
        wireThickness: CLBConstants.WIRE_THICKNESS
      } );

      // This circuit is constructed as part of an implementation and should not be instrumented.
      // A null value could be passed in here, but then all children would need null checks.
      // Instead, pass in a disabled tandem instance. All children will inherit the `enabled` value
      // unless specifically overridden.
      //REVIEW: Why are we creating a tandem (and then not disposing) for this temporary object, in a function getMaxEffectiveEField?
      //REVIEW: Does phet-io behave badly with duplicated tandems?
      //REVIEW: If this is needed, please document the reason tandem is provided.
      var circuit = new CapacitanceCircuit( circuitConfig,
        this.tandem.createTandem( 'tempLightBulbCircuit', { enabled: false } ) );

      // disconnect the battery and set the max plate charge
      circuit.circuitConnectionProperty.set( CircuitConnectionEnum.OPEN_CIRCUIT );
      circuit.disconnectedPlateChargeProperty.set( this.getMaxPlateCharge() );

      return circuit.capacitor.getEffectiveEField();
    }

  } );
} );
