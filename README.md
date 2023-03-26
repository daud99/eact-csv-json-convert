# JSON TO CSV Converter

A React component to export JSON data as a CSV file.

## Installation

```sh
npm install react-json-csv-convert
```
## Usage

```js
import {JSONtoCSVConverter} from 'react-json-csv-convert'
```

## PROPS

| Property Name | Default Value | Type | Description |
| --- | --- | --- | --- |
| data | [] | array | An array containing the JSON data to be converted to CSV. |
| csvConfig | { headers: [], keys: [], actions: [] } | object | An object containing three arrays: headers, keys, and actions. |
| children | `<button>Export</button>` | html element | The HTML element that will be rendered for the component. By default, it is an "Export" button. |
| columnDelimiter | ',' | string | A column delimiter for the CSV. |
| lineDelimiter | '\n' | string | A line delimiter for the CSV. |
| handleError | `(e) => { console.log(e) }` | function | A function triggered if any error occurs while exporting the CSV. |
| fileName | 'JSONToCSV.csv' | string | The name of the exported file. |
| styleProp | null | object | An object containing CSS properties applied to the root element (div) of the component. |

## CSVConfig Explanation

| Property Name | Type | Description |
| --- | --- | --- |
| headers | Array of strings | An array of column names for the CSV. |
| keys | Array of strings | An array of paths to the JSON fields whose values need to be populated for the respective columns. For nested values, separate fields with a dot. To merge two different fields into a single value, separate fields with a double underscore. |
| actions | Array of functions or dictionaries or null values | An array of functions, dictionaries, or null values to be applied before inserting a value into the CSV. If a function is provided, it will be passed the field value as an argument and the returned value will be used in the CSV. If a dictionary is provided, the field value will be used as a key to look up the corresponding value in the dictionary. |

## Example

```js
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
### Explanation

In the example above, we have an array of profiles that we want to transform into a CSV file. Since JSON data can be deeply nested, you can traverse the path to the value you want to use by separating it with a dot. For instance, if you have an object that has an object inside it, and that object has another object inside it, you can simply get the value you want by using dot notation (e.g., object1.object2.object3.name). This will automatically fetch the value of "name" and include it in the exported CSV.

To merge two fields, such as the first name and last name, use a double underscore (__) in the respective value in the "keys" array. For example, to merge the first name and last name fields, use profile.first_name__profile.last_name.

To format a field, such as the admit date, define a function in the "actions" array for that field. The function will receive the value of the field as an argument and return the formatted string. For instance, for the admit date field, you can define a getDateString function that will receive the "admit_date" value as an argument and return the formatted string. For the date of birth field, you can calculate the age using the calculateAge method.

Lastly, if you want to look up a value in an object, define the object as the action for the field. If the action is an object, such as ethnicityOptions, the value of the field will be used as the key to look up in the object. On the other hand, if the action is a function, it will be passed the field value as an argument, and whatever is returned from the respective function will be put in the final CSV. Note that for fields where you want to retain the original value, specify null as the action.