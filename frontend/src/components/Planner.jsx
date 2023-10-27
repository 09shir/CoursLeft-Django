// import React, { Component } from 'react'
import React, { useState, useEffect } from 'react'
import { getNextTerm, getCurrentTerm, getCurrentYear } from './functions/terms'
import axios from "axios";
import BackspaceIcon from '@mui/icons-material/Backspace';
import { IconButton } from '@mui/material';
import { Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { plannerRefresh } from "../redux/refresh"

const Planner = () => {

    const [terms, setTerms] = useState([]);
    const [termsMapping, setTermsMapping] = useState([]);
    const [courses, setCourses] = useState([]);

    const boardID = useSelector((state) => state.boardCounter.board);
    const refreshPlannerListener = useSelector((state) => state.refreshBoard.value);
    const dispatch = useDispatch();


    useEffect(() => {
        refreshPlanner();
    },[boardID, refreshPlannerListener]);

    const refreshPlanner = () => {
        axios
          .get("/api/terms/")
          .then((res) => {

            res.data = res.data.filter((item) => item.board === boardID)

            // from [summer 2023, fall 2023, ... fall 2024]

            // to [[summer 2023, fall 2023, spring 2024]
            //     [summer 2024, fall 2024]

            let newTerms = []
            let tmpTerms = []
            for (let i = 0; i < Math.ceil(res.data.length/3); i++){
                for (let j = 0; j < 3; j++){
                    if (res.data[i*3+j] !== undefined){
                        tmpTerms.push(res.data[i*3+j])
                    }
                } 
                newTerms.push(tmpTerms)
                tmpTerms = []
            }

            setTerms(res.data)
            setTermsMapping(newTerms)
            console.log(terms)
            console.log(termsMapping)
          })
          .catch((err) => console.log(err));
        axios
          .get("/api/courses/")
        //   .then((res) => this.setState({ courses: res.data }))
          .then((res) => {setCourses(res.data)})
          .catch((err) => console.log(err));
    }

    // const handleTermDelete = (item) => {
    //     axios
    //         .delete(`/api/terms/${item.id}/`).catch(function (error) {
    //             console.log("Deletion failed with error:" + error)})
    //         .then((res) => window.location.href='/')
    // };

    const handleCourseDelete = (item) => {
        axios
            .delete(`/api/courses/${item.id}/`).catch(function (error) {
                console.log("Failed to delete a course:" + error)})
            // .then((res) => refreshPlanner());
            .then((res) => dispatch(plannerRefresh()))
    };

    const createTerm = () => {
        let lastTerm = ''
        if (terms.length === 0){
            lastTerm = getCurrentTerm() + ' ' + getCurrentYear()
            console.log(lastTerm)
        }
        else{
            lastTerm = terms[terms.length-1].name
        }
        const newTerm = getNextTerm(lastTerm)
        const term = {
            name: newTerm, 
            board: boardID
        }
        axios
            .post(`/api/terms/`, term)
            .then((res) => dispatch(plannerRefresh()))
    }

    const deleteTerm = () => {
        if (terms.length === 0){
            return
        }
        const lastTerm = terms[terms.length-1]
        axios
            .delete(`/api/terms/${lastTerm.id}`).catch(function (error){
                console.log("Failed to delete a term:" + error)})
            // .then((res) => refreshPlanner());
            .then((res) => dispatch(plannerRefresh()))
    }

    const renderCourses = (term) => {
        const items = courses.filter((item) => item.term === term.id)
        return items.map((item) => (
            <tr key={item.id}>
                <span className='course-field-left'>
                    {item.name}
                </span>
                <span className='button-field-right'>
                    {/* <button className="btn btn-outline-danger"
                        onClick={() => this.handleCourseDelete(item)}> Delete </button> */}
                    <Tooltip placement="right" title={"Remove " + item.name}>
                        <IconButton onClick={() => handleCourseDelete(item)}>
                            <BackspaceIcon fontSize="medium"/>
                        </IconButton>
                    </Tooltip>
                </span>
            </tr>
        ))
    }

    const renderTerms = () => {
        const items = [...termsMapping]
        return items.map((item) => (
            <div className="ThreeTerms">
                {item.length >= 1 ? <table className="table table-bordered text-black float-left" style={{width: "30%"}}>
                    <thead>
                        <tr key={item[0].name}>
                            <span>
                                <h5>{item[0].name}</h5>
                            </span>
                        </tr>
                        {renderCourses(item[0])}
                    </thead>
                </table>  : null}
                {item.length >= 2 ? <table className="table table-bordered text-black float-mid" style={{width: "30%"}}>
                    <thead>
                        <tr key={item[1].name}>
                            <span>
                                <h5>{item[1].name}</h5>
                            </span>
                        </tr>
                        {renderCourses(item[1])}
                    </thead>
                </table>  : null}
                {item.length >= 3 ? <table className="table table-bordered text-black float-right" style={{width: "30%"}}>
                    <thead>
                        <tr key={item[2].name}>
                            <span>
                                <h5>{item[2].name}</h5>
                            </span>
                        </tr>
                        {renderCourses(item[2])}
                    </thead>
                </table>  : null}
            </div>
        ))
    }

    return (
        <div data-testid="planner">
            {/* <ul> */}
                {renderTerms()}
            {/* </ul> */}
            <div className="container2">
                <div className="vertical-center">
                    <button className="btn btn-secondary" onClick={() => createTerm()}> 
                        Add Term
                    </button>
                    &nbsp;
                    <button className="btn btn-secondary" onClick={() => deleteTerm()}> 
                        Delete Term
                    </button>
                </div>
            </div>
            <br></br><br></br><br></br>
        </div>
    )
}

export default Planner;