import React, { Component } from 'react'
import { getNextTerm, getCurrentTerm, getCurrentYear } from './functions/terms'
import axios from "axios";

class Planner extends Component {
    constructor(props) {
        super(props);
        this.state = {
          terms: [],
          termsMapping: [],
          courses: [],
        };
      }

    componentDidMount() {
        this.refreshPlanner();
    }

    refreshPlanner = () => {
        axios
          .get("/api/terms/")
          .then((res) => {
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
            this.setState({ terms: res.data })
            this.setState({ termsMapping: newTerms })
            console.log(this.state.terms)
            console.log(this.state.termsMapping)
          })
          .catch((err) => console.log(err));
        axios
          .get("/api/courses/")
          .then((res) => this.setState({ courses: res.data }))
          .catch((err) => console.log(err));
          
    };
    
    handleTermDelete = (item) => {
    axios
        .delete(`/api/terms/${item.id}/`).catch(function (error) {
            console.log("Deletion failed with error:" + error)})
        .then((res) => window.location.href='/')
    };

    handleCourseDelete = (item) => {
        axios
            .delete(`/api/courses/${item.id}/`).catch(function (error) {
                console.log("Failed to delete a course:" + error)})
            .then((res) => this.refreshPlanner());
        };

    createTerm = () => {
        let lastTerm = ''
        if (this.state.terms.length === 0){
            lastTerm = getCurrentTerm() + ' ' + getCurrentYear()
            console.log(lastTerm)
        }
        else{
            lastTerm = this.state.terms[this.state.terms.length-1].name
        }
        const newTerm = getNextTerm(lastTerm)
        const term = {name: newTerm}
        axios
            .post(`/api/terms/`, term)
            .then((res) => window.location.href='/')
    }

    deleteTerm = () => {
        if (this.state.terms.length === 0){
            return
        }
        const lastTerm = this.state.terms[this.state.terms.length-1]
        axios
            .delete(`/api/terms/${lastTerm.id}`).catch(function (error){
                console.log("Failed to delete a term:" + error)})
            .then((res) => this.refreshPlanner());
    }

    renderCourses = (term) => {
        const items = this.state.courses.filter((item) => item.term === term.id)
        return items.map((item) => (
            <tr key={item.id}>
                <span>
                    {item.name}
                </span>
                <span>
                    <button className="btn btn-outline-danger"
                        onClick={() => this.handleCourseDelete(item)}> Delete </button>
                </span>
            </tr>
        ))
    }

    renderTerms = () => {
        const items = [...this.state.termsMapping]
        return items.map((item) => (
            <div className="ThreeTerms">
                {item.length >= 1 ? <table className="table table-bordered text-black float-left" style={{width: "30%"}}>
                    <thead>
                        <tr>
                            <span>
                                <h5>{item[0].name}</h5>
                            </span>
                        </tr>
                        {this.renderCourses(item[0])}
                    </thead>
                </table>  : null}
                {item.length >= 2 ? <table className="table table-bordered text-black float-mid" style={{width: "30%"}}>
                    <thead>
                        <tr>
                            <span>
                                <h5>{item[1].name}</h5>
                            </span>
                        </tr>
                        {this.renderCourses(item[1])}
                    </thead>
                </table>  : null}
                {item.length >= 3 ? <table className="table table-bordered text-black float-right" style={{width: "30%"}}>
                    <thead>
                        <tr>
                            <span>
                                <h5>{item[2].name}</h5>
                            </span>
                        </tr>
                        {this.renderCourses(item[2])}
                    </thead>
                </table>  : null}
            </div>
        ))
    }

    render(){
        return (
            <div>
                <ul>
                    {this.renderTerms()}
                </ul>
                <div className="container2">
                    <div className="vertical-center">
                        <button className="btn btn-secondary" onClick={() => this.createTerm()}> Add Term </button>
                        &nbsp;
                        <button className="btn btn-secondary" onClick={() => this.deleteTerm()}> Delete Term </button>
                    </div>
                </div>
                <br></br><br></br><br></br>
            </div>
        )
    }
}

export default Planner;