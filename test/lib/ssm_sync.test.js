'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const proxyquire = require( 'proxyquire' );

const sinon = require( 'sinon' );

describe( 'lib/ssm_sync', function() {

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

        let input = {

            options: null,
            funcName: 'getParametersByPath',
            parameters: [{ Path: '/', Recursive: true, WithDecryption: true }]
        };

        process.stdin.push( JSON.stringify( [input] ) + '\r\n' );

        capturedConsoleLog = console.log;

        console.log = ( ...args ) => {

            console.log = capturedConsoleLog;
            capturedConsoleLog = null;

            try {

                expect( SSMStub.calledOnce ).to.be.true;
                expect( SSMStub.firstCall.calledWithNew() ).to.be.true;

                expect( SSMInstance.getParametersByPath.calledOnce ).to.be.true;
                expect( SSMInstance.getParametersByPath.firstCall.args ).to.eql( [{ Path: '/', Recursive: true, WithDecryption: true }] );
                expect( args[0] ).to.equal( JSON.stringify( {"success":true,"result":[{"Name":"Param1"},{"Name":"Param2"}]} ) );
                done();
            }
            catch( err ) {

                done( err );
            }
        };

        proxyquire( '../../lib/ssm_sync', {


            './ssm': SSMStub
        });
    });

    it( 'fail: when SSM throws error', function( done ) {

        let SSMInstance = {

            getParametersByPath: sinon.stub().returns( Promise.reject( new Error( 'bang' ) ) )
        };

        let SSMStub = sinon.stub().returns( SSMInstance );

        let input = {

            options: null,
            funcName: 'getParametersByPath',
            parameters: [{ Path: '/', Recursive: true, WithDecryption: true }]
        };

        process.stdin.push( JSON.stringify( [input] ) + '\r\n' );

        capturedConsoleLog = console.log;

        console.log = ( ...args ) => {

            console.log = capturedConsoleLog;
            capturedConsoleLog = null;

            try {

                expect( SSMInstance.getParametersByPath.calledOnce ).to.be.true;
                expect( SSMInstance.getParametersByPath.firstCall.args ).to.eql( [{ Path: '/', Recursive: true, WithDecryption: true }] );
                expect( args[0] ).to.equal( JSON.stringify( {"success":false,"err":{"message":"bang"}} ) );
                done();
            }
            catch( err ) {

                done( err );
            }
        };

        proxyquire( '../../lib/ssm_sync', {

            './ssm': SSMStub
        });
    });

    it( 'fail: other error', function( done ) {

        let SSMInstance = {

            getParametersByPath: sinon.stub().throws( new Error( 'bang' ) )
        };

        let SSMStub = sinon.stub().returns( SSMInstance );

        let input = {

            options: null,
            funcName: 'getParametersByPath',
            parameters: [{ Path: '/', Recursive: true, WithDecryption: true }]
        };

        process.stdin.push( JSON.stringify( [input] ) + '\r\n' );

        capturedConsoleLog = console.log;

        console.log = ( ...args ) => {

            console.log = capturedConsoleLog;
            capturedConsoleLog = null;

            try {

                expect( SSMInstance.getParametersByPath.calledOnce ).to.be.true;
                expect( SSMInstance.getParametersByPath.firstCall.args ).to.eql( [{ Path: '/', Recursive: true, WithDecryption: true }] );
                expect( args[0] ).to.equal( JSON.stringify( {"success":false,"err":{"message":"bang"}} ) );
                done();
            }
            catch( err ) {

                done( err );
            }
        };

        proxyquire( '../../lib/ssm_sync', {

            './ssm': SSMStub
        });
    });
});
