const http = require('http');
const fs = require('fs');
var requests = require('requests')

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    var num = orgVal.main.temp -273.15;
    let temperature = tempVal.replace("{%tempval%}", num.toFixed(2));
    var num = orgVal.main.temp_min -273.15;
    temperature = temperature.replace("{%tempmin%}", num.toFixed(2));
    var num = orgVal.main.temp_max -273.15;
    temperature = temperature.replace("{%tempmax%}", num.toFixed(2));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);

    return temperature;
}

const server = http.createServer((req, res) =>{
    if(req.url == "/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Indore&appid=85edbaacb8aa8b7549952d74a737ad87")
        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            // console.log(arrData[0].main.temp -273.15);
            const realTimeData = arrData
            .map((val) => replaceVal(homeFile, val))
            .join("");
            res.write(realTimeData);
        })
        .on("end", (err) => {
            if(err) return console.log('connection closed due to errors', err);
            res.end()
            console.log("end");
        });
    }
});

server.listen(8000, "127.0.0.1");