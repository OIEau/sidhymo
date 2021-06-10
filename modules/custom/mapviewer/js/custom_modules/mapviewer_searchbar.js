/*
 * Class searchbar
 */
var searchbar = function(searchbardiv, map_instance, resultable_instance){
    var localmap = new Object();
    var localresultable = new Object();
    var _this = this

    /*
     * initialise la searchbar avec les différentes emprises
     */
    this.construct = function(searchbardiv, map_instance, resultable_instance){
        localmap = map_instance;
        localresultable = resultable_instance;
        jQuery('#'+searchbardiv).select2({
            placeholder: "Sélectionnez une commune, une département, un cours d'eau...",
            language: "fr",
            allowClear: true,
            ajax: {
                url: config.url_searchemprise,
                dataType: 'json',
                data: function (params) {
                  var query = {
                    search: params.term ? params.term.replace("-"," ") : params.term,
                    territoire: localmap.territoire
                  }

                  // Query parameters will be ?search=[term]&type=public
                  return query;
                },
                // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
            }
        }).on('select2:select', function (e) {
            if(e.params.data.id) {
                splitchoice = e.params.data.id.split('.')
                _this.getEmpriseEtObjetDetude(splitchoice[0], splitchoice[1], e.params.data.text)
            }
        }).maximizeSelect2Height();

        jQuery('.select2').on('click', function () {
          jQuery('#notifications').html('');
          jQuery('.layer-switcher').removeClass('shown');
          jQuery('.layer-switcher').children().html("");
        })
    };

    /*
     * initialise les couches interactive, affiche l'emprise et les objets d'étude
     */
    this.getEmpriseEtObjetDetude = function(type, obj, layername) {
        jQuery('#bot_panel').hide()
        localresultable.initResultTable();
        initEmpriseEtObjetDetude();
        addEmprise(type, obj, layername)
        addObjetEtude(type, obj)
        _this.removeForeground()
    };

    this.removeForeground = function() {
    };
    /*
     * initialise les couches interactives
     */
    var initEmpriseEtObjetDetude = function() {
        while (map.getLayerGroup().getLayers().item(3).getLayers().getLength() > 0) {
            map.getLayerGroup().getLayers().item(3).getLayers().pop()
        }
    };

    /*
     * Ajout de la layer de l'objet d'emprise selectionnée
     */
    var addEmprise = function(type, obj, layername) {
        // On affiche la popup modal de chargement
        jQuery('#info_chargement_body').html('<p style="text-align: center;">Votre carte hydromorphologique de <b>"'+ layername +'"</b> est en cours de construction.<br><progress></progress></p>');

        /* Init */
        map.getLayerGroup().getLayers().item(3).getLayers().push(new ol.layer.Vector())
        /* Geojson de l'emprise */
        emprise_wfsurl = config.url_wfsemprise+"?SERVICE=WFS&REQUEST=getFeature&VERSION=2.0.0&srsName=epsg%3A4326&TYPENAME=sidhymo%3A"+type+"&outputFormat=application%2Fjson&FILTER=%3CFilter%20xmlns%3D%22http%3A%2F%2Fwww.opengis.net%2Fogc%22%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Egid%3C%2FPropertyName%3E%3CLiteral%3E"+obj+"%3C%2FLiteral%3E%3C%2FPropertyIsEqualTo%3E%3C%2FFilter%3E";
        jQuery.getJSON(emprise_wfsurl, function(data) {
            features = new ol.format.GeoJSON().readFeatures(data, {
                featureProjection: 'EPSG:3857'
            });

            /* Layer de l'emprise selectionnée */
            vectorSourceEmprise = new ol.source.Vector();
            vectorSourceEmprise.addFeatures(features);
            var vectorEmprise = new ol.layer.Vector({
                title: layername,
                type: 'emprise',
                source: vectorSourceEmprise,
                projection: 'EPSG:4326',
                style: localmap.styles.yellowStyle
            });

            // Zoomer
            map.getView().fit(vectorSourceEmprise.getExtent(), { duration: 1000 } );

            // Ajouter au groupe interactif la nouvelle layer
            map.getLayerGroup().getLayers().item(3).getLayers().removeAt(0);
            map.getLayerGroup().getLayers().item(3).getLayers().insertAt(0, vectorEmprise)

        });

    }


    /*
     * Ajout des objets d'étude qui recoupent l'emprise selectionnée
     */
    var addObjetEtude = function(typeEmprise, cdEmprise) {

        /* Initialiser les layers qui vont accueilir les couches. ajouter au groupe 'interactif' */
        config.array_objets_etude.forEach(function(typeObjetEtude){
            map.getLayerGroup().getLayers().item(3).getLayers().push(new ol.layer.Vector())
        });


        /* Pour chaque objet du tableau de configuration array_objets_etude */
        var countLoading = 0;
        config.array_objets_etude.forEach(function(typeObjetEtude, index){
            /* Récupérer et affiche le geojson des objets */
            objetdetude_url = config.url_searchobjet+"?emprise="+typeEmprise+"&gid="+cdEmprise+"&type="+typeObjetEtude.name;

            /* Ajouter une notification de chargement */
            // var notif = _this.addNotification('<b>Chargement des ' + typeObjetEtude.libelle + ' en cours...</b>',
            //                                   typeObjetEtude.name,
            //                                   typeObjetEtude.libelle,
            //                                   typeObjetEtude.name+'.png');
            jQuery('#info_chargement').modal();
            jQuery('#info_chargement_body').append('<span><img src="modules/custom/mapviewer/images/' + typeObjetEtude.name+ '.png" width="20" style="margin-right: 7px;"/> ' + typeObjetEtude.libelle + '<span id="encours_' + typeObjetEtude.name + '"> en cours de chargement...</span></span>');

            countLoading++; // Compteur de couches chargées
            jQuery.getJSON(objetdetude_url, function(data) {

                if(data && data.features) {
                    // S'il y a plus de 100 objets, on ne les affiche pas par défaut
                    // Pour ne pas faire ramer la carte
                    visibility = true
                    // if(data.features.length > 1000) {
                    //     // Le préciser dans une nouvelle notif
                    //     _this.addNotification('<b>Il y a plus de 1000 ' + typeObjetEtude.libelle + ' dans cette emprise, pour ne pas ralentir l\'outil cartographique la couche a donc été masquée par défaut.\
                    //                             Utilisez l\'outil de gestion de couche <img src="modules/custom/mapviewer/images/layerswit.png" width="20" style="margin: 2px;"/>\
                    //                             pour l\'afficher.</b>',
                    //                             typeObjetEtude.name+'_warn',
                    //                             typeObjetEtude.libelle,
                    //                             typeObjetEtude.name+'.png',
                    //                             false,
                    //                             true);
                    //     visibility = false
                    // }

                    // // Supprimer la notif de chargement
                    // notif.hide(3000, function() {
                    //     notif.remove();
                    // });


                    // Afficher sur la carte
                    features = new ol.format.GeoJSON().readFeatures(data, {
                        featureProjection: 'EPSG:3857'
                    });

                    /* Layer de l'emprise selectionnée */
                    vectorSourceObjet = new ol.source.Vector();
                    vectorSourceObjet.addFeatures(features);
                    var vectorObjet = new ol.layer.Vector({
                        title: typeObjetEtude.libelle,
                        visible: visibility,
                        type: 'objetdetude',
                        name: typeObjetEtude.name,
                        source: vectorSourceObjet,
                        projection: 'EPSG:4326',
                        style: typeObjetEtude.style ? typeObjetEtude.style : localmap.styles.blueStyle
                    });

                    // Ajouter au groupe interactif la nouvelle layer
                    map.getLayerGroup().getLayers().item(3).getLayers().removeAt(index+1);
                    map.getLayerGroup().getLayers().item(3).getLayers().insertAt(index+1, vectorObjet)

                    // Ajouter au tableau HTML
                    localresultable.appendToResultTable(typeObjetEtude, data)

                    //Popup info sur un element
                    map.on('pointermove', _this.showInfo);

                }
                else {
                    // notif.hide(1000, function() {
                    //     notif.remove();
                    // });
                    // console.log("Pas de "+type+ " trouvé")
                }

                jQuery('#encours_'+typeObjetEtude.name).html(' <b>chargé</b>.')
                countLoading--; // Compteur de couches chargées
                if (countLoading == 0) {
                    jQuery('#info_chargement').modal('hide')
                }
            });

        });
    }

    this.addNotification = function(message, type, lbtype, legende_png, showloader=true, autohide=false) {

        var html_notif = '\
        <div id="notif' + type + '" class="toast" style="z-index:1000;  margin: 2px;">\
            <div class="toast-header">\
                <img src="modules/custom/mapviewer/images/' + legende_png + '" width="20" style="margin-right: 7px;">\
                <strong class="mr-auto" id="notif'+type+'text">' + message + '</strong>';

        if(showloader) {
            html_notif += '<img src="https://miro.medium.com/max/1120/1*hShXr9hDtKxHbHe3jQ_DQw.gif" style="width: 90px;">';
        }

        html_notif += '\
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">\
                    <span aria-hidden="true">×</span>\
                </button>\
            </div>\
        </div>'

        jQuery('#notifications').append(html_notif)
        jQuery("#notif"+type).toast({autohide:autohide, delay: 100000})
        jQuery("#notif"+type).toast('show')
        return jQuery("#notif"+type);
    }

    ////////
    // Affiche une bulle sur une properties de la map
    ////////
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
      jQuery('#popup-info-content').html("<p>" + type + "</p><p class='text-center'>"+libelle+properties.gid+"</p>");
      map.getOverlayById(1).setPosition(coordinate);
    }

    /*
     * Pass options when class instantiated
     */
    this.construct(searchbardiv, map_instance, resultable_instance);


};
