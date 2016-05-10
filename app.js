// Models
window.Tradein = Backbone.Model.extend({
    urlRoot:"http://tradeins.getsandbox.com/tradeins",
    defaults:{
        "id":null,
        "first_name": "",
        "last_name": "",
        "watch_brand": "",
        "model_series": "",
        "purchase_date": "",
        "original_box_available": "",
        "picture": 'http://unsplash.it/300/200?image='+Math.floor(Math.random() * 1000)
    }
});
 
window.TradeinCollection = Backbone.Collection.extend({
    model:Tradein,
    url:"http://tradeins.getsandbox.com/tradeins"
});
 
 
// Views
window.TradeinListView = Backbone.View.extend({
 
    tagName:'ul',
 
    initialize:function () {
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (tradein) {
            $(self.el).append(new TradeinListItemView({model:tradein}).render().el);
        });
    },
 
    render:function (eventName) {
        _.each(this.model.models, function (tradein) {
            $(this.el).append(new TradeinListItemView({model:tradein}).render().el);
        }, this);
        return this;
    }
});
 
window.TradeinListItemView = Backbone.View.extend({
 
    tagName:"li",
 
    template:_.template($('#tpl-tradein-list-item').html()),
 
    initialize:function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },
 
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
 
    close:function () {
        $(this.el).unbind();
        $(this.el).remove();
    }
});
 
window.TradeinView = Backbone.View.extend({
 
    template:_.template($('#tpl-tradein-details').html()),
 
    initialize:function () {
        this.model.bind("change", this.render, this);
    },
 
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
 
    events:{
        "change input":"change",
        "click .save":"saveTradein",
        "click .delete":"deleteTradein"
    },
 
    change:function (event) {
        var target = event.target;
        console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
    },
 
    saveTradein:function () {
        this.model.set({
            first_name: $("#first_name").val(),
            last_name: $("#last_name").val(),
            watch_brand: $("#watch_brand").val(),
            model_series: $("#model_series").val(),
            purchase_date: $("#purchase_date").val(),
            original_box_available:$("#original_box_available").val()
        });

        if (this.model.isNew()) {
            var self = this;
            app.tradeinList.create(this.model, {
                success:function () {
                    app.navigate('tradeins/' + self.model.id, false);
                }
            });
        } else {
            this.model.save();
        }
 
        return false;
    },
 
    deleteTradein:function () {
        this.model.destroy({
            success:function () {
                alert('Tradein deleted successfully');
                window.history.back();
            }
        });
        return false;
    },
 
    close:function () {
        $(this.el).unbind();
        $(this.el).empty();
    }
});
 
window.HeaderView = Backbone.View.extend({
 
    template:_.template($('#tpl-header').html()),
 
    initialize:function () {
        this.render();
    },
 
    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    },
 
    events:{
        "click .new":"newTradein"
    },
 
    newTradein:function (event) {
        app.navigate("tradeins/new", true);
        return false;
    }
});
 
 
// Router
var AppRouter = Backbone.Router.extend({
 
    routes:{
        "":"list",
        "tradeins/new":"newTradein",
        "tradeins/:id":"tradeinDetails"
    },
 
    initialize:function () {
        $('#header').html(new HeaderView().render().el);
    },
 
    list:function () {
        this.tradeinList = new TradeinCollection();
        var self = this;
        this.tradeinList.fetch({
            success:function () {
                self.tradeinListView = new TradeinListView({model:self.tradeinList});
                $('#sidebar').html(self.tradeinListView.render().el);
                if (self.requestedId) self.tradeinDetails(self.requestedId);
            }
        });
    },
 
    tradeinDetails:function (id) {
        if (this.tradeinList) {
            this.tradein = this.tradeinList.get(id);
            if (this.tradeinView) this.tradeinView.close();
            this.tradeinView = new TradeinView({model:this.tradein});
            $('#content').html(this.tradeinView.render().el);
        } else {
            this.requestedId = id;
            this.list();
        }
    },
 
    newTradein:function () {
        if (app.tradeinView) app.tradeinView.close();
        app.tradeinView = new TradeinView({model:new Tradein()});
        $('#content').html(app.tradeinView.render().el);
    }
 
});
 
var app = new AppRouter();
Backbone.history.start();