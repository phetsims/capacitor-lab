// Copyright 2002-2015, University of Colorado Boulder

/**
 * Base class for all bar meter model elements.
 *
 * TODO: Location no longer needs to be a model property since the meter is not draggable anymore.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Constructor for a BarMeter.
   *
   * @param {AbstractCircuit} circuit
   * @param {Bounds2} worldBounds
   * @param {Vector3} location
   * @param {Property.<boolean>} visibleProperty - model property that determines if the entire meter is visible.
   * @param {Property.<boolean>} valueVisibleProperty - model property that determines if the values are visible
   * @param {Function} valueFunction
   * @constructor
   */
  function BarMeter( circuit, worldBounds, location, visibleProperty, valueVisibleProperty, valueFunction ) {

    PropertySet.call( this, {
      location: location,
      value: valueFunction( circuit )
    } );
    // TODO: added outside of PropertySet because the property is held first in the model. Look into a nicer way of doing this.
    // Best option is probably to take the properties out of CapacitorLabModel and just keep it here.
    this.visibleProperty = visibleProperty;
    this.valueVisibleProperty = valueVisibleProperty;
    var thisMeter = this;

    this.circuit = circuit;
    this.valueFunction = valueFunction;

    circuit.capacitor.multilink( ['plateSize', 'plateSeparation', 'platesVoltage' ], function() {
      thisMeter.updateValue();
    } );
  }

  return inherit( PropertySet, BarMeter, {

    setCircuit: function( circuit ) {
      debugger;
      if( this.circuit !== circuit ) {
        //this.circuit.removeCircuitChangeListener( circuitChangeListener ); TODO
        this.circuit = circuit;
        //this.circuit.addCircuitChangeListener( circuitChangeListener ); TODO
        this.updateValue();
      }
    },

    updateValue: function() {
      this.value = this.valueFunction( this.circuit );
    }

  }, {

    /**
     * Factory functions create specific meters.
     */
    CapacitanceMeter: function( circuit, worldBounds, location, visibleProperty, valueVisibleProperty ) {
      return new BarMeter( circuit, worldBounds, location, visibleProperty, valueVisibleProperty,
        function() {
          return circuit.getTotalCapacitance();
        } );
    },

    PlateChargeMeter: function( circuit, worldBounds, location, visibleProperty, valueVisibleProperty ) {
      return new BarMeter( circuit, worldBounds, location, visibleProperty, valueVisibleProperty,
        function() {
          return circuit.getTotalCharge();
        } );
    },

    StoredEnergyMeter: function( circuit, worldBounds, location, visibleProperty,valueVisibleProperty ) {
      return new BarMeter( circuit, worldBounds, location, visibleProperty, valueVisibleProperty,
        function() {
          return circuit.getStoredEnergy();
        } );
    }

  } );
} );