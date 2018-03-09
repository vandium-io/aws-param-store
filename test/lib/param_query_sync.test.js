'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const proxyquire = require( 'proxyquire' );

const sinon = require( 'sinon' );

xdescribe( 'lib/param_query_sync', function() {

    let capturedConsoleLog;

    afterEach( function() {

        if( capturedConsoleLog ) {

            console.log = capturedConsoleLog;
            capturedConsoleLog = null;
        }
    });

    it( 'successful execution', function( done ) {

        let SSMInstance = {

            getParametersByPath: sinon.stub().returns( Promise.resolve( [ { Name: 'Param1' }, { Name: 'Param2' } ] ) )
        };

        let SSMStub = sinon.stub().returns( SSMInstance );

        let inputParams = [  { Path: '/', Recursive: true, WithDecryption: true }, undefined ];

        process.stdin.push( JSON.stringify( inputParams ) + '\r\n' );

        capturedConsoleLog = console.log;

        console.log = ( ...args ) => {

            console.log = capturedConsoleLog;
            capturedConsoleLog = null;

            try {

                expect( SSMInstance.getParametersByPath.calledOnce ).to.be.true;
                expect( SSMInstance.getParametersByPath.firstCall.args[0] ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );
                expect( args[0] ).to.equal( JSON.stringify( {"success":true,"result":{"parameters":[{"Name":"Param1"},{"Name":"Param2"}]}} ) );
                done();
            }
            catch( err ) {

                done( err );
            }
        };

        proxyquire( '../../lib/param_query_sync', {


            './ssm': SSMStub
        });
    });

    it( 'fail: when SSM throws error', function( done ) {

        let SSMInstance = {

            getParametersByPath: sinon.stub().returns( Promise.reject( new Error( 'bang' ) ) )
        };

        let SSMStub = sinon.stub().returns( SSMInstance );

        let inputParams = [  { Path: '/', Recursive: true, WithDecryption: true }, undefined ];

        process.stdin.push( JSON.stringify( inputParams ) + '\r\n' );

        capturedConsoleLog = console.log;

        console.log = ( ...args ) => {

            console.log = capturedConsoleLog;
            capturedConsoleLog = null;

            try {

                expect( SSMInstance.getParametersByPath.calledOnce ).to.be.true;
                expect( SSMInstance.getParametersByPath.firstCall.args[0] ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );
                expect( args[0] ).to.equal( JSON.stringify( {"success":false,"err":{"message":"bang"}} ) );
                done();
            }
            catch( err ) {

                done( err );
            }
        };

        proxyquire( '../../lib/param_query_sync', {

            './ssm': SSMStub
        });
    });

    it( 'fail: other error', function( done ) {

        let SSMInstance = {

            getParametersByPath: sinon.stub().throws( new Error( 'bang' ) )
        };

        let SSMStub = sinon.stub().returns( SSMInstance );

        let inputParams = [  { Path: '/', Recursive: true, WithDecryption: true }, undefined ];

        process.stdin.push( JSON.stringify( inputParams ) + '\r\n' );

        capturedConsoleLog = console.log;

        console.log = ( ...args ) => {

            console.log = capturedConsoleLog;
            capturedConsoleLog = null;

            try {

                expect( SSMInstance.getParametersByPath.calledOnce ).to.be.true;
                expect( SSMInstance.getParametersByPath.firstCall.args[0] ).to.eql( { Path: '/', Recursive: true, WithDecryption: true } );
                expect( args[0] ).to.equal( JSON.stringify( {"success":false,"err":{"message":"bang"}} ) );
                done();
            }
            catch( err ) {

                done( err );
            }
        };

        proxyquire( '../../lib/param_query_sync', {

            './ssm': SSMStub
        });
    });
});
