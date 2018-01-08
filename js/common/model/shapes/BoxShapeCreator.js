// Copyright 2015-2017, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the 3D boxes.
 * Shapes are in the view coordinate frame, everything else is in model coordinates.
 * Shapes for all faces corresponds to a box with its origin in the center of the top face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @constructor
   *
   * @param {CLBModelViewTransform3D} modelViewTransform
   */
  function BoxShapeCreator( modelViewTransform ) {
    assert && assert( modelViewTransform instanceof CLBModelViewTransform3D );

    // @public {CLBModelViewTransform3D}
    this.modelViewTransform = modelViewTransform;
  }

  capacitorLabBasics.register( 'BoxShapeCreator', BoxShapeCreator );

  return inherit( Object, BoxShapeCreator, {

    /**
     * Top face is a parallelogram.
     * @public
     *
     *    p0 -------------- p1
     *   /                /
     *  /                /
     * p3 --------------p2
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} width
     * @param {number} height
     * @param {number} depth
     * @returns {Shape}
     */
    createTopFace: function( x, y, z, width, height, depth ) {
      // points
      var p0 = this.modelViewTransform.modelToViewXYZ( x - ( width / 2 ), y, z + ( depth / 2 ) );
      var p1 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z + ( depth / 2 ) );
      var p2 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z - ( depth / 2 ) );
      var p3 = this.modelViewTransform.modelToViewXYZ( x - ( width / 2 ), y, z - ( depth / 2 ) );

      // shape
      return this.createFace( p0, p1, p2, p3 );
    },

    /**
     * Create the top face of the Box with a Bounds3 object.
     * @public
     *
     * @param {Bounds3} bounds
     * @returns {Shape}
     */
    createTopFaceBounds3: function( bounds ) {
      return this.createTopFace( bounds.minX, bounds.minY, bounds.minZ, bounds.width, bounds.height, bounds.depth );
    },

    /**
     * Front face is a rectangle.
     * @public
     *
     * p0 --------------- p1
     * |                 |
     * |                 |
     * p3 --------------- p2
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} width
     * @param {number} height
     * @param {number} depth
     * @returns {Shape}
     */
    createFrontFace: function( x, y, z, width, height, depth ) {
      // points
      var p0 = this.modelViewTransform.modelToViewXYZ( x - ( width / 2 ), y, z - ( depth / 2 ) );
      var p1 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z - ( depth / 2 ) );
      var p2 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y + height, z - ( depth / 2 ) );
      var p3 = this.modelViewTransform.modelToViewXYZ( x - ( width / 2 ), y + height, z - ( depth / 2 ) );
      // shape
      return this.createFace( p0, p1, p2, p3 );
    },

    /**
     * Create the front face of the box with a Bounds3 object.
     * @public
     *
     * @param {Bounds3} bounds
     * @returns {Shape}
     */
    createFrontFaceBounds3: function( bounds ) {
      return this.createFrontFace( bounds.minX, bounds.minY, bounds.minZ, bounds.width, bounds.height, bounds.depth );
    },

    /**
     * Right-side face is a parallelogram.
     * @public
     *
     *      p1
     *     / |
     *    /  |
     *   /   |
     *  /    p2
     * p0   /
     * |   /
     * |  /
     * | /
     * p3
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} width
     * @param {number} height
     * @param {number} depth
     * @returns {Shape}
     */
    createRightSideFace: function( x, y, z, width, height, depth ) {
      // points
      var p0 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z - ( depth / 2 ) );
      var p1 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y, z + ( depth / 2 ) );
      var p2 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y + height, z + ( depth / 2 ) );
      var p3 = this.modelViewTransform.modelToViewXYZ( x + ( width / 2 ), y + height, z - ( depth / 2 ) );
      // path
      return this.createFace( p0, p1, p2, p3 );
    },

    /**
     * Create the right face of the box with a Bounds3 object.
     * @public
     *
     * @param {Bounds3} bounds
     * @returns {Shape}
     */
    createRightSideFaceBounds3: function( bounds ) {
      return this.createRightSideFace( bounds.minX, bounds.minY, bounds.minZ, bounds.width, bounds.height, bounds.depth );
    },

    /**
     * A complete box, relative to a specific origin.
     * @public
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} width
     * @param {number} height
     * @param {number} depth
     * @returns {Shape}
     */
    createBoxShape: function( x, y, z, width, height, depth ) {
      var topShape = this.createTopFace( x, y, z, width, height, depth );
      var frontShape = this.createFrontFace( x, y, z, width, height, depth );
      var sideShape = this.createRightSideFace( x, y, z, width, height, depth );
      return Shape.union( [ topShape, frontShape, sideShape ] );
    },

    /**
     * Returns whether the box would contain the given 2d point
     * @public
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} width
     * @param {number} height
     * @param {number} depth
     * @param {Vector2} point
     * @returns {boolean}
     */
    boxShapeContainsPoint: function( x, y, z, width, height, depth, point ) {
      var topShape = this.createTopFace( x, y, z, width, height, depth );
      var frontShape = this.createFrontFace( x, y, z, width, height, depth );
      var sideShape = this.createRightSideFace( x, y, z, width, height, depth );
      return topShape.containsPoint( point ) || frontShape.containsPoint( point ) || sideShape.containsPoint( point );
    },

    /**
     * A face is defined by 4 points, specified in view coordinates.
     * @public
     *
     * @returns {Shape}
     */
    createFace: function( p0, p1, p2, p3 ) {
      return new Shape()
        .moveToPoint( p0 )
        .lineToPoint( p1 )
        .lineToPoint( p2 )
        .lineToPoint( p3 )
        .close();
    }
  } );
} );
