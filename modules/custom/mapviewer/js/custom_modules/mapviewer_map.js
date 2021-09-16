/*
 * mapviewer
 */
var map = function(mapDiv, fichehandler_instance){
    var root = this;
    var localfichehandler = new Object();
    _this = this;

    this.territoire = "met";

    this.styles = {
        hoverroeiceStyle: [
            new ol.style.Style({
                /* Les points seront des puces bleues (une image) */
                image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                    anchor: [12.5, 39],
                    src: 'modules/custom/mapviewer/images/roe_red.png',
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 0.90,
                }),
                zIndex: 10
            }),
            new ol.style.Style({
                image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                    anchor: [12.5, 39],
                    src: 'modules/custom/mapviewer/images/marker-shadow.png',
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 0.90,
                }),
                zIndex: 9
            })
        ],
        hoverroeStyle: [
            new ol.style.Style({
                /* Les points seront des puces bleues (une image) */
                image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                    anchor: [12.5, 39],
                    src: 'modules/custom/mapviewer/images/roe_red.png',
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 0.50,
                    scale: 0.5,
                }),
                zIndex: 10
            }),
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
            })
        ],
        hoverstcarhyceStyle: [
            new ol.style.Style({
                /* Les points seront des puces bleues (une image) */
                image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                    anchor: [12.5, 39],
                    src: 'modules/custom/mapviewer/images/stcarhyce_red.png',
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 0.90,
                }),
                zIndex: 10
            }),
            new ol.style.Style({
                image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                    anchor: [12.5, 39],
                    src: 'modules/custom/mapviewer/images/marker-shadow.png',
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 0.90,
                }),
                zIndex: 9
            })
        ],
        blueStyle : [
            new ol.style.Style({
                /* Les points seront des puces bleues (une image) */
                image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                    anchor: [12.5, 39],
                    src: 'https://unpkg.com/leaflet@1.0.1/dist/images/marker-icon.png',
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 0.90,
                }),
                /* Les traits, en bleu un peu épais */
                stroke: new ol.style.Stroke({
                    lineCap: 'round',
                    color: 'rgba(3, 85, 145, 0.7)',
                    width: 4
                }),
                /* Couleur de remplissage */
                fill: new ol.style.Fill({
                    color: [61, 96, 152, 0.5]
                }),
                zIndex: 10
            }),
            new ol.style.Style({
                image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                    anchor: [12.5, 39],
                    src: 'https://unpkg.com/leaflet@1.0.1/dist/images/marker-shadow.png',
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 0.90,
                }),
                zIndex: 9
            })
        ],
        redStyle : [
            new ol.style.Style({
                /* Les points seront des puces bleues (une image) */
                image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                    anchor: [12.5, 39],
                    src: 'modules/custom/mapviewer/images/marker-icon-red.png',
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 1,
                }),
                /* Les traits, en bleu un peu épais */
                stroke: new ol.style.Stroke({
                    lineCap: 'round',
                    color: 'rgba(220, 90, 90, 1)',
                    width: 5
                }),
                /* Couleur de remplissage */
                fill: new ol.style.Fill({
                    color: [220, 90, 90, 1]
                }),
                zIndex: 10
            }),
            new ol.style.Style({
                image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                    anchor: [12.5, 39],
                    src: 'https://unpkg.com/leaflet@1.0.1/dist/images/marker-shadow.png',
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 0.90,
                }),
                zIndex: 9
            })
        ],
        yellowStyle: [
            new ol.style.Style({
                /* Les points seront des puces bleues (une image) */
                // image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                //     anchor: [12.5, 39],
                //     src: 'https://unpkg.com/leaflet@1.0.1/dist/images/marker-icon.png',
                //     anchorXUnits: 'pixels',
                //     anchorYUnits: 'pixels',
                //     opacity: 0.90,
                // }),
                /* Les traits, en bleu un peu épais */
                stroke: new ol.style.Stroke({
                    lineCap: 'round',
                    color: 'rgba(0, 0, 100, 0.4)',
                    width: 8
                }),
                /* Couleur de remplissage */
                fill: new ol.style.Fill({
                    // color: [255, 255, 0, 0.2]
                    color: [0, 0, 0, 0.1]
                }),
                zIndex: 10
            }),
            new ol.style.Style({
                image: new ol.style.Icon({ /** @type {olx.style.IconOptions} */
                    anchor: [12.5, 39],
                    src: 'https://unpkg.com/leaflet@1.0.1/dist/images/marker-shadow.png',
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    opacity: 0.90,
                }),
                zIndex: 9
            })
        ],
        circleStyle: [
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 4,
                    fill: new ol.style.Fill({
                        color: 'orange'
                    }),
                    stroke: new ol.style.Stroke({
                        color: [255, 255, 255],
                        width: 1
                    })
                })
            })
        ]
    }

    /*
     * Constructor
     */
    this.construct = function(mapDiv, fichehandler_instance){
        // jQuery("#loader").show();
        localfichehandler = fichehandler_instance
        /* WMS du Sandre */
        // Cours d'eau
        var wmsCoursEauSource = new ol.source.TileWMS({
            url: 'https://services.sandre.eaufrance.fr/geo/sandre',
            params: {
                'LAYERS': 'CoursEau_classe1,CoursEau_classe2,CoursEau_classe3,CoursEau_classe4,CoursEau_classe5,CoursEau_classe6,CoursEau_classe7'
            },
            crossOrigin: 'anonymous'
        });
        var wmsCoursEau = new ol.layer.Tile({
            title: 'Cours d\'eau',
            type: 'sandre',
            className: 'sandre',
            visible: false,
            source: wmsCoursEauSource,
        });
        // Plan d'eau
        var wmsPlanEauSource = new ol.source.TileWMS({
            url: 'https://services.sandre.eaufrance.fr/geo/sandre',
            params: {
                'LAYERS': 'PlanEau'
            },
            crossOrigin: 'anonymous'
        });
        var wmsPlanEau = new ol.layer.Tile({
            title: 'Plans d\'eau',
            type: 'sandre',
            className: 'sandre',
            visible: false,
            source: wmsPlanEauSource
        });

        var Troncons_SYRAH = new ol.layer.Tile({
            title: 'TGH - Tronçon Geomorphologiquement Homogène',
            type: 'hydromorpho',
            className: 'hydromorpho',
            visible: false,
            source: new ol.source.TileWMS({
                // url: 'https://maps.oieau.fr/ows/OIEau/ami_hydromorpho',
                url :'https://sidhymo.recette.oieau.fr/ows/',
                params: {
                    // 'LAYERS': 'Troncons_SYRAH'
                    'LAYERS': 'tgh',
                    'TILED': true,
                },
                crossOrigin: 'anonymous'
            })
        });
        var USRA_SYRAH = new ol.layer.Tile({
            title: 'USRA - Unité Spatiale de Recueil et d\'Analyse',
            type: 'hydromorpho',
            className: 'hydromorpho',
            visible: false,
            source: new ol.source.TileWMS({
                // url: 'https://maps.oieau.fr/ows/OIEau/ami_hydromorpho',
                url :'https://sidhymo.recette.oieau.fr/ows/',
                params: {
                    // 'LAYERS': 'USRA_SYRAH'
                    'LAYERS': 'usra',
                    'TILED': true
                },
                crossOrigin: 'anonymous'
            })
        });
        var roe = new ol.layer.Tile({
            title: 'Obstacles à l\'écoulement',
            type: 'hydromorpho',
            className: 'hydromorpho',
            visible: false,
            source: new ol.source.TileWMS({
                // url: 'https://maps.oieau.fr/ows/OIEau/ami_hydromorpho',
                url: 'https://sidhymo.recette.oieau.fr/ows/',
                params: {
                    'LAYERS': 'roe',
                    'TILED': true
                },
                crossOrigin: 'anonymous'
            })
        });

        var ied_carhyce = new ol.layer.Tile({
            title: 'Stations de mesure Carhyce',
            type: 'hydromorpho',
            className: 'hydromorpho',
            visible: false,
            source: new ol.source.TileWMS({
                // url: 'https://maps.oieau.fr/ows/OIEau/ami_hydromorpho',
                url: 'https://sidhymo.recette.oieau.fr/ows/',
                params: {
                    'LAYERS': 'stcarhyce',
                    'TILED': true
                },
                crossOrigin: 'anonymous'
            })
        });
        /* Layer des entites cliquées */


        /* Openstreetmap  Layers */
         var olLayer = [new ol.layer.Tile({
             title: 'Open street map',
             visible: true,
             type: 'base',
             source: new ol.source.OSM()
         })];
        /*var olLayer = [new ol.layer.Tile({
            title: 'Open street map',
            visible: true,
            type: 'base',
            source: new ol.source.XYZ({
                url: 'https://{a-c}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
                crossOrigin: 'anonymous'
            })
        })];*/
        var openTopo = [new ol.layer.Tile({
            title: 'Open Topo',
            type: 'base',
            visible: false,
            source: new ol.source.XYZ({
                url: '//{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
                // crossOrigin: 'anonymous'
            })
        })];
        /* Fond blanc */
        var whiteLayer = [new ol.layer.Tile({
            title: 'Fond blanc',
            visible: true,
            type: 'base',
            contrast: 0,
            brightness: 1
        })];
        /* Stamen Layer*/
        var stamenTerrain = [new ol.layer.Tile({
            title: 'Terrain en relief',
            type: 'base',
            visible: false,
            source: new ol.source.Stamen({
                layer: 'terrain'
            })
        })];
        /* Stamen Layer*/
        var stamenToner = [new ol.layer.Tile({
            title: 'Noir et blanc',
            type: 'base',
            visible: false,
            source: new ol.source.Stamen({
                layer: 'toner'
            })
        })];
        /* Maintenant on place tout ça dans un objet carte */
        var fondDeCarte = []
        map = new ol.Map({
            controls: ol.control.defaults().extend([
                new ol.control.FullScreen({tipLabel: "Mettre en plein écran"}),
                new ol.control.ScaleLine()
            ]),
            projection: 'EPSG:3857',
            layers: [new ol.layer.Group({
                    'title': 'Fond de carte',
                    layers: fondDeCarte.concat(whiteLayer, stamenTerrain, stamenToner, openTopo, olLayer /*bingLayers,*/ )
                }),
                new ol.layer.Group({
                    title: 'Couches Sandre',
                    layers: [wmsPlanEau, wmsCoursEau]
                }),
                new ol.layer.Group({
                    title: 'Couche personalisée',
                    layers: []
                }),
                new ol.layer.Group({
                    title: 'Couches hydromorphologiques',
                    layers: [/*ind_base_bio_SYRAH, ind_physique_SYRAH, ind_physique_ME, ind_base_bio_ME,*/ USRA_SYRAH, Troncons_SYRAH, ied_carhyce, roe]
                }),
                new ol.layer.Group({
                    title: 'Couches interactives',
                    layers: []
                }),
            ],
            overlays:[
              new ol.Overlay({
                id : 1,
                element: document.getElementById('popup-info'),
                autoPan: true,
                autoPanAnimation: {
                  duration: 250,
                },
              })
            ],
            target: document.getElementById(mapDiv),
            view: new ol.View({
                // center: [195678.79241, 5690971.749164],
                center: [308194.0980,5876478.7346],
                // extent: [-728903.5017,5041174.8895,1345291.6978,6709336.5948],
                maxZoom: 17,
                zoom: 6
            })
        });
        selectedFeature = new ol.Feature();

        // Evenement sur la map : on modifie le curseur
        eventCursorOnMap()
    }


    /*
     * Choix d'une emprise géo DOM / TOM
     */
    this.initemprisesgeo = function(resultable) {
      jQuery.getJSON(config.url_gettableterritoires, function(data) {
        for (var colonne in data) {
          for (var value in data[colonne]) {
            addEventTerritoire(value,data[colonne][value],resultable)
          }
        }
      });
    }

    var addEventTerritoire = function(territoire, geojson, resultable){
      jQuery('#'+territoire).on('click', function (e) {
        //remet à zero le tableau
        resultable.initResultTable();
        //Efface la recherche
        jQuery('#searchbar').html("");
        // Efface la map
        map.getLayerGroup().getLayers().item(4).getLayers().clear()

        root.territoire = territoire

        features = new ol.format.GeoJSON().readFeatures(geojson, {
          featureProjection: 'EPSG:3857'
        });

        /* Layer de l'emprise selectionnée */
        vectorSourceEmprise = new ol.source.Vector();
        vectorSourceEmprise.addFeatures(features);

        // Zoomer   
        map.getView().fit(vectorSourceEmprise.getExtent(), { duration: 1000 } );
      });
    }

    /*
     * Ajout du controle pour changer les différentes couches ajoutées à la carte
     */
    this.addLayerSwitcher = function() {
        layerSwitcher = new ol.control.LayerSwitcher({
            tipLabel: 'Gestion des couches',
            className: 'sandreSwitcher',
            activationMode: 'click',
            tipLabel: "Cliquez pour afficher le panneau de gestion des couches.",
            show_progress:true,
            extent: true,
            trash: true
        });
        map.addControl(layerSwitcher);
    }

    /**
     * Ajoute une liste déroulante de selection de couche Sandre
     * au panneau de gestion des couches
     */
    this.addLayerSelection = function() {
        // Add a select input to allow setting the groupSelectStyle style
        function createOption(name, text) {
            var option = document.createElement("option");
            option.value = name;
            option.text = text;
            return option;
        }

        function createOptGroup(name) {
            var optgroup = document.createElement("optgroup");
            optgroup.label = name;
            return optgroup;
        }

        // Créer une liste déroulante
        var container = document.createElement('div');
        container.className = 'ol-unselectable ol-control add-layer-control';
        var select = document.createElement('select');
        select.id = 'group-select-style-input';
        container.appendChild(select);

        // Remplir cette liste avec la liste des layers sandre dispo en WMS
        var parser = new ol.format.WMSCapabilities();
        fetch('https://services.sandre.eaufrance.fr/geo/sandre?REQUEST=getCapabilities&service=WMS').then(function(response) {
            return response.text();
        }).then(function(text) {
            var result = parser.read(text);
            result.Capability.Layer.Layer.forEach((layer, index) => {
                optgroup = createOptGroup(layer.Title);
                if(layer.Layer != undefined) {
                    layer.Layer.forEach((sslayer, index) => {
                        optgroup.appendChild(createOption(sslayer.Name, sslayer.Title));
                    })
                    select.add(optgroup);
                }
            })
        });

        // Ajouter la liste déroulante sur la carte
        jQuery('.ol-overlaycontainer').prepend(container);

        // Clic sur une layer dans la liste
        select.onchange = function(e) {
            e.stopImmediatePropagation();

            wmsource = new ol.source.TileWMS({
                url: 'https://services.sandre.eaufrance.fr/geo/sandre',
                params: {
                    LAYERS: select.value,
                    TILED: true
                },
                crossOrigin: 'anonymous'
            })
            wmslayer = new ol.layer.Tile({
                title: jQuery("#group-select-style-input option:selected").text(),
                source: wmsource,
                type: 'sandre',
                visible: true,
            })

            // ajouter la layer
            map.getLayerGroup().getLayers().item(1).getLayers().push(wmslayer);

            layerSwitcher.renderPanel();
        };
    }


    /**
     * Lors d'un clic sur la carte et qu'il y a des features on les affiche dans la fiche
     */
    this.ficheControler = function() {
        map.on('singleclick', function(evt) {
            // Pour les WFS
            var feature = ""
            var layer = ""

            // init popup
            var featureArray = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
                return [feature, layer];
            }, {
                hitTolerance: 5
            });
            if(featureArray) {
                feature = featureArray[0]
                layer = featureArray[1]
            }

            // S'il y a une feature a cet endroit on popup
            if (feature && layer.values_.type == 'objetdetude') {
                // selectFeaturesAndPopup(feature, layer);
                localfichehandler.createfiche(root.territoire, layer.values_.name, feature.values_.code)
                return; // Si on a un WFS on s'arrète là.
            }

            // Pour les WMS
            var wmsSource = map.forEachLayerAtPixel(evt.pixel, function (layer, color) {
                if (layer.values_.type == 'objetdetude'  || layer.values_.type == 'hydromorpho' ) {
                    return layer.getSource();
                }
                else {
                    return undefined;
                }
            }, {hitTolerance:5});
            
            if(wmsSource != undefined) {
                var viewResolution = /** @type {number} */ (map.getView().getResolution());
                
                var url = wmsSource.getFeatureInfoUrl(
                    evt.coordinate,
                    viewResolution,
                    'EPSG:3857',
                    {'INFO_FORMAT': 'application/json'}
                );

                if (url) {
                    jQuery.getJSON(url, function (data) {
                        splitchoice = data.features[0].id.split('.')
                        typeobj = splitchoice[0];
                        for (var variable in config.array_objets_etude) {
                            if (config.array_objets_etude[variable].name==typeobj) {
                              codeobj= data.features[0].properties[config.array_objets_etude[variable].code]
                              // Ouvri la fiche
                              localfichehandler.createfiche(root.territoire, typeobj, codeobj)
                              break;
                            }
                         }
                    });
                }
            }
        });
    }

    /**
     * Lors d'un survol la carte et qu'il y a des features on les surligne en rouge
     */
    this.highlightControler = function () {
        var highlightStyle = new ol.style.Style({
         stroke: new ol.style.Stroke({
           width: 3,
           color: 'yellow'
         }),
         fill: new ol.style.Fill()
        });

        var selectedFeature = null;
        var selectedFeatureOldStyle = null;
        map.on('pointermove', function(evt) {
            //Popup info sur un element
            _this.showInfo(evt);

            if (!evt.dragging) {
                // Pour les WMS
                var hitwms = map.forEachLayerAtPixel(evt.pixel, function (layer, color) {
                    return (layer.values_.type == 'objetdetude'  || layer.values_.type == 'hydromorpho' )
                }, {hitTolerance:5});
                
                // pour les WFS 
                var feature = ""
                var layer = ""

                // S'il y a déja quelque chose de stylé alors on l'annule
                if(selectedFeature != null) {
                    selectedFeature.setStyle(selectedFeatureOldStyle)
                    selectedFeature = null;
                    selectedFeatureOldStyle = null;
                }

                // init popup
                var featureArray = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
                    return [feature, layer];
                }, {
                    hitTolerance: 5
                });

                if(featureArray) {
                    feature = featureArray[0]
                    layer = featureArray[1]
                }

                // S'il y a une feature a cet endroit on highlight
                if (feature && layer.values_.type == 'objetdetude') {
                    map.getTargetElement().style.cursor  = 'pointer';
                    // Enregistrer le style et la feature pour annuler plus tard
                    selectedFeature = feature;
                    selectedFeatureOldStyle = feature.getStyle();
                    layername = layer.get('name');
                    // Changer le style de l'actuelle
                    if(eval('root.styles.hover'+layername+'Style')) {
                        feature.setStyle(eval('root.styles.hover'+layername+'Style'));
                    }
                    else {
                        feature.setStyle(root.styles.redStyle);
                    }
                    feature.changed();
                }
                else if(hitwms) {
                    map.getTargetElement().style.cursor  = 'pointer';
                }
                else {
                    map.getTargetElement().style.cursor  =  ''
                }
            }
        });

    }

    /* Affiche une bulle sur une properties de la map */
    this.showInfo = function (event) {
        var features = map.getFeaturesAtPixel(event.pixel);
        if (features.length == 0) {
          map.getOverlayById(1).setPosition(undefined);
          return;
        }
  
        var properties = features[0].getProperties();
  
        if (properties.type==undefined) {
          map.getOverlayById(1).setPosition(undefined);
          return;
        }
  
        properties.libelle==null? libelle="" : libelle=properties.libelle+" - "
        type = properties.type.toLowerCase().split("_")[0];
        for (var variable in config.array_objets_etude) {
          if (config.array_objets_etude[variable].name==type) {
            type=config.array_objets_etude[variable].libelle
            break
          }
        }
  
        var coordinate = event.coordinate;
        jQuery('#popup-info-content').html("<p style='text-align: center;font-weight: bold;'>" + type + "</p><p class='text-center'>"+libelle+properties.gid+"</p>");
        map.getOverlayById(1).setPosition(coordinate);
    }
    
    /* Légende de la carte  */
    this.addLegend = function () {
        // Define a new legend
        var legend = new ol.legend.Legend({ 
            title: 'Légende',
            margin: 10
        });
        var legendCtrl = new ol.control.Legend({
            legend: legend,
            collapsed: true
        });
        map.addControl(legendCtrl);
        
        // Pour chaque style défini pour les objets d'étude
        config.array_objets_etude.forEach(function(typeObjetEtude, i) {
            legend.addItem({ 
                title: typeObjetEtude.libelle, 
                typeGeom: typeObjetEtude.typeStyle,
                style: typeObjetEtude.style
            });
        });
    }

    /* Ajout de couche externe geojson en drag and drop  */
    this.addFileUploadController = function () {
        
        // Créer le bouton
        var container = document.createElement('div');
        container.className = 'ol-unselectable ol-control upload-file-control';
        
        var button = document.createElement('button')
        button.title = "Cliquez pour ajouter des données issues d'un fichier geojson";
        button.id = "upload-file-button";
        container.appendChild(button);
        
        // Ajouter à la carte
        jQuery('.ol-overlaycontainer').prepend(container);

        //  En cas de clic sur le bouton
        jQuery(button).on('click', function (e) {
            jQuery('#info_chargement').modal();
            jQuery('#info_chargement_body').html('<div id="uploadbox"><p style="text-align: center">Veuillez glisser et déposer votre fichier geojson ci-dessous</p></div>');
        });

        // Creation du drag and drop (le bouton etc ci dessus ne servent à rien d'autre qu'a montrer a l'utilisateur qu'il peut drag and droper sur la carte.
        var dd = new ol.interaction.DropFile({
        /*
        formatConstructors: [
            ol.format.GPX,
            ol.format.GeoJSON,
            ol.format.GeoJSONX,
            ol.format.IGC,
            ol.format.KML,
            ol.format.TopoJSON
        ]
        */
        });

        // Ajout du drag and drop à la carte 
        map.addInteraction (dd);
        
        // Tableau de vecteurs chargés
        var dropedVectorArray = Array();

        // Drag and drop
        dd.on ('loadstart', function (e) {
            // Modal d'info de chargement en cours
            jQuery('#info_chargement').modal();
            jQuery('#info_chargement_body').html('<p style="text-align: center;">Votre fichier est en cours de chargement.<br><progress></progress></p>');
            
            // Creation du vecteur et ajout au tableau
            dropedVectorArray[e.file.name] =  new ol.source.Vector();

            // var vectorSource = new ol.source.Vector();
            var vector = new ol.layer.Vector({
                title: e.file.name,
                source: dropedVectorArray[e.file.name],
            });
            // var newStyle = new ol.style.Style();
            // newStyle = root.styles.blueStyle;
            // function random_rgba() {
            //     var o = Math.round, r = Math.random, s = 200;
            //     return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ', 0.7)';
            // }
            // var color = random_rgba();
            
            // newStyle[0].stroke_.color_ = color
            vector.setStyle (root.styles.blueStyle);
            map.getLayerGroup().getLayers().item(2).getLayers().push(vector);
        });

        // En cas d'ajout de feature sur la carte par drag and drop 
        dd.on ('addfeatures', function(event) {
            jQuery('#info_chargement_body').html('<p style="text-align: center;">Votre fichier est en cours de chargement.<br><progress></progress></p>');

            setTimeout(function(){
                dropedVectorArray[event.file.name].addFeatures(event.features);
        
                // if (!jQuery("#zoomto").prop('checked')) return;
                var vext = map.getView().getProjection().getExtent();
                var extent = dropedVectorArray[event.file.name].getExtent();
                if (extent[0]<vext[0]) extent[0] = vext[0];
                if (extent[1]<vext[1]) extent[1] = vext[1];
                if (extent[2]>vext[2]) extent[2] = vext[2];
                if (extent[3]>vext[3]) extent[3] = vext[3];
                map.getView().fit(extent, map.getSize());
            },500);
        });
        
        // Fin de chargement, on fait disparaitre la modal et on la vide 
        dd.on ('loadend', function (e) {
            setTimeout(function(){
                jQuery('#info_chargement').modal('hide');
                jQuery('#info_chargement_body').html('');
            },500);
        });
    }
    
    var eventCursorOnMap = function() {
        jQuery(".map").on('mousedown', function() {
          jQuery("canvas").css('cursor' , 'grabbing');
        })
        jQuery(".map").on('mouseup', function() {
          jQuery("canvas").css('cursor' , '');
        })

        jQuery(".map").on('wheel', function(event){
          if(event.originalEvent.deltaY < 0){
            //up
            jQuery("canvas").css('cursor' , 'zoom-in');
          }
          else {
            //down
            jQuery("canvas").css('cursor' , 'zoom-out');
          }
          setTimeout(() => {  jQuery("canvas").css('cursor' , ''); }, 500);
        });
    }

    /*
     * Pass options when class instantiated
     */
    this.construct(mapDiv, fichehandler_instance);

};
