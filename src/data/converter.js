// converts the given  input object to a more organized object based on Manufacturers and Model

const util = require('util');
const fs = require('fs');


var input = [
    {
        "group": "Kleinst- und Kleinwagen",
        "cars": [{
            "name": "BMW i3",
            "chargeTime2_3kW": 7,
            "charTimeDrehstrom": 3,
            "chargeTimeCHAdeMO": 0.5,
            "battery": 18.8,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/BMW_i3_01.jpg/250px-BMW_i3_01.jpg",
            "ChargingLevels": [2.3, 3.7, 4.6, 7.4]
        }, {
            "name": "Chery eQ",
            "chargeTime2_3kW": 9,
            "img": "http://left-lane.com/wp-content/uploads/2015/03/Auto-sales-statistics-China-Chery_eQ-EV.png",
            "ChargingLevels": [2.3, 3.7]
        }, {
            "name": "Chevrolet Spark EV",
            "chargeTime2_3kW": 7,
            "chargeTimeCHAdeMO": 0.33,
            "battery": 21.3,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Chevrolet_Spark_front_20100601.jpg/250px-Chevrolet_Spark_front_20100601.jpg",
            "ChargingLevels": [1.9, 2.8, 3.7]
        }, {
            "name": "Renault ZOE",
            "chargeTime2_3kW": 7.5,
            "charTimeDrehstrom": 0.5,
            "battery": 22,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Renault_Zoe_charging.jpg/250px-Renault_Zoe_charging.jpg",
            "ChargingLevels": [3.7, 11, 22]
        }, {
            "name": "VW E-up!",
            "chargeTime2_3kW": 9,
            "chargeTimeCHAdeMO": 0.5,
            "battery": 18.7,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/VW_e-up%21_at_Hannover_Messe.jpg/250px-VW_e-up%21_at_Hannover_Messe.jpg",
            "ChargingLevels": [2.3, 3.6]
        }, {
            "name": "Zotye Cloud 100 EV",
            "chargeTime2_3kW": 7,
            "charTimeDrehstrom": 1,
            "img": "http://www.carnewschina.com/wp-content/uploads/2014/10/zotye-yun100-ev-launch-china-1-660x409.jpg",
            "ChargingLevels": [2.3, 3.7]
        }, {
            "name": "Renault Twizy (13kw)",
            "chargeTime2_3kW": 3.5,
            "battery": 6.1,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Renault_Twizy%2C_side_view.jpg/250px-Renault_Twizy%2C_side_view.jpg",
            "ChargingLevels": [2.3, 3.7]
        }
        ]
    }, {
        "group": "Kompaktklassewagen",
        "cars": [{
            "name": "Kia Soul EV",
            "chargeTime2_3kW": 5,
            "chargeTimeCHAdeMO": 0.5,
            "battery": 27,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Kia_Soul_1.6_GDI_Spirit_%28II%29_%E2%80%93_Frontansicht%2C_17._April_2014%2C_D%C3%BCsseldorf.jpg/250px-Kia_Soul_1.6_GDI_Spirit_%28II%29_%E2%80%93_Frontansicht%2C_17._April_2014%2C_D%C3%BCsseldorf.jpg",
            "ChargingLevels": [2.3, 3.7, 4.6, 6.6]
        }, {
            "name": "Nissan Leaf",
            "chargeTime2_3kW": 10,
            "chargeTimeCHAdeMO": 0.5,
            "battery": 24,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Nissan_Leaf_%E2%80%93_Frontansicht%2C_28._April_2012%2C_D%C3%BCsseldorf.jpg/250px-Nissan_Leaf_%E2%80%93_Frontansicht%2C_28._April_2012%2C_D%C3%BCsseldorf.jpg",
            "ChargingLevels": [2.3, 3.3, 4.6]
        }, {
            "name": "VW e-Golf",
            "chargeTime2_3kW": 10,
            "chargeTimeCHAdeMO": 0.5,
            "battery": 24.2,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/VW_e-Golf_%28VII%29_%E2%80%93_Frontansicht%2C_19._Juni_2014%2C_D%C3%BCsseldorf.jpg/220px-VW_e-Golf_%28VII%29_%E2%80%93_Frontansicht%2C_19._Juni_2014%2C_D%C3%BCsseldorf.jpg",
            "ChargingLevels": [2.3, 3.6]
        }
        ]
    }, {
        "group": "Mittel- und Oberklassewagen",
        "cars": [{
            "name": "Renault-Samsung SM3 EV",
            "chargeTime2_3kW": 7,
            "battery": 22,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Renault_Fluence_front_20100918.jpg/250px-Renault_Fluence_front_20100918.jpg",
            "ChargingLevels": [2.3, 3.7]
        }
            , {
                "name": "Tesla Model S 60",
                "chargeTime2_3kW": 17,
                "charTimeDrehstrom": 3.5,
                "chargeTimeCHAdeMO": 0.5,
                "battery": 60,
                "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tesla_Model_S_in_Trondheim.JPG/250px-Tesla_Model_S_in_Trondheim.JPG",
                "ChargingLevels": [2.3, 3.7, 4.6, 7.4, 11, 22]
            }, {
                "name": "Tesla Model S P90D",
                "chargeTime2_3kW": 25.4,
                "charTimeDrehstrom": 4.8,
                "chargeTimeCHAdeMO": 0.9,
                "battery": 90,
                "img": "https://a.gaw.to/photos/2/2/9/229142_2016_Tesla_Model_S.jpg?864x540",
                "ChargingLevels": [2.3, 3.7, 4.6, 7.4, 11, 22]
            }
        ]
    }, {
        "group": "Hybridfahrzeuge",
        "cars": [{
            "name": "Audi A3 Sportback e-tron",
            "battery": 8.8,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Audi_A3_e-tron_%2814603540286%29.jpg/250px-Audi_A3_e-tron_%2814603540286%29.jpg",
            "ChargingLevels": [2.3, 3.7]
        }, {
            "name": "BMW i8",
            "battery": 5,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/BMW_i8_IAA_2013_04.jpg/250px-BMW_i8_IAA_2013_04.jpg",
            "ChargingLevels": [2.3, 3.7]
        }, {
            "name": "Chevrolet Volt",
            "battery": 16,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/2011_Chevrolet_Volt_--_NHTSA_2.jpg/250px-2011_Chevrolet_Volt_--_NHTSA_2.jpg",
            "ChargingLevels": [2.3, 3.6]
        }, {
            "name": "Mitsubishi Outlander PHEV",
            "battery": 12,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Mitsubishi_Outlander_PHEV_%28front_quarter%29.JPG/250px-Mitsubishi_Outlander_PHEV_%28front_quarter%29.JPG",
            "ChargingLevels": [2.3, 3.6]
        }, {
            "name": "OPEL Ampera",
            "battery": 16,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Opel_Ampera_ePionier_Edition_%E2%80%93_Frontansicht%2C_9._Juli_2012%2C_Heiligenhaus.jpg/250px-Opel_Ampera_ePionier_Edition_%E2%80%93_Frontansicht%2C_9._Juli_2012%2C_Heiligenhaus.jpg",
            "ChargingLevels": [2.3, 3.6]
        }, {
            "name": "Porsche Panamera S E-Hybrid",
            "battery": 9.4,
            "img": "https://2.bp.blogspot.com/-LY3dbhC5pLU/UVtSsZbdh8I/AAAAAAAATu0/Xq1YNxKdKHk/s400/2014-Porsche-Panamera-1%5B2%5D.jpg",
            "ChargingLevels": [2.3, 3.6]
        }, {
            "name": "918 Spyder",
            "battery": 6.8,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Porsche_918_Spyder_IAA_2013.jpg/250px-Porsche_918_Spyder_IAA_2013.jpg",
            "ChargingLevels": [2.3, 3.6]
        }, {
            "name": "Toyota Prius Plug-in Hybrid",
            "battery": 4.4,
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Toyota_Prius_Life_%28III%2C_Facelift%29_%E2%80%93_Frontansicht%2C_11._Februar_2013%2C_D%C3%BCsseldorf.jpg/220px-Toyota_Prius_Life_%28III%2C_Facelift%29_%E2%80%93_Frontansicht%2C_11._Februar_2013%2C_D%C3%BCsseldorf.jpg",
            "ChargingLevels": [2.3, 2.8]
        }, {
            "name": "Volvo V60 Plug-in Hybrid",
            "battery": 11.2,
            "img": "https://data.motor-talk.de/data/galleries/0/6/7618/46276935/41411-1-5-20461484634141393.jpg",
            "ChargingLevels": [2.3, 3.6]
        }
        ]
    }
];

