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
            placeholder: "Recherchez une commune, une département, un cours d'eau...",
            language: "fr",
            dropdownCssClass: "select_tooltip",
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
        }).on('select2:open', function(e)  {
            jQuery('#select2-searchbar-results').attr("data-toggle", "tooltip");
            jQuery('#select2-searchbar-results').attr("data-placement", "auto");
            jQuery('#select2-searchbar-results').attr("data-offset", "100");
            jQuery('#select2-searchbar-results').attr("title", "Seuls les 5 premiers éléments de chaque groupe sont affichés par défaut. Faites une recherche dans le champ texte ci-dessus pour en choisir d'autres.");
            jQuery('[data-toggle="tooltip"]').tooltip({
                track : true, 
                show: {
                    delay: 1000
                }
            });
        }).maximizeSelect2Height();




        // Inutile ? 
        // jQuery('.select2').on('click', function () {
        //   jQuery('.layer-switcher').removeClass('shown');
        //   jQuery('.layer-switcher').children().html("");
        // })
    };

    /*
     * initialise les couches interactive, affiche l'emprise et les objets d'étude
     */
    this.getEmpriseEtObjetDetude = function(type, obj, layername) {
        // On affiche la popup modal de chargement
        jQuery('#info_chargement').modal();
        jQuery('#info_chargement_body').html('<p style="text-align: center;">Votre carte hydromorphologique de <b>"'+ layername +'"</b> est en cours de construction.<br><progress></progress></p>');
        jQuery('#bot_panel').hide()
        localresultable.initResultTable();
        initEmpriseEtObjetDetude();
        addEmprise(type, obj, layername)
        addObjetEtude(type, obj)
    };

    /*
     * initialise les couches interactives: c'est à dire enlève toutes les couches déjà ajouté par une recherche précedente
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
        /* Init */
        map.getLayerGroup().getLayers().item(3).getLayers().push(new ol.layer.Vector())
        vectorSourceEmprise = new ol.source.Vector();

        /* Geojson de l'emprise */
        emprise_wfsurl = config.url_wfsemprise+"?SERVICE=WFS&REQUEST=getFeature&VERSION=2.0.0&srsName=epsg%3A4326&TYPENAME=sidhymo%3A"+type+"&outputFormat=application%2Fjson&FILTER=%3CFilter%20xmlns%3D%22http%3A%2F%2Fwww.opengis.net%2Fogc%22%3E%3CPropertyIsEqualTo%3E%3CPropertyName%3Egid%3C%2FPropertyName%3E%3CLiteral%3E"+obj+"%3C%2FLiteral%3E%3C%2FPropertyIsEqualTo%3E%3C%2FFilter%3E";
        
        // On a besoin d'avoir l'emprise chargée pour la suite: on passe en synchrone
        jQuery.ajaxSetup({
            async: false
        });
        jQuery.getJSON(emprise_wfsurl, function(data) {
            features = new ol.format.GeoJSON().readFeatures(data, {
                featureProjection: 'EPSG:3857'
            });

            /* Layer de l'emprise selectionnée */
            vectorSourceEmprise.addFeatures(features);
            var vectorEmprise = new ol.layer.Vector({
                title: layername,
                type: 'emprise',
                source: vectorSourceEmprise,
                projection: 'EPSG:4326',
                style: localmap.styles.yellowStyle
            });

            // Zoomer
            map.getView().fit(vectorSourceEmprise.getExtent(), { duration: 500 } );
            
            // Ajouter au groupe interactif la nouvelle layer
            map.getLayerGroup().getLayers().item(3).getLayers().removeAt(0);
            map.getLayerGroup().getLayers().item(3).getLayers().insertAt(0, vectorEmprise)
        });
        // Plus besoin du mode  synchrone
        jQuery.ajaxSetup({
            async: true
        });
        // On indique que l'emprise est chargé
        jQuery('#encours_emprise').html(' <b>chargé</b>.')
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
        // FOREACH
        config.array_objets_etude.forEach(function(typeObjetEtude, index) {
            countLoading++; // Compteur de couches chargées

            /* Ouvrir la popup modal de chargement */
            jQuery('#info_chargement_body').append('<span><img src="modules/custom/mapviewer/images/' + typeObjetEtude.name+ '.png" width="20" style="margin-right: 7px;"/> ' + typeObjetEtude.libelle + '<span id="encours_' + typeObjetEtude.name + '"> en cours de chargement...</span></span><br/>');
            
            if(typeObjetEtude.type == "wfs" || typeEmprise != 'hydroecoregion1' || typeEmprise != 'hydroecoregion2' ) {
                /* Récupérer et affiche le geojson des objets */
                objetdetude_url = config.url_searchobjet+"?emprise="+typeEmprise+"&gid="+cdEmprise+"&type="+typeObjetEtude.name;

                /* Récupérer et affiche le geojson des objets */
                jQuery.getJSON(objetdetude_url, function(data) {

                    if(data && data.features) {
                        // S'il y a plus de 100 objets, on ne les affiche pas par défaut
                        // Pour ne pas faire ramer la carte
                        visibility = true
                        // if(data.features.length > 1000) {
                        //     visibility = false
                        // }

                        /* Afficher sur la carte */
                        features = new ol.format.GeoJSON().readFeatures(data, {
                            featureProjection: 'EPSG:3857'
                        });

                        /* Layer des objet d'étude en intersection avec l'emprise d'étude */
                        vectorSourceObjet = new ol.source.Vector();
                        vectorSourceObjet.addFeatures(features);
                        var vectorObjet = new ol.layer.Vector({
                            title: typeObjetEtude.libelle,
                            visible: visibility,
                            type: 'objetdetude',
                            name: typeObjetEtude.name,
                            className:typeObjetEtude.name,
                            source: vectorSourceObjet,
                            projection: 'EPSG:4326',
                            style: typeObjetEtude.style ? typeObjetEtude.style : localmap.styles.blueStyle
                        });

                        // Ajouter au groupe interactif la nouvelle layer
                        map.getLayerGroup().getLayers().item(3).getLayers().removeAt(index+1);
                        map.getLayerGroup().getLayers().item(3).getLayers().insertAt(index+1, vectorObjet)

                        // Ajouter au tableau HTML
                        localresultable.appendToResultTable(typeObjetEtude, data)

                        /* Mettre à jour la popup modal quand les couches sont chargées*/
                        countLoading--; // Compteur de couches chargées
                        jQuery('#encours_'+typeObjetEtude.name).html(' <b>chargé</b>.')
                        if (countLoading == 0) {
                            jQuery('#info_chargement').modal('hide')
                        }
                    }
                    else {
                        /* Mettre à jour la popup modal quand les couches sont chargées*/
                        countLoading--; // Compteur de couches chargées
                        console.log(countLoading);
                        jQuery('#encours_'+typeObjetEtude.name).html(' <b>chargé</b>.')
                        if (countLoading == 0) {
                            jQuery('#info_chargement').modal('hide')
                        }
                    }
                });
            }
            else if(typeObjetEtude.type == "wms") {
                // console.log((string)vectorSourceEmprise.getExtent())
                // jQuery.post('https://sidhymo.recette.oieau.fr/ows/', 
                // { 
                //     'SERVICE': 'WMS',
                //     'VERSION': '1.3.0',
                //     'REQUEST': 'GetMap',
                //     'FORMAT' : 'image/png',
                //     'TRANSPARENT' : 'true',
                //     'WIDTH': '256',
                //     'HEIGHT': '256',
                //     'LAYERS': typeObjetEtude.name,
                //     'TILED': true,
                //     'BBOX': vectorSourceEmprise.getExtent().toString(),
                //     'CQL_FILTER': cqlfilter 
                // }, 
                // function(data, textStatus, xhr) {
                //     console.log(data);
                // });
                cqlfilter ='INTERSECTS (geom, ' + 'MULTIPOLYGON(((-1.04228264218218 45.5444335189868,-1.04192678897592 45.5309204684781,-1.06155691320062 45.5359555886978,-1.05135991601368 45.5259429047199,-1.07969705801854 45.521631752393,-1.10716217323258 45.4932216514195,-1.10303010831614 45.4429216905324,-1.04570060583914 45.4211997777501,-0.962163048482073 45.3389114913188,-0.92430399503807 45.2786397603403,-0.881001715103814 45.2748406746746,-0.836860360046688 45.2087292075084,-0.772669844571591 45.1551954771904,-0.813330636823428 45.1162649181719,-0.764626093134635 45.1189603997989,-0.737979817471666 45.1007611828223,-0.787082220068794 45.0705813702298,-0.786841307237798 45.0355420386903,-0.710303748328937 45.027375182361,-0.665577214699195 44.9997100135673,-0.648435394402086 45.0064835771344,-0.599022159056471 44.9493414725825,-0.627979300213015 44.9164438556804,-0.719715797573743 44.8842496256462,-0.722039032426925 44.8631219734631,-0.693296539350636 44.8454257800941,-0.700553442255169 44.8113730226551,-0.662482915763806 44.7771490939032,-0.621167406021994 44.7805421400941,-0.607829877055887 44.7446361105366,-0.584080750192853 44.7531432340274,-0.569432747238854 44.7239015678576,-0.542523874930024 44.7253729246689,-0.546733256174439 44.7016917890586,-0.509384233033493 44.6651251420053,-0.493071018638786 44.6997984569248,-0.382247583318065 44.6433211893602,-0.360581796737939 44.6201422406446,-0.39222111877322 44.503826906085,-0.376407777674807 44.483576579943,-0.350371189187828 44.4863768347792,-0.315552746646874 44.5236575890333,-0.286058240208474 44.4753236747832,-0.235006223011527 44.4468485014344,0.027766804906754 44.3709113349312,0.019476761712872 44.3265476197203,0.0943572418468 44.2918350558263,0.280016236099113 44.2458767229962,0.244930868633154 44.2106253332369,0.290583217520716 44.124009964408,0.244691113790644 44.0666469117915,0.216278035383378 44.0551699286589,0.161493510528803 44.0455992835068,0.116705045690462 44.0600669094532,0.111169351627722 43.9952135099039,0.053805258737586 43.9957341128339,-0.000694181967134 43.9630878880438,-0.105022472974475 43.9881934748522,-0.21213211010413 43.9888850975195,-0.336936112975147 43.9065147443011,-0.357705008111357 43.8495940278137,-0.398124526707624 43.8309621107829,-0.753906744208868 43.7779678502026,-0.886635613965218 43.8083164019208,-0.96382439114452 43.7563217623062,-1.08472757118128 43.7237524585693,-1.15197499541591 43.6734794380111,-1.20898864733934 43.6538739294206,-1.25096104926864 43.6117581320224,-1.42310045529729 43.5572539170581,-1.47734747382126 43.5252257059372,-1.52339132073903 43.5301919649203,-1.44814067530205 43.6418795186249,-1.32567961821084 44.0900474161602,-1.25984972527798 44.4286226817111,-1.25404964343406 44.5467321862706,-1.20713593696412 44.6107364697829,-1.19185751310512 44.6608416360781,-1.14338448427079 44.6574728140132,-1.14578397497027 44.6393843126328,-1.04444489330609 44.6485691634016,-1.01940351044105 44.6654174409661,-1.06978535070517 44.6962093850053,-1.03641294296368 44.6934354970051,-1.04542471396827 44.7001182336051,-1.1677719511723 44.7734993194406,-1.17264028300414 44.7453312846677,-1.22980401011738 44.6955384727566,-1.24525680861491 44.6212574819565,-1.26039257849125 44.6257203750118,-1.16305690787636 45.2961786174127,-1.15722858135752 45.4698207761617,-1.09599708040205 45.5567625846038,-1.06105463428249 45.5724580573513,-1.06190629243613 45.5531121372402,-1.04228264218218 45.5444335189868)),((-1.14398883838262 45.7961104785825,-1.12257942408131 45.7817870022233,-1.16266783125563 45.7321753989691,-1.07134742679934 45.6641262268005,-1.08776508540128 45.6381686597172,-1.20945871735887 45.6963682285094,-1.23136179478687 45.6923745689008,-1.20318674539655 45.6720346060093,-1.2247997643961 45.6727926272192,-1.23616550014224 45.6923589539475,-1.24298760278903 45.7866199543344,-1.14398883838262 45.7961104785825)),((-1.39038076906482 46.0426123505687,-1.31457919902781 45.9942566739529,-1.23474924713703 45.9826189479657,-1.23100954526888 45.9252355558909,-1.18724299891372 45.8861808747586,-1.20641357726581 45.8506621255417,-1.19472320159918 45.8304580323272,-1.23146101711826 45.798534232006,-1.26978879201736 45.880238253393,-1.38827324549827 45.9543421410356,-1.388084141724 45.9972175817549,-1.41377119274395 46.0466247111093,-1.39038076906482 46.0426123505687)),((-1.50549399037249 46.2582528496783,-1.46215331433186 46.228845753544,-1.40990685452358 46.229475881907,-1.43730733211523 46.2165109688537,-1.43051664624286 46.2070645019369,-1.35358135567649 46.2061463234719,-1.2542815527956 46.1625582537499,-1.31233272265079 46.1434163138567,-1.4611878941814 46.2014723185242,-1.53495520598165 46.2019341233766,-1.56391978507358 46.2455537236336,-1.50549399037249 46.2582528496783))))'

                var wms_source = new ol.source.TileWMS({
                    // url: 'https://maps.oieau.fr/ows/OIEau/ami_hydromorpho',
                    url :'https://sidhymo.recette.oieau.fr/ows/',
                    params: {
                        'LAYERS': typeObjetEtude.name,
                        'TILED': true,
                        'CQL_FILTER': cqlfilter
                    },
                    crossOrigin: 'anonymous'
                });

                var wms_tile = new ol.layer.Tile({
                    title: typeObjetEtude.libelle,
                    type: 'objetdetude',
                    name: typeObjetEtude.name,
                    className: 'objetdetude',
                    visible: true,
                    source: wms_source,
                    extent: vectorSourceEmprise.getExtent() 
                });

                // Ajouter au groupe interactif la nouvelle layer
                map.getLayerGroup().getLayers().item(3).getLayers().removeAt(index+1);
                map.getLayerGroup().getLayers().item(3).getLayers().insertAt(index+1, wms_tile);
                layerSwitcher.renderPanel();

                /* Mettre à jour la popup modal quand les couches sont chargées*/
                wms_source.on('tileloadend', function () {
                    countLoading--; // Compteur de couches chargées
                    jQuery('#encours_'+typeObjetEtude.name).html(' <b>chargé</b>.')
                    if (countLoading == 0) {
                        jQuery('#info_chargement').modal('hide')
                    }
                });
            }
        });
    }

    // this.addNotification = function(message, type, lbtype, legende_png, showloader=true, autohide=false) {

    //     var html_notif = '\
    //     <div id="notif' + type + '" class="toast" style="z-index:1000;  margin: 2px;">\
    //         <div class="toast-header">\
    //             <img src="modules/custom/mapviewer/images/' + legende_png + '" width="20" style="margin-right: 7px;">\
    //             <strong class="mr-auto" id="notif'+type+'text">' + message + '</strong>';

    //     if(showloader) {
    //         html_notif += '<img src="https://miro.medium.com/max/1120/1*hShXr9hDtKxHbHe3jQ_DQw.gif" style="width: 90px;">';
    //     }

    //     html_notif += '\
    //             <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">\
    //                 <span aria-hidden="true">×</span>\
    //             </button>\
    //         </div>\
    //     </div>'

    //     jQuery('#notifications').append(html_notif)
    //     jQuery("#notif"+type).toast({autohide:autohide, delay: 100000})
    //     jQuery("#notif"+type).toast('show')
    //     return jQuery("#notif"+type);
    // }

    /*
     * Pass options when class instantiated
     */
    this.construct(searchbardiv, map_instance, resultable_instance);


};
