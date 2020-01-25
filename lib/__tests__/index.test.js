const expect = require( 'chai' ).expect;

const rewiremock = require( 'rewiremock/node' );

const sinon = require( 'sinon' );

const ParameterQueryStub = sinon.stub();

const index = rewiremock.proxy('../index.js', {

    '../param_query':  ParameterQueryStub
  });

describe( 'lib/index', function() {

  let ParameterQueryInstance;

  beforeEach( function() {

    ParameterQueryInstance = {};

    ParameterQueryStub.reset();
    ParameterQueryStub.returns( ParameterQueryInstance );
  });

  describe( '.getParametersByPath', function() {

    const CONTROL_PARAMS = [ { Name: 'Whatever', Type: 'String', Value: 'value-here', Version: 1 }];

    beforeEach( function() {

      ParameterQueryInstance.path = sinon.stub().returns( ParameterQueryInstance );
      ParameterQueryInstance.execute = sinon.stub().returns( Promise.resolve( CONTROL_PARAMS ) );
    });

    it( 'defaults', async function() {

      const parameters = await index.getParametersByPath();

      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ undefined ] );

      expect( ParameterQueryInstance.path.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.path.firstCall.args ).to.eql( [ '/' ] );

      expect( parameters ).to.equal( CONTROL_PARAMS );
    });

    it( 'user supplied parameters', async function() {

      const parameters = await index.getParametersByPath( '/whatever-path', { region: 'us-east-1' } );

      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ { region: 'us-east-1' } ] );

      expect( ParameterQueryInstance.path.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.path.firstCall.args ).to.eql( [ '/whatever-path' ] );

      expect( parameters ).to.equal( CONTROL_PARAMS );
    });
  });

  describe( '.getParametersByPathSync', function() {

    const CONTROL_PARAMS = [ { Name: 'Whatever', Type: 'String', Value: 'value-here', Version: 1 }];

    beforeEach( function() {

        ParameterQueryInstance.path = sinon.stub().returns( ParameterQueryInstance );
        ParameterQueryInstance.executeSync = sinon.stub().returns( CONTROL_PARAMS );
    });

    it( 'defaults', function() {

        const parameters = index.getParametersByPathSync();

        expect( ParameterQueryStub.calledOnce ).to.be.true;
        expect( ParameterQueryStub.firstCall.args ).to.eql( [ undefined ] );

        expect( ParameterQueryInstance.path.calledOnce ).to.be.true;
        expect( ParameterQueryInstance.path.firstCall.args ).to.eql( [ '/' ] );

        expect( parameters ).to.equal( CONTROL_PARAMS );
    });

    it( 'user supplied parameters', function() {

        const parameters = index.getParametersByPathSync( '/whatever-path', { region: 'us-east-1' } );

        expect( ParameterQueryStub.calledOnce ).to.be.true;
        expect( ParameterQueryStub.firstCall.args ).to.eql( [ { region: 'us-east-1' } ] );

        expect( ParameterQueryInstance.path.calledOnce ).to.be.true;
        expect( ParameterQueryInstance.path.firstCall.args ).to.eql( [ '/whatever-path' ] );

        expect( parameters ).to.equal( CONTROL_PARAMS );
    });
  });

  describe( '.getParameter', function() {

    const CONTROL_PARAM = { Name: 'Whatever', Type: 'String', Value: 'value-here', Version: 1 };

    beforeEach( function() {

      ParameterQueryInstance.named = sinon.stub().returns( ParameterQueryInstance );
      ParameterQueryInstance.execute = sinon.stub().returns( Promise.resolve( CONTROL_PARAM ) );
    });

    it( 'name only', async function() {

      const parameter = await index.getParameter( '/my-parameter' );

      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ undefined ] );

      expect( ParameterQueryInstance.named.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.named.firstCall.args ).to.eql( [ '/my-parameter' ] );

      expect( parameter ).to.equal( CONTROL_PARAM );
    });

    it( 'name and options', async function() {

      const parameter = await index.getParameter( '/my-parameter', { region: 'us-east-1' } );

      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ { region: 'us-east-1' } ] );

      expect( ParameterQueryInstance.named.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.named.firstCall.args ).to.eql( [ '/my-parameter' ] );

      expect( parameter ).to.equal( CONTROL_PARAM );
    });
  });

  describe( '.getParameterSync', function() {

    const CONTROL_PARAM = { Name: 'Whatever', Type: 'String', Value: 'value-here', Version: 1 };

    beforeEach( function() {

      ParameterQueryInstance.named = sinon.stub().returns( ParameterQueryInstance );
      ParameterQueryInstance.executeSync = sinon.stub().returns( CONTROL_PARAM );
    });

    it( 'name only', function() {

      const parameter = index.getParameterSync( '/my-parameter' );

      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ undefined ] );

      expect( ParameterQueryInstance.named.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.named.firstCall.args ).to.eql( [ '/my-parameter' ] );

      expect( parameter ).to.equal( CONTROL_PARAM );
    });

    it( 'name and options', function() {

      const parameter = index.getParameterSync( '/my-parameter', { region: 'us-east-1' } );

      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ { region: 'us-east-1' } ] );

      expect( ParameterQueryInstance.named.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.named.firstCall.args ).to.eql( [ '/my-parameter' ] );

      expect( parameter ).to.equal( CONTROL_PARAM );
    });
  });

  describe( '.getParameters', function() {

    const CONTROL_PARAMS = {

      Parameters: [{ Name: 'Whatever', Type: 'String', Value: 'value-here', Version: 1 }],
      InvalidParameters: []
    };

    beforeEach( function() {

      ParameterQueryInstance.named = sinon.stub().returns( ParameterQueryInstance );
      ParameterQueryInstance.execute = sinon.stub().returns( Promise.resolve( CONTROL_PARAMS ) );
    });

    it( 'name only', async function() {

      const results = await index.getParameters( ['/my-parameter'] );

      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ undefined ] );

      expect( ParameterQueryInstance.named.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.named.firstCall.args ).to.eql( [ ['/my-parameter'] ] );

      expect( results ).to.equal( CONTROL_PARAMS );
    });

    it( 'name and options', async function() {

      const results = await index.getParameters( ['/my-parameter'], { region: 'us-east-1' } );

      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ { region: 'us-east-1' } ] );

      expect( ParameterQueryInstance.named.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.named.firstCall.args ).to.eql( [ ['/my-parameter'] ] );

      expect( results ).to.equal( CONTROL_PARAMS );
    });
  });

  describe( '.getParametersSync', function() {

    const CONTROL_PARAMS = {

      Parameters: [{ Name: 'Whatever', Type: 'String', Value: 'value-here', Version: 1 }],
      InvalidParameters: []
    };

    beforeEach( function() {

      ParameterQueryInstance.named = sinon.stub().returns( ParameterQueryInstance );
      ParameterQueryInstance.executeSync = sinon.stub().returns( CONTROL_PARAMS );
    });

    it( 'name only', function() {

      const results = index.getParametersSync( ['/my-parameter'] );

      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ undefined ] );

      expect( ParameterQueryInstance.named.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.named.firstCall.args ).to.eql( [ ['/my-parameter'] ] );

      expect( results ).to.equal( CONTROL_PARAMS );
    });

    it( 'name and options', function() {

      const results = index.getParametersSync( ['/my-parameter'], { region: 'us-east-1' } );

      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ { region: 'us-east-1' } ] );

      expect( ParameterQueryInstance.named.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.named.firstCall.args ).to.eql( [ ['/my-parameter'] ] );

      expect( results ).to.equal( CONTROL_PARAMS );
    });
  });

  describe( '.putParameter', function() {

    const RETURN_DATA = {

        Version: 1
    };

    it( 'name only', async function() {

      ParameterQueryInstance.put = sinon.stub().returns( ParameterQueryInstance );
      ParameterQueryInstance.withValue = sinon.stub().returns( ParameterQueryInstance );
      ParameterQueryInstance.type = sinon.stub().returns( ParameterQueryInstance );
      ParameterQueryInstance.execute = sinon.stub().returns( Promise.resolve( RETURN_DATA ) );

      const results = await index.putParameter( '/my-parameter', 'my-value', 'String' );

      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ undefined ] );

      expect( ParameterQueryInstance.put.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.withValue.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.type.calledOnce ).to.be.true;

      expect( results ).to.equal( RETURN_DATA );
    });
  });

  describe( '.putParameterSync', function() {

    const RETURN_DATA = {

      Version: 1
    };

    it( 'name only', function() {

      ParameterQueryInstance.put = sinon.stub().returns( ParameterQueryInstance );
      ParameterQueryInstance.withValue = sinon.stub().returns( ParameterQueryInstance );
      ParameterQueryInstance.type = sinon.stub().returns( ParameterQueryInstance );
      ParameterQueryInstance.executeSync = sinon.stub().returns( RETURN_DATA );

      const results = index.putParameterSync( '/my-parameter', 'my-value', 'String');

      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ undefined ] );

      expect( ParameterQueryInstance.put.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.withValue.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.type.calledOnce ).to.be.true;

      expect( results ).to.equal( RETURN_DATA );
    });
  });

  describe( '.newQuery (legacy)', function() {

    beforeEach( function() {

      ParameterQueryInstance.path = sinon.stub().returns( ParameterQueryInstance );
    });

    it( 'normal operation', function() {

      const query = index.newQuery();

      expect( query ).to.equal( ParameterQueryInstance );

      expect( ParameterQueryStub.calledWithNew() ).to.be.true;
      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ undefined ] );

      expect( ParameterQueryInstance.path.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.path.firstCall.args ).to.eql( ['/' ] );
    });

    it( 'custom path', function() {

      const query = index.newQuery( '/my-service' );

      expect( query ).to.equal( ParameterQueryInstance );

      expect( ParameterQueryStub.calledWithNew() ).to.be.true;
      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ undefined ] );

      expect( ParameterQueryStub.calledWithNew() ).to.be.true;
      expect( ParameterQueryInstance.path.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.path.firstCall.args ).to.eql( ['/my-service' ] );
    });

    it( 'custom path with options', function() {

      let query = index.newQuery( '/my-service', { region: 'us-east-1' } );

      expect( query ).to.equal( ParameterQueryInstance );

      expect( ParameterQueryStub.calledWithNew() ).to.be.true;
      expect( ParameterQueryStub.calledOnce ).to.be.true;
      expect( ParameterQueryStub.firstCall.args ).to.eql( [ { region: 'us-east-1' } ] );

      expect( ParameterQueryStub.calledWithNew() ).to.be.true;
      expect( ParameterQueryInstance.path.calledOnce ).to.be.true;
      expect( ParameterQueryInstance.path.firstCall.args ).to.eql( ['/my-service' ] );
    });
  });
});
