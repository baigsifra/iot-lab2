document.onkeydown = updateKey;
document.onkeyup = resetKey;

var server_port = 65432;
var server_addr = "192.168.10.5";   // the IP address of your Raspberry PI

function client(input_data){
    
    const net = require('net');
    // var input = document.getElementById("message").value;

    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        // 'connect' listener.
        console.log('connected to server!');
        // send the message
        client.write(`${input_data}\r\n`);
    });
    
    // get the data from the server
    client.on('data', (data) => {
        let data_returned = data.toString().split("\r\n");
        let temp = data_returned[0].split(" ");
        
        document.getElementById('temperature').innerHTML = temp[1];
        if (Number(temp[1]) > 80) {
            document.getElementById('temperature_dot').style.color = 'red';
        } else {
            document.getElementById('temperature_dot').style.color = 'green';
        }

        let dist = data_returned[1].split(" ");
        document.getElementById('distance').innerHTML = dist[1];
        if (Number(dist[1]) < 20) {
            document.getElementById('distance_dot').style.color = 'red';
        } else {
            document.getElementById('distance_dot').style.color = 'green';
        }

        let dir = data_returned[2].split(" ");
        document.getElementById('direction').innerHTML = dir[1];

        let speed = data_returned[3].split(" ");
        document.getElementById('speed').innerHTML = speed[1];

        client.end();
        client.destroy();
    });

    client.on('end', () => {
        console.log('disconnected from server');
    });


}

function send_data(data) {
    client(data);
}

// for detecting which key is been pressed w,a,s,d
function updateKey(e) {

    e = e || window.event;

    if (e.keyCode == '87') {
        // up (w)
        document.getElementById("upArrow").style.color = "green";
        send_data("87");
    }
    else if (e.keyCode == '83') {
        // down (s)
        document.getElementById("downArrow").style.color = "green";
        send_data("83");
    }
    else if (e.keyCode == '65') {
        // left (a)
        document.getElementById("leftArrow").style.color = "green";
        send_data("65");
    }
    else if (e.keyCode == '68') {
        // right (d)
        document.getElementById("rightArrow").style.color = "green";
        send_data("68");
    }
}

// reset the key to the start state 
function resetKey(e) {

    e = e || window.event;

    document.getElementById("upArrow").style.color = "grey";
    document.getElementById("downArrow").style.color = "grey";
    document.getElementById("leftArrow").style.color = "grey";
    document.getElementById("rightArrow").style.color = "grey";
}


// update data for every 50ms
function update_data(){
    setInterval(function(){
        // get image from python server
        client("sensors");
    }, 50);
}
