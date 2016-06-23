// Copyright 2015, University of Colorado Boulder

/**
 * Drag handle for changing the plate area.
 * Origin is at the end of the dashed line that is farthest from the arrow.
 * Attached to the capacitor's top plate, at front-left corner of top face.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var UnitsUtils = require( 'CAPACITOR_LAB_BASICS/common/model/util/UnitsUtils' );
  var DragHandleArrowNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleArrowNode' );
  var PlateAreaDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateAreaDragHandler' );
  var DragHandleValueNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleValueNode' );
  var DragHandleLineNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleLineNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  // endpoints for a vertical double-headed arrow, this will be rotated to point along the plate's pseudo-3D diagonal
  var ARROW_TIP_LOCATION = new Vector2( 0, 0 );
  var ARROW_TAIL_LOCATION = new Vector2( 0, CLBConstants.DRAG_HANDLE_ARROW_LENGTH );

  // strings
  var plateAreaString = require( 'string!CAPACITOR_LAB_BASICS/plateArea' );
  var unitsMillimetersString = require( 'string!CAPACITOR_LAB_BASICS/units.millimeters' );

  // endpoints for a vertical line, this will be rotated to point along the plate's pseudo-3D diagonal
  var LINE_LENGTH = 22;
  var LINE_START_LOCATION = new Vector2( 0, 0 );
  var LINE_END_LOCATION = new Vector2( 0, LINE_LENGTH );

  /**
   * Constructor.
   *
   * @param {Capacitor} capacitor
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Range} valueRange
   * @param {Tandem} tandem
   * @constructor
   */
  function PlateAreaDragHandleNode( capacitor, modelViewTransform, valueRange, tandem ) {

    Node.call( this );
    var thisNode = this;

    // @private
    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;

    // arrow
    var arrowNode = new DragHandleArrowNode( ARROW_TIP_LOCATION, ARROW_TAIL_LOCATION );
    arrowNode.addInputListener( new PlateAreaDragHandler( arrowNode, capacitor, modelViewTransform, valueRange,
      tandem.createTandem( 'inputListener' ) ) );

    // this.touchArea = arrowNode.bounds;
    this.cursor = 'pointer';

    // line
    var lineNode = new DragHandleLineNode( LINE_START_LOCATION, LINE_END_LOCATION );

    // value
    var millimetersSquared = UnitsUtils.metersSquaredToMillimetersSquared( capacitor.getPlateArea() );
    // @private
    this.valueNode = new DragHandleValueNode( plateAreaString, millimetersSquared, unitsMillimetersString + '<sup>' + 2 + '</sup>' );

    // rendering order
    this.addChild( lineNode );
    this.addChild( arrowNode );
    this.addChild( this.valueNode );

    // layout: arrow below line, rotate into alignment with top plate's pseudo-3D diagonal
    var x = 0;
    var y = 0;
    var angle = ( -Math.PI / 2 ) + ( modelViewTransform.yaw / 2 ); // aligned with diagonal of plate surface
    var lineArrowSpacing = 2;
    lineNode.translation = new Vector2( x, y );
    lineNode.rotation = angle;

    x = lineNode.bounds.maxX + lineArrowSpacing;
    y = lineNode.bounds.minY - lineArrowSpacing;
    arrowNode.translation = new Vector2( x, y );
    arrowNode.rotation = angle;

    x = lineNode.bounds.maxX + this.valueNode.bounds.width / 3;
    y = lineNode.bounds.minY - this.valueNode.bounds.height - 14;
    this.valueNode.translation = new Vector2( x, y );

    // watch for model changes
    capacitor.plateSizeProperty.link( function() {
      thisNode.updateDisplay();
      thisNode.updateOffset();
    } );

    capacitor.plateSeparationProperty.link( function() {
      thisNode.updateOffset();
    } );

    tandem.addInstance( this );
  }

  capacitorLabBasics.register( 'PlateAreaDragHandleNode', PlateAreaDragHandleNode );

  return inherit( Node, PlateAreaDragHandleNode, {

    // synchronizes the value display with the model
    updateDisplay: function() {
      var millimetersSquared = UnitsUtils.metersSquaredToMillimetersSquared( this.capacitor.getPlateArea() );
      this.valueNode.setValue( millimetersSquared );
    },

    // Attach drag handle to capacitor's top plate, at back-irght corner of top face.
    updateOffset: function() {
      var x = this.capacitor.location.x + ( this.capacitor.plateSize.width / 2 );
      var y = this.capacitor.location.y - ( this.capacitor.plateSeparation / 2 ) - this.capacitor.plateSize.height;
      var z = this.capacitor.location.z + ( this.capacitor.plateSize.depth / 2 );
      this.translation = this.modelViewTransform.modelToViewXYZ( x, y, z );
    }
  } );
} );

