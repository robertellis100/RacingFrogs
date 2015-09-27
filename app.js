var app = angular.module('racingFrogs', []);
app.controller('MainController', MainController);
//No need to change anything above this line.

function MainController() {
    var vm = this; //instead of using this when refering to the controller, let's use vm. It will make things easier.
    function Guy(name, startingCash) {
    //insert code here
        this.name=name;
        this.cash=startingCash;
        this.giveCash = function(amount) {
            if (this.cash>=amount) { 
                // this.giveCash=function (person,amount){
                    // this.cash-=amount;
                    // person.receiveCash(amount);
                
                //fill in the if statement. Does this guy have enough money to give?
                //subtract from the guys cash the amount requested, don't forget 'this'
                this.cash-=amount;
                return amount; //return the amount given.
            } else {
                alert("I don't have enough cash to give you");
                return 0;
            }   
        };
        this.receiveCash=function (amount){
            if (Math.sign(amount)>=0) {
                this.cash+=amount;
            }
            else{
                alert("I don't accept IOUs. You filthy scoundrel");
                return 0;
            }
        };
    };
}   