const storage = require("./storage");

storage.put("first", "firstPlayer");
storage.put("second", "secondPlayer");
storage.update('first', 'shit');
storage.put("third", "chereshi");

console.log(storage.get('first'));

console.log(storage.get('second'));

storage.remove('second');

console.log(storage.getAll());

storage.clear();

storage.put("second", "coca-cola");
storage.put("third", "pepsi");

storage.save().then(() => {
    storage.clear();

    storage.load().then(() => {
        console.log(storage.get('second'));
    }).catch(err => console.log(err));
}).catch(err => console.log(err));