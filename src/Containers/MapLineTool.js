import React, { Component } from 'react';
import Map from '../Components/Map'
import firebase from 'firebase';
import './Contribute.css'
import Popup from 'reactjs-popup';
import { withFirebase } from '../firebase/firebaseindex';

export default class MapLineTool extends Component{

    state={
        points: [],
        pathState: 0,
        pathPlace: 0,
        popup: ''
    }

    constructor(props) {
        super(props);
        this.child = React.createRef();
    }
    addPointClick = () => {
        this.child.current.addPoint();
    };
    updatePoints = pnt=>{
        this.setState({points: pnt.points})
    }
    updatePathState = ev=>{
        this.setState({pathState: ev.target.value})
    }
    updatePathPlace = ev=>{
        this.setState({pathPlace: ev.target.value})
    }
    uploadPoints = ()=>{
        if(!this.validation()){
            return;
        }
        const db = firebase.firestore();
        const destructuredPoints = [];
        this.state.points.map(el=>{
            const obj={
                lng: el.lng,
                lat: el.lat
            }
            destructuredPoints.push(obj);
        })
        db.collection('modMap').add({points: destructuredPoints, pathState: this.state.pathState, pathPlace: this.state.pathPlace,user:this.props.user.displayName,uid:this.props.user.uid}).then(()=>{
        this.startOver()
        this.setState({popup: 'Successfully sent. Please wait up to 24 hours for this path to take effect. If it is confirmed you get 30 bike-points. Until then, add other paths!'})
        }).catch((error)=>{
            console.log(error);
            this.setState({popup: 'Hmmm, there was a problem. Please try again later!'})
        })
    }
    startOver = ()=>{
        this.child.current.startOver();
        this.setState({
            points: [],
            pathState: 0,
            pathPlace: 0
        })
    }
    validation = ()=>{
        if(this.state.pathState==0){
            this.setState({popup: 'Please enter a track status'});
            return false;
        }
        if(this.state.pathPlace==0){
            this.setState({popup: 'Please enter a track position'});
            return false;
        }
        if(this.state.points.length<2){
            this.setState({popup: 'Disabled path - Please enter at least two points that represent a valid path. Read the manual for more information'});
            return false;
        }
        return true
    }
    render(){
        return(
            <div>
                <Popup open={this.state.popup} onClose={()=>this.setState({popup: ''})}>
                    <div>
                        <p style={{textAlign:'center'}}>{this.state.popup}</p>
                        <p style={{textAlign:'center',fontSize:'10px'}}><i>Click outside this window to turn it off</i></p>
                    </div>
                </Popup>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'3px',margin:'15px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50'}}>
                    <Map points={this.state.points} updatePoints={points=>this.updatePoints(points)} canAddPoint={true} ref={this.child}/>
                    <div style={{display:'inline-block',verticalAlign:'top'}}>
                    <h4 style={{maxWidth:'500px',marginLeft:'20px'}}>Please read the manual and rules at the end of this page before you start</h4>
                        <div className='select'>
                            <select value={this.state.pathState} onChange={(ev)=>this.updatePathState(ev)}>
                                <option value={0}>Select a track condition</option>
                                <option value={1}>New / As new</option>
                                <option value={2}>Good</option>
                                <option value={3}>Bad</option>
                            </select>
                        </div>
                    <div className='select'>
                        <select value={this.state.pathPlace} onChange={(ev)=>this.updatePathPlace(ev)}>
                            <option value={0}>Choose a track position</option>
                            <option value={1}>On the road separated from vehicles</option>
                            <option value={2}>On the sidewalk separated from pedestrians</option>
                            <option value={3}>On the sidewalk along with pedestrians</option>
                            <option value={4}>Special (completely separate / offroad)</option>
                        </select>
                    </div>
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.addPointClick()}>Add a dot</button>
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.uploadPoints()}>Send!</button>
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.startOver()}>Start over</button>
                </div>
                </div>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'30px',margin:'30px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50'}}>
                    <h2>Instruction</h2>
                    <hr/>
                    <ol>
                        <p>1. Move the map to the beginning of the path</p>
                        <p>2. Press 'Add Point' to lock that position</p>
                        <p>3. Move the map to the next turn or intersection and click 'Add Point'</p>
                        <p>4. Continue like this until the end of the track</p>
                        <p>5. Choose a road condition and position</p>
                        <p>6. Finally check if everything is correct and press 'Send!'</p>
                        <p>7. The added trail will be checked in 24 hours and if approved you will receive 10 cycling points</p>
                    </ol>
                    <h2>Rules </h2>
                    <hr/>
                    <h3>If any of these rules are violated, your account may be completely deleted</h3>
                    <hr/>
                    <ul>
                        <p>Zoom in and be precise with the points</p>
                        <p>It is forbidden to set false paths</p>
                        <p>Make sure your path is already on the main map</p>
                        <p>Do not send the same path more than once</p>
                    </ul>
                </div>
            </div>
        )
    }
}
