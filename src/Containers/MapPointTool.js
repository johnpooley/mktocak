import React, {Component} from 'react'
import Map from '../Components/Map'
import firebase from 'firebase'
import './Contribute.css'
import Popup from 'reactjs-popup';


export default class MapPointTool extends Component{

    state={
        point: [],
        canAddPoint: true,
        placeType: 0,
        placeName: '',
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
        this.setState({point: pnt.points,canAddPoint: false})
    }
    updatePathPlace = ev=>{
        this.setState({placeType: ev.target.value})
    }
    chPlaceName = ev=>{
        this.setState({placeName: ev.target.value})
    }
    uploadPlace = ()=>{
        if(!this.validation()){
            return;
        }
        const db = firebase.firestore();
        db.collection('modPlaces').add({point:[{lng:this.state.point[0].lng,lat:this.state.point[0].lat}],placeType: this.state.placeType,placeName:this.state.placeName,user:this.props.user.displayName,uid:this.props.user.uid}).then(()=>{
            this.resetMap();
            this.setState({popup: 'Successfully sent. Please wait up to 24 hours for this place to be validated. If the same is confirmed you get 10 bike points. Until then, add other places!'})
        }).catch(err=>console.log(err))
    }
    resetMap = ()=>{
        this.child.current.startOver();
        this.setState({
            point: [],
            canAddPoint: true,
            placeType: 0,
            placeName: ''
        })
    }
    validation = ()=>{
        if(this.state.placeType===0){
            this.setState({popup:'Please enter a type of place'})
            return false;
        }
        if(this.state.point.length===0){
            this.setState({popup:'Please lock the selected position with the \ Add Marker \ button'});
            return false;
        }
        if(this.state.placeType==2 || this.state.placeType==3){
            if(this.state.placeName.length===0){
                this.setState({popup:'Please enter a name and contact for this service / store'});
                return false;
            }
        }
        return true;
    }

    render(){
        return(
            <div>
                <Popup open={this.state.popup.length>0} onClose={()=>this.setState({popup: ''})}>
                    <div>
                        <p style={{textAlign:'center'}}>{this.state.popup}</p>
                        <p style={{textAlign:'center',fontSize:'10px'}}><i>Click outside this window to turn it off</i></p>
                    </div>
                </Popup>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'3px',margin:'15px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50'}}>
                    <Map points={this.state.point} updatePoints={points=>this.updatePoints(points)} canAddPoint={this.state.canAddPoint} ref={this.child}/>
                    <div style={{display:'inline-block',verticalAlign:'top'}}>
                        <h4 style={{maxWidth:'500px',marginLeft:'20px'}}>Please read the manual and rules at the end of this page before you start</h4>
                        <div className='select'>
                            <select value={this.state.placetype} onChange={(ev)=>this.updatePathPlace(ev)}>
                                <option value={0}>Select a place type</option>
                                <option value={1}>Bicycle parking</option>
                                <option value={2}>Bicycle service</option>
                                <option value={3}>Bicycle shop</option>
                            </select>
                        </div>
                    {this.state.placeType>1 ? <input type='text' style={{margin:'20px'}} value={this.state.placeName} placeholder='Enter service / store name and contact (phone / website)' onChange={ev=>this.chPlaceName(ev)} />:''}
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.addPointClick()}>Add a marker</button>
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.uploadPlace()}>Post!</button>
                    </div>
                </div>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'30px',margin:'30px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50'}}>
                    <h2>Instruction</h2>
                    <hr/>
                    <ol>
                        <p>1. Move the map to the desired location</p>
                        <p>2. Press 'Add Marker' to lock the position</p>
                        <p>3. Select a marker type</p>
                        <p>4. If you choose a service or store you will need to enter a name and contact for that location</p>
                        <p>5. Click 'Send' and wait for this place to be verified (24 hours). After that it will be placed in the main map and you will get 10 bike points</p>
                    </ol>
                    <h2>Rules</h2>
                    <hr/>
                    <h3>If any of these rules are violated, your account may be completely deleted</h3>
                    <hr/>
                    <ul>
                        <p>It is forbidden to place false places</p>
                        <p>Make sure your site is already on the main map</p>
                        <p>Do not send the same place more than once</p>
                    </ul>
                </div>
            </div>
        )
    }
}
