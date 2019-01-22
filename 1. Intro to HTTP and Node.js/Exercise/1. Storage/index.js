const storage = require("./storage");

storage.put("first", "firstPlayer");
storage.put("second", "secondPlayer");
storage.update("first", "shit");
storage.put("third", "boli");
storage.delete("third");
//storage.clear();

console.log(storage.get("first"));

storage.save();
storage.load();

storage.put("fourth", "chesan");
storage.save();
storage.load();

console.log(storage.getAll());