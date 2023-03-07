'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const proxyquire = require( 'proxyquire' );

const sinon = require( 'sinon' );

describe( 'lib/ssm', function() {

    let SSM;

    let SSMStub;
    let AWSv3Stub;
    let SSMClientStub;
    let GetParameterCommandStub;
    let PutParameterCommandStub;
    let GetParametersCommandStub;
    let GetParametersByPathCommandStub;

    beforeEach( function() {

        SSMStub = {};
        SSMClientStub = {};

        AWSv3Stub = {
            SSMClient: sinon.stub().returns( SSMClientStub ),
            GetParameterCommand: sinon.stub(),
            PutParameterCommand: sinon.stub(),
            GetParametersCommand: sinon.stub(),
            GetParametersByPathCommand: sinon.stub(),
        };

        SSM = proxyquire( '../../lib/ssm', {
            '@aws-sdk/client-ssm': AWSv3Stub
        });
    });

    describe( 'SSM', function() {

        describe( 'constructor', function() {

            it( 'normal operation', function() {

                let instance = new SSM();

                expect( instance ).to.exist;
                expect( AWSv3Stub.SSMClient.calledOnce ).to.be.true;
                expect( AWSv3Stub.SSMClient.calledWithNew() ).to.be.true;
                expect( AWSv3Stub.SSMClient.firstCall.args ).to.eql( [ undefined ] );
            });

            it( 'with options', function() {

                let instance = new SSM( { region: 'us-east-1' } );

                expect( instance ).to.exist;
                expect( AWSv3Stub.SSMClient.calledOnce ).to.be.true;
                expect( AWSv3Stub.SSMClient.calledWithNew() ).to.be.true;
                expect( AWSv3Stub.SSMClient.firstCall.args ).to.eql( [ { region: 'us-east-1' } ] );
            });
        });

        describe( '.getParametersByPath', function() {

            beforeEach( function() {
                SSMClientStub.send = sinon.stub();
            });

            it( 'normal operation', function() {

                let response = {

                    Parameters: [

                        { Name: 'Param1' }
                    ]
                };

                SSMClientStub.send.returns( Promise.resolve(response) );

                let instance = new SSM();

                return instance.getParametersByPath( { Path: '/' } )
                    .then( (parameters) => {

                        expect( parameters ).to.not.equal( response.Parameters );
                        expect( parameters ).to.eql( response.Parameters );

                        expect( SSMClientStub.send.calledOnce ).to.be.true;
                        expect( AWSv3Stub.GetParametersByPathCommand.calledOnce ).to.be.true;
                        expect( AWSv3Stub.GetParametersByPathCommand.calledWithNew() ).to.be.true;
                        expect( AWSv3Stub.GetParametersByPathCommand.firstCall.args ).to.eql( [ { Path: '/' } ] );
                    });
            });

            it( 'paginated response', function() {

                let response1 = {

                    Parameters: [

                        { Name: 'Param1' }
                    ],
                    NextToken: 'SomeToken'
                };

                let response2 = {

                    Parameters: [

                        { Name: 'Param2' }
                    ]
                };
                SSMClientStub.send.onCall(0).returns( Promise.resolve(response1) );
                SSMClientStub.send.onCall(1).returns( Promise.resolve(response2) );

                let instance = new SSM();

                return instance.getParametersByPath( { Path: '/' } )
                    .then( (parameters) => {

                        expect( parameters ).to.eql( [ { Name: 'Param1' }, { Name: 'Param2' } ] );

                        expect( SSMClientStub.send.calledTwice ).to.be.true;
                        expect( AWSv3Stub.GetParametersByPathCommand.calledTwice ).to.be.true;
                        expect( AWSv3Stub.GetParametersByPathCommand.firstCall.args ).to.eql( [ { Path: '/' } ] );
                        expect( AWSv3Stub.GetParametersByPathCommand.secondCall.args ).to.eql( [ { Path: '/', NextToken: 'SomeToken' } ] );
                    });
            });

            it( 'no parameters', function() {

                let response = {};

                SSMClientStub.send.returns( Promise.resolve(response) );

                let instance = new SSM();

                return instance.getParametersByPath( { Path: '/' } )
                    .then( (parameters) => {

                        expect( parameters ).to.eql( [] );

                        expect( SSMClientStub.send.calledOnce ).to.be.true;
                        expect( AWSv3Stub.GetParametersByPathCommand.calledOnce ).to.be.true;
                        expect( AWSv3Stub.GetParametersByPathCommand.firstCall.args ).to.eql( [ { Path: '/' } ] );
                    });
            });
        });

        describe( '.getParameter', function() {

            beforeEach( function() {
                SSMClientStub.send = sinon.stub();
            });

            it( 'normal operation', function() {

                let response = {

                    Parameter: { Name: 'Param1' }
                };

                SSMClientStub.send.returns( Promise.resolve(response) );

                let instance = new SSM();

                return instance.getParameter( { Name: 'Param1' } )
                    .then( (parameter) => {

                        expect( parameter.Name ).to.equal( response.Parameter.Name );

                        expect( AWSv3Stub.GetParameterCommand.calledOnce ).to.be.true;
                        expect( AWSv3Stub.GetParameterCommand.firstCall.args ).to.eql( [ { Name: 'Param1' } ] );
                    });
            });
        });

        describe( '.getParameters', function() {

            beforeEach( function() {
                SSMClientStub.send = sinon.stub();
            });

            it( 'normal operation', function() {

                let response = {

                    Parameters: [{ Name: 'Param1'}],
                    InvalidParameters: [ 'Param2' ]
                };

                SSMClientStub.send.returns( Promise.resolve(response) );

                let instance = new SSM();

                return instance.getParameters( { Names: [ 'Param1', 'Param2' ] } )
                    .then( (results) => {

                        expect( results ).to.eql( response );

                        expect( AWSv3Stub.GetParametersCommand.calledOnce ).to.be.true;
                        expect( AWSv3Stub.GetParametersCommand.firstCall.args ).to.eql( [ { Names: [ 'Param1', 'Param2' ] } ] );
                    });
            });
        });

        describe( '.putParameter', function() {

            beforeEach( function() {
                SSMClientStub.send = sinon.stub();
            });

            it( 'normal operation (type default: SecuredString) ', function() {

                let response = {

                    Version: 1
                };

                SSMClientStub.send.returns( Promise.resolve(response) );

                let instance = new SSM();

                return instance.putParameter( { Name: 'Param1', Value: 'Value1'} )
                    .then( (return_data) => {
                        expect(return_data).to.eql(response);

                        expect( AWSv3Stub.PutParameterCommand.calledOnce ).to.be.true;
                        expect( AWSv3Stub.PutParameterCommand.firstCall.args ).to.eql( [ { Name: 'Param1', Value: 'Value1' } ] );
                    });
            });

            it( 'Type String operation', function() {

                let response = {

                    Version: 1
                };

                SSMClientStub.send.returns( Promise.resolve(response) );

                let instance = new SSM();

                return instance.putParameter( { Name: 'Param1', Value: 'Value1', Type: 'String' } )
                    .then( (return_data) => {
                        expect(return_data).to.eql(response)

                        expect( AWSv3Stub.PutParameterCommand.calledOnce ).to.be.true;
                        expect( AWSv3Stub.PutParameterCommand.firstCall.args ).to.eql( [ { Name: 'Param1', Value: 'Value1', Type: 'String' } ] );
                    });
            });

            it( 'Type StringList operation', function() {

                let response = {

                    Version: 1
                };

                SSMClientStub.send.returns( Promise.resolve(response) );

                let instance = new SSM();

                return instance.putParameter( { Name: 'Param1', Value: 'Value1,Value2', Type: 'StringList' } )
                    .then( (return_data) => {
                        expect(return_data).to.eql(response)

                        expect( AWSv3Stub.PutParameterCommand.calledOnce ).to.be.true;
                        expect( AWSv3Stub.PutParameterCommand.firstCall.args ).to.eql( [ { Name: 'Param1', Value: 'Value1,Value2', Type: 'StringList' } ] );
                    });
            });

        });

    });
});
