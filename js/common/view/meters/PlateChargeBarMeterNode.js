// Copyright 2016-2020, University of Colorado Boulder

/**
 * BarMeterNode subclass that implements a custom setValue method
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import CLBConstants from '../../CLBConstants.js';
import BarMeterNode from './BarMeterNode.js';

/**
 * @constructor
 *
 * @param {BarMeter} meter
 * @param {string} barColor - fill color of the BarMeter
 * @param {number} maxValue - model value at which the bar has max length
 * @param {string} unitsString - string representing units
 * @param {string} titleString - title string for the bar graph
 * @param {Tandem} tandem
 */
function PlateChargeBarMeterNode( meter, barColor, maxValue, unitsString, titleString, tandem ) {
  BarMeterNode.call( this, meter, barColor, maxValue, unitsString, titleString, tandem );
}

capacitorLabBasics.register( 'PlateChargeBarMeterNode', PlateChargeBarMeterNode );

inherit( BarMeterNode, PlateChargeBarMeterNode, {

  /**
   * This meter displays absolute value, and changes color to indicate positive or negative charge.
   *
   * @param {number} value
   * @public
   * @override
   */
  setValue: function( value ) {
    BarMeterNode.prototype.setValue.call( this, Math.abs( value ) );
    this.setBarColor( ( value >= 0 ) ? CLBConstants.POSITIVE_CHARGE_COLOR : CLBConstants.NEGATIVE_CHARGE_COLOR );
  }
} );

export default PlateChargeBarMeterNode;