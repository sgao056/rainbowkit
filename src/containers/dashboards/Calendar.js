import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import CalendarToolbar from 'components/CalendarToolbar';
import { getDirection } from 'helpers/Utils';

const localizer = momentLocalizer(moment);

const CalendarCard = (props) => {
  const attr = props
  const eventsData = [
    {
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD")
    },
    {
      startDate: moment()
        .add(attr.event1, "days")
        .format("YYYY-MM-DD"),
      endDate: moment()
        .add(attr.event1, "days")
        .format("YYYY-MM-DD")
    },
    {
      startDate: moment()
        .add(attr.event2, "days")
        .format("YYYY-MM-DD"),
      endDate: moment()
        .add(attr.event2, "days")
        .format("YYYY-MM-DD")
    }
  ];
  return (
    <Card>
      <CardBody>
        <Calendar
          localizer={localizer}
          style={{ minHeight: '300px' }}
          events={eventsData}
          rtl={getDirection().isRtl}
          views={['month']}
          components={{
            toolbar: CalendarToolbar,
            month: {
              dateHeader: ({ date, label }) => {
                const highlightDate =
                  eventsData.indexOf(
                    eventsData.find(event =>
                      moment(date).isBetween(
                      moment(event.startDate),
                      moment(event.endDate),
                      null,
                      "[]"
                    )
                  )   
                )
                return (
                  <h6 
                  className='w-100 h-100 d-flex justify-content-center align-items-center pl-md-2 pr-md-2 pl-lg-0 pr-lg-0' 
                  style={(()=>{
                    switch(highlightDate){
                      case 0: return {border:"2px solid"}; 
                      case -1: return null; 
                      default: return {backgroundColor:"gray"}; 
                    } 
                  })()}
                  >
                    {label}
                  </h6>
                );
              }
            }
          }}
        />
      </CardBody>
    </Card>
  );
};
export default CalendarCard;
