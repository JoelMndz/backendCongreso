import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import swaggerExpress from 'swagger-ui-express'
import swaggerDoc from 'swagger-jsdoc'

import { swaggerOptions } from './docs'
import { DOMAIN, PORT} from './config'
import { connectMongoDB } from './database'

export class Server{
    private app;

    constructor(){
        this.app = express();
        connectMongoDB();
        this.configuration();
        this.middlewares();
        this.routes();
    }

    private configuration(){
        this.app.set('port', PORT);
        const spec = swaggerDoc(swaggerOptions);
        this.app.use('/',swaggerExpress.serve, swaggerExpress.setup(spec));
    }

    private middlewares(){
        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use(express.json({limit: '30mb'}));
    }

    private routes(){

    }

    public listen(){
        this.app.listen(this.app.get('port'), ()=>{
            console.log(`Sever corriendo en http://${DOMAIN}:${PORT}`);            
        })
    }
}