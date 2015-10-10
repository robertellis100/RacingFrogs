app.service('BettingService', BettingService);
function BettingService($timeout) {
    var _races = {};
    var _bets = {}
    var _raceId = 100;
    var _betId = 100;

    this.registerRace = function (racers) {
        var race = new Race(racers);
        _races[race.id] = race;
        return race;
    }

    this.getRace = function (raceId) {
        return _races[raceId];
    }

    this.setBet = function (raceId, racer, amount) {
        //can I set a bet on this race?
        var race = this.getRace(raceId);
        if (!race.isOpen) {
            alert("Race is over!")
            return null;
        }
        //ensure the racer is in the race.
        if (race.racers.indexOf(racer) < 0) {
            alert("Racer isn't in this race!")
            return null;
        }
        
        //create the bet
        var bet = new Bet(raceId, racer, amount);
        //add the bet to our store.
        _bets[bet.id] = bet;
        //add the bet to the race object.
        race.bets[bet.id] = bet;      
        //return the bet to the user.
        return bet;
    }

    function Bet(raceId, racer, amount) {
        this.raceId = raceId;
        this.racer = racer;
        this.amount = amount;
        this.id = _betId;
        _betId++;
        this.collected = false;
    }

    function Race(racers) {
        var _this = this;
        this.id = _raceId;
        _raceId++;
        this.racers = racers;
        this.bets = {};
        this.isOpen = true;
        this.winner;
        this.status;
        this.start = function (raceCompleted) {
            //close the race down
            this.isOpen = false;
            this.status = "Racing";
            //loop through all the racers, and call .move();
            //IIFE Immediatly Invoked Function Expression. This function will run immediatly.
            (function moveRacers() {
                for (var i = 0; i < racers.length; i++) {
                    racers[i].move(Math.random());//todo change 1 to random.
                    if (racers[i].posX >= 100) {
                        _this.winner = racers[i];
                        _this.status = "Finished";
                        raceCompleted();
                        return;
                    }
                }
                $timeout(moveRacers, 150)
            })();
        }
    }

    this.collectWinnings = function (betId) {
        //get the bet from my store
        var bet = _bets[betId];
        //check to see if the winner matches the bets racer
        //get the race.
        var race = this.getRace(bet.raceId);
        if (race.winner === bet.racer && !bet.collected) {
            //close the bet
            bet.collected = true; 
            //return the cash!
            return bet.amount * 2;
        } else {
            return 0;
        }
    }
       
}
