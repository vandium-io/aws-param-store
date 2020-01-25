const { expect } = require( 'chai' );

const AWS = require( 'aws-sdk' );

const rewiremock = require( 'rewiremock/node' );

const sinon = require( 'sinon' );

const SSMStub = sinon.stub();

const worker = rewiremock.proxy( '../ssm-sync-worker', {

    '../ssm': SSMStub,
});

describe( 'lib/ssm-sync-worker', function() {

  let SSMInstance;

  beforeEach( function() {

      SSMInstance = { };

      SSMStub.reset();
      SSMStub.returns( SSMInstance );
  });

  describe( '.init', function() {

    it( 'normal operation', function() {

      const workerFunc = worker();

      expect( workerFunc ).to.be.a( 'Function' );

      const secondCall = worker();

      expect( secondCall ).to.not.equal( workerFunc );
    });
  });

  describe( 'workerFunc', function() {

    it( 'normal operation', async function() {

      const workerFunc = worker();

      expect( workerFunc ).to.be.a( 'Function' );

      const options = { region: 'us-east-1' };
      const funcName = 'getParameter';
      const parameters = { Name: 'my-param' };

      SSMInstance.getParameter = sinon.stub().resolves( { Parameter: { Name: 'Param1' } } );

      const result = await workerFunc( { options, funcName, parameters } );

      expect( result ).to.eql( { Parameter: { Name: 'Param1' } } );
    });

    it( 'normal operation, no profile', async function() {

      const creds = AWS.config.credentials;

      const workerFunc = worker();

      expect( workerFunc ).to.be.a( 'Function' );

      const options = { region: 'us-east-1' };
      const funcName = 'getParameter';
      const parameters = { Name: 'my-param' };

      try {

        AWS.config.credentials = null;

        SSMInstance.getParameter = sinon.stub().resolves( { Parameter: { Name: 'Param1' } } );

        const result = await workerFunc( { options, funcName, parameters } );

        expect( result ).to.eql( { Parameter: { Name: 'Param1' } } );
      }
      finally {

        AWS.config.credentials = creds;
      }
    });

    it( 'normal operation, with profile', async function() {

      const creds = AWS.config.credentials;

      const workerFunc = worker();

      expect( workerFunc ).to.be.a( 'Function' );

      const options = { region: 'us-east-1' };
      const funcName = 'getParameter';
      const parameters = { Name: 'my-param' };
      const profile = 'my-test-profile-for-ssm-sync-worker';

      try {

        AWS.config.credentials = null;

        SSMInstance.getParameter = sinon.stub().resolves( { Parameter: { Name: 'Param1' } } );

        const result = await workerFunc( { options, funcName, parameters, profile } );

        expect( result ).to.eql( { Parameter: { Name: 'Param1' } } );

        expect( AWS.config.credentials.profile ).to.equal( profile );
      }
      finally {

        AWS.config.credentials = creds;
      }
    });
  });
});
