const Car = require("../models/Car");
const Rent = require("../models/Rent");

module.exports = {
    addGet: (req, res) => {
        res.render("car/add");
    },
    addPost: (req, res) => {
        // Get info from request body  look in add.hbs -> names
        // validate entity
        // insert into db -> redirect

        const carBody = req.body;
        carBody.pricePerDay = +carBody.pricePerDay;

        Car.create(carBody).then(() => {
                res.redirect("/");
            })
            .catch(console.error);
    },
    allCars: (req, res) => {
        Car.find({
                isRented: false // should not display rented cars
            })
            .then((cars) => { // watch all.hbs
                res.render("car/all", {
                    cars
                });
            })
            .catch(console.error);
    },
    rentGet: (req, res) => { // after we click rent car will disappear
        const carId = req.params.id;

        Car.findById(carId)
            .then((car) => {
                res.render("car/rent", car);
            })
            .catch(console.error);
    },
    rentPost: async (req, res) => {
        const car = req.params.id; // params because it's from url
        const user = req.user._id; // deserialized user object from passport.js   _id -> from db 
        const days = +req.body.days; // rent.hbs Rent.js

        try {
            const rent = await Rent.create({
                days,
                user,
                car
            });

            const carById = await Car.findById(car);
            carById.isRented = true;
            await carById.save(); // can work without await also
            req.user.rents.push(rent._id); // rented cars push in array check User.js "rents":[...]
            await req.user.save(); // save rents in the array
            res.redirect("/car/all");
        } catch (err) {
            console.log(err);
        }

        // Rent.create({
        //         days,
        //         user,
        //         car
        //     })
        //     .then(() => {
        //         Car.findById(car)
        //             .then((c) => {
        //                 c.isRented = true;

        //                 return c.save();
        //             })
        //             .then(() => {
        //                 res.redirect("/car/all");
        //             })
        //             .catch(console.error);
        //     })
        //     .catch(console.error);
    },
    editGet: (req, res) => {
        const carId = req.params.id;

        Car.findById(carId)
            .then((car) => {
                res.render("car/edit", {
                    car
                });
            })
            .catch(console.error);
    },
    editPost: (req, res) => {
        const carId = req.params.id;
        const {
            model,
            imageUrl,
            pricePerDay
        } = req.body;

        Car.findById(carId)
            .then((oldCar) => {
                oldCar.model = model;
                oldCar.imageUrl = imageUrl;
                oldCar.pricePerDay = +pricePerDay;

                return oldCar.save();
            })
            .then(() => {
                res.redirect("/car/all");
            })
            .catch(console.error);
    }
};