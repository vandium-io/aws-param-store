/*jshint expr: true*/

const { expect } = require( 'chai' );

const proxyquire = require( 'proxyquire' );

const sinon = require( 'sinon' );

describe( 'lib/param_query', function() {

    let ParameterQuery;

    let SSMInstance;
    let SSMStub;
    let syncRPCStub;

    beforeEach( function() {

        SSMInstance = {

            getParametersByPath: sinon.stub().returns( Promise.resolve( [] ) )
        };

        SSMStub = sinon.stub().returns( SSMInstance );

        syncRPCStub = sinon.stub();

        ParameterQuery = proxyquire( '../param_query', {

            './ssm': SSMStub,
            'sync-rpc': () => syncRPCStub,
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
                expect( instance._call ).to.equal( 'getParametersByPath' );
            });
        });

        describe( '.named', function() {

            it( 'single name', function() {

                let instance = new ParameterQuery();

                let result = instance.named( 'the-param' );
                expect( result ).to.equal( instance );

                expect( instance._params ).to.eql( { Name: 'the-param', WithDecryption: true } );
                expect( instance._call ).to.equal( 'getParameter' );
            });

            it( 'array of names', function() {

                let instance = new ParameterQuery();

                let result = instance.named( [ 'param1', 'param2' ] );
                expect( result ).to.equal( instance );

                expect( instance._params ).to.eql( { Names: [ 'param1', 'param2' ], WithDecryption: true } );
                expect( instance._call ).to.equal( 'getParameters' );
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

        describe( '.type', function() {

            it( 'normal operation', function() {

                let instance = new ParameterQuery();
                expect( instance._params.Type ).to.be.undefined;

                var invalidTypeFn = function () {
                    let instance = new ParameterQuery();
                    instance.type('BadType');
                }
                expect( invalidTypeFn ).to.throw('BadType');

                instance.type('StringList');
                expect( instance._params.Type ).to.eq('StringList');
            });
        });

        describe( '.put', function() {

            it( 'normal operation', function() {

                let instance = new ParameterQuery();

                instance.put('key1');
                expect(instance._call).to.eq('putParameter')
                expect(instance._params.Name).to.eq('key1')
                expect(instance._params.Overwrite).to.eq(true)

                expect(instance._params.Path).to.be.undefined;
                expect(instance._params.WithDecryption).to.be.undefined;
                expect(instance._params.Recursive).to.be.undefined;
            });

            it( 'Overwrite false operation', function() {

                let instance = new ParameterQuery({Overwrite: false});
                expect(instance._params.Overwrite).to.be.undefined;

                instance.put('key1');
                expect(instance._params.Overwrite).to.eq(false)
            });
        });

        describe( '.withValue', function() {

            it( 'normal operation', function() {

                let instance = new ParameterQuery();
                expect( instance._params.Value ).to.be.undefined;

                instance.withValue('someValue');
                expect( instance._params.Value ).to.eq('someValue');
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

              syncRPCStub.returns( [ { Name: 'Param1' }, { Name: 'Param2' } ] );

              let result = new ParameterQuery().executeSync();

              expect( result ).to.exist;
              expect( result ).to.be.an( 'Array' );

              expect( result ).to.eql( [ { Name: 'Param1' }, {  Name: 'Param2' } ] );
            });

            it( 'fail: when error occurs, exception has message', function() {

              syncRPCStub.throws( new Error( 'failed' ) );

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
