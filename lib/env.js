'use strict';

function loadAllFilter( name, type, value ) {

    return name.toUpperCase();
}

function loadToEnv( query, filter = loadAllFilter ) {

    return query.execute()
        .then( (parameters) => {

            let results = {

                added: [],
                ignored: [],
                conflict: []
            };

            for( let param of parameters ) {

                let name = filter( param.Name, param.Type, param.Value );

                if( name ) {

                    if( !process.env[ name ] ) {

                        process.env[ name ] = param.Value;
                        results.added.push( param.Name );
                    }
                    else {

                        results.conflict.push( param.Name );
                    }
                }
                else {

                    results.ignored.push( param.Name );
                }
            }

            return results;
        });
}

module.exports = {

    loadToEnv
}
