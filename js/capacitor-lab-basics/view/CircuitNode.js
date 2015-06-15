// Copyright 2002-2015, University of Colorado Boulder

/**
 * Circuit for the for the "Dielectric" module.  Contains the circuit components and controls for manipulating the
 * circuit.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BatteryNode = require( 'CAPACITOR_LAB_BASICS/common/view/BatteryNode' );
  var CapacitorNode = require( 'CAPACITOR_LAB_BASICS/common/view/CapacitorNode' );
  var WireNode = require( 'CAPACITOR_LAB_BASICS/common/view/WireNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var PlateSeparationDragHandleNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateSeparationDragHandleNode' );
  var PlateAreaDragHandleNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateAreaDragHandleNode' );
  var BatteryConnectionButtonNode = require( 'CAPACITOR_LAB_BASICS/capacitor-lab-basics/view/control/BatteryConnectionButtonNode' );
  var PlateChargeControlNode = require( 'CAPACITOR_LAB_BASICS/capacitor-lab-basics/view/control/PlateChargeControlNode' );
  var Range = require( 'DOT/Range' );

  /**
   * Constructor for a CircuitNode.
   *
   * @param {SingleCircuit} circuit
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property} plateChargeVisibleProperty
   * @param {Property} eFieldVisibleProperty
   * @param {number} maxPlateCharge
   * @param {number} maxEffectiveEField
   * @constructor
   */
  function CircuitNode( circuit, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty, maxPlateCharge,
                        maxEffectiveEField ) {

    Node.call( this ); // supertype constructor

    var thisNode = this;

    this.circuit = circuit;

    // circuit components
    var batteryNode = new BatteryNode( circuit.battery, CLConstants.BATTERY_VOLTAGE_RANGE );

    var capacitorNode = new CapacitorNode( circuit.capacitor, modelViewTransform, plateChargeVisibleProperty,
      eFieldVisibleProperty, maxPlateCharge, maxEffectiveEField );

    this.topWireNode = new WireNode( circuit.getTopWire() ); // @private
    this.bottomWireNode = new WireNode( circuit.getBottomWire() ); // @private

    // drag handles
    var plateSeparationDragHandleNode = new PlateSeparationDragHandleNode( circuit.capacitor, modelViewTransform, CLConstants.PLATE_SEPARATION_RANGE );
    var plateAreaDragHandleNode = new PlateAreaDragHandleNode( circuit.capacitor, modelViewTransform, CLConstants.PLATE_WIDTH_RANGE );

    // controls
    var batteryConnectionButtonNode = new BatteryConnectionButtonNode( circuit );
    this.plateChargeControlNode = new PlateChargeControlNode( circuit, new Range( -maxPlateCharge, maxPlateCharge ) );

    // rendering order
    this.addChild( this.bottomWireNode );
    this.addChild( batteryNode );
    this.addChild( capacitorNode );
    this.addChild( this.topWireNode );
    //addChild( topCurrentIndicatorNode );
    //addChild( bottomCurrentIndicatorNode );
    //if ( dielectricVisible ) {
    //  addChild( dielectricOffsetDragHandleNode );
    //}
    this.addChild( plateSeparationDragHandleNode );
    this.addChild( plateAreaDragHandleNode );
    this.addChild( batteryConnectionButtonNode );
    this.addChild( this.plateChargeControlNode );

    // layout
    // battery
    batteryNode.center = modelViewTransform.modelToViewPosition( circuit.battery.location );

    // capacitor
    capacitorNode.center = modelViewTransform.modelToViewPosition( circuit.capacitor.location );

    // wires shapes are in model coordinate frame, so the nodes live at (0,0)
    // the following does nothing but it explicitly defines the layout.
    this.topWireNode.translation = new Vector2( 0, 0 );
    this.bottomWireNode.translation = new Vector2( 0, 0 );

    // Connect/Disconnect Battery button
    var x = batteryNode.bounds.minX;
    // TODO: The following is a placeholder until the current indicators are ported.
    var y = this.topWireNode.bounds.minY - batteryConnectionButtonNode.bounds.minY - batteryConnectionButtonNode.bounds.height - 10;
    //var y = topCurrentIndicatorNode.getFullBoundsReference().getMinY() - batteryConnectionButtonNode.getFullBoundsReference().getHeight() - 10;
    batteryConnectionButtonNode.translation = new Vector2( x, y );

    // Plate Charge control
    this.plateChargeControlNode.translation = ( modelViewTransform.modelToViewPosition( new Vector3( circuit.capacitor.location.x - 0.004, 0.001, 0 ) ) );

    // observers
    circuit.batteryConnectedProperty.link( function( batteryConnected ) {
      thisNode.updateBatteryConnectivity();
    } );

    //circuit.addCircuitChangeListener( new CircuitChangeListener() {
    //  public void circuitChanged() {
    //    updateBatteryConnectivity();
    //  }
    //} );

  }

  return inherit( Node, CircuitNode, {

    // Updates the circuit components and controls to match the state of the battery connection.
    updateBatteryConnectivity: function() {

      var isConnected = this.circuit.batteryConnected;

      // visible when battery is connected
      this.topWireNode.visible = isConnected;
      this.bottomWireNode.visible = isConnected;

      //this.topCurrentIndicatorNode.setVisible( isConnected );
      //this.bottomCurrentIndicatorNode.setVisible( isConnected );

      // plate charge control
      this.plateChargeControlNode.visible = !isConnected;

    }
  } );

} );