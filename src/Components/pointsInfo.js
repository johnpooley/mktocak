import React from 'react'

const pointsInfo=()=>{
    return(
        <div style={{borderRadius:'10px',height:'fit-content',padding:'30px',margin:'30px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50',textAlign:'center'}}>
        <h2>How do I collect bike points?</h2>
        <hr/>
        <ol>
            <p>Each like on your published rides contributes 1 bike point</p>
            <p>Each added and accepted bike path contributes 30 bike points to your profile</p>
            <p>Each added and accepted place contributes 10 bicycle points to your profile</p>
        </ol>
        <h2>What should I do with my collected bike points?</h2>
        <hr/>
        <ul>
            <p>With 500 points you get the opportunity to add to the main map without being checked by a moderator</p>
            <p>With 1000 points you get the opportunity to become a moderator</p>
            <p>You get discounts in bicycle services / shops, etc. (Coming soon)</p>
        </ul>
    </div>
    )
}

export default pointsInfo;
