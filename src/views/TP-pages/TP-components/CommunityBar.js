import React,{useState} from 'react'
import {
    Button
} from 'reactstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { changeCommunity } from 'redux/actions'
import '../TP-scss/components/communitybar.scss'

function CommunityBar({decideCommunity}) {
  const [buttons, setButtons] = useState(
      [
        {
            name:'Frace',
            focused:false
        },
        {
            name:'Rio',
            focused:false
        },
        {
            name:'+',
            focused:false
        }
      ])    

  return (
    <div className='d-flex justify-content-between community_box'>
        <div>
            <div className='community_top_logo_box d-flex justify-content-center align-items-center'>
                <img  className='community_top_logo' src="/assets/img/portal/logo.png" alt="" />
            </div>
            {
                buttons.map((item)=>{
                    return(
                        <div key={item} className='community_top_item_box d-flex justify-content-center align-items-center'>
                            <Link to={`/${item.name}/NFT-list`}>
                                <Button 
                                    className={
                                        item.focused
                                        ?
                                        'community_top_item_focus d-flex justify-content-center align-items-center'
                                        :
                                        'community_top_item d-flex justify-content-center align-items-center'
                                    }
                                    name={item.name}
                                    onClick={()=>{
                                        const newArray = buttons
                                        newArray.forEach((button)=>{
                                            if(button.name === item.name){
                                                button.focused = true
                                            }
                                            else{
                                                button.focused = false
                                            }
                                        })
                                        setButtons([...newArray])
                                        decideCommunity(item.name)
                                    }}
                                >
                                    <h1 className='p-0 m-0 font-weight-bold'>
                                        {item.name.substring(0,1)}
                                    </h1>
                                </Button>
                            </Link>
                        </div>
                    )
                })
            }
        </div>
        <div className='community_bottom_image_box d-flex justify-content-center align-items-center'>
            <img  className='community_bottom_image' src="/assets/img/profiles/1.jpg" alt="" />
        </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
    return{
     decideCommunity: (community)=>{
         dispatch(changeCommunity(community))
     }
    }
  };

export default connect(null, mapDispatchToProps)(CommunityBar)