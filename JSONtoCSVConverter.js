"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.string.match.js");
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const JSONtoCSVConverter = _ref => {
  let {
    data,
    csvConfig,
    fileName,
    children,
    columnDelimiter,
    lineDelimiter,
    handleError,
    styleProp
  } = _ref;
  const handleSpecialChars = inputString => {
    inputString = inputString.toString();
    if (inputString.includes('#')) {
      inputString = inputString.replace(/#/g, 'poundsign99');
    }
    if (inputString.includes("\r\n") || inputString.includes("\n") || inputString.includes(",") || inputString.includes("poundsign99") || inputString.includes("\r") || inputString.includes("\t")) {
      return "\"".concat(inputString, "\"");
    }
    return inputString;
  };
  const convertArrayOfObjectsToCSV = () => {
    let result = '';
    try {
      if (!data || (data === null || data === void 0 ? void 0 : data.length) === 0) return result;
      result += csvConfig.headers.join(columnDelimiter);
      result += lineDelimiter;
      data.forEach(item => {
        let ctr = 0;
        csvConfig.keys.forEach((key, index) => {
          if (ctr > 0) result += columnDelimiter;
          if (key.includes("__")) {
            const fields = key.split('__'); // fields[0] => profile.first_name || fields[0] => profile.last_name
            fields.forEach((k, i) => {
              if (k.includes(".")) {
                const subfields = k.split(".");
                result += handleSpecialChars(item[subfields[0]][subfields[1]]);
                if (i !== (fields === null || fields === void 0 ? void 0 : fields.length)) result += ' ';
              } else {
                result += handleSpecialChars(item[key]);
              }
            });
          } else {
            if (key.includes(".")) {
              const fields = key.split(".");
              if (item[fields[0]] && item[fields[0]][fields[1]]) {
                if (csvConfig.actions[index] !== null) {
                  if (typeof csvConfig.actions[index] === 'object') {
                    result += csvConfig.actions[index][item[fields[0]][fields[1]]];
                  } else {
                    result += csvConfig.actions[index](item[fields[0]][fields[1]]);
                  }
                } else {
                  result += handleSpecialChars(item[fields[0]][fields[1]]);
                }
              }
            } else {
              if (csvConfig.actions[index] !== null) {
                if (typeof csvConfig.actions[index] === 'object') {
                  result += csvConfig.actions[index][item[key]];
                } else {
                  result += handleSpecialChars(csvConfig.actions[index](item[key]));
                }
              } else {
                result += handleSpecialChars(item[key]);
              }
            }
          }
          ctr++;
        });
        result += lineDelimiter;
      });
      return result;
    } catch (e) {
      handleError(e);
    }
  };
  const downloadCSV = () => {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV();
    if (!csv.match(/^data:text\/csv/i)) {
      csv = "data:text/csv;charset=utf-8,".concat(csv);
    }
    let encodedCSVContent = encodeURI(csv);
    encodedCSVContent = encodedCSVContent.replace(/poundsign99/g, '%23');
    link.setAttribute('href', encodedCSVContent);
    link.setAttribute('download', fileName);
    link.click();
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    onClick: downloadCSV,
    style: styleProp
  }, children);
};
JSONtoCSVConverter.defaultProps = {
  data: [],
  csvConfig: {
    headers: [],
    keys: [],
    actions: []
  },
  children: /*#__PURE__*/_react.default.createElement("button", null, "Export"),
  columnDelimiter: ',',
  lineDelimiter: '\n',
  handleError: e => {
    console.log(e);
  },
  fileName: 'JSONToCSV.csv',
  styleProp: null
};
var _default = JSONtoCSVConverter;
exports.default = _default;