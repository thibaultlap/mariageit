//v10-08.4

$(function() {
	
  window.onhashchange=function(){
	  var hashVal = window.location.hash;
	  hashVal = hashVal.substring(1,hashVal.length);
	  if(state.get("pageNow") != hashVal)
	  {
		 switch(hashVal)
		 {				
			  case "main":
					state.set({ pageNow: hashVal});			  
					break;
			  default:
					state.set({ pageNow: "main"});			  
				    new MainView();
					break;			  
				break;
		}
	  }
  };

  Parse.$ = jQuery;

  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("wDWE4F9YtBKpOuwRLuMItrNWM8vCpt6uBizLdpHg",
                   "TIDRD4oP4xVPEwhtUcLL4dcQJh1ei4uMNv7D7XrY");
				   
  // This is the transient application state, not persisted on Parse
  var AppState = Parse.Object.extend("AppState", {
    defaults: {
        pageNow: "main"
    }
  });

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
      window.location.href = "main_test.html";
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
      this.$el.html(_.template($("#login-template").html()));
      this.delegateEvents();
    }
  });

    var MainView = Parse.View.extend({
    events: {
	  "click .log-out": "logOut",
	  "click .navbar-brand": "selectType",
	  "click .carousel-caption a": "selectType",
	  "click ul#selectType a": "selectType"		  
    }, //Possible actions in this view

    el: ".content",
    
    initialize: function() {
      _.bindAll(this, "logOut", "goFunding", "goChoix", "goConcours"); //Binding of the associated functions
	  document.getElementById("footer").style.marginTop = "48px";
	  document.getElementById("body").style.paddingTop = "70px";
      this.render();
    },

    render: function() {
      this.$el.html(_.template($("#main-template").html())); //Which template to render
      this.delegateEvents();
	  var state_val = state.get("pageNow");
    },
	
	selectType: function(e) {
      var el = $(e.target);
      var selectValue = el.attr("id");
      state.set({ pageNow: selectValue});
      Parse.history.navigate(selectValue);
	  switch(selectValue){
		  case "navfunding":
			this.goFunding();
			break;
		  case "navchoix":
		    this.goChoix();
			break;
		  case "navconcours":
			this.goConcours();
			break;		  
		  case "navsuggestion":
			this.goSuggestion();
			break;
		  case "navmain":
		    this.goMain();
			break;
		  default:
			this.goMain();
		    break;
	  }
    },	
	
// Goes to the crowdfunding view
    goFunding: function(e) {
      new FundingView();
      this.undelegateEvents();
      delete this;
    },
  
// Goes to the choix view
    goChoix: function(e) {
      new ChoixView();
      this.undelegateEvents();
      delete this;
    },
  
// Goes to the concours view
    goConcours: function(e) {
      new ConcoursView();
      this.undelegateEvents();
      delete this;
    },
	
// Goes to the Suggestion view
    goSuggestion: function(e) {
      new SuggestionView();
      this.undelegateEvents();
      delete this;
    },		
	
// Goes to the Main view
    goMain: function(e) {
      new MainView();
      this.undelegateEvents();
      delete this;
    },

// Logs out the user and shows the login view
    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
      this.undelegateEvents();
      delete this;
    }	
  });

  
    var AppRouter = Parse.Router.extend({
    routes: {  
	  "main": "main"
    },

    initialize: function(options) {
    },
	
    main: function() {
      state.set({ pageNow: "main"});
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
      if (Parse.User.current()) {
		  var route = state.get("pageNow");
		  switch(route){			
			  case "main":
				new MainView();
				break;	
			  default:
				new MainView();
				break;	
		  }
      } else {
        new LogInView();
      }
    }
  });
  
  var state = new AppState;

  sessionStorage.setItem('nom', "nom");
  sessionStorage.setItem('prenom', "prenom");
  sessionStorage.setItem('groupe', "groupe");
  sessionStorage.setItem('type', "type");
  sessionStorage.setItem('rsvp', false);

  new AppRouter;
  Parse.history.start();
  new AppView;
});