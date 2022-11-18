import React,{useEffect} from 'react'
import { Row } from 'reactstrap'
import { Colxx } from 'components/common/CustomBootstrap'
import { Link } from 'react-router-dom'
import {MdArrowBackIosNew} from 'react-icons/md'
import {connect} from 'react-redux'
 
function MyNFT(
  {
    community,
    ...props
  }
){
  const decidedCommunity = community
  const { NFTInfo } = props

  return (
    <Row className='w-100 h-100 m-0'>
      <Colxx xxs="12" sm="4" lg="2" className="p-0 d-flex align-items-center justify-content-center">
        {/* <Link to = {`/${decidedCommunity.community}/NFT-list`}>
          <MdArrowBackIosNew className='mr-4' style={{transform:"scale(3)"}}/>        
        </Link> */}
        <img className='NFT_common_header_portrait' src={NFTInfo.image} alt=""/>
      </Colxx>
      {
        window.innerWidth > 576 ? 
        <Colxx sm="7" lg="9" className="pr-0 d-flex justify-content-center" style={{flexDirection:"column"}}>
        <div>
          <p className='font-weight-bold NFT_common_header_name m-0'>
            {NFTInfo.name}
          </p>
        </div>
        <div className='w-100'>
          <Row>
            <Colxx xxs="4" className="pr-0" >
              {NFTInfo.link}
            </Colxx>
          </Row>
        </div>
      </Colxx>
      :
      null
      }
    </Row>
  )
}

const mapStateToProps = (state) => {
  return {
    community : state.community
  }
};


export default connect(mapStateToProps)(MyNFT)