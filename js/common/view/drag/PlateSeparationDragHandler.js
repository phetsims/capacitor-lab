// Copyright 2015, University of Colorado Boulder

/**
 * Drag handle for changing the plate separation.
 * Origin is at the end of the dashed line that is farthest from the arrow.
 * Attached to the top capacitor plate, in the center of the plate's top face.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var TandemDragHandler = require( 'TANDEM/scenery/input/TandemDragHandler' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor for the PlateSeparationDragHandler.  This is the drag handler for the capacitor plate separation
   * property. Plate separation is a vertical quantity, so we're dragging along the y axis. Other axes are ignored.
   *
   * @param {PlateSeparationDragHandleNode} dragNode
   * @param {Capacitor} capacitor
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Range} valueRange
   * @param {Tandem} tandem
   * @constructor
   */
  function PlateSeparationDragHandler( dragNode, capacitor, modelViewTransform, valueRange, tandem ) {

    var thisHandler = this;

    // @private
    this.dragNode = dragNode;
    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;
    this.valueRange = valueRange;
    this.clickYOffset = new Vector2( 0, 0 );

    TandemDragHandler.call( this, {
      tandem: tandem,
      start: function( event, trail ) {
        var pMouse = event.pointer.point;
        var pOrigin = modelViewTransform.modelToViewXYZ( 0, -( thisHandler.capacitor.plateSeparation / 2 ), 0 );
        thisHandler.clickYOffset = pMouse.y - pOrigin.y;
      },
      drag: function( event, trail ) {
        var pMouse = event.pointer.point;
        var yView = pMouse.y - thisHandler.clickYOffset;
        thisHandler.capacitor.plateSeparation = Util.clamp( 2 * modelViewTransform.viewToModelDeltaXY( 0, -yView ).y,
          valueRange.min, valueRange.max );
      }
    } );
  }

  capacitorLabBasics.register( 'PlateSeparationDragHandler', PlateSeparationDragHandler );

  return inherit( TandemDragHandler, PlateSeparationDragHandler );
} );

