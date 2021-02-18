import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";
import Config = FireworkCrafting.Config;
let orders: Mongo.Collection;

    let port: number | string | undefined = process.env.PORT;
    if (port == undefined)
        port = 5001;

    let databaseUrl: string = "mongodb+srv://EIA2:Digitalpoet@cluster0.xayns.mongodb.net/";

    startServer(port);
    connectToDatabase(databaseUrl);

    function startServer(_port: number | string): void {
        let server: Http.Server = Http.createServer();
        console.log("Server starting on port:" + _port);

        server.listen(_port);
        server.addListener("request", handleRequest);
    }

    async function connectToDatabase(_url: string): Promise<void> {
        let options: Mongo.MongoClientOptions = {useNewUrlParser: true, useUnifiedTopology: true};
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        orders = mongoClient.db("EIA").collection("Rockets");
        console.log("Database connection ", orders != undefined);
    }

    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {

        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        if (_request.url) {
            let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);
            if (url.query["type"] == "put") {
            console.log("PUT");
                //umwandeln des übergebenen Objektes zu einem json Objekt
                let settings: Config = JSON.parse(<string>url.query["RocketConfig"]);
                //Übergebenes Objekt in die Datenbankcollection einfügen
                console.log(settings);
                await orders.insertOne(settings);
            }
            //Wenn type auf get gesetzt, dann gebe alle konfigurationen aus der Datenbank aus
            else if (url.query["type"] == "get") {
                console.log("GET");
                //Alle Konfigurationen aus der Datenbank holen
                let allFireworks: Config[] = await orders.find().toArray();
                //Alle Konfigurationen in die Antwort reinschreiben
                console.log(JSON.stringify(allFireworks));
                _response.write(JSON.stringify(allFireworks));
            }
        }
        _response.end();
    }




