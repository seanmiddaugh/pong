Template.base.events({
    'click a.match-submit': function (event) {
        event.preventDefault();
        var avengers = $('form#avengers');
        var defenders = $('form#defenders');
        var data = {
            'avengers': {
                'players': $('#players', avengers).val(),
                'score': $('#score', avengers).val()
            },
            'defenders': {
                'players': $('#players', defenders).val(),
                'score': $('#score', defenders).val()
            }
        };
        Meteor.call('match.save', data, function (error, result) {
            if (result) {
                var avengers = $('form#avengers');
                var defenders = $('form#defenders');
                $(avengers).trigger("reset");
                $(defenders).trigger("reset");
                $('.multiple-selection').val(null).trigger("change");
                sAlert.success("Match saved");
            } else {
                sAlert.error((error.reason ? error.reason : "An error occurred, try again"));
            }
        });
    }
});

Template.base.helpers({});

Template.base.onRendered(function () {
    $('.multiple-selection').select2({
        placeholder: "Players"
    });
});

Template.playerList.helpers({
    players: function () {
        return players();
    }
});

Template.base.events({
    'click a.match-delete': function () {
        if (confirm("You sure?")) {
            Meteor.call('match.delete', this._id, function (error, result) {
                if (result) {
                    sAlert.success("Match deleted");
                } else {
                    sAlert.error((error.reason ? error.reason : "An error occurred, try again"));
                }
            });
        }
    }
});

Template.previousMatches.helpers({
    matches: function () {
        return Matches.find();
    },
    championColour: function (team) {
        if (team == 'avengers') {
            if (this.avengers.score >= this.defenders.score)
                return 'text-success';
            else
                return 'text-danger';
        }
        if (team == 'defenders') {
            if (this.defenders.score >= this.avengers.score)
                return 'text-success';
            else
                return 'text-danger';
        }
    },
    formatPlayers: function (players) {
        return players.join(', ');
    },
    elapsedTime: function (date) {
        return moment(date, 'ddd MMM D YYYY, HH:mm:ss').fromNow();
    }
});

Template.previousMatches.onCreated(function () {
    this.subscribe('matches');
});