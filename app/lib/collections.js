Schema = {};

Schema.Team = new SimpleSchema({
    'players': {
        type: [String],
        optional: false
    },
    'score': {
        type: Number,
        optional: false
    }
});

Schema.Matches = new SimpleSchema({
    'avengers': {
        type: Schema.Team
    },
    'defenders': {
        type: Schema.Team
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();
            }
        }
    }
});

Matches = new Mongo.Collection("matches");
Matches.attachSchema(Schema.Matches);

