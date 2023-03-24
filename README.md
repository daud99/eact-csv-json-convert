# JSON TO CSV Converter

React component to export JSON in the form of CSV.

## Installation

```sh
npm install react-json-csv-convert
```

## Usage

```js
import {JSONtoCSVConverter} from 'JSONtoCSVConverter'
```
## PROPS

| Prop Name | Default Value | Type | Description |
|-----------|---------------|------|-------------|
| data     | []         | array | An array property containing the actual JSON data we want to convert to CSV   |
| csvConfig     | { headers: [],keys: [], actions: []} | object | An object property which contains three arrays headers contain the name of the each of the column in CSV ,keys contain the path of fields in JSON whose value need to be populated for respective column for nested value the fields are seperated by . and do merge two different fields in a single value fields are seperated by __ (double underscore), and action consist of function or dictionaries or null which will be applied before finally inserting value into CSV 
| children     | <button>Export</button> | html element | It will be the one which is rendered for the component by default it's simply the Export button |
| columnDelimiter     | ','            | string | A column delimiter for CSV |
| lineDelimiter     | '\n'            | string  | A line delimiter for CSV |
| handleError     | (e) => { console.log(e) } | function | This function will be trigger if any error occurr in case of error while exporting CSV |
| fileName | JSONToCSV.csv | string  | The name of the exported file |
| styleProp | null          | object  | This object will contain CSS properties which will be applied to the root element (div) of the component |
## Example

```reactjs
import moment from "moment-timezone"
import {JSONtoCSVConverter} from 'JSONtoCSVConverter'

const myComponent = () => {

        const data = 
            [
                {
                    "profile": {
                    "id": 1,
                    "first_name": "user",
                    "last_name": "one",
                    "date_of_birth": "2023-03-11",
                    "ethnicity": "1"
                    },
                    "admit_date": "2023-03-11T08:48:22.182412-06:00"
                },
                {
                    "profile": {
                    "id": 2,
                    "first_name": "user",
                    "last_name": "two",
                    "date_of_birth": "2023-03-05",
                    "ethnicity": "2"
                    },
                    "admit_date": "2023-03-11T09:17:30.635266-06:00",
                },
                {
                    "profile": {
                    "id": 3,
                    "first_name": "user",
                    "last_name": "three",
                    "date_of_birth": "2023-03-22",
                    "ethnicity": "1"
                    },
                    "admit_date": "2023-03-12T06:43:56.683906-05:00",
                },
                {
                    "profile": {
                    "id": 4,
                    "first_name": "user",
                    "last_name": "four",
                    "date_of_birth": "2023-03-24",
                    "ethnicity": "1"
                    },
                    "admit_date": "2023-03-24T04:42:43.142182-05:00"
                }
            ]

        const csvConfig = 
        {
            headers: [
                "PATIENT ID", "DATE OF VISIT", "PATIENT NAME", "ETHNICITY", "AGE"
            ],
            keys: [
                'profile.id', 'admit_date', 'profile.first_name__profile.last_name', 'profile.race', 'profile.date_of_birth'
            ],
            actions: [
                null, getDateString, null, null, ethnicityOptions, calculateAge
            ]
        }

        const calculateAge = (dob) => {
            if (!dob) {
                return ''
            }
            const today = new Date()
            const birthDate = new Date(dob)  // create a date object directly from `dob1` argument
            let ageNow = today.getFullYear() - birthDate.getFullYear()
            const m = today.getMonth() - birthDate.getMonth()
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) ageNow--
            return ageNow
        }

        const getDateString = (date) => {
            if (!date) {
                return ''
            }
            const o_r = moment(date).tz("America/Chicago").format('YYYY-MM-DD')
            return o_r
        }

        const ethnicityOptions = {
            1: 'Hispanic or Latino',
            2: 'Not Hispanic or Latino'
        }

    return (
        <div>
            <JSONtoCSVConverter csvConfig={csvConfig} data={data} styleProp={{display: 'inline-block'}}>
                <span> I will be render because I'm the children prop</span>
            </JSONtoCSVConverter>
        </div>
    )
}
```
