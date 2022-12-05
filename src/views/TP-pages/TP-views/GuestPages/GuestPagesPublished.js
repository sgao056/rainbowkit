import React, { useState, useEffect } from 'react';
import { Login, Logout } from 'redux/actions';
import { connect } from 'react-redux';
import linkto from 'assets/img/icons/Link.png';
import { Badge, Row, Card, Button, TabContent, TabPane, Input } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { Colxx } from 'components/common/CustomBootstrap';
import Blockies from 'react-blockies';
import { MdArrowForwardIos } from 'react-icons/md';
import nftVideo from 'assets/video/founderpass.mp4';
import logo from 'assets/img/portal/eicoLogo.jpg';
import LoginModal from 'views/TP-pages/TP-components/LoginModal';
import { useAccount } from 'wagmi';
import { Network, Alchemy } from "alchemy-sdk";
import GuestHeader from 'views/TP-pages/TP-components/CommonHeader';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { timeDiff, timeSequence } from 'views/TP-pages/TP-helpers/useTimeStamp';
import '../../TP-scss/GuestPage.scss';
import '../../TP-scss/login.scss';
import { externalLinks } from '../../TP-constants/guestPage';

const tokenAddress = process.env.REACT_APP_TOKEN_ADDRESS;
const alchemyApikey = process.env.REACT_APP_ALCHEMY_APIKEY;
const fetchPrefix = process.env.REACT_APP_DEP_FETCH_PREFIX

const settings = {
  apiKey: alchemyApikey,
  network: Network.ETH_MAINNET
};

const alchemy = new Alchemy(settings);

