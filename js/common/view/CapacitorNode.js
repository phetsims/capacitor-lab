// Copyright 2014-2015, University of Colorado Boulder

/**
 * Visual representation of a capacitor.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlateNode = require( 'CAPACITOR_LAB_BASICS/common/view/PlateNode' );
  var EFieldNode = require( 'CAPACITOR_LAB_BASICS/common/view/EFieldNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  
  // strings
  var accessibleCapacitorString = require( 'string!CAPACITOR_LAB_BASICS/accessible.capacitor' );
  var accessibleCapacitorDescriptionString = require( 'string!CAPACITOR_LAB_BASICS/accessible.capacitorDescription' );

  /**
   * Constructor for a CapacitorNode.
   *
   * @param {Capacitor} capacitor
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property} plateChargeVisibleProperty
   * @param {Property} eFieldVisibleProperty
   * @param {number} maxPlateCharge
   * @param {number} maxEffectiveEField
   * @constructor
   */
  function CapacitorNode( capacitor, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty,
                          maxPlateCharge, maxEffectiveEField ) {

    Node.call( this );
    var thisNode = this; // extend scope for nested callbacks

    // @private
    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;
    this.topPlateNode = PlateNode.TopPlateNode( capacitor, modelViewTransform, maxPlateCharge );
    this.bottomPlateNode = PlateNode.BottomPlateNode( capacitor, modelViewTransform, maxPlateCharge );

    var eFieldNode = new EFieldNode( capacitor, modelViewTransform, maxEffectiveEField, this.getPlatesBounds() );

    // rendering order
    this.addChild( this.bottomPlateNode );
    this.addChild( eFieldNode );
    this.addChild( this.topPlateNode );

    // observers
    capacitor.multilink( [ 'plateSize', 'plateSeparation' ], function() {
      thisNode.updateGeometry();
    } );

    plateChargeVisibleProperty.link( function( visible ) {
      thisNode.topPlateNode.setChargeVisible( visible );
      thisNode.bottomPlateNode.setChargeVisible( visible );
    } );

    eFieldVisibleProperty.link( function( visible ) {
      eFieldNode.setVisible( visible );
    } );
    
    // add the accessible content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        // capacitor-widget
        var domElement = document.createElement( 'div' );
        
        var label = document.createElement( 'h4' );
        label.innerText = accessibleCapacitorString;
        label.id = 'capacitor-label-' + trail.getUniqueId();
        domElement.appendChild( label );
        
        var description = document.createElement( 'p' );
        description.innerText = accessibleCapacitorDescriptionString;
        description.id = 'capacitor-description-' + trail.getUniqueId();
        domElement.appendChild( description );
        
        domElement.setAttribute( 'aria-describedby', description.id );
        domElement.setAttribute( 'aria-labeledby', label.id );
        
        domElement.tabIndex = '-1';

        var accessiblePeer = new AccessiblePeer( accessibleInstance, domElement );
        domElement.id = 'capacitor-' + trail.getUniqueId();
        return accessiblePeer;

      }
    };

  }

  capacitorLabBasics.register( 'CapacitorNode', CapacitorNode );
  
  return inherit( Node, CapacitorNode, {

    /**
     * Update the geometry of the capacitor plates.
     */
    updateGeometry: function() {
      // geometry
      this.topPlateNode.setBoxSize( this.capacitor.plateSize );
      this.bottomPlateNode.setBoxSize( this.capacitor.plateSize );

      // layout nodes with zero dielectric offset
      var x = 0;
      var y = -( this.capacitor.plateSeparation / 2 ) - this.capacitor.plateSize.height;
      var z = 0;
      this.topPlateNode.center = this.modelViewTransform.modelToViewDeltaXYZ( x, y, z );

      //y = -this.capacitor.getDielectricSize().getHeight() / 2;
      //dielectricNode.setOffset( mvt.modelToViewDelta( x, y, z ) );

      y = this.capacitor.plateSeparation / 2;
      this.bottomPlateNode.center = this.modelViewTransform.modelToViewDeltaXYZ( x, y, z );

      // adjust the dielectric offset
      //updateDielectricOffset();
    },

    /**
     * Get the bound of the capacitor from the plates.  Allows for bounds to be passed into the canvas node before the
     * children are added to the view.
     *
     * @returns {Bounds2}
     */
    getPlatesBounds: function() {
      return new Bounds2(
        this.topPlateNode.left,
        this.topPlateNode.top,
        this.bottomPlateNode.right,
        this.bottomPlateNode.bottom );
    }
  } );
} );