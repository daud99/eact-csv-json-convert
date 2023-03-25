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

| Property Name   | Default Value                                               | Type        | Description                                                                                                                                                      |
|-----------------|-------------------------------------------------------------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| data            | []                                                          | array       | An array property containing the actual JSON data we want to convert to CSV.                                                                                    |
| csvConfig       | { headers: [], keys: [], actions: [] }                      | object      | An object property which contains three arrays.                                                                                                                |
| headers         | Array of strings                                            | array       | An array of column names for the CSV.                                                                                                                           |
| keys            | Array of strings                                            | array       | An array of paths to the fields in the JSON whose value needs to be populated for the respective column. For nested values, the fields are separated by a dot. To merge two different fields in a single value, fields are separated by a double underscore. |
| actions         | Array of functions, dictionaries, or null values            | array       | An array of functions or dictionaries or null values which will be applied before finally inserting a value into the CSV.                                      |
| children        | `<button>Export</button>`                                   | html element| The HTML element that will be rendered for the component. By default, it is simply the Export button.                                                           |
| columnDelimiter | ','                                                         | string      | A column delimiter for the CSV.                                                                                                                                 |
| lineDelimiter   | '\n'                                                        | string      | A line delimiter for the CSV.                                                                                                                                   |
| handleError     | `(e) => { console.log(e) }`                                 | function    | This function will be triggered if any error occurs while exporting CSV.                                                                                         |
| fileName        | 'JSONToCSV.csv'                                             | string      | The name of the exported file.                                                                                                                                  |
| styleProp       | null                                                        | object      | This object will contain CSS properties which will be applied to the root element (div) of the component.                                                        |

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

In the above example, we have an array of profile which we want to transform into CSV file. 

As we can have deep nested JSON i.e. an object can have an object inside it and that object can have another object inside it, so you can simply traverse the path to get the value which you want to use by separating it by `.` just like we do it in JavaScript for instance `object1.object2.object3.name` this will automatically grasp the value of name and put it in the final CSV exported.

We want to merge the name i.e. firstname and lastname for this, in the respective value in the keys array, we have `profile.first_name__profile.last_name`. Here `__` (double underscore) tells that we want to concatenate the two fields. We can concatenate any two fields by using `__` (double underscore) between the fields in the respective value in the keys array.

Similarly, we have the `admit_date` field in the array; however, we want to format it in a specific way. For this, we have defined a function `getDateString` in the actions array for the `admit_date` field. So, for each instance in the array, the `getDateString` method will receive the `admit_date` as an argument and will return the formatted string. We have done almost the same thing for the `data_of_birth` field. Instead of formatting, we're calculating the age using the `calculateAge` method.

Lastly, we have `ethncityOptions` defined as the action for the `ethnicity` field. The type of action will be automatically determined. If it's an object, which is the case for `ethncityOptions`, the respective value will be returned from that object. The value of the field will be used as the key to look up in the object. On the other hand, if it's a function, it will be simply passed as an argument, and whatever is returned from the respective function will be put in the final CSV exported. Note that for those fields for which we want to retain the original value, we specified `null` as the action.


