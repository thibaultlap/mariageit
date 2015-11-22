//v10-08.4

$(function() {

  Parse.$ = jQuery;

  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("wDWE4F9YtBKpOuwRLuMItrNWM8vCpt6uBizLdpHg",
                   "TIDRD4oP4xVPEwhtUcLL4dcQJh1ei4uMNv7D7XrY");

  var LogInView = Parse.View.extend({
    events: {
      "click #chercher-btn": "RechercheInvite",
      "click #annuler-btn": "AnnRechercheInvite",
      "click .list-group-item": "ChooseInvite",
      "click .enter-btn": "EnterSite"
    },

    el: ".content",
    
    initialize: function() {
      _.bindAll(this, "RechercheInvite", "AnnRechercheInvite", "ChooseInvite", "EnterSite");
	  document.getElementById("footer").style.marginTop = "15px";
	  document.getElementById("body").style.paddingTop = "0px";
    $('[data-toggle="popover"]').popover();
    this.render();
    },

    EnterSite: function(e) {

      var saveInvite = Parse.Object.extend("invites");
      var saveInviteObj= new saveInvite();
      saveInviteObj.id = sessionStorage.getItem("id");
      saveInviteObj.set("visiteSite", true);
      saveInviteObj.save(null, {
        success: function(invite) {
        },
        error: function(invite, error) {
        }
      });

      window.location.href = "main.html";
    },

    ChooseInvite: function(e) {
      choosenInvite = e.target;
      this.$("#loginPrenom").val(choosenInvite.getAttribute("prenom"));
      this.$("#loginNom").val(choosenInvite.getAttribute("nom"));
      
      sessionStorage.setItem('nom', choosenInvite.getAttribute("nom"));
      sessionStorage.setItem('prenom', choosenInvite.getAttribute("prenom"));
      sessionStorage.setItem('groupe', choosenInvite.getAttribute("groupe"));
      sessionStorage.setItem('type', choosenInvite.getAttribute("type"));
      sessionStorage.setItem('rsvp', choosenInvite.getAttribute("rsvp"));
      sessionStorage.setItem('id', choosenInvite.getAttribute("objectId"));
      sessionStorage.setItem('quiReponduId', choosenInvite.getAttribute("quiReponduId"));
      sessionStorage.setItem('quiRepondu', choosenInvite.getAttribute("quiRepondu"));
      sessionStorage.setItem('vinhonneur', choosenInvite.getAttribute("vinhonneur"));
      sessionStorage.setItem('diner', choosenInvite.getAttribute("diner"));
      sessionStorage.setItem('brunch', choosenInvite.getAttribute("brunch"));
      sessionStorage.setItem('mail', choosenInvite.getAttribute("mail"));      
      sessionStorage.setItem('adresse', choosenInvite.getAttribute("adresse"));          

      $('.enter-btn').removeAttr("disabled");
      $('#UserList').empty();
      $('#UserChoice').collapse('hide');

    },

    AnnRechercheInvite: function(e) {
      $('#UserList').empty();
      $('#UserChoice').collapse('hide');

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

    nom = nom[0].toUpperCase() + nom.slice(1);
    prenom = prenom[0].toUpperCase() + prenom.slice(1);

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

            $(listDiv).attr("nom", results[i].get('nom'));
            $(listDiv).attr("prenom", results[i].get('prenom'));
            $(listDiv).attr("rsvp", results[i].get('RSVP'));
            $(listDiv).attr("groupe", results[i].get('groupe'));
            $(listDiv).attr("type", results[i].get('type'));
            $(listDiv).attr("objectId", results[i].id);
            $(listDiv).attr("vinhonneur", results[i].get('vinhonneur'));
            $(listDiv).attr("diner", results[i].get('diner'));
            $(listDiv).attr("brunch", results[i].get('brunch'));
            $(listDiv).attr("quiRepondu", results[i].get('quiRepondu'));
            $(listDiv).attr("quiReponduId", results[i].get('quiReponduId'));
            $(listDiv).attr("mail", results[i].get('mail'));
            $(listDiv).attr("adresse", results[i].get('adresse'));

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
                //console.log(prenom[0] + " " + nom[0]);
                query2.startsWith("nom", nom[0]);
                query2.descending("nom");    
                query2.find({
                  success: function(results) {
                    this.$(".login-btn").text("Annuler");
                    this.$(".login-btn").attr("id","annuler-btn");
                    this.$(".login-btn").addClass("btn-danger");
                    this.$(".login-btn").removeClass("btn-primary");
                    //console.log("Found: " + results.length);
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
                        $(listDiv).attr("objectId", results[i].id);
                        $(listDiv).attr("vinhonneur", results[i].get('vinhonneur'));
                        $(listDiv).attr("diner", results[i].get('diner'));
                        $(listDiv).attr("brunch", results[i].get('brunch'));
                        $(listDiv).attr("quiRepondu", results[i].get('quiRepondu'));
                        $(listDiv).attr("quiReponduId", results[i].get('quiReponduId'));
                        $(listDiv).attr("mail", results[i].get('mail'));
                        $(listDiv).attr("adresse", results[i].get('adresse'));

                        listDiv.innerHTML = results[i].get('prenom') + " " + results[i].get('nom');
                        $("#userList").append(listDiv);
                      }
                      $('#UserChoice').collapse('show');
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
      this.$el.html(_.template($("#login-template").html()));
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
        new LogInView();
    }
  });
  
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

  new AppView;
});