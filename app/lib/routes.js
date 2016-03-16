Router.route('/', {
    name: 'base',
    action: function () {
        this.render('base');
        SEO.set({title: "Pong"});
    }
});

Router.route('/stats', {
    name: 'stats',
    action: function () {
        this.render('stats');
        SEO.set({title: "Stats Central - Pong"});
    }
});