// Copyright 2015-2020, University of Colorado Boulder

/**
 * Wire that connects a probe to the body of a meter. The wire is a cubic curve.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import Shape from '../../../../../kite/js/Shape.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import PhetColorScheme from '../../../../../scenery-phet/js/PhetColorScheme.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

// constants
// wire is a cubic curve, these are the control point offsets
const BODY_CONTROL_POINT_OFFSET = new Vector2( 0, 100 );
const PROBE_CONTROL_POINT_OFFSET = new Vector2( -80, 100 );
const POSITIVE_WIRE_COLOR = PhetColorScheme.RED_COLORBLIND;
const NEGATIVE_WIRE_COLOR = 'black';

/**
 * @param {VoltmeterBodyNode} bodyNode
 * @param {VoltmeterProbeNode} probeNode
 * @param {boolean} isPositive
 * @constructor
 */
function ProbeWireNode( bodyNode, probeNode, isPositive ) {

  const self = this;

  // @private {VoltmeterBodyNode}
  this.bodyNode = bodyNode;

  // @private {VoltmeterProbeNode}
  this.probeNode = probeNode;

  // @private {Vector2}
  this.bodyControlPointOffset = BODY_CONTROL_POINT_OFFSET;
  this.probeControlPointOffset = PROBE_CONTROL_POINT_OFFSET;

  // @private {Vector2}
  this.bodyConnectionOffset = isPositive ? bodyNode.positiveConnectionOffset : bodyNode.negativeConnectionOffset;
  this.probeConnectionOffset = probeNode.connectionOffset;

  // supertype constructor with lazily passed wire shape.
  Path.call( this, null, {
    stroke: isPositive ? POSITIVE_WIRE_COLOR : NEGATIVE_WIRE_COLOR,
    lineWidth: 3
  } );

  // update wire when body or probe moves
  probeNode.positionProperty.link( function( position ) {
    self.update();
  } );

  bodyNode.bodyPositionProperty.link( function( position ) {
    self.update();
  } );
}

capacitorLabBasics.register( 'ProbeWireNode', ProbeWireNode );

export default inherit( Path, ProbeWireNode, {

  /**
   * Update the wire path.
   * @public
   */
  update: function() {

    const pBody = this.getConnectionPoint( this.bodyNode, this.bodyConnectionOffset );
    const pProbe = this.getConnectionPoint( this.probeNode, this.probeConnectionOffset );

    // control points
    const ctrl1 = new Vector2( pBody.x + this.bodyControlPointOffset.x, pBody.y + this.bodyControlPointOffset.y );
    const ctrl2 = new Vector2( pProbe.x + this.probeControlPointOffset.x, pProbe.y + this.probeControlPointOffset.y );

    this.setShape( new Shape().moveToPoint( pBody ).cubicCurveToPoint( ctrl1, ctrl2, pProbe ) );
  },

  /**
   * Get the connection point for either the voltmeter body or probe.  Adds the node position to the offset connection
   * point vector for a given node.
   * @public
   *
   * @param {VoltmeterBodyNode|VoltmeterProbeNode} node
   * @param {Vector2} connectionOffset
   * @returns {Vector2}
   */
  getConnectionPoint: function( node, connectionOffset ) {
    return node.translation.plus( connectionOffset );
  }
} );
