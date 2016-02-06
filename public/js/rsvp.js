//v10-08.4

$(function() {

  Parse.$ = jQuery;

  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("wDWE4F9YtBKpOuwRLuMItrNWM8vCpt6uBizLdpHg",
                   "TIDRD4oP4xVPEwhtUcLL4dcQJh1ei4uMNv7D7XrY");

  var RSVPView = Parse.View.extend({
    events: {
      "click #sendRSVP": "sendRSVP",
      "click #changeRSVP": "changeRSVP",
      "click #changeUser": "changeUser"
    },

    el: ".content",
    
    initialize: function() {
      _.bindAll(this, "sendRSVP", "changeRSVP", "changeUser");
	  document.getElementById("footer").style.marginTop = "15px";
	  document.getElementById("body").style.paddingTop = "0px";
    $('[data-toggle="popover"]').popover();

    this.render();

    document.getElementById("nom").value = sessionStorage.getItem('nom');
    document.getElementById("prenom").value = sessionStorage.getItem('prenom');

    var typeInvite = sessionStorage.getItem('type');
    if(typeInvite.indexOf("R") == -1) document.getElementById("diner").style.display = "none";
    if(typeInvite.indexOf("R") == -1) document.getElementById("brunch").style.display = "none";

    if(sessionStorage.getItem('rsvp') == "true")
    {
        document.getElementById("txtRSVPattention").style.display = "hide";
        $("#sendRSVP").removeClass("btn-success");
        $("#sendRSVP").addClass("btn-danger");
        $("#sendRSVP").text("Changer RSVP");
        document.getElementById("sendRSVP").id = "changeRSVP";

        if(sessionStorage.getItem('id') != sessionStorage.getItem('quiReponduId')){
          document.getElementById("quiReponduBox").setAttribute('placeholder',"RSVP répondu par " + sessionStorage.getItem('quiRepondu'));
          document.getElementById("quiReponduBox").style.display = "block";
        }
        else{
          document.getElementById("quiReponduBox").setAttribute('placeholder',"Votre réponse a bien été envoyée, merci !");
          document.getElementById("quiReponduBox").style.display = "block";        
        } 

        if(sessionStorage.getItem('vinhonneur')) document.getElementById("vinhonneurOui").checked = true;
        else document.getElementById("vinhonneurNon").checked = true;

        if(sessionStorage.getItem('diner')) document.getElementById("dinerOui").checked = true;
        else document.getElementById("dinerNon").checked = true;

        if(sessionStorage.getItem('brunch')) document.getElementById("brunchOui").checked = true;
        else document.getElementById("brunchNon").checked = true;

        document.getElementById("email").value = sessionStorage.getItem("mail");
        document.getElementById("adresse").value = sessionStorage.getItem("adresse");

        var Invites = Parse.Object.extend("invites");
        var query1 = new Parse.Query(Invites);
        var numeroGroupe = parseInt(sessionStorage.getItem('groupe'), 10);
        query1.equalTo("groupe", numeroGroupe);
        query1.equalTo("quiReponduId", sessionStorage.getItem('id'));
        query1.notEqualTo("objectId", sessionStorage.getItem('id'));
        query1.equalTo("RSVP", true);
        
        var query2 = new Parse.Query(Invites);
        query2.equalTo("groupe", numeroGroupe);
        query2.notEqualTo("objectId", sessionStorage.getItem('id'));
        query2.equalTo("RSVP", false);

        var query3 = new Parse.Query.or(query1, query2);

        query3.find({
          success: function(results) {
            console.log("Found " + results.length);
            if(results.length >= 1)
            {

              document.getElementById("addInviteRSVP").style.display = "block";
              document.getElementById("addInviteRSVP").setAttribute('q', results.length);
              for(i=0; i<results.length; i++)
              {
                var listDiv = document.createElement("div");
                listDiv.className = "form-group col-md-4 spacer";
                listDiv.id = "inviteRajoute" + [i];

                var listP = document.createElement("p");
                var nomprenomInvite = document.createTextNode(results[i].get('prenom') + " " + results[i].get('nom'));
                listP.appendChild(nomprenomInvite);  

                var listLabel1 = document.createElement("label");
                listLabel1.className = "radio-inline";
                listLabel1.style.marginTop = "-10px";
                var listInput1 = document.createElement("input");
                listInput1.setAttribute('type','radio');
                var listInputName = "addRSVP" + [i];
                listInput1.setAttribute('name',listInputName);
                listInput1.id = "inviteRajouteRadioOui" + [i];
                var listInput1textP = document.createElement("p");
                var listInput1text = document.createTextNode("Oui");
                listInput1textP.appendChild(listInput1text);
                listLabel1.appendChild(listInput1);
                listLabel1.appendChild(listInput1textP);            

                var listLabel2 = document.createElement("label");
                listLabel2.className = "radio-inline";
                listLabel2.style.marginTop = "-10px";
                var listInput2 = document.createElement("input");
                listInput2.setAttribute('type','radio');
                listInput2.setAttribute('name',listInputName);
                listInput2.id = "inviteRajouteRadioNon" + [i];
                var listInput2textP = document.createElement("p");
                var listInput2text = document.createTextNode("Non");
                listInput2textP.appendChild(listInput2text);
                listLabel2.appendChild(listInput2);
                listLabel2.appendChild(listInput2textP);            

                listDiv.appendChild(listP);
                listDiv.appendChild(listLabel1);
                listDiv.appendChild(listLabel2);

                this.$("#addInviteRSVP").append(listDiv);
                $(listDiv).attr("inviteId", results[i].id);
                if(results[i].get('RSVP') == true)
                {
                    document.getElementById("inviteRajouteRadioOui" + [i]).checked = true;
                }
                else
                {
                    document.getElementById("inviteRajouteRadioNon" + [i]).checked = true;
                } 

              }
            $("#addInviteRSVP :input").attr("disabled", true);
            }
            else
            {
              document.getElementById("addInviteRSVP").style.display = "hide";
            }
          },
          error: function(error) {
          }
        });        
        $("#items :input").attr("disabled", true);

    }
    else
    {
        document.getElementById("txtRSVPattention").style.display = "block";
        var Invites = Parse.Object.extend("invites");
        var query = new Parse.Query(Invites);
        var numeroGroupe = parseInt(sessionStorage.getItem('groupe'), 10);
        query.equalTo("groupe", numeroGroupe);
        query.notEqualTo("objectId", sessionStorage.getItem('id'));
        query.notEqualTo("RSVP", true);
        query.descending("prenom");    
        query.find({
          success: function(results) {
            if(results.length >= 1)
            {
              document.getElementById("addInviteRSVP").style.display = "block";
              document.getElementById("addInviteRSVP").setAttribute('q', results.length);
              for(i=0; i<results.length; i++)
              {
                var listDiv = document.createElement("div");
                listDiv.className = "form-group col-md-4 spacer";
                listDiv.id = "inviteRajoute" + [i];

                var listP = document.createElement("p");
                var nomprenomInvite = document.createTextNode(results[i].get('prenom') + " " + results[i].get('nom'));
                listP.appendChild(nomprenomInvite);  

                var listLabel1 = document.createElement("label");
                listLabel1.className = "radio-inline";
                listLabel1.style.marginTop = "-10px";
                var listInput1 = document.createElement("input");
                listInput1.setAttribute('type','radio');
                var listInputName = "addRSVP" + [i];
                listInput1.setAttribute('name',listInputName);
                listInput1.id = "inviteRajouteRadio" + [i];
                var listInput1textP = document.createElement("p");
                var listInput1text = document.createTextNode("Oui");
                listInput1textP.appendChild(listInput1text);
                listLabel1.appendChild(listInput1);
                listLabel1.appendChild(listInput1textP);            

                var listLabel2 = document.createElement("label");
                listLabel2.className = "radio-inline";
                listLabel2.style.marginTop = "-10px";
                var listInput2 = document.createElement("input");
                listInput2.setAttribute('type','radio');
                listInput2.setAttribute('name',listInputName);
                listInput2.checked = true;
                var listInput2textP = document.createElement("p");
                var listInput2text = document.createTextNode("Non");
                listInput2textP.appendChild(listInput2text);
                listLabel2.appendChild(listInput2);
                listLabel2.appendChild(listInput2textP);            

                listDiv.appendChild(listP);
                listDiv.appendChild(listLabel1);
                listDiv.appendChild(listLabel2);

                this.$("#addInviteRSVP").append(listDiv);
                $(listDiv).attr("inviteId", results[i].id);
              }
            }
            else
            {
              document.getElementById("addInviteRSVP").style.display = "hide";
            }
          },
          error: function(error) {
          }
        });
    }
    },

    changeUser: function(e) {
        sessionStorage.setItem('nom', "nom");
        sessionStorage.setItem('prenom', "prenom");
        sessionStorage.setItem('groupe', "groupe");
        sessionStorage.setItem('type', "type");
        sessionStorage.setItem('rsvp', false);
        sessionStorage.setItem('id', "tempID");
        sessionStorage.setItem('quiReponduId', "tempID");
        sessionStorage.setItem('quiRepondu', "prenomnom");
        sessionStorage.setItem('vinhonneur', false);
        sessionStorage.setItem('diner', false);
        sessionStorage.setItem('brunch', false);
        sessionStorage.setItem('mail', "mail@mail.com");
        sessionStorage.setItem('adresse', "rue Toto");
        window.location.href = "index.html";
    },

    changeRSVP: function(e) {
      $("#items :input").attr("disabled", false);
      document.getElementById("nom").setAttribute("disabled", true);
      document.getElementById("prenom").setAttribute("disabled", true);
      $("#changeRSVP").removeClass("btn-danger");
      $("#changeRSVP").addClass("btn-primary");
      $("#changeRSVP").text("Envoyer");
      document.getElementById("changeRSVP").id = "sendRSVP";

    },

    sendRSVP: function(e) {
      document.getElementById("quiReponduBox").style.display = "block";
      document.getElementById("quiReponduBox").setAttribute('placeholder',"Votre réponse a bien été envoyée, merci !");
      if ($('input[name=vinhonneur]:checked').length == 0 || $('input[name=diner]:checked').length == 0 || $('input[name=brunch]:checked').length == 0) {
          console.log("missing one !")
          // error TODO
      }
      else if (document.getElementById("adresse").value == '') {
          console.log("missing info !")
          // error TODO
      }
      else {
          $("#sendRSVP").removeClass("btn-primary");
          $("#sendRSVP").addClass("btn-success");
          $("#sendRSVP").text = "Attendez...";
          var saveInvite = Parse.Object.extend("invites");
          var saveInviteObj= new saveInvite();
          saveInviteObj.id = sessionStorage.getItem('id');
          saveInviteObj.set("RSVP", true);
          saveInviteObj.set("mail", document.getElementById("email").value);
          saveInviteObj.set("adresse", document.getElementById("adresse").value); 
          saveInviteObj.set("quiRepondu", sessionStorage.getItem('prenom') + " " + sessionStorage.getItem('nom'));
          saveInviteObj.set("quiReponduId", sessionStorage.getItem('id'));
          saveInviteObj.set("vinhonneur", document.getElementById("vinhonneurOui").checked);
          saveInviteObj.set("diner", document.getElementById("dinerOui").checked);
          saveInviteObj.set("brunch", document.getElementById("brunchOui").checked);
          saveInviteObj.save(null, {
            success: function(invite) {
              $("#items :input").attr("disabled", true);
              sessionStorage.setItem('rsvp', true);
              sessionStorage.setItem('quiReponduId', sessionStorage.getItem('id'));
              sessionStorage.setItem('quiRepondu', sessionStorage.getItem('prenom') + " " + sessionStorage.getItem('nom'));
              sessionStorage.setItem('vinhonneur', document.getElementById("vinhonneurOui").checked);
              sessionStorage.setItem('diner', document.getElementById("dinerOui").checked);
              sessionStorage.setItem('brunch', document.getElementById("brunchOui").checked);
              sessionStorage.setItem('mail', document.getElementById("email").value);
              sessionStorage.setItem('adresse', document.getElementById("adresse").value);              
            },
            error: function(invite, error) {
            }
          });

      for(i=0; i<document.getElementById("addInviteRSVP").getAttribute('q'); i++)
      {
          if(document.getElementById("inviteRajouteRadio" + [i]).checked == true)
          {
              var saveInvite = Parse.Object.extend("invites");
              var saveInviteObj= new saveInvite();
              saveInviteObj.id = document.getElementById("inviteRajoute" + [i]).getAttribute("inviteId");
              saveInviteObj.set("RSVP", true);
              saveInviteObj.set("mail", document.getElementById("email").value);
              saveInviteObj.set("adresse", document.getElementById("adresse").value); 
              saveInviteObj.set("quiRepondu", sessionStorage.getItem('prenom') + " " + sessionStorage.getItem('nom'));
              saveInviteObj.set("quiReponduId", sessionStorage.getItem('id'));
              saveInviteObj.set("vinhonneur", document.getElementById("vinhonneurOui").checked);
              saveInviteObj.set("diner", document.getElementById("dinerOui").checked);
              saveInviteObj.set("brunch", document.getElementById("brunchOui").checked);
              saveInviteObj.save(null, {
                success: function(invite) {
                },
                error: function(invite, error) {
                }
              });
          }
          else
          {
              var saveInvite = Parse.Object.extend("invites");
              var saveInviteObj= new saveInvite();
              saveInviteObj.id = document.getElementById("inviteRajoute" + [i]).getAttribute("inviteId");
              saveInviteObj.set("RSVP", false);
              saveInviteObj.set("mail", "");
              saveInviteObj.set("adresse", ""); 
              saveInviteObj.set("quiRepondu", "");
              saveInviteObj.set("quiReponduId", "");
              saveInviteObj.set("vinhonneur", false);
              saveInviteObj.set("diner", false);
              saveInviteObj.set("brunch", false);
              saveInviteObj.save(null, {
                success: function(invite) {
                },
                error: function(invite, error) {
                }
              });            
          }
      }

      $("#sendRSVP").removeClass("btn-success");
      $("#sendRSVP").addClass("btn-danger");
      $("#sendRSVP").text("Changer RSVP");
      $("#sendRSVP").id = "changeRSVP";

      }
    },

    AnnRechercheInvite: function(e) {
      $('#UserList').empty();
      $('#UserChoice').collapse('hide');

      sessionStorage.setItem('nom', "nom");
      sessionStorage.setItem('prenom', "prenom");
      sessionStorage.setItem('groupe', "groupe");
      sessionStorage.setItem('type', "type");
      sessionStorage.setItem('rsvp', false);

      $('.login-btn').popover('hide');

      this.$(".enter-btn").attr("disabled", "disabled");
      this.$("#loginNom").removeAttr("disabled");
      this.$("#loginPrenom").removeAttr("disabled");

      this.$(".login-btn").text("Chercher");
      this.$(".login-btn").addClass("btn-primary");
      this.$(".login-btn").removeClass("btn-danger");
      this.$(".login-btn").attr("id", "chercher-btn");
      this.$(".list-group-item").remove();
    },

    RechercheInvite: function(e) {

		var self = this;
		var nom = this.$("#loginNom").val().latinise();
		var prenom = this.$("#loginPrenom").val().latinise();

    if(nom == "" || prenom == "") return false;

    this.$("#loginNom").attr("disabled", "disabled");
    this.$("#loginPrenom").attr("disabled", "disabled");

		this.$("#loginNom").val(nom);
		this.$("#loginPrenom").val(prenom);


		var Invites = Parse.Object.extend("invites");
		var query = new Parse.Query(Invites);
		query.equalTo("prenom", prenom);
		query.equalTo("nom", nom);
		query.descending("nom");	  
		query.find({
		  success: function(results) {
		  	console.log("Found: " + results.length);
		  	if(results.length >= 1)
		  	{
          this.$(".login-btn").text("Annuler");
          this.$(".login-btn").attr("id","annuler-btn");
          this.$(".login-btn").addClass("btn-danger");
          this.$(".login-btn").removeClass("btn-primary");
		  		for(i=0; i<results.length; i++)
	  			{
	  				var listDiv = document.createElement('button');
	  				listDiv.type = 'button';
	  				listDiv.className = 'list-group-item';
	  				listDiv.innerHTML = results[i].get('prenom') + " " + results[i].get('nom');
	  				$("#userList").append(listDiv);
	  			}
          $('#UserChoice').collapse('show');
			  }
  			else
  			{
                var Invites2 = Parse.Object.extend("invites");
                var query2 = new Parse.Query(Invites2);
                query2.startsWith("prenom", prenom[0]);
                console.log(prenom[0] + " " + nom[0]);
                query2.startsWith("nom", nom[0]);
                query2.descending("nom");    
                query2.find({
                  success: function(results) {
                    this.$(".login-btn").text("Annuler");
                    this.$(".login-btn").attr("id","annuler-btn");
                    this.$(".login-btn").addClass("btn-danger");
                    this.$(".login-btn").removeClass("btn-primary");
                    console.log("Found: " + results.length);
                    if(results.length >= 1)
                    {
                      for(i=0; i<results.length; i++)
                      {
                        var listDiv = document.createElement('button');
                        listDiv.type = 'button';
                        listDiv.className = 'list-group-item';

                        $(listDiv).attr("nom", results[i].get('nom'));
                        $(listDiv).attr("prenom", results[i].get('prenom'));
                        $(listDiv).attr("rsvp", results[i].get('RSVP'));
                        $(listDiv).attr("groupe", results[i].get('groupe'));
                        $(listDiv).attr("type", results[i].get('type'));

                        listDiv.innerHTML = results[i].get('prenom') + " " + results[i].get('nom');
                        $("#userList").append(listDiv);
                        $('#UserChoice').collapse('show');
                      }
                    }
                    else
                    {
                      $('.login-btn').popover('show');
                    }
                   
                  },
                  error: function(error) {
                  }
                  
                });
  				
  			}
			 
		  },
		  error: function(error) {
		  }
			
		});

		  return false;
    },

    render: function() {
      this.$el.html(_.template($("#rsvp-template").html()));
      this.delegateEvents();
    }
  });

  
  // The main view for the app
  var AppView = Parse.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
	
    initialize: function() {
      this.render();
    },

    render: function() {
        new RSVPView();
    }
  });

  new AppView;
});