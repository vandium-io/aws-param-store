[![Build Status](https://travis-ci.org/vandium-io/aws-param-store.svg?branch=master)](https://travis-ci.org/vandium-io/aws-param-store)
[![npm version](https://badge.fury.io/js/aws-param-store.svg)](https://badge.fury.io/js/aws-param-store)

# aws-param-store

Module for loading parameter-store values from AWS SSM

## Features
* Gets parameters by name(s) or path
* Recursively resolves paths and decodes parameters by default
* Paginates results automatically
* Supports both synchronous and asynchronous querying of parameters
* Uses Promises for asynchronous calls
* Can run inside AWS Lambda environment
* AWS Lambda Node.js 8.10.x compatible
* Lightweight and does not require additional dependencies other than the AWS-SDK


## Installation
Install via npm.

	npm install aws-param-store --save

**Note**: `aws-param-store` does not contain a dependency on `aws-sdk` and it should be installed within your application.

## Getting Started

```js
const awsParamStore = require( 'aws-param-store' );

awsParamStore.getParametersByPath( '/project1/service1/production' )
    .then( (parameters) => {

        // do something here
    });
```

If your AWS region is not set in your environment variables, then it can be set programmatically by supplying
options when calling `newQuery()`:

```js
const awsParamStore = require( 'aws-param-store' );

awsParamStore.getParametersByPath( '/project1/service1/production', { region: 'us-east-1' } )
    .then( (parameters) => {

        // do something here
    });
```

## API

### Overview

Most API method calls in this library have both asynchronous and synchronous versions.
When an asynchronous version is called, a Promise is returned to resolve the value
once the operation completes. When an `options` parameter is allowed, it can be used
to specify specific AWS service options such as the region. All of the
`getParameter*` methods will request that the values are decoded. If you require
further control, please use the `parameterQuery()` method.

### `getParameter( name [, options] )`

Gets a parameter by name. This method returns a promise that resolves the Parameter.

```js
const awsParamStore = require( 'aws-param-store' );

awsParamStore.getParameter( '/project1/my-parameter', { region: 'us-east-1' } )
    .then( (parameter) => {

        // Parameter info object for '/project1/my-parameter'
    });
```

### `getParameterSync( name [, options] )`

Gets a parameter by name. This method will block until the operation completes.

```js
const awsParamStore = require( 'aws-param-store' );

let parameter = awsParamStore.getParameterSync( '/project1/my-parameter',
											{ region: 'us-east-1' } );

// Parameter info object for '/project1/my-parameter'
```


### `getParameters( names [, options] )`

Gets one or more parameters by name. This method returns a promise that resolves
an object that contains `Parameters` and `InvalidParameters`.

```js
const awsParamStore = require( 'aws-param-store' );

awsParamStore.getParameters( ['/project1/my-parameter1', '/project1/my-parameter2'],
							 { region: 'us-east-1' } )
    .then( (results) => {

        // results.Parameters will contain an array of parameters that were found
		// results.InvalidParameters will contain an array of parameters that were
		//                           not found
    });
```

### `getParametersSync( names [, options] )`

Gets one or more parameters by name. This method will
block until the operation completes, and will return an object that contains
`Parameters` and `InvalidParameters`.

```js
const awsParamStore = require( 'aws-param-store' );

let results = awsParamStore.getParametersSync( ['/project1/my-parameter1', '/project1/my-parameter2'],
							     			   { region: 'us-east-1' } );

// results.Parameters will contain an array of parameters that were found
// results.InvalidParameters will contain an array of parameters that were
//                           not found
```

### `getParametersByPath( path [, options] )`

Gets parameters by recursively traversing the supplied path. This method returns
a promise that resolves the parameters that were found.

```js
const awsParamStore = require( 'aws-param-store' );

awsParamStore.getParametersByPath( '/project1' )
    .then( (parameters) => {

		// parameters contains an array of parameter objects
    });
```

### `getParametersByPathSync( path [, options] )`

Gets parameters by recursively traversing the supplied path.  This method will
block until the operation completes, and will return a list of matching
parameters.

```js
const awsParamStore = require( 'aws-param-store' );

let parameters = awsParamStore.getParametersByPathSync( '/project1' );

// parameters contains an array of parameter objects
```

### `putParameter( name, value, type [, options] )`

Puts parameter. This method returns a promise that resolves to the version returned back.

```js
const awsParamStore = require( 'aws-param-store' );

awsParamStore.putParameter('key', 'value1,value2', 'StringList', {region: 'us-east-1', Overwrite: false})
    .then( (results) => {

		// results is the version of the value created
    });
```

### `putParameterSync( name, value , type [, options]  )`

Puts parameter. This method.  This method will block until the version returned back.

```js
const awsParamStore = require( 'aws-param-store' );

let results = awsParamStore.putParameterSync('key', 'securedstring', 'SecureString', {region: 'us-east-1'});

```

### `ParameterQuery`

Instances of `ParameterQuery` can be created by calling `parameterQuery( [options] )`.
This object is implementation behind the `getParameter*` methods, and allows further
control over how the calls are made to resolve parameters.

### `ParameterQuery.path( p )`

Sets the path name not be queried. Returns a reference to the `ParameterQuery`
instance.

### `ParameterQuery.named( name )`

Sets the name or names (if an array) to be queried. Returns a reference to the
`ParameterQuery` instance.

### `ParameterQuery.decryption( enabled = true )`

Indicates that the decryption of the values is enabled/disabled. Returns a
reference to the `ParameterQuery` instance.

### `ParameterQuery.recursive( enabled = true )`

Enables or disables recursive operations when resolving parameters by path.
Returns a reference to the `ParameterQuery` instance.

### `ParameterQuery.execute()`

Executes the query based on path or name(s) that were selected. Returns a Promise
that resolves the parameter results.

### `ParameterQuery.executeSync()`

Executes the query based on path or name(s) that were selected. This operation
will block until complete.


## Feedback

We'd love to get feedback on how to make this tool better. Feel free to contact
us at `feedback@vandium.io`

## License

[BSD-3-Clause](https://en.wikipedia.org/wiki/BSD_licenses)
