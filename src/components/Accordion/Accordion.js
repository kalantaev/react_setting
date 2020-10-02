import React from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const AccordionComponent = props => {

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${props.id}a-content`}
                id={`panel${props.id}a-header`}
            >
                <Typography >{props.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    {props.children}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
};

export default AccordionComponent;