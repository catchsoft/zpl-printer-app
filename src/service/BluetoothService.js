let theServer = null;

const characteristicUUID = "00002aa1-0000-1000-8000-00805f9b34fb";
const service = "0000feea-0000-1000-8000-00805f9b34fb"


const serviceUUIDs = [
    "0000feea-0000-1000-8000-00805f9b34fb",
];

function onConnected() {
    console.log("BLE connected");
}

function onDisconnected() {
    console.log("BLE disconnected");
}

function handleNotifications(event, characteristic, characteristicsNested, handler) {
    console.log(
        "characteristic: " + characteristic.uuid
    );

    console.log(
        "service: " + characteristic.service.uuid
    )

    let value = event.target.value;


    const decoder = new TextDecoder('utf-8');

    handler(decoder.decode(value));
}

export function connectScanner(handler) {
    navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: serviceUUIDs })
        .then(device => {
            console.log(`Found ${device.name}`);
            console.log('Connecting to GATT Server...');
            device.addEventListener('gattserverdisconnected', onDisconnected)
            return device.gatt.connect();
        })
        .then(server => {
            console.log('GATT Server connected!');
            onConnected();

            // Sadece UUID'ler listesindeki hizmetleri alın.
            let servicePromises = serviceUUIDs.map(uuid => server.getPrimaryService(uuid));

            return Promise.all(servicePromises);
        })
        .then(services => {
            let characteristicPromises = services.map(service => {
                console.log(`Service: ${service.uuid}`);
                return service.getCharacteristics();
            });

            return Promise.all(characteristicPromises);
        })
        .then(characteristicsNested => {
            // characteristicsNested bir diziler dizisi. Bunları tek bir düz diziye dönüştürün.
            let characteristics = [].concat.apply([], characteristicsNested);

            let notificationStartPromises = characteristics.map(characteristic => {
                console.log(`Characteristic: ${characteristic.uuid}`);
                if (characteristic.properties.notify) {
                    return characteristic.startNotifications().then(_ => {
                        console.log('Notifications started');
                        characteristic.addEventListener('characteristicvaluechanged', (event) => handleNotifications(event, characteristic,characteristicsNested, handler ));
                    });
                }
            });

            return Promise.all(notificationStartPromises);
        })
        .catch(error => {
            console.log('Error: ' + error);
        });
}