const GuestPages = ({ wallet, setWallet, clearWallet, ...props }) => {
  const [activeTab, setActiveTab] = useState('NFT');
  const [ownerList, setOwnerList] = useState([]);
  const [dropdownBasicOpen, setDropdownBasicOpen] = useState(false);
  const [postAuth, setPostAuth] = useState(false);
  const [modalToggle, setModalToggle] = useState(false);
  const [blogs, setBlogs] = useState();
  const { isConnected, address } = useAccount();

  useEffect(async() => {
    // insert blogs
    fetch(`${fetchPrefix}/post/`, {
      method: 'GET',
    })
    .then((response) => response.json())
    .then(async (response) => {
      let unpinedArray = [];
      let pinedArray = [];
      await response.forEach((item) => {
        if (item.drafted !== true) {
          const cfg = {};
          const converter = new QuillDeltaToHtmlConverter(
            JSON.parse(item.delta),
            cfg
          );
          const cover = JSON.parse(item.delta).find((cell) => {
            return cell.insert.image || cell.insert.video
              ? cell.insert.image || cell.insert.video
              : null;
          });
          if (item.pined) {
            pinedArray.push({
              text: item.text,
              content: converter.convert(),
              id: item.id,
              cover,
              created: item.created,
              edited: item.edited ? item.edited : null,
              delta: JSON.stringify(item.delta),
              pined: item.pined,
              viewed: item.viewed,
              drafted: item.drafted,
            });
          } else {
            unpinedArray.push({
              text: item.text,
              content: converter.convert(),
              id: item.id,
              cover,
              created: item.created,
              edited: item.edited ? item.edited : null,
              delta: JSON.stringify(item.delta),
              drafted: item.drafted,
              pined: item.pined,
              viewed: item.viewed,
            });
          }
        }
      });
      pinedArray = timeSequence(pinedArray);
      unpinedArray = timeSequence(unpinedArray);
      const newArray = pinedArray.concat(unpinedArray);
      newArray.forEach(blog=>{
        blog.newComment = ""
        fetch(`${fetchPrefix}/comments/${blog.id}`, {
          method: 'GET',
        })
        .then(res=>{
          if(!res.ok){
            alert('System error!')
            return Promise.reject();
          }
          return res.json()
        })
        .then(res=>{
          blog.comment = res
        })
      })
      setBlogs(newArray)
    })
    .catch((err)=>{
      alert("Fail to fetch data from database!")
    })

    await alchemy.nft.getOwnersForContract(tokenAddress)
    .then(
      res=>{
        setOwnerList(res && res.owners.length > 0 ? res.owners:[])
      }
    );
  },[]);

  useEffect(() => {
    if (address && isConnected && ownerList.length>0) {
        const finder = ownerList.find((item) => {
          return (            
              item.toLowerCase() === address.toLowerCase()
          )
        });
        if(finder){
          setPostAuth(true)
        }
    }
  }, [ownerList]);

  const handleClaim = () => {
    if (localStorage.getItem('auth')) {
      setModalToggle(true);
    } else {
      props.history.push('/login');
    }
  };

  const handleView = async (id) => {
    if (wallet.wallet) {
      await fetch(`${fetchPrefix}/post/${id}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((response) => {
          fetch(`${fetchPrefix}/post/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem('token')).token
              }`,
            },
            body: JSON.stringify({
              ...response,
              viewed: response.viewed + 1,
              drafted: false,
            }),
          }).then((res) => res.json());

          if (postAuth) {
            const w = window.open('about:blank');
            w.location.href = `https://eico.forging.one/#/post/${id}`;
          } else {
            alert('After successfully receiving the NFT on November 11, 2022, unlock and view the entire content of this page!');
          }
        });
    } else {
      alert('After successfully receiving the NFT on November 11, 2022, unlock and view the entire content of this page!');
    }
  };

  const handlePostComment = (item) => {
    if(window.confirm("Are you sure you want to publish this comment?")){
      fetch(`${fetchPrefix}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('token')).token
          }`,
        },
        body: JSON.stringify({
          postId: item.postId,
          creator: item.creator,
          comment: item.comment,
          createdAt: JSON.stringify(new Date)
        }),
      })
      .then((res) => {
        if(!res.ok){
          if (res.status === 403) {
            alert('Timeout! Please login again!');
            return Promise.reject();
          }
          alert('System Error!');
          return Promise.reject();
        }
        return res.json();
      })
      .then(()=>{
        alert('Comment has been published successfully!');
        window.location.reload();
      })
    }
  }

  const handleDeleteComment = (commentId) => {
    if(commentId && window.confirm("Are you sure you want to delete this comment?"))
    fetch(`${fetchPrefix}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem('token')).token
        }`,
      },
    })
    .then((res) => {
      if(!res.ok){
        alert("System problem!")
        return Promise.reject();
      }
      return res.json()
    })
    .then((res) => {
      alert('Comment has been deleted successfully!');
      window.location.reload();
    });
  }

  return (
    <>
      <GuestHeader
        dropdownBasicOpen={dropdownBasicOpen}
        setDropdownBasicOpen={setDropdownBasicOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        postAuth={postAuth}
        setPostAuth={setPostAuth}
      />
      <div className="guest_page">
        <TabContent activeTab={activeTab} className="container">
          {/* Post */}
          <TabPane tabId="Post" className="guest_post">
            <Row
              className="w-100 ml-0 mr-0"
              style={{ marginTop: window.innerWidth > 992 ? '140px' : 0 }}
            >
              <Colxx xxs="12" lg="6" className="ml-0 mr-0">
                {
                blogs
                ? 
                blogs.map((item) => {
                      return (
                        <>
                          <div
                            key={item.id}
                            style={{ flexDirection: 'column' }}
                            className="w-100 d-flex justify-content-center align-items-between blog_item_box ql-editor mt-5 mt-lg-0 pb-5"
                          >
                            <Row xxs="12" className="ml-0 mr-0 p-0">
                              <Colxx xxs="12" style={{ flexDirection: 'row' }}>
                                { /* pined, time bar */ }
                                {item.pined ? (
                                  <div
                                    className="w-100 d-flex align-items-center justify-content-between"
                                    style={{ height: '50px' }}
                                  >
                                    <Colxx xxs="1">
                                      <Badge className="pined_mark">
                                        <i className="simple-icon-pin" />
                                        &nbsp; Pined
                                      </Badge>
                                    </Colxx>
                                    <h4 style={{ color: 'gray' }}>
                                      {item.edited
                                        ? `Edited ${timeDiff(item.edited)}`
                                        : `Created ${timeDiff(item.created)}`}
                                    </h4>
                                  </div>
                                ) : (
                                  <div
                                    className="w-100 d-flex align-items-center justify-content-end"
                                    style={{ height: '50px' }}
                                  >
                                    <h4 style={{ color: 'gray' }}>
                                      {item.edited
                                        ? `Edited ${timeDiff(item.edited)}`
                                        : `Created ${timeDiff(item.created)}`}
                                    </h4>
                                  </div>
                                )}

                                { /* content */ }
                                {item.cover ? (
                                  <Card
                                    onClick={() => handleView(item.id)}
                                    style={{
                                      background: 'transparent',
                                      width: '600px',
                                      flexDirection: 'column',
                                    }}
                                    className="d-flex w-100"
                                  >
                                    {item.cover.insert.image ? (
                                      <img
                                        style={{
                                          borderRadius: '30px',
                                          width: '100%',
                                        }}
                                        src={item.cover.insert.image}
                                        alt=""
                                      />
                                    ) : null}
                                    {item.cover.insert.video &&
                                    !item.cover.insert.image ? (
                                      <video
                                        style={{
                                          borderRadius: '30px',
                                          width: '100%',
                                        }}
                                        autoPlay
                                        loop
                                        muted
                                        controls
                                        controlsList="nodownload"
                                        playsInline
                                        preload="metadata"
                                      >
                                        <source
                                          src={item.cover.insert.video}
                                          type="video/mp4"
                                        />
                                        <track
                                          src="captions_en.vtt"
                                          kind="captions"
                                          srcLang="en"
                                          label="english_captions"
                                        />
                                      </video>
                                    ) : null}
                                    <Row
                                      className="w-100 mr-0 ml-0 p-0"
                                      style={{ marginTop: '30px' }}
                                    >
                                      <Colxx xxs="2" md="1" className="p-0">
                                        <img
                                          src={logo}
                                          className="mr-4 "
                                          alt=""
                                          style={{
                                            height: '40px',
                                            width: '40px',
                                            borderRadius: '20px',
                                            position: 'relative',
                                            float: 'left',
                                            display: 'inline-block',
                                          }}
                                        />
                                      </Colxx>
                                      <Colxx
                                        xxs="10"
                                        md="11"
                                        className="p-0"
                                        style={{ whiteSpace: 'normal' }}
                                      >
                                        <h1 style={{ whiteSpace: 'inherit' }}>
                                          {item.text.length >= 50
                                            ? `${item.text.substring(0, 50)}...`
                                            : item.text}
                                        </h1>
                                      </Colxx>
                                    </Row>
                                  </Card>
                                ) : (
                                  <Card
                                    style={{
                                      background: 'transparent',
                                      width: '600px',
                                      flexDirection: 'row',
                                      marginTop: '30px',
                                    }}
                                    className="d-flex w-100"
                                    onClick={() => handleView(item.id)}
                                  >
                                    <Row className="w-100 m-0 p-0 mt-2">
                                      <Colxx xxs="2" md="1" className="p-0">
                                        <img
                                          src={logo}
                                          className="mr-4 "
                                          alt=""
                                          style={{
                                            height: '30px',
                                            width: '30px',
                                            borderRadius: '15px',
                                            position: 'relative',
                                            float: 'left',
                                            display: 'inline-block',
                                          }}
                                        />
                                      </Colxx>
                                      <Colxx
                                        xxs="10"
                                        md="11"
                                        className="p-0"
                                        style={{ whiteSpace: 'normal' }}
                                      >
                                        <h1 style={{ whiteSpace: 'inherit' }}>
                                          {item.text.length >= 50
                                            ? `${item.text.substring(0, 50)}...`
                                            : item.text}
                                        </h1>
                                      </Colxx>
                                    </Row>
                                  </Card>
                                )}

                                { /* comment */ }
                                <div  className='mt-5'>
                                  <h1 className="font-weight-bold mb-4">Comment</h1>
                                  {
                                    item && item.comment
                                    ?
                                    item.comment.map((singleComment)=>{
                                      return(
                                        <Row key={singleComment.commentId} className="pb-3 mb-3" style={{borderBottom:"1px solid #4A4A4A"}}>
                                          <Colxx xxs="1">
                                            <Blockies
                                              seed={singleComment.creator ? singleComment.creator : null}
                                              size={10}
                                              scale={10}
                                              color="#dfe"
                                              bgColor="#abf"
                                              spotColor="#abc"
                                              className="guest_post_comment_image"
                                            />
                                          </Colxx>
                                          <Colxx xxs="11" className="d-flex align-items-center">
                                            <div className="font-weight-bold">
                                                <span>{singleComment.creator ? singleComment.creator:"unknown"}</span>
                                            </div> 
                                          </Colxx>
                                          <Colxx xxs="1">
                                            {null}
                                          </Colxx>
                                          <Colxx xxs="11" >
                                            <div>{singleComment.comment}</div>
                                            <div className='w-100 d-flex justify-content-between mt-3'>
                                              <div>
                                                {
                                                wallet.wallet && wallet.wallet.toLowerCase() === singleComment.creator.toLowerCase()
                                                ?
                                                <Button className="comment_delete_button font-size-lg" onClick={()=>{handleDeleteComment(singleComment.commentId)}}>
                                                  Delete
                                                </Button>
                                                :
                                                null
                                                }
                                              </div>
                                              <div>
                                                {timeDiff(singleComment.createdAt)}
                                              </div>
                                            </div>
                                          </Colxx>
                                        </Row>
                                      )
                                    })
                                    :
                                    null
                                  }

                                  {
                                    wallet.wallet ? 
                                    <Row className='mt-3'>
                                      <Colxx xxs="1">
                                        <Blockies
                                          seed={wallet.wallet ? wallet.wallet : null}
                                          size={10}
                                          scale={10}
                                          color="#dfe"
                                          bgColor="#abf"
                                          spotColor="#abc"
                                          className="guest_post_comment_image"
                                        />
                                      </Colxx>
                                      <Colxx xxs="11" className="d-flex align-items-center">
                                        <div className="font-weight-bold">
                                            <span>{wallet.wallet ? wallet.wallet:"unknown"}</span>
                                        </div> 
                                      </Colxx>
                                      <Colxx xxs="12">
                                        <Row className="d-flex justify-content-end">
                                          <Colxx xxs="1">
                                            {null}
                                          </Colxx>
                                          <Colxx xxs="11">
                                            <Input 
                                            value={blogs.find(blog=>{return(blog.id === item.id)}).newComment}
                                            onChange={(e)=>{
                                              const newArray = [...blogs]
                                              const index = newArray.indexOf(item)
                                              newArray.splice(index,1,{
                                                ...newArray[index],
                                                newComment:e.target.value,
                                              })
                                              setBlogs(newArray)
                                            }}
                                            className="mt-3 mb-3"
                                            type="textarea"
                                            placeholder="Please write your comment here..."/>
                                          </Colxx>
                                        </Row>
                                      </Colxx>
                                      <Colxx xxs="12" className="rtl">
                                        <Button 
                                        onClick={()=>{handlePostComment({
                                          postId:item.id,
                                          creator:wallet.wallet,
                                          comment:blogs.find(blog=>{return(blog.id === item.id)}).newComment
                                        })}}
                                        className='mt-3 pined_mark d-flex justify-content-center align-items-center font-weight-bold'>
                                          Post
                                        </Button>
                                      </Colxx>
                                    </Row>
                                    : null
                                  }
                                </div>
                              </Colxx>
                            </Row>
                          </div>
                        </>
                      );
                    })
                  : null}
              </Colxx>
              <Colxx xxs="12" lg="6" className="pl-lg-5 w-100 guest_post_right">
                {wallet.wallet ? (
                  <div className="mt-5 guest_post_login_bar d-flex align-items-center">
                    {window.innerWidth >= 992 ? (
                      <Blockies
                        seed={wallet.wallet ? wallet.wallet : null}
                        size={10}
                        scale={10}
                        color="#dfe"
                        bgColor="#abf"
                        spotColor="#abc"
                        className="guest_post_login_image"
                      />
                    ) : (
                      <Blockies
                        seed={wallet.wallet ? wallet.wallet : null}
                        size={10}
                        scale={10}
                        color="#dfe"
                        bgColor="#abf"
                        spotColor="#abc"
                        className="guest_post_login_image"
                      />
                    )}
                    <div className="d-flex align-items-start justify-content-center guest_post_login_info">
                      {wallet.email ? (
                        <div className="font-weight-bold">
                          <span>{wallet.email.substring(0, 8)}</span>
                          <span>...{wallet.email.slice(-3)}</span>
                        </div>
                      ) : (
                        <div className="font-weight-bold">No email!</div>
                      )}
                      {wallet.wallet ? (
                        <div>
                          <span>{wallet.wallet.substring(0, 4)}</span>
                          <span>...{wallet.wallet.slice(-4)}</span>
                        </div>
                      ) : null}
                    </div>
                    <h6 className="d-flex align-items-center justify-content-center guest_post_login_inform">
                      {!postAuth ? (
                        <>You do not own this NFT.</>
                      ) : (
                        <>You own this NFT!</>
                      )}
                    </h6>
                  </div>
                ) : null}
                <Card className="d-flex justify-content-center align-items-center guest_post_card mt-5">
                  <Button
                    className="guest_post_button w-100 h-100 p-0"
                    onClick={() => setActiveTab('NFT')}
                  >
                    <img
                      src="assets/img/guestPage/premium.png"
                      alt=""
                      className="w-100"
                      style={{ borderRadius: '10px 10px 0 0' }}
                    />
                    <Row className="w-100 p-3 m-0">
                      <Colxx xxs="11" className="m-0 p-0">
                        <h6 className="d-flex justify-content-start font-weight-light">
                          Unlock premium content
                        </h6>
                        <h6 className="d-flex justify-content-start font-weight-light">
                          by&nbsp;
                          <span className="font-weight-bold">
                            EICO Contributor NFT
                          </span>
                        </h6>
                      </Colxx>
                      <Colxx
                        xxs="1"
                        className="m-0 p-0 d-flex justify-content-center align-items-center"
                      >
                        <MdArrowForwardIos className="guest_post_card_icon" />
                      </Colxx>
                    </Row>
                  </Button>
                </Card>
              </Colxx>
            </Row>
          </TabPane>

          {/* NFT */}
          <TabPane tabId="NFT" className="guest_NFT">
              <Row className=" guest_NFT_row">
                <Colxx
                  xxs="12"
                  lg="6"
                  className="guest_NFT_left_box d-flex justify-content-center"
                >
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
                </Colxx>
                <Colxx
                  xxs="12"
                  lg="6"
                  className="d-flex justify-content-center justify-content-lg-start"
                >
                  <div className="guest_NFT_right_box">
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
                      <Colxx
                        xxs="12"
                        className="d-flex justify-content-end mt-4"
                      >
                        <div
                          className="guest_NFT_right_claim"
                          style={{ width: '50%', minWidth: '150px' }}
                        >
                          <Button
                            className="guest_NFT_right_button"
                            onClick={handleClaim}
                          >
                            <h2 className="m-0">Claim</h2>
                          </Button>
                        </div>
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
          </TabPane>

          {/* About */}
          <TabPane tabId="About" className="guest_about">
            <Row className="p-0 m-0">
              <Colxx
                xxs="2"
                lg="2"
                className="d-flex justify-content-center pt-5"
              >
                <img src={logo} alt="logo" className="guest_about_logo" />
              </Colxx>
              <Colxx xxs="10" lg="4" className="pt-5">
                <p className="m-0 p-0">EICO is an expert in digital strategy and products.</p>
                <p className="m-0 p-0">
                We explore the differentiated value of business around digital products and space, so as to create brand innovation opportunities. We are good at in-depth business, and use our rich experience in industry generalization products to create landing products.
                </p>
              </Colxx>
            </Row>
            <Row className="p-0 m-0">
              <Colxx
                xxs="0"
                lg="2"
                className="d-flex justify-content-center pt-5"
              />
              <Colxx xxs="12" lg="4" className="pt-5">
                {externalLinks.map((item) => {
                  return (
                    <Row key={item.describe} className="guest_about_item">
                      <Colxx
                        xxs="2"
                        className="d-flex align-items-center justify-content-center"
                      >
                        <img
                          className="guest_about_item_image"
                          src={item.src}
                          alt=""
                        />
                      </Colxx>
                      <Colxx
                        xxs="10"
                        className="guest_about_item_linkbox h-100 w-100 d-flex align-items-center justify-content-center"
                        onClick={() => {
                          const w = window.open('about:blank');
                          w.location.href = item.link;
                        }}
                      >
                        <h3 className="d-flex w-100 justify-content-between align-items-center mb-0 pl-3 pr-3 guest_about_item_description">
                          {item.describe}
                          <img
                            className="guest_about_item_link"
                            src={linkto}
                            alt=""
                          />
                        </h3>
                      </Colxx>
                    </Row>
                  );
                })}
              </Colxx>
            </Row>
          </TabPane>
        </TabContent>
        <LoginModal modalToggle={modalToggle} setModalToggle={setModalToggle} />
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setWallet: (object) => {
      dispatch(Login(object));
    },
    clearWallet: () => {
      dispatch(Logout());
    },
  };
};

const mapStateToProps = (state) => {
  return {
    wallet: state.auth,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GuestPages));
