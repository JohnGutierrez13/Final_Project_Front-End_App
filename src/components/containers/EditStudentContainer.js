/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import EditStudentView from '../views/EditStudentView';
import { editStudentThunk, fetchStudentThunk } from '../../store/thunks';

class EditStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state={
      
      redirect: false, 
      redirectId: null,    
  }
  }
  

  componentDidMount() {
    //getting student ID from url
    this.props.fetchStudent(this.props.match.params.id);
  }

  componentDidUpdate()
  {

    if(this.props.student.id !== this.state.studentId)
    {
      this.setState({studentId: this.props.student.id,
        firstname: this.props.student.firstname, 
        lastname: this.props.student.lastname,
        email: this.props.student.email,  
        campusId: this.props.student.campusId, 
        redirect: false, 
        redirectId: null,
      })
    }
    
  }
  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      ...this.state, [event.target.name]: event.target.value
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.
    let student = {
        id: this.props.match.params.id,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email, 
        campusId: this.state.campusId,
    };
    
    // Add new student in back-end database
    await this.props.editStudent(student);
    // Update state, and trigger redirect to show the new student
    this.setState({
      studentId:"",
      firstname: "", 
      lastname: "",
      email: "",  
      campusId: null,
      redirect: true, 
      redirectId:null,
    });
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
    this.setState({...this.state,
      studentId:"",
      firstname: "", 
      lastname: "", 
      email: "", 
      campusId: null,
      redirect: true, 
      redirectId:null,
    });
  }

  // Render new student input form
  render() {
    // Redirect to edit student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/students`}/>)
    }
    
    
    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <EditStudentView
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}

          studentFirstName ={this.state.firstname}  
          studentLastName = {this.state.lastname}
          studentEmail = {this.state.email}
          studentCampusId={this.state.campusId}
        />
      </div>          
    );
  }
}

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.

const mapState = (state) => {
    return {
      student: state.student,  // Get the State object from Reducer "student"
    };
  };

const mapDispatch = (dispatch) => {
    return({
        fetchStudent: (id) => dispatch(fetchStudentThunk(id)),
        editStudent: (student) => dispatch(editStudentThunk(student)),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditStudentContainer);