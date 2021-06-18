/*
 * Class resultable
 */
var fichehandler = function() {
    var root=this;
    var localsearchbar = new Object();

    /*
     * Constructeur
     */
    this.construct = function(){

    };

    this.setLocalSearchBar = function(myLocalSearchBar) {
      localsearchbar = myLocalSearchBar;
    }; 

    /*
     * Créé dynamiquement la fiche à partir de "typeobjet"
     * Exemple:
     */
    this.createfiche = function(territoire, typeobjet, idobjet) {
      // Afficher la fiche modal
      jQuery('#modalinformation').modal('show')

      // Charger le contenu de la fiche
      jQuery('#fiche_content').load("getfiche?territoire="+territoire+"&type="+typeobjet+"&code="+idobjet, function( response, status, xhr ) {
          // Get config objet
          config.array_objets_etude.forEach(function(typeObjetEtude){
            if (typeObjetEtude.name == typeobjet) {
              lbtype = typeObjetEtude.libelle
            }
          });

          // jQuery('#fiche_title').html(lbtype+" "+idobjet)
          if ( typeobjet == "stcarhyce" ) {
            make_stcarhyce(idobjet);
          }
          // Dans les TGH il y a moyen de cliquer sur une USRA
          if ( typeobjet == "tgh" ) {
            jQuery(".informationusra").click(function() {
              root.createfiche(territoire,'usra',jQuery(".informationusra").attr('id'));
              //Chargement
              createModal();
            });
          }

          // Dans les informations, il y a moyen de changer d'emprise
          jQuery(".change_emprise").click(function() {
            // Fermer la popup
            jQuery('#modalinformation').modal('hide')
            splitchoice = this.id.split('.')
            localsearchbar.getEmpriseEtObjetDetude(splitchoice[0], splitchoice[1], this.value)
          });

          if( status == "error" ) {
              jQuery('#fiche_content').html("Désolé, cette fiche n'a pas encore été crée.")
          }
      });
      jQuery('#modalinformation').on('hidden.bs.modal', function (e) {
        createModal();
      });
    };

    /*
     *
     * Modale chargement
     *
     */
    var createModal = function() {
        jQuery('#fiche_content').html('<div class="modal-content h-100 w-100">\
                                        <div class="modal-header">\
                                            <h5 class="modal-title" id="fiche_title">\
                                            </h5>\
                                            <button aria-label="Fermer" class="close" data-dismiss="modal" type="button">\
                                                <span aria-hidden="true">\
                                                    ×\
                                                </span>\
                                            </button>\
                                        </div>\
                                        <div class="modal-body">\
                                            <div class="fiche">\
                                                <div class="loader">\
                                                    <p>\
                                                        Fiche en cours de chargement...\
                                                    </p>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>')
    }
    /*
     *
     * Complète les fiches carhyce
     *
     */
    var make_stcarhyce = function(idobjet) {
      // Sur l'activation d'un onglet
      jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // Récupérer l'ID de l'onglet
        var id_tab = e.currentTarget.id.split('-');
        typeOnglet = id_tab[0];
        idOperation = id_tab[1];

        switch (typeOnglet) {
          // Si on active un onglet d'opération
          case  "op":
            // Alors on active la tab geométrie
            jQuery("#geom-"+id_tab[1]+"-tab").tab('show')
            break;
          // Si on active un onglet geom
          case "geom":
            // On va chercher la geometrie de l'opération
            jQuery("#geom-"+id_tab[1]).load('getcarhycegeom?operation='+idOperation, function( response, status, xhr ) {})
            break;

          // Si on active un onglet granulo
          case "granulo":
            // On va chercher la granulo de l'opération
            jQuery("#granulo-"+id_tab[1]).load('getcarhycegranulo?operation='+idOperation, function( response, status, xhr ) {})
            break;

          // Si on active un onglet habitat
          case "habitat":
            // On va chercher l'habitat de l'opération
            jQuery("#habitat-"+id_tab[1]).load('getcarhycehabitat?operation='+idOperation, function( response, status, xhr ) {})
            break;

          // Si on active un onglet modele
          case "modele":
            // On va chercher le modele de l'opération
            jQuery("#modele-"+id_tab[1]).load('getcarhycemodele?operation='+idOperation, function( response, status, xhr ) {})
            break;
        }
      });

      // Par défaut on active le premier onglet de la premiere opération
      jQuery('a[data-toggle="tab"].active').trigger("shown.bs.tab");

    };

    /*
     * Pass options when class instantiated
     */
    this.construct();
};
