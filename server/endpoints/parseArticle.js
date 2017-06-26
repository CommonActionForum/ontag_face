import { downloadArticle } from 'liqen-scrapper'

export default function (req, res, next) {
  if (!req.query.uri) {
    return res.send({})
  }

  if (process.env.NODE_ENV === 'development') {
    res.send({
      body: {
        object: {
          name: 'div',
          attrs: {},
          children: [
            {
              name: 'p',
              attrs: {},
              children: [
                'Mientras la anémica creación de empleo sigue siendo el Talón de Aquiles de la ',
                {
                  name: 'a',
                  attrs: {
                    'href': 'http://www.bancomundial.org/es/region/lac/overview'
                  },
                  children: [
                    'recuperación económica en EE.UU y Europa'
                  ]
                },
                ', muchos profesionales latinoamericanos ven mejores oportunidades en esas tierras, en un éxodo que ha visto emigraciones de hasta 90% en algunos países del Caribe.'
              ]
            },
            {
              name: 'p',
              attrs: {},
              children: [
                'El colombiano Stefano Badalacchi es uno de ellos. Son las 7 AM de un húmedo día de otoño en París. Badalacchi, de 24 años, se ajusta la corbata al cuello mientras echa llave a la puerta de casa, acomoda en su hombro la bolsa con la ‘compu’, y se dirige hacia el metro que le llevará a su nuevo puesto de trabajo en Ivry Sur Senne, como analista económico en una organización no gubernamental.'
              ]
            },
            {
              name: 'p',
              attrs: {},
              children: [
                'Hace más de cinco años que se fue de Colombia, y afirma que no tiene intención de regresar, porque “aquí se te valora más como profesional”.'
              ]
            }
          ] // children
        } // object
      } // body
    })
  } else {
    return downloadArticle(req.query.uri)
      .then(article => res.send(article))
  }
}
