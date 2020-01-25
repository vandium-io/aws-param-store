const expect = require( 'chai' ).expect;

const rewiremock = require( 'rewiremock/node' );

const sinon = require( 'sinon' );

const AWSStub = {

  SSM: sinon.stub()
}

const SSM = rewiremock.proxy( '../ssm', {

      'aws-sdk': AWSStub
  });

describe( 'lib/ssm', function() {

  describe( 'SSM', function() {

    let SSMStub;

    beforeEach( function() {

      SSMStub = {};

      AWSStub.SSM.reset();
      AWSStub.SSM.returns( SSMStub );
    });

    describe( 'constructor', function() {

      it( 'normal operation', function() {

        const instance = new SSM();

        expect( instance ).to.exist;
        expect( AWSStub.SSM.calledOnce ).to.be.true;
        expect( AWSStub.SSM.calledWithNew() ).to.be.true;
        expect( AWSStub.SSM.firstCall.args ).to.eql( [ undefined ] );
      });

      it( 'with options', function() {

        const instance = new SSM( { region: 'us-east-1' } );

        expect( instance ).to.exist;
        expect( AWSStub.SSM.calledOnce ).to.be.true;
        expect( AWSStub.SSM.calledWithNew() ).to.be.true;
        expect( AWSStub.SSM.firstCall.args ).to.eql( [ { region: 'us-east-1' } ] );
      });
    });

    describe( '.getParametersByPath', function() {

      beforeEach( function() {

          SSMStub.getParametersByPath = sinon.stub();
      });

      it( 'normal operation', async function() {

        const response = {

          Parameters: [ { Name: 'Param1' } ]
        };

        SSMStub.getParametersByPath.returns( {

            promise: sinon.stub().resolves( response )
        });

        const instance = new SSM();

        const parameters = await instance.getParametersByPath( { Path: '/' } );

        expect( parameters ).to.not.equal( response.Parameters );
        expect( parameters ).to.eql( response.Parameters );

        expect( SSMStub.getParametersByPath.calledOnce ).to.be.true;
        expect( SSMStub.getParametersByPath.firstCall.args ).to.eql( [ { Path: '/' } ] );
      });

      it( 'paginated response', async function() {

        const response1 = {

            Parameters: [

                { Name: 'Param1' }
            ],
            NextToken: 'Param2'
        };

        const response2 = {

            Parameters: [

                { Name: 'Param2' }
            ]
        };

        SSMStub.getParametersByPath.onCall( 0 ).returns( {

            promise: sinon.stub().resolves( response1 )
        });

        SSMStub.getParametersByPath.onCall( 1 ).returns( {

            promise: sinon.stub().resolves( response2 )
        });

        const instance = new SSM();

        const parameters = await instance.getParametersByPath( { Path: '/' } );

        expect( parameters ).to.eql( [ { Name: 'Param1' }, { Name: 'Param2' } ] );

        expect( SSMStub.getParametersByPath.calledTwice ).to.be.true;
        expect( SSMStub.getParametersByPath.firstCall.args ).to.eql( [ { Path: '/' } ] );
        expect( SSMStub.getParametersByPath.secondCall.args ).to.eql( [ { Path: '/', NextToken: 'Param2' } ] );
      });

      it( 'no parameters', async function() {

        const response = {};

        SSMStub.getParametersByPath.returns( {

            promise: sinon.stub().resolves( response )
        });

        const instance = new SSM();

        const parameters = await instance.getParametersByPath( { Path: '/' } );

        expect( parameters ).to.eql( [] );

        expect( SSMStub.getParametersByPath.calledOnce ).to.be.true;
        expect( SSMStub.getParametersByPath.firstCall.args ).to.eql( [ { Path: '/' } ] );
      });
    });

    describe( '.getParameter', function() {

      it( 'normal operation', async function() {

        SSMStub.getParameter = sinon.stub();

        const response = {

            Parameter: { Name: 'Param1' }
        };

        SSMStub.getParameter.returns( {

            promise: sinon.stub().resolves( response )
        });

        const instance = new SSM();

        const parameter = await instance.getParameter( { Name: 'Param1' } );

        expect( parameter ).to.equal( response.Parameter );

        expect( SSMStub.getParameter.calledOnce ).to.be.true;
        expect( SSMStub.getParameter.firstCall.args ).to.eql( [ { Name: 'Param1' } ] );
      });
    });

    describe( '.getParameters', function() {

      beforeEach( function() {

        SSMStub.getParameters = sinon.stub();
      });

      it( 'normal operation', async function() {

        let response = {

            Parameters: [{ Name: 'Param1'}],
            InvalidParameters: [ 'Param2' ]
        };

        SSMStub.getParameters.returns( {

            promise: sinon.stub().resolves( response )
        });

        let instance = new SSM();

        const results = await instance.getParameters( { Names: [ 'Param1', 'Param2' ] } );

        expect( results ).to.not.equal( response );
        expect( results ).to.eql( response );

        expect( SSMStub.getParameters.calledOnce ).to.be.true;
        expect( SSMStub.getParameters.firstCall.args ).to.eql( [ { Names: [ 'Param1', 'Param2' ] } ] );
      });

      it( 'with many names', async function() {

        const names = [];

        for( let i = 0; i < 101; i++ ) {

          names.push( 'param-' + i );
        }

        for( let i = 0, callIndex=0; i < names.length; i+=10, callIndex++ ) {

          const response = {

            Parameters: names.slice( i, i+10 ).map( (Name ) => ({Name})),
            InvalidParameters: []
          };

          SSMStub.getParameters.onCall( callIndex ).returns( {

              promise: sinon.stub().resolves( response )
          });
        }

        let instance = new SSM();

        const results = await instance.getParameters( { Names: names } );

        expect( results.Parameters.length ).to.equal( names.length );
        expect( results.Parameters ).to.eql( names.map( Name => ({Name})));
        expect( results.InvalidParameters.length ).to.equal( 0 );

        expect( SSMStub.getParameters.callCount ).to.equal( 11 );
      });

      it( 'with no names', async function() {

        const names = null;

        let instance = new SSM();

        const results = await instance.getParameters( { Names: names } );

        expect( results.Parameters.length ).to.equal( 0 );
        expect( results.InvalidParameters.length ).to.equal( 0 );

        expect( SSMStub.getParameters.called ).to.be.false;
      });
    });

    describe( '.putParameter', function() {

      beforeEach( function() {

        SSMStub.putParameter = sinon.stub();
      });

      it( 'normal operation (type default: SecuredString) ', async function() {

        let response = {

            Version: 1
        };

        SSMStub.putParameter.returns( {

          promise: sinon.stub().resolves( response )
        });

        let instance = new SSM();

        const data = await instance.putParameter( { Name: 'Param1', Value: 'Value1' } );

        expect( data ).to.eql( response );

        expect( SSMStub.putParameter.calledOnce ).to.be.true;
        expect( SSMStub.putParameter.firstCall.args ).to.eql( [ { Name: 'Param1', Value: 'Value1' } ] );
      });

      it( 'Type String operation', async function() {

        let response = {

            Version: 1
        };

        SSMStub.putParameter.returns( {

            promise: sinon.stub().resolves( response )
        });

        let instance = new SSM();

        const data = await instance.putParameter( { Name: 'Param1', Value: 'Value1', Type: 'String' } );

        expect( data ).to.eql( response );

        expect( SSMStub.putParameter.calledOnce ).to.be.true;
        expect( SSMStub.putParameter.firstCall.args ).to.eql( [ { Name: 'Param1', Value: 'Value1', Type: 'String' } ] );
      });

      it( 'Type StringList operation', async function() {

        let response = {

            Version: 1
        };

        SSMStub.putParameter.returns( {

            promise: sinon.stub().resolves( response )
        });

        let instance = new SSM();

        const data = await instance.putParameter( { Name: 'Param1', Value: 'Value1,Value2', Type: 'StringList' } );

        expect( data ).to.eql( response );

        expect( SSMStub.putParameter.calledOnce ).to.be.true;
        expect( SSMStub.putParameter.firstCall.args ).to.eql( [ { Name: 'Param1', Value: 'Value1,Value2', Type: 'StringList' } ] );
      });
    });
  });
});
