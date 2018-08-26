import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import path from 'path'

const port = process.env.PORT || 5000;

const app = express();
const server = http.Server(app);

// Body parser
app.use(bodyParser.json());

// Router
import yelp from './routes/yelp.routes'

app.use('/api/yelp', yelp);

// production
app.use(express.static(path.resolve(`${__dirname}/../../build`)))

server.listen(port, () => {console.log(`server listens on port: ${port}`)});
