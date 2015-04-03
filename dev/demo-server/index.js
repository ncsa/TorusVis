
"use strict";

var express = require("express");
var path = require("path");
var bundleware = require("bundleware");

var ppaths = require("../grunt-config/project-paths");

var app = express();
var S = express.static;

app.use("/", S(ppaths.directories.demoServerRoot));
app.use("/img", S(path.join(ppaths.directories.examples, "img")));
app.use("/css", S(path.join(ppaths.directories.examples, "css")));
app.use("/examples", S(ppaths.directories.examples));
app.use("/docs", S(ppaths.directories.docs));
app.use("/js/node_modules", S(ppaths.directories.nodeModules));
app.use("/js", S(ppaths.directories.build));
app.use("/js", bundleware());
app.use("/pubs", S(ppaths.directories.pubs));

app.use("/src/index.js", S("index.js"));

app.use("/src/colors.js", S("colors.js"));
app.use("/src/engines.js", S("engines.js"));
app.use("/src/graphs.js", S("graphs.js"));
app.use("/src/groups.js", S("groups.js"));
app.use("/src/mappers.js", S("mappers.js"));
app.use("/src/misc.js", S("misc.js"));

app.use("/src/colors", S("colors"));
app.use("/src/engines", S("engines"));
app.use("/src/graphs", S("graphs"));
app.use("/src/groups", S("groups"));
app.use("/src/mappers", S("mappers"));
app.use("/src/misc", S("misc"));

app.use("/repo", S("."));

app.get("/quit", function(req, res) {
    var message = "Recieved quit query from " + req.ip + ".  Closing...";
    res.send(message);
    console.log(message);
    setTimeout(function() {
        server.close();
        process.exit(0);
    }, 1000);
});

app.get("/", function(req, res) {
    res.redirect("examples");
});

var server = app.listen(5000);
console.log("listening on port 5000");

