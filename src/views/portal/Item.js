import React from 'react'

import {
    Button,
    Row,
    Card,
    Badge,
    CardBody,
    CardImg,
    CardText
  } from 'reactstrap';

import { NavLink } from 'react-router-dom';

import { Colxx } from 'components/common/CustomBootstrap';

function Item(props) {
  const item = props
  const attr = item.item
  return (
      <Colxx xxs="12" className="portal_items mt-4">
        <Card className="mb-3 portal_item_card">
            <Row>
                <Colxx xxs="12">
                    <h1 className="ml-2 pb-0 mb-0 portal_item_title">
                    {attr.title} 
                    </h1>   
                </Colxx>
            </Row>
            <Row className="mt-3  mb-3">
                <Colxx xxs="12" md="5">
                    <Card className="ml-4 mr-4 portal_item_figcard">
                        <div className="position-relative">
                            <CardImg
                            top
                            src={attr.image}
                            alt="Card image cap"
                            />
                            <Badge
                            color="primary"
                            pill
                            className="position-absolute badge-top-left"
                            >
                            NEW
                            </Badge>
                            <Badge
                            color="secondary"
                            pill
                            className="position-absolute badge-top-left-2"
                            >
                            TRENDING
                            </Badge>
                        </div>
                        <CardBody className='portal_item_info'>
                            <CardText className="d-flex align-items-center justify-content-center mb-0 font-weight-light">
                                <div className='mr-2'>
                                    <b className="font-weight-bold">{attr.stock}</b>/1000
                                </div>
                                <div>
                                    <b className="font-weight-bold">{attr.price}</b>
                                </div>
                                &nbsp;Ξ   
                            </CardText>
                        </CardBody>
                    </Card>
                </Colxx>
                <Colxx xxs="12" md="7" className="pl-2 d-flex flex-grow-1 min-width-zero">
                    <div className="d-flex flex-column justify-content-between pl-5 pr-5 pt-5 pb-2" style={{width:"100%"}}>
                        <div>
                            <NavLink to="#" location={{}} className="w-40 w-sm-100">
                            <p className="list-item-heading mb-2">
                                Reward:
                            </p>
                            </NavLink>
                                {attr.description.map((text)=>{
                                    return  <li key={text} className="mb-2 text-muted text-medium w-sm-100">{text}</li>
                                })}
                        </div>
                        <div className="d-flex align-item-center justify-content-center justify-content-md-end mt-2">
                            <Button
                             onClick={item.handleMint}
                             className="portal_item_mint" color="primary">
                                Mint
                            </Button>
                        </div>
                    </div>
                </Colxx>
            </Row>
        </Card>
      </Colxx>
  )
}

export default Item