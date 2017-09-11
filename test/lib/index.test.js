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
            expect( ParameterQueryStub.firstCall.args ).to.eql( [{ Path: '/' }] );
        });

        it( 'custom path', function() {

            let query = index.newQuery( '/my-service' );

            expect( query ).to.equal( ParameterQueryInstance );
            expect( ParameterQueryStub.calledWithNew() ).to.be.true;
            expect( ParameterQueryStub.firstCall.args ).to.eql( [{ Path: '/my-service' }] );
        });
    });
});
