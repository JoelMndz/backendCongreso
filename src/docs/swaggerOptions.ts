import {PORT,DOMAIN} from '../config'
export const swaggerOptions = {
    definition:{
        openapi:'3.0.0',
        info:{
          title:'Backend Congreso',
          version:'1.0.0',
          description:'API REST que sirve los enpoint necesarios para el funcionamiento del congreso'
        },
        servers:[
          {
            url: `http://${DOMAIN}:${PORT}`
          }
        ]
      },
      apis: ['./src/routes/*.ts'],
}