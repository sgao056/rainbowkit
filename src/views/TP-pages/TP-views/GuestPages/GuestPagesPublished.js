import React, { useState, useEffect } from 'react';
import { Login, Logout } from 'redux/actions';
import { connect } from 'react-redux';
import linkto from 'assets/img/icons/Link.png';
import { Badge, Row, Card, Button, TabContent, TabPane } from 'reactstrap';
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
import useVerifyMetadata from '../../TP-helpers/useVerifyMetadata';

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
      setBlogs(newArray);
    })
    .catch((err)=>{
      alert("Fail to fetch data from database!")
    })

    await alchemy.nft.getOwnersForContract(tokenAddress)
    .then(
      res=>{
        console.log(res)
        setOwnerList(res && res.owners.length > 0 ? res.owners:[])
      }
    );
  }, []);

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
            alert('2022年11月11日成功领取NFT后，解锁查看本页面全部内容!');
          }
        });
    } else {
      alert('2022年11月11日成功领取NFT后，解锁查看本页面全部内容!');
    }
  };

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
                {blogs
                  ? blogs.map((item) => {
                      return (
                        <>
                          <div
                            key={item.id}
                            style={{ flexDirection: 'column' }}
                            className="w-100 d-flex justify-content-center align-items-between blog_item_box ql-editor mt-0 pb-5"
                          >
                            <Row xxs="11" className="ml-0 mr-0 p-0">
                              <Colxx xxs="12" style={{ flexDirection: 'row' }}>
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
                              </Colxx>
                            </Row>
                          </div>
                        </>
                      );
                    })
                  : null}
              </Colxx>
              <Colxx xxs="12" lg="6" className="pl-lg-5 w-100">
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
                              EICO18周年贡献者誉勋章。此NFT荣誉勋章颁发给每一位曾经在EICO工作的伙伴，18年间EICO所创造的设计价值与品牌影响力，少不了每一位EICO人的贡献。
                            </p>
                          </div>
                          <div>
                            <p>
                              2004年，EICO Design
                              Studio在北京成立；2012年，EICO厦门办公室成立；2014年，EICO上海办公室成立；2016年，EICO
                              SPACE空间设计办公室在上海成立。EICO一路向前，服务了上千家海内外品牌和公司，影响了“数亿级”用户产品体验，也很感激有幸与各位并肩努力过。
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
                        <li>EICO年度礼品；</li>
                        <li>可访问EICO线下活动；</li>
                        <li>可访问EICO线上分享会；</li>
                        <li>可加入EICO微信群。</li>
                      </ul>
                    </div>

                    <div className="guest_dash" />
                    <Row className="d-flex">
                      <Colxx xxs="12">
                        <ul className="guest_NFT_right_details mb-0">
                          <li>
                            请提交您的信息到表单
                            <a href="https://j8lkqu0xswo.typeform.com/to/gqs72Weg">
                              https://j8lkqu0xswo.typeform.com/to/gqs72Weg
                            </a>
                            ，我们会有同事进行审核，截止到2022年11月8日上午10:00；
                          </li>
                          <li>
                            2022年11月11日后，授权相应钱包地址登录即可领取
                          </li>
                          <li>
                            更多指引信息请查看《EICO Contributor NFT 指引手册
                            <a href="https://www.notion.so/EICO-Contributor-NFT-FAQ-14f1d86680dd4cab8a979f21cdba83b2">
                              https://www.notion.so/EICO-Contributor-NFT-FAQ-14f1d86680dd4cab8a979f21cdba83b2
                            </a>
                            。
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
                <p className="m-0 p-0">EICO是数字化策略与产品专家。</p>
                <p className="m-0 p-0">
                  我们围绕数字产品与空间，发掘业务的差异化价值，从而创造品牌的创新机遇。我们善于深入业务，利用丰富的行业通理产品经验打造落地产品。
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
