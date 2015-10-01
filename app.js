var app = angular.module('racingFrogs', []);
app.controller('MainController', MainController);
//No need to change anything above this line.
var myVar;
function MainController($timeout) {
    var vm = this; //instead of using this when refering to the controller, let's use vm. It will make things easier.
    //sounds good
    vm.joe = new Guy("Joe", 100)
    vm.bob = new Guy("Bob", 150)
    vm.bank = 200;

    function Guy(name, startingCash) {
        this.name = name;
        this.cash = startingCash;
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
            if (amount > 0) {
                this.cash = this.cash + amount;
                return amount;
            } else {
                alert("No IOUs.  $" + amount + " isn't an amount I'll take " + this.name + " says...");
                return 0;
            }
        }
    }
    vm.giveMoneyToJoe = function () {
        if (vm.bank >= 10) {
            vm.bank -= vm.joe.receiveCash(10)
        } else {
            alert("The bank is out of money.")
        }
    }

    vm.receiveMoneyFromBob = function () {
        vm.bank += vm.bob.giveCash(5)
    }


    vm.maxFrogRaceAmount = 25;
    vm.initialX = 20;
    
    
    //I need a FrogMaker
    
    
    // vm.getFrogName=function(){
    //     alert("Monkey");
    // }
    
    
    // vm.frogName=[{frog:"Axel"},{frog:"Tina"},"Harry","Bob","Tom","Phil","Larry","Xixi","Lulu","Burlap","Ribbit"]
    // vm.frogSet = [];
    // vm.frogName.forEach(function(frogName){
    //     vm.frogSet.push({name:frogName});
    // }
    //I want to create the frog and assign the name and color at random
    
    // createFrogSet = function(){
    //     vm.frogName.forEach(function(frogName){
    //     vm.frogSet.push({name:frogName});
    // }
    // vm.joe = new Guy("Joe", 100)
    // vm.bob = new Guy("Bob", 150)
    

    
    //vm.raceSet=vm.frogName;
    
    
    // Frog Services
    //debugger;
    var frogService = new FrogService();
    var names = ["Axel", "Tina", "Harry", "Bob", "Tom", "Phil", "Larry", "Xixi", "Lulu", "Burlap", "Ribbit"];
    var frogPool = frogService.getFrogs(names.length, names);
    vm.racingFrogs = [];
          
    // Game Services
    //create all frogs and place them in the frogPool[]
    //assign a random number of frogs to the raceSet[]
    vm.getRaceSet = function () {
        vm.racingFrogs = [];
        var howMany = Math.max(Math.floor(Math.random() * names.length) + 1, 2); //must have 2 racers 
        for (var i = 0; i <= howMany; i++) {
            vm.racingFrogs[i] = frogPool[i];
        }
    };
    vm.getRaceSet();

    vm.finishLine = 90;
    vm.maxPastFinishLine = 95;
    vm.winners=[];
    var racing = false;
    vm.race = function () {
       if(vm.winners.length>0){
           return;
       }
       racing = true;
       
        //frogs need to move
        //frog.
        //frogs move by their .move method
        //select each frog from the racingFrogs array
        //use for loop
        //then call function again at the end if a condition has not been met
        for (var i = 0; i < vm.racingFrogs.length; i++) {
            vm.racingFrogs[i].move();
        }
        vm.checkWinners();
        if (racing) {
            $timeout(vm.race,58);
        }

    }
    vm.checkWinners = function () {
        //vm.winners = [];
        var _potentialWinners = [];
        vm.racingFrogs.forEach(function (frog) {
            if (frog.posX >= vm.finishLine) {
                racing = false;
                _potentialWinners.push(frog);
                frog.winRecord++;
            }
        });
        if (_potentialWinners.length > 0) {
            var _firstToCross = 0;
            var _firstPlace;
            _potentialWinners.forEach(function (frog) {
                if (frog.posX > _firstToCross) {
                    _firstToCross = frog.posX;
                    _firstPlace = frog;
                }
                else if (frog.posX === _firstToCross) {
                    vm.winners.push(frog);
                }
            })
            vm.winners.unshift(_firstPlace);
            return vm.winners
        }
        else {
            return true;
        }
    }

}


function FrogService() {


    function getRandomColor() {
        return Math.floor(Math.random() * 16777215).toString(16);
        //  https://css-tricks.com/snippets/javascript/random-hex-color/
    };

    function getRandomSpeed(max, min) {
        var minSpeed = min || 5;
        var maxSpeed = max || 15;
        return Math.floor((Math.random() * maxSpeed) + minSpeed);
    };

    function Frog(name, initialX, speed, color, id) {
        this.name = name;
        this.id = id;
        this.posX = initialX;
        this.speed = speed; //todo - eventually assign speeds to each frog for Stats for each frog
        this.move = function (speed) {
            this.posX += this.speed;
        }.bind(this)
        this.color = color;
        //todo - add winner tally
        this.winRecord = 0;
    }

    var frogId = 100;

    function createRandomFrog(name) {
        var speed = getRandomSpeed(5, 15);
        var color = getRandomColor();
        var id = ++frogId; //post vs pre operative
        return new Frog(name, 0, speed, color, id);
    }

    this.getFrogs = function (howMany, names) {
        var tempNames = shuffle(names);
        var frogs = [];
        for (var i = 0; i <= howMany; i++) {
            frogs[i] = createRandomFrog(tempNames[i]);
        }
        return frogs;
    }
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