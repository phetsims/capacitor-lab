// Copyright 2015, University of Colorado Boulder

/**
 * Panel describing keyboard shortcuts used in accessibility mode
 *
 * @author Emily Randall
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var PANEL_TITLE_FONT = new PhetFont( { weight: 'bold', size: 18 } );
  var SHORTCUT_FONT = new PhetFont( 16 );
  var TITLE_VERTICAL_SPACE = 10;
  var OPTIONS_VERTICAL_SPACE = 8;

  // strings
  var keyDescriptionsTabString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.tab' );
  var keyDescriptionsEnterString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.enter' );
  var keyDescriptionsEscapeString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.escape' );
  var keyDescriptionsSpacebarString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.spacebar' );
  var keyDescriptionsArrowsString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.arrows' );
  var keyDescriptionsHString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.h' );
  var keyDescriptionsTitleString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.title' );
  var strings = [ keyDescriptionsTabString, keyDescriptionsEnterString, keyDescriptionsEscapeString, keyDescriptionsSpacebarString, keyDescriptionsArrowsString, keyDescriptionsHString ];

  /**
   * Constructor.
   *
   * @param {CapacitorLabBasicsModel} model
   * @constructor
   */
  function KeyboardHelpPanel( model ) {
    var titleText = new Text( keyDescriptionsTitleString, { font: PANEL_TITLE_FONT } );
    var tabText = new Text( keyDescriptionsTabString, { font: SHORTCUT_FONT } );
    var enterText = new Text( keyDescriptionsEnterString, { font: SHORTCUT_FONT } );
    var escapeText = new Text( keyDescriptionsEscapeString, { font: SHORTCUT_FONT } );
    var spacebarText = new Text( keyDescriptionsSpacebarString, { font: SHORTCUT_FONT } );
    var arrowText = new Text( keyDescriptionsArrowsString, { font: SHORTCUT_FONT } );
    var hText = new Text( keyDescriptionsHString, { font: SHORTCUT_FONT } );
    
    var helpBox = new LayoutBox( {
      children: [
        titleText,
        new VStrut( TITLE_VERTICAL_SPACE ),
        tabText,
        new VStrut( OPTIONS_VERTICAL_SPACE ),
        enterText,
        new VStrut( OPTIONS_VERTICAL_SPACE ),
        escapeText,
        new VStrut( OPTIONS_VERTICAL_SPACE ),
        spacebarText,
        new VStrut( OPTIONS_VERTICAL_SPACE ),
        arrowText,
        new VStrut( OPTIONS_VERTICAL_SPACE ),
        hText
      ],
      align: 'left'
    } );

    Panel.call( this, helpBox, {
      xMargin: 10,
      yMargin: 10,
      align: 'left',
      fill: CLConstants.METER_PANEL_FILL
    } );
    
    var thisNode = this;
    
    // add the accessible content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        
        var domElement = document.createElement( 'div' );
        domElement.id = 'help-' + trail.getUniqueId();
        thisNode.accessibleId = domElement.id;
        
        var title = document.createElement( 'h1' );
        title.innerHTML = keyDescriptionsTitleString;
        domElement.appendChild( title );
        title.id = keyDescriptionsTitleString;
        
        strings.forEach( function( s ) {
          var description = document.createElement( 'p' );
          description.innerHTML = s;
          domElement.appendChild( description );
          description.id = s;
        } );
        
        domElement.setAttribute( 'aria-describedby', keyDescriptionsTitleString );
        domElement.tabIndex = '-1';

        var accessiblePeer = new AccessiblePeer( accessibleInstance, domElement );
        return accessiblePeer;

      }
    };
    
    model.keyboardHelpVisibleProperty.linkAttribute( this, 'visible' );
    
  }

  capacitorLabBasics.register( 'KeyboardHelpPanel', KeyboardHelpPanel );
  
  return inherit( Panel, KeyboardHelpPanel );
} );