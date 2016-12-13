// Copyright 2016, University of Colorado Boulder

/**
 * Visual representation of a capacitor plate.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var BoxNode = require( 'CAPACITOR_LAB_BASICS/common/view/BoxNode' );
  var VacuumPlateChargeNode = require( 'CAPACITOR_LAB_BASICS/common/view/VacuumPlateChargeNode' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var Bounds3 = require( 'DOT/Bounds3' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var PLATE_COLOR = new Color( 245, 245, 245 );  // capacitor plates

  function PlateNode( capacitor, modelViewTransform, polarity, maxPlateCharge ) {

    BoxNode.call( this, modelViewTransform, PLATE_COLOR, capacitor.plateSizeProperty.value );

    this.modelViewTransform = modelViewTransform; // @private

    // Charges restricted to the largest possible top face on a capacitor plate.  Bounds needed for canvas.
    var canvasBounds = this.getMaxBoxNodeBounds();

    // @private
    this.vacuumPlateChargeNode = new VacuumPlateChargeNode( capacitor, modelViewTransform, {
      polarity: polarity,
      maxPlateCharge: maxPlateCharge,
      canvasBounds: canvasBounds
    } );
    this.addChild( this.vacuumPlateChargeNode );
  }

  capacitorLabBasics.register( 'PlateNode', PlateNode );

  return inherit( BoxNode, PlateNode, {

    /**
     * Make the charges on this plate visible.
     *
     * @param {boolean} visible
     * @public
     */
    setChargeVisible: function( visible ) {
      this.vacuumPlateChargeNode.visible = visible;
    },

    /**
     * Get bounds for a plate with maximum width.  Useful for layout and bounds calculations.
     *
     * @returns {Bounds3}
     * @public
     */
    getMaxBoxNodeBounds: function() {
      var maxWidthBoxNode = new BoxNode(
        this.modelViewTransform,
        PLATE_COLOR,
        new Bounds3( 0, 0, 0,
                    CLBConstants.PLATE_WIDTH_RANGE.max,
                    CLBConstants.PLATE_HEIGHT,
                    CLBConstants.PLATE_WIDTH_RANGE.max )
      );
      return maxWidthBoxNode.bounds;
    }

  }, {

    /**
     * Factory methods to create top and bottom PlateNode instances.
     *
     * @param {Capacitor} capacitor
     * @param {CLBModelViewTransform3D} modelViewTransform
     * @param {number} maxPlateCharge
     * @public
     */
    createTopPlateNode: function( capacitor, modelViewTransform, maxPlateCharge ) {
      return new PlateNode( capacitor, modelViewTransform, CLBConstants.POLARITY.POSITIVE, maxPlateCharge );
    },
    createBottomPlateNode: function( capacitor, modelViewTransform, maxPlateCharge ) {
      return new PlateNode( capacitor, modelViewTransform, CLBConstants.POLARITY.NEGATIVE, maxPlateCharge );
    }
  } );
} );

