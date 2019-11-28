import * as soap from 'soap'

export const createSoapClient = () => {
    const url = process.env.ALLEGRO_WDSL_URL
    console.log(url)
    let args = {name: 'value'};
    soap.createClient(url, function(err, client) {
        console.log(client)
    //   client.MyFunction(args, function(err, result) {
    //       console.log(result);
    //   });
    });
}