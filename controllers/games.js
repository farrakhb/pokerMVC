var Game = require('../models/game');
// var Player = require('./players');
var Player = require('../models/player');

function initGame(req, res) {
	var game = {
		players: [],
		flop: [],
		round: 1,
		pot: 0
	};

	// var isComputer = req.body.isComputer;
	// var name = req.body.player;

	// var isComputer1 = req.body.isComputer1;
	// var name1 = req.body.player1;

	// var player = req.body.player2;
	// var player = req.body.player3;
	// var player = req.body.player4;
	// console.log(req.body.name1);

	//DELETED [0]

	var player1 = {
		name: req.body[0].name,
		isComputer: req.body[0].isComputer
	};

	var player2 = {
		name: req.body[1].name1,
		isComputer: req.body[1].isComputer1
	}

	Game.create(game, function(err, newGame) {
		if (err) console.log(err);
		Player.create(player1, function(err, newPlayer1) {
			if (err) console.log(err);
			newGame.players.push(newPlayer1);
			Player.create(player2, function(err, newPlayer2) {
				if (err) console.log(err);
				newGame.players.push(newPlayer2);
				newGame.save(function(err, savedGame) {
					if (err) console.log(err);
					return res.status(200).json(savedGame);
				})
			})
		})
	})
	//
	// Game.create(game, function(err, result) {
	// 	console.log(name);
	// 	if (err) console.log(err);
	//
	// 	// adds the human player
	//
	// 	//adds the computer player
	// 	addPlayer(function(game) {
	// 		addPlayer(function(game) {
	// 			(function(){
	// 				return res.status(200).json(game);
	// 			})();
	// 		}, player1.name, player1.isComputer);
	// 	}, player2.name1, player2.isComputer1);
	//
	// })

}

function addPlayer(callback, name, isComputer) {

	Game.findOne({}, function(err, game) {
		console.log(name);
		var newPlayer = new Player({
			name: name,
			hand: [],
			round1Choice: "",
			round2Choice: "",
			round3Choice: "",
			balance: 0,
			isComputer: isComputer
		});

		newPlayer.save(function(err, player) {
			if (err) console.log(err);
			game.players.push(player);
			game.save(function(err, newGame) {
				return callback(newGame);
			});
		});
	});
}

function returnWinner(req, res) {

	Game.findOne({}, function(err, game) {
		var userId = game.players[0];
		var computerId = game.players[1];
		var flop = game.flop;
		Player.findById(userId, function(err, user) {
			var userHand = user.hand;
			Player.findById(computerId, function(err, computer) {
				var computerHand = computer.hand;
					var win = winner(userHand, computerHand, flop);
					return res.status(200).json({Winner : win});
				});
			});
		});
}

function computerDecision(req, res) {


}


function winner() {

    hand1 = [{
        _id: "57e90144e23cc0a63026a7e0",
        Suit: "Diamonds",
        Number: 6
    }, {
        _id: "57e90144e23cc0a63026a7e0",
        Suit: "Diamonds",
        Number: 6
    }];

    hand2 = [{
        _id: "57e90144e23cc0a63026a7e0",
        Suit: "Diamonds",
        Number: 9
    }, {
        _id: "57e90144e23cc0a63026a7e0",
        Suit: "Diamonds",
        Number: 10
    }];



    flop = [{
        _id: "57e90144e23cc0a63026a7e0",
        Suit: "Diamonds",
        Number: 4
    }, {
        _id: "57e90144e23cc0a63026a7e0",
        Suit: "Diamonds",
        Number: 11
    }];


    var hand1Score = evaluateHand(hand1, flop);
    var hand2Score = evaluateHand(hand2, flop);


    if (hand1Score > hand2Score) {
        return "User";
    } else if (hand1Score < hand2Score) {
        return "Computer";
    } else return "Draw";

}


function evaluateHand(hand, flop) {
    var handScore = 0;


    var allCards = hand.concat(flop);


    handScore += highCard(allCards);
    handScore += findPair(allCards);

    return handScore;
}

function highCard(allCards) {
    // var highCardScore = 0;
    var i = 0;
    while (i < allCards.length) {
        switch (allCards[i].Number) {
            case 14:
                return 14;
            case 13:
                return 13;
            case 12:
                return 12;
            case 11:
                return 11;
            default:
                // console.log("Not a high card");
                return 0;
        }
        i++;

    }
    return 0;
}

function findPair(allCards) {
    var pair = 0;

    // for (var i = 0; i < allCards.length - 1; i++) {
    //     for (var j = i; j < allCards.length - 1; j++) {
    //         func([this[i], this[j+1]]);
    //     }
    // }

    var allCardsArray = [];
    for (var i = 0; i < allCards.length; i++) {
        allCardsArray.push(allCards[i].Number);
    }

    allCardsArray.sort(sortNumber);

    // console.log(allCardsArray);

	var results = [];
	for (var i = 0; i < allCardsArray.length - 1; i++) {
	    if (allCardsArray[i + 1] == allCardsArray[i]) {
	        results.push(allCardsArray[i]);
    	}
	}

	console.log(results);
}

function sortNumber(a,b) {
    return a - b;
}


module.exports = {
	index : initGame,
	returnWinner : returnWinner,
	computerDecision : computerDecision
};
