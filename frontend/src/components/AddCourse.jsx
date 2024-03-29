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
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { plannerRefresh } from "../redux/refresh"


const AddCourse = () => {

    const boardID = useSelector((state) => state.boardCounter.board);
    const refreshPlannerListener = useSelector((state) => state.refreshBoard.value);
    const dispatch = useDispatch();

    const [terms, setTerms] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [coursesList2, setCoursesList2] = useState(coursesList)

    const [availabilitySection, setAvailabilitySection] = useState({
        availableTerm: [],
        pastTerms: []
    })

    const [showPredictButton, setShowPredictButton] = useState(false)
    const [showAvailability, setShowAvailability] = useState(false)
    const [maxWorkLoadWarning, setMaxWorkLoadWarning] = useState(false)
    const [repeatWarning, setRepeatWarning] = useState(false)

    useEffect(() => {
        axios
          .get("/api/terms/")
          .then((res) => {
            res.data = res.data.filter((item) => item.board === boardID)
            setTerms({ terms: res.data }); 
            setLoading(false);})
          .catch((err) => console.log(err));
          
    }, [refreshPlannerListener, boardID]);

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
            res.data.forEach(course => {
                if (course.term.toString() === ret.term){
                    count++;
                    if (course.name.toString() === ret.name){
                        repeat = true
                    }
                }
            })
            if (count < 6 && !repeat){
                axios
                    .post(`/api/courses/`, ret)
                    .then((res) => dispatch(plannerRefresh()))
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

        let predictedTerms = []
        let pastTerms = []
        await predict(values.courseName).then((val) => {
            predictedTerms = val.predictResult;
            pastTerms = val.pastTerms
        }
        )

        setAvailabilitySection((section) => ({
            ...section,
            availableTerm: (values.courseName === '') ? [] : predictedTerms,
            pastTerms: (values.courseName === '') ? [] : pastTerms
        }))
        
        console.log(availabilitySection)

        setShowAvailability(true)
    }

    if (isLoading) {
        return <div data-testid="loading" className="App">Loading...</div>;
    }

    const mappingTerms = () => {
        const storedTerms = terms.terms
        return storedTerms?.map((term) => (
            <option key={term.id} value={term.id}>{term.name}</option>
        ))
    }

    const mappingCourses = () => {
        return coursesList2?.map((course) => (
            <option key={course} value={parseFullNameToCourseID(course)}>{course}</option>
        ))
    }

    return (
        <div data-testid="addCourse">
            <br></br>
            <h5>Add Course</h5>
            <br></br>
            <Form>
                <FormGroup>
                    <Form.Label>Course ID <SchoolIcon color="primary" fontSize="small"/></Form.Label>
                    <Form.Control type="text" 
                        id="course-title" 
                        value={values.courseName}
                        onChange={handleCourseNameInputChange}
                        placeholder="Enter Course ID "
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
                    <Form.Label>Term <EventIcon color="primary" fontSize="small"/> </Form.Label>
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
            {showPredictButton ? <span>
                <Button className="btn btn-primary" onClick={checkAvailability}> Predict Availability </Button> 
                &nbsp;&nbsp;
                <Tooltip placement="top" title={"Predicts the terms which the course will be available"}>
                    <IconButton size="small">
                        <HelpOutlineIcon color="primary" fontSize="small"/>
                    </IconButton>
                </Tooltip>
            </span> : null}
            <br></br><br></br>
            {showAvailability ? <h5>{
                <>
                {availabilitySection.availableTerm.length === 0 ? <><button className="btn btn-outline-primary">Not Offered</button>&nbsp;</>: 
                (availabilitySection.availableTerm)?.map(term => (
                    <>
                        <button className="btn btn-outline-primary">{term}</button>
                        &nbsp;&nbsp;
                    </>
                ))}
                <Tooltip placement="bottom" 
                    title={
                        <React.Fragment>
                            <p><b>
                                {/* {values.courseName.toUpperCase()}'s Available Terms ({availabilitySection.pastTerms[availabilitySection.pastTerms.length-1][0]} ~ {}
                                {availabilitySection.pastTerms[0][0]}):  */}
                                {values.courseName.toUpperCase()}'s Available Terms (2022-2024)
                                {/* {values.courseName.toUpperCase()}'s availability since 2014: */}
                            </b></p>
                            {availabilitySection.pastTerms.length === 0 ? <>Never Offered</> : 
                                <thead>
                                    {(availabilitySection.pastTerms)?.map(term => (
                                        <tr>{term[1].charAt(0).toUpperCase() + term[1].slice(1) + " " + term[0]}</tr>
                                    ))}
                                </thead>}
                        </React.Fragment>
                    }>
                    <IconButton size="small">
                        <HelpOutlineIcon color="primary" fontSize="small"/>
                    </IconButton>
                </Tooltip>
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
