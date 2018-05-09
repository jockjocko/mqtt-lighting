var mosca = require('mosca')

var ascoltatore = {
    type: 'redis',
    redis: require('redis'),
    db: 12,
    port: 6379,
    return_buffers: true, // to handle binary payloads
    host: "localhost"
};

var moscaSettings = {
    port: 1883,
    backend: ascoltatore,
    persistence: {
        factory: mosca.persistence.Redis
    }
};


var server = new mosca.Server(moscaSettings);
server.on('ready', setup);
var getMsg = (color) => {
    return {
        topic: 'bruh/desk/set',
        payload: JSON.stringify({
            "brightness": 255,
            "color": color,
            "effect": "rainbow",
            "state": "ON"
        }),
        qos: 0, // 0, 1, or 2
        retain: true // or true
    };
}


var color = {
    r: 52,
    g: 75,
    b: 150
}

server.on('clientConnected', function (client) {
    console.log('client connected', client.id);
    setTimeout(() => {
        server.publish(getMsg(color), client, (error) => {
            console.log(error)
            console.log('SENT PACKET TO CLIENT');
        });
    }, 5000);
});




// fired when a message is received
server.on('published', function (packet, client) {
    console.log('Published', packet.topic, packet.payload);
});

// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running')
}