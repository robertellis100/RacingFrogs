var app = angular.module('racingFrogs', []);
app.controller('MainController', MainController);

function MainController($timeout, FrogService, BettingService) {
    var vm = this; //instead of using this when refering to the controller, let's use vm. It will make things easier.
    vm.raceDayStarted = false;
    vm.races = {};
    vm.joe = new Guy("Joe", 250)
    vm.bob = new Guy("Bob", 150)
    vm.people = [vm.joe, vm.bob];
    

    function Guy(name, startingCash) {
        this.name = name;
        this.cash = startingCash;
        this.bets = [];
        this.giveCash = function (amount) {
            if (amount <= this.cash && amount > 0) {
                this.cash = this.cash - amount;
                return amount;
            } else {
                alert("I don't have enough cash to give you $" + amount + ". " + this.name + " says...");
                return 0;
            }
        };
        this.receiveCash = function (amount) {
            if (amount >= 0) {
                this.cash = this.cash + amount;
                return amount;
            } else {
                alert("No IOUs.  $" + amount + " isn't an amount I'll take " + this.name + " says...");
                return 0;
            }
        }
    }

    var frogPool = [];
    //debugger;
    vm.startNewRaceDay = function () {
        //resets everything...
        var names = ["Axel", "Tina", "Harry", "Bob", "Tom", "Phil", "Larry", "Xixi", "Lulu", "Burlap", "Ribbit"];
        frogPool = FrogService.getFrogs(names.length, names);
        vm.startNewHeat();
        
    }

    vm.startNewHeat = function () {
        //get the frogs that are going to race!
        //var howMany = Math.max(Math.floor(Math.random() * names.length) + 1, 2); //must have 2 racers 
        frogPool.forEach(function (racer) {
            racer.posX = 0;
        });
        var racers = getRaceSet(5);
        var race = BettingService.registerRace(racers);
        vm.races[race.id] = race;
        vm.heat = race;
        vm.betQuantity=0;
        
    }

    vm.startRace = function () {
        vm.heat.start(function () {
            //have everyone collect their winnings
            vm.people.forEach(function (person) {
                person.bets.forEach(function (bet) {
                    if (!bet.collected) {
                        var winnings = BettingService.collectWinnings(bet.id);
                        person.receiveCash(winnings);
                    }
                });
            });
        });
    }


    vm.placeBet = function (person, racer, amount) {
        //recieve cash from the person.
        var cash = person.giveCash(amount);
        //then place the bet on the selected frog by calling the betting service.
        var bet = BettingService.setBet(vm.heat.id, racer, cash);
        //add the bet to the persons array of bets.
        person.bets.push(bet);
        vm.betQuantity++;
    }

    // Game Services
    //create all frogs and place them in the frogPool[]
    //assign a random number of frogs to the raceSet[]
    function getRaceSet(howMany) {
        var racingFrogs = [];
        frogPool = shuffle(frogPool);
        for (var i = 0; i <= howMany; i++) {
            racingFrogs[i] = frogPool[i];
        }
        return racingFrogs;
    };
    vm.startNewRaceDay();
    vm.finishLine = 90;
    vm.maxPastFinishLine = 100;
    vm.winners = [];
    
    
    // vm.checkWinners = function () {
    //     //vm.winners = [];
    //     var _potentialWinners = [];
    //     vm.racingFrogs.forEach(function (frog) {
    //         if (frog.posX >= vm.finishLine) {
    //             vm.isRacing = false;
    //             _potentialWinners.push(frog);
    //             frog.winRecord++;
    //         }
    //     });
    //     if (_potentialWinners.length > 0) {
    //         var _firstToCross = 0;
    //         var _firstPlace;
    //         _potentialWinners.forEach(function (frog) {
    //             if (frog.posX > _firstToCross) {
    //                 _firstToCross = frog.posX;
    //                 _firstPlace = frog;
    //             }
    //             else if (frog.posX === _firstToCross) {
    //                 vm.winners.push(frog);
    //             }
    //         })
    //         vm.winners.unshift(_firstPlace);
    //         return vm.winners
    //     }
    //     else {
    //         return true;
    //     }
    // }
    // vm.raceId = BettingService.registerRace();
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;

    
}





