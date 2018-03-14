'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const proxyquire = require( 'proxyquire' );

const sinon = require( 'sinon' );

describe( 'lib/ssm', function() {

    let SSM;

    let AWSStub;
    let SSMStub;

    beforeEach( function() {

        SSMStub = {};

        AWSStub = {

            SSM: sinon.stub().returns( SSMStub )
        };

        SSM = proxyquire( '../../lib/ssm', {

            'aws-sdk': AWSStub
        });
    });

    describe( 'SSM', function() {

        describe( 'constructor', function() {

            it( 'normal operation', function() {

                let instance = new SSM();

                expect( instance ).to.exist;
                expect( AWSStub.SSM.calledOnce ).to.be.true;
                expect( AWSStub.SSM.calledWithNew() ).to.be.true;
                expect( AWSStub.SSM.firstCall.args ).to.eql( [ undefined ] );
            });

            it( 'with options', function() {

                let instance = new SSM( { region: 'us-east-1' } );

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

            it( 'normal operation', function() {

                let response = {

                    Parameters: [

                        { Name: 'Param1' }
                    ]
                };

                SSMStub.getParametersByPath.returns( {

                    promise: sinon.stub().returns( Promise.resolve( response ) )
                });

                let instance = new SSM();

                return instance.getParametersByPath( { Path: '/' } )
                    .then( (parameters) => {

                        expect( parameters ).to.not.equal( response.Parameters );
                        expect( parameters ).to.eql( response.Parameters );

                        expect( SSMStub.getParametersByPath.calledOnce ).to.be.true;
                        expect( SSMStub.getParametersByPath.firstCall.args ).to.eql( [ { Path: '/' } ] );
                    });
            });

            it( 'paginated response', function() {

                let response1 = {

                    Parameters: [

                        { Name: 'Param1' }
                    ],
                    NextToken: 'Param2'
                };

                let response2 = {

                    Parameters: [

                        { Name: 'Param2' }
                    ]
                };

                SSMStub.getParametersByPath.onCall( 0 ).returns( {

                    promise: sinon.stub().returns( Promise.resolve( response1 ) )
                });

                SSMStub.getParametersByPath.onCall( 1 ).returns( {

                    promise: sinon.stub().returns( Promise.resolve( response2 ) )
                });

                let instance = new SSM();

                return instance.getParametersByPath( { Path: '/' } )
                    .then( (parameters) => {

                        expect( parameters ).to.eql( [ { Name: 'Param1' }, { Name: 'Param2' } ] );

                        expect( SSMStub.getParametersByPath.calledTwice ).to.be.true;
                        expect( SSMStub.getParametersByPath.firstCall.args ).to.eql( [ { Path: '/' } ] );
                        expect( SSMStub.getParametersByPath.secondCall.args ).to.eql( [ { Path: '/', NextToken: 'Param2' } ] );
                    });
            });

            it( 'no parameters', function() {

                let response = {};

                SSMStub.getParametersByPath.returns( {

                    promise: sinon.stub().returns( Promise.resolve( response ) )
                });

                let instance = new SSM();

                return instance.getParametersByPath( { Path: '/' } )
                    .then( (parameters) => {

                        expect( parameters ).to.eql( [] );

                        expect( SSMStub.getParametersByPath.calledOnce ).to.be.true;
                        expect( SSMStub.getParametersByPath.firstCall.args ).to.eql( [ { Path: '/' } ] );
                    });
            });
        });

        describe( '.getParameter', function() {

            beforeEach( function() {

                SSMStub.getParameter = sinon.stub();
            });

            it( 'normal operation', function() {

                let response = {

                    Parameter: { Name: 'Param1' }
                };

                SSMStub.getParameter.returns( {

                    promise: sinon.stub().returns( Promise.resolve( response ) )
                });

                let instance = new SSM();

                return instance.getParameter( { Name: 'Param1' } )
                    .then( (parameter) => {

                        expect( parameter ).to.equal( response.Parameter );

                        expect( SSMStub.getParameter.calledOnce ).to.be.true;
                        expect( SSMStub.getParameter.firstCall.args ).to.eql( [ { Name: 'Param1' } ] );
                    });
            });
        });

        describe( '.getParameters', function() {

            beforeEach( function() {

                SSMStub.getParameters = sinon.stub();
            });

            it( 'normal operation', function() {

                let response = {

                    Parameters: [{ Name: 'Param1'}],
                    InvalidParameters: [ 'Param2' ]
                };

                SSMStub.getParameters.returns( {

                    promise: sinon.stub().returns( Promise.resolve( response ) )
                });

                let instance = new SSM();

                return instance.getParameters( { Names: [ 'Param1', 'Param2' ] } )
                    .then( (results) => {

                        expect( results ).to.not.equal( response );
                        expect( results ).to.eql( response );

                        expect( SSMStub.getParameters.calledOnce ).to.be.true;
                        expect( SSMStub.getParameters.firstCall.args ).to.eql( [ { Names: [ 'Param1', 'Param2' ] } ] );
                    });
            });
        });
    });
});
