import React from 'react'

const JSONtoCSVConverter = ({ data, csvConfig, fileName, children, columnDelimiter, lineDelimiter, handleError, styleProp }) => {

  const handleSpecialChars = (inputString) => {
    inputString = inputString.toString()

    if (inputString.includes('#')) {
      inputString = inputString.replace(/#/g, 'poundsign99')
    }

    if (inputString.includes("\r\n") || inputString.includes("\n") || inputString.includes(",") || inputString.includes("poundsign99") || inputString.includes("\r") || inputString.includes("\t")) {
        return `"${inputString}"`
    }

    return inputString
  }

  const convertArrayOfObjectsToCSV = () => {
    let result = ''
    try {
      if (!data || data?.length === 0) return result

      result += csvConfig.headers.join(columnDelimiter)
      result += lineDelimiter
    
      data.forEach(item => {
        let ctr = 0
        csvConfig.keys.forEach((key, index) => {
          if (ctr > 0) result += columnDelimiter
          if (key.includes("__")) {
            const fields = key.split('__') // fields[0] => profile.first_name || fields[0] => profile.last_name
            fields.forEach((k, i) => {
              if (k.includes(".")) {
                const subfields = k.split(".")
                result += handleSpecialChars(item[subfields[0]][subfields[1]])
                if (i !== fields?.length) result += ' '
              } else {
                result += handleSpecialChars(item[key])
              }
            })
          } else {
            if (key.includes(".")) {
              const fields = key.split(".")
              if (item[fields[0]] && item[fields[0]][fields[1]]) {
                if (csvConfig.actions[index] !== null) {
                    if (typeof csvConfig.actions[index] === 'object') {
                      result += csvConfig.actions[index][item[fields[0]][fields[1]]]
                    } else {
                      result += csvConfig.actions[index](item[fields[0]][fields[1]])
                    }
                } else {
                  result += handleSpecialChars(item[fields[0]][fields[1]])
                }
              }
            } else {
              if (csvConfig.actions[index] !== null) {
                if (typeof csvConfig.actions[index] === 'object') {
                  result += csvConfig.actions[index][item[key]]
                } else {
                  result += handleSpecialChars(csvConfig.actions[index](item[key]))
                }
              } else {
                result += handleSpecialChars(item[key])
              }
            }
          }
          ctr++
        })
        result += lineDelimiter
      })
      return result
    } catch (e) {
      handleError(e)
    }
  }

  const downloadCSV = () => {
    const link = document.createElement('a')
    let csv = convertArrayOfObjectsToCSV()
      
    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }
    let encodedCSVContent = encodeURI(csv)
    encodedCSVContent = encodedCSVContent.replace(/poundsign99/g, '%23')
    link.setAttribute('href', encodedCSVContent)
    link.setAttribute('download', fileName)
    link.click()
  }

  return (
    <div onClick={downloadCSV} style={styleProp}>
      {children}
    </div>
  )
}

JSONtoCSVConverter.defaultProps = {
  data: [],
  csvConfig: {
    headers: [],
    keys: [],
    actions: []
  },
  children: <button>Export</button>,
  columnDelimiter: ',',
  lineDelimiter: '\n',
  handleError: (e) => { console.log(e) },
  fileName: 'JSONToCSV.csv',
  styleProp: null
}

export default JSONtoCSVConverter
