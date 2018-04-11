import _ from 'lodash';
import moment from 'moment';

/**
 * Make sure the filter value is correct.
 */
export
const clampFilterValue = (value, min, max) => {
  let newValue = parseInt(value, 10);
  newValue = isNaN(newValue) ? min : newValue;
  newValue = Math.max(min, newValue);
  newValue = Math.min(newValue, max);
  return newValue;
};

/**
 * This function resets all the temporal unit fields outside of the precision
 * to their corresponding zero points.
 * This function returns a new Date object and does not modify the inputs.
 * @param {Date} date
 * @param {number} precision - 0: year, 1: month, 2: day,
 *                             3: hour, 4: minute, 5: second, 6: millisecond
 * @return {Date}
 */
export
const getDateAtPrecision = (
  (precisions) =>
    (
      date,
      precision,
    ) =>
      precisions.reduce((acc, { handler, zeroPoint }, index) => {
        // Only need to run precision handlers larger than precision.
        if (index <= precision) {
          return acc;
        }

        const newDate = new Date(acc);

        handler.call(newDate, zeroPoint);

        return newDate;
      }, date)
)([
  {
    handler: Date.prototype.setFullYear,
    zeroPoint: 0,
  },
  {
    handler: Date.prototype.setMonth,
    zeroPoint: 0,
  },
  {
    handler: Date.prototype.setDate,
    zeroPoint: 1,
  },
  {
    handler: Date.prototype.setHours,
    zeroPoint: 0,
  },
  {
    handler: Date.prototype.setMinutes,
    zeroPoint: 0,
  },
  {
    handler: Date.prototype.setSeconds,
    zeroPoint: 0,
  },
  {
    handler: Date.prototype.setMilliseconds,
    zeroPoint: 0,
  },
]);

/**
 * @param {Date} date
 * @param {number} precision - 0: year, 1: month, 2: day,
 *                             3: hour, 4: minute, 5: second, 6: millisecond
 * @param {number} offset
 * @return {Date}
 */
export
const offsetDateAtPrecision = (
  (precisions) =>
    (
      date,
      precision,
      offset,
    ) => {
      const {
        setter,
        getter,
      } = precisions[precision];

      const newDate = new Date(date);

      let value = getter.call(newDate);

      value += offset;

      setter.call(newDate, value);

      return newDate;
    }
)([
  {
    setter: Date.prototype.setFullYear,
    getter: Date.prototype.getFullYear,
  },
  {
    setter: Date.prototype.setMonth,
    getter: Date.prototype.getMonth,
  },
  {
    setter: Date.prototype.setDate,
    getter: Date.prototype.getDate,
  },
  {
    setter: Date.prototype.setHours,
    getter: Date.prototype.getHours,
  },
  {
    setter: Date.prototype.setMinutes,
    getter: Date.prototype.getMinutes,
  },
  {
    setter: Date.prototype.setSeconds,
    getter: Date.prototype.getSeconds,
  },
  {
    setter: Date.prototype.setMilliseconds,
    getter: Date.prototype.getMilliseconds,
  },
]);

export
const ResolutionToPrecisionMapping = {
  year: 0,
  month: 1,
  date: 2,
  day: 2, // alias to "date".
  hour: 3,
  minute: 4,
  second: 5,
  millisecond: 5,
};

export
const AllResolutionNames = Object.keys(ResolutionToPrecisionMapping);

/**
 * @param {string} resolution
 * @returns {number}
 */
export
const getPrecisionByResolution = (
  (resolutionToPrecision) => (
    resolution,
  ) => resolutionToPrecision[resolution]
)(ResolutionToPrecisionMapping);

/**
 * @param {Date} date
 * @param {number} precision
 * @param {Array<string>} customFormats
 * @returns {string}
 */
export
const getDateStringAtPrecision = (
  (dateFormatForPrecisions) =>
    (date, precision, customFormats) => {
      if (!date) {
        return '';
      }

      const dateAtPrecision = getDateAtPrecision(date, precision);
      const dateTemplateAtPrecision = (customFormats || dateFormatForPrecisions)[precision];

      return moment(dateAtPrecision).format(dateTemplateAtPrecision);
    }
)([
  'YYYY',
  'MMM YYYY',
  'MMM Do YYYY',
  'MMM Do YYYY, h a',
  'MMM Do YYYY, h:m a',
  'MMM Do YYYY, h:m:s a',
]);

/**
 * @param {string} dateString
 * @param {number} precision
 * @param {Array<string>} customFormats
 * @returns {Date}
 */