var cars = [];
var manufacturors = [];
var i = 1;
input.map(function(inp) {
    inp.cars.map(function(car) {
        manufacturors.forEach(function (val) {

        });
        manufacturors.push(car.name.substring(0 , car.name.indexOf(" ")));
});
});

var uniqueMan = manufacturors.filter((v, i, a) => a.indexOf(v) === i);

fs.writeFileSync('./man.json', JSON.stringify(uniqueMan) , 'utf-8');


var model;
uniqueMan.forEach(function (man) {
    var j = 1;

    var tmpCar = {
        "id": "" + i,
        "name": man,
        "models": []
    };
    input.map(function (inp) {
        inp.cars.map(function (car) {
            if (car.name.substring(0, car.name.indexOf(" ")) == man) {


                // model = {
                //     "id": "" + j,
                //     "name": car.name.substring(car.name.indexOf(" ") + 1, car.name.length)
                // };
                model = car;
                model.id = "" + j;
                model.name = car.name.substring(car.name.indexOf(" ") + 1, car.name.length);

                tmpCar.models.push(model);
                j++;
            }
        })
    });
    cars.push(tmpCar);
    i++;
});

console.dir(cars, { depth: null });
console.dir(JSON.stringify(cars));

// fs.writeFileSync('./data.json', JSON.stringify(cars) , 'utf-8');



