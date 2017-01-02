'use strict';

const _ = require('lodash');
module.exports = {
  d3SankeyDataFaker: d3SankeyDataFaker,
  buildLinks: buildLinks,
  getFlatIndex: getFlatIndex,
  allFlatIndexesAboveLevel: allFlatIndexesAboveLevel
};

// find all flat indexes above the current level
function allFlatIndexesAboveLevel(namesByLevel, currentLevel) {
  let count = 0;
  let list = [];
  _.each(namesByLevel, function (l, i) {
    if (i > currentLevel) {
      _.each(l, function (item, i) {
        list.push(count + i);
      });
    }
    count += l.length;
  });
  return list;
}

function d3SankeyDataFaker (namesByLevel) {
  if (!_.isArray(namesByLevel) || !_.isArray(namesByLevel[0])) {
    return false;
  }
  // for a given level, make random connections to the next level with random
  // weights between 1-100
  // make sure all bottom level nodes are sources
  // make sure all other levels are targets
  // terminate at top level
  const links = _.reduce(namesByLevel, function (accumulator, level, levelIndex) {
    if (levelIndex === namesByLevel.length-1) { return accumulator; }
    const targetLevelIndex = levelIndex + 1;
    const targetLevel = namesByLevel[targetLevelIndex];
    const allTargetIndexes = [];
    // TODO: Partial application of namesByLevel to remove redundancy
    _.each(level, function (levelItem, levelItemIndex) {
      const levelItemFlatIndex = getFlatIndex(namesByLevel, levelIndex, levelItemIndex);
      let sampleSize;
      if (levelIndex === 0) {
        sampleSize = _.random(1, targetLevel.length);
      } else {
        sampleSize = _.random(0, targetLevel.length);
      }
      const targetIndexes = _.sampleSize(_.range(targetLevel.length), sampleSize);
      _.each(targetIndexes, function (ti) {
        accumulator.push({
          source: levelItemFlatIndex,
          target: getFlatIndex(namesByLevel, targetLevelIndex, ti),
          value: _.random(100)
        });
      });
      allTargetIndexes.push(targetIndexes);
    });

    const flatUniqTargetIndexes = _.sortBy(_.uniq(_.flatten(allTargetIndexes)));
    const difference = _.difference(_.range(targetLevel.length), flatUniqTargetIndexes);
    _.each(difference, function (ti) {
      const item = {
        source: getFlatIndex(namesByLevel, levelIndex, _.random(level.length-1)),
        target: getFlatIndex(namesByLevel, targetLevelIndex, ti),
        value: _.random(100)
      };
      accumulator.push(item);
    });
    // for each level, make sure the level above has links
    return accumulator;
  }, []);
  return links;
}

function buildLinks (source, target, value) {
  return {
    source: source,
    target: target,
    value: value
  };
}

function getFlatIndex (namesByLevel, levelIndex, index) {
  let flatIndex = index;
  let nextLevel = levelIndex - 1;
  for (var i = nextLevel; i >= 0; i--) {
    flatIndex += namesByLevel[i].length;
  }
  return flatIndex;
}
