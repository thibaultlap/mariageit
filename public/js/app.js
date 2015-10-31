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
      "click .login-btn": "logIn"
    },

    el: ".content",
    
    initialize: function() {
      _.bindAll(this, "logIn");
	  document.getElementById("footer").style.marginTop = "15px";
	  document.getElementById("body").style.paddingTop = "0px";
      this.render();
    },

    logIn: function(e) {
    	$('#UserChoice').collapse('toggle');
		var self = this;
		var nom = this.$("#loginNom").val().latinise();
		var prenom = this.$("#loginPrenom").val().latinise();

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
		  		for(i=0; i<results.length; i++)
	  			{
	  				var listDiv = document.createElement('button');
	  				listDiv.type = 'button';
	  				listDiv.className = 'list-group-item';
	  				listDiv.innerHTML = results[i].get('prenom') + " " + results[i].get('nom');
	  				$("#userList").append(listDiv);
	  			}
			}
			else
			{
				//this.$(".enter-btn").prop('disabled', true);
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

  var currNom = "nom";
  var currPrenom = "prenom";
  var currID = "1234";
  var currRSVP = false;

  new AppRouter;
  Parse.history.start();
  new AppView;
});