export
const parseDateStringWithPrecision = (
  (dateStringFormatForPrecisions) =>
    (dateString, precision, customFormats) => {
      if (!dateString) {
        return null;
      }

      const format = (customFormats || dateStringFormatForPrecisions)[precision];

      if (!format) {
        return null;
      }

      // Use strict parsing to avoid unpredictable results. (`true` in the 3rd argument).
      const $date = moment(dateString, format, true);

      if (!$date.isValid()) {
        return null;
      }

      const date = $date.toDate();

      return date;
    }
)([
  'YYYY',
  'YYYY-MM',
  'YYYY-MM-DD',
]);

/**
 * @param {number} precision
 * @param {Date} start
 * @param {Date} end
 * @returns {string}
 */
export
const getDateRangeStringAtPrecision = (
  precision,
  start,
  end,
) => {
  if (!start && !end) {
    return '';
  }

  return [start, end]
  .map((d) => getDateStringAtPrecision(d, precision))
  .join(' - ');
};

/**
 * @param {Object} geometry
 * @returns {Object}
 */
export
const buildGeoJsonWithGeometry = (geometry) => {
  if (!geometry) {
    return null;
  }

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry,
      },
    ],
  };
};

/**
 * @param {Date} date
 * @return {string}
 */
export
const getYearStringFromDate = (date) => getDateStringAtPrecision(date, 0);

const placeholderGlobalFindPattern = /\{([a-z-_][a-z0-9-_]*)\}/gim;
const placeholderPattern = /\{([a-z-_][a-z0-9-_]*)\}/i;

/**
 * If filler is not found, replace matched string with empty string.
 * @param {string} templateString - The data string to be modified.
 * @param {string} matchedString - The matched placeholder string (that contains the `{}`).
 * @param {Object<string, Function|*>} fillers - A collection of available fillers. A filler could be a function that returns the value or a literal value.
 * @param {Object} dataStore - Optional secondary storage location if it's not favorable to store the value in string form.
 * @return {string} - Returns the modified data string.
 */
const fillTemplateStringSegment = (templateString, matchedString, fillers, dataStore) => {
  const match = matchedString.match(placeholderPattern);

  if (!match) {
    return templateString;
  }

  const fillerName = match[1];
  const filler = fillers[fillerName];

  if (!filler) {
    return templateString.replace(matchedString, '');
  }

  const replacementValue = typeof filler === 'function' ? filler() : filler;
  const replacementType = typeof replacementValue;
  let replacementString = '';
  let dataStoreValue = null;

  if (replacementValue === null || typeof replacementValue === 'undefined') {
    // `null` and undefined values should be empty.
    replacementString = '';
  } else if (replacementType === 'string') {
    // String type values go straight to the url.
    replacementString = encodeURIComponent(replacementValue);
  } else if (dataStore) {
    // Other types of values go to the dataStore, if possible.
    // The value in url would be empty.
    dataStoreValue = replacementValue;
    replacementString = '';
  } else {
    // If dataStore is not available, force convert value into string type and place it in url.
    replacementString = String(replacementValue);
  }

  if (dataStore && (dataStoreValue !== null)) {
    dataStore[fillerName] = replacementValue;
  }

  return templateString.replace(matchedString, replacementString);
};

/**
 * Return the same input string with placeholders filled.
 * Fillers could be functions or literal values.
 * @param {string} templateString
 * @param {Object<string, Function|*>} fillers
 * @param {Object} dataStore - Optional place to store complex data types. This value will be mutated.
 * @returns {string}
 */
export
const fillTemplateString = (templateString, fillers, dataStore) => {
  if (!templateString) {
    return templateString;
  }

  // @type {Array|null}
  const match = templateString.match(placeholderGlobalFindPattern);

  if (!match) {
    return templateString;
  }

  return match.reduce((str, matchedString) => fillTemplateStringSegment(str, matchedString, fillers, dataStore), templateString);
};

export
function difference(object, base) {
  return _.transform(object, function(result, value, key) {
    if (!_.isEqual(value, base[key])) {
      result[key] = (_.isObject(value) && _.isObject(base[key]))
                    ? difference(value, base[key])
                    : value;
    }
  });
}

/**
 * Go through objects or arrays to find strings and convert them into numbers whenever possible.
 */
export
const stringToNumber = (value, postProcess = (x) => x) => {
  let finalValue = value;

  switch (typeof value) {
    case 'string':
      if (!isNaN(value)) {
        finalValue = parseFloat(value);
      }
      break;
    case 'object':
      if (Array.isArray(value)) {
        finalValue = value.map((item) => stringToNumber(item, postProcess));
      } else if (value !== null) {
        finalValue = Object.entries(value).reduce((acc, [key, value]) => {
          return {
            ...acc,
            [key]: stringToNumber(value, postProcess),
          };
        }, {});
      }
      break;
    default:
  }

  return postProcess(finalValue);
};
