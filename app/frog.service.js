app.service('FrogService', FrogService);
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
        var _this = this;
        this.name = name;
        this.id = id;
        this.posX = initialX;
        this.speed = speed;
        this.move = function (modifier) {
            _this.posX += _this.speed * modifier;
        }
        this.color = color;
        //todo - add winner tally
        this.winRecord = 0;
    }

    var frogId = 100;

    function createRandomFrog(name) {
        var speed = getRandomSpeed(3, 7);
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