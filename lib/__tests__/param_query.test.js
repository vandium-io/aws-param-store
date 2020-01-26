const { expect } = require( 'chai' );

const AWS = require( 'aws-sdk' );

const rewiremock = require( 'rewiremock/node' );

const sinon = require( 'sinon' );

const SSMStub = sinon.stub();
const syncRPCStub = sinon.stub();

const ParameterQuery = rewiremock.proxy( '../param_query', {

  '../ssm': SSMStub,
  'sync-rpc': () => syncRPCStub
});


describe( 'lib/param_query', function() {

  describe( 'ParameterQuery', function() {

    let SSMInstance;

    beforeEach( function() {

      SSMInstance = {

        getParametersByPath: sinon.stub().returns( Promise.resolve( [] ) )
      };

      SSMStub.reset();
      SSMStub.returns( SSMInstance );

      syncRPCStub.reset();
    });

    describe( 'constructor', function() {

      it( 'normal operation (default options)', function() {

        const instance = new ParameterQuery();

        expect( instance._params ).to.exist;
        expect( instance._params ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );

        expect( instance._options ).to.eql( {} );
      });

      it( 'custom options', function() {

        const instance = new ParameterQuery( { region: 'us-east-1' } );

        expect( instance._params ).to.exist;
        expect( instance._params ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );

        expect( instance._options ).to.exist;
        expect( instance._options ).to.eql( { region: 'us-east-1' } );
      });
    });

    describe( '.path', function() {

      it( 'normal operation', function() {

        const instance = new ParameterQuery();

        const result = instance.path( '/my-service' );
        expect( result ).to.equal( instance );

        expect( instance._params ).to.eql( { Path: '/my-service', Recursive: true, WithDecryption: true } );
        expect( instance._call ).to.equal( 'getParametersByPath' );
      });
    });

    describe( '.named', function() {

      it( 'single name', function() {

        const instance = new ParameterQuery();

        const result = instance.named( 'the-param' );
        expect( result ).to.equal( instance );

        expect( instance._params ).to.eql( { Name: 'the-param', WithDecryption: true } );
        expect( instance._call ).to.equal( 'getParameter' );
      });

      it( 'array of names', function() {

        const instance = new ParameterQuery();

        const result = instance.named( [ 'param1', 'param2' ] );
        expect( result ).to.equal( instance );

        expect( instance._params ).to.eql( { Names: [ 'param1', 'param2' ], WithDecryption: true } );
        expect( instance._call ).to.equal( 'getParameters' );
      });
    });

    describe( '.recursive', function() {

      it( 'normal operation', function() {

        const instance = new ParameterQuery();
        expect( instance._params ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );

        instance._params.Recursive = false;

        const result = instance.recursive();
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

    describe( '.overwrite', function() {

      it( 'normal operation', function() {

        const instance = new ParameterQuery();
        expect( instance._params.Overwrite ).to.be.undefined;

        // default
        expect( instance.overwrite() ).to.equal( instance );  // returns self
        expect( instance._params.Overwrite ).to.be.true;

        expect( instance.overwrite( true ) ).to.equal( instance );  // returns self
        expect( instance._params.Overwrite ).to.be.true;

        expect( instance.overwrite( false ) ).to.equal( instance );  // returns self
        expect( instance._params.Overwrite ).to.be.false;
      });
    });

    describe( '.decryption', function() {

      it( 'normal operation', function() {

        const instance = new ParameterQuery();
        expect( instance._params ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );

        instance._params.WithDecryption = false;

        const result = instance.decryption();
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

        const instance = new ParameterQuery();

        [ 'String', 'StringList', 'SecureString' ].forEach( (t) => {

          expect( instance.type( t ) ).to.equal( instance ); // return self
          expect( instance._params.Type ).to.eq( t );
        });
      });

      it( 'initial state', function() {

        const instance = new ParameterQuery();

        expect( instance._params.Type ).to.be.undefined;
      });

      it( 'default type', function() {

        const instance = new ParameterQuery();

        instance.type();
        expect( instance._params.Type ).to.eq( 'SecureString' );
      });

      it( 'fail on invalid type', function() {

        const instance = new ParameterQuery();

        expect( instance.type.bind( instance, 'BadType' ) ).to.throw( 'BadType' );
      });
    });

    describe( '.put', function() {

      it( 'normal operation', function() {

        const instance = new ParameterQuery();

        instance.put( 'key1' );
        expect( instance._call ).to.equal( 'putParameter' );
        expect( instance._params.Name ).to.equal( 'key1' );
        expect( instance._params.Overwrite ).to.eq( true );

        expect( instance._params.Path ).to.be.undefined;
        expect( instance._params.WithDecryption ).to.be.undefined;
        expect( instance._params.Recursive ).to.be.undefined;
      });

      it( 'Overwrite false operation', function() {

        const instance = new ParameterQuery({Overwrite: false});
        expect(instance._params.Overwrite).to.be.undefined;

        instance.put('key1');
        expect(instance._params.Overwrite).to.eq(false)
      });
    });

    describe( '.withValue', function() {

      it( 'normal operation', function() {

        const instance = new ParameterQuery();
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

        const result = new ParameterQuery().executeSync();

        expect( result ).to.exist;
        expect( result ).to.be.an( 'Array' );

        expect( result ).to.eql( [ { Name: 'Param1' }, {  Name: 'Param2' } ] );
      });

      it( 'normal operation, with profile', function() {

        const oldCredential = AWS.config.credentials;

        try{

          AWS.config.credentials = new AWS.SharedIniFileCredentials( {profile: 'aws-param-store-test-profile' } );

          syncRPCStub.returns( [ { Name: 'Param1' }, { Name: 'Param2' } ] );

          const result = new ParameterQuery().executeSync();

          expect( result ).to.exist;
          expect( result ).to.be.an( 'Array' );

          expect( result ).to.eql( [ { Name: 'Param1' }, {  Name: 'Param2' } ] );
        }
        finally {

          AWS.config.credentials = oldCredential;
        }
      });

      it( 'normal operation, using aws region', function() {

        const oldRegion = AWS.config.region;

        try{

          AWS.config.region = 'ca-central-1';

          syncRPCStub.returns( [ { Name: 'Param1' }, { Name: 'Param2' } ] );

          const result = new ParameterQuery().executeSync();

          expect( result ).to.exist;
          expect( result ).to.be.an( 'Array' );

          expect( result ).to.eql( [ { Name: 'Param1' }, {  Name: 'Param2' } ] );
        }
        finally {

          AWS.config.region = oldRegion;
        }
      });

      it( 'normal operation, without profile', function() {

        const oldCredential = AWS.config.credentials;

        try{

          AWS.config.credentials = null;

          syncRPCStub.returns( [ { Name: 'Param1' }, { Name: 'Param2' } ] );

          const result = new ParameterQuery().executeSync();

          expect( result ).to.exist;
          expect( result ).to.be.an( 'Array' );

          expect( result ).to.eql( [ { Name: 'Param1' }, {  Name: 'Param2' } ] );
        }
        finally {

          AWS.config.credentials = oldCredential;
        }
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
