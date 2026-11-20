const Meetings = require('../models/Meetings')

const getMeetings = async (req,res) => {
    try {
        
        const meetings = await Meetings.findAll();

        if(meetings.length === 0){
             return res.status(404).send("meeting not found");
        }

        return res.status(200).json(meetings);

    } catch (error) {
        res.status(500).send("Error while fetching ",error.message);
    }
}

const addMeeting = async (req,res) => {
    console.log("received data: ",req.body)

    try {
        const meeting = await Meetings.create({
            ...req.body
        });

        if(!meeting){
            return res.status(404).send("meeting not added");
        }

        return res.status(200).json(meeting);

    } catch (error) {
        res.status(500).send("Error while inserting ",error.message);
    }
}

const deleteMeeting = async (req,res) => {
    try {
        
        const {id} = req.params;

        const meeting = await Meetings.destroy({
            where : {
                id : id
            }
        });

        if(!meeting){
            return res.status(404).send("meeting not found");
        }

        return res.status(200).json(meeting);


    } catch (error) {
        res.status(500).send("Error while deleting ",error.message);
    }
}

const updateMeeting = async(req,res) => {
    try {
        
        const {id} = req.params;

        const {name, email, time} = req.body;

        const meeting = await Meetings.findByPk(id);

        if(!meeting){
            return res.status(404).send("meeting not found");
        }

        meeting.name = name;
        meeting.email = email;
        meeting.time = time;

        meeting.save();

        return res.status(200).json(meeting);


    } catch (error) {
        res.status(500).send("Error while deleting ",error.message);
    }
}

module.exports = {
    addMeeting,
    getMeetings,
    deleteMeeting,
    updateMeeting
}