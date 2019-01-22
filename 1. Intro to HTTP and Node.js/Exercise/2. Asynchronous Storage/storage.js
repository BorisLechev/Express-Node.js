const fs = require("fs");

let storage = {};
let data = {};

function put(key, value) {
    if (typeof key === "string") {
        if (!storage.hasOwnProperty(key)) {
            storage[key] = value;
        } else {
            throw new Error("Key exist.");
        }
    } else {
        throw new Error("The key should be string.");
    }
}

function get(key) {
    if (typeof key === "string") {
        if (storage.hasOwnProperty(key)) {
            return storage[key];
        } else {
            throw new Error("Key does not exist.");
        }
    } else {
        throw new Error("The key should be string.");
    }
}

function getAll() {
    if (Object.keys(storage).length === 0) {
        throw new Error("The storage is empty.");
    }

    return storage;
}

function update(key, value) {
    if (typeof key === "string") {
        if (storage.hasOwnProperty(key)) {
            storage[key] = value;
        } else {
            throw new Error("Key does not exist.");
        }
    } else {
        throw new Error("The key should be string.");
    }
}

function remove(key) {
    if (typeof key === "string") {
        if (storage.hasOwnProperty(key)) {
            delete storage[key];
        } else {
            throw new Error("Key does not exist.");
        }
    } else {
        throw new Error("The key should be string.");
    }
}

function clear() {
    storage = {};
}

function save() {
    return new Promise((resolve, reject) => {
        fs.writeFile("storage.json", JSON.stringify(storage), (error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });
}

function load() {
    return new Promise((resolve, reject) => {
        fs.readFile("storage.json", "utf-8", (error, dataJSON) => {
            if (error) {
                reject(error);
                return;
            }

            data = JSON.parse(dataJSON);

            resolve();
        });
    });
}

module.exports = {
    put,
    get,
    getAll,
    update,
    remove,
    clear,
    save,
    load
};