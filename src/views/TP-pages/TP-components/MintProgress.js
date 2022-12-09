import React from 'react'

function MintProgress(props) {
    const { completed, day, hour, minute  } = props;

    const containerStyles = {
        height: 160,
        width: 420,
        backgroundColor: "rgba(255,255,255,0.1)",
        position:"relative",
        borderRadius:"5px",
        marginBottom:"40px"
    }

    const containerBarStyles = {
        height: 40,
        width: 420,
        backgroundColor: "#4a4a4a",
        position:"relative",
        borderRadius:"5px"
    }

    const fillerStyles = ()=>{
        const clip = {
            height: '100%',
            width: `${completed+10}%`,
            backgroundColor: '#00ffff',
            textAlign: 'right',
            position:"absolute",
            borderRadius:"5px"
         }
        switch(completed) {
            case 33:
                return{
                    ...clip,
                    clipPath:"polygon(0 0, 140px 0, 160px 20px, 140px 40px, 0 40px)"
                }
            case 67:
                return{
                    ...clip,
                    clipPath:"polygon(0 0, 280px 0, 300px 20px, 280px 40px, 0 40px)"
                }
            case 100:
                return{
                    ...clip,
                    clipPath:"polygon(0 0, 420px 0, 440px 20px, 420px 40px, 0 40px)"
                }
            default:
                return{
                    ...clip,
                    clipPath:"polygon(0 0, 140px 0, 160px 20px, 140px 40px, 0 40px)"
                }
        }
    }

    const labelStyles = {
        color: 'white',
        fontWeight: 'bold',
        width:"100%",
        height:"100%",
        position:"absolute",
        float:"left",
        display:"flex"
    }

    const labelReachedStyles = {
        position:"relative",
        width:"33%",
        display:"flex",
        height:"100%",
        justifyContent:"center", 
        alignItems:"center",
        color:"black"
    }

    const labelNotReachedStyles = {
        position:"relative",
        width:"33%",
        height:"100%",
        display:"flex",
        justifyContent:"center", 
        alignItems:"center",
        color:"white"
    }

    const textStyles = {
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        height:120,
        width:"100%"
    }

    const blueText = {
        color:"#00ffff",
        fontWeight:"bold"
    }

    const triangleStyle = {
        height:"17px",
        width:"20px",
        backgroundColor:"white",
        clipPath:"polygon(10px 0, 20px 17px, 0px 17px)",
        position:"absolute",
        bottom:"-25px",
        left:"60px"
    }

    return (
        <div style={containerStyles}>
            <div style={containerBarStyles}>
                <div style={fillerStyles()}/>
                <div style={labelStyles}>
                    <h6 style={completed>=33?labelReachedStyles:labelNotReachedStyles} className={completed===33?"font-weight-bold":"font-weight-light"}>
                        Pre-Mint
                        <div style={{...triangleStyle, display:completed===33?"block":"none"}}/>
                    </h6>
                    <h6 style={completed>=67?labelReachedStyles:labelNotReachedStyles} className={completed===67?"font-weight-bold":"font-weight-light"}>
                        Minting
                        <div style={{...triangleStyle, display:completed===67?"block":"none"}}/>
                    </h6>
                    <h6 style={completed>=100?labelReachedStyles:labelNotReachedStyles} className={completed===100?"font-weight-bold":"font-weight-light"}>
                        After-Mint
                        <div style={{...triangleStyle, display:completed===100?"block":"none"}}/>
                    </h6>
                </div>
            </div>
            <div style={{...textStyles, display:completed===33?"flex":"none"}}>
                <h3 className='font-weight-bold m-0'> 
                    <span style={blueText}>
                        {day}&nbsp;
                    </span>
                    days 
                    <span style={blueText}>
                    &nbsp;{hour}&nbsp;
                    </span>
                    hr 
                    <span style={blueText}>
                    &nbsp;{minute}&nbsp;
                    </span>
                    mins
                </h3>
                <h3 className='font-weight-light m-0'>
                    Until
                    <span style={blueText}>&nbsp;Mint&nbsp;</span>
                    Starts
                </h3>
            </div>
            <div style={{...textStyles, display:completed===67?"flex":"none"}}>
                <h3 className='font-weight-bold m-0'> 
                    <span style={blueText}>
                        {day}&nbsp;
                    </span>
                    days 
                    <span style={blueText}>
                    &nbsp;{hour}&nbsp;
                    </span>
                    hr 
                    <span style={blueText}>
                    &nbsp;{minute}&nbsp;
                    </span>
                    mins
                </h3>
                <h3 className='font-weight-light m-0'>
                    Until
                    <span style={blueText}>&nbsp;Mint&nbsp;</span>
                    Ends
                </h3>
            </div>
            <div style={{...textStyles, display:completed===100?"flex":"none"}}>
                <h3 className='font-weight-light m-0'>
                    Mint has
                    <span style={blueText}>&nbsp;Finished&nbsp;</span>
                    After Dec.1st.2022
                </h3>
            </div>
        </div>
    );
};

export default MintProgress