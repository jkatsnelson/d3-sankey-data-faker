'use strict';

const tape = require('tape');
const _ = require('lodash');
const d3SankeyDataFaker = require('./index').d3SankeyDataFaker;
const getFlatIndex = require('./index').getFlatIndex;
const buildLinks = require('./index').buildLinks;
const allFlatIndexesAboveLevel = require('./index').allFlatIndexesAboveLevel;

const dataSeed = _.reduce([1,2,3,4], function (seed) {
  const level = _.map(_.range(_.random(1, 10)), function (item) {
    return `Item ${item}`;
  });
  seed.push(level);
  return seed;
}, []);

console.log('Testing d3SankeyDataFaker');

tape("it exists", function (test) {
  test.plan(1);
  test.ok(d3SankeyDataFaker);
});

tape("it throws false if it doesn't receive an array, or an array as the first item of the array", function (test) {
  test.plan(1);
  test.notOk(d3SankeyDataFaker());
});

tape("it returns a flat array when given a two dimensional array", function (test) {
  test.plan(1);
  test.ok(_.isArray(d3SankeyDataFaker(dataSeed)));
})

tape("it returns a random list of links", function (test) {
  const randomLinks = d3SankeyDataFaker(dataSeed);
  test.plan(randomLinks.length);
  _.each(randomLinks, function (item) {
    console.log('item:', item);
    test.deepEqual(_.keys(item), ['source', 'target', 'value']);
  });
})

tape("it should have every item in the first array as a source for a link", function (test) {
  test.plan(3);
  const runTest = function () {
    const randomLinks = d3SankeyDataFaker(dataSeed);
    const checkList = _.range(dataSeed[0].length);
    _.each(randomLinks, function (link) {
      _.each(checkList, function (item, i) {
        if (item === link.source) {
          checkList[i] = true;
        }
      });
    });
    let testPassed = true;
    _.each(checkList, function (item, i) {
      if (item === i) {
        testPassed = false;
      }
    });

    return testPassed;
  }
  test.ok(runTest());
  test.ok(runTest());
  test.ok(runTest());
});

tape("it should have every item in the arrays other than the first array as a target for a link", function (test) {
  test.plan(3);
  const runTest = function () {
    const randomLinks = d3SankeyDataFaker(dataSeed);
    const checkList = _.range(_.flattenDeep(dataSeed).length);
    _.each(randomLinks, function (link) {
      // TODO: hash lookup instead of brute force
      _.each(checkList, function (item, i) {
        if (item === link.target) {
          checkList[i] = true;
        }
      });
    });
    let testPassed = true;
    _.each(checkList, function (item, i) {
      // skip first level
      if (i < dataSeed[0].length) {
        return;
      }
      if (item === i) {
        testPassed = false;
      }
    });

    return testPassed;
  }
  test.ok(runTest());
  test.ok(runTest());
  test.ok(runTest());
});

console.log('Testing getFlatIndex');

tape("getFlatIndex returns the flattened index of an item in a two dimensional array", function (test) {
  const test2dArray = [
    ['a', 'b', 'c'],
    ['d', 'e'],
    ['f', 'g', 'h']
  ];
  test.plan(2);
  test.equal(getFlatIndex(test2dArray, 1, 1), 4);
  test.equal(getFlatIndex(test2dArray, 2, 2), 7);
});


console.log('Testing buildLinks');

tape("buildLinks returns arguments as a link object", function (test) {
  test.plan(1)
  test.deepEqual(buildLinks(0, 1, 100), {
    source: 0,
    target: 1,
    value: 100
  });
});

console.log('Test allFlatIndexesAboveLevel')

tape("returns a list of all the flat indexes above the level specified", function (test) {
  test.plan(3);
  const test2dArray = [
    ['a', 'b', 'c'],
    ['d', 'e'],
    ['f', 'g', 'h']
  ];
  console.log('result:', allFlatIndexesAboveLevel(test2dArray, 2))
  test.deepEqual(allFlatIndexesAboveLevel(test2dArray, 1), [5,6,7]);
  test.deepEqual(allFlatIndexesAboveLevel(test2dArray, 0), [3,4,5,6,7]);
  test.deepEqual(allFlatIndexesAboveLevel(test2dArray, 2), []);
});
