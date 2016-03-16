Template.statsBody.events({});

Template.statsBody.helpers({
    stats: function () {
        Meteor.call('match.stats', function (error, result) {
            Session.set('stats', result);
        });
        return Session.get('stats');
    },
    played: function () {
        return this.win + this.loss;
    },
    ratio: function () {
        return (this.win / (this.win + this.loss) * 100).toFixed(2);
    }
});

Template.statsBody.onRendered(function () {

});

Template.statsBody.onCreated(function () {
    this.subscribe('matches');
});