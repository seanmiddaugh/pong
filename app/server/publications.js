Meteor.publish('matches', function () {
    return Matches.find({}, {sort: {createdAt: -1}, limit: 15});
});
