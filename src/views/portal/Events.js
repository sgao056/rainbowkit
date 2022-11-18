import React from 'react'
import {
    Row,
    Button,
    Card
  } 
  from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {FaEthereum} from 'react-icons/fa'
import Calendar from '../../containers/dashboards/Calendar';

function Events() {
    const dataArray = [
        {
            id:1,
            period:14,
            icon:"iconsminds-umbrella-2",
            title:"Airdrop Event Example",
            price:0.1,
            user: "White List Holder",
            link:"pass.forging.one/mint",
            time:{
                start:"Sat, Jun 25, 11:00 AM (PST)",
                end:"Sun, Jun 26, 11:00 AM",
                last:"24 Hours"
            }
        },
        {
            id:2,
            period:33,
            icon:"iconsminds-flash-2",
            title:"Activations & contests funding Voting",
            price:0,
            user: "All Token Holders",
            link:"https://snapshot.org/#/forging/ proposal/0x0c30e23d13ef885...",
            time:{
                start:"Tue, Jun 28, 16:00 AM (PST)",
                end:"Fri, Jul 1, 16:00 PM",
                last:"24hour"
            }
        }
    ] 
    return (
    <div className='container portal_events'>
        <Row>
            <Colxx xxs="12" md="6" lg="7">
                <Button className='w-100 mt-4'>
                    <h6 className='pb-0 mb-0'>
                        <i className='simple-icon-plus mr-2'/>
                        Add a Event
                    </h6>
                </Button>
            </Colxx>
            <Colxx xxs="12" md="6" lg="5">
                <Button className='w-100 mt-4'>
                    <h6 className='pb-0 mb-0'>
                        <i className='simple-icon-user mr-2'/>
                        Manage Subscribers(386)
                    </h6>
                </Button>
            </Colxx>
        </Row>
        <Row>
            <Colxx xxs="12" md="6" lg="7" className="mt-5 portal_events_list">
                <Timeline style={{marginLeft:"-90%"}}>
                {dataArray.map((item)=>{
                    return( 
                        <TimelineItem key={item.id}>
                            <TimelineSeparator>
                            <TimelineDot color="success"/>
                            <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent className='pr-0'>
                                <Row>
                                    <Colxx xxs="6" lg="8" className="d-flex align-items-center"> 
                                        <h6 className='font-weight-bold'>
                                            {item.period} days to go
                                        </h6>
                                    </Colxx>
                                    <Colxx xxs="6" lg="4">
                                        <Button className='mb-3 w-100 p-1' style={{borderRadius:"5px"}}>
                                            <span className='mr-2'>
                                                <i className='iconsminds-file-edit'/>
                                            </span>
                                            <span>Edit Event</span>
                                        </Button>
                                    </Colxx>
                                </Row>
                                <Card className='pt-5 pb-5'>
                                    <Row className='m-0'>
                                        <Colxx xxs="2"  className="p-0 d-flex justify-content-center">
                                            <i className={`${item.icon} portal_events_icon_left`}/>
                                        </Colxx>
                                        <Colxx xxs="10">
                                            <h3 className='font-weight-bold mb-3'>{item.title}</h3>
                                            
                                            { 
                                                item.price === 0 
                                                ? 
                                                null 
                                                :
                                                <p className='mb-2 font-weight-bold'>
                                                    <Row>
                                                        <Colxx xxs="12" sm="1"><FaEthereum className='mb-1 mr-2'/></Colxx>
                                                        <Colxx xxs="12" sm="11">{item.price}Ξ</Colxx>
                                                    </Row>
                                                </p>
                                            }
                                            <p className='mb-2 font-weight-bold'>
                                                <Row>
                                                    <Colxx xxs="12" sm="1"><i className='simple-icon-user mr-2'/></Colxx>
                                                    <Colxx xxs="12" sm="11">
                                                        {item.user}
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/2048px-Flat_tick_icon.svg.png" alt="" style={{height:"10px", width:"10px", borderRadius:"5px"}} className="ml-1"/>
                                                    </Colxx>
                                                </Row>
                                            </p>
                                            <p className='mb-2'>
                                                <Row>
                                                    <Colxx xxs="12" sm="1"><i className='simple-icon-clock mr-2'/></Colxx>
                                                    <Colxx xxs="12" sm="11">
                                                        <div> Start: <span className='font-weight-bold'>{item.time.start}</span></div>
                                                        <div> End: <span className='font-weight-bold'>{item.time.end}</span></div>
                                                        <div> Last: <span className='font-weight-bold'>{item.time.last}</span></div>
                                                    </Colxx>
                                                </Row>
                                            </p>
                                            <p className='mb-2'>
                                                <Row>
                                                    <Colxx xxs="12" sm="1"><i className="simple-icon-link mr-2"/></Colxx>
                                                    <Colxx xxs="12" sm="11">{item.link}</Colxx>
                                                </Row>
                                            </p>
                                        </Colxx>
                                    </Row>
                                </Card>
                            </TimelineContent>
                        </TimelineItem>
                    )
                })}
                </Timeline>
            </Colxx>
            <Colxx xxs="12" md="6" lg="5" className="mt-5">
                <Calendar event1={dataArray[0].period} event2={dataArray[1].period}/>
            </Colxx>
        </Row>
    </div>
  )
}

export default Events