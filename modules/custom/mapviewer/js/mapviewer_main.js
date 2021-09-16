/* https://joebuckle.me/quickie/jquery-create-object-oriented-classes-in-jquery/ */

var config = {
    url_searchemprise : 'searchemprise',
    url_wfsemprise : 'https://sidhymo.recette.oieau.fr/ows',
    url_searchobjet : 'searchobjet',
    url_gettableterritoires : 'gettableterritoires',
    array_objets_etude  : [
                            {
                                // type : 'wms', /* possibilité de définir un type WMS pas encore active, mais en cours de développement */ 
                                type : 'wfs',
                                name : 'usra',
                                libelle : 'Unité Spatiale de Recueil et d\'Analyse (USRA)',
                                code : 'code',
                                typeStyle: 'MultiLineString',
                                style : [
                                    new ol.style.Style({
                                        /* Les traits, en bleu un peu épais */
                                        stroke: new ol.style.Stroke({
                                            lineCap: 'round',
                                            color: 'rgba(6, 214, 160, 0.9)',
                                            width: 7
                                        }),
                                        /* Couleur de remplissage */
                                        // fill: new ol.style.Fill({
                                        //     color: [61, 96, 152, 0.5]
                                        // }),
                                        zIndex: 10
                                    }),
                                ]
                            },
                            {
                                // type : 'wms',
                                type : 'wfs',
                                name : 'tgh',
                                libelle : 'Tronçon Geomorphologiquement Homogène (TGH)',
                                code: 'code',
                                typeStyle: 'MultiLineString',
                                style : [
                                    new ol.style.Style({
                                        /* Les traits, en bleu un peu épais */
                                        stroke: new ol.style.Stroke({
                                            lineCap: 'round',
                                            color: 'rgba(17, 138, 178, 0.9)',
                                            width: 4
                                        }),
                                        /* Couleur de remplissage */
                                        // fill: new ol.style.Fill({
                                        //     color: [61, 96, 152, 0.5]
                                        // }),
                                        zIndex: 10
                                    }),
                                ]
                            },
                            {
                                type : 'wfs',
                                name: 'roe',
                                libelle: 'Obstacle à l\'écoulement',
                                code : 'cdobstecou',
                                typeStyle: 'MultiPoint',
                                style: [
                                    new ol.style.Style({
                                        image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                                            anchor: [12.5, 39],
                                            src: 'modules/custom/mapviewer/images/marker-shadow.png',
                                            anchorXUnits: 'pixels',
                                            anchorYUnits: 'pixels',
                                            opacity: 0.50,
                                            scale: 0.5,
                                        }),
                                        zIndex: 9
                                    }),
                                    new ol.style.Style({
                                        /* Les points seront des puces bleues (une image) */
                                        image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                                            anchor: [12.5, 39],
                                            src: 'modules/custom/mapviewer/images/roe.png',
                                            anchorXUnits: 'pixels',
                                            anchorYUnits: 'pixels',
                                            opacity: 0.50,
                                            scale: 0.5,
                                        }),
                                        zIndex: 10
                                    })
                                ]
                            },
                            {
                                type : 'wfs',
                                name: 'roeice',
                                libelle: 'Obstacle à l\'écoulement ICE',
                                code : 'identifiant_roe',
                                typeStyle: 'MultiPoint',
                                style: [
                                    new ol.style.Style({
                                        image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                                            anchor: [12.5, 39],
                                            src: 'modules/custom/mapviewer/images/marker-shadow.png',
                                            anchorXUnits: 'pixels',
                                            anchorYUnits: 'pixels',
                                            opacity: 0.90,
                                        }),
                                        zIndex: 9
                                    }),
                                    new ol.style.Style({
                                        /* Les points seront des puces bleues (une image) */
                                        image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                                            anchor: [12.5, 39],
                                            src: 'modules/custom/mapviewer/images/roeice.png',
                                            anchorXUnits: 'pixels',
                                            anchorYUnits: 'pixels',
                                            opacity: 0.90,
                                        }),
                                        zIndex: 10
                                    })
                                ]
                            },
                            {
                                type : 'wfs',
                                name: 'stcarhyce',
                                libelle: 'Station de mesure Carhyce',
                                code : 'code_station',
                                typeStyle: 'MultiPoint',
                                style: [
                                    new ol.style.Style({
                                        image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                                            anchor: [12.5, 39],
                                            src: 'modules/custom/mapviewer/images/marker-shadow.png',
                                            anchorXUnits: 'pixels',
                                            anchorYUnits: 'pixels',
                                            opacity: 0.90,
                                        }),
                                        zIndex: 9
                                    }),
                                    new ol.style.Style({
                                        /* Les points seront des puces bleues (une image) */
                                        image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                                            anchor: [12.5, 39],
                                            src: 'modules/custom/mapviewer/images/stcarhyce.png',
                                            anchorXUnits: 'pixels',
                                            anchorYUnits: 'pixels',
                                            opacity: 0.90,
                                        }),
                                        zIndex: 10
                                    })
                                ]
                            }
                          ]
};

jQuery(document).ready(function() {
    // Construct
    fichehandler2 = new fichehandler();
    map2 = new map('map', fichehandler2);
    resultable2 = new resultable(map2, fichehandler2);
    searchbar2 = new searchbar('searchbar', map2, resultable2);
    fichehandler2.setLocalSearchBar(searchbar2);

    // do
    map2.initemprisesgeo(resultable2);
    map2.addLayerSwitcher();
    map2.ficheControler();
    map2.highlightControler();
    map2.addLegend();
    map2.addLayerSelection();
    map2.addFileUploadController();
    
    // Hauteur de la map
    var taille=jQuery('.path-frontpage').height()-jQuery('#header-menu').height()-parseInt(jQuery('#header-brand').css('padding-top'))-jQuery('#header-brand').height()-1
    jQuery('#map').css('height',taille+"px");
});

/* Redimensionner la carte lors du redimensionnement de la fenêtre */
jQuery( window ).resize(function() {
  var taille=jQuery('.path-frontpage').height()-jQuery('#header-menu').height()-parseInt(jQuery('#header-brand').css('padding-top'))-jQuery('#header-brand').height()-1
  jQuery('#map').css('height',taille+"px");
});
