import React, { useState, useEffect } from 'react';
import { Row, Badge, Button, Modal, Card } from 'reactstrap';
import logo from 'assets/img/portal/eicoLogo.jpg';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import 'quill/dist/quill.snow.css';
import { Colxx } from 'components/common/CustomBootstrap';
import { timeDiff, timeSequence } from 'views/TP-pages/TP-helpers/useTimeStamp';
import QuillEditor from './QuillEditor';
import '../modal.scss';

const Portal = () => {
  const [blogs, setBlogs] = useState();
  const [modalOpen, setModalOpen] = useState({ data: null, open: false });

  useEffect(async () => {
    await fetch('http://localhost:8080/post/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem('token')).token
        }`,
      },
      body: JSON.stringify({
        text: '',
        created: '',
        delta: '',
        drafted: true,
        pined: false,
        viewed: 0,
      }),
    }).then((res) => {
      if (res.status === 403) {
        alert('登录超时，请重试');
      }
    });

    fetch('http://localhost:8080/post/', {
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
                pined: item.pined,
                viewed: item.viewed,
                drafted: item.drafted,
              });
            }
          } else {
            localStorage.setItem('blogId', item.id);
          }
        });
        pinedArray = timeSequence(pinedArray);
        unpinedArray = timeSequence(unpinedArray);
        const newArray = pinedArray.concat(unpinedArray);
        newArray.forEach(cell=>{cell.dropdown = false})
        setBlogs(newArray);
      });
  }, []);

  useEffect(()=>{
    console.log(blogs)
  },[blogs])

  const beforeunload = async () => {
    await fetch('http://localhost:8080/post/draft', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem('token')).token
        }`,
      },
    });
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('beforeunload', beforeunload);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', beforeunload);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?') === true) {
      fetch(`http://localhost:8080/post/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('token')).token
          }`,
        },
      })
        .then((res) => res.json())
        .then(() => {
          fetch(`http://localhost:8080/files/blog/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem('token')).token
              }`,
            },
          })
            .then((res) => res.json())
            .then((res) => {
              alert('Blog has been deleted successfully!');
              window.location.reload();
            });
        });
    }
  };

  return (
    <>
      <div className="mt-4">
        {!modalOpen.open ? <QuillEditor /> : null}

        <Modal isOpen={modalOpen.open}>
          <Card className="p-5">
            <QuillEditor data={modalOpen.data} />
            <div className="d-flex justify-content-center">
              <Button
                onClick={() => {
                  setModalOpen({ data: null, open: false });
                }}
                style={{ width: '150px' }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </Modal>

        <Row className="d-flex justify-content-center">
          <Colxx xxs="11" className="m-0">
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
                          <Colxx xxs="10" style={{ flexDirection: 'row' }}>
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
                            {
                            item.cover 
                            ? 
                            (
                              <Card
                                // onClick={()=>handleView(item.id)}
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
                                  className="w-100 p-0 mr-0 ml-0"
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
                                    {item.text.length >= 50 && !item.dropdown
                                        ? `${item.text.substring(0, 50)}...`
                                        : item.text}
                                    </h1>
                                    <div className='mt-3 rtl'>
                                      <Button onClick={()=>{
                                        const clickArray = []
                                        blogs.forEach((cell)=>{
                                          if(cell.id === item.id){
                                            cell.dropdown = !cell.dropdown
                                            clickArray.push(cell)
                                          }
                                          else{
                                            clickArray.push(cell)
                                          }
                                        })
                                        setBlogs(clickArray)
                                      }}>
                                        {item.dropdown ? "close":"open"}
                                      </Button>
                                    </div>
                                  </Colxx>
                                </Row>
                              </Card>
                            ) 
                            : 
                            (
                              <Card
                                style={{
                                  background: 'transparent',
                                  width: '600px',
                                  flexDirection: 'row',
                                  marginTop: '30px',
                                }}
                                className="d-flex w-100"
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
                                      {item.text.length >= 50 && !item.dropdown
                                        ? `${item.text.substring(0, 50)}...`
                                        : item.text}
                                    </h1>
                                    <div className='mt-3 rtl'>
                                    <Button onClick={()=>{
                                        const clickArray = []
                                        blogs.forEach((cell)=>{
                                          if(cell.id === item.id){
                                            cell.dropdown = !cell.dropdown
                                            clickArray.push(cell)
                                          }
                                          else{
                                            clickArray.push(cell)
                                          }
                                        })
                                        setBlogs(clickArray)
                                      }}>
                                        {item.dropdown ? "close":"open"}
                                      </Button>
                                    </div>
                                  </Colxx>
                                </Row>
                              </Card>
                            )}
                          </Colxx>
                          <Colxx
                            xxs="2"
                            style={{ flexDirection: 'column' }}
                            className="m-0 p-0 d-flex justify-content-start"
                          >
                            <Button
                              style={{
                                height: '40px',
                                width: '100px',
                                padding: '10px',
                                margin: '10px',
                                position: 'relative',
                                zIndex: '90',
                              }}
                              className="d-flex justify-content-center align-items-center"
                              onClick={() => {
                                setModalOpen({
                                  data: item,
                                  open: true,
                                });
                              }}
                            >
                              <i className="simple-icon-pencil" />
                              &nbsp; Edit
                            </Button>
                            <Button
                              style={{
                                height: '40px',
                                width: '100px',
                                padding: '10px',
                                margin: '10px',
                                position: 'relative',
                                zIndex: '90',
                              }}
                              className="d-flex justify-content-center align-items-center"
                              onClick={() => {
                                handleDelete(item.id);
                              }}
                            >
                              <i className="simple-icon-pencil" />
                              &nbsp; Delete
                            </Button>
                          </Colxx>
                        </Row>
                      </div>
                    </>
                  );
                })
              : null}
          </Colxx>
        </Row>
      </div>
    </>
  );
};
export default Portal;
