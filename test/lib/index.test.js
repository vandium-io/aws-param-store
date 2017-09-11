'use strict';

/*jshint expr: true*/

const expect = require( 'chai' ).expect;

const proxyquire = require( 'proxyquire' );

const sinon = require( 'sinon' );

describe( 'lib/index', function() {

    let index;

    let ParameterQueryStub;
    let ParameterQueryInstance;

    beforeEach( function() {

        ParameterQueryInstance = {};
        ParameterQueryInstance.path = sinon.stub().returns( ParameterQueryInstance );

        ParameterQueryStub = sinon.stub().returns( ParameterQueryInstance );

        index = proxyquire( '../../lib/index', {

            './param_query': ParameterQueryStub
        });
    });

    describe( '.newQuery', function() {

        it( 'normal operation', function() {

            let query = index.newQuery();

            expect( query ).to.equal( ParameterQueryInstance );
            expect( ParameterQueryStub.calledWithNew() ).to.be.true;
            expect( ParameterQueryInstance.path.calledOnce ).to.be.true;
            expect( ParameterQueryInstance.path.firstCall.args ).to.eql( ['/'] );
        });

        it( 'custom path', function() {

            let query = index.newQuery( '/my-service' );

            expect( query ).to.equal( ParameterQueryInstance );
            expect( ParameterQueryStub.calledWithNew() ).to.be.true;
            expect( ParameterQueryInstance.path.calledOnce ).to.be.true;
            expect( ParameterQueryInstance.path.firstCall.args ).to.eql( ['/my-service'] );
        });
    });
});
