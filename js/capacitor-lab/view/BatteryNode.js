//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var HSlider = require( 'SUN/HSlider' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  
  // images
  var batteryUpImage = require( 'image!CAPACITOR_LAB/battery_3D_up.svg' );
  var batteryDownImage = require( 'image!CAPACITOR_LAB/battery_3D_down.svg' );

  function BatteryNode(model, options) {
    Image.call( this, batteryUpImage, options );
    var thisNode = this;
    var slider = new HSlider(model.voltageProperty, {min: -1.5, max: 1.5}, {
      x: 415,
      y: 375,
      rotation: Math.PI / -2,
      majorTickLength: 20
    });
    var labelOptions = {fill: '#ffffff', rotation: Math.PI / 2, scale: 1.2};
    var topLabel = new HTMLText("<b>1.5 V</b>", labelOptions);
    var midLabel = new HTMLText("<b>0 V</b>", labelOptions);
    var bottomLabel = new HTMLText("<b>-1.5 V</b>", labelOptions);
    slider.addMajorTick(1.5, topLabel);
    slider.addMajorTick(0, midLabel);
    slider.addMajorTick(-1.5, bottomLabel);
    this.addChild(slider);
    
    model.voltageProperty.link( function () {
      if (model.voltageProperty.value < 0) {
        thisNode.setImage(batteryDownImage);
      }
      if (model.voltageProperty.value >= 0) {
        thisNode.setImage(batteryUpImage);
      }
      model.updateCapacitanceAndCharge();
    });
  }
  
  return inherit( Image, BatteryNode);
} );