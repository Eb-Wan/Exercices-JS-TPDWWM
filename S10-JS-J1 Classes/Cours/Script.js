// class Car {
//     constructor(brand, model, year) {
//         this.brand = brand;
//         this.model = model;
//         this.year = year;
//     }
//     displayInfo() {
//         console.log(`Marque: ${this.brand}  |  Modèle: ${this.model}  |  Année: ${this.year}`);
//     }
// }
// const Citroen = new Car("Citroën", "2cv", 1950)
// Citroen.displayInfo();

// class User {
//     #password;
//     constructor (password) {
//         this.#password = password;
//     }
//     VerifyPass (CheckPass) {
//         return this.#password === CheckPass;
//     }
//     ChangePass (NewPass) {
//         this.#password = NewPass;
//     }
// }

// const NewUser = new User (1234);

// console.log (NewUser.VerifyPass(12345));
// NewUser.ChangePass (12345);
// console.log (NewUser.VerifyPass(12345));

// class Shape {
//     constructor (name) {
//         this.name = name;
//     }
//     Area(area) {
//         if (area === undefined) return 0;
//     }
// }

// class Rectangle extends Shape {
//     Area (Width, Height) {
//         return Width * Height;
//     }
// }

// const NewRectangle = new Rectangle ("Square");

// console.log(NewRectangle.Area(5,5));
// console.log(NewRectangle.name);

class Shape {
    constructor (name) {
        this.name = name;
    }
    Area(area) {
        return 0;
    }
    Describe() {
        console.log(`Shape: ${this.name}`);
    }
}

class Rectangle extends Shape {
    constructor (name, Width, Height) {
        super(name);
        this.Width = Width;
        this.Height = Height;
    }
    Area () {
        this.area = this.Width * this.Height;
        return this.area;
    }
    Describe() {
        if (this.area == undefined) this.Area();
        console.log(`Shape: ${this.name}  |  Area: ${this.area}`);
    }
}

class Circle extends Shape {
    constructor (name, Radius) {
        super(name);
        this.Radius = Radius;
    }
    Area () {
        this.area = Math.PI*this.Radius**2;
        return this.area;
    }
    Describe() {
        super.Describe();
        if (this.area == undefined) this.Area();
        console.log(`Area: ${this.area}`);
    }
}

const NewRectangle = new Rectangle ("Square", 5, 5);

const NewCircle = new Circle ("Circle", 5);

NewRectangle.Describe();

NewCircle.Describe();

