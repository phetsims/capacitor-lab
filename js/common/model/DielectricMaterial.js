// Copyright 2015, University of Colorado Boulder

/**
 * Base class and subclasses for dielectric materials. All subclasses for "real" materials are immutable.
 * The subclass for a "custom" material has a mutable dielectric constant.
 *
 * NOTE: Air is the only dielectric material needed for now. Dielectrics not being ported at this time.
 * However, a basic custom dielectric is used to calculate the maximum number of charges possible on a capacitor.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  function DielectricMaterial( name, dielectricConstant, color, tandem ) {

    // @public (read-only)
    this.name = name;
    this.color = color;
    this.dielectricConstant = dielectricConstant;

  }

  capacitorLabBasics.register( 'DielectricMaterial', DielectricMaterial );

  return inherit( Object, DielectricMaterial, {}, {

    Air: new DielectricMaterial( 'air', CLBConstants.EPSILON_AIR, CLBConstants.AIR_COLOR ),

    CustomDielectricMaterial: function( dielectricConstant ) {
      return new DielectricMaterial( 'Custom', dielectricConstant, CLBConstants.CUSTOM_DIELECTRIC_COLOR );
    }

  } );
} );

