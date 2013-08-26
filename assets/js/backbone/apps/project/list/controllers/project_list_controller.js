define([
	'underscore',
	'backbone',
	'utilities',
	'base_controller',
	'projects_collection',
	'projects_collection_view',
	'projects_show_controller',
	'modal_component'
], function (_, Backbone, Utilities, BaseController, ProjectsCollection, ProjectsCollectionView, ProjectShowController, Modal) {
	
	Application.Project.ListController = BaseController.extend({

		el: "#container",

		events: {
			"click .project"			: "show",
			"click .add-project"	: "add"
		},

		initialize: function () {
			_.bindAll(this, 'cleanup')

			var self = this;
			this.rendered = true;
			this.fireUpProjectsCollection();
			this.requestProjectsCollectionData();

			entities.request.on("projectFetch:success", function (collection) {  
				// -Instance variable for collection 
				self.collection = collection;

				// Render collection view to use instance variable, instead of passing
				// It down explicitly.  This offers more dynamic use in other methods.
				self.renderProjectCollectionView();
			});
		},

		fireUpProjectsCollection: function () {
			if (this.collection) {
				this.collection.initialize();
			} else {
				this.collection = new ProjectsCollection();
			}
		},

		requestProjectsCollectionData: function () {
			entities.request.trigger("projects:fetch");
		},

		renderProjectCollectionView: function () {
			this.projectCollectionView ?	
				this.projectCollectionView.render() :
				this.projectCollectionView = new ProjectsCollectionView({
					el: "#container",
					onRender: true,
					collection: this.collection
				}).render();
		},

		show: function (e) {
			if (e.preventDefault()) e.preventDefault();

			var id, model;

			// This model will be retrived from the ID not the attributes currently existing.

			// Grab the id for the model nearest the click
			id = $(e.currentTarget).closest('li[data-project-id]').attr('data-project-id')	

			// Store the model as the return of this utility function.
			model = getCurrentModelFromId(this.collection, id);

			if (this.projectShowController) {
				this.projectShowController.cleanup();
			}
			this.projectShowController = new ProjectShowController({ model: model })
			
		},

		add: function (e) {
			if (e.preventDefault()) e.preventDefault();
			
			var project;

			// instantiate data we need to render the modal.
			// In this case its the class that will contain it

			if (this.modal) {
				this.modal.initialize();
			} else {
				this.modal = new Modal();
			}

			// Here we are going to create a component to handle modals.
			rendering.trigger("modal:show", project);
		},

		cleanup: function() {
		  this.undelegateEvents();
		  $(this.el).clear();
		}

	});

	return Application.Project.ListController;
})