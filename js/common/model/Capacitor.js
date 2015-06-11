// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model of a capacitor, used in the Introduction and Dielectric tabs, where we have a single capacitor whose geometry
 * can be directly manipulated by the user.
 *
 * A capacitor consists of 2 parallel, square plates, with a dielectric material between the plates. When the
 * dielectric can be partially inserted, the capacitor must be modeled as 2 parallel capacitors, one of which has the
 * dielectric between its plates, and the other of which has air between its plates.
 *
 * A capacitor's capacitance (C) is solely dependent on its geometry and the dielectric material. Charge (Q) on the
 * plates is a function of capacitance and voltage (V) across the plates: Q = CV
 *
 * Variable names used in this implementation where chosen to match the specification in the design document, and
 * therefore violate Java naming conventions.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector3 = require( 'DOT/Vector3' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var CapacitorShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/CapacitorShapeCreator' );
  var Bounds3 = require( 'DOT/Bounds3' );

  /**
   * Constructor for the Capacitor.
   * @param {Vector3} location
   * @param {number} plateWidth
   * @param {number} plateSeparation
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function Capacitor( location, plateWidth, plateSeparation, modelViewTransform ) {

    // immutable variables.
    this.modelViewTransform = modelViewTransform;
    this.shapeCreator = new CapacitorShapeCreator( this, modelViewTransform );
    this.location = location;

    PropertySet.call( this, {
      plateSize: new Bounds3( 0, 0, 0, plateWidth, CLConstants.PLATE_HEIGHT, plateWidth ), // Square plates.
      plateSeparation: plateSeparation,
      platesVoltage: 0, // zero until it's connected into a circuit
      dielectricOffset: 0.01 // in meters, default is totally outside of capacitor plates.
    } );

    // TODO: Include listeners.
    //// if observable properties change, so do derived properties
    //propertiesObserver = new SimpleObserver() {
    //  public void update() {
    //    fireCapacitorChanged();
    //  }
    //};
    //plateSizeProperty.addObserver( propertiesObserver );
    //plateSeparationProperty.addObserver( propertiesObserver );
    //dielectricOffsetProperty.addObserver( propertiesObserver );
    //dielectricMaterialProperty.addObserver( propertiesObserver );
    //dielectricMaterialProperty.get().addDielectricConstantObserver( propertiesObserver );
    //platesVoltageProperty.addObserver( propertiesObserver );

  }

  return inherit( PropertySet, Capacitor, {

    /**
     * Convenience method, gets the area of one plate's top (or bottom) surfaces.
     * (design doc symbol: A)
     *
     * @return {number} area in meters^2
     */
    getPlateArea: function() {
      return this.plateSize.width * this.plateSize.depth;
    },

    /**
     * Gets the area of the contact between one of the plates and air.  Note that without dielectrics this is the same
     * as the plate area.
     * (design doc symbol: A_air)
     *
     * @return {number} area in meters^2
     */
    getAirContactArea: function() {
      return this.getPlateArea();
    },

    /**
     * Sets the distance between the 2 parallel plates.
     * NOTE: The model for this sim requires that the plate separation be > 0.
     * (design doc symbol: d)
     *
     * @param {number} plateSeparation distance, in meters.
     */
    setPlateSeparation: function( plateSeparation ) {
      if ( plateSeparation <= 0 ) {
        console.error( "plateSeparation must be > 0: " + plateSeparation );
      }
      this.plateSeparation = plateSeparation;
    },

    /**
     * Convenience method for determining the outside center of the top plate.  This is a wire attachment point.
     *
     * @return {Vector3}
     */
    getTopPlateCenter: function() {
      return new Vector3( this.location.x, this.location.y - ( this.plateSeparation / 2 ) - this.plateSize.height, this.location.z );
    },

    /**
     * Convenience method for determining the outside center of the bottom plate.  This is a wire attachment point.
     *
     * TODO: This will need to be fixed for 2D work.
     * @return {Vector3}
     */
    getBottomPlateCenter: function() {
      return new Vector3( this.location.x, this.location.y + ( this.plateSeparation / 2 ) + this.plateSize.height, this.location.z );
    },

    // d =  epsilon * epsilon_0 * A / C
    /**
     * Get the plate separation of this capacitor.  Value is determined by the equation d =  epsilon * epsilon_0 * A / C
     *
     * @param {number} dielectricConstant
     * @param {number} plateWidth
     * @param {number} capacitance
     * @returns {number}
     */
    getPlateSeparation: function( dielectricConstant, plateWidth, capacitance ) {
      return dielectricConstant * CLConstants.EPSILON_0 * plateWidth * plateWidth / capacitance;
    },

    /**
     * General formula for computing capacitance.
     *
     * @param {number} epsilon dielectric constant, dimensionless
     * @param {number} area of the contact between the dielectric and one plate, meters^2
     * @param {number} plateSeparation distance between the plates, meters
     * @return {number} capacitance, in Farads
     */
    getCapacitance: function( epsilon, area, plateSeparation ) {
      return epsilon * CLConstants.EPSILON_0 * area / plateSeparation;
    },

    /**
     * Gets the capacitance due to the part of the capacitor that is contacting air.
     * (design doc symbol: C_air)
     *
     * @return {number} capacitance, in Farads
     */
    getAirCapacitance: function() {
      return this.getCapacitance( CLConstants.EPSILON_AIR, this.getAirContactArea(), this.plateSeparation );
    },

    /**
     * Does a Shape intersect the top plate shape?
     *
     * @param {Shape} shape
     * @return {boolean}
     */
    intersectsTopPlate: function( shape ) {
      return shape.intersectsBounds( this.shapeCreator( this.shapeCreator.createTopPlateShapeOccluded() ) );
    },

    /**
     * Does a shape intersect the bottom plate shape?
     *
     * @param {Shape} shape
     * @return {boolean}
     */
    intersectsBottomPlate: function( shape ) {
      return shape.intersectsBounds( this.shapeCreator.createBottomPlateShapeOccluded() );
    },

    /**
     * Is a point inside the Shape that is the 2D projection of the space between the capacitor plates?  In the Java
     * sim this checked for points between plates in air or in a dielectric.  Dielectrics are being ignored for the
     * moment so this is identical to isInsideAirBetweenPlates().
     *
     * @param {Vector3} point a point in the global 2D model coordinate frame
     * @return {boolean}
     */
    isBetweenPlates: function( point ) {
      return this.isInsideAirBetweenPlates( point );
    },

    /**
     * Is a point inside the Shape that is the 2D projection of air between the plates?
     *
     * TODO: Requires ShapeCreators of this sim.
     * @param {Vector3} point a point in the global 3D model coordinate frame
     * @return {boolean}
     */
    isInsideAirBetweenPlates: function( point ) {
      //return this.shapeCreator.createAirBetweenPlatesShapeOccluded().contains( mvt.modelToView( p ) );
    },

    /**
     * Gets the charge for the portion of the top plate contacting the air.
     * (design doc symbol: Q_air)
     *
     * @return {number} charge, in Coulombs
     *
     */
    getAirPlateCharge: function() {
      return this.getAirCapacitance() * this.platesVoltage;
    },

    /**
     * Gets the total charge on the top plate. Note that without dielectrics this is equal to getAirPlateCharge().
     * (design doc symbol: Q_total)
     *
     * @return {number} charge, in Coulombs
     */
    getTotalPlateCharge: function() {
      return this.getAirPlateCharge();
    },

    /**
     * Get the total capacitance of this capacitor.  Note that without dielectrics this is identical to the capacitance
     * of air.  When dielectrics are added, be sure to include dielectric capacitance components.
     *
     * @returns {number}
     */
    getTotalCapacitance: function() {
      return this.getAirCapacitance();
    },

    /**
     * Gets the excess plate charge due to plates contacting air.
     * (design doc symbol: Q_excess_air)
     *
     * @return {number} excess charge, in Coulombs
     */
    getExcessAirPlateCharge: function() {
      return this.getExcessPlateCharge( CLConstants.EPSILON_AIR, this.getAirCapacitance(), this.platesVoltage );
    },

    /**d
     * General solution for excess plate charge.
     *
     * @param {number} epsilon_r dielectric constant, dimensionless
     * @param {number} C capacitance due to the dielectric
     * @param {number} V_plates plate voltage, volts
     * @return {number} charge, in Coulombs (C)
     */
    getExcessPlateCharge: function( epsilon_r, C, V_plates ) {
      if ( epsilon_r <= 0 ) {
        console.error( 'Model requires epsilon_r > 0 : ' + epsilon_r );
      }
      return ( ( epsilon_r - CLConstants.EPSILON_VACUUM ) / epsilon_r ) * C * V_plates; // Coulombs (1C = 1F * 1V)
    },

    /**
     * Gets the effective (net) field between the plates. This is uniform everywhere between the plates.
     * (design doc symbol: E_effective)
     *
     * @return {number} Volts/meter
     */
    getEffectiveEField: function() {
      return this.platesVoltage / this.plateSeparation;
    },

    /**
     * Gets the field due to the plates in the capacitor volume that contains air.
     * (design doc symbol: E_plates_air)
     *
     * @return E-field, in Volts/meter
     */
    getPlatesAirEField: function() {
      return this.getPlatesEField( CLConstants.EPSILON_AIR, this.platesVoltage, this.plateSeparation );
    },

    /**
     * General solution for the E-field due to some dielectric.
     *
     * @param {number} epsilon_r dielectric constant, dimensionless
     * @param {number} V_plates plate voltage, volts
     * @param {number} d plate separation, meters
     * @return {number} E-field, in Volts/meter
     */
    getPlatesEField: function( epsilon_r, V_plates, d ) {
      if ( d <= 0 ) {
        console.error( 'Model requires d (plate separation) > 0 : ' + d );
      }
      return epsilon_r * V_plates / d;
    },

    /**
     * Gets the field due to air polarization.
     * (design doc symbol: E_air)
     *
     * @return {number} E-field, in Volts/meter
     */
    getAirEField: function() {
      return this.getPlatesAirEField() - this.getEffectiveEField();
    }

  } );

} );