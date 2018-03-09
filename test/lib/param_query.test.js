'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const proxyquire = require( 'proxyquire' );

const sinon = require( 'sinon' );

describe( 'lib/param_query', function() {

    let ParameterQuery;

    let SSMInstance;
    let SSMStub;
    let childProcessStub;

    beforeEach( function() {

        SSMInstance = {

            getParametersByPath: sinon.stub().returns( Promise.resolve( [] ) )
        };

        SSMStub = sinon.stub().returns( SSMInstance );

        childProcessStub = {

            spawnSync: sinon.stub()
        };

        ParameterQuery = proxyquire( '../../lib/param_query', {

            './ssm': SSMStub,
            'child_process': childProcessStub
        });
    });

    describe( 'ParameterQuery', function() {

        describe( 'constructor', function() {

            it( 'normal operation (default options)', function() {

                let instance = new ParameterQuery();

                expect( instance._params ).to.exist;
                expect( instance._params ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );

                expect( instance._options ).to.eql( {} );
            });

            it( 'custom options', function() {

                let instance = new ParameterQuery( { region: 'us-east-1' } );

                expect( instance._params ).to.exist;
                expect( instance._params ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );

                expect( instance._options ).to.exist;
                expect( instance._options ).to.eql( { region: 'us-east-1' } );
            });
        });

        describe( '.path', function() {

            it( 'normal operation', function() {

                let instance = new ParameterQuery();

                let result = instance.path( '/my-service' );
                expect( result ).to.equal( instance );

                expect( instance._params ).to.eql( { Path: '/my-service', Recursive: true, WithDecryption: true } );
            });
        });

        describe( '.recursive', function() {

            it( 'normal operation', function() {

                let instance = new ParameterQuery();
                expect( instance._params ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );

                instance._params.Recursive = false;

                let result = instance.recursive();
                expect( result ).to.equal( instance );

                expect( instance._params ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );

                instance._params.Recursive = false;
                instance.recursive( true );
                expect( result ).to.equal( instance );

                expect( instance._params ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );

                instance.recursive( 'whatever' );
                expect( result ).to.equal( instance );

                expect( instance._params ).to.eql( { Path: '/', Recursive: false, WithDecryption: true } );
            });
        });

        describe( '.decryption', function() {

            it( 'normal operation', function() {

                let instance = new ParameterQuery();
                expect( instance._params ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );

                instance._params.WithDecryption = false;

                let result = instance.decryption();
                expect( result ).to.equal( instance );

                expect( instance._params ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );

                instance._params.WithDecryption = false;
                instance.decryption( true );
                expect( result ).to.equal( instance );

                expect( instance._params ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );

                instance.decryption( 'whatever' );
                expect( result ).to.equal( instance );

                expect( instance._params ).to.eql( { Path: '/', Recursive: true, WithDecryption: false } );
            });
        });

        describe( '.execute', function() {

            it( 'normal operation', function() {

                return new ParameterQuery().execute()
                    .then( (parameters) => {

                        expect( parameters ).to.eql( [] );

                        expect( SSMStub.calledOnce ).to.be.true;
                        expect( SSMStub.calledWithNew() ).to.be.true;
                        expect( SSMInstance.getParametersByPath.calledOnce ).to.be.true;
                        expect( SSMInstance.getParametersByPath.firstCall.args ).to.eql( [ { Path: '/', Recursive: true, WithDecryption: true }] );
                    });
            });
        });

        describe( '.executeSync', function() {

            it( 'normal operation', function() {

                let resultStub = {

                    stdout: JSON.stringify( {

                        success: true,
                        result: [ { Name: 'Param1' }, { Name: 'Param2' } ]
                    })
                };

                childProcessStub.spawnSync.returns( resultStub );

                let result = new ParameterQuery().executeSync();

                expect( result ).to.exist;
                expect( result ).to.be.an( 'Array' );


                expect( result ).to.eql( [ { Name: 'Param1' }, {  Name: 'Param2' } ] );
            });

            it( 'fail: when error occurs', function() {

                let resultStub = {

                    stdout: JSON.stringify( {

                        success: false,
                        err: {

                            message: 'failed'
                        }
                    })
                };

                childProcessStub.spawnSync.returns( resultStub );

                try {

                    new ParameterQuery().executeSync();

                    throw new Error( 'should not be successful' );
                }
                catch( err ) {

                    expect( err.message ).to.equal( 'failed' );
                }
            });
        });
    });
});
