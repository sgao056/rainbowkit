import React, { useState, useEffect } from 'react';
import { Row, Button, Badge } from 'reactstrap';
import Blockies from 'react-blockies';
import { getEthPriceNow } from 'get-eth-price';

import nftVideo from 'assets/video/founderpass.mp4';
import nft1155 from 'assets/img/portal/nft1155.png';
import ethercoin from 'assets/img/portal/ethercoin.png';
import opensea from 'assets/img/portal/opensea.png';
import MintProgress from 'views/TP-pages/TP-components/MintProgress';
import { Colxx } from 'components/common/CustomBootstrap';

const tokenAddress = process.env.REACT_APP_TOKEN_ADDRESS;

function NFTTab(props) {
  const { history, ownerList } = props
  const [ currentUSD, setCurrentUSD ] = useState(0) 
  const [ NFTList, setNFTList ] = useState([])
  useEffect(async() => {
    getEthPriceNow().then(data=>{
      setCurrentUSD(Object.values(data)[0].ETH.USD)
    })
  })

  useEffect(()=>{
     setNFTList([
         {id:1, name:"NFT EICO FORGING ONE"},
         {id:2, name:"NFT EICO FORGING ONE"},
         {id:3, name:"NFT EICO FORGING ONE"},
         {id:4, name:"NFT EICO FORGING ONE"},
         {id:5, name:"NFT EICO FORGING ONE"},
         {id:6, name:"NFT EICO FORGING ONE"}
    ])
  },[])

  const handleMint = () => {
    if (localStorage.getItem('auth')) {
      // setModalToggle(true);
    } else {
      history.push('/login');
    }
  };

  const badgeStyle = {
      backgroundColor:"rgba(255, 255, 255, 0.5) !important",
      width:"56px",
      height:"20px",
      fontWeight:"bold",
      fontSize:"18px",
      color:"#000000",
      padding:0
  }
  return (
    <Row className="guest_NFT_row">
        
        {/* <Colxx
            xxs="12"
            lg="6"
            className="d-flex justify-content-center"
        >
            <Row className='w-100 guest_NFT_left_box'>  
            {
                NFTList.map((item)=>{
                    return(
                        <Colxx xxs="4" className="p-0 m-0" key={item.id}>
                            <video style={{borderRadius:"10%"}} className="w-100" loop muted controls controlsList='nodownload' playsInline preload="metadata">
                                <source src={nftVideo} type="video/mp4"/>
                                <track src="captions_en.vtt" kind="captions" srcLang="en" label="english_captions"/>
                            </video>
                            <Badge
                            style={badgeStyle}
                            color=""
                            pill
                            className="position-absolute badge-top-left"
                            >
                            sold
                            </Badge>
                            <h3 className='d-flex justify-content-center align-items-center w-100'>
                            {item.name} #{item.id}
                            </h3>
                        </Colxx>
                    )
                })
            }
            </Row>
        </Colxx> */}
        
        <Colxx
            xxs="12"
            lg="6"
            className="d-flex justify-content-center"
        >
            <div className="guest_NFT_left_box">
            <h4>EICO Contributor NFT #782</h4>
            <video
                className="guest_NFT_left_nft"
                autoPlay
                loop
                muted
                controls
                controlsList="nodownload"
                playsInline
                preload="metadata"
            >
                <source src={nftVideo} type="video/mp4" />
                <track
                src="captions_en.vtt"
                kind="captions"
                srcLang="en"
                label="english_captions"
                />
            </video>
            <Colxx xxs="12" className='d-flex justify-content-between'>
                <div>
                    <img className='m-2' src={ethercoin} alt="" />
                    <img className='m-2' src={nft1155} alt="" />
                </div>
                <div>
                    <img className='m-2' src={opensea} alt="" />
                </div>
            </Colxx>
            <div className="guest_dash" />
            <Colxx xxs="12">
                <div className='d-flex justify-content-between' style={{height:"30px"}}>
                <h5 className='m-0'>112<span className='font-weight-light'>/10,000</span></h5>
                <h5 className='m-0'>1.2 ETH</h5>
                </div>
                <div className='d-flex justify-content-between align-items-end' style={{height:"30px"}}>
                <h5 className='font-weight-light m-0'>Available</h5>
                <h5 className='font-weight-light m-0'>{(currentUSD * parseFloat(1.2)).toFixed(2)} USD</h5>
                </div>
            </Colxx>
            <div className="guest_dash" />
            <Colxx
                xxs="12"
                className="d-flex justify-content-between mt-4"
            >
                <div className='h-100'>
                <h5 className='mb-0 d-flex align-items-start' style={{textDecoration:"underline", height:"30px"}}>                    
                    Contract Details
                </h5>
                <h5 className='mb-0 font-weight-light d-flex align-items-end' style={{height:"30px"}}>
                    <span>{tokenAddress.substring(0, 4)}</span>
                    <span>...{tokenAddress.slice(-4)}</span>
                </h5>
                </div>
                <div
                className="guest_NFT_right_claim"
                style={{ width: '50%', minWidth: '150px' }}
                >
                <Button
                    className="guest_NFT_right_button"
                    onClick={handleMint}
                >
                    <h2 className="m-0">Mint</h2>
                </Button>
                </div>
            </Colxx>
            </div>
        </Colxx>
        <Colxx
            xxs="12"
            lg="6"
            className="d-flex justify-content-center"
        >
            <div className="guest_NFT_right_box">
            <MintProgress completed={100} day={5} hour={10} minute={60}/>
            <h5>Description:</h5>
            <div className="guest_dash" />
            <div className="d-flex">
                <div className="d-flex">
                <h6 className="guest_NFT_right_tag">NFT</h6>
                <div>
                    <div>
                    <p>
                        EICO 18th Anniversary Contributor Medal of Honor. This NFT Medal of Honor is awarded to every partner who used to work in EICO. The design value and brand influence created by EICO in the past 18 years cannot do without the contribution of every EICO person.                            
                    </p>
                    </div>
                    <div>
                    <p>
                        In 2004, EICO Design Studio was established in Beijing; in 2012, EICO Xiamen Office was established; in 2014, EICO Shanghai Office was established; in 2016, EICO SPACE Space Design Office was established in Shanghai. EICO has been moving forward, serving thousands of brands and companies at home and abroad, and affecting the product experience of hundreds of millions of users. I am also very grateful to have worked side by side with you.                            
                    </p>
                    </div>
                </div>
                </div>
            </div>

            <h5 className="mt-5">Reward:</h5>
            <div className="guest_dash" />
            <div className="d-flex">
                <h6 className="guest_NFT_right_tag">NFT</h6>
                <ul>
                <li>ICO annual gift;</li>
                <li>Access to EICO offline activities;</li>
                <li>Access to EICO online sharing sessions;</li>
                <li>You can join the EICO WeChat group.</li>
                </ul>
            </div>
            <h5 className="mt-5">Rules:</h5>
            <div className="guest_dash" />
            <Row className="d-flex">
                <Colxx xxs="12">
                <ul className="guest_NFT_right_details mb-0">
                    <li>
                    Please complete the form &nbsp;
                    <a href="https://j8lkqu0xswo.typeform.com/to/gqs72Weg">
                        https://j8lkqu0xswo.typeform.com/to/gqs72Weg
                    </a>
                    &nbsp;and our colleagues will review it until 10:00 am on November 8, 2022;
                    </li>
                    <li>
                    After November 11, 2022, authorize the corresponding wallet address to log in to claim;
                    </li>
                    <li>
                    For more guidance information, please refer to the EICO Contributor NFT Guidebook
                    <a href="https://www.notion.so/EICO-Contributor-NFT-FAQ-14f1d86680dd4cab8a979f21cdba83b2">
                        &nbsp;https://www.notion.so/EICO-Contributor-NFT-FAQ-14f1d86680dd4cab8a979f21cdba83b2
                    </a>
                    .
                    </li>
                </ul>
                </Colxx>
            </Row>
            <div className="d-flex justify-content-between mt-5">
                <h5 className="d-flex justify-content-between align-items-center">
                Holder board:
                </h5>
                <h5 className="d-flex justify-content-between align-items-center font-weight-light">
                {ownerList.length} holders
                </h5>
            </div>
            <div className="guest_dash" />
            <Row>
                {ownerList.map((item) => {
                    return (
                        <Colxx
                        key={item}
                        xxs="3"
                        className="m-0 p-0 guest_NFT_holders_cell"
                        >
                        <Blockies
                            seed={item}
                            size={10}
                            scale={10}
                            color="#dfe"
                            bgColor="#abf"
                            spotColor="#abc"
                            className="m-2 guest_NFT_holders_blockie"
                        />
                        <p className="m-0 p-0">
                            <span>{item.substring(0, 4)}</span>
                            <span>...{item.slice(-4)}</span>
                        </p>
                        </Colxx>
                    );
                    })}
            </Row>
            </div>
        </Colxx>
    </Row>
  )
}

export default NFTTab