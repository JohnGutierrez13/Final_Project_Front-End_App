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

import EditCampusView from '../views/EditCampusView';
import { fetchCampusThunk, editCampusThunk } from '../../store/thunks';

class EditCampusContainer extends Component {
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
    this.props.fetchCampus(this.props.match.params.id);
  }

  componentDidUpdate()
  {

    if(this.props.campus.id !== this.state.campusId)
    {
      this.setState({campusId: this.props.campus.id,
        name: this.props.campus.name, 
        address: this.props.campus.address, 
        description: this.props.campus.description, 
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
    let campus = {
        id: this.props.match.params.id,
        name: this.state.name,
        address: this.state.address,
        description: this.state.description,
    };
    
    // Add new student in back-end database
    await this.props.editCampus(campus);
    // Update state, and trigger redirect to show the new student
    this.setState({
      campusId:"",
      name: "", 
      address: "", 
      description: null,
      redirect: true, 
      redirectId:null,
    });
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
    this.setState({...this.state,
      campusId:"",
      name: "", 
      address: "", 
      description: null,
      redirect: true, 
      redirectId:null,
    });
  }

  // Render new student input form
  render() {
    // Redirect to edit student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/campuses`}/>)
    }
    
    
    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <EditCampusView
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}

          name ={this.state.name}  
          address = {this.state.address}
          description={this.state.description}
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
      campus: state.campus,  // Get the State object from Reducer "student"
    };
  };

const mapDispatch = (dispatch) => {
    return({
        fetchCampus: (id) => dispatch(fetchCampusThunk(id)),
        editCampus: (campus) => dispatch(editCampusThunk(campus)),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditCampusContainer);