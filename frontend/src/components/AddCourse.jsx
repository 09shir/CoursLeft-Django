import React, { useState, useEffect } from 'react'
import { coursesList } from './functions/courses';
import { parseFullNameToCourseID } from './functions/courseFunctions';
import { predict } from './functions/termsPrediction';
import axios from "axios";
import {
    Button,
    Form,
    FormGroup,
  } from "react-bootstrap";


const AddCourse = () => {

    const [terms, setTerms] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [coursesList2, setCoursesList2] = useState(coursesList)

    const [availabilitySection, setAvailabilitySection] = useState({
        availableTerm: [],
    })

    const [showPredictButton, setShowPredictButton] = useState(false)
    const [showAvailability, setShowAvailability] = useState(false)
    const [maxWorkLoadWarning, setMaxWorkLoadWarning] = useState(false)
    const [repeatWarning, setRepeatWarning] = useState(false)

    useEffect(() => {
        axios
          .get("/api/terms/")
          .then((res) => {setTerms({ terms: res.data }); setLoading(false);})
          .catch((err) => console.log(err));
          
    }, []);

    const [values, setValues] = useState({
        courseName: '',
        courseTerm: ''
    })

    const handleCourseNameInputChange = (e) => {
        setShowAvailability(false)
        setMaxWorkLoadWarning(false)
        setRepeatWarning(false)
        e.persist();
	    setValues((values) => ({
		    ...values,
		    courseName: e.target.value,
	    }));
        console.log(e.target.value)
        setCoursesList2(coursesList.filter(course => 
            (course.toLowerCase()).includes(e.target.value.toLowerCase())
        ))
        if (e.target.value.length > 0){
            setShowPredictButton(true)
        }
        else{
            setShowPredictButton(false)
        }
    }

    const handleCourseTermInputChange = (e) => {
        setMaxWorkLoadWarning(false)
        setRepeatWarning(false)
        e.persist();
	    setValues((values) => ({
		    ...values,
		    courseTerm: e.target.value,
	    }));
    }

    const submit = () => {

        setShowAvailability(false)

        const { courseName, courseTerm} = values

        const ret = {
            name: courseName.toUpperCase(),
            term: courseTerm
        }
        // check if there are 6 or more courses in selected term
        // check if course about to add repeats with already selected course
        axios
          .get("/api/courses/")
          .then((res) => { 
            let count = 0
            let repeat = false
            res.data.map(course => {
                if (course.term == ret.term){
                    count++;
                    if (course.name == ret.name){
                        repeat = true
                    }
                }
            })
            if (count < 6 && !repeat){
                axios
                    .post(`/api/courses/`, ret)
                    .then((res) => window.location.href='/')
            }
            else {
                // warning term full 
                if (count >= 6){
                    setMaxWorkLoadWarning(true)
                }
                // warning repeated term
                if (repeat){
                    setRepeatWarning(true)
                }
            }
          })
    }
    
    const checkAvailability = async () => {

        let array = []
        await predict(values.courseName).then((val) => 
            array = val
        )

        setAvailabilitySection((section) => ({
            ...section,
            availableTerm: (values.courseName === '') ? [] : array
        }))
        console.log(availabilitySection)

        setShowAvailability(true)
    }

    if (isLoading) {
        return <div className="App">Loading...</div>;
    }

    const mappingTerms = () => {
        const storedTerms = terms.terms
        return storedTerms?.map((term) => (
            <option value={term.id}>{term.name}</option>
        ))
    }

    const mappingCourses = () => {
        return coursesList2?.map((course) => (
            <option value={parseFullNameToCourseID(course)}>{course}</option>
        ))
    }

    return (
        <div>
            <br></br>
            <h5>Add Course</h5>
            <br></br>
            <Form>
                <FormGroup>
                    <Form.Label>Course ID</Form.Label>
                    <Form.Control type="text" 
                        id="course-title" 
                        value={values.courseName}
                        onChange={handleCourseNameInputChange}
                        placeholder="Enter Course ID"
                        aria-label="Default select example">
                    </Form.Control>
                    <Form.Select 
                        type="text"
                        value={values.courseName}
                        onChange={handleCourseNameInputChange}>
                        {mappingCourses()}
                    </Form.Select>
                </FormGroup>

                <br></br>
                <FormGroup>
                    <Form.Label>Term</Form.Label>
                    <Form.Select type="text" 
                        id="course-term" 
                        value={values.courseTerm}
                        onChange={handleCourseTermInputChange}
                        placeholder="Select Term"
                        aria-label="Default select example">
                        <option>Select A Term</option>
                        {mappingTerms()}
                    </Form.Select>
                </FormGroup>
            </Form>
            <br></br>
            <Button className="btn btn-primary" onClick={submit}> Add </Button>
            &nbsp;&nbsp;&nbsp;
            {showPredictButton ? <Button className="btn btn-primary" onClick={checkAvailability}> Predict Availability </Button> : null}
            <br></br><br></br>
            {showAvailability ? <h5>{
                <>
                {availabilitySection.availableTerm.length === 0 ? <button className="btn btn-outline-primary">Not Offered</button>: 
                (availabilitySection.availableTerm)?.map(term => (
                  <>
                    <button className="btn btn-outline-primary">{term}</button>
                    &nbsp;&nbsp;
                  </>
                ))}
                 <br></br><br></br>
                <p style={{ fontSize: 11 }} > ^ Prediction model based on course offering data from past two years. Aware of inaccuracy.</p>
                </>
            }</h5> : null}
            {maxWorkLoadWarning ? <h5><p style={{ fontSize: 11 }} > ⚠ Warning: Course load exceeded maximum allowance for selected term </p></h5> : null}
            {repeatWarning ? <h5><p style={{ fontSize: 11 }} > ⚠ Warning: Course selected repeats with already selected course in same term </p></h5> : null}
        </div>
    )
}

export default AddCourse;
