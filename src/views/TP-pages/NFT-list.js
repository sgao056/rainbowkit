import React,{useState, useEffect} from 'react'
import { Colxx } from 'components/common/CustomBootstrap'
import { Row, Card} from 'reactstrap'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import Header from './TP-components/Header'
import CommunityBar from './TP-components/CommunityBar'

const NFTListDataFrace = [
  {
    id:1,
    title:"Digital creation",
    icon:"simple-icon-picture",
    amount:"500",
    stock:"112",
    price:"0.55",
    subTitle:"Face Paper Collage No.1",
    holders:"89",
    earned:"60.06",
    image:"/assets/img/NFT/example-NFT.jpg"
  },
  {
    id:2,
    title:"Member Pass",
    icon:"simple-icon-key",
    amount:"1000",
    stock:"672",
    price:"0.25",
    subTitle:"Forging Creater’s Pass",
    holders:"657",
    earned:"163.8",
    image:"/assets/img/NFT/Frame-11.png"
  }
]
const NFTListDataRio = [
  {
    id:1,
    title:"Digital creation",
    icon:"simple-icon-picture",
    amount:"500",
    stock:"112",
    price:"0.55",
    subTitle:"Face Paper Collage No.1",
    holders:"89",
    earned:"60.06",
    image:"/assets/img/NFT/example-NFT.jpg"
  }
]
function NFTlist({community}) {
  return (
    <div>
      <Header mediumArea=""/>
        <div className="container pt-3">
        <Row>
          { 
            community.community === 'Rio' ? 
            NFTListDataRio.map(
              (item)=>{
                return (
                  <Colxx xxs="12" sm="6" lg="4" xxl="3" key={item.id}>
                    <p className='m-2 font-weight-bold' style={{height:"21px"}}>
                      <span>
                        <i className={`${item.icon} m-2 font-weight-bold`}/>
                      </span>
                      {item.title}
                    </p>
                    <Link to="/owner">
                      <Card className='p-4 w-100'>
                          <img src={item.image} alt="" 
                          style={{height:
                            document.body.scrollWidth < 768 
                            && 
                            document.body.scrollWidth > 576 
                            ? 
                            "240px"
                            :
                            "320px"}}
                          />
                          <h4 className='font-weight-bold mt-3 mb-3'>{item.subTitle}</h4>
                          <div className='d-flex justify-content-between'>
                              <p className='m-0'><i className='simple-icon-grid'/>&nbsp;&nbsp;{item.stock} / {item.amount}</p>
                              <p className='m-0'>{item.price} ETH</p>
                          </div>
                          <div className="mb-2 pb-2" style={{borderBottom:"1px solid", height:"1px"}}/>
                          <p className='rtl mt-1 mb-1'>
                            Total Earned
                          </p>
                          <p className='d-flex justify-content-between font-weight-bold'>
                              <div>
                              {item.holders} holders                                  
                              </div>
                              <div>
                              {item.earned} ETH
                              </div>                              
                          </p>
                      </Card>
                    </Link>
                  </Colxx>
                )
              }
            )
            :
            NFTListDataFrace.map(
              (item)=>{
                return (
                  <Colxx xxs="12" sm="6" lg="4" xxl="3" key={item.id}>
                    <p className='m-2 font-weight-bold' style={{height:"21px"}}>
                      <span>
                        <i className={`${item.icon} m-2 font-weight-bold`}/>
                      </span>
                      {item.title}
                    </p>
                    <Link to="/owner">
                      <Card className='p-4 w-100'>
                          <img src={item.image} alt="" 
                          style={{height:
                            document.body.scrollWidth < 768 
                            && 
                            document.body.scrollWidth > 576 
                            ? 
                            "240px"
                            :
                            "320px"}}
                          />
                          <h4 className='font-weight-bold mt-3 mb-3'>{item.subTitle}</h4>
                          <div className='d-flex justify-content-between'>
                              <p className='m-0'><i className='simple-icon-grid'/>&nbsp;&nbsp;{item.stock} / {item.amount}</p>
                              <p className='m-0'>{item.price} ETH</p>
                          </div>
                          <div className="mb-2 pb-2" style={{borderBottom:"1px solid", height:"1px"}}/>
                          <p className='rtl mt-1 mb-1'>
                            Total Earned
                          </p>
                          <p className='d-flex justify-content-between font-weight-bold'>
                              <div>
                              {item.holders} holders                                  
                              </div>
                              <div>
                              {item.earned} ETH
                              </div>                              
                          </p>
                      </Card>
                    </Link>
                  </Colxx>
                )
              }
            )
          }
          <Colxx xxs="12" sm="6" lg="4" xxl="3">
            <p className='m-2' style={{height:"21px"}}/>
            <Card className='pt-3 pb-3 pl-4 pr-4'>
                <Link to="/choose-service">
                    <div className='d-flex justify-content-center align-items-center w-100 h-100'>
                      <h4 className="font-weight-bold h-100">
                            <i className='simple-icon-plus mr-2 font-weight-bold' style={{transform:"scale(1.2)"}}/>
                            Create a NFT
                      </h4>
                    </div>
                    <p>Create a NFT by using Forging services, No- Coad required, it will take 15-20 mins to go through the process</p>
                </Link>
              </Card>
          </Colxx>
        </Row>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    community : state.community
  }
};

export default  connect(mapStateToProps)(NFTlist)