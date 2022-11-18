import React, {useState} from 'react'
import { Row, Button } from 'reactstrap'
import { Colxx } from 'components/common/CustomBootstrap'
import './rewards.scss'

function Rewards() {

    const rewardsList = [
        { 
          id:0,
          title:"Access Portal content",
          icon:"/assets/img/portal/logo.png",
          address:"https://founder.forging.one "
        },
        { 
          id:1,
          title:"Access Discord Server",
          icon:"https://i.pinimg.com/originals/34/91/f3/3491f3e50ab6a4d51a348f9cc2419842.jpg",
          address:"https://discord.com/invite/forging"
        },
        { 
          id:2,
          title:"Access to IRL event",
          icon:"https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX18689296.jpg",
          address:"https://www.eventbrite.com/e/nysfhudwsgfhjdsgfdshgkdsahgisdhgkhsdoghsd"
        },
        { 
          id:3,
          title:"Custmized Reward",
          icon:"https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX18689296.jpg",
          address:"Reward descriptions"
        }
      ]
      const [data, setData] = useState([
        {
          value:rewardsList[0].address,
          edible:false
        },
        {
          value:rewardsList[1].address,
          edible:false
        }, 
        {
          value:rewardsList[2].address,
          edible:false
        }, 
        {
          value:rewardsList[3].address,
          edible:false
        },
      ])
    
  return (
    <>
        <h4 className='font-weight-bold m-4'>
            Edit Rewards Details
        </h4>      
        {rewardsList.map((item)=>{
            return (
                <div key={item} className="rewards_li mt-3 mb-3 ml-0">
                    <Row className='mt-3 mb-3 w-100'>
                        <Colxx xxs="3" md="2" className='d-flex align-items-center justify-content-center w-100 m-0 p-0'>
                            <img src={item.icon} alt="" className='rewards_image'/>  
                        </Colxx>
                        <Colxx xxs="9" md="10" className="m-0 p-0">
                            <h6 className='font-weight-bold d-flex align-items-center h-100'>
                            {item.title}
                            </h6>
                        </Colxx>
                    </Row>
                    <div className='rewards_address_box m-0 pl-3 pr-3 d-flex justify-content-between w-100'>
                        <h6 className='p-0 m-0 rewards_address'>
                            {data[item.id].value}
                        </h6>   
                        <Button className='rewards_button'>
                            <h6 className='m-0 p-0'>edit</h6>
                        </Button>
                    </div>
                </div>
            )
        })}
        <div className='rewards_li d-flex justify-content-end pt-3'>
          <Button className='mr-2 rewards_page_button'>
              <h6 className='p-0 m-0'>
                Notify Holder&apos;s Change
              </h6>
              </Button>
            <Button className='rewards_page_button'>
              <h6 className='p-0 m-0'>
                Save
              </h6>
            </Button>
        </div>
    </>
  )
}

export default Rewards