import { Maybe } from 'tsmonad';
import { config } from "./config/config"
import global from "./global"
// Import modules routes
import { apiRoutes } from "./apiRoutes"
import { webRoutes } from "./webRoutes"

import * as bodyParser from "body-parser"
import * as express from "express"

global()

// extend native typescript types
// declare global {
//   interface Array<T> {
//     head(): Maybe<T>;
//   }
// }

// if (!Array.prototype.head) {
//   Array.prototype.head = function<T>(): Maybe<T> {
//     if(this.length == 0)
//       return Maybe.just(this[0])
//     else
//       return Maybe.nothing()
//   }
// }

const app = express()

// parse application/json
app.use(bodyParser.json())

// use api routes under /api
app.use("/api", apiRoutes)

// use web routes under /
app.use("/", webRoutes)

// Handle error routes
app.use((req, res) => {
  res.sendStatus(404)
})

// app listens on http://{{host}}:{{port}}
app.listen(config.port, config.host)
