Meteor.methods({
    'match.save': function (data) {
        return Matches.insert(data);
    },
    'match.delete': function (id) {
        return Matches.remove(id);
    },
    'match.stats': function () {
        return Matches.aggregate([
            { "$unwind": "$avengers.players" },
            { "$group": {
                "_id": "$_id",
                "avengers": {
                    "$push": {
                        "player": "$avengers.players",
                        "win": {
                            "$cond": [
                                { "$gt": [ "$avengers.score", "$defenders.score" ] },
                                1,
                                0
                            ]
                        },
                        "loss": {
                            "$cond": [
                                { "$lt": [ "$avengers.score", "$defenders.score" ] },
                                1,
                                0
                            ]
                        }
                    }
                },
                "avengersScore": { "$first": "$avengers.score" },
                "defenders": { "$first": "$defenders" }
            }},
            { "$unwind": "$defenders.players" },
            { "$group": {
                "_id": "$_id",
                "avengers": { "$first": "$avengers" },
                "defenders": {
                    "$push": {
                        "player": "$defenders.players",
                        "win": {
                            "$cond": [
                                { "$gt": [ "$defenders.score", "$avengersScore" ] },
                                1,
                                0
                            ]
                        },
                        "loss": {
                            "$cond": [
                                { "$lt": [ "$defenders.score", "$avengersScore" ] },
                                1,
                                0
                            ]
                        }
                    }
                },
                "type": { "$first": { "$const": ["A", "B" ] } }
            }},
            { "$unwind": "$avengers" },
            { "$unwind": "$defenders" },
            { "$unwind": "$type" },
            { "$group": {
                "_id": {
                    "_id": "$_id",
                    "player": {
                        "$cond": [
                            { "$eq": [ "$type", "A" ] },
                            "$avengers.player",
                            "$defenders.player"
                        ]
                    },
                    "win": {
                        "$cond": [
                            { "$eq": [ "$type", "A" ] },
                            "$avengers.win",
                            "$defenders.win"
                        ]
                    },
                    "loss": {
                        "$cond": [
                            { "$eq": [ "$type", "A" ] },
                            "$avengers.loss",
                            "$defenders.loss"
                        ]
                    }
                }
            }},
            { "$group": {
                "_id": "$_id.player",
                "win": { "$sum": "$_id.win" },
                "loss": { "$sum": "$_id.loss" }
            }},
            { "$project": {
                "win": 1,
                "loss": 1
            }},
            { "$sort": { "_id": 1 } }
        ]);
    }
});